/**
 * BatteryController
 * @author Martin Vach
 */
appController.controller('BatteryController', function($scope, $filter, $http,cfg,dataService, myCache) {
    $scope.battery = [];
    $scope.batteryInfo = [];
    $scope.reset = function() {
        $scope.battery = angular.copy([]);
    };
    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
                refreshData(data);
//                $scope.reset();
//                setData(data.joined);
            });
        });
    };
    $scope.load($scope.lang);

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });
    // Store single data on remote server
    $scope.store = function(btn) {
        var url = $(btn).attr('data-store-url');
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };
    // Store all data on remote server
    $scope.storeAll = function(btn) {
        angular.forEach($scope.battery, function(v, k) {
            dataService.runCmd(v.urlToStore);
        });
    };

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
            var hasBattery = 0x80 in node.instances[0].commandClasses;
            var instanceId = 0;
            var ccId = 0x80;
            if (!hasBattery) {
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            var battery_charge = parseInt(node.instances[0].commandClasses[0x80].data.last.value);
            var battery_updateTime = node.instances[0].commandClasses[0x80].data.last.updateTime;

//            var info = loadZDD(nodeId, ZWaveAPIData);
//            console.log(info);
            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['cmd'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].data.last';
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['level'] = battery_charge;
            obj['scale'] = '%';
            obj['updateTime'] = battery_updateTime;
            obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Get()';
            obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data';
            obj['batteryCount'] = null;
            obj['batteryType'] = null;

            var zddXmlFile = null;
            if (angular.isDefined(node.data.ZDDXMLFile)) {
                zddXmlFile = node.data.ZDDXMLFile.value;
            }
            if (zddXmlFile) {
                var cachedZddXml = myCache.get(zddXmlFile);
                if (!cachedZddXml) {
                    $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                        var x2js = new X2JS();
                        var zddXml = x2js.xml_str2json(response.data);
                        myCache.put(zddXmlFile, zddXml);
                        var batteryInfo = getBatteryInfo(zddXml);
                        obj['batteryCount'] = batteryInfo.batteryCount;
                        obj['batteryType'] = batteryInfo.batteryType;

                    });
                } else {
                    var batteryInfo = getBatteryInfo(cachedZddXml);
                    obj['batteryCount'] = batteryInfo.batteryCount;
                    obj['batteryType'] = batteryInfo.batteryType;
                }
            }

            $scope.battery.push(obj);
        });
    }

    /**
     * Refresh zwave data
     */
    function refreshData(data) {
        angular.forEach($scope.battery, function(v, k) {
            var obj = data.update[v.cmdToUpdate];
            if (obj) {
                var level = parseInt(obj.last.value);
                var updateTime = obj.last.updateTime;
                //var invalidateTime;
                var formatTime = $filter('isTodayFromUnix')(updateTime);
                $('#' + v.rowId + ' .row-level').html(level + '%');
                $('#' + v.rowId + ' .row-time').html(formatTime);
                $('#' + v.rowId + ' .report-img').attr('src', cfg.img.batteries + $filter('getBatteryIcon')(v.level));
                //console.log('Updating:' + v.rowId + ' | At: ' + formatTime + ' | with: ' + level);//REM
            }
        });
    }

    // Load ZDDXML
    $scope.loadZDD_ = function(nodeId) {
        if (nodeId in $scope.zdd)
            return; // zdd already loaded for nodeId
        var node = $scope.ZWaveAPIData.devices[nodeId];
        if (node == undefined)
            return;
        var zddXmlFile = null;
        if (angular.isDefined(node.data.ZDDXMLFile)) {
            zddXmlFile = node.data.ZDDXMLFile.value;
        }
        if (!(zddXmlFile))
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
                        $scope.updateData(nodeId);
                } else {
                    $scope.zdd[nodeId] = undefined;
                }
            });
        } else {
            var zddXml = cachedZddXml;
            if (("ZWaveDevice" in zddXml) && ("assocGroups" in zddXml.ZWaveDevice)) {
                $scope.zdd[nodeId] = zddXml.ZWaveDevice.assocGroups;
                if (nodeId == $scope.deviceId)
                    $scope.updateData(nodeId);
            } else {
                $scope.zdd[nodeId] = undefined;
            }
        }
    };

    // Load ZDDXML
    function loadZDD(nodeId, ZWaveAPIData) {

        var node = ZWaveAPIData.devices[nodeId];
        if (node == undefined) {
            return;
        }

        var zddXmlFile = null;
        if (angular.isDefined(node.data.ZDDXMLFile)) {
            zddXmlFile = node.data.ZDDXMLFile.value;
        }
        if (!(zddXmlFile)) {
            return;
        }
        var cachedZddXml = myCache.get(zddXmlFile);
        if (!cachedZddXml) {
            $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                var x2js = new X2JS();
                var zddXml = x2js.xml_str2json(response.data);
                myCache.put(zddXmlFile, zddXml);
                return getBatteryInfo(zddXml);

            });
        } else {
            return getBatteryInfo(cachedZddXml);
        }
    }
    ;
    // Get battery info
    function getBatteryInfo(zddXml) {
        var info = {
            'batteryCount': null,
            'batteryType': null
        };
        if (("deviceDescription" in zddXml.ZWaveDevice)) {
            var obj = zddXml.ZWaveDevice.deviceDescription;
            if (obj) {
                if (obj.batteryCount) {
                    info.batteryCount = obj.batteryCount;
                }
                if (obj.batteryType) {
                    info.batteryType = obj.batteryType;
                }
            }
        }
        return info;
    }
});