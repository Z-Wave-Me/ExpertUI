/**
 * @overview This is used to control the Z-Wave controller itself and ot manage the Z-Wave network.
 * @author Martin Vach
 */

/**
 * Control root ontroller
 * @class ControlController
 *
 */
appController.controller('ControlController', function ($scope, $interval, $timeout, $filter,  $window,cfg, dataService, deviceService) {
    $scope.controlDh = {
        process: false,
        interval: null,
        includeToNetworkTimeout: null,
        show: false,
        alert: $scope.alert,
        controller: {},
        inclusion: {
            lastIncludedDevice: $scope.alert,
            lastExcludedDevice: $scope.alert,
            lastIncludedDeviceId: 0,
            alert: $scope.alert,
            alertPrimary: $scope.alert,
            alertS2: $scope.alert,
            popup: false,
            input: {
                keysGranted: {
                    S0: 'false',
                    S2Unauthenticated: 'false',
                    S2Authenticated: 'false',
                    S2Access: 'false'
                },
                keysRequested: {
                    S0: 'false',
                    S2Unauthenticated: 'false',
                    S2Authenticated: 'false',
                    S2Access: 'false'
                },
                dskPin: 0,
                publicKey: null
            },
            grantKeys: {
                interval: false,
                show: false,
                done: false,
                countDown: 20,
               anyChecked: false
            },
            verifyDSK: {
                interval: false,
                show: false,
                done: false,
                countDown: 20
            }
        },
        network: {
            include: false,
            inclusionProcess: false,
            alert: $scope.alert,
            modal: false
        },
        nodes: {
            all: [],
            failedNodes: [],
            failedBatteries: [],
            sucSis: []

        },
        input: {
            failedNodes: 0,
            replaceNodes: 0,
            failedBatteries: 0,
            sucSis: 0
        },
        removed: {
            failedNodes: [],
            replaceNodes: [],
            failedBatteries: []
        },
        factory:{
           process: false,
            alert: $scope.alert,
        }
    };
    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.controlDh.interval);
    });

    /**
     * Get block of DSK
     */
    $scope.dskBlock = function(publicKey, block) {
        if(!publicKey){
            return '';
        }
        return (publicKey[(block - 1) * 2] * 256 + publicKey[(block - 1) * 2 + 1]);
    };

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function () {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            setControllerData(ZWaveAPIData);
            setDeviceData(ZWaveAPIData);
            $scope.controlDh.show = true;
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
                setControllerData(response.data.joined);
                setDeviceData(response.data.joined);
                setInclusionData(response.data.joined, response.data.update);
                if($scope.controlDh.inclusion.lastIncludedDeviceId != 0 && cfg.app_type != 'installer'){
                    var nodeInstances = $filter('hasNode')(response, 'data.joined.devices.' + $scope.controlDh.inclusion.lastIncludedDeviceId + '.instances')
                    checkInterview(nodeInstances);
                }

            });
        };
        $scope.controlDh.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Handle inclusionS2GrantKeys
     */
    $scope.handleInclusionS2GrantKeys = function (keysGranted,timedOut) {
        var alertMessage = '';
        // Is any checkbox checked?
        angular.forEach(keysGranted,function(v){
            if(v == true){
                $scope.controlDh.inclusion.grantKeys.anyChecked = true
                return;
            }
        });
        // Is timed out
        if(timedOut){
            alertMessage += $scope._t('timedout') + '. ';

        }
        // Nothing is checked
        if(!$scope.controlDh.inclusion.grantKeys.anyChecked){
            alertMessage += $scope._t('no_s2_channel');

        }
        // Show an alert
        if(alertMessage){
            $scope.controlDh.inclusion.alertS2 = {
                message: alertMessage,
                status: 'alert-danger',
                icon: false
            };
        }


       $scope.controlDh.inclusion.grantKeys.show = false;
        $scope.controlDh.inclusion.grantKeys.done = true;
        $interval.cancel($scope.controlDh.inclusion.grantKeys.interval);
        var nodeId = $scope.controlDh.inclusion.lastIncludedDeviceId.toString(10),
            cmd =
                'devices[' + nodeId + '].SecurityS2.data.grantedKeys.S0=' + keysGranted.S0 + '; '+
                'devices[' + nodeId + '].SecurityS2.data.grantedKeys.S2Unauthenticated=' + keysGranted.S2Unauthenticated + '; '+
                'devices[' + nodeId + '].SecurityS2.data.grantedKeys.S2Authenticated=' + keysGranted.S2Authenticated + '; '+
                'devices[' + nodeId + '].SecurityS2.data.grantedKeys.S2Access=' + keysGranted.S2Access + '; '+
                'devices[' + nodeId + '].SecurityS2.data.grantedKeys=true';
        $scope.runZwaveCmd(cmd)
    };

    /**
     * Handle inclusionS2VerifyDSK
     */
    $scope.handleInclusionVerifyDSK = function (confirmed,timedOut) {
        var alertMessage = '';
        // Is timed out
        if(timedOut){
            $scope.controlDh.inclusion.alertS2 = {
                message: $scope._t('timedout'),
                status: 'alert-danger',
                icon: false
            };

        }
        // Is confirmed
        if(confirmed){
            $scope.controlDh.inclusion.alertS2 = {
                message: $scope._t('wait_key_veriffication'),
                status: 'alert-warning',
                icon: 'fa-spinner fa-spin'
            };

        }
        $scope.controlDh.inclusion.verifyDSK.show = false;
        $scope.controlDh.inclusion.verifyDSK.done = true;
        $interval.cancel($scope.controlDh.inclusion.verifyDSK.interval);
        var dskPin = parseInt($scope.controlDh.inclusion.input.dskPin, 10),
            nodeId = $scope.controlDh.inclusion.lastIncludedDeviceId.toString(10),
            publicKey = [];

        if (confirmed) {
            publicKey = $scope.controlDh.inclusion.input.publicKey;
            publicKey[0] = (dskPin >> 8) & 0xff;
            publicKey[1] = dskPin & 0xff;
        }
        var cmd = 'devices[' + nodeId + '].SecurityS2.data.publicKeyVerified=[' + publicKey.join(',') + '];';
        $scope.runZwaveCmd(cmd);
        $timeout(function(){
            checkS2Interview(nodeId);
        }, 10000);

    };



    /// --- Private functions --- ///
    /**
     * Set controller data
     * @param {object} ZWaveAPIData
     */
    function setControllerData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        var nodeId = ZWaveAPIData.controller.data.nodeId.value;
        var hasSUC = ZWaveAPIData.controller.data.SUCNodeId.value;
        var hasDevices = Object.keys(ZWaveAPIData.devices).length;
        var controllerState = ZWaveAPIData.controller.data.controllerState.value;
        var  publicKey = $filter('hasNode')(ZWaveAPIData, 'devices.' + controllerNodeId + '.instances.0.commandClasses.159.data.publicKey');
        //var  publicKey = [153, 208, 7, 160, 148, 242, 106, 250, 131, 14, 199, 190, 151, 144, 115, 18, 26, 150, 80, 131, 83, 143, 64, 149, 103, 61, 70, 243, 147, 85, 55, 108]

        // Customsettings
        $scope.controlDh.controller.hasDevices = hasDevices > 1;
        $scope.controlDh.controller.disableSUCRequest = true;
        if (hasSUC && hasSUC != controllerNodeId) {
            $scope.controlDh.controller.disableSUCRequest = false;
        }
        if ($scope.controlDh.nodes.sucSis.indexOf(nodeId) === -1) {
            $scope.controlDh.input.sucSis = $scope.controlDh.input.sucSis || ZWaveAPIData.controller.data.nodeId.value;
            $scope.controlDh.nodes.sucSis.push(nodeId);
        }

        // Default controller settings
        $scope.controlDh.controller.nodeId = nodeId;
        $scope.controlDh.controller.frequency = $filter('hasNode')(ZWaveAPIData, 'controller.data.frequency.value');
        $scope.controlDh.controller.controllerState = controllerState;
        $scope.controlDh.controller.secureInclusion = ZWaveAPIData.controller.data.secureInclusion.value;
        $scope.controlDh.controller.isPrimary = ZWaveAPIData.controller.data.isPrimary.value;
        $scope.controlDh.controller.isRealPrimary = ZWaveAPIData.controller.data.isRealPrimary.value;
        $scope.controlDh.controller.isSIS = ZWaveAPIData.controller.data.SISPresent.value;
        $scope.controlDh.controller.secureInclusion = ZWaveAPIData.controller.data.secureInclusion.value;
        $scope.controlDh.controller.homeName = ZWaveAPIData.controller.data.homeName.value || cfg.controller.homeName;
        $scope.controlDh.controller.SetPromiscuousMode = (ZWaveAPIData.controller.data.functionClassesNames.value.indexOf('SetPromiscuousMode') > -1 ? true : false);
        $scope.controlDh.controller.SUCNodeId = ZWaveAPIData.controller.data.SUCNodeId.value;
        $scope.controlDh.controller.isInOthersNetwork = ZWaveAPIData.controller.data.isInOthersNetwork.value;
        if(_.size(publicKey)){
            $scope.controlDh.controller.publicKey = publicKey;
            $scope.controlDh.controller.publicKeyQr =
                $scope.dskBlock(publicKey, 0) || ''
                +  $scope.dskBlock(publicKey, 1).toString()
                + $scope.dskBlock(publicKey, 2)
                +  $scope.dskBlock(publicKey, 3)
                +  $scope.dskBlock(publicKey, 4)
                +  $scope.dskBlock(publicKey, 5)
                +  $scope.dskBlock(publicKey, 6)
                +  $scope.dskBlock(publicKey, 7)
                +  $scope.dskBlock(publicKey, 8);
            $scope.controlDh.controller.publicKeyPin = (publicKey[0] << 8) + publicKey[1];
        }



        $scope.controlDh.inclusion.alert = {
            message: $scope._t('nm_controller_state_' + controllerState),
            status: 'alert-warning',
            icon: 'fa-spinner fa-spin'
        };

        if([1,5].indexOf(controllerState) == -1) {
            if($scope.controlDh.includeToNetworkTimeout) {
                $timeout.cancel($scope.controlDh.includeToNetworkTimeout);
                $scope.controlDh.network.modal = true;
            }
        }

        // Controller state switch
        switch (controllerState) {
            case 0:
                // Device inclusion
                $scope.controlDh.inclusion.alert = {
                    message: $scope._t('nm_controller_state_' + controllerState),
                    status: 'alert-info',
                    icon: false
                };
                $scope.controlDh.inclusion.alertPrimary = $scope.alert;
                // Network inclusion
                if ($scope.controlDh.network.inclusionProcess) {
                    if ($scope.controlDh.network.include) {
                        if (!$scope.controlDh.network.modal) {
                            $scope.controlDh.network.alert = {
                                message: $scope._t('nm_controller_state_10'),
                                status: 'alert-warning',
                                icon: 'fa-spinner fa-spin'
                            };
                            $scope.controlDh.network.inclusionProcess = 'processing';
                        } else {
                            $scope.controlDh.network.alert = {
                                message: $scope._t('success_controller_include'),
                                status: 'alert-success',
                                icon: 'fa-smile-o'
                            };
                            $scope.controlDh.network.inclusionProcess = false;
                            if($scope.controlDh.controller.isRealPrimary || !$scope.controlDh.controller.isInOthersNetwork) {
                                // Reloading a page
                                $timeout(function() {
                                    $window.location.reload();
                                }, 3000);
                            }

                        }
                    }

                } else {
                    $scope.controlDh.network.alert = $scope.alert;
                }
                // Factory default
                if($scope.controlDh.factory.process){
                    $scope.toggleRowSpinner('controller.SetDefault()');
                    $scope.controlDh.factory.process = false;
                    $scope.controlDh.factory.alert = {
                        message: $scope._t('reloading'),
                        status: 'alert-warning',
                        icon: 'fa-spinner fa-spin'
                    };
                    // Reloading a page
                    $timeout(function(){
                        $window.location.reload();
                    }, 3000 );
                }
                break;
            case 1:
                // Device inclusion
                if ($scope.controlDh.controller.isSIS || $scope.controlDh.controller.isPrimary) {
                    $scope.controlDh.inclusion.alertPrimary = {
                        message: $scope._t('nm_controller_sis_or_primary'),
                        status: 'alert-info',
                        icon: false
                    };
                }
                if (!$scope.controlDh.controller.isSIS && !$scope.controlDh.controller.isPrimary) {
                    $scope.controlDh.inclusion.alertPrimary = {
                        message: $scope._t('nm_controller_not_sis_or_primary'),
                        status: 'alert-danger',
                        icon: false
                    };
                }

                break;
            case 9:
                // Network inclusion
                $scope.controlDh.network.inclusionProcess = 'processing';
                if ($scope.controlDh.controller.isRealPrimary) {
                    $scope.controlDh.network.alert = {
                        message: $scope._t('nm_controller_state_11'),
                        status: 'alert-warning',
                        icon: 'fa-spinner fa-spin'
                    };
                } else {
                    $scope.controlDh.network.alert = {
                        message: $scope._t('nm_controller_state_9_exclude'),
                        status: 'alert-warning',
                        icon: 'fa-spinner fa-spin'
                    };

                }
                break;
            case 17:
                // Network inclusion
                $scope.controlDh.network.alert = {
                    message: $scope._t('nm_controller_state_17'),
                    status: 'alert-danger',
                    icon: 'fa-exclamation-triangle'
                };
                $scope.controlDh.network.inclusionProcess = 'error';
                break;
            case 20:
                // Factory default
                $scope.controlDh.factory.process = true;
                $scope.controlDh.factory.alert = {
                    message: $scope._t('nm_controller_state_20'),
                    status: 'alert-success',
                    icon: 'fa-smile-o'
                };
                break;

            default:
                break;
        }
    }

    /**
     * Set device data
     * @param {object} ZWaveAPIData
     */
    function setDeviceData(ZWaveAPIData) {
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            if (nodeId == 255 || nodeId == ZWaveAPIData.controller.data.nodeId.value || node.data.isVirtual.value) {
                return;
            }
            // SUC/SIS nodes
            if (node.data.basicType.value == 2) {
                if ($scope.controlDh.nodes.sucSis.indexOf(nodeId) === -1) {
                    $scope.controlDh.nodes.sucSis.push(nodeId);
                }
            }
            // Devices
            if (!$scope.controlDh.nodes.all[nodeId]) {
                $scope.controlDh.nodes.all[nodeId] = $filter('deviceName')(nodeId, node);
            }

            // Failed and Batteries nodes
            if (ZWaveAPIData.controller.data.isPrimary.value) {
                if (node.data.isFailed.value) {
                    if ($scope.controlDh.nodes.failedNodes.indexOf(nodeId) === -1) {
                        $scope.controlDh.nodes.failedNodes.push(nodeId);
                    }
                }
                if (!node.data.isListening.value && !node.data.isFailed.value) {
                    if ($scope.controlDh.nodes.failedBatteries.indexOf(nodeId) === -1) {
                        $scope.controlDh.nodes.failedBatteries.push(nodeId);
                    }
                }
            }
            ;

        });
    }

    /**
     * Set inclusion data
     * @param {object} data
     */
    function setInclusionData(data, update) {
        var deviceIncId, deviceExcId;
        // console.log('Learn mode 2: ' + $scope.learnMode);
        if ('controller.data.lastIncludedDevice' in update) {
            deviceIncId = update['controller.data.lastIncludedDevice'].value;
        }
        if ('controller.data.lastExcludedDevice' in update) {
            deviceExcId = update['controller.data.lastExcludedDevice'].value;
        }
        if (!deviceIncId && !deviceExcId) {
            //console.log('Not Exclude/Include')
            return;
        }
        /**
         * Last icluded device
         */

        if (deviceIncId) {
            var node = data.devices[deviceIncId];
            var givenName = $filter('deviceName')(deviceIncId, node);
            var updateTime = $filter('isTodayFromUnix')(data.controller.data.lastIncludedDevice.updateTime);
            //Run CMD
            /*var cmd = 'devices[' + deviceIncId + '].data.givenName.value=\'' + givenName + '\'';
             dataService.runZwaveCmd(cfg.store_url + cmd);*/
            $scope.controlDh.inclusion.lastIncludedDeviceId = deviceIncId;
            $scope.controlDh.inclusion.lastIncludedDevice = {
                message: $scope._t('nm_last_included_device') + '  (' + updateTime + ')  <a href="#configuration/interview/' + deviceIncId + '"><strong>' + givenName + '</strong></a>',
                status: 'alert-success',
                icon: 'fa-smile-o'
            };
        }

        /**
         * Last excluded device
         */
        if (deviceExcId) {
            var updateTime = $filter('isTodayFromUnix')(data.controller.data.lastExcludedDevice.updateTime);
            if (deviceExcId != 0) {
                var txt = $scope._t('txt_device') + ' # ' + deviceExcId + ' ' + $scope._t('nm_excluded_from_network');
            } else {
                var txt = $scope._t('nm_last_excluded_device_from_foreign_network');
            }

            //$scope.controlDh.inclusion.lastExcludedDevice = txt + ' (' + updateTime + ')';
            $scope.controlDh.inclusion.lastExcludedDevice = {
                message: txt + ' (' + updateTime + ')',
                status: 'alert-success',
                icon: 'fa-smile-o'
            };
        }
    }

    /**
     * Check interview
     * @param {int} nodeId
     */
    function checkInterview(nodeInstances) {
        if ($scope.controlDh.inclusion.grantKeys.show
            || $scope.controlDh.inclusion.verifyDSK.show
            || ($scope.controlDh.inclusion.grantKeys.done  && $scope.controlDh.inclusion.verifyDSK.done)) {
            return;
        }

        var securityS2 = nodeInstances[0].commandClasses[159];

        if (securityS2 && securityS2.data.requestedKeys.value && !$scope.controlDh.inclusion.grantKeys.done) {
            $scope.controlDh.inclusion.input.keysRequested.S0 = securityS2.data.requestedKeys.S0.value;
            $scope.controlDh.inclusion.input.keysRequested.S2Unauthenticated = securityS2.data.requestedKeys.S2Unauthenticated.value;
            $scope.controlDh.inclusion.input.keysRequested.S2Authenticated = securityS2.data.requestedKeys.S2Authenticated.value;
            $scope.controlDh.inclusion.input.keysRequested.S2Access = securityS2.data.requestedKeys.S2Access.value;
            $scope.controlDh.inclusion.grantKeys.show = true;
            var countDownGrantKeys = function () {
                $scope.controlDh.inclusion.grantKeys.countDown--;
                if ($scope.controlDh.inclusion.grantKeys.countDown === 0) {
                    $interval.cancel($scope.controlDh.inclusion.grantKeys.interval);
                    // cancel
                    $scope.controlDh.inclusion.input.keysRequested.S0 = $scope.controlDh.inclusion.input.keysRequested.S2Unauthenticated = $scope.controlDh.inclusion.input.keysRequested.S2Authenticated = $scope.controlDh.inclusion.input.keysRequested.S2Access = false;
                    $scope.handleInclusionS2GrantKeys($scope.controlDh.inclusion.input.keysRequested,true);
                }
            };
            $scope.controlDh.inclusion.grantKeys.interval = $interval(countDownGrantKeys, 1000);
            return;
        }

        if (securityS2 && securityS2.data.publicKey.value.length && !$scope.controlDh.inclusion.verifyDSK.done) {
            $scope.controlDh.inclusion.input.publicKey = securityS2.data.publicKey.value;
            $scope.controlDh.inclusion.input.publicKeyAuthenticationRequired = securityS2.data.publicKeyAuthenticationRequired.value;
            $scope.controlDh.inclusion.input.dskPin = $scope.dskBlock($scope.controlDh.inclusion.input.publicKey, 1);
            $scope.controlDh.inclusion.verifyDSK.show = true;
            var countDownVerifyDSK = function () {
                $scope.controlDh.inclusion.verifyDSK.countDown--;
                if ($scope.controlDh.inclusion.verifyDSK.countDown === 0) {
                    $interval.cancel($scope.controlDh.inclusion.verifyDSK.interval);
                    $scope.handleInclusionVerifyDSK(false,true);
                }
            };
            $scope.controlDh.inclusion.verifyDSK.interval = $interval(countDownVerifyDSK, 1000);
            return;
        }
    }

    /**
     * Check S2 CC interview
     */
    function  checkS2Interview(nodeId) {
        dataService.loadZwaveApiData(true).then(function (response) {
                var interviewDone = $filter('hasNode')(response, 'devices.' + nodeId + '.instances.0.commandClasses.159.data.interviewDone.value');
                console.log('S2 interview DONE: ' + interviewDone)
                if(interviewDone){
                    $scope.controlDh.inclusion.alertS2 = {
                            message: $scope._t('auth_successful'),
                            status: 'alert-success',
                            icon: 'fa-smile-o'
                        };
                }else{
                    $scope.controlDh.inclusion.alertS2 = {
                        message: $scope._t('auth_failed'),
                        status: 'alert-danger',
                        icon: 'fa-exclamation-triangle'
                    };
                }


            }, function (error) {});
    };
});

