/**
 * Configuration controller
 * @author Martin Vach
 */

// Configuration controller
appController.controller('ConfigurationController', function($scope, $routeParams, $route, $http, $filter, $location, $cookies, $timeout, dataService, deviceService, myCache) {
    $scope.devices = [];
    $scope.showDevices = false;
    $scope.ZWaveAPIData;
    $scope.descriptionCont;
    $scope.configCont;
    $scope.switchAllCont;
    $scope.protectionCont;
    $scope.wakeupCont;
    $scope.fwupdateCont;
    $scope.interviewCommandsDevice;
    $scope.interviewCommands;
    $scope.assocCont;
    $scope.deviceId;
    $scope.deviceName = $scope._t('h1_configuration_no_device');
    $scope.deviceImage = '';
    $scope.deviceSelectImage = '';
    $scope.commands = [];
    $scope.deviceZddx = [];
    $scope.deviceZddxFile;
    $scope.refresh = false;
    $scope.hasBattery = false;
    $scope.formFirmware = {
        fw_url: "",
        fw_target: ""
    };
    $scope.reset = function() {
        $scope.devices = angular.copy([]);
        $scope.commands = angular.copy([]);
    };

    // Remember device id
    $scope.detailId = (angular.isDefined($cookies.configuration_id) ? $cookies.configuration_id : 0);
    // Redirect to detail page
    $scope.redirectToDetail = function(detailId) {
        if (detailId > 0) {
            $location.path('/config/configuration/' + detailId);
        }
    };

    // Remember active tab
    $scope.rememberTab = function(tabId) {
        if (tabId == 'interview') {
            $scope.devices = angular.copy([]);
            $scope.refresh = true;
        } else {
            $scope.refresh = false;

        }
        $cookies.tab_config = tabId;
    };
    // Get active tab
    $scope.getActiveTab = function() {
        var activeTab = (angular.isDefined($cookies.tab_config) ? $cookies.tab_config : 'interview');
        if (activeTab == 'interview') {
            $scope.devices = angular.copy([]);
            $scope.refresh = true;
        } else {
            $scope.refresh = false;
        }
        $scope.activeTab = activeTab;
    };
    $scope.getActiveTab();


    // Load data
    $scope.load = function(nodeId, refresh) {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.reset();
            $scope.deviceId = nodeId;
            setNavigation(ZWaveAPIData);
            setData(ZWaveAPIData, nodeId);
            $scope.ZWaveAPIData = ZWaveAPIData;
            dataService.cancelZwaveDataInterval();
            if (refresh) {
                dataService.joinedZwaveData(function(data) {
                    $scope.reset();
                    setNavigation(data.joined);
                    setData(data.joined, nodeId, true);
                    $scope.ZWaveAPIData = ZWaveAPIData;
                });
            }
        });
    };

    // Load
    if (parseInt($routeParams.nodeId, 10) > 0) {
        $scope.deviceId = $routeParams.nodeId;
        $scope.load($routeParams.nodeId, $scope.refresh);
        $cookies.configuration_id = $routeParams.nodeId;
    } else {
        $scope.deviceId = $scope.detailId;
        $scope.load($scope.detailId, $scope.refresh);
        $cookies.configuration_id = $scope.detailId;
        //$scope.redirectToDetail($scope.detailId);
    }

    // Watch for refresh change
    $scope.$watch('refresh', function() {
        if ($scope.refresh) {
            $scope.load($scope.deviceId, true);
        } else {
            dataService.cancelZwaveDataInterval();
        }

    });
    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    // Redirect to another device
    $scope.goToDetail = function(detailId) {
        $cookies.configuration_id = $routeParams.nodeId;
        $location.path('/config/configuration/' + detailId);
    };
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
        $scope.load(nodeId, false);
        $scope.load(nodeId, true);
        //$scope.refresh = true;
        //$window.location.reload();
        //$location.path('/config/configuration/' + nodeId);
        console.log($scope.refresh);
    };


    /**
     * Apply Config action
     *
     * @param {object} form
     * @returns {undefined}
     */
    $scope.submitApplyConfigCfg = function(form, cmd, cfg, hasBattery) {
        var xmlData = [];
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
            
            angular.forEach(cfg, function(cv, ck) {
                if(!cv){
                    return;
                }
                if (cv.confNum == num) {
                    confSize = cv.confSize;
                }


            });
            if (num > 0) {
                parameter = '[' + num + ',' + value + ',' + confSize + ']';
            } else {
                parameter = '[' + value + ']';
            }

            obj['id'] = cmd['id'];
            obj['instance'] = cmd['instance'];
            obj['commandclass'] = cmd['commandclass'];
            obj['command'] = cmd['command'];
            obj['parameter'] = parameter;
            xmlData.push(obj);
            // dataService.runCmd(request, false, $scope._t('error_handling_data'));
        });
        //console.log(xmlData)
        //return;

        dataService.getCfgXml(function(cfgXml) {
            var xmlFile = deviceService.buildCfgXml(xmlData, cfgXml, cmd['id'], cmd['commandclass']);
            dataService.putCfgXml(xmlFile);
        });


        //debugger;
        $scope.refresh = true;
        var timeOut;
        timeOut = $timeout(function() {
            $('button .fa-spin,a .fa-spin').fadeOut(1000);
            $scope.refresh = false;
        }, 5000);
        return;
    };

    /**
     * Apply Config action
     *
     * @param {object} form
     * @returns {undefined}
     */
    $scope.submitApplyConfigCfg______ = function(form, cmd, cfg, hasBattery, section) {
        if (hasBattery) {
            alert($scope._t('conf_apply_battery'));
        }
        var sections = $('#' + form).find('.cfg-control-content');
        var data = $('#' + form).serializeArray();
        var dataValues = [];
        angular.forEach(data, function(v, k) {
            if (v.value !== '') {
                dataValues.push({"value": v.value, "name": v.name});
                //dataValues.push(v.name);
            }

        });
        angular.forEach(dataValues, function(n, nk) {
            var lastNum = n.name.match(/\d+$/);
            if (!lastNum) {
                return;
            }
            var num = lastNum[0];
            if (section && num != section) {
                return;
            }
            var confSize = 0;
            //var lastNum = n.name.match(/\d+$/);
            var value = n.value;

            angular.forEach(cfg, function(cv, ck) {

                if (cv.confNum == num) {
                    confSize = cv.confSize;
                }


            });
            var request = cmd + '(' + num + ',' + value + ',' + confSize + ')';
            dataService.runCmd(request, false, $scope._t('error_handling_data'));
        });
        $scope.refresh = true;
        var timeOut;
        timeOut = $timeout(function() {
            $scope.refresh = false;
        }, 10000);
        return;
    };

    /**
     * Apply Config action
     *
     * @param {object} form
     * @returns {undefined}
     */
    $scope.submitApplyConfig = function(form, cmd, hasBattery) {
        if (hasBattery) {
            alert($scope._t('conf_apply_battery'));
        }
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
            $scope.refresh = false;
        }, 10000);
        return;
    };

    /**
     * Update from device action
     *
     * @param {string} cmd
     * @returns {undefined}
     */
    $scope.updateFromDevice = function(cmd) {
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
     *
     * @param {string} cmd
     * @param {obj} cfg
     * @returns {undefined}
     */
    $scope.updateFromDeviceCfg = function(cmd, cfg) {
        angular.forEach(cfg, function(v, k) {
            if (v.confNum) {
                var request = cmd + '(' + v.confNum + ')';
                dataService.runCmd(request);
            }
        });
        $scope.refresh = true;
        var timeOut;
        timeOut = $timeout(function() {
            $scope.refresh = false;
        }, 10000);
        return;
    };

    /// --- Private functions --- ///

    /**
     * Set page navigation
     */
    function setNavigation(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }

            var node = ZWaveAPIData.devices[nodeId];
            if (nodeId == $routeParams.nodeId) {
                $scope.deviceName = $filter('deviceName')(nodeId, node);
                $scope.deviceNameId = $filter('deviceName')(nodeId, node) + '(#' + nodeId + ')';
            }
            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['slected'] = '';
            if (nodeId == $routeParams.nodeId) {

                obj['slected'] = 'selected';
            }
            $scope.devices.push(obj);
        });
    }
    ;
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

        $scope.interviewCommands = interviewCommands(node);
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
        /**
         * Expert commands
         */
        angular.forEach(node.instances, function(instance, instanceId) {
            angular.forEach(instance.commandClasses, function(commandClass, ccId) {
                var methods = getMethodSpec(ZWaveAPIData, nodeId, instanceId, ccId, null);
                var obj = {};
                obj['nodeId'] = nodeId;
                obj['rowId'] = 'row_' + nodeId + '_' + ccId;
                obj['instanceId'] = instanceId;
                obj['cmd'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                obj['cmdData'] = ZWaveAPIData.devices[nodeId].instances[instanceId].commandClasses[ccId].data;
                obj['cmdDataIn'] = ZWaveAPIData.devices[nodeId].instances[instanceId].data;
                obj['commandClass'] = commandClass.name;
                obj['command'] = getCommands(methods, ZWaveAPIData);
                $scope.commands.push(obj);
            });
        });
        return;
    }
    /**
     * Set all conts
     */
    function setCont(node, nodeId, zddXml, ZWaveAPIData, refresh) {
        if (!zddXml) {
            $scope.noZddx = true;
        }
        // TODO: replace all with refresh function
        if (refresh == true) {
            refreshDescriptionCont(node, nodeId, zddXml, ZWaveAPIData);
        } else {
            $scope.descriptionCont = descriptionCont(node, nodeId, zddXml, ZWaveAPIData, refresh);
        }

        dataService.getCfgXml(function(cfgXml) {
            $scope.configCont = configCont(node, nodeId, zddXml, cfgXml);
            $scope.wakeupCont = wakeupCont(node, nodeId, ZWaveAPIData, cfgXml);
            $scope.switchAllCont = switchAllCont(node, nodeId, ZWaveAPIData, cfgXml);
            $scope.protectionCont = protectionCont(node, nodeId, ZWaveAPIData, cfgXml);
        });


        $scope.fwupdateCont = fwupdateCont(node);
        $scope.assocCont = assocCont(node);
    }
    /**
     * Device description
     */
    function descriptionCont(node, nodeId, zddXml, ZWaveAPIData, refresh) {

        // Set device data
        var isPrimary = ZWaveAPIData.controller.data.isPrimary.value;
        var deviceImage = 'app/images/no_device_image.png';
        var deviceDescription = '';
        var productName = '';
        var inclusionNote = '';
        var brandName = node.data.vendorString.value;
        var wakeupNote = '';
        var ZWavePlusInfo = '';
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
            var lang = 'en';
            var langs = {
                "en": "1",
                "de": "0",
                "ru": "2"
            };
            if (angular.isDefined(langs[$scope.lang])) {
                lang = $scope.lang;
            }
            var langId = langs[lang];
            if (angular.isDefined(zddXml.ZWaveDevice.deviceDescription.description.lang[langId])) {
                deviceDescription = zddXml.ZWaveDevice.deviceDescription.description.lang[langId].__text;
            }
            if ('productName' in zddXml.ZWaveDevice.deviceDescription) {
                productName = zddXml.ZWaveDevice.deviceDescription.productName;
            }
            if (angular.isDefined(zddXml.ZWaveDevice.deviceDescription.inclusionNote.lang[langId])) {
                inclusionNote = zddXml.ZWaveDevice.deviceDescription.inclusionNote.lang[langId].__text;
            }

            if ('brandName' in zddXml.ZWaveDevice.deviceDescription) {
                brandName = zddXml.ZWaveDevice.deviceDescription.brandName;
            }
            if (angular.isDefined(zddXml.ZWaveDevice.deviceDescription.wakeupNote.lang[langId])) {
                wakeupNote = zddXml.ZWaveDevice.deviceDescription.wakeupNote.lang[langId].__text;
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
        obj["i"] = {"key": "device_description_wakeup_note", "val": (wakeupNote ? wakeupNote : '')};
        obj["j"] = {"key": "device_description_interview", "val": interviewStage(ZWaveAPIData, nodeId)};
        obj["k"] = {"key": "device_sleep_state", "val": deviceState(node)};
        //obj["l"] = {"key": "device_queue_length", "val": queueLength(ZWaveAPIData, node)};
        obj["m"] = {"key": "device_description_app_version", "val": deviceDescriptionAppVersion + '.' + deviceDescriptionAppSubVersion};
        obj["o"] = {"key": "device_description_sdk_version", "val": sdk};
        //obj["p"] = {"key": "command_class", "val": ccNames.join(', ')};
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
    function refreshDescriptionCont(node, nodeId, zddXml, ZWaveAPIData) {
        $('#device_sleep_state .config-interview-val').html(deviceState(node));
        $('#device_description_interview .config-interview-val').html(interviewStage(ZWaveAPIData, nodeId));
    }
    // Set interview stage
    function interviewStage(ZWaveAPIData, id) {
        var istages = [];
        istages.push((ZWaveAPIData.devices[id].data.nodeInfoFrame.value && ZWaveAPIData.devices[id].data.nodeInfoFrame.value.length) ? '+' : '-');
        istages.push('&nbsp;');
        istages.push((0x86 in ZWaveAPIData.devices[id].instances[0].commandClasses) ? (ZWaveAPIData.devices[id].instances[0].commandClasses[0x86].data.interviewDone.value ? '+' : (ZWaveAPIData.devices[id].instances[0].commandClasses[0x86].data.interviewCounter.value > 0 ? '.' : '&oslash;')) : '+'); // Version
        istages.push((0x72 in ZWaveAPIData.devices[id].instances[0].commandClasses) ? (ZWaveAPIData.devices[id].instances[0].commandClasses[0x72].data.interviewDone.value ? '+' : (ZWaveAPIData.devices[id].instances[0].commandClasses[0x72].data.interviewCounter.value > 0 ? '.' : '&oslash;')) : '+'); // ManufacturerSpecific
        istages.push((0x60 in ZWaveAPIData.devices[id].instances[0].commandClasses) ? (ZWaveAPIData.devices[id].instances[0].commandClasses[0x60].data.interviewDone.value ? '+' : (ZWaveAPIData.devices[id].instances[0].commandClasses[0x60].data.interviewCounter.value > 0 ? '.' : '&oslash;')) : '+'); // MultiChannel
        var moreCCs = false;
        for (var i in ZWaveAPIData.devices[id].instances) {
            istages.push('&nbsp;');
            var instance = ZWaveAPIData.devices[id].instances[i];
            for (var cc in instance.commandClasses) {
                moreCCs = true;
                if ((cc == 0x60 && i != 0) || ((cc == 0x86 || cc == 0x72 || cc == 0x60) && i == 0))
                    continue; // skip MultiChannel announced inside a MultiChannel and previously handled CCs.
                istages.push(instance.commandClasses[cc].data.interviewDone.value ? '+' : (instance.commandClasses[cc].data.interviewCounter.value > 0 ? '.' : '&oslash;'));
            }
        }
        ;
        if (!moreCCs) {
            istages.push('.');
        }

        var descr;
        if (istages.indexOf('&oslash;') == -1) {
            if (istages.indexOf('.') == -1 && istages.indexOf('-') == -1)
                descr = $scope._t('device_interview_stage_done');
            else
                descr = $scope._t('device_interview_stage_not_complete');
        } else
            descr = $scope._t('device_interview_stage_failed');
        return descr + '<br />' + istages.join('');
    }

    // Set device state
    function deviceState(node) {
        var out = '';
        if (!node.data.isListening.value && !node.data.sensor250.value && !node.data.sensor1000.value) {
            out = (node.data.isAwake.value ? '<i class="fa fa-certificate fa-lg text-orange""></i> ' + $scope._t('device_is_active') : '<i class="fa fa-moon-o fa-lg text-primary"></i> ' + $scope._t('device_is_sleeping'));
        } else {
            out = (node.data.isFailed.value ? '<i class="fa fa-check fa-lg text-danger"></i> ' + $scope._t('device_is_dead') : '<i class="fa fa-check fa-lg text-success"></i> ' + $scope._t('device_is_operating'));
        }
        return out;
    }

    // Queue length
    function queueLength(ZWaveAPIData, node) {
        var out = $scope._t('nm_queue_count_jobs_disabled');
        if (ZWaveAPIData.controller.data.countJobs.value) {
            out = node.data.queueLength.value;
        }
        return out;
    }

    // Interview commands
    function interviewCommands(node) {
        var interviews = [];
        for (var iId in node.instances) {
            var cnt = 0;
            for (var ccId in node.instances[iId].commandClasses) {
                var obj = {};
                obj['iId'] = iId;
                obj['ccId'] = ccId;
                obj['ccName'] = node.instances[iId].commandClasses[ccId].name;
                obj['interviewDone'] = node.instances[iId].commandClasses[ccId].data.interviewDone.value;
                obj['cmdData'] = node.instances[iId].commandClasses[ccId].data;
                obj['cmdDataIn'] = node.instances[iId].data;
                interviews.push(obj);
                cnt++;
            }
            ;
        }
        ;
        return interviews;
    }
    /**
     * Config cont
     */
    function configCont(node, nodeId, zddXml, cfgXml) {

        if (!0x70 in node.instances[0].commandClasses) {
            return null;
        }
        if (!zddXml) {
            return null;
        }

        if (!zddXml.ZWaveDevice.hasOwnProperty("configParams")) {
            return null;
        }
        var config_cont = [];
        var params = zddXml.ZWaveDevice.configParams['configParam'];
        var lang = 'en';
        var langs = {
            "en": "1",
            "de": "0"
        };
        if (angular.isDefined(langs[$scope.lang])) {
            lang = $scope.lang;
        }
        var langId = langs[lang];
        // Loop throught params
        var parCnt = 0;
        var cfgFile = deviceService.getCfgXmlParam(cfgXml, nodeId, '0', '70', 'Set');
        angular.forEach(params, function(conf_html, i) {
            //console.log(zddXml);
            if (!angular.isObject(conf_html)) {
                return;
            }

            have_conf_params = true;
            var conf = conf_html;
            var conf_num = conf['_number'];
            //console.log(cfgFile[conf_num])
            var conf_size = conf['_size'];
            var conf_name = deviceService.configGetZddxLang($filter('hasNode')(conf, 'name.lang'), $scope.lang) || $scope._t('configuration_parameter') + ' ' + conf_num;
            var conf_description = deviceService.configGetZddxLang($filter('hasNode')(conf, 'description.lang'), $scope.lang);
// TODO: remove            if (angular.isDefined(conf.name)) {
//
//                if (angular.isDefined(conf.name.lang[langId])) {
//                    conf_name = conf.name.lang[langId].__text;
//                } else if (angular.isDefined(conf.name.lang)) {
//                    conf_name = conf.name.lang.__text;
//                }
//            }
//            var conf_description = '';
//            if (angular.isDefined(conf.description)) {
//                if (angular.isDefined(conf.description.lang[langId])) {
//                    conf_description = conf.description.lang[langId].__text;
//                } else if (angular.isDefined(conf.description)) {
//                    conf_description = conf.description.lang.__text;
//                }
//            }
            var conf_size = conf['_size'];
            var conf_default_value = null;
            var conf_type = conf['_type'];
            var showDefaultValue = null;
            var config_config_value;

            // get value from the Z-Wave data
            var config_zwave_value = null;

            if (angular.isDefined(node.instances[0].commandClasses[0x70])) {
                if (node.instances[0].commandClasses[0x70].data[conf_num] != null && node.instances[0].commandClasses[0x70].data[conf_num].val.value !== "") {
                    config_zwave_value = node.instances[0].commandClasses[0x70].data[conf_num].val.value;
                    conf_default = config_zwave_value;

                }

            }

            // get default value
            var conf_default = null;
            if (conf['_default'] !== undefined) {
                conf_default = parseInt(conf['_default'], 16);
                showDefaultValue = conf_default;
            }

            // get default value from the config XML
            if (cfgFile[conf_num] !== undefined) {
                config_config_value = cfgFile[conf_num];
            } else {
                if (config_zwave_value !== null) {
                    config_config_value = config_zwave_value;
                } else {
                    config_config_value = conf_default;
                }
            }

            var isUpdated = true;
            var updateTime = '';
            if (angular.isDefined(node.instances[0].commandClasses[0x70])
                    && angular.isDefined(node.instances[0].commandClasses[0x70].data[conf_num])) {
                var uTime = node.instances[0].commandClasses[0x70].data[conf_num].updateTime;
                var iTime = node.instances[0].commandClasses[0x70].data[conf_num].invalidateTime;
                var updateTime = $filter('isTodayFromUnix')(uTime);
                var isUpdated = (uTime > iTime ? true : false);
            }

            // Switch
            var conf_method_descr;
            //console.log(conf_name + ' --- ' + conf_type)
            switch (conf_type) {
                case 'constant':
                case 'rangemapped':
                    var param_struct_arr = [];
                    var conf_param_options = '';

                    angular.forEach(conf['value'], function(value_html, i) {
                        var value = value_html;
                        var value_from = parseInt(value['_from'], 16);
                        var value_to = parseInt(value['_to'], 16);
                        //var value_description = deviceService.configGetZddxLang($filter('hasNode')(value, 'description.lang'), $scope.lang);
                        var value_description = null;
                        if (angular.isDefined(value.description)) {
                            value_description = deviceService.configGetZddxLang($filter('hasNode')(value, 'description.lang'), $scope.lang);
                        }
                        if (angular.isDefined(value.lang)) {
                            value_description = deviceService.configGetZddxLang($filter('hasNode')(value, 'lang'), $scope.lang);

                        }


// TODO: remove
//                        if (angular.isDefined(value.description)) {
//                            //value_description = value.description.lang[1].__text;
//                            value_description = $filter('hasNode')(value, 'description.lang[1].__text');
//
//                            if (angular.isDefined(value.description.lang[langId])) {
//                                value_description = value.description.lang[langId].__text;
//                            }
//                        }
//                        if (angular.isDefined(value.lang)) {
//                            value_description = value.lang[1].text;
//                            angular.forEach(value.lang, function(lv, lk) {
//                                if (lk == langId) {
//                                    value_description = lv.__text;
//                                }
//                            });
//                        }
                        var value_repr = value_from; // representative value for the range
                        if (conf_default !== null)
                            if (value_from <= conf_default && conf_default <= value_to) {
                                conf_default_value = value_description;
                                value_repr = conf_default;
                            }
                        param_struct_arr.push({
                            label: value_description,
                            type: {
                                fix: {
                                    value: value_repr
                                }
                            }
                        });
                    });
                    conf_method_descr = {
                        nodeId: nodeId,
                        label: 'Nº ' + conf_num + ' - ' + conf_name,
                        type: {
                            enumof: param_struct_arr
                        },
                        name: 'input_' + nodeId + '_' + conf_num,
                        description: conf_description,
                        updateTime: updateTime,
                        isUpdated: isUpdated,
                        defaultValue: conf_default_value,
                        showDefaultValue: showDefaultValue,
                        configCconfigValue: config_config_value,
                        confNum: conf_num,
                        confSize: conf_size
                    };

                    break;
                case 'range':

                    var param_struct_arr = [];
                    var rangeParam = conf['value'];
                    //console.log(rangeParam, conf_num);

                    if (!rangeParam) {
                        conf_method_descr = {
                            nodeId: nodeId,
                            label: 'Nº ' + conf_num + ' - ' + conf_name,
                            type: {
                                noval: null
                            },
                            name: 'input_' + nodeId + '_' + conf_num,
                            description: conf_description,
                            updateTime: updateTime,
                            isUpdated: isUpdated,
                            defaultValue: null,
                            showDefaultValue: showDefaultValue,
                            configCconfigValue: config_config_value,
                            confNum: conf_num,
                            confSize: conf_size
                        };
                        break;
                    }
                    angular.forEach(rangeParam, function(value_html, ri) {
                        //console.log(ri);
                        var value = value_html;

                        if (ri == 'description') {
                            //console.log(ri);
                            var value_from = parseInt(rangeParam['_from'], 16);
                            var value_to = parseInt(rangeParam['_to'], 16);

                        } else {
                            var value_from = parseInt(value['_from'], 16);
                            var value_to = parseInt(value['_to'], 16);
                        }
                        var value_description = '';

//                        var value_description = '';
//                        if (angular.isDefined(value.description)) {
//                            //value_description = value.description.lang[1].__text;
//                            if (angular.isDefined(value.description.lang[langId])) {
//                                value_description = value.description.lang[langId].__text;
//                            } else if (angular.isDefined(value.description.lang)) {
//                                value_description = value.description.lang.__text;
//                            }
//                        }
//                        if (angular.isDefined(value.lang)) {
//
//                            if (angular.isDefined(value.lang['__text'])) {
//                                value_description = value.lang['__text'];
//                            } else if (angular.isDefined(value.lang[langId])) {
//                                value_description = value.lang[langId].__text;
//                            }
//                        }
                        if (angular.isDefined(value.description)) {
                            value_description = deviceService.configGetZddxLang($filter('hasNode')(value, 'description.lang'), $scope.lang);
                        }
                        if (angular.isDefined(value.lang)) {
                            value_description = deviceService.configGetZddxLang($filter('hasNode')(value, 'lang'), $scope.lang);
                        }
                        //var value_description = deviceService.configGetZddxLang($filter('hasNode')(value, 'lang'), $scope.lang);

                        if (conf_default !== null)
                            conf_default_value = conf_default;


                        if (value_from != value_to) {
                            if (value_description != '') {
                                var rangeVal = {
                                    label: value_description,
                                    type: {
                                        range: {
                                            min: value_from,
                                            max: value_to
                                        }
                                    }
                                };
                                param_struct_arr.push(rangeVal);
                            }
                        }
                        else // this is a fix value
                        if (value_description != '') {
                            param_struct_arr.push({
                                label: value_description,
                                type: {
                                    fix: {
                                        value: value_from
                                    }
                                }
                            });
                        }
                    });

                    if (param_struct_arr.length > 1)
                        conf_method_descr = {
                            nodeId: nodeId,
                            label: 'Nº ' + conf_num + ' - ' + conf_name,
                            type: {
                                enumof: param_struct_arr
                            },
                            hideRadio: false,
                            name: 'input_' + nodeId + '_' + conf_num,
                            description: conf_description,
                            updateTime: updateTime,
                            isUpdated: isUpdated,
                            defaultValue: conf_default_value,
                            showDefaultValue: showDefaultValue,
                            configCconfigValue: config_config_value,
                            confNum: conf_num,
                            confSize: conf_size
                        };
                    else if (param_struct_arr.length == 1) {

                        conf_method_descr = {
                            nodeId: nodeId,
                            label: 'Nº ' + conf_num + ' - ' + conf_name,
                            type: {
                                enumof: param_struct_arr
                            },
                            name: 'input_' + nodeId + '_' + conf_num,
                            hideRadio: true,
                            description: conf_description,
                            updateTime: updateTime,
                            isUpdated: isUpdated,
                            defaultValue: conf_default_value,
                            showDefaultValue: showDefaultValue,
                            configCconfigValue: config_config_value,
                            confNum: conf_num,
                            confSize: conf_size
                        };
                    }

                    break;
                case 'bitset':
                    var param_struct_arr = [];
                    var conf_param_options = '';
                    var conf_default_value_arr = new Object;
                    if (conf_default !== null) {
                        var bit = 0;
                        do {
                            if ((1 << bit) & conf_default)
                                conf_default_value_arr[bit] = 'Bit ' + bit + ' set';
                        } while ((1 << (bit++)) < conf_default);
                    }
                    ;
                    angular.forEach(conf['value'], function(value_html, i) {
                        var value = value_html;
                        var value_from = parseInt(value['_from'], 16);
                        var value_to = parseInt(value['_to'], 16);
                        var value_description = 'fdf';
                        var value_description = '';
                        if (conf_default !== null) {
                            if (value_from == value_to) {
                                if ((1 << value_from) & conf_default)
                                    conf_default_value_arr[value_from] = value_description;
                            } else {
                                conf_default_value_arr[value_from] = (conf_default >> value_from) & ((1 << (value_to - value_from + 1)) - 1)
                                for (var bit = value_from + 1; bit <= value_to; bit++)
                                    delete conf_default_value_arr[bit];
                            }
                        }
                        ;
                        if (value_from == value_to)
                            param_struct_arr.push({
                                label: value_description,
                                name: 'input_' + nodeId + '_' + conf_num,
                                type: {
                                    bitcheck: {
                                        bit: value_from
                                    }
                                }
                            });
                        else
                            param_struct_arr.push({
                                label: value_description,
                                name: 'input_' + nodeId + '_' + conf_num,
                                type: {
                                    bitrange: {
                                        bit_from: value_from,
                                        bit_to: value_to
                                    }
                                }
                            });
                    });
                    if (conf_default !== null) {
                        conf_default_value = '';
                        for (var ii in conf_default_value_arr)
                            conf_default_value += conf_default_value_arr[ii] + ', ';
                        if (conf_default_value.length)
                            conf_default_value = conf_default_value.substr(0, conf_default_value.length - 2);
                    }
                    conf_method_descr = {
                        nodeId: nodeId,
                        label: 'Nº ' + conf_num + ' - ' + conf_name,
                        type: {
                            bitset: param_struct_arr
                        },
                        name: 'input_' + nodeId + '_' + conf_num,
                        description: conf_description,
                        updateTime: updateTime,
                        isUpdated: isUpdated,
                        defaultValue: conf_default_value,
                        showDefaultValue: showDefaultValue,
                        configCconfigValue: config_config_value,
                        confNum: conf_num,
                        confSize: conf_size
                    };
                    break;
                default:
                    return;
                    //conf_cont.append('<span>' + $.translate('unhandled_type_parameter') + ': ' + conf_type + '</span>');
            }
            ;

            config_cont.push(conf_method_descr);
            parCnt++;
        });
        //console.log(config_cont);
        return config_cont;
    }

    /**
     * Wakeup cont
     */
    function wakeupCont(node, nodeId, ZWaveAPIData, cfgXml) {
        var wakeup_cont = false;
        if (0x84 in node.instances[0].commandClasses) {
            var cfgFile = deviceService.getCfgXmlParam(cfgXml, nodeId, '0', '84', 'Set');
            var wakeup_zwave_min = (node.instances[0].commandClasses[0x84].data.version.value == 1) ? 0 : node.instances[0].commandClasses[0x84].data.min.value;
            var wakeup_zwave_max = (node.instances[0].commandClasses[0x84].data.version.value == 1) ? 0xFFFFFF : node.instances[0].commandClasses[0x84].data.max.value;
            var wakeup_zwave_value = node.instances[0].commandClasses[0x84].data.interval.value;
            var wakeup_zwave_default_value = (node.instances[0].commandClasses[0x84].data.version.value == 1) ? 86400 : node.instances[0].commandClasses[0x84].data['default'].value; // default is a special keyword in JavaScript
            var wakeup_zwave_nodeId = node.instances[0].commandClasses[0x84].data.nodeId.value;
            var uTime = node.instances[0].commandClasses[0x84].data.updateTime;
            var iTime = node.instances[0].commandClasses[0x84].data.invalidateTime;
            var updateTime = $filter('isTodayFromUnix')(uTime);
            var isUpdated = (uTime > iTime ? true : false);
            if (wakeup_zwave_min !== '' && wakeup_zwave_max !== '') {
                //var methods = getMethodSpec(ZWaveAPIData, nodeId, instanceId, ccId, null);
                var gui_descr = getMethodSpec(ZWaveAPIData, nodeId, 0, 0x84, 'Set');
                gui_descr[0].type.range.min = parseInt(wakeup_zwave_min, 10);
                gui_descr[0].type.range.max = parseInt(wakeup_zwave_max, 10);
                var wakeup_conf_value;
//                var wakeup_config = null;
//                var wakeup_conf_el;
//               var wakeup_conf_nodeId;
                //if (wakeup_config.size() == 1) {
                var wakeup_conf_node_value = 0;
                if (cfgFile !== undefined) {
                    wakeup_conf_value = cfgFile[0] || null;
                    wakeup_conf_node_value = cfgFile[1] || 0;
                } else {
                    if (wakeup_zwave_value != "" && wakeup_zwave_value != 0 && wakeup_zwave_nodeId != "") {
                        // not defined in config: adopt devices values
                        wakeup_conf_value = parseInt(wakeup_zwave_value, 10);
                        //wakeup_conf_nodeId = parseInt(wakeup_zwave_nodeId, 10);
                    } else {
                        // values in device are missing. Use defaults
                        wakeup_conf_value = parseInt(wakeup_zwave_default_value, 10);
                        //wakeup_conf_nodeId = parseInt(ZWaveAPIData.controller.data.nodeId.value, 10);
                    }
                    ;
                }
                ;
                wakeup_cont = {
                    'params': gui_descr,
                    'values': {"0": wakeup_conf_value},
                    name: 'wakeup_' + nodeId + '_' + 0,
                    updateTime: updateTime,
                    isUpdated: isUpdated,
                    defaultValue: wakeup_zwave_default_value,
                    showDefaultValue: wakeup_zwave_default_value,
                    configCconfigValue: wakeup_conf_value,
                    configCconfigNodeValue: wakeup_conf_node_value,
                    confNum: 0,
                    confSize: 0,
                    cmd: 'devices[' + nodeId + '].instances[0].commandClasses[0x84]'
                };
            } else {
                //$('#wakeup_cont .cfg-block-content').append('<span>' + $scope._t('config_ui_wakeup_no_min_max') + '</span>');
            }
        }
        ;
        return wakeup_cont;
    }


    /**
     * Switch all cont
     */
    function switchAllCont(node, nodeId, ZWaveAPIData, cfgXml) {
        var switchall_cont = false;
        if (0x27 in node.instances[0].commandClasses) {
            var cfgFile = deviceService.getCfgXmlParam(cfgXml, nodeId, '0', '27', 'Set');
            var uTime = node.instances[0].commandClasses[0x27].data.mode.updateTime;
            var iTime = node.instances[0].commandClasses[0x27].data.mode.invalidateTime;
            var updateTime = $filter('isTodayFromUnix')(uTime);
            var isUpdated = (uTime > iTime ? true : false);
            var gui_descr = getMethodSpec(ZWaveAPIData, nodeId, 0, 0x27, 'Set');
            var conf_default_value = 0;
            var switchall_conf_value;
            //var switchall_config = null;
            // get default value from the config XML
            if (cfgFile !== undefined) {
                switchall_conf_value = cfgFile[0];
            } else {
                switchall_conf_value = 1;// by default switch all off group only
            }
            switchall_cont = {
                'params': gui_descr,
                'values': {0: switchall_conf_value},
                name: 'switchall_' + nodeId + '_' + 0,
                updateTime: updateTime,
                isUpdated: isUpdated,
                defaultValue: conf_default_value,
                showDefaultValue: conf_default_value,
                configCconfigValue: switchall_conf_value,
                confNum: 0,
                confSize: 0,
                cmd: 'devices[' + nodeId + '].instances[0].commandClasses[0x27]'
            };

        }
        ;
        return switchall_cont;
    }

    /**
     * Protection cont
     */
    function protectionCont(node, nodeId, ZWaveAPIData, cfgXml) {
        var protection_cont = false;
        if (0x75 in node.instances[0].commandClasses) {
            var cfgFile = deviceService.getCfgXmlParam(cfgXml, nodeId, '0', '75', 'Set');
            var uTime = node.instances[0].commandClasses[0x75].data.state.updateTime;
            var iTime = node.instances[0].commandClasses[0x75].data.state.invalidateTime;
            var updateTime = $filter('isTodayFromUnix')(uTime);
            var isUpdated = (uTime > iTime ? true : false);
            var gui_descr = getMethodSpec(ZWaveAPIData, nodeId, 0, 0x75, 'Set');
            //var protection_version = node.instances[0].commandClasses[0x75].data.version.value;
            //var protection_config = null;
            var conf_default_value = 0;
            var protection_conf_value;
            //var protection_conf_rf_value;
            // get default value from the config XML
            if (cfgFile !== undefined) {
                protection_conf_value = cfgFile[0];
            } else {
                protection_conf_value = 0;// by default switch all off group only
            }

            protection_cont = {
                'params': gui_descr,
                'values': {0: protection_conf_value},
                name: 'protection_' + nodeId + '_' + 0,
                updateTime: updateTime,
                isUpdated: isUpdated,
                defaultValue: conf_default_value,
                showDefaultValue: conf_default_value,
                configCconfigValue: protection_conf_value,
                confNum: 0,
                confSize: 0,
                cmd: 'devices[' + nodeId + '].instances[0].commandClasses[0x75]'
            };
        }
        ;
        return protection_cont;
    }

    /**
     * Fwupdate cont
     */
    function fwupdateCont(node) {
        var fwupdate_cont = false;
        if (0x7a in node.instances[0].commandClasses) {
            fwupdate_cont = true;
        }
        ;
        return fwupdate_cont;
    }

    /**
     * Assoc cont
     */
    function assocCont(node) {
        var assoc_cont = null;
        if (0x85 in node.instances[0].commandClasses) {
            assoc_cont = true;
        }
        ;
        return assoc_cont;
    }
    /**
     * Build expert commands
     * @returns {Array}
     */
    function getCommands(methods, ZWaveAPIData) {
        var methodsArr = [];
        angular.forEach(methods, function(params, method) {
            //str.split(',');
            var cmd = {};
            var values = repr_array(method_defaultValues(ZWaveAPIData, methods[method]));
            cmd['data'] = {
                'method': method,
                'params': methods[method],
                'values': method_defaultValues(ZWaveAPIData, methods[method])
            };
            cmd['method'] = method;
            cmd['params'] = methods[method];
            cmd['values'] = repr_array(method_defaultValues(ZWaveAPIData, methods[method]));
            methodsArr.push(cmd);
        });
        //console.log(methodsArr);
        return methodsArr;
    }
    ;
});

// Device config update controller
appController.controller('ConfigStoreController', function($scope, dataService) {
    $scope.formFirmware = {};
    // Store data on remote server
    $scope.store = function(btn) {
        var url = $scope.cfg.server_url + $scope.cfg.store_url + $(btn).attr('data-store-url');
        dataService.runCmd($(btn).attr('data-store-url'), false, $scope._t('error_handling_data'));
    };
    // Show modal dialog
    $scope.showModalInterview = function(target) {
        $(target).modal();
    };

    /**
     * Rename Device action
     *
     * @param {object} form
     * @returns {undefined}
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

    /**
     * Submit expert commands form
     *
     * @param {obj} form
     * @param {obj} cmd
     * @returns {undefined}
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
        return;
    };
    /**
     * update Firmware
     */
    $scope.updateFirmware = function(nodeId) {
        if (($scope.formFirmware.url == '' && $scope.myFile == '') || $scope.formFirmware.targetId == '') {
            return;
        }
        // File upload test
        var data = {
            'url': $scope.formFirmware.url,
            'file': $scope.myFile,
            'targetId': $scope.formFirmware.targetId
        };
        dataService.fwUpdate(nodeId, data);
        return;
    };
});

