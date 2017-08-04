/**
 * @overview This controller renders and handles device association stuff.
 * @author Martin Vach
 */

/**
 * Device configuration Association controller
 * @class ConfigAssocController
 *
 */
appController.controller('ConfigAssocController', function($scope, $filter, $routeParams, $location, $cookies, $timeout, $window,$interval, dataService, deviceService, myCache, cfg, _) {
    $scope.devices = [];
    $scope.deviceName = '';
    $scope.deviceId = 0;
    //$scope.activeTab = 'association';
    $scope.activeUrl = 'configuration/association/';
    $cookies.tab_config = 'association';

    $scope.alert = {message: false, status: 'is-hidden', icon: false};
    // Assoc vars
    $scope.node = [];
    $scope.nodeCfg = {
        id: 0,
        instance: 0,
        hasMca: false,
        name: null,
        hasBattery: false,
        isAwake: false,
        notAwake: []

    };
    $scope.assocGroups = [];
    $scope.assocGroupsDevices = [];
    $scope.assocAddDevices = [];
    $scope.assocAddInstances = false;
    $scope.cfgXml = {};
    $scope.input = {
        nodeId: 0,
        goupCfg: false,
        //goupId: 0,
        toNode: false,
        toInstance: false
    };
    $scope.assocInterval = false;


    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.assocInterval);
    });

    // Redirect to device
    $scope.redirectToDevice = function (deviceId) {
        if (deviceId) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    // Load data
    $scope.loadZwaveData = function(nodeId, noCache) {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            //console.log(ZWaveAPIData.devices[7].instances[0].commandClasses[133].data[2].nodes.value)
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
            $scope.node = node;
            angular.extend($scope.nodeCfg, {
                id: nodeId,
                hasMca: 142 in node.instances[0].commandClasses,
                name: $filter('deviceName')(nodeId, node),
                hasBattery: 0x80 in node.instances[0].commandClasses,
            });
            $scope.input.nodeId = nodeId;

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.deviceName = $filter('deviceName')(nodeId, node);
            dataService.getCfgXml().then(function (cfgXml) {
                $scope.cfgXml = cfgXml;
                //console.log(node)
                setData(node, ZWaveAPIData, nodeId, cfgXml);
            }, function(error) {
                setData(node, ZWaveAPIData, nodeId, {});
            });


        }, noCache);
    };
    $scope.loadZwaveData($routeParams.nodeId);

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                var updateData = false;
                var searchStr = 'devices.' + $routeParams.nodeId + '.'
                angular.forEach(response.data.update, function(v, k) {
                    if (k.indexOf(searchStr) !== -1) {
                        updateData = true;
                        return;
                    }
                });
                if (updateData) {
                    $scope.loadZwaveData($routeParams.nodeId, false);
                }
            });
        };
        $scope.assocInterval = $interval(refresh, cfg.interval);
    };

    $scope.refreshZwaveData();

    // Update data from device
    $scope.updateFromDevice = function(spin) {

        var nodeId = $scope.deviceId;
        var node = $scope.node;
        $scope.toggleRowSpinner(spin);
        angular.forEach(node.instances, function(instance, index) {
            if (!("commandClasses" in instance)) {
                return;
            }
            if (0x85 in instance.commandClasses) {
                for (var group = 0; group < instance.commandClasses[0x85].data.groups.value; group++) {
                   dataService.runZwaveCmd(cfg.store_url + 'devices[' + nodeId + '].instances[' + index + '].commandClasses[0x85].Get(' + (group + 1) + ')', false, $scope._t('error_handling_data'), true);
                }
            }
            if (0x8e in instance.commandClasses) {
                for (var group = 0; group < instance.commandClasses[0x8e].data.groups.value; group++) {
                    dataService.runZwaveCmd(cfg.store_url + 'devices[' + nodeId + '].instances[' + index + '].commandClasses[0x8e].Get(' + (group + 1) + ')', false, $scope._t('error_handling_data'), true);

                }
            }
            $timeout(function() {
                $scope.toggleRowSpinner();
            }, 3000);
            return;


        });
    };

    //Show modal window with a list of the devices to assocciate
    $scope.handleAssocModal = function(modal,$event,group) {
        $scope.input.groupCfg = group;
        $scope.input.groupId = group.groupId;
        $scope.assocAddDevices = [];
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
        $scope.handleModal(modal,$event);

    };
    //Close  assoc  modal window
    $scope.closeAssocModal = function() {
        $scope.handleModal();

        $scope.input.toNode = false;
        $scope.input.toInstance = false;
        $scope.input.groupId = 0;
        $scope.assocAddInstances = false;
        $scope.assocAddDevices = angular.copy([]);
        $timeout(function() {
            $scope.toggleRowSpinner();
            $scope.loadZwaveData($scope.nodeCfg.id);
        }, 3000);

    };
    //Show node instances (if any)
    $scope.showAssocNodeInstance = function(nodeId, hasMca) {
        if (!hasMca) {
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
        $scope.toggleRowSpinner('group_' + input.groupCfg.groupId);
        var addDevice = {};
        var instances = '0';
        var commandClasses = '85';
        var commandClassesH = 0x85;
        var toInstance = '';
        if (input.toInstance && input.toInstance !== 'plain') {
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
        addDevice[input.toNode] = {
            isNew: true,
            status: 'false-true',
            elId: _.now(),
            id: input.toNode,
            instance: parseInt(input.toInstance, 10),
            name: _.findWhere($scope.assocAddDevices, {id: input.toNode}).name
        };
         angular.extend($scope.assocGroupsDevices[input.groupId], addDevice);


        dataService.runZwaveCmd(cfg.store_url + cmd).then(function(response) {
            $scope.closeAssocModal();
            if(!_.isEmpty($scope.cfgXml)){
                 var xmlFile = deviceService.buildCfgXmlAssoc(data,$scope.cfgXml);
                dataService.putCfgXml(xmlFile);
            }

        }, function(error) {
            $window.alert($scope._t('error_handling_data') + '\n' + cmd);
            $scope.loadZwaveData($routeParams.nodeId);
        });
        $scope.input.toNode = false;
        $scope.input.toInstance = false;
        $scope.input.groupId = 0;
        $scope.assocAddInstances = false;
        return;
        /**
         * todo: deprecated
         */
       /* dataService.getCfgXml().then(function (cfgXml) {
            dataService.runZwaveCmd(cfg.store_url + cmd).then(function(response) {
                $scope.closeAssocModal();
                var xmlFile = deviceService.buildCfgXmlAssoc(data, cfgXml);
                dataService.putCfgXml(xmlFile);
            }, function(error) {
                $window.alert($scope._t('error_handling_data') + '\n' + cmd);
                $scope.loadZwaveData($routeParams.nodeId);
            });
            $scope.input.toNode = false;
            $scope.input.toInstance = false;
            $scope.input.groupId = 0;
            $scope.assocAddInstances = false;
            return;
        });*/
    };

    //Delete assoc device from group
    $scope.deleteAssoc = function(d) {
        var params = d.groupId + ',' + d.id;
        if (d.node.cc === '8e') {
            params = d.groupId + ',' + d.id + (d.instance > -1 ? ',' + d.instance : '');
        }
        var cmd = 'devices[' + d.node.id + '].instances[' + d.node.instance + '].commandClasses[0x' + d.node.cc + '].Remove(' + params + ')';
        var data = {
            'id': d.node.id,
            'instance': d.node.instance,
            'commandclass': (d.node.cc === '8e' ? '142' : String(d.node.cc)),
            'command': 'Set',
            'parameter': '[' + params + ']'

        };

            dataService.runZwaveCmd(cfg.store_url + cmd).then(function(response) {
                if(!_.isEmpty($scope.cfgXml)){
                    var xmlFile = deviceService.deleteCfgXmlAssoc(data, $scope.cfgXml);
                    dataService.putCfgXml(xmlFile);
                }

                $('#' + d.elId).addClass('true-false');

            }, function(error) {
                $window.alert($scope._t('error_handling_data') + '\n' + cmd);
            });
        /**
         * todo: deprecated
         */
       /* dataService.getCfgXml().then(function (cfgXml) {
            dataService.runZwaveCmd(cfg.store_url + cmd).then(function(response) {
                var xmlFile = deviceService.deleteCfgXmlAssoc(data, cfgXml);
                dataService.putCfgXml(xmlFile);
                $('#' + d.elId).addClass('true-false');

            }, function(error) {
                $window.alert($scope._t('error_handling_data') + '\n' + cmd);
            });
        });*/
    };

    /// --- Private functions --- ///
    /**
     * Get node instances
     */
    function getNodeInstances(node) {
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
        //  zddXmlFile not available
        if (!zddXmlFile || zddXmlFile === 'undefined') {
            $scope.assocGroups = getAssocGroups(node, null, nodeId, ZWaveAPIData, cfgXml);
            if ($scope.assocGroups.length < 1) {
                $scope.alert = {message: $scope._t('no_association_groups_found'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
            }
            return;
        }

        dataService.xmlToJson(cfg.server_url + cfg.zddx_url + zddXmlFile).then(function (zddXmlData) {
            var zdd = $filter('hasNode')(zddXmlData, 'ZWaveDevice.assocGroups');
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
        //console.log(ZWaveAPIData.devices[7].instances[0].commandClasses[133].data[2].nodes.value)
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
        $scope.nodeCfg.notAwake = [];
        //console.log('Has assoc', node.instances)

        angular.forEach(node.instances, function(instance, index) {

            if (!("commandClasses" in instance)) {
                return;
            }

            if (0x85 in instance.commandClasses || 0x8e in instance.commandClasses) {
                var groups = 0;
                if (0x85 in instance.commandClasses) {
                    groups = instance.commandClasses[0x85].data.groups.value;

                }

                if (0x8e in instance.commandClasses) {
                    if (instance.commandClasses[0x8e].data.groups.value > groups) {
                        groups = instance.commandClasses[0x8e].data.groups.value;
                    }

                }
                for (var group = 0; group < groups; group++) {
                    var data;
                    var dataMca;
                    var assocDevices = [];
                    var cfgArray;
                    var cfgArrayMca;
                    var groupCfg = [];
                    var groupDevices = [];
                    var savedInDevice = [];
                    var nodeIds = [];
                    var instanceIds = [];
                    var persistent = [];
                    var updateTime;
                    var invalidateTime;
                    var updateTimeMca;
                    var invalidateTimeMca;
                    var groupId;
                    var label;
                    var max;
                    var timeClass = 'undef';
                    var obj = {};


                    groupId = (group + 1);
                    label = getGroupLabel(groupZdd[groupId], group, instance);
                    max = $filter('hasNode')(groupZdd[groupId], '_maxNodes');

                    $scope.assocGroupsDevices[groupId] = {};
                    /**
                     * Plain assoc
                     */
                    if ((0x85 in instance.commandClasses) && (group < instance.commandClasses[0x85].data.groups.value)) {
                        cfgArray = deviceService.getCfgXmlAssoc(cfgXml, nodeId, '0', '85', 'Set', groupId);
                        var savedNodesInDevice = [];
                        data = instance.commandClasses[0x85].data[groupId];
                        /*if(groupId == 2){
                            console.log('GROUP: ',groupId,'data.nodes.value: ',data.nodes.value)

                        }*/

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
                        if (cfgArray[groupId] && cfgArray[groupId].nodes.length > 0) {
                            groupCfg = cfgArray[groupId].nodes;
                            $.merge(groupDevices, groupCfg);
                        }


                        for (var i = 0; i < $filter('unique')(groupDevices).length; i++) {

                            var targetNodeId = data.nodes.value[i];
                            var targetNode= ZWaveAPIData.devices[targetNodeId];
                            if(!targetNode){
                                return;
                            }
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
                            objAssoc['isNew'] = false;
                            objAssoc['groupId'] = groupId;
                            objAssoc['elId'] = groupId + '_' + targetNodeId + '_' + targetInstanceId + '_' + i;
                            objAssoc['name'] = $filter('deviceName')(targetNodeId, targetNode);
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
                            /*if(inConfig){
                                console.log(data.nodes.value)
                                console.log('GROUP:', groupId,'NODE:',targetNodeId,'STATUS:',objAssoc['status'],'SAVED:',savedNodesInDevice);
                            }*/
                            //
                        }
                    }
                    /**
                     * Multichannel assoc
                     */
                    if ((0x8e in instance.commandClasses) && (group < instance.commandClasses[0x8e].data.groups.value)) {
                        cfgArrayMca = deviceService.getCfgXmlAssoc(cfgXml, nodeId, '0', '142', 'Set', groupId);
                        var savedNodesInstancesInDevice = [];
                        dataMca = instance.commandClasses[0x8e].data[group + 1];
                        for (var i = 0; i < Object.keys(dataMca.nodesInstances.value).length; i += 2) {
                            savedNodesInstancesInDevice.push(dataMca.nodesInstances.value[i] + '_' + dataMca.nodesInstances.value[i + 1]);
                        }
                        updateTimeMca = dataMca.nodesInstances.updateTime;
                        invalidateTimeMca = dataMca.nodesInstances.invalidateTime;
                        if (cfgArrayMca[groupId] && cfgArrayMca[groupId].nodeInstances.length > 0) {
                            angular.forEach(cfgArrayMca[groupId].nodeInstances, function(vMca) {
                                if (savedNodesInstancesInDevice.indexOf(vMca) === -1) {
                                    var slice = vMca.split('_');
                                    dataMca.nodesInstances.value.push(parseInt(slice[0], 10));
                                    dataMca.nodesInstances.value.push(parseInt(slice[1], 10));
                                }
                            });
                        }
                        for (var i = 0; i < Object.keys(dataMca.nodesInstances.value).length; i += 2) {
                            var targetNodeId = dataMca.nodesInstances.value[i];
                            var targetNode= ZWaveAPIData.devices[targetNodeId];
                            if(!targetNode){
                                return;
                            }
                            nodeIds.push(targetNodeId);
                            var targetInstanceId = dataMca.nodesInstances.value[i + 1];
                            instanceIds.push(targetInstanceId);
                            var idNodeInstance = dataMca.nodesInstances.value[i] + '_' + dataMca.nodesInstances.value[i + 1];
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
                            objAssoc['isNew'] = false;
                            objAssoc['groupId'] = groupId;
                            objAssoc['elId'] = groupId + '_' + targetNodeId + '_' + targetInstanceId + '_' + i;
                            objAssoc['name'] = $filter('deviceName')(targetNodeId, targetNode);
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

                    if ((updateTime < invalidateTime) || (updateTimeMca < invalidateTimeMca)) {
                        timeClass = 'red';
                        $scope.nodeCfg.isAwake = true;
                        if ($scope.nodeCfg.notAwake.indexOf(groupId) === -1) {
                            $scope.nodeCfg.notAwake.push(groupId);
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
                        timeClass: timeClass,
                        remaining: (data.max.value - $filter('unique')(nodeIds).length)
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