/**
 * Shall inclusion be done using Security.
 * @class SetSecureInclusionController
 *
 */
appController.controller('SetSecureInclusionController', function ($scope) {
    /**
     * Set inclusion as Secure/Unsecure.
     * state=true Set as secure.
     * state=false Set as unsecure.
     * @param {string} cmd
     */
    $scope.setSecureInclusion = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };
});

/**
 * This turns the Z-wave controller into an inclusion/exclusion mode that allows including/excluding a device.
 * @class IncludeDeviceController
 *
 */
appController.controller('IncludeExcludeDeviceController', function ($scope, $route) {
    /**
     * Start Inclusion of a new node.
     * Turns the controller into an inclusion mode that allows including a device.
     * flag=1 for starting the inclusion mode
     * flag=0 for stopping the inclusion mode
     * @param {string} cmd
     */
    $scope.addNodeToNetwork = function (cmd) {
        //$scope.controlDh.inclusion.lastIncludedDevice = false;
        $scope.runZwaveCmd(cmd);
        $route.reload();
    };

    /**
     * Stop Exclusion of a node.
     * Turns the controller into an exclusion mode that allows excluding a device.
     * flag=1 for starting the exclusion mode
     * flag=0 for stopping the exclusion mode
     * @param {string} cmd
     */
    $scope.removeNodeToNetwork = function (cmd) {
        //$scope.controlDh.inclusion.lastExcludedDevice = false;
        $scope.runZwaveCmd(cmd);
        $route.reload();
    };
});

