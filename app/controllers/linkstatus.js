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
    $scope.apiDataInterval;
    $scope.deviceId = 1;
    $scope.health = {
        ctrlNodeId: 1,
        alert: {message: false, status: 'is-hidden', icon: false},
        device: {
            neighbours: [],
            node: {},
            find: {},
            hasPowerLevel: false,
            commandClass: false
        },
        cmd: {
            testNodeInstance: 0
        },
        neighbours: [],
        timing: {
            all: {},
            indicator: {},
            find: {
            }
        }
    };

    $scope.linkStatus = {
        all: [],
        interval: null,
        show: false
    };
    // Cancel interval on page destroy
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.linkStatus.interval);
    });

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            if(_.isEmpty($scope.linkStatus.all)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            $scope.linkStatus.show = true;
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
        $scope.linkStatus.interval = $interval(refresh, $scope.cfg.interval);
    };

    // Load timing data
   /* $scope.loadTiming = function () {
        //$scope.health.alert = {message: $scope._t('not_linked_devices'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
        dataService.getApi('stat_url', null, true).then(function (response) {
            console.log(response)
            $scope.health.timing.all = response.data;
            $scope.health.timing.indicator.color = setTimingIndicatorColor(response.data[$scope.deviceId]);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
            return;
        });
    };*/
    //$scope.loadTiming();

    // Load data
    $scope.load = function () {
        //$scope.health.alert = {message: $scope._t('not_linked_devices'), status: 'alert-warning', icon: 'fa-exclamation-circle'};

        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
           /* $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            if(_.isEmpty($scope.devices)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }*/
            $scope.health.ctrlNodeId = ZWaveAPIData.controller.data.nodeId.value;
            var node = ZWaveAPIData.devices[$scope.deviceId];
            if (!node || deviceService.notDevice(ZWaveAPIData, node, $scope.deviceId)) {
                return;
            }
            var neighbours = $filter('hasNode')(node.data, 'neighbours.value');
            $scope.health.device.neighbours = $filter('hasNode')(node.data, 'neighbours.value');


            //$scope.deviceId = $scope.deviceId;
            $scope.health.device.node = node;
            setDevice(node);
            setData(ZWaveAPIData, neighbours);
            $scope.refreshData(ZWaveAPIData);

        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
            return;
        });
    };
    //$scope.load();

    /**
     * Refresh data
     */
    $scope.refreshData = function (ZWaveAPIData) {
        var refresh = function () {
            dataService.loadJoinedZwaveData(ZWaveAPIData).then(function (response) {
                setData(ZWaveAPIData);
            }, function (error) {
                return;
            });
        };
        $scope.apiDataInterval = $interval(refresh, $scope.cfg.interval);
    };
    // Run Zwave NOP Command
    $scope.runZwaveNopCmd = function (cmd) {
        for (i = 0; i < 21; i++) {
            $scope.runZwaveCmd(cmd);
        }
    };

    // Handle power level modal window
    $scope.handlePowerLevelModal = function (name, event, device) {
        $scope.handleModal(name, event);
        $scope.health.device.find = device;
        if (!device) {
            $scope.health.device.commandClass = {};
            return;
        }
        var cc = deviceService.configGetCommandClass($scope.health.device.hasPowerLevel[device.id], '/', '');
        $scope.health.device.commandClass = deviceService.configSetCommandClass(cc);
    };

    // Handle timing modal window
    $scope.handleTimingModal = function (name, event, device) {
        $scope.handleModal(name, event);
        $scope.health.device.find = device;
        if (!device) {
            $scope.health.timing.find = {};
            return;
        }
        $scope.loadTiming();
        var timingItems = $scope.health.timing.all[$scope.deviceId];
        if (!timingItems || _.isEmpty(timingItems)) {
            return;
        }
        $scope.health.timing.find = {
            totalPackets: timingItems.length,
            okPackets: deviceService.getOkPackets(timingItems),
            lastPackets: deviceService.getLastPackets(timingItems)
        };
    };

    /**
     * Test all links
     * @param {string} id
     * @param {string} urlType
     */
    $scope.testAllLinks = function(id) {
        $scope.toggleRowSpinner(id);
        var data = {"nodeId": $scope.deviceId};
        dataService.postApi('checklinks', data).then(function (response) {
            var runtime = parseInt(response.data.runtime) * 1000;
            alertify.alertWarning($scope._t('proccess_take',{__val__:response.data.runtime,__level__:$scope._t('seconds')}));
            $timeout($scope.toggleRowSpinner, runtime);
        }, function (error) {
            alertify.alertError($scope._t('error_update_data'));
            alertify.dismissAll();
            $scope.toggleRowSpinner();
        });
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = 1000;//ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || node.data.isVirtual.value) {
                return;
            }
            // Loop throught instances
            angular.forEach(node.instances, function(instance, instanceId) {
                if (instanceId == 0 && node.instances.length > 1) {
                    return;
                }
                var indicator;
                var dateTime;
                var isUpdated;
                var hasPowerLevel =  instance.commandClasses[115];
                var indicator = getLinkIndicator(ZWaveAPIData.devices,hasPowerLevel);
                if(hasPowerLevel){
                    console.log(hasPowerLevel)
                    isUpdated = ((hasPowerLevel.data.updateTime > hasPowerLevel.data.invalidateTime) ? true : false);
                    dateTime = $filter('getDateTimeObj')(hasPowerLevel.data.updateTime,hasPowerLevel.data.invalidateTime);
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
                type = node.data.isAwake.value ? 'battery' : 'sleep';
            } else if (isListening) {
                type = 'mains';
            } else {
                type = 'error';
            }
            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['type'] = type;
            obj['icon'] = $filter('getDeviceTypeIcon')(type),
                obj['indicator'] = indicator;
            obj['dateTime'] = dateTime;
            obj['isUpdated'] = isUpdated;
            var findIndex = _.findIndex($scope.linkStatus.all, {rowId: obj.rowId});
            if(findIndex > -1){
                angular.extend($scope.linkStatus.all[findIndex],obj);

            }else{
                $scope.linkStatus.all.push(obj);
            }
        });
        });
    }


    /**
     * Get link indicator
     * @param {object} data
     * @returns {object}
     */
    function getLinkIndicator(data,hasPowerLevel) {
        var indicator = [];
        angular.forEach(data, function(node, nodeId) {
            if (nodeId == 255 || node.data.isVirtual.value) {
                return;
            }
            var obj = {
                nodeId: nodeId,
                color: (hasPowerLevel ? setLinkIndicatorColor(nodeId,hasPowerLevel) :'')
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
    function setLinkIndicatorColor(nodeId,hasPowerLevel) {
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
        return  color;
    }

    /**
     * Set configuration device
     * @param {object} node
     * @returns {undefined}
     */
    /*function setDevice(node) {
        angular.forEach(node.instances, function (instance, instanceId) {
            if (instance.commandClasses[115]) {
                $scope.health.device.hasPowerLevel = instance.commandClasses[115].data;
                $scope.health.cmd.testNodeInstance = instanceId;
            }
        });
    }*/

    /**
     * Set list of the linked devices
     * @param {object} ZWaveAPIData
     * @returns {undefined}
     */
    function ___setData(ZWaveAPIData, neighbours) {
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
           /* if (nodeId === $scope.deviceId) {
                $scope.health.timing.indicator.updateTime = node.data.lastReceived.updateTime;
                $scope.health.timing.indicator.updateTimeColor = (node.data.lastReceived.updateTime > node.data.lastReceived.invalidateTime ? '' : 'red');
            }*/

            nodeId = parseInt(nodeId);
            if ($scope.health.device.neighbours.indexOf(nodeId) === -1) {
                return;
            }
            //console.log(node)
            var isListening = node.data.isListening.value;
            var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
            var hasWakeup = 0x84 in node.instances[0].commandClasses;
            var centralController = true;
            var type;
            var indicator;
            var powerLevel = $scope.health.device.hasPowerLevel[nodeId];
            if (powerLevel) {
                indicator = setPowerLevelIndicator(powerLevel);
            }
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
            var obj = {
                id: nodeId,
                name: $filter('deviceName')(nodeId, node),
                updateTime: node.data.updateTime,
                type: type,
                icon: $filter('getDeviceTypeIcon')(type),
                centralController: centralController,
                powerLevel: powerLevel,
                indicator: indicator,
                cmdTestNode: 'devices[' + $scope.deviceId + '].instances[' + $scope.health.cmd.testNodeInstance + '].commandClasses[115].TestNodeSet(' + nodeId + ',6,20)',
                cmdNop: 'devices[' + $scope.deviceId + '].instances[' + $scope.health.cmd.testNodeInstance + '].commandClasses[32].Get()'
            };
            var index = _.findIndex($scope.health.neighbours, {id: nodeId});
            if ($scope.health.neighbours[index]) {
                angular.extend($scope.health.neighbours[index], obj);
            } else {
                $scope.health.neighbours.push(obj);
            }

        });
    }
    /**
     * Set power level indicator
     * @param {object} data
     * @returns {object}
     */
    function setPowerLevelIndicator(data) {
        var indicator = {
            color: 'gray',
            updateTime: false,
            updateTimeColor: ''
        };
        var traffic = 'gray';
        if (!data || _.isEmpty(data) || data.acknowledgedFrames.value === null) {
            return indicator;
        }
        if (data.acknowledgedFrames.value > -1 && data.acknowledgedFrames.value < 6) {
            indicator.color = 'red';
        } else if (data.acknowledgedFrames.value > 5 && data.acknowledgedFrames.value < 18) {
            indicator.color = 'orange';
        } else if (data.acknowledgedFrames.value > 17) {
            indicator.color = 'green';
        }
        indicator.updateTime = data.acknowledgedFrames.updateTime;
        indicator.updateTimeColor = (data.acknowledgedFrames.updateTime > data.acknowledgedFrames.invalidateTime ? '' : 'red');
        return  indicator;
    }
    /**
     * Set power level indicator
     * @param {int} nodeId
     * @returns {object}
     */
    /*function setTimingIndicatorColor(data) {
        var color = 'gray';
        if (!data || _.isEmpty(data)) {
            return color;
        }
        //console.log(data)
        //return;

        var cnt = 0;
        var sum = 0;
        var avg;
        angular.forEach(data.slice(-20), function (v, k) {
            var val = 0;
            if (v.delivered) {
                val = parseInt(v.deliveryTime);
                sum += val;
            }
            cnt++;
        });
        avg = (sum / cnt).toFixed();
        if (avg > 0) {
            color = (avg > 100 ? 'black' : 'green');
        } else {
            color = 'red';
        }
        return color;
    }*/
});