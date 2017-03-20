/**
 * @overview This controller renders and handles device expert commands stuff.
 * @author Martin Vach
 */

/**
 * Device expert commands controller
 * @class ConfigCommandsController
 *
 */
appController.controller('ConfigCommandsController', function ($scope, $routeParams, $location, $cookies, $interval,$timeout, $filter, cfg,dataService, deviceService, _) {
    $scope.devices = [];
    $scope.deviceName = '';
    $scope.commands = [];
    $scope.interviewCommands;
    $scope.commandsInterval = null;
    $scope.ccConfiguration = {
        all: []
    };

    $scope.deviceId = 0;
    $scope.activeTab = 'commands';
    $scope.activeUrl = 'configuration/commands/';

    $cookies.tab_config = $scope.activeTab;

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.commandsInterval);
    });

    // Redirect to detail page
    $scope.changeDevice = function (deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    // Load data
    $scope.loadData = function (nodeId) {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            if(_.isEmpty($scope.devices)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
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
            var ccConfiguration = _.findWhere($scope.interviewCommands,{ccName: "Configuration"});
            console.log(ccConfiguration)
            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.deviceName = $filter('deviceName')(nodeId, node);
            setData(ZWaveAPIData,node);
            setCcConfig(ccConfiguration);
            $scope.refreshZwaveData(nodeId);
        });

    }
    $scope.loadData($routeParams.nodeId);

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function(nodeId) {
        var refresh = function() {

            dataService.loadJoinedZwaveData().then(function(response) {
                var update = false;
                angular.forEach(response.data.update, function(v, k) {
                    // Get node ID from response
                    var findId = k.split('.')[1];
                    // Check if node ID is in the available devices
                    if(nodeId == findId){
                        update = true;
                        console.log('Updating nodeId: ',findId);
                        return;
                    }
                });

                // Update found - updating available devices
                if(update){
                    var node = response.data.joined.devices[nodeId];
                    $scope.interviewCommands = deviceService.configGetInterviewCommands(node,response.data.update.updateTime);
                    var ccConfiguration = _.findWhere($scope.interviewCommands,{ccName: "Configuration"});
                    setData(response.data.joined,node);
                    setCcConfig(ccConfiguration);
                }
            }, function(error) {});
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
            alertify.alertError($scope._t('error_update_data') + '\n' + cmd);
            $scope.toggleRowSpinner();
        });
    };

    /**
     * Show modal CommandClass dialog
     */
    $scope.handleCmdClassModal= function (target, $event,instanceId, index, ccId, type) {
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
        dataService.loadJoinedZwaveData().then(function(response) {
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
    /**
     * Watch for the modal closing
     */
    $scope.$watchCollection('modalArr', function (modalArr) {
       /* if(_.has(modalArr, 'cmdClassModal') && !modalArr['cmdClassModal']){
            $interval.cancel($scope.commandsInterval);
            //console.log(modalArr['cmdClassModal'])
        }*/

    });

    /// --- Private functions --- ///
    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData,node) {
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
                //obj['cmdData'] = ZWaveAPIData.devices[nodeId].instances[instanceId].commandClasses[ccId].data;
                obj['cmdData'] = instance.commandClasses[ccId].data;
                //obj['cmdDataIn'] = ZWaveAPIData.devices[nodeId].instances[instanceId].data;
                obj['cmdDataIn'] = instance.data;
                obj['commandClass'] = commandClass.name;
                obj['command'] = command;
                obj['updateTime'] = ZWaveAPIData.updateTime;
                //console.log(obj)
                $scope.commands.push(obj);
            });
        });
    }

    /**
     * Set cc configuration
     * @param data
     */
    function setCcConfig(data){
        //console.log(data.cmdData)
        angular.forEach(data.cmdData, function (v, k) {
            if(_.isNaN(parseInt(k))){
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
            if(findIndex > -1){
                obj['isEqual'] = _.isEqual(obj, $scope.ccConfiguration.all[findIndex]);
                angular.extend(obj,{isEqual: _.isEqual(obj, $scope.ccConfiguration.all[findIndex])});
                angular.extend($scope.ccConfiguration.all[findIndex],obj);
            }else{
                $scope.ccConfiguration.all.push(obj);
            }
        });

    }


});