/**
 * It will change Z-wave controller own Home ID to the Home ID of the new network
 * and it will learn all network information from the including controller of the new network.
 * All existing relationships to existing nodes will get lost
 * when the Z-Way controller joins a dierent network
 * @class IncludeDifferentNetworkController
 *
 */
appController.controller('IncludeDifferentNetworkController', function ($scope, $timeout, $window, cfg, dataService) {
    /**
     * Include to network
     * @param {string} cmd
     * @param {string} confirm
     */
    $scope.includeToNetwork = function (cmd, confirm) {
        if (_.isString(confirm)) {// Confirm is needed
            alertify.confirm(confirm, function () {
                $scope.runIncludeToNetwork(cmd);
            });
        } else {
            $scope.runIncludeToNetwork(cmd);
        }


    };

    /**
     * Process network inclusion
     * @param {string} cmd
     */
    $scope.runIncludeToNetwork = function (cmd) {
        var timeout = 240000;
        $scope.toggleRowSpinner(cmd);
        if (cmd === 'controller.SetLearnMode(1)') {
            $scope.controlDh.network.include = true;
            $scope.controlDh.network.inclusionProcess = 'processing';
        } else {
            $scope.controlDh.network.include = false;
            $scope.controlDh.network.inclusionProcess = false;
        }
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {
            //console.log('Run cmd: ', cfg.store_url + cmd)
            $scope.controlDh.includeToNetworkTimeout = $timeout(function() {
                dataService.runZwaveCmd(cfg.store_url + 'controller.SetLearnMode(0)');
                //console.log('Running controller.SetLearnMode(0) after timeout')
                // if(cfg.app_type === 'installer'){
                //     $window.location.reload();
                // }else{
                //     $scope.controlDh.network.modal = true;
                // }
                $scope.controlDh.network.modal = true;
            }, timeout);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_load_data') + '\n' + cmd);
        });

    };

    $scope.requestNetworkUpdate = function (cmd, message, id) {
        $scope.controlDh.alert = {
            message: message,
            status: 'alert-info',
            icon: false
        };
        $scope.toggleRowSpinner(id);
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function () {
            $timeout(function () {
                $scope.controlDh.alert = false;
                $scope.toggleRowSpinner();
            }, 2000);
        }, function () {
            $scope.controlDh.alert = false;
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_load_data'));
        });
    };

    /**
     * Close network modal
     * @param {string} modal
     * @param $event
     */
    $scope.closeNetworkModal = function (modal, $event) {
        $scope.controlDh.network.inclusionProcess = false;
        $scope.controlDh.network.modal = false;
        $window.location.reload();

    };

    /// --- Private functions --- ///
});

