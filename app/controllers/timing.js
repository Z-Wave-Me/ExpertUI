/**
 * @overview This controller renders and handles communication history.
 * @author Martin Vach
 */

/**
 * Timing root controller
 * @class TimingController
 *
 */
appController.controller('TimingController', function($scope, $filter, $q,$timeout,$interval,dataService, cfg,_) {
    $scope.devices = {
        all: [],
        interval: null,
        show: false
    };
    $scope.timing = [];

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.devices.interval);
    });

    /**
     * Load all promises
     * @returns {undefined}
     */
    $scope.allSettled = function () {
        var promises = [
            dataService.getApi('stat_url', null, true),
            dataService.loadZwaveApiData()
        ];

        $q.allSettled(promises).then(function (response) {
            // console.log(response)
            var timing = response[0];
            var zwaveData = response[1];
            $scope.loading = false;

            // timing error message
            if (timing.state === 'rejected') {
                alertify.alertError($scope._t('error_load_data') + ':' + cfg.server_url + cfg.device_classes_url);
            }

            // zwaveData error message
            if (zwaveData.state === 'rejected') {
                alertify.alertError($scope._t('error_load_data'));
                return;
            }
            // Success - timing
            if (timing.state === 'fulfilled') {
                $scope.timing = timing.value.data;

                //setDeviceClasses(deviceClasses.value);
            }

            // Success - zwaveData
            if (zwaveData.state === 'fulfilled') {
                //console.log(zwaveData.value)
                setData(zwaveData.value);
                if(_.isEmpty($scope.devices.all)){
                    $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                    return;
                }
                $scope.devices.show = true;
                $scope.refreshZwaveData(zwaveData.value);
            }

        });

    };
    $scope.allSettled();

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
        $scope.devices.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Update timing info
     * @param {text} spin
     */
    $scope.updateTimingInfo = function(spin) {
        $scope.toggleRowSpinner(spin);
        $interval.cancel($scope.devices.interval);
        $scope.allSettled();
        $timeout($scope.toggleRowSpinner, 1000);
    };

    /// --- Private functions --- ///
    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            var type;
            var isListening = node.data.isListening.value;
            var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
            var hasBattery = 0x80 in node.instances[0].commandClasses;
            var hasWakeup = 0x84 in node.instances[0].commandClasses;
            var totalPackets = 0;
            var okPackets = 0;
            var lastPackets = '';
            var basicType = node.data.basicType.value;
            var genericType = node.data.genericType.value;
            var specificType = node.data.specificType.value;

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

            // Packets
            var timingItems =  $scope.timing[nodeId];

            if (angular.isDefined(timingItems)) {
                totalPackets = timingItems.length;
                okPackets = getOkPackets(timingItems);
                lastPackets = getLastPackets(timingItems);
            }

            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['type'] = type;
            obj['icon'] = $filter('getDeviceTypeIcon')(type);
            obj['totalPackets'] = totalPackets;
            obj['okPackets'] = okPackets;
            obj['lastPackets'] = lastPackets;
            obj['basicType'] = basicType;
            obj['genericType'] = genericType;
            obj['specificType'] = specificType;
            var findIndex = _.findIndex($scope.devices.all, {rowId: obj.rowId});
            if(findIndex > -1){
                angular.extend($scope.devices.all[findIndex],obj);

            }else{
                $scope.devices.all.push(obj);
            }
        });
    }

    /**
     * Get percentage of delivered packets
     */
    function getOkPackets(data) {
        var isDelivered = 0;
        var notDelivered = 0;
        angular.forEach(data, function(v, k) {
            if (v.delivered == true) {
                isDelivered++;
            } else {
                notDelivered++;
            }

        });
        var calcPercent = isDelivered / data.length * 100;
        var percent = 0;
        if (!isNaN(calcPercent)) {
            percent = calcPercent.toFixed(0);
        }
        return percent;

    }

    /**
     * Get list of last packets
     */
    function getLastPackets(data) {
        var packets = '&nbsp;';
        var deliveryTime = 0;
        var color;
        angular.forEach(data.slice(-20), function(v, k) {
            deliveryTime = parseInt(v.deliveryTime);
            if (!v.delivered) {
                color = 'red';
            } else {
                color = (deliveryTime > 100 ? 'black' : 'green');
            }
            var displayTime = deliveryTime / 10;
            packets += '<span class="' + color + ' timing-packet">' + (displayTime.toFixed() < 1 ? 1 : displayTime.toFixed()) + '</span> ';
        });
        return packets;

    }
});