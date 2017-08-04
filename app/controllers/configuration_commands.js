/**
 * @overview This controller renders and handles device expert commands stuff.
 * @author Martin Vach
 */

/**
 * Device expert commands controller
 * @class ConfigCommandsController
 *
 */
appController.controller('ConfigCommandsController', function ($scope, $routeParams, $location, $cookies, $interval, $timeout, $filter, cfg, dataService, deviceService, _) {
    $scope.devices = [];
    $scope.deviceName = '';
    $scope.commands = [];
    $scope.interviewCommands;
    $scope.commandsInterval = null;
    /* $scope.ccConfiguration = {
     all: []
     };*/
    $scope.ccTable = {};

    $scope.deviceId = 0;
    //$scope.activeTab = 'commands';
    $scope.activeUrl = 'configuration/commands/';

    $cookies.tab_config =  'commands';

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.commandsInterval);
    });

    // Redirect to device
    $scope.redirectToDevice = function (deviceId) {
        if (deviceId) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    // Load data
    $scope.loadData = function (nodeId) {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            if (_.isEmpty($scope.devices)) {
                $scope.alert = {
                    message: $scope._t('device_404'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation-circle'
                };
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            if (!node || deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
            $scope.getNodeDevices = function () {
                var devices = [];
                angular.forEach($scope.devices, function (v, k) {
                    if (devices_htmlSelect_filter($scope.ZWaveAPIData, 'span', v.id, 'node')) {
                        return;
                    }
                    ;
                    var obj = {};
                    obj['id'] = v.id;
                    obj['name'] = v.name;
                    devices.push(obj);
                });
                return devices;
            };
            $scope.interviewCommands = deviceService.configGetInterviewCommands(node, ZWaveAPIData.updateTime);
            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.deviceName = $filter('deviceName')(nodeId, node);
            setData(ZWaveAPIData, node);
            setCcTable($scope.interviewCommands)
            $scope.refreshZwaveData(nodeId);
        });

    }
    $scope.loadData($routeParams.nodeId);

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function (nodeId) {
        var refresh = function () {

            dataService.loadJoinedZwaveData().then(function (response) {
                var update = false;
                angular.forEach(response.data.update, function (v, k) {
                    // Get node ID from response
                    var findId = k.split('.')[1];
                    // Check if node ID is in the available devices
                    if (nodeId == findId) {
                        update = true;
                        return;
                    }
                });

                // Update found - updating available devices
                if (update) {
                    var node = response.data.joined.devices[nodeId];
                    $scope.interviewCommands = deviceService.configGetInterviewCommands(node, response.data.joined.updateTime);
                    setCcTable($scope.interviewCommands);
                }
            });
        };
        $scope.commandsInterval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Store expert commands
     */
    $scope.storeExpertCommnds = function (form, cmd) {
        $scope.toggleRowSpinner(cmd);
        var data = $('#' + form).serializeArray();
        var dataJoined = [];
        angular.forEach(data, function (v, k) {
            if (v.value === 'N/A') {
                return;
            }
            dataJoined.push($filter('setConfigValue')(v.value));

        });
        var request = cmd + '(' + dataJoined.join() + ')';
        dataService.runZwaveCmd(cfg.store_url + request).then(function (response) {
            $timeout($scope.toggleRowSpinner, 3000);
        }, function (error) {
            var message = (_.isString(error.data) ? error.data : $scope._t('error_update_data')) + '\n' + request;
            alertify.alertError(message);
            $scope.toggleRowSpinner();
        });
    };

    /**
     * Show modal CommandClass dialog
     */
    $scope.handleCmdClassModal = function (target, $event, instanceId, index, ccId, type) {
        var node = $scope.ZWaveAPIData.devices[$routeParams.nodeId];
        var ccData = $filter('hasNode')(node, 'instances.' + instanceId + '.data');

        if (type == 'cmdData') {
            ccData = $filter('hasNode')(node, 'instances.' + instanceId + '.commandClasses.' + ccId + '.data');
        }
        var cc = deviceService.configGetCommandClass(ccData, '/', '');

        $scope.commandClass = deviceService.configSetCommandClass(cc, $scope.commands[index]['updateTime']);
        /**
         * Refresh data
         */
        dataService.loadJoinedZwaveData().then(function (response) {
            node = response.data.joined.devices[$routeParams.nodeId];
            var newCc = $filter('hasNode')(node, 'instances.' + instanceId + '.data');
            if (type == 'cmdData') {
                newCc = $filter('hasNode')(node, 'instances.' + instanceId + '.commandClasses.' + ccId + '.data');
            }

            if (newCc) {
                if (JSON.stringify(ccData) === JSON.stringify(newCc)) {
                    return;
                }
                $scope.commandClass = deviceService.configSetCommandClass(deviceService.configGetCommandClass(newCc, '/', ''), response.data.joined.updateTime);
            }
        });
        $scope.handleModal(target, $event);
    };

    /// --- Private functions --- ///
    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData, node) {
        angular.forEach(node.instances, function (instance, instanceId) {
            angular.forEach(instance.commandClasses, function (commandClass, ccId) {
                var nodeId = $scope.deviceId;
                var methods = getMethodSpec(ZWaveAPIData, nodeId, instanceId, ccId, null);
                var command = deviceService.configGetCommands(methods, ZWaveAPIData);
                var obj = {};
                obj['nodeId'] = nodeId;
                obj['rowId'] = 'row_' + nodeId + '_' + instanceId + '_' + ccId;
                obj['instanceId'] = instanceId;
                obj['ccId'] = ccId;
                obj['cmd'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                obj['cmdData'] = instance.commandClasses[ccId].data;
                obj['cmdDataIn'] = instance.data;
                obj['commandClass'] = commandClass.name;
                obj['command'] = command;
                obj['updateTime'] = ZWaveAPIData.updateTime;

                var findIndex = _.findIndex($scope.commands, {rowId: obj.rowId});
                if (findIndex > -1) {
                    angular.extend($scope.commands[findIndex], obj);

                } else {
                    $scope.commands.push(obj);
                }
            });
        });
    }

    /**
     * Set cc table
     * @param data
     */
    function setCcTable(data) {

        angular.forEach(data, function (v, k) {
            var cmdCfg = cfg.expert_cmd[v.ccName];
            if (cmdCfg) {
                var obj = {};
                obj['ccName'] = v.ccName;
                obj['rows'] = [];
                if(!$scope.ccTable[v.ccName]){
                    $scope.ccTable[v.ccName] = obj;
                }

                //setCcTableRows(v.cmdData,cmdCfg);
                if (cmdCfg.valArray) {
                    setCcTableRowsArray(v.cmdData, cmdCfg);
                } else {
                    setCcTableRows(v.cmdData, cmdCfg)

                }

            }
        });
    }

    /**
     * Set cc table rows with values
     * @param data
     */
    function setCcTableRows(data, cmdCfg) {

        //console.log(data,cmdCfg)
        angular.forEach(cmdCfg.th, function (v,k) {
            if(data[v]){
               var obj = {};
                obj['id'] = v;
                obj['rowId'] = v;
                obj['value'] = (data[v].value === null || data[v].value === '' ? '-' : '' + data[v].value);
                obj['updateTime'] = data[v].updateTime;
                obj['isUpdated'] = (data[v].updateTime > data[v].invalidateTime ? true : false);
                obj['isEqual'] = true;

                var findIndex = _.findIndex($scope.ccTable[cmdCfg.ccName]['rows'], {rowId: obj.rowId});
                //console.log(console.log($scope.ccTable['Basic']['rows']))
                if (findIndex > -1) {
                    obj['isEqual'] = _.isEqual(obj, $scope.ccTable[cmdCfg.ccName]['rows'][findIndex]);
                    angular.extend(obj, {isEqual: _.isEqual(obj, $scope.ccTable[cmdCfg.ccName]['rows'][findIndex])});
                    angular.extend($scope.ccTable[cmdCfg.ccName]['rows'][findIndex], obj);
                } else {
                    $scope.ccTable[cmdCfg.ccName]['rows'].push(obj);
                }
            }

        });


    }

    /**
     * Set cc table rows with values from array
     * @param data
     */
    function setCcTableRowsArray(data, cmdCfg) {

        angular.forEach(data, function (v, k) {
            if (!_.isNaN(parseInt(k))) {
                var obj = {};
                obj['id'] = k;
                obj['rowId'] = k;
                obj['value'] = (v[cmdCfg.th[0]].value === null || v[cmdCfg.th[0]].value === '' ? '-' : '' + v[cmdCfg.th[0]].value)
                obj['updateTime'] = v.updateTime;
                obj['isUpdated'] = (v.updateTime > v.invalidateTime ? true : false);
                obj['isEqual'] = true;
                var findIndex = _.findIndex($scope.ccTable[cmdCfg.ccName]['rows'], {rowId: obj.rowId});
                if (findIndex > -1) {
                    obj['isEqual'] = _.isEqual(obj, $scope.ccTable[cmdCfg.ccName]['rows'][findIndex]);
                    angular.extend(obj, {isEqual: _.isEqual(obj, $scope.ccTable[cmdCfg.ccName]['rows'][findIndex])});
                    angular.extend($scope.ccTable[cmdCfg.ccName]['rows'][findIndex], obj);
                } else {
                    $scope.ccTable[cmdCfg.ccName]['rows'].push(obj);
                }

            }
        });


    }

    /**
     * todo: deprecated
     * Set cc configuration
     * @param data
     */
    /*function setCcConfig(data) {
     //console.log(data.cmdData)
     angular.forEach(data.cmdData, function (v, k) {
     if (_.isNaN(parseInt(k))) {
     return;
     }
     var rowId = 'row_' + k;
     //console.log(k)
     var obj = {};
     obj['rowId'] = rowId;
     obj['param'] = k;
     obj['size'] = v.size.value;
     obj['val'] = v.val.value;
     obj['updateTime'] = v.updateTime;
     obj['isUpdated'] = (v.updateTime > v.invalidateTime ? true : false);
     obj['isEqual'] = true;
     var findIndex = _.findIndex($scope.ccConfiguration.all, {rowId: obj.rowId});
     if (findIndex > -1) {
     obj['isEqual'] = _.isEqual(obj, $scope.ccConfiguration.all[findIndex]);
     angular.extend(obj, {isEqual: _.isEqual(obj, $scope.ccConfiguration.all[findIndex])});
     angular.extend($scope.ccConfiguration.all[findIndex], obj);
     } else {
     $scope.ccConfiguration.all.push(obj);
     }
     });

     }*/


});