/**
 * Restore Z-Wave controller from the backup
 * @class BackupRestoreController
 *
 */
appController.controller('BackupRestoreController', function ($scope, $upload, $window, $filter,$timeout,deviceService, cfg, _) {
    $scope.restore = {
        allow: false,
        input: {
            restore_chip_info: '0'
        }
    };

    /**
     * Send request to restore from backup
     * todo: Replace $upload vith version from the SmartHome
     * @returns {void}
     */
    $scope.restoreFromBackup = function ($files) {
        var chip = $scope.restore.input.restore_chip_info;
        var url = cfg.server_url + cfg.restore_url + '?restore_chip_info=' + chip;
        var file;
        // Getting a file object
         if($files.length > 0){
            file = $files[0];
        }else{
            alertify.alertError($scope._t('restore_backup_failed'));
             return;
        }
        // File extension validation
        if (cfg.upload.restore_from_backup.extension.indexOf($filter('fileExtension')(file.name)) === -1) {
            alertify.alertError(
                $scope._t('upload_format_unsupported', {'__extension__': $filter('fileExtension')(file.name)}) + ' ' +
                $scope._t('upload_allowed_formats', {'__extensions__': cfg.upload.restore_from_backup.extension.toString()})
            );
            return;
        }

        // Uploading file
        $upload.upload({
            url: url,
            fileFormDataName: 'config_backup',
            file: file
        }).progress(function (evt) {
            $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('restore_wait')};
        }).success(function (data, status, headers, config) {
            $scope.loading = false;
            $scope.handleModal();
            if (data && data.replace(/(<([^>]+)>)/ig, "") !== "null") {//Error
                alertify.alertError($scope._t('restore_backup_failed'));
            } else {// Success
                deviceService.showNotifier({message: $scope._t('restore_done_reload_ui')});
                // Reloading a page
                $timeout( function(){
                    $window.location.reload();
                }, 3000 );

            }
        }).error(function (data, status) {
            $scope.loading = false;
            $scope.handleModal();
            alertify.alertError($scope._t('restore_backup_failed'));
        });
    };
});

