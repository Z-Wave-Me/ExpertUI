/**
 * RoutingController
 * @author Martin Vach
 */
appController.controller('RoutingController', function($scope, $filter, dataService, cfg) {

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