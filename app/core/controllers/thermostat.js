/**
 * ThermostatController
 * @author Martin Vach
 */
appController.controller('ThermostatController', function($scope, $filter, dataService) {
    $scope.thermostats = [];
    $scope.rangeSlider = [];
    $scope.mChangeMode = [];
    $scope.reset = function() {
        $scope.thermostats = angular.copy([]);
    };
    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
                refreshData(data);
            });
        });
    };
    // Load data
    $scope.load();

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });
    // Change temperature on click
    $scope.tempChange = function(cmd, index, type) {
        var val = $scope.rangeSlider[index];
        var min = parseInt($scope.cfg.thermostat_range.min, 10);
        var max = parseInt($scope.cfg.thermostat_range.max, 10);
        var count = (type === '-' ? val - 1 : val + 1);
        if (count < min) {
            count = min;
        }
        if (count > max) {
            count = max;
        }
        $scope.rangeSlider[index] = count;
        var url = cmd + '.Set(1,' + count + ')';
        console.log('Sending value: ' + $scope.rangeSlider[index]);
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };
    // Change temperature after slider handle
    $scope.sliderChange = function(cmd, index) {
        var count = parseInt($scope.rangeSlider[index]);
        var min = parseInt($scope.cfg.thermostat_range.min, 10);
        var max = parseInt($scope.cfg.thermostat_range.max, 10);
        if (count < min) {
            count = min;
        }
        if (count > max) {
            count = max;
        }
        $scope.rangeSlider[index] = count;
        var url = cmd + '.Set(1,' + count + ')';
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };
    // Change mode
    $scope.changeMode = function(cmd, mode) {
        if (!mode) {
            return;
        }
        var url = cmd + '.Set(' + mode + ')';
        dataService.runCmd(url);
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
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
                //console.log( nodeId + ': ' + curThermMode);
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
                obj['hasExt'] = hasExt;
                obj['updateTime'] = updateTime;
                obj['invalidateTime'] = invalidateTime;
                obj['isUpdated'] = (updateTime > invalidateTime ? true : false);
                obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                obj['urlChangeTemperature'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + 0x43 + ']';
                obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.' + curThermMode;
                obj['modeType'] = modeType;
                obj['isThermostatMode'] = isThermostatMode;
                obj['isThermostatSetpoint'] = isThermostatSetpoint;
                obj['modeList'] = modeList;
                $scope.thermostats.push(obj);
                $scope.rangeSlider.push(obj['range_' + nodeId] = obj['level']);
                //console.log(obj);
                cnt++;
            });
        });
    }

    /**
     * Refresh zwave data
     */
    function refreshData(data) {
        angular.forEach($scope.thermostats, function(v, k) {
            //console.log($scope.thermostats[k].curThermMode)
            //$scope.thermostats[k].curThermMode = 0;
            if (!v.modeType) {
                return;
            }
            var obj = data.update[v.cmdToUpdate];
            var level = null;
            var updateTime;
            var invalidateTime;
            if (!angular.isObject(data.update)) {
                return;
            }
            if (v.cmdToUpdate in data.update) {
                if (v.modeType == 'hasThermostatMode') {
                    updateTime = obj.mode.updateTime;
                    invalidateTime = obj.mode.invalidateTime;
                }
                if (v.modeType == 'hasThermostatSetpoint') {
                    updateTime = obj.updateTime;
                    invalidateTime = obj.invalidateTime;
                    level = obj.setVal.value;
                }
                var formatTime = $filter('isTodayFromUnix')(updateTime);
                $('#' + v.rowId + ' .row-level .level-val').html(level);
                $('#' + v.rowId + ' .row-time').html(formatTime);
                if (updateTime > invalidateTime) {
                    $('#' + v.rowId + ' .row-time').removeClass('is-updated-false');
                }
                console.log('Updating:' + v.rowId + ' | At: ' + formatTime + ' | with: ' + level);//REM
            }
        });
    }

    // used to pick up thermstat mode
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
    // used to pick up thermstat mode
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