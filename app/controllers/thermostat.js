/**
 * @overview This controller renders and handles thermostats.
 * @author Martin Vach
 */

/**
 * Thermostat root controller
 * @class ThermostatController
 *
 */
appController.controller('ThermostatController', function($scope, $filter, $timeout,$interval,dataService, cfg,_) {
    $scope.thermostats = {
        ids: [],
        all: [],
        interval: null,
        show: false,
        rangeSlider: [],
        mChangeMode: []
    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.thermostats.interval);
    });

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            if(_.isEmpty($scope.thermostats.all)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            $scope.thermostats.show = true;
            $scope.refreshZwaveData(ZWaveAPIData);
        }, function(error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                var update = false;
                angular.forEach(response.data.update, function(v, k) {
                    // Get node ID from response
                    var findId = k.split('.')[1];
                    // Check if node ID is in the available devices
                    if($scope.thermostats.ids.indexOf(findId) > -1){
                        update = true;
                        //console.log('Updating nodeId: ',findId);
                        return;
                    }
                });
                // Update found - updating available devices
                if(update){
                    setData(response.data.joined);
                }
            }, function(error) {});
        };
        $scope.thermostats.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Update thermostat mode
     * @param {string} url
     * @param {string} mode
     */
    $scope.updateThermostatMode = function(url,mode) {
        if (!mode) {
            return;
        }
        $scope.toggleRowSpinner(url);
        url = url + '.Set(' + mode + ')';
        updateThermostat(url);
    };

    /**
     * Update thermostat temperature on click
     * @param {string} url
     * @param {int}  index
     * @param {string}  type
     */
    $scope.updateThermostatTempClick = function(v, index, type) {
        var url = v.urlChangeTemperature;
        var step = v.range.step;
        $scope.toggleRowSpinner(url);
        var val = $scope.thermostats.rangeSlider[index];
        var min = parseInt( v.range.min,1);
        var max = parseInt(v.range.max, 1);
        var count = (type === '-' ? val - step: val + step);
        if (count < min) {
            count = min;
        }
        if (count > max) {
            count = max;
        }
        $scope.thermostats.rangeSlider[index] = count;
        url += '.Set('+v.curThermMode+',' + count + ')';
        updateThermostat(url);
    };

    /**
     * Calls function when slider handle is grabbed
     */
    $scope.sliderOnHandleDown = function() {
        $interval.cancel($scope.thermostats.interval);
    };


    /**
     * Calls function when slider handle is released
     * @param {string} cmd
     * @param {int} index
     */
    $scope.sliderOnHandleUp = function(v, index) {
        var url = v.urlChangeTemperature;
        var step = v.range.step;
        $scope.toggleRowSpinner(url);
        $scope.refreshZwaveData();
        var count = parseFloat($scope.thermostats.rangeSlider[index]);
        var min = parseInt( v.range.min,1);
        var max = parseInt(v.range.max, 1);
        if (count < min) {
            count = min;
        }
        if (count > max) {
            count = max;
        }
        //count =  Math.round(count*2)/2;
        if((step % 1) === 0){//Step is a whole number
            count = Math.round(count);
        }else{//Step has a decimal place
            // Dec Number is > 5 - Rounding up
            // E.g.: 22.7 to 23
            if((count % 1) > step){
                count = Math.round(count);
            }
            // Dec Number is =< 5 - Rounding down + step
            // E.g.: 22.2 to 22.5
            else if((count % 1) > 0.0 && (count % 1) < 0.6){
                count = (Math.round(count) +step);
            }
        }

        $scope.thermostats.rangeSlider[index] = count;
        url += '.Set('+v.curThermMode+',' + count + ')';
        updateThermostat(url);
    };

    /// --- Private functions --- ///

    /**
     * Update thermostat
     * @param {string} url
     */
    function updateThermostat(url) {
        dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + url);
        });
    };

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }

            // Loop throught instances
            var cnt = 1;
            angular.forEach(node.instances, function(instance, instanceId) {
                // we skip devices without ThermostatSetPint AND ThermostatMode CC
                if (!(0x43 in instance.commandClasses) && !(0x40 in instance.commandClasses)) {
                    return;
                }

                var ccId;
                var curThermMode = getCurrentThermostatMode(instance);
                var level = null;
                var hasExt = false;
                var updateTime;
                var invalidateTime;
                var modeType = null;
                var modeList = {};
                //var urlChangeTemperature = false;
                var scale = null;

                var hasThermostatMode = 0x40 in instance.commandClasses;
                var hasThermostatSetpoint = 0x43 in instance.commandClasses;
                var isThermostatMode = false;
                var isThermostatSetpoint = false;
                //var hasThermostatSetback = 0x47 in instance.commandClasses;
                //var hasClimateControlSchedule = 0x46 in instance.commandClasses;
                //var curThermModeName = '';

                if (!hasThermostatSetpoint && !hasThermostatMode) { // to include more Thermostat* CCs
                    return; // we don't want devices without ThermostatSetpoint AND ThermostatMode CCs
                }
                if (hasThermostatMode) {
                    ccId = 0x40;
                }
                else if (hasThermostatSetpoint) {
                    ccId = 0x43;

                }
                if (hasThermostatMode) {
                    //curThermModeName = (curThermMode in instance.commandClasses[0x40].data) ? instance.commandClasses[0x40].data[curThermMode].modeName.value : "???";
                    modeList = getModeList(instance.commandClasses[0x40].data);
                    if (curThermMode in instance.commandClasses[0x40].data) {
                        updateTime = instance.commandClasses[0x40].data.mode.updateTime;
                        invalidateTime = instance.commandClasses[0x40].data.mode.invalidateTime;
                        modeType = 'hasThermostatMode';
                        isThermostatMode = true;

                    }
                }
                if (hasThermostatSetpoint) {
                    if (angular.isDefined(instance.commandClasses[0x43].data[curThermMode])) {
                        level = instance.commandClasses[0x43].data[curThermMode].setVal.value;
                        scale = instance.commandClasses[0x43].data[curThermMode].scaleString.value;
                        updateTime = instance.commandClasses[0x43].data[curThermMode].updateTime;
                        invalidateTime = instance.commandClasses[0x43].data[curThermMode].invalidateTime;
                        hasExt = true;
                        modeType = 'hasThermostatSetpoint';
                        isThermostatSetpoint = true;
                    }

                }
                // Set object
                var obj = {};

                obj['id'] = nodeId;
                obj['cmd'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.' + curThermMode;
                obj['ccId'] = ccId;
                obj['rowId'] = 'row_' + nodeId + '_' + cnt;
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['curThermMode'] = curThermMode;
                obj['level'] = level;
                obj['scale'] = scale;
                obj['range'] = (scale === '°F' ? cfg.thermostat.f : cfg.thermostat.c);
                obj['hasExt'] = hasExt;
                obj['updateTime'] = updateTime;
                obj['invalidateTime'] = invalidateTime;
                obj['dateTime'] = $filter('getDateTimeObj')(obj['updateTime'],obj['invalidateTime']);
                obj['isUpdated'] = (updateTime > invalidateTime ? true : false);
                obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                obj['urlChangeTemperature'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + 0x43 + ']';
                obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.' + curThermMode;
                obj['modeType'] = modeType;
                obj['isThermostatMode'] = isThermostatMode;
                obj['isThermostatSetpoint'] = isThermostatSetpoint;
                obj['modeList'] = modeList;

                var findIndex = _.findIndex($scope.thermostats.all, {rowId: obj.rowId});
                if(findIndex > -1){
                    angular.extend($scope.thermostats.all[findIndex],obj);
                    $scope.thermostats.rangeSlider[findIndex] = level;

                }else{
                    $scope.thermostats.all.push(obj);
                    $scope.thermostats.rangeSlider.push(obj['range_' + nodeId] = obj['level']);
                }
                if($scope.thermostats.ids.indexOf(nodeId) === -1){
                    $scope.thermostats.ids.push(nodeId);
                }
                cnt++;
            });
        });
    }

    /**
     * Used to pick up thermostat mode
     * @param {object} _instance
     * @returns {number}
     */
    function getCurrentThermostatMode(_instance) {
        var hasThermostatMode = 0x40 in _instance.commandClasses;

        var _curThermMode = 1;
        if (hasThermostatMode) {
            _curThermMode = _instance.commandClasses[0x40].data.mode.value;
            if (isNaN(parseInt(_curThermMode, 10)))
                _curThermMode = null; // Mode not retrieved yet
        }
//        else {
//            // we pick up first available mode, since not ThermostatMode is supported to change modes
//            _curThermMode = null;
//            angular.forEach(_instance.commandClasses[0x43].data, function(name, k) {
//                if (!isNaN(parseInt(name, 10))) {
//                    _curThermMode = parseInt(name, 10);
//                    return false;
//                }
//            });
//        }
//        ;
        return _curThermMode;
    }
    ;
    /**
     * Build a list with the thermostat modes
     * @param {object} data
     * @returns {Array}
     */
    function getModeList(data) {
        var list = []
        angular.forEach(data, function(v, k) {
            if (!k || isNaN(parseInt(k, 10))) {
                return;
            }
            var obj = {};
            obj['key'] = k;
            obj['val'] = $filter('hasNode')(v, 'modeName.value');
            list.push(obj);
        });

        return list;
    }
    ;
});