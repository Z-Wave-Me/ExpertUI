/**
 * Device configuration Association controller - new version
 * @author Martin Vach
 */
// Device configuration Association controller - new version
appController.controller('ConfigAssocController', function($scope, $filter, $routeParams, $location, $cookies, $timeout, $http, $element, dataService, deviceService, myCache, cfg) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'association';
    $scope.activeUrl = 'configuration/assoc/';
    $cookies.tab_config = $scope.activeTab;

    $scope.alert = {message: false, status: 'is-hidden', icon: false};
    // Assoc vars
    $scope.node = [];
    $scope.nodeCfg = {
        id: 0,
        name: null,
        hasMca: false
    };
    $scope.assocGroups = [];
    $scope.assocGroupsDevices = [];
    $scope.assocAddDevices = [];
    $scope.assocAddInstances = false;
    $scope.cfgXml = [];
    $scope.input = {
        nodeId: 0,
        goupCfg: false,
        //goupId: 0,
        toNode: false,
        toInstance: false
    };
    // Redirect to detail page
    $scope.changeDevice = function(deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    // Refresh data
    $scope.refresh = function() {
        dataService.joinedZwaveData(function(data) {
        });
    };
    $scope.refresh();

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    // Load data
    $scope.load = function(nodeId, noCache) {
        dataService.getZwaveData(function(ZWaveAPIData) {
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
            $scope.nodeCfg = {
                id: nodeId,
                instance: 0,
                hasMca: 142 in node.instances[0].commandClasses,
                name: $filter('deviceName')(nodeId, node),
                hasBattery: 0x80 in node.instances[0].commandClasses
            };
            $scope.input.nodeId = nodeId;

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            dataService.getCfgXml(function(cfgXml) {
                setData(node, ZWaveAPIData, nodeId, cfgXml);
            });


        }, noCache);
    };
    $scope.load($routeParams.nodeId);

    // Update data from device
    $scope.updateFromDevice = function(elId) {
        var nodeId = $scope.deviceId;
        var node = $scope.node;

        angular.forEach(node.instances, function(instance, index) {
            if (!("commandClasses" in instance)) {
                return;
            }
            if (0x85 in instance.commandClasses) {
                for (var group = 0; group < instance.commandClasses[0x85].data.groups.value; group++) {
                    if (instance.commandClasses[0x85].data[group + 1].max.value > 0) {
                        dataService.runCmd('devices[' + nodeId + '].instances[' + index + '].commandClasses[0x85].Get(' + (group + 1) + ')', false, $scope._t('error_handling_data'), true);    
                    }
                    
                }
            }
            if (0x8e in instance.commandClasses) {
                for (var group = 0; group < instance.commandClasses[0x8e].data.groups.value; group++) {
                    if (instance.commandClasses[0x8e].data[group + 1].max.value) {
                        dataService.runCmd('devices[' + nodeId + '].instances[' + index + '].commandClasses[0x8e].Get(' + (group + 1) + ')', false, $scope._t('error_handling_data'), true);
                    }
                }
            }
            $timeout(function() {
                $(elId + ' .fa-spin').fadeOut(1000);
                $scope.load(nodeId);
            }, 5000);
            return;


        });
    };

    //Show list of the devices to assocciate
    $scope.modalAssocAdd = function(group) {
        $scope.input.groupCfg = group;
        $scope.input.groupId = group.groupId;
        // Prepare devices and nodes

        angular.forEach($scope.ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || node.data.isVirtual.value || nodeId == $scope.deviceId) {
                return;
            }
            var obj = {};
            obj['id'] = nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['hasMca'] = 142 in node.instances[0].commandClasses;
            obj['instances'] = getNodeInstances(node, nodeId);
            if ($scope.nodeCfg.hasMca) {
                if (obj['hasMca']) {
                    $scope.assocAddDevices.push(obj);
                } else {
                    if (group.nodeIds.indexOf(parseInt(nodeId)) === -1) {
                        $scope.assocAddDevices.push(obj);
                    }
                }
            } else {
                if (group.nodeIds.indexOf(parseInt(nodeId)) === -1) {
                    $scope.assocAddDevices.push(obj);
                }
            }
        });

    };
    //Hide  assoc  modal window
    $scope.modalAssocHide = function() {
        $scope.input.toNode = false;
        $scope.input.toInstance = false;
        $scope.input.groupId = 0;
        $scope.assocAddInstances = false;
        $scope.assocAddDevices = angular.copy([]);
        $timeout(function() {
            $scope.load($scope.nodeCfg.id);
        }, 3000);

    };
    //Show node instances (if any)
    $scope.showAssocNodeInstance = function(nodeId,hasMca) {
        if(!hasMca){
            return;
        }
        // Prepare devices and nodes
        angular.forEach($scope.assocAddDevices, function(v, k) {
            if (v.id == nodeId) {
                $scope.assocAddInstances = Object.keys(v.instances).length > 0 ? v.instances : false;

                return;
            }


        });


    };
    //Store assoc device from group
    $scope.storeAssoc = function(input) {
        var instances = '0';
        var commandClasses = '85';
        var commandClassesH = 0x85;
        var toInstance = '';
        if (input.toInstance) {
            commandClasses = '142';
            commandClassesH = 0x8e;
            toInstance = ',' + input.toInstance;
        }
        var cmd = 'devices[' + input.nodeId + '].instances[' + instances + '].commandClasses[' + commandClassesH + '].Set(' + input.groupId + ',' + input.toNode + toInstance + ')';
        var data = {
            'id': input.nodeId,
            'instance': instances,
            'commandclass': commandClasses,
            'command': 'Set',
            'parameter': '[' + input.groupId + ',' + input.toNode + toInstance + ']'

        };
        dataService.getCfgXml(function(cfgXml) {
            var xmlFile = deviceService.buildCfgXmlAssoc(data, cfgXml);
            dataService.putCfgXml(xmlFile);
            dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
            $timeout(function() {
                $scope.load(input.nodeId);
            }, 3000);
        });
    };

    //Delete assoc device from group
    $scope.deleteAssoc = function(d) {
        var params = d.groupId + ',' + d.id + (d.instance ? ',' + d.instance : '');
        var cmd = 'devices[' + d.node.id + '].instances[' + d.node.instance + '].commandClasses[0x' + d.node.cc + '].Remove(' + params + ')';

        var data = {
            'id': d.node.id,
            'instance': d.node.instance,
            'commandclass': d.node.cc,
            'command': 'Set',
            'parameter': '[' + params + ']'

        };
        //dataService.runCmd(cmd);
        dataService.getCfgXml(function(cfgXml) {
            var xmlFile = deviceService.deleteCfgXmlAssoc(data, cfgXml);
            dataService.putCfgXml(xmlFile);
            dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
            $('#' + d.elId).addClass('true-false');
            $timeout(function() {
                $scope.load(d.node.id);
            }, 5000);
        });

        //$scope.load(d.node.id);
    };

    /// --- Private functions --- ///
    /**
     * Get node instances
     */
    function getNodeInstances(node, nodeId) {
        var instances = [];
        if (Object.keys(node.instances).length < 2) {
            return instances;
        }
        for (var instanceId in node.instances) {
            var obj = {};
            obj['key'] = instanceId,
                    obj['val'] = instanceId
            instances.push(obj);
        }
        return instances;

    }

    /**
     * Set zwave data
     */
    function setData(node, ZWaveAPIData, nodeId, cfgXml) {
        var zddXmlFile = $filter('hasNode')(node, 'data.ZDDXMLFile.value');
        $scope.assocGroups = angular.copy([]);
        //  zddXmlFile not available
        if (!zddXmlFile || zddXmlFile === 'undefined') {
            $scope.assocGroups = getAssocGroups(node, null, nodeId, ZWaveAPIData, cfgXml);
            if ($scope.assocGroups.length < 1) {
                $scope.alert = {message: $scope._t('no_association_groups_found'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
            }
            return;
        }

        dataService.getZddXml(zddXmlFile, function(zddXmlData) {
            var zdd = $filter('hasNode')(zddXmlData, 'ZWaveDevice.assocGroups');
            //$scope.assocGroups = getAssocDevices(node, ZWaveAPIData, zdd, controllerNodeId);
            $scope.assocGroups = getAssocGroups(node, zdd, nodeId, ZWaveAPIData, cfgXml);
            if ($scope.assocGroups.length < 1) {
                $scope.alert = {message: $scope._t('no_association_groups_found'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
            }

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
                    var data;
                    var assocDevices = [];
                    var cfgArray;
                    var groupCfg = [];
                    var groupDevices = [];
                    var savedInDevice = [];
                    var nodeIds = [];
                    var instanceIds = [];
                    var persistent = [];
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
                    if ((0x85 in instance.commandClasses) && (group < instance.commandClasses[0x85].data.groups.value)) {
                        var savedNodesInDevice = [];
                        data = instance.commandClasses[0x85].data[group + 1];
                        // Find duplicates in nodes
                        for (var i = 0; i < data.nodes.value.length; i++) {
                            if (savedNodesInDevice.indexOf(data.nodes.value[i]) === -1) {
                                savedNodesInDevice.push(data.nodes.value[i]);
                            }
                            /*if ((data.nodes.value.lastIndexOf(data.nodes.value[i]) != i) && (savedNodesInDevice.indexOf(data.nodes.value[i]) == -1)) {
                             savedNodesInDevice.push(data.nodes.value[i]);
                             }*/
                        }
                        groupDevices = data.nodes.value;
                        updateTime = data.nodes.updateTime;
                        invalidateTime = data.nodes.invalidateTime;
                        if (cfgArray.length > 0 && cfgArray[groupId].length > 0) {
                            groupCfg = cfgArray[groupId];
                            $.merge(groupDevices, groupCfg);
                        }


                        for (var i = 0; i < $filter('unique')(groupDevices).length; i++) {

                            var targetNodeId = data.nodes.value[i];
                            nodeIds.push(targetNodeId);
                            var targetInstanceId = 0;
                            instanceIds.push(targetInstanceId);

                            var toCfgXml = {
                                'id': String($scope.nodeCfg.id),
                                'instance': String($scope.nodeCfg.instance),
                                'commandclass': '85',
                                'command': 'Set',
                                'parameter': '[' + groupId + ',' + targetNodeId + ']'

                            };

                            var inConfig = deviceService.isInCfgXml(toCfgXml, cfgXml);
                            var objAssoc = {};
                            objAssoc['id'] = targetNodeId;
                            objAssoc['groupId'] = groupId;
                            objAssoc['elId'] = groupId + '_' + targetNodeId + '_' + targetInstanceId + '_' + i;
                            objAssoc['name'] = $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId]);
                            objAssoc['instance'] = targetInstanceId;
                            objAssoc['cc'] = 85;
                            objAssoc['node'] = {
                                id: nodeId,
                                instance: index,
                                cc: 85
                            };
                            // objAssoc['inDevice'] =  savedNodesInDevice.indexOf(targetNodeId) > -1 ? true : false;
                            // objAssoc['inConfig'] = inConfig;
                            objAssoc['status'] = (savedNodesInDevice.indexOf(targetNodeId) > -1 ? true : false) + '-' + inConfig;
                            assocDevices.push(objAssoc);
                            $scope.assocGroupsDevices[groupId][targetNodeId] = objAssoc;
                        }
                    }
                    if ((0x8e in instance.commandClasses) && (group < instance.commandClasses[0x8e].data.groups.value)) {
                        var savedNodesInstancesInDevice = [];
                        data = instance.commandClasses[0x8e].data[group + 1];
                        for (var i = 0; i < Object.keys(data.nodesInstances.value).length; i += 2) {
                            savedNodesInstancesInDevice.push(data.nodesInstances.value[i] + '_' + data.nodesInstances.value[i + 1]);
                        }
                        updateTime = data.nodesInstances.updateTime;
                        invalidateTime = data.nodesInstances.invalidateTime;
                        for (var i = 0; i < Object.keys(data.nodesInstances.value).length; i += 2) {
                            var targetNodeId = data.nodesInstances.value[i];
                            nodeIds.push(targetNodeId);
                            var targetInstanceId = data.nodesInstances.value[i + 1];
                            instanceIds.push(targetInstanceId);
                            var idNodeInstance = data.nodesInstances.value[i] + '_' + data.nodesInstances.value[i + 1];
                            var toCfgXml = {
                                'id': String($scope.nodeCfg.id),
                                'instance': String($scope.nodeCfg.instance),
                                'commandclass': '142',
                                'command': 'Set',
                                'parameter': '[' + groupId + ',' + targetNodeId + ',' + targetInstanceId + ']'

                            };

                            var inConfig = deviceService.isInCfgXml(toCfgXml, cfgXml);
                            var objAssoc = {};
                            objAssoc['id'] = targetNodeId;
                            objAssoc['groupId'] = groupId;
                            objAssoc['elId'] = groupId + '_' + targetNodeId + '_' + targetInstanceId + '_' + i;
                            objAssoc['name'] = $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId]);
                            objAssoc['instance'] = targetInstanceId;
                            objAssoc['cc'] = '8e';
                            objAssoc['node'] = {
                                id: nodeId,
                                instance: index,
                                cc: '8e'
                            };
                            //objAssoc['inDevice'] = savedNodesInstancesInDevice.indexOf(idNodeInstance) > -1 ? true : false;
                            //objAssoc['inConfig'] = inConfig;
                            objAssoc['status'] = (savedNodesInstancesInDevice.indexOf(idNodeInstance) > -1 ? true : false) + '-' + inConfig;
                            assocDevices.push(objAssoc);
                            $scope.assocGroupsDevices[groupId][String(targetNodeId) + String(i)] = objAssoc;
                        }
                    }

                    obj = {
                        label: label,
                        devices: assocDevices,
                        nodeId: nodeId,
                        //node: node,
                        instance: index,
                        groupId: groupId,
                        nodeIds: $filter('unique')(nodeIds),
                        instanceIds: instanceIds,
                        persistent: persistent,
                        max: max || data.max.value,
                        updateTime: updateTime,
                        invalidateTime: invalidateTime,
                        timeClass: updateTime > invalidateTime ? 'undef' : 'red',
                        remaining: (data.max.value - $filter('unique')(nodeIds).length)
                    };
                    
                    // Don't return groups that have 0 max nodes. Happens with Aspire RF devices
                    // like the RFWC5
                    if (max || data.max.value) {
                        assocGroups.push(obj);
                    }
                    
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