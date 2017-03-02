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
        pwLvl: [0,-1, -2, -3, -4, -5, -6, -7, -8, -9],
        pwLvlData: {},
        pwLvlTested: []


    };
    // Cancel interval on page destroy
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.linkStatus.interval);
    });

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
            $scope.linkStatus.show = true;
            //$scope.refreshZwaveData(ZWaveAPIData);
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
            dataService.loadJoinedZwaveData().then(function (response) {
                setData(response.data.joined);
            }, function (error) {
            });
        };
        $scope.linkStatus.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Run TestNode command
     * @param {string} params
     */
    $scope.runZwaveTestNode = function (v) {
      // console.log(v.paramsTestNode);
        //console.log(v);
        var index = $scope.linkStatus.pwLvlTested.indexOf(v.id);
        if (index > -1) {
            $scope.linkStatus.pwLvlTested.splice(index, 1);
        }/*else{
            $scope.linkStatus.pwLvlTested.push(v.id);
        }*/
        //$scope.linkStatus.pwLvlData[v.id] = [0,5,0,51,0,0,99,0,100,100];

        //return;
        $scope.toggleRowSpinner(v.paramsTestNode);
        dataService.getApi('test_node', v.paramsTestNode, true).then(function (response) {
            $scope.linkStatus.pwLvlData[v.id] = response.data;
            $scope.linkStatus.pwLvlTested.push(v.id);

            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_load_data'));
        });
    };

    /**
     * todo: Why 21 times?
     * Run NOP command
     * @param {string} cmd
     */
    $scope.runZwaveNop = function (cmd) {
        for (i = 0; i < 21; i++) {
            $scope.runZwaveCmd(cmd);
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
            if (nodeId == 255 || nodeId == ZWaveAPIData.controller.data.nodeId.value || node.data.isVirtual.value) {
                return;
            }
            // Loop throught instances
            angular.forEach(node.instances, function (instance, instanceId) {
                if (instanceId == 0 && node.instances.length > 1) {
                    return;
                }
                var indicator;
                var dateTime;
                var isUpdated;
                var hasPowerLevel = instance.commandClasses[115];
                //var indicator = getLinkIndicator(ZWaveAPIData.devices, hasPowerLevel);
                if (hasPowerLevel) {
                    isUpdated = ((hasPowerLevel.data.updateTime > hasPowerLevel.data.invalidateTime) ? true : false);
                    dateTime = $filter('getDateTimeObj')(hasPowerLevel.data.updateTime, hasPowerLevel.data.invalidateTime);
                }

                var isListening = node.data.isListening.value;
                var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
                var hasWakeup = 0x84 in node.instances[0].commandClasses;
                //var centralController = true;
                var type;

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
                var obj = {};
                obj['id'] = nodeId;
                obj['rowId'] = 'row_' + nodeId;
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['type'] = type;
                obj['hasPowerLevel'] = hasPowerLevel;
                obj['icon'] = $filter('getDeviceTypeIcon')(type),
                    obj['indicator'] = indicator;
                obj['dateTime'] = dateTime;
                obj['isUpdated'] = isUpdated;
                obj['paramsTestNode'] = nodeId;//+ '/' + 10;
                ;
                obj['cmdNop'] = 'devices[' + nodeId + '].SendNoOperation()'
                var findIndex = _.findIndex($scope.linkStatus.all, {rowId: obj.rowId});
                if (findIndex > -1) {
                    angular.extend($scope.linkStatus.all[findIndex], obj);

                } else {
                    $scope.linkStatus.all.push(obj);
                    $scope.linkStatus.pwLvlData[nodeId] = [0,0,0,0,0,0,0,0,0,0];
                }

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
                color: (hasPowerLevel ? setLinkIndicatorColor(nodeId, hasPowerLevel) : '')
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
        var color = 'rtGray';
        if (!hasPowerLevel[nodeId]) {
            return color;
        }
        var data = hasPowerLevel[nodeId];
        if (data.acknowledgedFrames.value > -1 && data.acknowledgedFrames.value < 6) {
            color = 'rtRed';
        } else if (data.acknowledgedFrames.value > 5 && data.acknowledgedFrames.value < 18) {
            color = 'rtOrange';
        } else if (data.acknowledgedFrames.value > 17) {
            color = 'rtGreen';
        }
        return color;
    }
});