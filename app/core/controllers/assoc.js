/**
 * Device configuration Association controller - new version
 * @author Martin Vach
 */
// Device configuration Association controller - new version
appController.controller('ConfigAssocController', function($scope, $filter, $routeParams, $location, $cookies, $timeout, $http, dataService, deviceService, myCache, cfg) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'association';
    $scope.activeUrl = 'configuration/assoc/';
    $cookies.tab_config = $scope.activeTab;

    // Assoc vars
    $scope.node = [];
    $scope.assocGroups = [];
    $scope.assocGroupsDevices = [];
    $scope.cfgXml = [];

    $scope.reset = function() {
        $scope.assocGroups = angular.copy([]);
    };

    //---------------------///
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

    $scope.zdd = {};



    // Redirect to detail page
    $scope.changeDevice = function(deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    // Load data
    $scope.load = function(nodeId) {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.assocGroups = angular.copy([]);
            $scope.ZWaveAPIData = ZWaveAPIData;
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            var node = ZWaveAPIData.devices[nodeId];

            if (!node) {
                return;
            }
            if (nodeId == 255 || node.data.isVirtual.value) {
                return;
            }
            $scope.node = node;
            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            dataService.getCfgXml(function(cfgXml) {
                setData(node, ZWaveAPIData, nodeId, cfgXml);
            });


        });
    };
    $scope.load($routeParams.nodeId);

    // Update data from device
    $scope.updateFromDevice = function(elId) {
        //$scope.applyQueue = [];
        //$scope.updates = [];
        //var updates = [];
        var nodeId = $scope.deviceId;
        var node = $scope.node;

        angular.forEach(node.instances, function(instance, index) {
            if (!("commandClasses" in instance)) {
                return;
            }
            if (0x85 in instance.commandClasses) {
                for (var group = 0; group < instance.commandClasses[0x85].data.groups.value; group++) {
                    dataService.runCmd('devices[' + nodeId + '].instances[' + index + '].commandClasses[0x85].Get(' + (group + 1) + ')', false, $scope._t('error_handling_data'), true);
                }
            }
            if (0x8e in instance.commandClasses) {
                for (var group = 0; group < instance.commandClasses[0x8e].data.groups.value; group++) {
                    dataService.runCmd('devices[' + nodeId + '].instances[' + index + '].commandClasses[0x8e].Get(' + (group + 1) + ')', false, $scope._t('error_handling_data'), true);

                }
            }
            $timeout(function() {
                $(elId + ' .fa-spin').fadeOut(1000);
                $scope.load(nodeId);
            }, 7000);
            return;


        });
    };

    //Delete assoc device from group
    $scope.deleteAssoc = function(d, groupId, nodeId, elId) {
        console.log(d)
        var cmd = 'devices[' + d.node.id + '].instances[' + d.node.instance + '].commandClasses[' + d.node.cc + '].Remove(' + groupId + ',' + nodeId + ')';
        console.log(cmd)

        var data = {
            'id': d.node.id,
            'instance': d.node.instance,
            'commandclass': d.node.cc,
            'command': 'Set',
            'parameter': '[' + groupId + ',' + nodeId + ']'

        };
        //dataService.runCmd(cmd);
        dataService.getCfgXml(function(cfgXml) {
            console.log(cfgXml)
            var xmlFile = deviceService.deleteCfgXmlAssoc(data, cfgXml);
            dataService.putCfgXml(xmlFile);
        });

        $('#' + elId).fadeOut(3000);
        //$scope.load(d.node.id);
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(node, ZWaveAPIData, nodeId, cfgXml) {
        var zddXmlFile = $filter('hasNode')(node, 'data.ZDDXMLFile.value');
        console.log('zddXmlFile: ' + zddXmlFile);
        // not available
        if (!zddXmlFile || zddXmlFile === 'undefined') {
            //$scope.assocGroups = getAssocDevices(node, ZWaveAPIData, null, controllerNodeId);
            $scope.assocGroups = getAssocGroups(node, null, nodeId, ZWaveAPIData, cfgXml);
            console.log('assocGroups: ', $scope.assocGroups);
            return;
        }

        dataService.getZddXml(zddXmlFile, function(zddXmlData) {
            var zdd = $filter('hasNode')(zddXmlData, 'ZWaveDevice.assocGroups');
            //$scope.assocGroups = getAssocDevices(node, ZWaveAPIData, zdd, controllerNodeId);
            $scope.assocGroups = getAssocGroups(node, zdd, nodeId, ZWaveAPIData, cfgXml);
            console.log('assocGroups: ', $scope.assocGroups);

        });

    }

    /**
     * Get assoc groups
     */
    function getAssocGroups(node, zdd, nodeId, ZWaveAPIData, cfgXml) {

        var assocGroups = [];
        var groupZdd = [];


        if (zdd) {
            angular.forEach(zdd, function(zddval, zddkey) {
                if (angular.isArray(zddval)) {
                    angular.forEach(zddval, function(val, key) {
                        groupZdd[val._number] = val;
                    });
                } else {
                    groupZdd[zddval._number] = zddval;
                }
            });
        }
        angular.forEach(node.instances, function(instance, index) {
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
//                    var key = nodeId + "." + index + "." + group;
//                    if ($.inArray(key, $scope.keys) == -1){
//                        $scope.keys.push(key);
//                    }

                    var data;
                    var assocDevices = [];
                    var cfgArray;
                    var groupCfg = [];
                    var groupDevices = []
                    var savedDevices = [];
                    var nodeIds = [];
                    var instanceIds = [];
                    var persistent = [];
                    var tooltips = [];
                    var type = null;
                    var updateTime;
                    var invalidateTime;
                    var groupId;
                    var label;
                    var max;
                    var obj = {};


                    groupId = (group + 1);
                    label = getGroupLabel(groupZdd[groupId], group, instance);
                    max = $filter('hasNode')(groupZdd[groupId], '_maxNodes');
                    cfgArray = deviceService.getCfgXmlAssoc(cfgXml, nodeId, '0', '85', 'Set', groupId);
                    $scope.assocGroupsDevices[groupId] = {};
                    //console.log(cfgArray)
                    if ((0x85 in instance.commandClasses) && (group < instance.commandClasses[0x85].data.groups.value)) {

                        data = instance.commandClasses[0x85].data[group + 1];
                        savedDevices = data.nodes.value;
                        groupDevices = data.nodes.value;
                        //console.log(data.nodes.value)
                        updateTime = data.updateTime;
                        invalidateTime = data.invalidateTime;
                        invalidateTime = data.invalidateTime;
                        if (cfgArray.length > 0 && cfgArray[groupId].length > 0) {
                            groupCfg = cfgArray[groupId];
                            //groupDevices.concat(groupCfg);
                            $.merge(groupDevices, groupCfg)
                        }

                        for (var i = 0; i < groupDevices.length; i++) {
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
                            assocDevices.push({
                                id: targetNodeId,
                                name: $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId]),
                                instance: '0',
                                cc: '0x85',
                                node: {
                                    id: nodeId,
                                    instance: index,
                                    cc: '0x85'
                                },
                                isSaved: targetNodeId in savedDevices
                            });
                            $scope.assocGroupsDevices[groupId][targetNodeId] = {
                                id: targetNodeId,
                                name: $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId]),
                                instance: '0',
                                cc: 85,
                                node: {
                                    id: nodeId,
                                    instance: index,
                                    cc: 85
                                },
                                isSaved: targetNodeId in savedDevices
                            };

                            console.log('Device is saved: ' + targetNodeId, targetNodeId in savedDevices)
                        }
                    }
