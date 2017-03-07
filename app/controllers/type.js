/**
 * @overview This controller renders and handles device types.
 * @author Martin Vach
 */

/**
 * Device type root controller
 * @class TypeController
 *
 */
appController.controller('TypeController', function($scope, $filter, $timeout,$interval,$q,dataService, cfg,_,deviceService) {
    $scope.devices = {
        all: [],
        show: false,
        interval: null
    };

    $scope.deviceClasses = [];
    $scope.productNames = [];

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.devices.interval);
    });

    /**
     * Load all promises
     * @returns {undefined}
     */
    $scope.allSettled = function () {
        var promises = [
            dataService.xmlToJson(cfg.server_url + cfg.device_classes_url),
            dataService.loadZwaveApiData()
        ];

        $q.allSettled(promises).then(function (response) {
            // console.log(response)
            var deviceClasses = response[0];
            var zwaveData = response[1];
            $scope.loading = false;

            // deviceClasses error message
            if (deviceClasses.state === 'rejected') {
                alertify.alertError($scope._t('error_load_data') + ':' + cfg.server_url + cfg.device_classes_url);
            }

            // zwaveData error message
            if (zwaveData.state === 'rejected') {
                alertify.alertError($scope._t('error_load_data'));
                return;
            }
            // Success - deviceClasses
            if (deviceClasses.state === 'fulfilled') {
                setDeviceClasses(deviceClasses.value);
            }

            // Success - zwaveData
            if (zwaveData.state === 'fulfilled') {
                setData(zwaveData.value);
                if(_.isEmpty($scope.devices.all)){
                    $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                    return;
                }
                $scope.devices.show = true;
                $scope.refreshZwaveData();
            }

        });

    };
    $scope.allSettled();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                setData(response.data.joined);
            }, function(error) {});
        };
        $scope.devices.interval = $interval(refresh, $scope.cfg.interval);
    };

    /// --- Private functions --- ///
    /**
     * Set device classess
     * @param {object} data
     * @returns {void}
     */
    function setDeviceClasses(data) {
        angular.forEach(data.DeviceClasses.Generic, function(val) {
            var obj = {};
            obj['id'] = parseInt(val._id);
            obj['generic'] = deviceService.configGetZddxLang(val.name.lang, $scope.lang);
            obj['specific'] = val.Specific;
            $scope.deviceClasses.push(obj);
        });
    }

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
            /*if (nodeId == 255 || node.data.isVirtual.value) {
                return;
            }*/
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
            //var productName = null;
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
            angular.forEach(ccIds, function(v) {
                var cmd = node.instances[instanceId].commandClasses[v];
                if (angular.isObject(cmd) && cmd.name === 'Security') {
                    security = cmd.data.interviewDone.value;

                }
            });


            // DDR
            var ddr = false;
            if (angular.isDefined(node.data.ZDDXMLFile)) {
                ddr = node.data.ZDDXMLFile.value;
            }

            // Zwave plus
            var ZWavePlusInfo = false;
            angular.forEach(ccIds, function(v) {
                var cmd = node.instances[instanceId].commandClasses[v];
                if (angular.isObject(cmd) && cmd.name === 'ZWavePlusInfo') {
                    ZWavePlusInfo = true;

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
            angular.forEach(deviceXml, function(v) {
                if (genericType == v.id) {
                    deviceType = v.generic;
                    angular.forEach(v.specific, function(s) {
                        if (specificType == s._id) {
                            deviceType = deviceService.configGetZddxLang(s.name.lang, $scope.lang);
                        }
                    });

                }
            });

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
            //obj['productName'] = productName;

            var findIndex = _.findIndex($scope.devices.all, {rowId: obj.rowId});
            if(findIndex > -1){
                angular.extend($scope.devices.all[findIndex],obj);

            }else{
                $scope.devices.all.push(obj);
                // Product name from zddx file
                if (zddXmlFile) {
                    dataService.xmlToJson(cfg.server_url + cfg.zddx_url + zddXmlFile).then(function (response) {
                        $scope.productNames[nodeId] = response.ZWaveDevice.deviceDescription.productName;
                    });
                }

            }
        });
    }

    /**
     * Get EXF frame
     * @param {number} $major
     * @param {number} $minor
     * @returns {number}
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