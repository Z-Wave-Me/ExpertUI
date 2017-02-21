/**
 * @overview This controller renders and handles routing table.
 * @author Martin Vach
 */

/**
 * Neighbor controller
 * @class NeighborController
 *
 */
appController.controller('NeighborController', function($scope, $filter, $timeout,$interval,$http,dataService, cfg,_) {
    $scope.routings = {
        all: [],
        interval: null,
        show: false,
        view: 'neighbors',
        showInfo: true
    };
    $scope.htmlNeighbors = {};

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
    $scope.changeView = function(status) {
        if (typeof status === 'boolean') {
            $scope.routings.showInfo = status;
        } else {
            $scope.routings.showInfo = !$scope.routings.showInfo;
        }
    };

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            //setNodes(ZWaveAPIData);
            setData(ZWaveAPIData);
            if(_.isEmpty($scope.routings.all)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            setCells($scope.routings.all);
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
   /* function setNodes(ZWaveAPIData) {
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
    }*/

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        //var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        //console.log(Object.keys(ZWaveAPIData.devices))
       /* var nodeIds = Object.keys(ZWaveAPIData.devices);
        var nodeArray = _.map(ZWaveAPIData.devices, function(node,nodeId){
            if (nodeId == 255 || node.data.isVirtual.value || node.data.basicType.value == 1) {
                return;
            }
           var obj = {
                id: nodeId,
                name: $filter('deviceName')(nodeId, node)
            };
            return obj;
        });*/
        //console.log(nodeArray);
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
             var cellState = [];//setCellState(nodeId, node,name)

            //setCellState(nodeId, node,name);

            // New version
            var routesCount = $filter('getRoutesCount')(ZWaveAPIData, nodeId);
            //setCellStateNew(nodeArray,nodeId,node,name,routesCount);
            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = name;
            obj['node'] = node;
            obj['cellState'] = cellState;
            obj['routesCount'] = routesCount;

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
            /*for (i = 0; i < 40; i++) {
                $scope.routings.all.push(obj);
            }*/




        });
        //console.log($scope.nodes)
    }

    /**
     * Set table cell state
     * @param {object} nodeId
     * @param {number} node
     * @param {string} nodeName
     * @returns {Array}
     */
    function setCells(nodes) {
        angular.forEach(nodes, function(node, i ){
            $scope.htmlNeighbors[node.id] = '';
            angular.forEach(nodes, function(v, k ){
                var tooltip = node.id + ': ' + node.name + ' - ' + v.id + ': ' + v.name  + ' ';
                //var routesCount = v.routesCount;
                var hasAssoc = false;
                var cssClass = 'rtDiv ';
                //Check for associations
                if ($filter('associationExists')(node.node,v.id)) {
                    hasAssoc = true;
                    tooltip += ' (' + $scope._t('rt_associated') + ')';
                }
                if(node.id == v.id){
                    cssClass += 'rtUnavailable';
                }else if(v.node.data.neighbours.value.indexOf(parseInt(node.id, 10)) != -1){
                    cssClass += 'rtDirect';
                }else if (node.routesCount && node.routesCount.length > 1){
                    cssClass += 'rtRouted';
                }else if (node.routesCount && node.routesCount.length == 1){
                    cssClass += 'rtBadlyRouted';
                }else{
                    cssClass += 'rtNotLinked';
                }
                var out = '<span class="rt-cell ' + cssClass + '" title="' + tooltip + '">'+ (hasAssoc ? "*": "&nbsp")+'</span>';
                //console.log(out)
                $scope.htmlNeighbors[node.id] += out;
            });
        });

    }



    /**
     * Set table cell state
     * @param {object} nodeId
     * @param {number} node
     * @param {string} nodeName
     * @returns {Array}
     */
   /* function setCellStateNew(nodeArray,nodeId, node,nodeName,routesCount) {
        //var routesCount = $scope.routings.nodes[nodeId].routesCount;
        //console.log(routesCount)
        //console.log($scope.routings.nodes)
        angular.forEach(nodeArray, function(v, k ){
            var tooltip = nodeId + ': ' + nodeName + ' - ' + v.id + ': ' + v.name  + ' ';
            //var tooltip = nodeId + ': ' + nodeName + ' - ' + k ;
            var hasAssoc = false;
            var cssClass = 'rtDiv';
            //Check for associations
            if ($filter('associationExists')(node, k)) {
                hasAssoc = true;
                tooltip += ' (' + $scope._t('rt_associated') + ')';
            }
            if(nodeId == v.id){
                cssClass += 'rtUnavailable';
            }else if(node.data.neighbours.value.indexOf(parseInt(k, 10)) != -1){
                cssClass += 'rtDirect';
            }else if (routesCount[v.id] && routesCount[v.id].length > 1){
                cssClass += 'rtRouted';
            }else if (routesCount[v.id] && routesCount[v.id].length == 1){
                cssClass += 'rtBadlyRouted';
            }else{
                cssClass += 'rtNotLinked';
            }
            console.log(cssClass)
            //console.log(cssClass)
        });

    }*/

    /**
     * Set table cell state
     * @param {object} nodeId
     * @param {number} node
     * @param {string} nodeName
     * @returns {Array}
     */
    /*function setCellState(nodeId, node,nodeName) {
        //console.log($scope.routings.nodes)
        var routesCount = $scope.routings.nodes[nodeId].routesCount;
        var state = [];
       /!* var html = {};
        html[nodeId] = "";*!/
        $scope.htmlNeighbors[nodeId] = '';
        angular.forEach($scope.routings.nodes, function(v, k ){
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

           /!* var obj = {
                nodeId: nodeId,
                routingId: k,
                tooltip: tooltip,
                hasAssoc: hasAssoc,
                cssClass: cssClass

            };*!/
            var out = '<span class="rt-cell ' + cssClass + '" title="' + tooltip + '">'+ (hasAssoc ? "*": "&nbsp")+'</span>';
            //html[nodeId] += out;
           // $scope.htmlNeighbors[nodeId] += out;

            //state.push(html)
        });
        //$scope.routings.cellStates.push(state);
        //console.log($scope.routings.cellStates);
        //$scope.htmlNeighbors[nodeId] = html[nodeId];
        //console.log($scope.htmlNeighbors)
        //return state;
    }*/
});