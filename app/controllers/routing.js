/**
 * @overview This controller renders and handles routing table.
 * @author Martin Vach
 */

/**
 * Routing root controller
 * @class RoutingController
 *
 */
appController.controller('RoutingController', function($scope, $filter, $timeout,$interval,$http,dataService, cfg,_, myCache) {
    $scope.routings = {
        all: [],
        interval: null,
        show: false,
        nodes: {},
        neighbours: {}
    };
    $scope.nodes = {};

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.routings.interval);
    });

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            if(_.isEmpty($scope.routings.all)){
                $scope.alert = {message: $scope._t('error_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            $scope.routings.show = true;
            $scope.refreshZwaveData(ZWaveAPIData);
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
        $scope.routings.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Update route
     * @param {string} url
     */
    $scope.updateRoute = function(url) {
        $scope.toggleRowSpinner(url);
        dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + url);
        });
    };

    /**
     * Update all routes
     * @param {string} id
     * @param {string} urlType
     */
    $scope.updateAllRoutess = function(id,urlType) {
        var lastItem = _.last($scope.routings.all);
        $scope.toggleRowSpinner(id);
        angular.forEach($scope.routings.all, function(v, k) {
            $scope.toggleRowSpinner(v[urlType]);
            dataService.runZwaveCmd(cfg.store_url + v[urlType]).then(function (response) {
                alertify.dismissAll();
            }, function (error) {
                alertify.dismissAll();
                alertify.alertError($scope._t('error_update_data') + '\n' +  v[urlType]);
            });
            if(lastItem.rowId === v.rowId){
                $timeout($scope.toggleRowSpinner, 1000);
            }
        });

    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        //var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        /*var node = $scope.ZWaveAPIData.devices[nodeId];
        if (nodeId == 255 || node.data.isVirtual.value || node.data.basicType.value == 1)
            return;
        var routesCount = $filter('getRoutesCount')($scope.ZWaveAPIData, nodeId);
        var line = [];
        var nnodeName;*/
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || node.data.isVirtual.value || node.data.basicType.value == 1) {
                return;
            }
            $scope.nodes[nodeId] = {"label": $filter('deviceName')(nodeId, node), "node": node};
            var nodeName = $filter('deviceName')(nodeId, node);
            var routesCount = $filter('getRoutesCount')(ZWaveAPIData, nodeId);
            //var abcd = cellState(nodeId, nodeId, routesCount, nodeName, nodeName);
            //console.log(routesCount)
            //console.log('Node id: ',nodeId,node.data.neighbours.value);
            var node = ZWaveAPIData.devices[nodeId];
            var type;
            var isListening = node.data.isListening.value;
            var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
            var hasWakeup = 0x84 in node.instances[0].commandClasses;

            // Device type
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

            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['type'] = type;
            obj['icon'] = $filter('getDeviceTypeIcon')(type);
            obj['invalidateTime'] = node.data.neighbours.invalidateTime;
            obj['updateTime'] = node.data.neighbours.updateTime,
            obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
            obj['urlToStore'] = 'devices[' + nodeId + '].RequestNodeNeighbourUpdate()';

            var findIndex = _.findIndex($scope.routings.all, {rowId: obj.rowId});
            if(findIndex > -1){
                angular.extend($scope.routings.all[findIndex],obj);

            }else{
                $scope.routings.all.push(obj);
            }
            setCellState(nodeId,routesCount);
        });
    }

    function setCellState(nodeId,neighbours) {
        if($scope.routings.neighbours[nodeId]){
            return;
        }
        $scope.routings.neighbours[nodeId] = neighbours;
        console.log($scope.routings);
    }

    function cellState(nodeId, nnodeId, routesCount, nodeName, nnodeName) {
        var node = $scope.nodes[nodeId].node;
        var nnode = $scope.nodes[nnodeId].node;
        var tooltip = nodeId + ': ' + nodeName + ' - ' + nnodeId + ': ' + nnodeName + ' ';
        var info;
        if ($filter('associationExists')(node, nnodeId)) {
            info = '*';
            tooltip += ' (' + $scope._t('rt_associated') + ')';
        } else {
            info = '';
        }
        var clazz = 'rtDiv line' + nodeId + ' ';
        if (nodeId == nnodeId
            || node.data.isVirtual.value
            || nnode.data.isVirtual.value
            || node.data.basicType.value == 1
            || nnode.data.basicType.value == 1) {
            clazz = 'rtDiv rtUnavailable';
        } else if ($.inArray(parseInt(nnodeId, 10), node.data.neighbours.value) != -1)
            clazz += 'rtDirect';
        else if (routesCount[nnodeId]
            && routesCount[nnodeId][1] > 1)
            clazz += 'rtRouted';
        else if (routesCount[nnodeId]
            && routesCount[nnodeId][1] == 1)
            clazz += 'rtBadlyRouted';
        else
            clazz += 'rtNotLinked';
        return {
            info: info,
            clazz: clazz,
            tooltip: tooltip
        };
    };
});
/**
 * RoutingController
 * @author Martin Vach
 */
