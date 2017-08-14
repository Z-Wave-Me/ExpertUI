/**
 * @overview This controller renders and handles switches, actuators, electrical power switches, dimmers and motor controlling devices.
 * @author Martin Vach
 */

/**
 * Allows to control On/Off switches, actuators, electrical power switches and trap On/Off control commands from other devices.
 * Allows to control all actuators with multilevel switching functions, primarily Dimmers and Motor Controlling devices
 * as well as trap dim events sent by remotes.
 * Controls the behavior of a actuator on Switch All commands.
 *
 * @class SwitchController
 *
 */
appController.controller('SwitchController', function ($scope, $filter, $timeout, $interval, dataService, deviceService,cfg, _) {
    $scope.switches = {
        ids: [],
        all: [],
        interval: null,
        rangeSlider: [],
        switchButton: [],
        show: false
    };
    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.switches.interval);
    });

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function () {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            setData(ZWaveAPIData);
            if (_.isEmpty($scope.switches.all)) {
                $scope.alert = {
                    message: $scope._t('device_404'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation-circle'
                };
                return;
            }
            $scope.switches.show = true;
            $scope.refreshZwaveData();
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function () {
        var refresh = function () {
            dataService.loadJoinedZwaveData().then(function (response) {
                var update = false;
                angular.forEach(response.data.update, function(v, k) {
                    // Get node ID from response
                    var findId = k.split('.')[1];
                    // Check if node ID is in the available devices
                    if($scope.switches.ids.indexOf(findId) > -1){
                        update = true;
                        //console.log('Updating nodeId: ',findId);
                        return;
                    }
                });
                // Update found - updating available devices
                if(update){
                    setData(response.data.joined);
                }
            });
        };
        $scope.switches.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Update switch
     * @param {string} url
     */
    $scope.updateSwitch = function (url, $index) {
        $scope.toggleRowSpinner(url);
        dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + url);
        });
    };
    /**
     * Update all switches
     * @param {string} id
     * @param {string} urlType
     */
    $scope.updateAllSwitches = function (id, urlType) {
        var lastItem = _.last($scope.switches.all);
        $scope.toggleRowSpinner(id);
        angular.forEach($scope.switches.all, function (v, k) {
            $scope.toggleRowSpinner(v[urlType]);
            dataService.runZwaveCmd(cfg.store_url + v[urlType]).then(function (response) {
                alertify.dismissAll();
            }, function (error) {
                alertify.dismissAll();
                alertify.alertError($scope._t('error_update_data') + '\n' + v[urlType]);
            });
            if (lastItem.rowId === v.rowId) {
                $timeout($scope.toggleRowSpinner, 1000);
            }
        });

    };

    /**
     * Calls function when slider handle is grabbed
     */
    $scope.sliderOnHandleDown = function () {
        $interval.cancel($scope.switches.interval);
    };

    /**
     * Calls function when slider handle is released
     * @param {string} cmd
     * @param {int} index
     */
    $scope.sliderOnHandleUp = function (cmd, index) {
        $scope.refreshZwaveData(null);
        var val = $scope.switches.rangeSlider[index];
        var url = cmd + '.Set(' + val + ')';
        dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
            $scope.toggleRowSpinner();
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + url);
        });
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {

        /**
         * Set data for all available devices
         */
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop through devices
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            var type = deviceService.deviceType(node);
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value || type == 'static') {
                return;
            }
            setNodeInstance(node, nodeId);

        });
    }
    ;
    /**
     * Set node instance
     * @param node
     * @param nodeId
     */
    function setNodeInstance(node, nodeId){
        // Loop throught instances
        var cnt = 0;
        angular.forEach(node.instances, function (instance, instanceId) {
            cnt++;
            // Command Class SwitchBinary (0x25/37)
            // Allows to control On/Off switches
            var hasBinary = 0x25 in instance.commandClasses;
            // Command Class SwitchMultilevel (0x26/38)
            // Controls all actuators with multilevel switching functions,
            var hasMultilevel = 0x26 in instance.commandClasses;

            // Command Class SwitchAll (0x27/39)
            // Controls the behavior of a actuator on Switch All commands.
            var hasSwitchAll = (0x27 in instance.commandClasses) && (instanceId == 0);
            var ccId;
            var switchAllValue = null;

            if (hasMultilevel) {
                ccId = 0x26;
            } else if (hasBinary) {
                ccId = 0x25;
            } else {
                return; // we skip instance if there is no SwitchBinary or SwitchMultilevel CCs
            }


            // var hasSwitchAll = (0x27 in instance.commandClasses) && (instanceId == 0);
            if (hasSwitchAll) {
                switchAllValue = instance.commandClasses[0x27].data.mode.value;
            }
            var deviceType = ccId == 0x25 ? 'binary' : 'multilevel';

            var genericType = node.data.genericType.value;
            var specificType = node.data.specificType.value;
            var genspecType = genericType + '/' + specificType;

            // Set object
            var obj = {};

            // Motor devices
            var btnOn = $scope._t('switched_on');
            var btnOff = $scope._t('switched_off');
            var btnFull = $scope._t('btn_full');
            var hasMotor = false;
            var motorDevices = ['17/3', '17/5', '17/6', '17/7', '9/0', ' 9/1'];
            if (motorDevices.indexOf(genspecType) !== -1) {
                btnOn = $scope._t('btn_switched_up');
                btnOff = $scope._t('btn_switched_down');
                hasMotor = true;
            }
            //console.log(nodeId + '.' + instanceId + ': ' + genspecType + ' motor: ' + hasMotor);
            var multiChannel = false;
            if (0x60 in instance.commandClasses) {
                multiChannel = true;
            }
            var level = updateLevel(instance.commandClasses[ccId].data.level, ccId, btnOn, btnOff);
            obj['id'] = nodeId;
            obj['idSort'] = $filter('zeroFill')(nodeId);
            obj['cmd'] = instance.commandClasses[ccId].data.name + '.level';
            obj['iId'] = instanceId;
            obj['ccId'] = ccId;
            obj['hasMotor'] = hasMotor;
            obj['multiChannel'] = multiChannel;
            obj['deviceType'] = deviceType;
            obj['genericType'] = genericType;
            obj['specificType'] = specificType;
            obj['hasSwitchAll'] = hasSwitchAll;
            obj['switchAllValue'] = switchAllValue;
            obj['rowId'] = 'switch_' + nodeId + '_' + $filter('zeroFill')(cnt);
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['updateTime'] = instance.commandClasses[ccId].data.level.updateTime;
            obj['invalidateTime'] = instance.commandClasses[ccId].data.level.invalidateTime;
            obj['dateTime'] = $filter('getDateTimeObj')(instance.commandClasses[ccId].data.level.updateTime, obj['invalidateTime']);
            obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Get()';
            obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
            obj['level'] = level.level_cont;
            obj['levelColor'] = level.level_color;
            obj['levelStatus'] = level.level_status;
            obj['levelMax'] = level.level_max;
            obj['levelVal'] = level.level_val;
            obj['urlToOff'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Set(0)';
            obj['urlToOn'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Set(255)';
            obj['urlToFull'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Set(99)';
            obj['urlToSlide'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
            obj['btnOn'] = btnOn;
            obj['btnOff'] = btnOff;
            obj['btnFull'] = btnFull;
            obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.level';
            // obj['deviceIcon'] = $filter('deviceIcon')(obj);
            var findIndex = _.findIndex($scope.switches.all, {rowId: obj.rowId});
            if (findIndex > -1) {
                angular.extend($scope.switches.all[findIndex], obj);
                $scope.switches.rangeSlider[findIndex] = level.level_val;

            } else {
                $scope.switches.all.push(obj);
                $scope.switches.rangeSlider.push(obj['range_' + nodeId] = level.level_val);
            }
            // Push available device id to an array
            if($scope.switches.ids.indexOf(nodeId) === -1){
                $scope.switches.ids.push(nodeId);
            }

            //});
        });
    }

    /**
     * Update level
     * @param {object} obj
     * @param {number}  ccId
     * @param {string} btnOn
     * @param {string} btnOff
     * @returns {{level_cont: *, level_color: *, level_status: string, level_val: number, level_max: number}}
     */
    function updateLevel(obj, ccId, btnOn, btnOff) {

        var level_cont;
        var level_color;
        var level_status = 'off';
        var level_val = 0;
        var level_max = 99;

        //var level = obj.value;
        var level = (angular.isDefined(obj.value) ? obj.value : null);

        if (level === '' || level === null) {
            level_cont = '?';
            level_color = 'gray';
        } else {
            if (level === false)
                level = 0;
            if (level === true)
                level = 255;
            level = parseInt(level, 10);
            if (level === 0) {
                level_cont = btnOff;
                level_color = '#a94442';
            } else if (level === 255 || level === 99) {
                level_status = 'on';
                level_cont = btnOn;
                level_color = '#3c763d';
//                if(level > 99){
//                    level_max = 255;
//                }
                //level_val = level;
                level_val = (level < 100 ? level : 99);
            } else {
                level_cont = level.toString() + ((ccId == 0x26) ? '%' : '');
                var lvlc_r = ('00' + parseInt(0x9F + 0x60 * level / 99).toString(16)).slice(-2);
                var lvlc_g = ('00' + parseInt(0x7F + 0x50 * level / 99).toString(16)).slice(-2);
                level_color = '#' + lvlc_r + lvlc_g + '00';
                level_status = 'on';
                // level_val = level;
                level_val = (level < 100 ? level : 99);
            }
        }
        ;
        return {
            "level_cont": level_cont,
            "level_color": level_color,
            "level_status": level_status,
            "level_val": level_val,
            "level_max": level_max
        };
    }
    ;
});