/**
 * @overview This controller renders and handles link status stuff.
 * @author Martin Vach
 */

/**
 * Link status controller
 * @class CLinkStatusController
 *
 */
appController.controller('LinkStatusController', function ($scope, $routeParams, $timeout, $location, $cookies, $filter, $interval, cfg, deviceService, dataService) {
    $scope.linkStatus = {
        all: [],
        interval: null,
        show: false,
        showInfo: true

    };
    $scope.htmlNeighbors = {};
    $scope.testLink = {};
    // Cancel interval on page destroy
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.linkStatus.interval);
    });

    /**
     * Chenge view info and table = true /table only = false
     * @param {string} view
     */
    $scope.changeView = function (status) {
        if (typeof status === 'boolean') {
            $scope.linkStatus.showInfo = status;
        } else {
            $scope.rlinkStatus.showInfo = !$scope.linkStatus.showInfo;
        }
    };

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function () {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            setData(ZWaveAPIData);
            // There is controller only
            if (_.size($scope.linkStatus.all) < 2) {
                $scope.alert = {
                    message: $scope._t('device_404'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation-circle'
                };
                return;
            }
            setCells($scope.linkStatus.all);
            $scope.linkStatus.show = true;

        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function () {

        var refresh = function () {
            //var findZwaveStr = 'devices.' + 86;
            dataService.loadJoinedZwaveData().then(function (response) {
                var update = false;
               angular.forEach(response.data.update, function(v, k) {
                    var nodeId = k.split('.')[1];
                    if($scope.testLink[nodeId]){
                        update = true;
                        return;
                    }
                });
                if(update){
                    setData(response.data.joined);
                    setCells($scope.linkStatus.all);
                }
            });
        };
        $scope.linkStatus.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Test all links
     * @param {string} id
     */
    $scope.testAllLinks = function(nodeId) {
        $interval.cancel($scope.linkStatus.interval);
        $scope.toggleRowSpinner(nodeId);
        var data = {"nodeId": nodeId};
        dataService.postApi('checklinks', data).then(function () {
            $scope.refreshZwaveData();
            $scope.toggleRowSpinner();
        }, function () {
            alertify.alertError($scope._t('error_update_data'));
            $scope.toggleRowSpinner();
        });
    };


    /**
     * todo: Whay 21 times?
     * Run NOP command
     * @param {string} cmd
     */
    $scope.runZwaveNop = function (cmd) {
        $interval.cancel($scope.linkStatus.interval);
        for (i = 0; i < 21; i++) {
            $scope.runZwaveCmd(cmd,3000,true);
        }
        $scope.refreshZwaveData();
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            if (nodeId == 255 || node.data.isVirtual.value) {
                return;
            }
            var hasPowerLevel = node.instances[0].commandClasses[115];

            // Loop throught instances
            angular.forEach(node.instances, function (instance, instanceId) {
                if (instanceId == 0 && node.instances.length > 1) {
                    return;
                }
                var lastReceive = parseInt(node.data.lastReceived.updateTime, 10) || 0;
                var lastSend = parseInt(node.data.lastSend.updateTime, 10) || 0;
                var lastCommunication = (lastSend > lastReceive) ? lastSend : lastReceive;
                var dateTime;
                var isUpdated;
                if (hasPowerLevel) {
                    isUpdated = ((hasPowerLevel.data.updateTime > hasPowerLevel.data.invalidateTime) ? true : false);
                    dateTime = $filter('getDateTimeObj')(hasPowerLevel.data.updateTime, hasPowerLevel.data.invalidateTime);
                }
                var type = deviceService.deviceType(node);
                var obj = {};
                obj['id'] = nodeId;
                obj['rowId'] = 'row_' + nodeId;
                obj['isController'] = controllerNodeId == nodeId;
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['type'] = type;
                obj['hasPowerLevel'] = hasPowerLevel;
                obj['icon'] = $filter('getDeviceTypeIcon')(type);
                obj['isFailed'] = node.data.isFailed.value;
                obj['neighbours'] = node.data.neighbours.value;
                obj['updateTime'] = lastCommunication;
                obj['dateTime'] = $filter('getDateTimeObj')(lastCommunication);
                obj['isUpdated'] = isUpdated;
                obj['cmdNop'] = 'devices[' + nodeId + '].SendNoOperation()';
                var findIndex = _.findIndex($scope.linkStatus.all, {rowId: obj.rowId});
                if (findIndex > -1) {
                    angular.extend($scope.linkStatus.all[findIndex], obj);

                } else {
                    $scope.linkStatus.all.push(obj);
                }
            });
        });
    }

    /**
     * Set table cell state
     * @param {object} nodes
     * @returns {Array}
     */
    function setCells(nodes) {
        //console.log(nodes)
        angular.forEach(nodes, function (node, i) {
            //console.log(node.id,node.neighbours)
            $scope.htmlNeighbors[node.id] = '';
            $scope.testLink[node.id] = [];
            var powerLevel = node.hasPowerLevel ? node.hasPowerLevel.data : [];
            //console.log(node.hasPowerLevel)
            angular.forEach(nodes, function (v, k) {
                var tooltip = node.id + ': ' + node.name + ' - ' + v.id + ': ' + v.name + ' ';
                //var cssClass = node.hasPowerLevel ? 'rtUnavailable' : 'rtWhite';
                var cssClass = 'rtWhite';

                if(node.hasPowerLevel){ // Cols for powerLevel
                    var nodePowerLevel = powerLevel[v.id];
                    //console.log(node.neighbours.indexOf(parseInt(v.id)))
                    if(node.neighbours.indexOf(parseInt(v.id)) > -1){
                        cssClass = 'rtUnavailable';
                        //console.log(node.id + ' | '+ v.id+' In neighbours',node.neighbours)
                    }/*else{
                        console.log(node.id + ' | '+ v.id+' NOT in neighbours',node.neighbours)
                    }*/
                   // cssClass = (node.neighbours.indexOf(parseInt(v.id)) === -1 ? 'rtOrange' : 'rtUnavailable');

                    if(nodePowerLevel){
                        $scope.testLink[node.id].push(v.id);
                        //console.log(node.id + ' | ' + v.id + ': ',powerLevel[v.id])
                        if (nodePowerLevel.acknowledgedFrames.value > -1 && nodePowerLevel.acknowledgedFrames.value < 6) {
                            cssClass = 'rtRed';
                        } else if (nodePowerLevel.acknowledgedFrames.value > 5 && nodePowerLevel.acknowledgedFrames.value < 18) {
                            cssClass = 'rtOrange';
                        } else if (nodePowerLevel.acknowledgedFrames.value > 17) {
                            cssClass = 'rtGreen';
                        }
                    }
                }else{// Without powelLevel
                    if(v.isController){
                        //console.log(node.id +' : ' + v.id,v.isFailed)
                        cssClass = node.isFailed ? 'rtUnavailable' : 'rtGreen';
                    }

                }
                if(node.id === v.id ){
                    cssClass = 'rtWhite';
                }
                var out = '<span class="rt-cell ' + cssClass + '" title="' + tooltip + '">' +  '&nbsp' + '</span>';
                $scope.htmlNeighbors[node.id] += out;
            });
        });
    }
});