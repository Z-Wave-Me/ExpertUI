/**
 * Configuration controller
 * @author Martin Vach
 */
// Device configuration Interview controller
appController.controller('ConfigInterviewController', function($scope, $routeParams, $location, $cookies, dataService, deviceService) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'interview';
    $scope.activeUrl = 'configuration/interview/';
    $scope.showContent = false;

    $cookies.tab_config = $scope.activeTab;

    // Load data
    $scope.load = function(nodeId) {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            var node = ZWaveAPIData.devices[nodeId];
            if (!node) {
                return;
            }

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.showContent = true;
        });
    };
    $scope.load($routeParams.nodeId);

    // Redirect to detail page
    $scope.changeDevice = function(deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };
});
// Device configuration Configuration controller
appController.controller('ConfigConfigurationController', function($scope, $routeParams, $location, $cookies, dataService, deviceService) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'configuration';
    $scope.activeUrl = 'configuration/configuration/';
    $scope.showContent = false;

    $cookies.tab_config = $scope.activeTab;

    // Load data
    $scope.load = function(nodeId) {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            var node = ZWaveAPIData.devices[nodeId];
            if (!node) {
                return;
            }

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.showContent = true;
        });
    };
    $scope.load($routeParams.nodeId);

    // Redirect to detail page
    $scope.changeDevice = function(deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };
});
// Device configuration Association controller
appController.controller('ConfigAssociationController', function($scope, $routeParams, $location, $cookies, dataService, deviceService) {
     $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'association';
    $scope.activeUrl = 'configuration/association/';
    $scope.showContent = false;

    $cookies.tab_config = $scope.activeTab;

    // Load data
    $scope.load = function(nodeId) {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            var node = ZWaveAPIData.devices[nodeId];
            if (!node) {
                return;
            }

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.showContent = true;
        });
    };
    $scope.load($routeParams.nodeId);

    // Redirect to detail page
    $scope.changeDevice = function(deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };
});
// Device configuration commands controller
appController.controller('ConfigCommandsController', function($scope, $routeParams, $location, $cookies, dataService, deviceService) {
    $scope.devices = [];
    $scope.commands = [];
    $scope.interviewCommands;
    $scope.deviceId = 0;
    $scope.activeTab = 'commands';
    $scope.activeUrl = 'configuration/commands/';
    $scope.showContent = false;

    $cookies.tab_config = $scope.activeTab;

    // Load data
    $scope.load = function(nodeId) {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            var node = ZWaveAPIData.devices[nodeId];
            if (!node) {
                return;
            }
            $scope.getNodeDevices = function() {
                var devices = [];
                angular.forEach($scope.devices, function(v, k) {
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
            $scope.interviewCommands =  deviceService.configGetInterviewCommands(node, ZWaveAPIData.updateTime);

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.showContent = true;

            /**
             * Expert commands
             */
            angular.forEach(node.instances, function(instance, instanceId) {
                angular.forEach(instance.commandClasses, function(commandClass, ccId) {
                    var methods = getMethodSpec(ZWaveAPIData, nodeId, instanceId, ccId, null);
                    var command = deviceService.configGetCommands(methods, ZWaveAPIData);
                    var obj = {};
                    obj['nodeId'] = nodeId;
                    obj['rowId'] = 'row_' + nodeId + '_' + ccId;
                    obj['instanceId'] = instanceId;
                    obj['ccId'] = ccId;
                    obj['cmd'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                    obj['cmdData'] = ZWaveAPIData.devices[nodeId].instances[instanceId].commandClasses[ccId].data;
                    obj['cmdDataIn'] = ZWaveAPIData.devices[nodeId].instances[instanceId].data;
                    obj['commandClass'] = commandClass.name;
                    obj['command'] = command;
                    $scope.commands.push(obj);
                });
            });
        });
    };
    $scope.load($routeParams.nodeId);

    // Redirect to detail page
    $scope.changeDevice = function(deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };
    
    /**
     * Submit expert commands form
     */
    $scope.submitExpertCommndsForm = function(form, cmd) {
        //var data = $('#' + form).serialize();
        var data = $('#' + form).serializeArray();
        var dataJoined = [];
        angular.forEach(data, function(v, k) {
            if (v.value !== '') {
                dataJoined.push(v.value);
            }

        });
        var request = cmd + '(' + dataJoined.join() + ')';
        dataService.runCmd(request, false, $scope._t('error_handling_data'));
        $scope.refresh = true;
        var timeOut;
        timeOut = $timeout(function() {
            $('button .fa-spin,a .fa-spin').fadeOut(1000);
            $scope.refresh = false;
        }, 10000);
        return;
    };

});


// Device configuration firmware controller
appController.controller('ConfigFirmwareController', function($scope, $routeParams, $location, $cookies, dataService, deviceService) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'firmware';
    $scope.activeUrl = 'configuration/firmware/';
    $scope.showForm = false;
    $scope.formFirmware = {};
    $scope.firmwareProgress = 0;

    $cookies.tab_config = $scope.activeTab;

    // Load data
    $scope.load = function(nodeId) {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            var node = ZWaveAPIData.devices[nodeId];
            if (!node) {
                return;
            }
            // Remember device id
            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            //$scope.deviceName = 

            if (0x7a in node.instances[0].commandClasses) {
                $scope.showForm = true;
            }
        });
    };
    $scope.load($routeParams.nodeId);

    // Redirect to detail page
    $scope.changeDevice = function(deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };
    /**
     * update Firmware
     * todo: complete this function
     */
    $scope.updateFirmware = function(nodeId) {
        if (!$scope.formFirmware.url && !$scope.formFirmware.targetId) {
            return;
        }
        // $('.fa-spin').show();

        // File upload test
        var data = {
            'url': $scope.formFirmware.url,
            'file': $scope.myFile,
            'targetId': $scope.formFirmware.targetId
        };

//        dataService.joinedZwaveData(function(data) {
//            $scope.firmwareProgress++;
//            console.log($filter('hasNode')(data.update,'FirmwareUpdate.data.fragmentTransmitted.value'));
//            
////                refresh(data.update);
//        });

        // Watch for progress change
        $scope.$watch('firmwareProgress', function() {
            if ($scope.firmwareProgress >= 100) {
                $('.fa-spin').fadeOut();
                dataService.cancelZwaveDataInterval();
            }

        });
        // Cancel interval on page destroy
        $scope.$on('$destroy', function() {
            dataService.cancelZwaveDataInterval();
        });

        dataService.fwUpdate(nodeId, data);
        return;
    };

});
