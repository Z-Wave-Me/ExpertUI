/**
 * @overview This controller renders and handles active associations.
 * @author Martin Vach
 */

/**
 * Associations root controller
 * @class AssociationsController
 *
 */
appController.controller('AssociationsController', function($scope, $filter, $timeout,$interval,$http,dataService, cfg,_,myCache) {
    $scope.devices = {
        all: [],
        show: false,
        interval: null,
        showLifeline: false
    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.devices.interval);
    });

    /**
     * Reset devices
     */
    /*$scope.reset = function() {
        $scope.devices.all = angular.copy([]);
    };*/

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            if(_.isEmpty($scope.devices.all)){
                $scope.alert = {message: $scope._t('error_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            $scope.devices.show = true;
            //$scope.refreshZwaveData(ZWaveAPIData);
        }, function(error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshZwaveData = function(ZWaveAPIData) {
        var refresh = function() {
            dataService.loadJoinedZwaveData(ZWaveAPIData).then(function(response) {
                setData(response.data.joined);
            }, function(error) {});
        };
        $scope.devices.interval = $interval(refresh, $scope.cfg.interval);
    };

    // Store data on remote server
    $scope.lifeline = function(status) {
        //$scope.reset();
        $scope.devices.showLifeline = status;
        $scope.loadZwaveData();
    };
    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {obj} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        var controllerSUCNodeId = ZWaveAPIData.controller.data.SUCNodeId.value;
        // Loop throught devices
        var cnt = 1;
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }
            var zddXmlFile = $filter('hasNode')(node, 'data.ZDDXMLFile.value');
            var zdd = null;
            if (zddXmlFile) {
                dataService.xmlToJson(cfg.server_url + cfg.zddx_url + zddXmlFile).then(function (response) {
                    zdd = $filter('hasNode')(response, 'ZWaveDevice.assocGroups');
                    setAssocDevices(nodeId,node, ZWaveAPIData, zdd, controllerSUCNodeId,cnt);
                });
            }else{
                setAssocDevices(nodeId,node, ZWaveAPIData, zdd, controllerSUCNodeId,cnt);
            }
            cnt++;
        });
    }

    /**
     * Set assoc devices
     * @param nodeId
     * @param node
     * @param ZWaveAPIData
     * @param zdd
     * @param controllerSUCNodeId
     * @param cnt
     */
    function setAssocDevices(nodeId,node, ZWaveAPIData, zdd, controllerSUCNodeId,cnt){
        var assocDevices = getAssocDevices(node, ZWaveAPIData, zdd, controllerSUCNodeId);
        var obj = {
            'id': nodeId,
            'rowId': 'row_' + nodeId + '_' + cnt,
            'name': $filter('deviceName')(nodeId, node),
            'assocGroup': assocDevices
        };
        var findIndex = _.findIndex($scope.devices.all, {rowId: obj.rowId});
        if(findIndex > -1){
            angular.extend($scope.devices.all[findIndex],obj);
        }else{
            $scope.devices.all.push(obj);
        }
    }

    /**
     * Get group name
     * @param assocGroups
     * @param index
     * @param instance
     * @returns {string}
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
     * @param node
     * @param ZWaveAPIData
     * @param zdd
     * @param controllerSUCNodeId
     * @returns {Array}
     */
    function getAssocDevices(node, ZWaveAPIData, zdd, controllerSUCNodeId) {
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
                    if ($scope.devices.showLifeline) {
                        dev.push(d.device.name);
                    } else {
                        if (controllerSUCNodeId != d.device.id) {
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