appController.controller('RoutingTableController', function($scope, $filter, dataService, cfg) {

    $scope.devices = [];
    $scope.nodes = {};
    $scope.data = {};
    $scope.ZWaveAPIData;
    $scope.updating = {};
    $scope.cellState = function(nodeId, nnodeId, routesCount, nodeName, nnodeName) {
        var node = $scope.nodes[nodeId].node;
        var nnode = $scope.nodes[nnodeId].node;
        var tooltip = nodeId + ': ' + nodeName + ' - ' + nnodeId + ': ' + nnodeName + ' ';
        var info;
        if ($filter('associationExists')(node, nnodeId)) {
            info = '*';
            tooltip += ' (' + $scope._t('rt_associated') + ')';
        } else {
            info = '';
        }
        var clazz = 'rtDiv line' + nodeId + ' ';
        if (nodeId == nnodeId
                || node.data.isVirtual.value
                || nnode.data.isVirtual.value
                || node.data.basicType.value == 1
                || nnode.data.basicType.value == 1) {
            clazz = 'rtDiv rtUnavailable';
        } else if ($.inArray(parseInt(nnodeId, 10), node.data.neighbours.value) != -1)
            clazz += 'rtDirect';
        else if (routesCount[nnodeId]
                && routesCount[nnodeId][1] > 1)
            clazz += 'rtRouted';
        else if (routesCount[nnodeId]
                && routesCount[nnodeId][1] == 1)
            clazz += 'rtBadlyRouted';
        else
            clazz += 'rtNotLinked';
        return {
            info: info,
            clazz: clazz,
            tooltip: tooltip
        };
    };
    $scope.processUpdateNodesNeighbours = function(current) {
        var done = function() {
            var spinner = $('#RoutingTable .fa-spinner');
            $('div.rtDiv').css({"border-color": ""});
            $scope.updating[current.nodeId] = false;
            spinner.fadeOut();
        };

        var spinner = $('#RoutingTable .fa-spinner');
        spinner.show();
        // process-states
        if (!("timeout" in current)) {
            current.timeout = (new Date()).getTime() + cfg.route_update_timeout;
        }
        $('div.line' + current.nodeId).css({"border-color": "blue"});
        dataService.store('devices[' + current.nodeId + '].RequestNodeNeighbourUpdate()', function(response) {
            var pollForNodeNeighbourUpdate = function() {
                dataService.updateZwaveDataSince(current.since, function(updateZWaveAPIData) {
                    if ("devices." + current.nodeId + ".data.neighbours" in updateZWaveAPIData) {
                        var obj = updateZWaveAPIData["devices." + current.nodeId + ".data.neighbours"]
                        $('#update' + current.nodeId).attr('class', $filter('getUpdated')(obj));
                        $('#update' + current.nodeId).html($filter('isTodayFromUnix')(obj.updateTime));
                        if (current.since < obj.updateTime && obj.invalidateTime < obj.updateTime) {
                            $scope.ZWaveAPIData.devices[current.nodeId].data.neighbours = obj;
                            $scope.nodes[current.nodeId].node = $scope.ZWaveAPIData.devices[current.nodeId];
                            $scope.updateData(current.nodeId);
                            done();
                            return;
                        }
                    }
                    if (current.timeout < (new Date()).getTime()) {
                        // timeout waiting for an update-route occured, proceed
                        done();
                        return;
                    }
                    // routes not yet updated, poll again
                    window.setTimeout(pollForNodeNeighbourUpdate, cfg.interval);
                });
            };
            // first polling
            pollForNodeNeighbourUpdate();
        });
    };
    // update a route
    $scope.update = function(nodeId) {
        dataService.purgeCache();
        // retry once
        if ($filter('updateable')($scope.nodes[nodeId].node, nodeId)) {
            var hasBattery = 0x80 in $scope.nodes[nodeId].node.instances[0].commandClasses;
            var current = {"nodeId": nodeId, "retry": 0, "type": (hasBattery ? "battery" : "mains"), "since": $scope.ZWaveAPIData.updateTime};
            // avoid overall routing-table updates during update
            $scope.updating[nodeId] = true;
            $scope.processUpdateNodesNeighbours(current, {});
        }
    };
    $scope.updateData = function(nodeId, nodeName) {
        var node = $scope.ZWaveAPIData.devices[nodeId];
        if (nodeId == 255 || node.data.isVirtual.value || node.data.basicType.value == 1)
            return;
        var routesCount = $filter('getRoutesCount')($scope.ZWaveAPIData, nodeId);
        var line = [];
        var nnodeName;
        angular.forEach($scope.ZWaveAPIData.devices, function(nnode, nnodeId) {
            if (nnodeId == 255 || nnode.data.isVirtual.value || nnode.data.basicType.value == 1) {
                return;
            }
            nnodeName = $filter('deviceName')(nnodeId, nnode);
            //console.log(nodeId + ' ' + nodeName + ' - ' + nnodeId + ' ' + nnodeName)
            line[nnodeId] = $scope.cellState(nodeId, nnodeId, routesCount, nodeName, nnodeName);
        });
        $scope.data[nodeId] = line;
    };
    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            // Prepare devices and nodes
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || node.data.isVirtual.value || node.data.basicType.value == 1)
                    return;
                $scope.devices.push(nodeId);
                $scope.nodes[nodeId] = {"label": $filter('deviceName')(nodeId, node), "node": node};
            });
            // Loop throught devices and gather routesCount and cellState
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                $scope.updateData(nodeId, $filter('deviceName')(nodeId, node));
            });
        });
    };
    $scope.load();
});