/**
 * This controller will perform a soft restart and a reset of the Z-Wave controller chip.
 * @class ZwaveChipRebootResetController
 *
 */
appController.controller('ZwaveChipRebootResetController', function ($scope, cfg,dataService) {
    /**
     * This function will perform a soft restart of the  firmware of the Z-Wave controller chip
     * without deleting any network information or setting.
     * @param {string} cmd
     */
    $scope.serialAPISoftReset = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * This function erases all values stored in the Z-Wave chip and sent the chip back to factory defaults.
     * This means that all network information will be lost without recovery option.
     *  @param {string} cmd
     */
    $scope.setDefault = function (cmd) {
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {
            $scope.toggleRowSpinner(cmd);
        }, function (error) {
            $scope.toggleRowSpinner();
          alertify.alertError($scope._t('error_update_data') + '\n' + cmd);
        });
       /* $scope.$watchCollection('controlDh', function (newVal, oldVal) {
            console.log(newVal.controller.controllerState)
            console.log(oldVal.controller.controllerState)
        });*/
        //console.log($scope.controlDh.controller.controllerState)
        // $scope.handleModal('restoreModal');
        //$window.location.reload();
    };
});

/**
 * Change Z-Wave Z-Stick 4 frequency.
 * @class ChangeFrequencyController
 *
 */