//                    if ((0x8e in instance.commandClasses) && (group < instance.commandClasses[0x8e].data.groups.value)) {
//                        data = instance.commandClasses[0x8e].data[group + 1];
//                        updateTime = data.updateTime;
//                        invalidateTime = data.invalidateTime;
//                        for (var i = 0; i < data.nodesInstances.value.length; i += 2) {
//                            var targetNodeId = data.nodesInstances.value[i];
//
//                            nodeIds.push(targetNodeId);
//                            var targetInstanceId = data.nodesInstances.value[i + 1];
//                            instanceIds.push(targetInstanceId);
//                            if (targetNodeId in $scope.ZWaveAPIData.devices) {
//                                persistent.push("inZWave");
//                                tooltips.push($filter('deviceName')(targetNodeId, $scope.ZWaveAPIData.devices[targetNodeId]));
//                            } else {
//                                persistent.push("notInZWave");
//                                tooltips.push($scope._t('device_disappeared'));
//                            }
//                            assocDevices.push({
//                                id: targetNodeId,
//                                name: $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId]),
//                                instance: targetInstanceId,
//                                isSaved: false
//                            });
//
//                        }
//                    }

                    obj = {
                        label: label,
                        devices: assocDevices,
                        tooltips: tooltips,
                        nodeId: nodeId,
                        node: node,
                        instance: index,
                        groupId: groupId,
                        nodeIds: nodeIds,
                        instanceIds: instanceIds,
                        persistent: persistent,
                        max: max || data.max.value,
                        updateTime: updateTime,
                        invalidateTime: invalidateTime,
                        remaining: (data.max.value - nodeIds.length)
                    };
                    assocGroups.push(obj);
                }
            }
        });
        return assocGroups;
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
            if (angular.isArray(langs)) {
                for (var i = 0, len = langs.length; i < len; i++) {
                    if (("__text" in langs[i]) && (langs[i]["_xml:lang"] == $scope.lang)) {
                        label = langs[i].__text;
                        continue;
                        //return label;

                        //continue;
                    } else {
                        if (("__text" in langs[i]) && (langs[i]["_xml:lang"] == 'en')) {
                            label = langs[i].__text;
                            continue;
                            //return label;
                        }
                    }
                }
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
    }
    ;

});