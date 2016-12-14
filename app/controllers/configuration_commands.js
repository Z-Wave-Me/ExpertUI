/**
 * @overview This controller renders and handles device expert commands stuff.
 * @author Martin Vach
 */

/**
 * Device expert commands controller
 * @class ConfigCommandsController
 *
 */
appController.controller('ConfigCommandsController', function ($scope, $routeParams, $location, $cookies, $timeout, $filter, cfg,dataService, deviceService, _) {
    $scope.devices = [];
    $scope.commands = [];
    $scope.interviewCommands;

    $scope.deviceId = 0;
    $scope.activeTab = 'commands';
    $scope.activeUrl = 'configuration/commands/';

    $cookies.tab_config = $scope.activeTab;

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    // Load data
    $scope.load = function (nodeId) {
        dataService.getZwaveData(function (ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
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

            /**
             * Expert commands
             */
            angular.forEach(node.instances, function (instance, instanceId) {
                angular.forEach(instance.commandClasses, function (commandClass, ccId) {
                    var methods = getMethodSpec(ZWaveAPIData, nodeId, instanceId, ccId, null);
                    var command = deviceService.configGetCommands(methods, ZWaveAPIData);
                    var obj = {};
                    obj['nodeId'] = nodeId;
                    obj['rowId'] = 'row_' + nodeId + '_' + instanceId + '_' + ccId;
                    obj['instanceId'] = instanceId;
                    obj['ccId'] = ccId;
                    obj['cmd'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                    obj['cmdData'] = ZWaveAPIData.devices[nodeId].instances[instanceId].commandClasses[ccId].data;
                    obj['cmdDataIn'] = ZWaveAPIData.devices[nodeId].instances[instanceId].data;
                    obj['commandClass'] = commandClass.name;
                    obj['command'] = command;
                    obj['updateTime'] = ZWaveAPIData.updateTime;
                    $scope.commands.push(obj);
                });
            });
        });
    };
    $scope.load($routeParams.nodeId);

    // Redirect to detail page
    $scope.changeDevice = function (deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    /**
     * Refresh data
     *
     */
    $scope.refresh = function () {
        dataService.joinedZwaveData(function (data) {

        });
    };
    $scope.refresh();

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
     * todo: deprecated
     * Submit expert commands form
     */
    /*$scope.submitExpertCommndsForm = function (form, cmd) {
        var data = $('#' + form).serializeArray();
        var dataJoined = [];
        angular.forEach(data, function (v, k) {
            if (v.value === 'N/A') {
                return;
            }

            dataJoined.push($filter('setConfigValue')(v.value));

        });
        var request = cmd + '(' + dataJoined.join() + ')';
        dataService.runCmd(request, false, $scope._t('error_handling_data'));
        //$scope.refresh = true;
        var timeOut;
        timeOut = $timeout(function () {
            $('button .fa-spin,a .fa-spin').fadeOut(1000);
            //$scope.refresh = false;
        }, 10000);
        return;
    };*/

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
        dataService.joinedZwaveData(function (data) {
            node = data.joined.devices[$routeParams.nodeId];
            //console.log(node.instances)
            var newCc = $filter('hasNode')(node, 'instances.' + instanceId + '.data');
            if (type == 'cmdData') {
                newCc = $filter('hasNode')(node, 'instances.' + instanceId + '.commandClasses.' + ccId + '.data');
            }

            if (newCc) {
                if (JSON.stringify(ccData) === JSON.stringify(newCc)) {
                    return;
                }
                $scope.commandClass = deviceService.configSetCommandClass(deviceService.configGetCommandClass(newCc, '/', ''), data.joined.updateTime);
            }
        });
        $scope.handleModal(target, $event);
        //$(target).modal();
    };
    /**
     * Watch for the modal closing
     */
    $scope.$watchCollection('modalArr', function (modalArr) {
        if(_.has(modalArr, 'cmdClassModal') && !modalArr['cmdClassModal']){
            dataService.cancelZwaveDataInterval();
            //console.log(modalArr['cmdClassModal'])
        }

    });

    // todo: deprecated
    // Show modal dialog
    /*$scope.showModal = function (target, instanceId, index, ccId, type) {
        console.log('Showing modal')
        var node = $scope.ZWaveAPIData.devices[$routeParams.nodeId];
        var ccData = $filter('hasNode')(node, 'instances.' + instanceId + '.data');

        if (type == 'cmdData') {
            ccData = $filter('hasNode')(node, 'instances.' + instanceId + '.commandClasses.' + ccId + '.data');
        }
        var cc = deviceService.configGetCommandClass(ccData, '/', '');

        $scope.commandClass = deviceService.configSetCommandClass(cc, $scope.commands[index]['updateTime']);
        /!**
         * Refresh data
         *!/
        dataService.joinedZwaveData(function (data) {
            node = data.joined.devices[$routeParams.nodeId];
            //console.log(node.instances)
            var newCc = $filter('hasNode')(node, 'instances.' + instanceId + '.data');
            if (type == 'cmdData') {
                newCc = $filter('hasNode')(node, 'instances.' + instanceId + '.commandClasses.' + ccId + '.data');
            }

            if (newCc) {
                if (JSON.stringify(ccData) === JSON.stringify(newCc)) {
                    return;
                }
                $scope.commandClass = deviceService.configSetCommandClass(deviceService.configGetCommandClass(newCc, '/', ''), data.joined.updateTime);
            }
        });
        $(target).modal();
    };
    // Show modal dialog
    $scope.hideModal = function () {
        dataService.cancelZwaveDataInterval();

    };*/

    /// --- Private functions --- ///


});