appController.controller('ChangeFrequencyController', function ($scope, $timeout) {
    /**
     * Send Configuration ZMEFreqChange
     * @param {string} cmd
     */
    $scope.frequency = {
        arrays: {
            EuRuInCn: ['EU', 'RU', 'IN', 'CN'],
            UsIl: ['US', 'IL'],
            AnzHk: ['ANZ', 'HK'],
            KrJp: ['KR', 'JP']
        },
        currentFreqArr: '',
        currentFreq: $scope.controlDh.controller.frequency
    };

    if ($scope.frequency.currentFreq &&
        ['unsupported', 'unknown', 'undefined'].indexOf($scope.frequency.currentFreq) < 0) {
        Object.keys($scope.frequency.arrays).forEach(function (freqBand) {
            if ($scope.frequency.arrays[freqBand].indexOf($scope.frequency.currentFreq) > -1) {
                $scope.frequency.currentFreqArr = freqBand;
                return;
            }
        })
    } else {
        $scope.frequency.currentFreqArr = null;
    }

    $scope.zmeFreqChange = function (cmd) {
        $scope.runZwaveCmd(cmd);
        $timeout(function () {
            $scope.frequency.currentFreq = $scope.controlDh.controller.frequency;
        }, 1000);


    };
});

/**
 * The controller will then mark the device as 'failed'
 * but will keep it in the current network con guration.
 * @class RemoveFailedNodeController
 *
 */
