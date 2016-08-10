/**
 * Configuration controller
 * @author Martin Vach
 */
// Redirect to new version of configuration
appController.controller('ConfigRedirectController', function ($routeParams, $location, $cookies, $filter) {
    var configUrl = 'configuration/interview';
    var nodeId = function () {
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
appController.controller('ConfigInterviewController', function ($scope, $routeParams, $route, $location, $cookies, $filter, $http, dataService, deviceService, myCache) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'interview';
    $scope.activeUrl = 'configuration/interview/';
    $cookies.tab_config = $scope.activeTab;
    $scope.modelSelectZddx = false;

    // Interview data
    $scope.descriptionCont;
    $scope.deviceZddx = [];
    // Load data
    $scope.load = function (nodeId) {
        //nodeId = parseInt(nodeId,10);
        dataService.getZwaveData(function (ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            var node = ZWaveAPIData.devices[nodeId];
            if (!node || deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.deviceName = $filter('deviceName')(nodeId, node);

            setData(ZWaveAPIData, nodeId);
            dataService.joinedZwaveData(function (data) {
                node = data.joined.devices[nodeId];
                refreshData(node, nodeId, data.joined);
                $scope.ZWaveAPIData = ZWaveAPIData;
            });
        }, true);
    };
    $scope.load($routeParams.nodeId);

    // Redirect to detail page
    $scope.changeDevice = function (deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    // Cancel interval on page destroy
    $scope.$on('$destroy', function () {
        dataService.cancelZwaveDataInterval();
    });

    /**
     * Rename Device action
     */
    $scope.renameDevice = function (form) {
        var deviceId = $scope.deviceId;
        var givenName = $('#' + form + ' #device_name').val();
        var cmd = 'devices[' + deviceId + '].data.givenName.value=\'' + givenName + '\'';
        dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
        $('#config_device_name').html(givenName);
        $('#device_node_name').html(givenName);
        $route.reload();
        return;
    };

    // Store data on remote server
    $scope.store = function (v) {
        var url = 'devices[' + $scope.deviceId + '].instances[' + v.iId + '].commandClasses[' + v.ccId + '].Interview()';
        dataService.runCmd(url);
    };

    // Show modal CommandClass dialog
    $scope.showModalCommandClass = function (target, instanceId, ccId, type) {
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
        $(target).modal();
    };

    // Show modal dialog
    $scope.showModalInterview = function (target) {
        $(target).modal();
    };

    // Show modal device select dialog
    $scope.showModalDeviceSelect = function (target, nodeId, alert) {
        dataService.getSelectZDDX(nodeId, function (data) {
            $scope.deviceZddx = data;
        }, alert);
        $(target).modal();

    };

    // Change device select
    $scope.changeDeviceSelect = function (selector, target, file) {
        var imageFile = $(selector).find(':selected').data('image');
        var image;
        if (imageFile == undefined) {
            image = $scope._t('no_device_image');
        } else {
            image = '<img src="' + imageFile + '" />';
        }
        $scope.modelSelectZddx = file;
        $(target).html(image);
    };

    // Run cmd
    $scope.runCmd = function (cmd) {
        dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
    };

    // Update device zddx file
    $scope.runCmdDeviceSelect = function (nodeId) {
        var cmd = 'devices[' + nodeId + '].LoadXMLFile("' + $scope.modelSelectZddx + '")';
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
            $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function (response) {
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

// Device configuration Postfix controller
appController.controller('PostfixController', function ($scope, $routeParams, $location, $cookies, $filter, $timeout, $window, dataService, deviceService) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'postfix';
    $scope.activeUrl = 'configuration/postfix/';
    $cookies.tab_config = $scope.activeTab;
    $scope.postfix = {
        find: false,
        interview: {
            preInterview: '',
            postInterview: '',
        },
        model: {
            p_id: false,
            product: '',
            preInterview: [],
            postInterview: [],
            last_update: '',
            tester: '',
            commentary: ''
        }
    };
    // Interview data
    $scope.descriptionCont;
    $scope.deviceZddx = [];
    // Redirect to detail page
    $scope.changeDevice = function (deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };
    // Load data
    $scope.loadData = function (nodeId) {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            var node = ZWaveAPIData.devices[nodeId];
            if (!node || deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;

            $scope.postfix.model.p_id = getPId(node);
            $scope.loadPostfix($scope.postfix.model.p_id);
        }, function (error) {
            $location.path('/error/' + error.status);
            return;
        });
    };
    $scope.loadData($routeParams.nodeId);

    // Load postfix
    $scope.loadPostfix = function (p_id) {
        if (!p_id) {
            return;
        }
        dataService.getApi('postfixget_url', '/' + p_id, false).then(function (response) {
            $scope.postfix.find = response.data;
        }, function (error) {});
    };

    // Add interview
    $scope.addInterview = function (key) {
        var source = $scope.postfix.interview[key];
        if (key && source) {
            $scope.postfix.model[key].push(source);
            $scope.postfix.interview[key] = '';
        }
    };
    // Remove interview
    $scope.removeInterview = function (key, index) {
        $scope.postfix.model[key].splice(index, 1);
        return;
    };


    // Update a postfix
    $scope.updatePostfix = function () {
        $scope.postfix.model.last_update = $filter('getMysqlFromNow')('');
        dataService.postApi('postfixadd_url', $scope.postfix.model).then(function (response) {
            deviceService.showNotifier({message: $scope._t('zwave_reinstalled')});
            $timeout(function () {
                alertify.dismissAll();
                $window.location.reload();
            }, 5000);
        }, function (error) {
            alertify.alertError($scope._t('error_update_data'));
            return;
        });
    };
    // Delete postfix
    $scope.deletePostfix = function (message) {
        alertify.confirm(message, function () {
            var input = {p_id: $scope.postfix.model.p_id};
            dataService.postApi('postfixremove_url', input).then(function (response) {
                deviceService.showNotifier({message: $scope._t('delete_successful')});
                $timeout(function () {
                    alertify.dismissAll();
                    $window.location.reload();
                }, 5000);
            }, function (error) {
                alertify.alertError($scope._t('error_delete_data'));
                return;
            });
        });


    };

    /// --- Private functions --- ///

    function getPId(node) {

        var mId = node.data.manufacturerId.value ? node.data.manufacturerId.value : null;
        var mPT = node.data.manufacturerProductType.value ? node.data.manufacturerProductType.value : null;
        var mPId = node.data.manufacturerProductId.value ? node.data.manufacturerProductId.value : null;

        var p_id = mId + "." + mPT + "." + mPId;

        return (p_id !== 'null.null.null' ? p_id : false);
    }
});
// Device configuration Configuration controller
appController.controller('ConfigConfigurationController', function ($scope, $routeParams, $location, $cookies, $filter, $http, $timeout, $route, $window, dataService, deviceService, myCache, _) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'configuration';
    $scope.activeUrl = 'configuration/configuration/';
    $cookies.tab_config = $scope.activeTab;
    $scope.reset = function () {
        $scope.devices = angular.copy([]);
    };
    // Config vars
    $scope.modelSelectZddx = false;
    $scope.deviceZddx = [];
    $scope.configCont;
    $scope.switchAllCont;
    $scope.protectionCont;
    $scope.wakeupCont;

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

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.deviceName = $filter('deviceName')(nodeId, node);

            setData(ZWaveAPIData, nodeId);

        });
    };
    $scope.load($routeParams.nodeId);

    // Load device description
    $scope.loadDeviceDescription = function (nodeId) {
        dataService.getSelectZDDX(nodeId, function (data) {
            $scope.deviceZddx = data;
        });

    };
    $scope.loadDeviceDescription($routeParams.nodeId);

    // Change device select
    $scope.changeDeviceSelect = function (selector, target, file) {
        var imageFile = $(selector).find(':selected').data('image');
        var image;
        if (imageFile == undefined) {
            image = $scope._t('no_device_image');
        } else {
            image = '<img src="' + imageFile + '" />';
        }
        $scope.modelSelectZddx = file;
        $(target).html(image);
    };

    // Update device zddx file
    $scope.runCmdDeviceSelect = function (nodeId) {
        var cmd = 'devices[' + nodeId + '].LoadXMLFile("' + $scope.modelSelectZddx + '")';
        dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
        //$window.location.reload();
        dataService.purgeCache();
        $route.reload();
    };

    // Refresh data
    $scope.refresh = function (nodeId) {
        dataService.joinedZwaveData(function (data) {
            //setData(data.joined, nodeId, true);
        });
    };
    //$scope.refresh($routeParams.nodeId); 

    // Redirect to detail page
    $scope.changeDevice = function (deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    // Cancel interval on page destroy
    $scope.$on('$destroy', function () {
        dataService.cancelZwaveDataInterval();
    });

    /**
     * Update from device action
     *
     * @param {string} cmd
     * @returns {undefined}
     */
    $scope.updateFromDevice = function (cmd, hasBattery, deviceId, form) {
        if (hasBattery) {
            alert($scope._t('conf_apply_battery'));
        }
        dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
        $scope.refresh(deviceId);

        $('#' + form + ' .cfg-control-content :input').prop('disabled', true);
        $timeout(function () {
            dataService.cancelZwaveDataInterval();
            $scope.load($routeParams.nodeId);
            $('#' + form + ' .cfg-control-content :input').prop('disabled', false);
        }, 5000);
        return;
    };

    /**
     * Update from device - configuration section
     */
    $scope.updateFromDeviceCfg = function (cmd, cfg, deviceId, form) {
        angular.forEach(cfg, function (v, k) {
            if (v.confNum) {
                var request = cmd + '(' + v.confNum + ')';
                dataService.runCmd(request);
            }
        });
        $scope.refresh(deviceId);
        $('#' + form + ' .cfg-control-content :input').prop('disabled', true);
        $timeout(function () {
            dataService.cancelZwaveDataInterval();
            $scope.load($routeParams.nodeId);
        }, 3000);
        return;
    };

    /**
     * Set all values to default
     */
    $scope.setAllToDefault = function (cmd, cfgValues, hasBattery, form) {
        var dataArray = {};
        angular.forEach(cfgValues, function (v, k) {
            dataArray[v.confNum] = {
                value: $filter('setConfigValue')(v.showDefaultValue),
                name: v.name
                        //cfg: v
            };
        });
        //console.log(dataArray)
        $scope.submitApplyConfigCfg(form, cmd, cfgValues, hasBattery, null, false, dataArray);

    };


    /**
     * Apply Config action
     */
    $scope.submitApplyConfigCfg = function (form, cmd, cfgValues, hasBattery, confNum, setDefault, hasData) {
        var xmlData = [];
        var configValues = [];
        if (hasBattery) {
            alert($scope._t('conf_apply_battery'));
        }

        var dataArray = _.isObject(hasData) ? hasData : {};

        if (!_.isObject(hasData)) {
            data = $('#' + form).serializeArray();
            angular.forEach(data, function (v, k) {
                if (v.value === 'N/A') {
                    return;
                }
                var value = $filter('setConfigValue')(v.value);
                var inputConfNum = v.name.match(/\d+$/)[0];
                var inputType = v.name.split('_')[0];
                if (!inputConfNum) {
                    return;
                }
                var cfg = _.findWhere(cfgValues, {confNum: inputConfNum.toString()});
                if (cfg) {
                    if ('bitset' in cfg.type) {
                        if (inputType === 'bitrange') {
                            var bitRange = _.findWhere(cfg.type.bitset, {name: v.name});
                            value = (value === '' ? 0 : parseInt(value));
                            if (value < bitRange.type.bitrange.bit_from && value > 0) {
                                value = bitRange.type.bitrange.bit_from;
                            } else if (value > bitRange.type.bitrange.bit_to) {
                                value = bitRange.type.bitrange.bit_to;
                            }
                        } else {
                            value = Math.pow(2, value);

                        }

                    }
                    /*else if('enumof' in cfg.type){
                     var enumof = _.findWhere(cfg.type.enumof,{name: v.name});
                     
                     }*/
                }
                if (dataArray[inputConfNum]) {
                    dataArray[inputConfNum].value += value;
                } else {
                    dataArray[inputConfNum] = {
                        value: value,
                        name: v.name
                                //cfg: cfg
                    };


                }

            });
        }
        angular.forEach(dataArray, function (n, nk) {
            var obj = {};
            var parameter;
            var lastNum = n.name.match(/\d+$/);
            if (!lastNum) {
                return;
            }

            var num = lastNum[0];
            //console.log('num', num)
            var confSize = 0;
            var value = n.value;
            if (angular.isObject(setDefault) && setDefault.confNum == num) {
                value = setDefault.showDefaultValue;
            }
            configValues.push(value)
            angular.forEach(cfgValues, function (cv, ck) {
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
                angular.forEach(xmlData, function (v, k) {

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

        dataService.getCfgXml(function (cfgXml) {
            var xmlFile = deviceService.buildCfgXml(xmlData, cfgXml, cmd['id'], cmd['commandclass']);
            dataService.putCfgXml(xmlFile);
        });


        //debugger;
        $scope.refresh(cmd['id']);
        if (confNum) {
            $('#cfg_control_' + confNum + ' :input').prop('disabled', true);
        } else {
            $('#' + form + ' .cfg-control-content :input').prop('disabled', true);
        }
        $timeout(function () {
            $scope.load($routeParams.nodeId);
            $('button .fa-spin,a .fa-spin').fadeOut(1000);
            $('#' + form + ' .cfg-control-content :input').prop('disabled', false);
            dataService.cancelZwaveDataInterval();
        }, 3000);
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
                $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function (response) {
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
        dataService.getCfgXml(function (cfgXml) {
            $scope.configCont = deviceService.configConfigCont(node, nodeId, zddXml, cfgXml, $scope.lang, $scope.languages);
            $scope.wakeupCont = deviceService.configWakeupCont(node, nodeId, ZWaveAPIData, cfgXml);
            $scope.protectionCont = deviceService.configProtectionCont(node, nodeId, ZWaveAPIData, cfgXml);
            $scope.switchAllCont = deviceService.configSwitchAllCont(node, nodeId, ZWaveAPIData, cfgXml);
        });
    }



});
// Device configuration commands controller
appController.controller('ConfigCommandsController', function ($scope, $routeParams, $location, $cookies, $timeout, $filter, dataService, deviceService, _) {
    $scope.devices = [];
    $scope.commands = [];
    $scope.interviewCommands;

    $scope.deviceId = 0;
    $scope.activeTab = 'commands';
    $scope.activeUrl = 'configuration/commands/';

    $cookies.tab_config = $scope.activeTab;

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
     * Submit expert commands form
     */
    $scope.submitExpertCommndsForm = function (form, cmd) {
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
    };

    // Show modal dialog
    $scope.showModal = function (target, instanceId, index, ccId, type) {
        console.log('Showing modal')
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
        $(target).modal();
    };
    // Show modal dialog
    $scope.hideModal = function () {
        dataService.cancelZwaveDataInterval();

    };

    /// --- Private functions --- ///


});
// Device configuration firmware controller
appController.controller('ConfigFirmwareController', function ($scope, $routeParams, $location, $cookies, dataService, deviceService) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'firmware';
    $scope.activeUrl = 'configuration/firmware/';
    $scope.showForm = false;
    $scope.formFirmware = {};
    $scope.firmwareProgress = 0;

    $cookies.tab_config = $scope.activeTab;

    // Load data
    $scope.load = function (nodeId) {
        dataService.getZwaveData(function (ZWaveAPIData) {
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            var node = ZWaveAPIData.devices[nodeId];
            if (!node || deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
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
    $scope.changeDevice = function (deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };
    /**
     * update Firmware
     * todo: complete this function
     */
    $scope.updateFirmware = function (nodeId) {
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
        $scope.$watch('firmwareProgress', function () {
            if ($scope.firmwareProgress >= 100) {
                $('.fa-spin').fadeOut();
                dataService.cancelZwaveDataInterval();
            }

        });
        // Cancel interval on page destroy
        $scope.$on('$destroy', function () {
            dataService.cancelZwaveDataInterval();
        });

        dataService.fwUpdate(nodeId, data);
        return;
    };

});

// Configuration link health controller
appController.controller('ConfigHealthController', function ($scope, $routeParams, $location, $cookies, $filter, $interval, cfg, deviceService, dataService) {
     $scope.apiDataInterval;
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'health';
    $scope.activeUrl = 'configuration/health/';
    $cookies.tab_config = $scope.activeTab;
     $cookies.interval = $scope.activeTab;
    $scope.health = {
        ctrlNodeId: 1,
        alert: {message: false, status: 'is-hidden', icon: false},
        device: {
            neighbours:[],
            node: {},
            find: {},
            hasPowerLevel: false,
            commandClass: false
        },
        cmd: {
            testNodeInstance: 0
        },
        neighbours: [],
        timing: {
            all: {},
            indicator: {},
            find: {
            }
        }
    };
     // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.apiDataInterval);
    });

    // Redirect to detail page
    $scope.changeDevice = function (deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    // Load timing data
    $scope.loadTiming = function () {
        //$scope.health.alert = {message: $scope._t('not_linked_devices'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
        dataService.getApi('stat_url', null, true).then(function (response) {
            $scope.health.timing.all = response.data;
            $scope.health.timing.indicator =  setTimingIndicator(response.data[$routeParams.nodeId]);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
            return;
        });
    };
    $scope.loadTiming();

    // Load data
    $scope.load = function () {
        //$scope.health.alert = {message: $scope._t('not_linked_devices'), status: 'alert-warning', icon: 'fa-exclamation-circle'};

        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            $scope.health.ctrlNodeId = ZWaveAPIData.controller.data.nodeId.value;
            var node = ZWaveAPIData.devices[$routeParams.nodeId];
            if (!node || deviceService.notDevice(ZWaveAPIData, node, $routeParams.nodeId)) {
                return;
            }
            var neighbours = $filter('hasNode')(node.data, 'neighbours.value');
            $scope.health.device.neighbours = $filter('hasNode')(node.data, 'neighbours.value');
            
            // Remember device id   
            $cookies.configuration_id = $routeParams.nodeId;
            $cookies.config_url = $scope.activeUrl + $routeParams.nodeId;
            $scope.deviceId = $routeParams.nodeId;
            $scope.health.device.node = node;
            setDevice(node);
            setData(ZWaveAPIData, neighbours);
            $scope.refreshData(ZWaveAPIData);

        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
            return;
        });
    };
    $scope.load();
    
    /**
     * Refresh data
     */
    $scope.refreshData = function(ZWaveAPIData) {
        var refresh = function() {
            dataService.loadJoinedZwaveData(ZWaveAPIData).then(function(response) {
                setData(ZWaveAPIData);
            }, function(error) {
                return;
            });
        };
        $scope.apiDataInterval = $interval(refresh, $scope.cfg.interval);
    };

    // Run Zwave Command
    $scope.runZwaveCmd = function (cmd) {
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {
        }, function (error) {
            alertify.alertError($scope._t('error_load_data') + '\n' + cmd);
            //$window.alert($scope._t('error_handling_data') + '\n' + cmd);
        });
    };
    // Run Zwave NOP Command
    $scope.runZwaveNopCmd = function (cmd) {
        for (i = 0; i < 21; i++) {
            $scope.runZwaveCmd(cmd);
        }
    };

    // Handle power level modal window
    $scope.handlePowerLevelModal = function (name, event, device) {
        $scope.handleModal(name, event);
        $scope.health.device.find = device;
        if (!device) {
            $scope.health.device.commandClass = {};
            return;
        }
        var cc = deviceService.configGetCommandClass($scope.health.device.hasPowerLevel[device.id], '/', '');
        $scope.health.device.commandClass = deviceService.configSetCommandClass(cc);
    };

    // Handle timing modal window
    $scope.handleTimingModal = function (name, event, device) {
        $scope.handleModal(name, event);
        $scope.health.device.find = device;
        if (!device) {
            $scope.health.timing.find = {};
            return;
        }
        $scope.loadTiming();
        var timingItems = $scope.health.timing.all[$routeParams.nodeId];
        if (!timingItems || _.isEmpty(timingItems)) {
            return;
        }
        $scope.health.timing.find = {
            totalPackets: timingItems.length,
            okPackets: deviceService.getOkPackets(timingItems),
            lastPackets: deviceService.getLastPackets(timingItems)
        };
    };

    /// --- Private functions --- ///
    /**
     * Set configuration device
     * @param {object} node
     * @returns {undefined}
     */
    function setDevice(node) {
        angular.forEach(node.instances, function (instance, instanceId) {
            if (instance.commandClasses[115]) {
                $scope.health.device.hasPowerLevel = instance.commandClasses[115].data;
                $scope.health.cmd.testNodeInstance = instanceId;
            }


        });
    }

    /**
     * Set list of the linked devices
     * @param {object} ZWaveAPIData
     * @returns {undefined}
     */
    function setData(ZWaveAPIData, neighbours) {
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            //console.log($scope.health.timing)
            nodeId = parseInt(nodeId);
            if ($scope.health.device.neighbours.indexOf(nodeId) === -1) {
                return;
            }
            //console.log(node)
            var isListening = node.data.isListening.value;
            var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
            var hasWakeup = 0x84 in node.instances[0].commandClasses;
            var centralController = true;
            var type;
            var indicator;
            var powerLevel = $scope.health.device.hasPowerLevel[nodeId];
            if (powerLevel) {
                indicator = setPowerLevelIndicator(powerLevel);
            }
            if (node.data.genericType.value === 1) {
                type = 'portable';
            } else if (node.data.genericType.value === 2) {
                type = 'static';
            } else if (isFLiRS) {
                type = 'flirs';
            } else if (hasWakeup) {
                type = node.data.isAwake.value ? 'battery' : 'sleep';
            } else if (isListening) {
                type = 'mains';
            } else {
                type = 'error';
            }
            var obj = {
                id: nodeId,
                name: $filter('deviceName')(nodeId, node),
                updateTime: node.data.updateTime,
                type: type,
                centralController: centralController,
                powerLevel: powerLevel,
                indicator: indicator,
                cmdTestNode: 'devices[' + $routeParams.nodeId + '].instances[' + $scope.health.cmd.testNodeInstance + '].commandClasses[115].TestNodeSet(' + nodeId + ',6,20)',
                cmdNop: 'devices[' + $routeParams.nodeId + '].instances[' + $scope.health.cmd.testNodeInstance + '].commandClasses[32].Get()'
            };
             var index = _.findIndex($scope.health.neighbours, {id: nodeId});
                        if ($scope.health.neighbours[index]) {
                             angular.extend($scope.health.neighbours[index],obj);
                        }else{
                            $scope.health.neighbours.push(obj);
                        }
            
        });
    }
    /**
     * Set power level indicator
     * @param {object} data
     * @returns {object}
     */
    function setPowerLevelIndicator(data) {
        var indicator = {
            color: 'gray',
            updateTime: false
        };
        var traffic = 'gray';
        if (!data || _.isEmpty(data) || data.acknowledgedFrames.value === null) {
            return indicator;
        }
        if (data.acknowledgedFrames.value > -1 && data.acknowledgedFrames.value < 6) {
            indicator.color = 'red';
        } else if (data.acknowledgedFrames.value > 5 && data.acknowledgedFrames.value < 18) {
            indicator.color = 'orange';
        } else if (data.acknowledgedFrames.value > 17) {
            indicator.color = 'green';
        }
        indicator.updateTime = data.acknowledgedFrames.updateTime;
        return  indicator;
    }
    /**
     * Set power level indicator
     * @param {int} nodeId
     * @returns {object}
     */
    function setTimingIndicator(data) {
        var indicator = {
            color: 'gray',
            updateTime: false
        };
        if (!data || _.isEmpty(data)) {
            return indicator;
        }
        //console.log(data)
        //return;

        var cnt = 0;
        var sum = 0;
        var avg;
        angular.forEach(data.slice(-20), function (v, k) {
            indicator.updateTime = v.date;
            var val = 0;
            if (v.delivered) {
                val = parseInt(v.deliveryTime);
                sum += val;
            }
            cnt++;
        });
        avg = (sum / cnt).toFixed();
        if (avg > 0) {
            indicator.color = (avg > 100 ? 'black' : 'green');
        } else {
            indicator.color = 'red';
        }
        return indicator;
    }
});
