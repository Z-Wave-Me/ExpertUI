/**
 * AssociationsController
 * @author Martin Vach
 */
appController.controller('AssociationsController', function($scope, $filter, $http, myCache, dataService) {
    $scope.devices = [];
    $scope.ZWaveAPIData = [];
    $scope.showLifeline = false;
    $scope.zdd;
    $scope.reset = function() {
        $scope.devices = angular.copy([]);
    };
    // Load data
    $scope.load = function(lang) {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
        });
    };
    // Load data
    $scope.load($scope.lang);

    // Refresh data
    $scope.refresh = function() {
        dataService.joinedZwaveData(function(data) {
            $scope.reset();
            setData(data.joined);
            dataService.cancelZwaveDataInterval();
        });
    };
    //$scope.refresh();


    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });
    // Store data on remote server
    $scope.lifeline = function(status) {
        $scope.reset();
        $scope.showLifeline = status;
        $scope.load($scope.lang);
    };
    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        var cnt = 1;
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }
            var zddXmlFile = null;
            if (angular.isDefined(node.data.ZDDXMLFile)) {
                zddXmlFile = node.data.ZDDXMLFile.value;
            }
            var zdd;
            if (zddXmlFile && zddXmlFile !== 'undefined') {
                var cachedZddXml = myCache.get(zddXmlFile);
                if (!cachedZddXml) {
                    $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                        var x2js = new X2JS();
                        var zddXml = x2js.xml_str2json(response.data);
                        myCache.put(zddXmlFile, zddXml);
                        var assocGroup = [];
                        if (("ZWaveDevice" in zddXml) && ("assocGroups" in zddXml.ZWaveDevice)) {
                            zdd = zddXml.ZWaveDevice.assocGroups;
                            var assocDevices = getAssocDevices(node, ZWaveAPIData, zdd, controllerNodeId);
                            $scope.devices.push({
                                'id': nodeId,
                                'rowId': 'row_' + nodeId + '_' + cnt,
                                'name': $filter('deviceName')(nodeId, node),
                                'assocGroup': assocDevices
                            });
                        }

                    });
                } else {
                    var zddXml = cachedZddXml;
                    var assocGroup = [];
                    if (("ZWaveDevice" in zddXml) && ("assocGroups" in zddXml.ZWaveDevice)) {
                        zdd = zddXml.ZWaveDevice.assocGroups;
                        var assocDevices = getAssocDevices(node, ZWaveAPIData, zdd, controllerNodeId);
                        $scope.devices.push({
                            'id': nodeId,
                            'rowId': 'row_' + nodeId + '_' + cnt,
                            'name': $filter('deviceName')(nodeId, node),
                            'assocGroup': assocDevices
                        });
                    }
                }
            } else {
                zdd = null;
                var assocDevices = getAssocDevices(node, ZWaveAPIData, zdd, controllerNodeId);
                $scope.devices.push({
                    'id': nodeId,
                    'rowId': 'row_' + nodeId + '_' + cnt,
                    'name': $filter('deviceName')(nodeId, node),
                    'assocGroup': assocDevices
                });
            }


            cnt++;
        });
    }
    /**
     * Get group name
     */
    function getGroupLabel(assocGroups, index, instance) {
        // Set default assoc group name
        var label = $scope._t('association_group') + " " + (index + 1);

        // Attempt to get assoc group name from the zdd file
        var langs = $filter('hasNode')(assocGroups, 'description.lang');
        if (langs) {
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
            angular.forEach(instance[0].commandClasses, function(v, k) {
                if (v.name == 'AssociationGroupInformation') {
                    label = $filter('hasNode')(v, 'data.' + (index + 1) + '.groupName.value');
                }

            });
        }

        return label;
    }
    ;
    /**
     * Get assoc devices
     */
    function getAssocDevices(node, ZWaveAPIData, zdd, controllerNodeId) {
        var assocGroups = [];
        var assocDevices = [];
        var assoc = [];
        var data;
        if (0x85 in node.instances[0].commandClasses) {
            var cc = node.instances[0].commandClasses[0x85].data;
            if (cc.groups.value >= 1) {
                for (var grp_num = 1; grp_num <= parseInt(cc.groups.value, 10); grp_num++) {
                    var groupArr = [];
                    var groupDev = [];
                    if (assocGroups.indexOf(grp_num) == -1) {
                        assocGroups.push(grp_num);
                    }

                    data = cc[grp_num];
                    for (var i = 0; i < data.nodes.value.length; i++) {
                        var targetNodeId = data.nodes.value[i];
                        var device = {'id': targetNodeId, 'name': '(#' + targetNodeId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])};
                        assocDevices.push({'group': grp_num, 'device': device});
                    }

                }
            }
        }

        if (0x8e in node.instances[0].commandClasses) {
            var cc = node.instances[0].commandClasses[0x8e].data;
            if (cc.groups.value >= 1) {
                for (var grp_num = 1; grp_num <= parseInt(cc.groups.value, 10); grp_num++) {
                    var groupDev = [];
                    if (assocGroups.indexOf(grp_num) == -1) {
                        assocGroups.push(grp_num);
                    }
                    data = cc[grp_num];

                    for (var i = 0; i < data.nodesInstances.value.length; i += 2) {
                        var targetNodeId = data.nodesInstances.value[i];
                        var targetInstanceId = data.nodesInstances.value[i + 1];
                        var instanceId = (targetInstanceId > 0 ? '.' + targetInstanceId : '')
                        var device = {'id': targetNodeId, 'name': '(#' + targetNodeId + instanceId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])};
                        assocDevices.push({'group': grp_num, 'device': device});
                    }
                }
            }
        }

        angular.forEach(assocGroups, function(v, k) {

            var dev = [];
            var name;

            if (zdd) {
                angular.forEach(zdd, function(zddval, zddkey) {
                    if (angular.isArray(zddval)) {
                        angular.forEach(zddval, function(val, key) {
                            if (val._number == v)
                                name = getGroupLabel(val, v, node.instances);
                        });
                    } else {
                        if (zddval._number == v)
                            name = getGroupLabel(zddval, v, node.instances);

                    }
                });
            } else {
                name = getGroupLabel([], v - 1, node.instances);
            }

            angular.forEach(assocDevices, function(d, key, nodeId) {
                //console.log(d)
                if (d['group'] == v) {
                    if ($scope.showLifeline) {
                        dev.push(d.device.name);
                    } else {
                        if (controllerNodeId != d.device.id) {
                            dev.push(d.device.name);
                        }
                    }
                }

            });

            if (dev.length > 0) {
                assoc.push({'name': name, 'devices': dev});
            }
        });

        return assoc;
    }


});