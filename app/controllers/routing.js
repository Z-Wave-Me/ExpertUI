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
        neighbours: {},
        view: 'table'
    };
    $scope.nodes = {};

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.routings.interval);
    });
    /**
     * Chenge view neighbors/table
     * @param {string} view
     */
    $scope.changeView = function(view) {
        $scope.routings.view = view;
        $scope.loadZwaveData();
    };

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setNodes(ZWaveAPIData);
            setData(ZWaveAPIData);
            if(_.isEmpty($scope.routings.all)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            $scope.routings.show = true;
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
     * Set nodes data
     * @param {object} ZWaveAPIData
     */
    function setNodes(ZWaveAPIData) {
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || node.data.isVirtual.value || node.data.basicType.value == 1) {
                return;
            }
            var nodeName = $filter('deviceName')(nodeId, node);
            var routesCount = $filter('getRoutesCount')(ZWaveAPIData, nodeId);

            $scope.routings.nodes[nodeId] = {
                "id": nodeId,
                "nodeName": nodeName,
                "routesCount": routesCount,
                "node": node
            };
        });
    }

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        //var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || node.data.isVirtual.value || node.data.basicType.value == 1) {
                return;
            }


            var node = ZWaveAPIData.devices[nodeId];
            var name = $filter('deviceName')(nodeId, node);
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
                type = 'battery';
            } else if (isListening) {
                type = 'mains';
            } else {
                type = 'unknown';
            }
             var cellState = setCellState(nodeId, node,name)

            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = name;
            obj['node'] = node;
            obj['cellState'] = cellState;
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

        });
    }

    /**
     * Set table cell state
     * @param {object} nodeId
     * @param {number} node
     * @param {string} nodeName
     * @returns {Array}
     */
    function setCellState(nodeId, node,nodeName) {
        var routesCount = $scope.routings.nodes[nodeId].routesCount;
        var state = [];
        angular.forEach($scope.routings.nodes, function(v, k ){
            console.log(v)
            var tooltip = nodeId + ': ' + nodeName + ' - ' + k + ': ' + v.nodeName  + ' ';
            var hasAssoc = false;
            var cssClass = 'rtDiv line' + nodeId + ' ';
            //Check for associations
            if ($filter('associationExists')(node, k)) {
                hasAssoc = true;
                tooltip += ' (' + $scope._t('rt_associated') + ')';
            }
            if (nodeId == k
                || node.data.isVirtual.value
                || v.node.data.isVirtual.value
                || node.data.basicType.value == 1
                || v.node.data.basicType.value == 1) {
                cssClass = 'rtDiv rtUnavailable';
            }else if(node.data.neighbours.value.indexOf(parseInt(k, 10)) != -1){
                cssClass += 'rtDirect';
            }else if (routesCount[k] && routesCount[k].length > 1){
                cssClass += 'rtRouted';
            }else if (routesCount[k] && routesCount[k].length == 1){
                cssClass += 'rtBadlyRouted';
            }else{
                cssClass += 'rtNotLinked';
            }

            var obj = {
                nodeId: nodeId,
                routingId: k,
                tooltip: tooltip,
                hasAssoc: hasAssoc,
                cssClass: cssClass

            };
            state.push(obj)
        });
        return state;
    }
});