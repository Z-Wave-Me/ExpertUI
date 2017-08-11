/**
 * @overview This controller renders and handles routing table.
 * @author Martin Vach
 */

/**
 * Neighbor controller
 * @class NeighborController
 *
 */
appController.controller('NeighborController', function ($scope, $filter, $timeout, $interval, $http, dataService, deviceService,cfg, _) {
    $scope.routings = {
        all: [],
        updates: [],
        interval: null,
        show: false,
        view: 'neighbors',
        showInfo: true,
        dataSize: 'sm'//sm/md/lg
    };
    $scope.htmlNeighbors = {};

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.routings.interval);
    });
    /**
     * Chenge view neighbors/table
     * @param {string} view
     */
    $scope.changeView = function (status) {
        if (typeof status === 'boolean') {
            $scope.routings.showInfo = status;
        } else {
            $scope.routings.showInfo = !$scope.routings.showInfo;
        }
    };

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function () {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            //setNodes(ZWaveAPIData);
            setData(ZWaveAPIData);
            var size = _.size($scope.routings.all);
            if (size < 1) {
                $scope.alert = {
                    message: $scope._t('device_404'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation-circle'
                };
                return;
            }
            // Data size
            if (size > 30 && size < 50) {
                $scope.routings.dataSize = 'md'
            } else if (size > 50) {
                $scope.routings.dataSize = 'lg'
            }
            setCells($scope.routings.all);
            $scope.routings.show = true;

        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshZwaveData = function () {
        var refresh = function () {
            dataService.loadJoinedZwaveData(null).then(function (response) {
                angular.forEach(response.data.update, function(v, k) {
                    if($scope.routings.updates.indexOf(k) > -1){
                        console.log(k)
                        setData(response.data.joined);
                        setCells($scope.routings.all);
                    }
            });

                //
            });
        };
        $scope.routings.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Update route
     * @param {string} url
     */
    $scope.updateRoute = function (url) {
        $scope.toggleRowSpinner(url);
        dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
            $scope.refreshZwaveData();
            //$scope.toggleRowSpinner();
            $timeout($scope.toggleRowSpinner, 1000);
            $timeout(function(){
                $interval.cancel($scope.routings.interval);
            }, 5000);
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
    $scope.updateAllRoutess = function (id, urlType) {
        var lastItem = _.last($scope.routings.all);
        $scope.toggleRowSpinner(id);
        $scope.refreshZwaveData();
        angular.forEach($scope.routings.all, function (v, k) {
            $scope.toggleRowSpinner(v[urlType]);
            dataService.runZwaveCmd(cfg.store_url + v[urlType]).then(function (response) {
                alertify.dismissAll();
            }, function (error) {
                alertify.dismissAll();
                alertify.alertError($scope._t('error_update_data') + '\n' + v[urlType]);
            });
            if (lastItem.rowId === v.rowId) {
                $timeout($scope.toggleRowSpinner, 1000);
            }
        });
        $timeout(function(){
            $interval.cancel($scope.routings.interval);
        }, 5000);

    };

    /// --- Private functions --- ///
    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {

            if (nodeId == 255 || node.data.isVirtual.value || node.data.basicType.value == 1) {
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            var name = $filter('deviceName')(nodeId, node);
            var type = deviceService.deviceType(node);

            /// New version
            //var routesCount = $filter('getRoutesCount')(ZWaveAPIData, nodeId);
            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = name;
            obj['node'] = node;
            //obj['routesCount'] = routesCount;

            obj['type'] = type;
            obj['icon'] = $filter('getDeviceTypeIcon')(type);
            obj['invalidateTime'] = node.data.neighbours.invalidateTime;
            obj['updateTime'] = node.data.neighbours.updateTime,
                obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
            obj['urlToStore'] = 'devices[' + nodeId + '].RequestNodeNeighbourUpdate()';

            var findIndex = _.findIndex($scope.routings.all, {rowId: obj.rowId});
            if (findIndex > -1) {
                angular.extend($scope.routings.all[findIndex], obj);

            } else {
                $scope.routings.all.push(obj);
                $scope.routings.updates.push('devices.' + nodeId + '.data.neighbours')
            }
            /*for (i = 0; i < 10; i++) {
             $scope.routings.all.push(obj);
             }*/
        });
    }

    /**
     * Set table cell state
     * @param {object} nodes
     * @returns {Array}
     */
    function setCells(nodes) {
        angular.forEach(nodes, function (node, i) {
            $scope.htmlNeighbors[node.id] = '';
            angular.forEach(nodes, function (v, k) {
                var tooltip = node.id + ': ' + node.name + ' - ' + v.id + ': ' + v.name + ' ';
                //var routesCount = v.routesCount;
                var hasAssoc = false;
                var cssClass = 'rtUnavailable';
                //Check for associations
                /*if ($filter('associationExists')(node.node, v.id)) {
                    hasAssoc = true;
                    tooltip += ' (' + $scope._t('rt_associated') + ')';
                }*/
                if (node.id == v.id) {
                    cssClass = 'rtWhite';
                } else if (v.node.data.neighbours.value.indexOf(parseInt(node.id, 10)) != -1) {
                    cssClass = 'rtDirect';
                }  else {
                    cssClass = 'rtNotLinked';
                }
                var out = '<span class="rt-cell ' + cssClass + '" title="' + tooltip + '">' + (hasAssoc ? "*" : "&nbsp") + '</span>';
                //console.log(out)
                $scope.htmlNeighbors[node.id] += out;
            });
        });

    }
});