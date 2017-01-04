/**
 * @overview This controller renders and handles device configuration stuff.
 * @author Martin Vach
 */

/**
 * Device configuration configuration controller
 * @class ConfigConfigurationController
 *
 */
appController.controller('ConfigConfigurationController', function ($scope, $routeParams, $location, $cookies, $filter, $http, $timeout, $route, cfg, dataService, deviceService, myCache, _) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'configuration';
    $scope.activeUrl = 'configuration/configuration/';
    $cookies.tab_config = $scope.activeTab;
    $scope.reset = function () {
        $scope.devices = angular.copy([]);
    };
    // Config vars
    $scope.hasConfigurationCc = false;
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

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.deviceName = $filter('deviceName')(nodeId, node);

            setData(ZWaveAPIData, nodeId);

        });
    };
    $scope.load($routeParams.nodeId);

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
    $scope.updateFromDevice = function (cmd, hasBattery, deviceId, form,spin) {
        if (hasBattery) {
            deviceService.showNotifier({message: $scope._t('conf_apply_battery'),type: 'warning'});
        }
        $scope.toggleRowSpinner(spin);
        dataService.runZwaveCmd(cfg.store_url + cmd);
        $scope.refresh(deviceId);

        $('#' + form + ' .cfg-control-content :input').prop('disabled', true);
        $timeout(function () {
            $scope.toggleRowSpinner();
            dataService.cancelZwaveDataInterval();
            $scope.load($routeParams.nodeId);
            $('#' + form + ' .cfg-control-content :input').prop('disabled', false);
        }, 3000);
        return;
    };

    /**
     * Update from device - configuration section
     */
    $scope.updateFromDeviceCfg = function (cmd, config, deviceId, form,spin) {
        var request = cfg.store_url + cmd;
        $scope.toggleRowSpinner(spin);
        angular.forEach(config, function (v, k) {
            if (v.confNum) {
                dataService.runZwaveCmd(request + '(' + v.confNum + ')');
            }
        });
        $scope.refresh(deviceId);
        $('#' + form + ' .cfg-control-content :input').prop('disabled', true);
        $timeout(function () {
            dataService.cancelZwaveDataInterval();
            $scope.load($routeParams.nodeId);
            $scope.toggleRowSpinner();
        }, 3000);
        return;
    };

    /**
     * Set all values to default
     */
    $scope.setAllToDefault = function (cmd, cfgValues, hasBattery, form,spin) {
        var dataArray = {};
        angular.forEach(cfgValues, function (v, k) {
            dataArray[v.confNum] = {
                value: $filter('setConfigValue')(v.showDefaultValue),
                name: v.name
                //cfg: v
            };
        });
        //console.log(dataArray)
        $scope.submitApplyConfigCfg(form, cmd, cfgValues, hasBattery, false, false, dataArray,spin);

    };


    /**
     * Apply Config action
     */
    $scope.submitApplyConfigCfg = function (form, cmd, cfgValues, hasBattery, confNum, setDefault, hasData,spin) {
        var xmlData = [];
        var configValues = [];
        if (hasBattery) {
            //alert($scope._t('conf_apply_battery'));
            deviceService.showNotifier({message: $scope._t('conf_apply_battery'),type: 'warning'});
        }

        var dataArray = _.isObject(hasData) ? hasData : {};
        $scope.toggleRowSpinner(spin);
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
                    dataArray[inputConfNum].value += ',' + value;
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
                            dataService.runZwaveCmd(cfg.store_url + configRequest);
                        }
                    } else {
                        dataService.runZwaveCmd(cfg.store_url + configRequest);
                    }

                });
                break;
            case '75':// Protection
                request += cmd.command + '(' + configValues.join(",") + ')';
                dataService.runZwaveCmd(cfg.store_url + request);
                break;
            case '84':// Wakeup
                request += cmd.command + '(' + configValues.join(",") + ')';
                dataService.runZwaveCmd(cfg.store_url + request);
                break;
            case '27':// Switch all
                request += cmd.command + '(' + configValues.join(",") + ')';
                dataService.runZwaveCmd(cfg.store_url + request);
                break;
            default:
                break;
        }

        dataService.getCfgXml().then(function (cfgXml) {
            var xmlFile = deviceService.buildCfgXml(xmlData, cfgXml, cmd['id'], cmd['commandclass']);
            dataService.putCfgXml(xmlFile);
        });


        $scope.refresh(cmd['id']);
        if (confNum) {
            $('#cfg_control_' + confNum + ' :input').prop('disabled', true);
        } else {
            $('#' + form + ' .cfg-control-content :input').prop('disabled', true);
        }
        $timeout(function () {
            $scope.load($routeParams.nodeId);
            $('#' + form + ' .cfg-control-content :input').prop('disabled', false);
            dataService.cancelZwaveDataInterval();
            $scope.toggleRowSpinner();
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
            // Loop throught instances
            angular.forEach(node.instances, function (instance, instanceId) {
                if (instance.commandClasses[112]) {

                    $scope.hasConfigurationCc =  configurationCc(instance.commandClasses[112], instanceId,nodeId, ZWaveAPIData);
                    return;
                }
            });
        }
        dataService.getCfgXml().then(function (cfgXml) {
            $scope.configCont = deviceService.configConfigCont(node, nodeId, zddXml, cfgXml, $scope.lang, $scope.languages);
            $scope.wakeupCont = deviceService.configWakeupCont(node, nodeId, ZWaveAPIData, cfgXml);
            $scope.protectionCont = deviceService.configProtectionCont(node, nodeId, ZWaveAPIData, cfgXml);
            $scope.switchAllCont = deviceService.configSwitchAllCont(node, nodeId, ZWaveAPIData, cfgXml);
            if (cfg.app_type === 'installer') {
                if (!$scope.configCont && !$scope.wakeupCont && !$scope.protectionCont && !$scope.switchAllCont) {
                    $location.path('/configuration/commands/' + $routeParams.nodeId);
                    return;
                }
            }

        });
    }
    function configurationCc(commandClass, instanceId,nodeId, ZWaveAPIData) {
        //console.log(node);

        var ccId = 112;
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
        return obj;
    }



});
