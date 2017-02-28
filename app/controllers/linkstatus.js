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
            if (_.isEmpty($scope.linkStatus.all)) {
                $scope.alert = {
                    message: $scope._t('device_404'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation-circle'
                };
                return;
            }
            setCells($scope.linkStatus.all);
            $scope.linkStatus.show = true;
            $scope.refreshZwaveData(ZWaveAPIData);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshZwaveData = function (ZWaveAPIData) {
        var refresh = function () {
            dataService.loadJoinedZwaveData(ZWaveAPIData).then(function (response) {
                setData(response.data.joined);
                //console.log(Object.keys(response.data.update))
            }, function (error) {
            });
        };
        $scope.linkStatus.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Runtest link command
     * @param {string} params
     */
    $scope.runTestLink = function (nodeId) {
        console.log($scope.testLink[nodeId]);
        $scope.toggleRowSpinner(nodeId);
        angular.forEach($scope.testLink[nodeId], function (v, k) {
            var cmd = 'devices['+nodeId+'].instances[0].commandClasses[115].TestNodeSet('+v+',6,20)';
            $scope.runZwaveCmd(cmd,5000,true);
        });
    };

    /**
     * Run TestNode command
     * @param {string} params
     */
    $scope.runZwaveTestNode = function (params) {
       console.log(params)
        return;
        $scope.toggleRowSpinner(params);

        dataService.getApi('test_node', params, true).then(function (response) {


            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_load_data'));
        });
    };

    /**
     * todo: Whay 21 times?
     * Run NOP command
     * @param {string} cmd
     */
    $scope.runZwaveNop = function (cmd) {
        for (i = 0; i < 21; i++) {
            $scope.runZwaveCmd(cmd,5000,true);
        }
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
           /* if (k == 255 || k == $scope.controllerId || device.data.isVirtual.value) {
                return false;
            }*/
            var hasPowerLevel = node.instances[0].commandClasses[115];

            // Loop throught instances
            angular.forEach(node.instances, function (instance, instanceId) {
                if (instanceId == 0 && node.instances.length > 1) {
                    return;
                }
                var indicator;
                var dateTime;
                var isUpdated;
                //var indicator = getLinkIndicator(ZWaveAPIData.devices, hasPowerLevel.data);
                if (hasPowerLevel) {
                    //console.log(instance.commandClasses[115])
                    isUpdated = ((hasPowerLevel.data.updateTime > hasPowerLevel.data.invalidateTime) ? true : false);
                    dateTime = $filter('getDateTimeObj')(hasPowerLevel.data.updateTime, hasPowerLevel.data.invalidateTime);
                }
                //var centralController = true;
                var type = deviceService.deviceType(node);


                var obj = {};
                obj['id'] = nodeId;
                obj['rowId'] = 'row_' + nodeId;
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['type'] = type;
                obj['hasPowerLevel'] = hasPowerLevel;
                obj['icon'] = $filter('getDeviceTypeIcon')(type);
                //obj['indicator'] = indicator;
                obj['dateTime'] = dateTime;
                obj['isUpdated'] = isUpdated;
                obj['paramsTestNode'] = nodeId;
                obj['cmdTestNode'] = 'devices['+nodeId+'].instances['+instanceId+'].commandClasses[115].TestNodeSet('+nodeId+',6,20)',
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
            $scope.htmlNeighbors[node.id] = '';
            $scope.testLink[node.id] = [];
            var powerLevel = node.hasPowerLevel ? node.hasPowerLevel.data : [];
            //console.log(node.hasPowerLevel)
            angular.forEach(nodes, function (v, k) {
                var tooltip = node.id + ': ' + node.name + ' - ' + v.id + ': ' + v.name + ' ';
                var cssClass = 'rtUnavailable';
                var nodePowerLevel = node.id === v.id ? false : powerLevel[v.id];
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
                //console.log(tooltip)
                var out = '<span class="rt-cell ' + cssClass + '" title="' + tooltip + '">' +  '&nbsp' + '</span>';
                $scope.htmlNeighbors[node.id] += out;
            });
        });
    }


    /**
     * Get link indicator
     * @param {object} data
     * @returns {object}
     */
    function getLinkIndicator(data, hasPowerLevel) {
        var indicator = [];
        angular.forEach(data, function (node, nodeId) {
            if (nodeId == 255 || node.data.isVirtual.value) {
                return;
            }
            var obj = {
                nodeId: nodeId,
                cssClass: (hasPowerLevel ? setLinkIndicatorColor(nodeId, hasPowerLevel) : '')
            }
            indicator.push(obj);

        });
        return indicator;
    }

    /**
     * Set link indicator
     * @param {object} data
     * @returns {object}
     */
    function setLinkIndicatorColor(nodeId, hasPowerLevel) {
        var cssClass = 'rtGray';
        if (!hasPowerLevel[nodeId]) {
            return cssClass;
        }
        var data = hasPowerLevel[nodeId];
        if (data.acknowledgedFrames.value > -1 && data.acknowledgedFrames.value < 6) {
            cssClass = 'rtRed';
        } else if (data.acknowledgedFrames.value > 5 && data.acknowledgedFrames.value < 18) {
            cssClass = 'rtOrange';
        } else if (data.acknowledgedFrames.value > 17) {
            cssClass = 'rtGreen';
        }
        return cssClass;
    }
});