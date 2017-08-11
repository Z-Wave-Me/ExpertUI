/**
 * @overview This controller renders and handles device link health stuff.
 * @author Martin Vach
 */

/**
 * Configuration link health controller
 * @class ConfigHealthController
 *
 */
appController.controller('ConfigHealthController', function ($scope, $routeParams, $timeout, $location, $cookies, $filter, $interval, cfg, deviceService, dataService) {
    $scope.apiDataInterval;
    $scope.devices = [];
    $scope.deviceName = '';
    $scope.deviceId = 0;
    //$scope.activeTab = 'health';
    $scope.activeUrl = 'configuration/health/';
    $cookies.tab_config = 'health';
    $cookies.interval = 'health';
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
    // Cancel interval on page destroy
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.apiDataInterval);
    });

    // Redirect to device
    $scope.redirectToDevice = function (deviceId) {
        if (deviceId) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    // Load timing data
    $scope.loadTiming = function () {
        //$scope.health.alert = {message: $scope._t('not_linked_devices'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
        dataService.getApi('stat_url', null, true).then(function (response) {
            $scope.health.timing.all = response.data;
            $scope.health.timing.indicator.color = setTimingIndicatorColor(response.data[$routeParams.nodeId]);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
            return;
        });
    };
    $scope.loadTiming();

    // Load data
    $scope.load = function () {
        //$scope.health.alert = {message: $scope._t('not_linked_devices'), status: 'alert-warning', icon: 'fa-exclamation-circle'};

        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            if(_.isEmpty($scope.devices)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            $scope.health.ctrlNodeId = ZWaveAPIData.controller.data.nodeId.value;
            var node = ZWaveAPIData.devices[$routeParams.nodeId];
            /*if (!node || deviceService.notDevice(ZWaveAPIData, node, $routeParams.nodeId)) {
                return;
            }*/
            var neighbours = $filter('hasNode')(node.data, 'neighbours.value');
            $scope.health.device.neighbours = $filter('hasNode')(node.data, 'neighbours.value');

            // Remember device id
            $cookies.configuration_id = $routeParams.nodeId;
            $cookies.config_url = $scope.activeUrl + $routeParams.nodeId;
            $scope.deviceId = $routeParams.nodeId;
            $scope.health.device.node = node;
            $scope.deviceName = $filter('deviceName')($routeParams.nodeId, node);
            setDevice(node);
            setData(ZWaveAPIData, neighbours);
            $scope.refreshData();

        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
            return;
        });
    };
    $scope.load();

    /**
     * Refresh data
     */
    $scope.refreshData = function () {
        var refresh = function () {
            dataService.loadJoinedZwaveData().then(function (response) {
                setData(response.data.joined);
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
        var timingItems = $scope.health.timing.all[$routeParams.nodeId];
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
            deviceService.showNotifier({message: $scope._t('test_all_links_complete')});
            $scope.toggleRowSpinner();
        }, function (error) {
            deviceService.showNotifier({message: $scope._t('error_update_data'),type: 'error'});
            $scope.toggleRowSpinner();
        });
    };

    /// --- Private functions --- ///
    /**
     * Set configuration device
     * @param {object} node
     * @returns {undefined}
     */
    function setDevice(node) {
        angular.forEach(node.instances, function (instance, instanceId) {
            if (instance.commandClasses[115]) {
                $scope.health.device.hasPowerLevel = instance.commandClasses[115].data;
                $scope.health.cmd.testNodeInstance = instanceId;
            }
        });
    }

    /**
     * Set list of the linked devices
     * @param {object} ZWaveAPIData
     * @returns {undefined}
     */
    function setData(ZWaveAPIData, neighbours) {
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            if (nodeId === $routeParams.nodeId) {
                $scope.health.timing.indicator.updateTime = node.data.lastReceived.updateTime;
                $scope.health.timing.indicator.updateTimeColor = (node.data.lastReceived.updateTime > node.data.lastReceived.invalidateTime ? '' : 'red');
            }

            nodeId = parseInt(nodeId);
            if ($scope.health.device.neighbours.indexOf(nodeId) === -1) {
                return;
            }
            //console.log(node)
            var centralController = true;
            var type = deviceService.deviceType(node);
            var indicator;
            var powerLevel = $scope.health.device.hasPowerLevel[nodeId];
            if (powerLevel) {
                indicator = setPowerLevelIndicator(powerLevel);
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
                cmdTestNode: 'devices[' + $routeParams.nodeId + '].instances[' + $scope.health.cmd.testNodeInstance + '].commandClasses[115].TestNodeSet(' + nodeId + ',6,20)',
                cmdNop: 'devices[' + $routeParams.nodeId + '].instances[' + $scope.health.cmd.testNodeInstance + '].commandClasses[32].Get()'
            };
            var index = _.findIndex($scope.health.neighbours, {id: nodeId});
            if ($scope.health.neighbours[index]) {
                angular.extend($scope.health.neighbours[index], obj);
            } else {
                $scope.health.neighbours.push(obj);
            }

        });

        if($scope.health.neighbours.length == 0) {
            $scope.alert = {message: $scope._t('not_linked_devices'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
        }
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
    function setTimingIndicatorColor(data) {
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
    }
});