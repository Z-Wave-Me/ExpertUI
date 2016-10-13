/**
 * TypeController
 * @author Martin Vach
 */
appController.controller('TypeController', function($scope, $filter, dataService, deviceService) {
    $scope.devices = [];
    $scope.reset = function() {
        $scope.devices = angular.copy([]);
    };
    $scope.deviceClasses = [];
    $scope.productNames = [];
    // Load  device classes xml data
    $scope.loadDeviceClasses = function() {
        dataService.getDeviceClasses(function(data) {
            var lang = 'en';
            angular.forEach(data.DeviceClasses.Generic, function(val, key) {
                var obj = {};
                var langs = {
                    "en": "0",
                    "de": "1",
                    "ru": "2"
                };
                if (angular.isDefined(langs[$scope.lang])) {
                    lang = $scope.lang;
                }
                var langId = langs[lang];
                obj['id'] = parseInt(val._id);
                //obj['generic'] = val.name.lang[langId].__text;
                obj['generic'] = deviceService.configGetZddxLang(val.name.lang, $scope.lang);
                obj['specific'] = val.Specific;
                obj['langId'] = langId;
                $scope.deviceClasses.push(obj);
            });
        });
    };


    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
                $scope.reset();
                setData(data.joined);
                dataService.cancelZwaveDataInterval();
            });
        });
    };
    $scope.$watch('lang', function() {
        $scope.loadDeviceClasses();
        $scope.load();
    });


    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            var instanceId = 0;
            var ccIds = [32, 34, 37, 38, 43, 70, 91, 94, 96, 114, 119, 129, 134, 138, 143, 152];
            var basicType = node.data.basicType.value;
            var genericType = node.data.genericType.value;
            var specificType = node.data.specificType.value;
            var major = node.data.ZWProtocolMajor.value;
            var minor = node.data.ZWProtocolMinor.value;
            var vendorName = node.data.vendorString.value;
            var zddXmlFile = $filter('hasNode')(node, 'data.ZDDXMLFile.value');
            var productName = null;
            var fromSdk = true;
            var sdk;
            // SDK
            if (node.data.SDK.value == '') {
                sdk = major + '.' + minor;
                fromSdk = false;
            } else {
                sdk = node.data.SDK.value;
            }
            // Version
            var appVersion = node.data.applicationMajor.value + '.' + node.data.applicationMinor.value;
            // Security and ZWavePlusInfo
            var security = false;
            angular.forEach(ccIds, function(v, k) {
                var cmd = node.instances[instanceId].commandClasses[v];
                if (angular.isObject(cmd) && cmd.name === 'Security') {
                    security = cmd.data.interviewDone.value;
                    return;
                }
            });


            // DDR
            var ddr = false;
            if (angular.isDefined(node.data.ZDDXMLFile)) {
                ddr = node.data.ZDDXMLFile.value;
            }

            // Zwave plus
            var ZWavePlusInfo = false;
            angular.forEach(ccIds, function(v, k) {
                var cmd = node.instances[instanceId].commandClasses[v];
                if (angular.isObject(cmd) && cmd.name === 'ZWavePlusInfo') {
                    ZWavePlusInfo = true;
                    return;
                }
            });
            // MWI and EF
            var mwief = getEXFrame(major, minor);
            if(ZWavePlusInfo){
                mwief = 1;
            }
            // Device type
            var deviceXml = $scope.deviceClasses;
            var deviceType = $scope._t('unknown_device_type') + ': ' + genericType;
            angular.forEach(deviceXml, function(v, k) {
                if (genericType == v.id) {
                    deviceType = v.generic;
                    angular.forEach(v.specific, function(s, sk) {
                        if (specificType == s._id) {
                            deviceType = deviceService.configGetZddxLang(s.name.lang, $scope.lang);
//                            if (angular.isDefined(s.name.lang[v.langId].__text)) {
//                                deviceType = s.name.lang[v.langId].__text;
//                            }
                        }
                    });
                    return;
                }
            });

            // Product name from zddx file
            if (zddXmlFile) {
                dataService.getZddXml(zddXmlFile, function(zddxml) {
                    //productName = $filter('hasNode')(zddxml, 'ZWaveDevice.deviceDescription.productName');
                    // productName = zddxml.ZWaveDevice.deviceDescription.productName;
                    $scope.productNames[nodeId] = zddxml.ZWaveDevice.deviceDescription.productName;
                });

            }
            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['security'] = security;
            obj['mwief'] = mwief;
            obj['ddr'] = ddr;
            obj['ZWavePlusInfo'] = ZWavePlusInfo;
            obj['sdk'] = (sdk == '0.0' ? '?' : sdk);
            obj['fromSdk'] = fromSdk;
            obj['appVersion'] = appVersion;
            obj['type'] = deviceType;
            obj['deviceType'] = deviceType;
            obj['basicType'] = basicType;
            obj['genericType'] = genericType;
            obj['specificType'] = specificType;
            obj['vendorName'] = vendorName;
            obj['productName'] = productName;
            $scope.devices.push(obj);
        });
    }

    /**
     * Get EXF frame
     */
    function getEXFrame($major, $minor) {
        if ($major == 1)
            return 0;
        if ($major == 2) {
            if ($minor >= 96)
                return 1;
            if ($minor == 74)
                return 1;
            return 0;
        }
        if ($major == 3)
            return 1;
        return 0;
    }

});