appController.controller('RemoveFailedNodeController', function ($scope, $timeout) {
    /**
     * Remove failed node from network.
     * nodeId=x Node id of the device to be removed
     * @param {string} cmd
     */
    $scope.removeFailedNode = function (cmd) {
        $scope.runZwaveCmd(cmd);
        $timeout(function () {
            $scope.controlDh.removed.failedNodes.push($scope.controlDh.input.failedNodes);
            $scope.controlDh.input.failedNodes = 0;
        }, 1000);
    };
});

/**
 * The controller replaces a failed node by a new node.
 * @class ReplaceFailedNodeController
 *
 */
appController.controller('ReplaceFailedNodeController', function ($scope, $timeout) {
    /**
     * Replace failed node with a new one.
     * nodeId=x Node Id to be replaced by new one
     * @param {string} cmd
     */
    $scope.replaceFailedNode = function (cmd) {
        $scope.runZwaveCmd(cmd);
        $timeout(function () {
            $scope.controlDh.removed.replaceNodes.push($scope.controlDh.input.replaceNodes);
            $scope.controlDh.input.replaceNodes = 0;
        }, 1000);
    };
});

/**
 * Allows marking battery-powered devices as failed.
 * @class BatteryDeviceFailedController
 *
 */
appController.controller('BatteryDeviceFailedController', function ($scope, $timeout) {
    /**
     * Sets the internal 'failed' variable of the device object.
     * nodeId=x Node Id to be marked as failed.
     * @param {array} cmdArr
     */
    $scope.markFailedNode = function (cmdArr) {
        angular.forEach(cmdArr, function (v, k) {
            $scope.runZwaveCmd(v);

        });
        //$scope.controlDh.input.failedBatteries = 0;
        $timeout(function () {
            $scope.controlDh.removed.failedBatteries.push($scope.controlDh.input.failedBatteries);
            $scope.controlDh.input.failedBatteries = 0;
        }, 1000);

    };
});

