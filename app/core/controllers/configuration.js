/**
 * Configuration controller
 * @author Martin Vach
 */
// Redirect to new version of configuration
appController.controller('ConfigRedirectController', function($routeParams, $location, $cookies, $filter) {
    var configUrl = 'configuration/interview';
    var nodeId = function() {
        var id = 1;
        if ($routeParams.nodeId == undefined) {
            id = (angular.isDefined($cookies.configuration_id) ? $cookies.configuration_id : 1);
        } else {
            id = $routeParams.nodeId;
        }
        return id;
    };
    if (nodeId() == $cookies.configuration_id) {
        if (angular.isDefined($cookies.config_url)) {
            configUrl = $cookies.config_url;
        }
    } else {
        configUrl = configUrl + '/' + nodeId();
    }
//    console.log('$routeParams.nodeId: ' +  nodeId())
//    console.log('$cookies.configuration_id: ' + $cookies.configuration_id)
//    console.log(configUrl)
//    return;
    $location.path(configUrl);
});
// Device configuration Interview controller
appController.controller('ConfigInterviewController', function($scope, $routeParams, $location, $cookies, $filter, $http, dataService, deviceService, myCache) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'interview';
    $scope.activeUrl = 'configuration/interview/';
    $cookies.tab_config = $scope.activeTab;

    // Interview data
    $scope.descriptionCont;
    $scope.deviceZddx = [];
    // Load data
    $scope.load = function(nodeId) {
        //nodeId = parseInt(nodeId,10);
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
            $scope.deviceName = $filter('deviceName')(nodeId, node);

            setData(ZWaveAPIData, nodeId);
            dataService.joinedZwaveData(function(data) {
                node = data.joined.devices[nodeId];
                refreshData(node, nodeId, data.joined);
//                    $scope.reset();
//                    setNavigation(data.joined);
//                    setData(data.joined, nodeId, true);
                $scope.ZWaveAPIData = ZWaveAPIData;
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

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    /**
     * Rename Device action
     */
    $scope.renameDevice = function(form) {
        var deviceId = $scope.deviceId;
        var givenName = $('#' + form + ' #device_name').val();
        var cmd = 'devices[' + deviceId + '].data.givenName.value=\'' + givenName + '\'';
        dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
        $('#config_device_name').html(givenName);
        $('#device_node_name').html(givenName);
        return;
    };

    // Store data on remote server
    $scope.store = function(btn) {
       dataService.runCmd($(btn).attr('data-store-url'), false, $scope._t('error_handling_data'));
    };
    
    // Show modal CommandClass dialog
    $scope.showModalCommandClass = function(target, instanceId, ccId, type) {
        var node = $scope.ZWaveAPIData.devices[$routeParams.nodeId];
        var ccData;
        switch(type){
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
         $(target).modal();
    };

    // Show modal dialog
    $scope.showModalInterview = function(target) {
        $(target).modal();
    };

    // Show modal device select dialog
    $scope.showModalDeviceSelect = function(target, nodeId, alert) {
        dataService.getSelectZDDX(nodeId, function(data) {
            $scope.deviceZddx = data;
        }, alert);
        $(target).modal();

    };

    // Change device select
    $scope.changeDeviceSelect = function(selector, target) {
        var imageFile = $(selector).find(':selected').data('image');
        var image;
        if (imageFile == undefined) {
            image = $scope._t('no_device_image');
        } else {
            image = '<img src="' + imageFile + '" />';
        }
        $(target).html(image);
    };

    // Update device zddx file
    $scope.runCmdDeviceSelect = function(nodeId, file) {
        var cmd = 'devices[' + nodeId + '].LoadXMLFile("' + file + '")';
        dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
        dataService.purgeCache();
        dataService.cancelZwaveDataInterval();
        $scope.load(nodeId);
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
            $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                var x2js = new X2JS();
                var zddXml = x2js.xml_str2json(response.data);
                myCache.put(zddXmlFile, zddXml);
                $scope.descriptionCont = setCont(node, nodeId, zddXml, ZWaveAPIData, refresh);


            });
            //} else {
            //$scope.descriptionCont = setCont(node, nodeId, cachedZddXml, ZWaveAPIData, refresh);
            //}

        } else {

            $scope.descriptionCont = setCont(node, nodeId, null, ZWaveAPIData, refresh);
        }
    }

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
        if (node.data.SDK.value == '') {
            sdk = '(' + node.data.ZWProtocolMajor.value + '.' + node.data.ZWProtocolMinor.value + ')';
        } else {
            sdk = node.data.SDK.value;
        }

        // Command class
        var ccNames = [];
        angular.forEach($scope.interviewCommands, function(v, k) {
            ccNames.push(v.ccName);
        });
        // Has device a zddx XML file
        if (zddXml) {
            // DEORECATED ----------------
            /*var lang = 'en';
            var langs = {
                "en": "1",
                "de": "0",
                "ru": "2"
            };
            if (angular.isDefined(langs[$scope.lang])) {
                lang = $scope.lang;
            }
            var langId = langs[lang];*/
            
            /*if (angular.isDefined(zddXml.ZWaveDevice.deviceDescription.description.lang[langId])) {
                deviceDescription = zddXml.ZWaveDevice.deviceDescription.description.lang[langId].__text;
            }*/
            
            /*if (angular.isDefined(zddXml.ZWaveDevice.deviceDescription.inclusionNote.lang[langId])) {
                inclusionNote = zddXml.ZWaveDevice.deviceDescription.inclusionNote.lang[langId].__text;
            }*/
            /*if (angular.isDefined(zddXml.ZWaveDevice.deviceDescription.wakeupNote.lang[langId])) {
                wakeupNote = zddXml.ZWaveDevice.deviceDescription.wakeupNote.lang[langId].__text;
            }*/
            // ----------------
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
                angular.forEach(zddXml.ZWaveDevice.RoleTypes, function(v, k) {
                    ZWavePlusRoles.push(v);
                });
            }
        }

        // Set device image
        $scope.deviceImage = deviceImage;
        // OBJ
        var obj = {};
        obj["a"] = {"key": "device_node_id", "val": nodeId};
        obj["b"] = {"key": "device_node_name", "val": $filter('deviceName')(nodeId, node)};
        obj["c"] = {"key": "device_node_type", "val": ''};
        obj["d"] = {"key": "device_description_brand", "val": brandName};
        obj["e"] = {"key": "device_description_device_type", "val": node.data.deviceTypeString.value};
        obj["f"] = {"key": "device_description_product", "val": productName};
        obj["g"] = {"key": "device_description_description", "val": deviceDescription};
        obj["h"] = {"key": "device_description_inclusion_note", "val": inclusionNote};
        obj["i"] = {"key": "device_description_wakeup_note", "val": wakeupNote};
        obj["j"] = {"key": "device_description_interview", "val": deviceService.configInterviewStage(ZWaveAPIData, nodeId, $scope.languages)};
        obj["k"] = {"key": "device_sleep_state", "val": deviceService.configDeviceState(node, $scope.languages)};
        //obj["l"] = {"key": "device_queue_length", "val": queueLength(ZWaveAPIData, node)};
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
        return obj;
    }

    /**
     * Refresh description cont
     */
    function refreshData(node, nodeId, ZWaveAPIData) {
        $scope.interviewCommands = deviceService.configGetInterviewCommands(node, ZWaveAPIData.updateTime);
        $('#device_sleep_state .config-interview-val').html(deviceService.configDeviceState(node, $scope.languages));
        $('#device_description_interview .config-interview-val').html(deviceService.configInterviewStage(ZWaveAPIData, nodeId, $scope.languages));
    }
});
// Device configuration Configuration controller
appController.controller('ConfigConfigurationController', function($scope, $routeParams, $location, $cookies, $filter, $http, $timeout, dataService, deviceService, myCache) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'configuration';
    $scope.activeUrl = 'configuration/configuration/';
    $cookies.tab_config = $scope.activeTab;
    $scope.reset = function() {
        $scope.devices = angular.copy([]);
    };
    // Config vars
    $scope.deviceZddx = [];
    $scope.configCont;
    $scope.switchAllCont;
    $scope.protectionCont;
    $scope.wakeupCont;

    // Load data
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

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.deviceName = $filter('deviceName')(nodeId, node);

            setData(ZWaveAPIData, nodeId);

        });
    };
    $scope.load($routeParams.nodeId);

    // Refresh data
    $scope.refresh = function(nodeId) {
        dataService.joinedZwaveData(function(data) {
            setData(data.joined, nodeId, true);
        });
    };
    //$scope.refresh($routeParams.nodeId); 

    // Redirect to detail page
    $scope.changeDevice = function(deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    /**
     * Update from device action
     *
     * @param {string} cmd
     * @returns {undefined}
     */
    $scope.updateFromDevice = function(cmd, hasBattery) {
        if (hasBattery) {
            alert($scope._t('conf_apply_battery'));
        }
        dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
        $scope.refresh = true;
        var timeOut;
        timeOut = $timeout(function() {
            $scope.refresh = false;
        }, 10000);
        return;
    };

    /**
     * Update from device - configuration section
     */
    $scope.updateFromDeviceCfg = function(cmd, cfg, deviceId) {
        angular.forEach(cfg, function(v, k) {
            if (v.confNum) {
                var request = cmd + '(' + v.confNum + ')';
                dataService.runCmd(request);
            }
        });
        $scope.refresh(deviceId);
        var timeOut;
        timeOut = $timeout(function() {
            dataService.cancelZwaveDataInterval();
        }, 10000);
        return;
    };

    /**
     * Apply Config action
     */
    $scope.submitApplyConfigCfg = function(form, cmd, cfgValues, hasBattery, confNum) {
        var xmlData = [];
        var configValues = [];
        if (hasBattery) {
            alert($scope._t('conf_apply_battery'));
        }
        var data = $('#' + form).serializeArray();
        var dataValues = [];
        angular.forEach(data, function(v, k) {
            if (v.value !== '') {
                dataValues.push({"value": v.value, "name": v.name});
            }

        });

        angular.forEach(dataValues, function(n, nk) {
            var obj = {};
            var parameter;
            var lastNum = n.name.match(/\d+$/);
            if (!lastNum) {
                return;
            }
            var num = lastNum[0];
            var confSize = 0;
            //var lastNum = n.name.match(/\d+$/);
            var value = n.value;
            configValues.push(value)
            angular.forEach(cfgValues, function(cv, ck) {
                if (!cv) {
                    return;
                }
                if (cv.confNum == num) {
                    confSize = cv.confSize;
                }


            });
            if (num > 0) {
                parameter = num + ',' + value + ',' + confSize;
            } else {
                parameter = value;
            }

            obj['id'] = cmd['id'];
            obj['instance'] = cmd['instance'];
            obj['commandclass'] = cmd['commandclass'];
            obj['command'] = cmd['command'];
            obj['parameter'] = '[' + parameter + ']';
            obj['parameterValues'] = parameter;
            obj['confNum'] = num;

            xmlData.push(obj);


        });
        //console.log(xmlData)
        //return;

        // Send command
        var request = 'devices[' + cmd.id + '].instances[' + cmd.instance + '].commandClasses[0x' + cmd.commandclass + '].';
        switch (cmd['commandclass']) {
            case '70':// Config
                angular.forEach(xmlData, function(v, k) {

                    var configRequest = request;
                    configRequest += cmd.command + '(' + v.parameterValues + ')';
                    if (confNum) {
                        if (confNum == v.confNum) {
                            dataService.runCmd(configRequest, false, $scope._t('error_handling_data'));
                        }
                    } else {
                        dataService.runCmd(configRequest, false, $scope._t('error_handling_data'));
                    }

                });
                break;
            case '75':// Protection
                request += cmd.command + '(' + configValues.join(",") + ')';
                dataService.runCmd(request, false, $scope._t('error_handling_data'));
                break;
            case '84':// Wakeup
                request += cmd.command + '(' + configValues.join(",") + ')';
                dataService.runCmd(request, false, $scope._t('error_handling_data'));
                break;
            case '27':// Switch all
                request += cmd.command + '(' + configValues.join(",") + ')';
                dataService.runCmd(request, false, $scope._t('error_handling_data'));
                break;
            default:
                break;
        }

        dataService.getCfgXml(function(cfgXml) {
            var xmlFile = deviceService.buildCfgXml(xmlData, cfgXml, cmd['id'], cmd['commandclass']);
            dataService.putCfgXml(xmlFile);
        });


        //debugger;
        $scope.refresh(cmd['id']);
        var timeOut;
        timeOut = $timeout(function() {
            $('button .fa-spin,a .fa-spin').fadeOut(1000);
            dataService.cancelZwaveDataInterval();
        }, 10000);
        return;
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
            if (!cachedZddXml) {
                $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                    var x2js = new X2JS();
                    var zddXml = x2js.xml_str2json(response.data);
                    myCache.put(zddXmlFile, zddXml);
                    setCont(node, nodeId, zddXml, ZWaveAPIData, refresh);


                });
            } else {
                setCont(node, nodeId, cachedZddXml, ZWaveAPIData, refresh);
            }

        } else {

            setCont(node, nodeId, null, ZWaveAPIData, refresh);
        }
    }

    /**
     * Set all conts
     */
    function setCont(node, nodeId, zddXml, ZWaveAPIData, refresh) {
        if (!zddXml) {
            $scope.noZddx = true;
        }
        dataService.getCfgXml(function(cfgXml) {
            $scope.configCont = deviceService.configConfigCont(node, nodeId, zddXml, cfgXml, $scope.lang, $scope.languages);
            $scope.wakeupCont = deviceService.configWakeupCont(node, nodeId, ZWaveAPIData, cfgXml);
            $scope.protectionCont = deviceService.configProtectionCont(node, nodeId, ZWaveAPIData, cfgXml);
            $scope.switchAllCont = deviceService.configSwitchAllCont(node, nodeId, ZWaveAPIData, cfgXml);
        });
    }



});
// DEPRECATED
// Device configuration Association controller
appController.controller('ConfigAssociationController', function($scope, $filter, $routeParams, $location, $cookies, $http, dataService, deviceService, myCache, cfg) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'association';
    $scope.activeUrl = 'configuration/association/';
    $cookies.tab_config = $scope.activeTab;

    // Assoc vars
    $scope.hasMca = false;
    $scope.keys = [];
    $scope.data = {};
    $scope.ZWaveAPIData;
    $scope.removeData = null;
    $scope.addData = null;
    $scope.addNodes = {};
    $scope.addInstances = {};
    $scope.removeNodes = {};
    $scope.removeNodesSort = {};
    $scope.removeInstances = {};
    $scope.assocToNode = '';
    $scope.assocToInstance = '';
    $scope.applyQueue = [];
    $scope.updates = [];
    $scope.xmlUpdates = [];
    $scope.cfgXml = [];
    $scope.zdd = {};



    // Redirect to detail page
    $scope.changeDevice = function(deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    var pollForUpdate = function(since, updates) {
        var spinner = $('#AssociationTable .fa-spinner');
        spinner.show();
        dataService.updateZwaveDataSince(since, function(updateZWaveAPIData) {
            var remaining = [];
            var hasUpdates = false;
            angular.forEach(updates, function(update, index) {
                if (!(update in updateZWaveAPIData)) {
                    remaining.push(update);
                } else if (updateZWaveAPIData[update].invalidateTime > updateZWaveAPIData[update].updateTime) {
                    hasUpdates = true;
                    remaining.push(update);
                } else {
                    hasUpdates = true;
                }
            });
            if (remaining.length == 0) {
                dataService.purgeCache();
                $scope.loadAssoc($scope.lang);
                spinner.fadeOut();
            } else if (since + cfg.route_update_timeout / 1000 < (new Date()).getTime() / 1000) {
                console.log("update timed out");
                spinner.fadeOut();
            } else {
                window.setTimeout(pollForUpdate, cfg.interval, since, remaining);
                if (hasUpdates) {
                    dataService.purgeCache();
                    $scope.loadAssoc($scope.lang);
                }
            }
        });
    };
    $scope.updateAssoc = function() {
        $scope.applyQueue = [];
        $scope.updates = [];
        var updates = [];
        var nodeId = $scope.deviceId;
        var node = $scope.ZWaveAPIData.devices[nodeId];
        if (node == undefined)
            return;
        if (nodeId == 255 || node.data.isVirtual.value)
            return;
        $.each(node.instances, function(index, instance) {
            if (!("commandClasses" in instance)) {
                return;
            }
            if (0x85 in instance.commandClasses) {
                for (var group = 0; group < instance.commandClasses[0x85].data.groups.value; group++) {
                    updates.push("devices." + nodeId + ".instances." + index + ".commandClasses." + (0x85) + ".data." + (group + 1));
                    dataService.runCmd('devices[' + nodeId + '].instances[' + index + '].commandClasses[0x85].Get(' + (group + 1) + ')', false, $scope._t('error_handling_data'));
                }
            }
            if (0x8e in instance.commandClasses) {
                for (var group = 0; group < instance.commandClasses[0x8e].data.groups.value; group++) {
                    updates.push("devices." + nodeId + ".instances." + index + ".commandClasses." + (0x8e) + ".data." + (group + 1));
                    dataService.runCmd('devices[' + nodeId + '].instances[' + index + '].commandClasses[0x8e].Get(' + (group + 1) + ')', false, $scope._t('error_handling_data'));

                }
            }

        });
        pollForUpdate(Math.floor((new Date()).getTime() / 1000), updates);
    };
    $scope.initAssocToInstance = function(value) {
        console.log(value)
        $scope.assocToInstance = value;
    };

    // Open remove assocation dialog
    $scope.openRemove = function(data) {
        $scope.removeData = data;
        $scope.removeNodes = {};
        $scope.removeNodesSort = {};
        $scope.removeInstances = {};
        $scope.assocToNode = null;
        $scope.assocToInstance = null;
        $scope.removeNodesLength = $scope.removeData.nodeIds;
        $scope.removeInstancesLength = [];
        var cnt = 0;

        if ($scope.removeNodesLength.length == 1) {
            $scope.assocToNode = $scope.removeNodesLength[0];
        }
        angular.forEach($scope.removeData.nodeIds, function(nodeId, index) {
            if ($scope.removeData.instanceIds[index] != null) {
                var instanceId = parseInt($scope.removeData.instanceIds[index]) - 1;
                // MultiChannelAssociation with instanceId
                $scope.removeNodes[nodeId] = '(#' + nodeId + ') ' + $filter('deviceName')(nodeId, $scope.ZWaveAPIData.devices[nodeId]);
                $scope.removeNodesSort[nodeId] = {
                    'key': nodeId,
                    'val': '(#' + nodeId + ') ' + $filter('deviceName')(nodeId, $scope.ZWaveAPIData.devices[nodeId])
                };
                if (!(nodeId in $scope.removeInstances))
                    $scope.removeInstances[nodeId] = {};
                $scope.removeInstances[nodeId][instanceId] = instanceId + 1;



            } else {
                // simple Assocation
                $scope.removeNodes[nodeId] = '(#' + nodeId + ') ' + $filter('deviceName')(nodeId, $scope.ZWaveAPIData.devices[nodeId]);
                $scope.removeNodesSort[nodeId] = {
                    'key': nodeId,
                    'val': '(#' + nodeId + ') ' + $filter('deviceName')(nodeId, $scope.ZWaveAPIData.devices[nodeId])
                };

            }
        });
        $('#modal_remove').modal({});
    };
    /**
     * Close modal remove
     */
    $scope.closeRemove = function() {
        $scope.assocToNode = '';
        $scope.assocToInstance = '';
    };
    // Remove an assocation
    $scope.remove = function() {
        var params = $scope.removeData.groupId + ',' + $scope.assocToNode;

        if ($scope.assocToInstance) {
            params += ',' + (parseInt($scope.assocToInstance) + 1);
        }

        var nodeId = $scope.deviceId;
        var node = $scope.ZWaveAPIData.devices[nodeId];
        if (node == undefined)
            return;
        if (nodeId == 255 || node.data.isVirtual.value)
            return;
        var index = $scope.removeData.instance;
        var group = parseInt($scope.removeData.groupId);
        if ($scope.assocToInstance == null) {
            $scope.updates.push("devices." + nodeId + ".instances." + index + ".commandClasses." + (0x85) + ".data." + group);
            $scope.applyQueue.push('devices[' + nodeId + '].instances[' + index + '].commandClasses[0x85].Remove(' + params + ')');
        } else {
            $scope.updates.push("devices." + nodeId + ".instances." + index + ".commandClasses." + (0x8e) + ".data." + group);
            $scope.applyQueue.push('devices[' + nodeId + '].instances[' + index + '].commandClasses[0x8e].Remove(' + params + ')');
        }
        // cause view to hide element
        var removeIndex = -1;
        for (var i = 0; i < $scope.removeData.nodeIds.length; i++) {
            if ($scope.removeData.nodeIds[i] == $scope.assocToNode) {
                if ($scope.assocToInstance != null) {
                    if ($scope.removeData.instanceIds[i] == (parseInt($scope.assocToInstance) + 1)) {
                        removeIndex = i;
                        break;
                    }
                } else {
                    removeIndex = i;
                    break;
                }
            }
        }
        $scope.removeData.nodeIds.splice(removeIndex, 1);
        $scope.removeData.instanceIds.splice(removeIndex, 1);
        $scope.removeData.persistent.splice(removeIndex, 1);
        $scope.removeData.tooltips.splice(removeIndex, 1);
        $('#modal_remove').modal('hide');
    };
    // Add an assocation
    $scope.add = function() {
        var params = $scope.addData.groupId + ',' + $scope.assocToNode;
        var parameter = $scope.assocToNode;
        if ($scope.assocToInstance != null) {
            params += ',' + (parseInt($scope.assocToInstance) + 1);
            parameter += ',' + (parseInt($scope.assocToInstance) + 1);
        }
        var nodeId = $scope.deviceId;
        var node = $scope.ZWaveAPIData.devices[nodeId];
        if (node == undefined)
            return;
        if (nodeId == 255 || node.data.isVirtual.value)
            return;
        var index = $scope.addData.instance;
        var group = parseInt($scope.addData.groupId);
        var cc = 133;

        if ($scope.assocToInstance == null) {
            $scope.updates.push("devices." + nodeId + ".instances." + index + ".commandClasses." + (0x85) + ".data." + group);
            $scope.applyQueue.push('devices[' + nodeId + '].instances[' + index + '].commandClasses[0x85].Set(' + params + ')');
        } else {
            $scope.updates.push("devices." + nodeId + ".instances." + index + ".commandClasses." + (0x8e) + ".data." + group);
            $scope.applyQueue.push('devices[' + nodeId + '].instances[' + index + '].commandClasses[0x8e].Set(' + params + ')');
            cc = 142;
        }
        $scope.xmlUpdates.push({
            'id': nodeId,
            'instance': index,
            'commandclass': cc,
            'parameter': parameter,
            'command': 'Set',
            'group': group
        });
        console.log($scope.xmlUpdates);
        // cause view to show element
        $scope.addData.nodeIds.push(parseInt($scope.assocToNode));
        if ($scope.assocToInstance != null)
            $scope.addData.instanceIds.push(parseInt($scope.assocToInstance) + 1);
        else
            $scope.addData.instanceIds.push(null);
        $scope.addData.persistent.push("notInZWave");
        if ($scope.assocToInstance != null)
            $scope.addData.tooltips.push($scope._t('instance') + " " + ($scope.assocToInstance + 1) + " " + $scope._t('of') + " " + $filter('deviceName')($scope.assocToNode, $scope.ZWaveAPIData.devices[$scope.assocToNode]));
        else
            $scope.addData.tooltips.push($filter('deviceName')($scope.assocToNode, $scope.ZWaveAPIData.devices[$scope.assocToNode]));
        $('#modal_add').modal('hide');
    };
    // Open add assocation dialog
    $scope.openAdd = function(data) {
        $scope.addDevices = [];
        $scope.addData = data;
        $scope.addNodes = {};
        $scope.addNodesSort = {};
        $scope.addInstances = {};
        $scope.assocToNode = '';
        $scope.assocToNode = null;
        $scope.assocToInstance = null;
        // Prepare devices and nodes
        angular.forEach($scope.ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || node.data.isVirtual.value || nodeId == $scope.deviceId) {
                return;
            }

//            if ($scope.hasMca && !(142 in node.instances[0].commandClasses)) {
//                //console.log(nodeId + ' Has NO MCA (142)'); 
//                //return;
//
//            }
//            if (!$scope.hasMca && 142 in node.instances[0].commandClasses) {
//                //console.log(nodeId + ' Has NO ASSOC (133)');
//                //return;
//            }
//            var mc = '---';
//            angular.forEach(node.instances, function(instance, instanceId) {
//                if (0x60 in instance.commandClasses) {
//                    mc = '92';
//                }
//            });
//            console.log(0x60 in node.instances[0].commandClasses)
//            console.log(nodeId + ' MCA: ' + (142 in node.instances[0].commandClasses ? '142' : '---') + ' MC: ' + (0x60 in node.instances[0].commandClasses ? '0x60' : '---'));

            $scope.addDevices.push({
                'key': nodeId,
                'val': '(#' + nodeId + ') ' + $filter('deviceName')(nodeId, node)
            });


            for (var instanceId in $scope.ZWaveAPIData.devices[nodeId].instances) {
                var fromInstanceId = $scope.addData.instanceId;
                var groupId = $scope.addData.groupId;
                if (nodeId != $scope.addData.nodeId || fromInstanceId != instanceId) { // exclude self-assoc
                    var contained = false;
                    for (var i = 0; i < $scope.addData.nodeIds.length; i++) {
                        if ($scope.addData.nodeIds[i] == nodeId && ($scope.addData.instanceIds[i] == null || $scope.addData.instanceIds[i] == parseInt(instanceId) + 1)) {
                            contained = true;
                            break;
                        }
                    }
                    if (contained)
                        continue;
                    if (0 in node.instances) {
                        if ((0x8e in $scope.addData.node.instances[0].commandClasses) && (0x8e in node.instances[0].commandClasses)) {
                            // MultiChannelAssociation with instanceId
                            $scope.addNodes[nodeId] = '(#' + nodeId + ') ' + $filter('deviceName')(nodeId, node);
                            $scope.addNodesSort[nodeId] = {
                                'key': nodeId,
                                'val': $filter('deviceName')(nodeId, node) + ' (#' + nodeId + ')'
                            };
                            if (!(nodeId in $scope.addInstances))
                                $scope.addInstances[nodeId] = {};
                            $scope.addInstances[nodeId][instanceId] = parseInt(instanceId) + 1;
                        } else {
                            // simple Assocation
                            $scope.addNodes[nodeId] = '(#' + nodeId + ') ' + $filter('deviceName')(nodeId, node);
                            $scope.addNodesSort[nodeId] = {
                                'key': nodeId,
                                'val': $filter('deviceName')(nodeId, node) + ' (#' + nodeId + ')'
                            };
                            break; // first instance is enough
                        }
                    }
                }
            }
        });
        $('#modal_add').modal({});
    };

    // Load data
    $scope.loadAssoc = function(currNodeId) {
        //dataService.getZwaveDataQuietly(function(ZWaveAPIData) {
        dataService.getCfgXml(function(cfgXml) {
            $scope.cfgXml = cfgXml;
        });
        dataService.getZwaveData(function(ZWaveAPIData) {
            var currNode = ZWaveAPIData.devices[currNodeId];
            if (!currNode) {
                return;
            }

            if (142 in currNode.instances[0].commandClasses) {
                $scope.hasMca = true
            }
            console.log(currNodeId + ' Current Device Has MCA: ' + $scope.hasMca)

            $scope.ZWaveAPIData = ZWaveAPIData;
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            // Gather associations
            //var nodeId = $scope.deviceId;
            $scope.deviceId = currNodeId;
            $cookies.configuration_id = currNodeId;
            $cookies.config_url = $scope.activeUrl + currNodeId;
            updateData(currNodeId);
            // load initial zdd data (cached)
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || node.data.isVirtual.value) {
                    return;
                }
                loadZDD(nodeId);
            });
        });
    };
    $scope.loadAssoc($routeParams.nodeId);

    $scope.applyConfig = function() {
        var spinner = $('#AssociationTable .fa-spinner');
        spinner.show();

        dataService.getCfgXml(function(cfgXml) {
            var xmlFile = deviceService.buildCfgXmlAssoc($scope.xmlUpdates, cfgXml);
            //dataService.putCfgXml(xmlFile);
        });
        while ($scope.applyQueue.length > 0) {
            var exec = $scope.applyQueue.shift();
            console.log(exec)
            dataService.runCmd(exec, false, $scope._t('error_handling_data'));
        }
        pollForUpdate(Math.floor((new Date()).getTime() / 1000), $scope.updates);
        $scope.updates = [];

        var nodeId = $scope.deviceId;
        var node = $scope.ZWaveAPIData.devices[nodeId];
        var isListening = node.data.isListening.value;
        var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
        var hasWakeup = 0x84 in node.instances[0].commandClasses;
        var hasBattery = 0x80 in node.instances[0].commandClasses;
        if (!isListening && !isFLiRS && hasBattery)
            alert($scope._t('conf_apply_battery'));
    };
    /**
     * Show modal window
     *
     * @returns {void}
     */
    $scope.showModalAssoc = function(target, param) {
        $(target).modal();
        $(target + ' .modal-title').html(param.title);
        return;
    };

    /// --- Private functions --- ///

    // Load ZDDXML
    function loadZDD(nodeId) {
        if (nodeId in $scope.zdd)
            return; // zdd already loaded for nodeId
        var node = $scope.ZWaveAPIData.devices[nodeId];
        if (node == undefined)
            return;
        var zddXmlFile = null;
        if (angular.isDefined(node.data.ZDDXMLFile)) {
            zddXmlFile = node.data.ZDDXMLFile.value;
        }
        if (!zddXmlFile || zddXmlFile === 'undefined')
            return; // not available

        var cachedZddXml = myCache.get(zddXmlFile);
        if (!cachedZddXml) {
            $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                var x2js = new X2JS();
                var zddXml = x2js.xml_str2json(response.data);
                myCache.put(zddXmlFile, zddXml);
                if (("ZWaveDevice" in zddXml) && ("assocGroups" in zddXml.ZWaveDevice)) {
                    $scope.zdd[nodeId] = zddXml.ZWaveDevice.assocGroups;
                    if (nodeId == $scope.deviceId)
                        updateData(nodeId);
                } else {
                    $scope.zdd[nodeId] = undefined;
                }
            });
        } else {
            var zddXml = cachedZddXml;
            if (("ZWaveDevice" in zddXml) && ("assocGroups" in zddXml.ZWaveDevice)) {
                $scope.zdd[nodeId] = zddXml.ZWaveDevice.assocGroups;
                if (nodeId == $scope.deviceId)
                    updateData(nodeId);
            } else {
                $scope.zdd[nodeId] = undefined;
            }
        }
    }
    ;

    function updateData(nodeId) {
        var findLabel = function(nodeId, index, instance) {
            // Set default assoc group name
            var label = $scope._t('association_group') + " " + (index + 1);

            // Attempt to get assoc group name from the zdd file
            if ($scope.zdd[nodeId] && ("assocGroup" in $scope.zdd[nodeId]) && ((index) in $scope.zdd[nodeId].assocGroup)) {
                // find best matching lang, default english
                var langs = $scope.zdd[nodeId].assocGroup[index].description.lang;
                if ($.isArray(langs)) {
                    angular.forEach(langs, function(lang, index) {
                        if (("__text" in lang) && (lang["_xml:lang"] == $scope.lang)) {
                            label = lang.__text;
                            return false;
                        }
                        if (("__text" in lang) && (lang["_xml:lang"] == "en")) {
                            label = lang.__text;
                        }
                    });
                } else {
                    if (("__text" in langs)) {
                        label = langs.__text;
                    }
                }
            } else {
                // Attempt to get assoc group name from the command class
                angular.forEach(instance.commandClasses, function(v, k) {
                    if (v.name == 'AssociationGroupInformation') {
                        label = $filter('hasNode')(v, 'data.' + (index + 1) + '.groupName.value');
                    }

                });
            }
            return label;
        };
        $scope.keys = [];
        $scope.data = {};
        var node = $scope.ZWaveAPIData.devices[nodeId];
        if (node == undefined)
            return;
        if (nodeId == 255 || node.data.isVirtual.value)
            return;
        $.each(node.instances, function(index, instance) {
            if (!("commandClasses" in instance)) {
                return;
            }
            if ((0x85 in instance.commandClasses) || (0x8e in instance.commandClasses)) {
                var groups = 0;
                if (0x85 in instance.commandClasses) {
                    groups = instance.commandClasses[0x85].data.groups.value;
                }
                if (0x8e in instance.commandClasses) {
                    if (instance.commandClasses[0x8e].data.groups.value > groups)
                        groups = instance.commandClasses[0x8e].data.groups.value;
                }
                for (var group = 0; group < groups; group++) {
                    var key = nodeId + "." + index + "." + group;
                    if ($.inArray(key, $scope.keys) == -1)
                        $scope.keys.push(key);
                    var data;
                    var timeArray; // object to get updateTime from
                    var nodeIds = [];
                    var instanceIds = [];
                    var persistent = [];
                    var tooltips = [];
                    var type = null;
                    if ((0x85 in instance.commandClasses) && (group < instance.commandClasses[0x85].data.groups.value)) {
                        data = instance.commandClasses[0x85].data[group + 1];
                        timeArray = data.nodes;
                        for (var i = 0; i < data.nodes.value.length; i++) {
                            var targetNodeId = data.nodes.value[i];
                            nodeIds.push(targetNodeId);
                            var targetInstanceId = null;
                            instanceIds.push(targetInstanceId);
                            if (targetNodeId in $scope.ZWaveAPIData.devices) {
                                persistent.push("inZWave");
                                tooltips.push($filter('deviceName')(targetNodeId, $scope.ZWaveAPIData.devices[targetNodeId]));
                            } else {
                                persistent.push("dissapeared");
                                tooltips.push($scope._t('device_disappeared'));
                            }
                        }
                    }
                    if ((0x8e in instance.commandClasses) && (group < instance.commandClasses[0x8e].data.groups.value)) {
                        data = instance.commandClasses[0x8e].data[group + 1];
                        timeArray = data.nodesInstances;
                        for (var i = 0; i < data.nodesInstances.value.length; i += 2) {
                            var targetNodeId = data.nodesInstances.value[i];
                            nodeIds.push(targetNodeId);
                            var targetInstanceId = data.nodesInstances.value[i + 1];
                            instanceIds.push(targetInstanceId);
                            if (targetNodeId in $scope.ZWaveAPIData.devices) {
                                persistent.push("inZWave");
                                //tooltips.push($scope._t('instance') + " " + targetInstanceId + " " + $scope._t('of') + " " + $filter('deviceName')(targetNodeId, $scope.ZWaveAPIData.devices[targetNodeId]));
                                tooltips.push($filter('deviceName')(targetNodeId, $scope.ZWaveAPIData.devices[targetNodeId]));
                            } else {
                                persistent.push("notInZWave");
                                tooltips.push($scope._t('device_disappeared'));
                            }
                        }
                    }
                    $scope.data[key] = {"label": findLabel(nodeId, group, instance), "tooltips": tooltips, "nodeId": nodeId, "instanceId": index, "node": node, "instance": index, "groupId": (group + 1), "nodeIds": nodeIds, "instanceIds": instanceIds, "persistent": persistent, "update": timeArray, "max": data.max.value, "remaining": (data.max.value - nodeIds.length)};
                }
            }
        });
    }
    ;
});
// Device configuration commands controller
appController.controller('ConfigCommandsController', function($scope, $routeParams, $location, $cookies, $timeout, $filter, dataService, deviceService) {
    $scope.devices = [];
    $scope.commands = [];
    $scope.interviewCommands;

    $scope.deviceId = 0;
    $scope.activeTab = 'commands';
    $scope.activeUrl = 'configuration/commands/';

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
            $scope.interviewCommands = deviceService.configGetInterviewCommands(node, ZWaveAPIData.updateTime);
            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;

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
                    obj['updateTime'] = ZWaveAPIData.updateTime;
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

    // Show modal dialog
    $scope.showModal = function(target, instanceId, index, ccId, type) {
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
        dataService.joinedZwaveData(function(data) {
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
    $scope.hideModal = function() {
        dataService.cancelZwaveDataInterval();
    };

    /// --- Private functions --- ///
    

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
