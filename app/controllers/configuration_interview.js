/**
 * @overview This controller renders and handles device interview stuff.
 * @author Martin Vach
 */

/**
 * Device interview controller
 * @class ConfigInterviewController
 *
 */
appController.controller('ConfigInterviewController', function ($scope, $routeParams, $route, $location, $cookies, $filter, $http,  $timeout,$interval,cfg,dataService, deviceService, myCache) {
    $scope.devices = [];
    $scope.deviceName = '';
    $scope.deviceId = 0;
    //$scope.activeTab = 'interview';
    $scope.activeUrl = 'configuration/interview/';
    $cookies.tab_config = 'interview';
    $scope.modelSelectZddx = false;
    $scope.zwaveInterview = {
        interval: null,
        progress: 0,
        commandClassesCnt: 0,
        interviewDoneCnt: 0
    },
    $scope.isController = false;
    $scope.showInterview = true;

    // Interview data
    $scope.descriptionCont;
    $scope.deviceZddx = [];

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.zwaveInterview.interval);
    });

    // Load data
    $scope.load = function (nodeId) {
        //nodeId = parseInt(nodeId,10);
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
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

            //check if node is controller
            $scope.isController = parseInt(nodeId, 10) === cfg.controller.zwayNodeId;

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.deviceName = $filter('deviceName')(nodeId, node);
            //hide interview if node is controller
            $scope.showInterview = !$scope.isController;
            checkInterview(node);
            setData(ZWaveAPIData, nodeId);
            $scope.refreshZwaveData();
           /* dataService.loadJoinedZwaveData(ZWaveAPIData).then(function(response) {
                node = response.data.joined.devices[nodeId];
                refreshData(node, nodeId, response.data.joined);
                $scope.ZWaveAPIData = ZWaveAPIData;
            });*/
        }, function(error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.load($routeParams.nodeId);

    /**
     * Refresh zwave data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                var node = response.data.joined.devices[$routeParams.nodeId];
                refreshData(node, $routeParams.nodeId, response.data.joined);
            });
        };
        $scope.zwaveInterview.interval = $interval(refresh, $scope.cfg.interval);
    };

    // Redirect to device
    $scope.redirectToDevice = function (deviceId) {
        if (deviceId) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    /**
     * Request NIF of a device
     * Node Id to be requested for a NIF
     * @param {string} cmd
     */
    $scope.requestNodeInformation = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * Purge all command classes and start interview based on device's NIF
     * @param {string} cmd
     */
    $scope.interviewForce = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * Purge all command classes and start interview for a device
     * @param {string} cmd
     */
    $scope.interviewForceDevice = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * Show modal CommandClass dialog
     * @param target
     * @param $event
     * @param instanceId
     * @param ccId
     * @param type
     */
    $scope.handleCmdClassModal= function (target, $event,instanceId, ccId, type) {
        var node = $scope.ZWaveAPIData.devices[$routeParams.nodeId];
        var ccData;
        switch (type) {
            case 'cmdData':
                ccData = $filter('hasNode')(node, 'instances.' + instanceId + '.commandClasses.' + ccId + '.data');
                break;
            case 'cmdDataIn':
                ccData = $filter('hasNode')(node, 'instances.' + instanceId + '.data');
                break;
            default:
                ccData = $filter('hasNode')(node, 'data');
                break;
        }
        var cc = deviceService.configGetCommandClass(ccData, '/', '');

        $scope.commandClass = deviceService.configSetCommandClass(cc);
        $scope.handleModal(target, $event);
        //$(target).modal();
    };

    /**
     * Rename Device action
     */
    $scope.renameDevice = function (form,deviceName,spin) {
       if(!form.$dirty){
            return;
        }
        var timeout = 1000;
        // encodeURIComponent(myUrl);
        //var cmd = 'devices[' + $scope.deviceId + '].data.givenName.value="' + escape(deviceName) + '"';
        var cmd = 'devices[' + $scope.deviceId + '].data.givenName.value="' + encodeURIComponent(deviceName) + '"';
        $scope.toggleRowSpinner(spin);
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {

            $timeout(function(){
                form.$setPristine();
                $scope.toggleRowSpinner();
                $scope.load($routeParams.nodeId);

            }, timeout);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_load_data') + '\n' + cmd);
        });
    };

    /// --- Private functions --- ///
    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData, nodeId, refresh) {
        var node = ZWaveAPIData.devices[nodeId];
        if (!node) {
            return;
        }
        $scope.showDevices = true;
        $scope.deviceName = $filter('deviceName')(nodeId, node);
        $scope.deviceNameId = $filter('deviceName')(nodeId, node) + ' (#' + nodeId + ')';
        $scope.hasBattery = 0x80 in node.instances[0].commandClasses;
        var zddXmlFile = null;
        if (angular.isDefined(node.data.ZDDXMLFile)) {
            zddXmlFile = node.data.ZDDXMLFile.value;
            $scope.deviceZddxFile = node.data.ZDDXMLFile.value;
        }

        $scope.interviewCommands = deviceService.configGetInterviewCommands(node, ZWaveAPIData.updateTime);
        $scope.interviewCommandsDevice = node.data;
        if (zddXmlFile && zddXmlFile !== 'undefined') {
            var cachedZddXml = myCache.get(zddXmlFile);
            // Uncached file
            //if (!cachedZddXml) {
            $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function (response) {
                var x2js = new X2JS();
                var zddXml = x2js.xml_str2json(response.data);
                myCache.put(zddXmlFile, zddXml);
                $scope.descriptionCont = setCont(node, nodeId, zddXml, ZWaveAPIData, refresh);


            });
            // todo: deprecated
            //} else {
            //$scope.descriptionCont = setCont(node, nodeId, cachedZddXml, ZWaveAPIData, refresh);
            //}

        } else {

            $scope.descriptionCont = setCont(node, nodeId, null, ZWaveAPIData, refresh);
        }
    }

    /**
     * Check interview
     */
    function checkInterview(node) {
        $scope.zwaveInterview.commandClassesCnt = 0;
        $scope.zwaveInterview.interviewDoneCnt = 0;
            if (!node) {
                return;
            }
            if (!node.data.nodeInfoFrame.value) {
                return;
            }
            for (var iId in node.instances) {
               /* if (Object.keys(node.instances[iId].commandClasses).length < 1) {
                    return;
                }*/
                //angular.extend($scope.zwaveInterview, {commandClassesCnt: Object.keys(node.instances[iId].commandClasses).length});
                $scope.zwaveInterview.commandClassesCnt +=  Object.keys(node.instances[iId].commandClasses).length;
                for (var ccId in node.instances[iId].commandClasses) {
                    var cmdClass = node.instances[iId].commandClasses[ccId];
                    // Is interview done?
                    if (cmdClass.data.interviewDone.value) {

                        // If an interview is done deleting from interviewNotDone
                        // Extending an interview counter
                        angular.extend($scope.zwaveInterview,
                            {interviewDoneCnt: $scope.zwaveInterview.interviewDoneCnt + 1}
                        );
                    }
                }
            }

            var commandClassesCnt = $scope.zwaveInterview.commandClassesCnt;
            var intervewDoneCnt = $scope.zwaveInterview.interviewDoneCnt;
            var progress = ((intervewDoneCnt / commandClassesCnt) * 100).toFixed();
            /*console.log('commandClassesCnt: ', commandClassesCnt);
            console.log('intervewDoneCnt: ', intervewDoneCnt);
            console.log('Percent %: ', progress);*/
            $scope.zwaveInterview.progress = (progress >= 100 ? 100 : progress);

    }
    ;

    /**
     * Device description
     */
    function setCont(node, nodeId, zddXml, ZWaveAPIData, refresh) {
        // Set device data
        var deviceImage = 'app/images/no_device_image.png';
        var deviceDescription = '';
        var productName = '';
        var inclusionNote = '';
        var brandName = node.data.vendorString.value;
        var wakeupNote = '';
        var ZWavePlusRoles = [];
        var securityInterview = '';
        var deviceDescriptionAppVersion = parseInt(node.data.applicationMajor.value, 10);
        var deviceDescriptionAppSubVersion = parseInt(node.data.applicationMinor.value, 10);
        var isListening = node.data.isListening.value;
        // Security S2
        var hasSecurityS2Cc = deviceService.hasCommandClass(node,159);
        var securityS2Key = deviceService.getS2GrantedKeys(hasSecurityS2Cc);

        var hasWakeup = !isListening && !node.data.sensor250.value && !node.data.sensor1000.value;
        if (isNaN(deviceDescriptionAppVersion))
            deviceDescriptionAppVersion = '-';
        if (isNaN(deviceDescriptionAppSubVersion))
            deviceDescriptionAppSubVersion = '-';
        var zwNodeName = '';
        if (0x77 in node.instances[0].commandClasses) {
            // NodeNaming
            zwNodeName = node.instances[0].commandClasses[0x77].data.nodename.value;
            if (zwNodeName != '') {
                zwNodeName = ' (' + zwNodeName + ')';
            }


        }
        // Security interview
        if (0x98 in node.instances[0].commandClasses) {
            securityInterview = node.instances[0].commandClasses[0x98].data.securityAbandoned.value;
        }

        var sdk;
        if (!$scope.isController && node.data.SDK.value == '') {
            sdk = '(' + node.data.ZWProtocolMajor.value + '.' + node.data.ZWProtocolMinor.value + ')';
        } else {
            sdk = $scope.isController? ZWaveAPIData.controller.data.SDK.value: node.data.SDK.value;
        }

        // Command class
        var ccNames = [];
        angular.forEach($scope.interviewCommands, function (v, k) {
            ccNames.push(v.ccName);
        });
        // Has device a zddx XML file
        if (zddXml) {
            deviceDescription = deviceService.configGetZddxLang($filter('hasNode')(zddXml, 'ZWaveDevice.deviceDescription.description.lang'), $scope.lang);
            inclusionNote = deviceService.configGetZddxLang($filter('hasNode')(zddXml, 'ZWaveDevice.deviceDescription.inclusionNote.lang'), $scope.lang);
            wakeupNote = deviceService.configGetZddxLang($filter('hasNode')(zddXml, 'ZWaveDevice.deviceDescription.wakeupNote.lang'), $scope.lang);

            if ('brandName' in zddXml.ZWaveDevice.deviceDescription) {
                brandName = zddXml.ZWaveDevice.deviceDescription.brandName;
            }

            if ('productName' in zddXml.ZWaveDevice.deviceDescription) {
                productName = zddXml.ZWaveDevice.deviceDescription.productName;
            }

            if (angular.isDefined(zddXml.ZWaveDevice.resourceLinks)) {
                deviceImage = zddXml.ZWaveDevice.resourceLinks.deviceImage._url;
            }
            /**
             * TODO: finish ZWavePlusRoles
             */
            if (angular.isDefined(zddXml.ZWaveDevice.RoleTypes)) {
                angular.forEach(zddXml.ZWaveDevice.RoleTypes, function (v, k) {
                    ZWavePlusRoles.push(v);
                });
            }
        }

        // Set device image
        $scope.deviceImage = deviceImage;
        // OBJ
        var obj = {};
        obj["a"] = {"key": "device_node_id", "val": nodeId};
        //obj["b"] = {"key": "device_node_name", "val": $filter('deviceName')(nodeId, node)};
        obj["c"] = {"key": "device_node_type", "val": ''};
        obj["d"] = {"key": "device_description_brand", "val": brandName};
        obj["e"] = {"key": "device_description_device_type", "val": node.data.deviceTypeString.value};
        obj["f"] = {"key": "device_description_product", "val": productName};
        obj["g"] = {"key": "device_description_description", "val": deviceDescription};
        obj["h"] = {"key": "device_description_inclusion_note", "val": inclusionNote};
        if(hasWakeup){
            obj["i"] = {"key": "device_description_wakeup_note", "val": wakeupNote};
        }

       // obj["j"] = {"key": "device_description_interview", "val": deviceService.configInterviewStage(ZWaveAPIData, nodeId, $scope.languages)};
        //obj["k"] = {"key": "device_interview_indicator", "val": interviewDone};
        obj["l"] = {"key": "device_sleep_state", "val": deviceService.configDeviceState(node, $scope.languages)};
        obj["m"] = {"key": "device_description_app_version", "val": deviceDescriptionAppVersion + '.' + deviceDescriptionAppSubVersion};
        obj["o"] = {"key": "device_description_sdk_version", "val": sdk};
        obj["p"] = {"key": "command_class", "val": ccNames};
        obj["q"] = {"key": "zwave_role_type", "val": ZWavePlusRoles.join(', ')};
        if (deviceService.isLocalyReset(node)) {
            obj["r"] = {"key": "device_reset_locally", "val": '<i class="' + $filter('checkedIcon')(true) + '"></i>'};
        }
        if (typeof securityInterview === 'boolean') {
            obj["s"] = {"key": "device_security_interview", "val": '<i class="' + $filter('checkedIcon')(securityInterview === true ? false : true) + '"></i>'};
        }
        obj["u"] = {"key": "granted_keys", "val": securityS2Key.join()};
        return obj;

    }

    /**
     * Refresh description cont
     */
    function refreshData(node, nodeId, ZWaveAPIData) {
        checkInterview(node);
        $scope.interviewCommands = deviceService.configGetInterviewCommands(node, ZWaveAPIData.updateTime);
        // todo: deprecated
        //$('#device_sleep_state .config-interview-val').html(deviceService.configDeviceState(node, $scope.languages));
        //$('#device_description_interview .config-interview-val').html(deviceService.configInterviewStage(ZWaveAPIData, nodeId, $scope.languages));
    }
});