/**
 * The controller change function allows to handover the primary function to a different controller in
 * the network. The function works like a normal inclusion function but will hand over the primary
 * privilege to the new controller after inclusion. Z-Way will become a secondary controller of the network.
 * @class ControllerChangeController
 *
 */
appController.controller('ControllerChangeController', function ($scope) {
    /**
     * Set new primary controller
     * Start controller shift mode if 1 (True), stop if 0 (False)
     *  @param {string} cmd
     */
    $scope.controllerChange = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };
});

/**
 * This will call the Node Information Frame (NIF) from all devices in the network.
 * @class RequestNifAllController
 *
 */
appController.controller('RequestNifAllController', function ($scope, $timeout, $window, cfg, dataService, deviceService) {
    /**
     * Request NIF from all devices
     */
    $scope.requestNifAll = function (spin, $event) {
        $scope.toggleRowSpinner(spin);
        $scope.controlDh.process = true;
        dataService.runZwaveCmd(cfg.call_all_nif).then(function (response) {
            deviceService.showNotifier({message: $scope._t('nif_request_complete')});
            $scope.toggleRowSpinner();
            $scope.controlDh.process = false;

            $scope.controlDh.network.inclusionProcess = false;
            $scope.controlDh.network.modal = false;
            $scope.handleModal();
            $timeout( function(){
                $window.location.reload();
            }, 3000 );
        }, function (error) {
            $scope.toggleRowSpinner();
            deviceService.showNotifier({message: $scope._t('error_nif_request'), type: 'error'});
            $scope.controlDh.process = false;
            //$window.location.reload();
        });
    };
});

/**
 * This will call the Node Information Frame (NIF) from the controller.
 * @class SendNodeInformationController
 *
 */
appController.controller('SendNodeInformationController', function ($scope) {
    /**
     * Send NIF of the stick
     * Parameter nodeId: Destination Node Id (NODE BROADCAST to send non-routed broadcast packet)
     * @param {string} cmd
     */
    $scope.sendNodeInformation = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };
});

/**
 * This controller allows controlling the SUC/SIS function for the Z-Wave network.
 * @class SucSisController
 *
 */
appController.controller('SucSisController', function ($scope) {
    /**
     * Get the SUC Node ID from the network.
     *  @param {string} cmd
     */
    $scope.getSUCNodeId = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * Request network topology update from SUC/SIS.
     *  @param {string} cmd
     */
    $scope.requestNetworkUpdate = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * Assign SUC function to a node in the network that is capable of running there SUC function
     * nodeId=x Node id to be assigned as SUC
     *  @param {string} cmd
     */
    $scope.setSUCNodeId = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * Assign SIS role to a device
     * nodeId=x Node id to be assigned as SIS
     * @param {string} cmd
     */
    $scope.setSISNodeId = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * Revoke SUC/SIS role from a device
     * nodeId=x Node id to be disabled as SUC
     *  @param {string} cmd
     */
    $scope.disableSUCNodeId = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };


});

/**
 * This sets Promiscuous mode to true/false.
 * @class SetPromiscuousModeController
 *
 */
appController.controller('SetPromiscuousModeController', function ($scope) {
    /**
     * Sets promiscuous mode
     * @param {string} cmd
     */
    $scope.setPromiscuousMode = function (cmd) {
        $scope.runZwaveCmd(cmd, 1000, true);
    };
});

/**
 * This tests QR code
 * @class S2DskController
 *
 */
appController.controller('S2DskController', function ($scope) {
    var qrcode = new QRCode("qrcode_network", {
        text:  $scope.controlDh.controller.publicKeyQr,
        width: 200,
        height: 200,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
});