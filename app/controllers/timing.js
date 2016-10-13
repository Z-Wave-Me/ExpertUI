/**
 * TimingController
 * @author Martin Vach
 */
appController.controller('TimingController', function($scope, $filter, dataService) {
    $scope.devices = [];
    $scope.timing = [];
    $scope.reset = function() {
        $scope.devices = angular.copy([]);
    };

    // Load timing data
    $scope.loadTiming = function() {
        dataService.getTiming(function(data) {
            dataService.getZwaveData(function(ZWaveAPIData) {
                setData(data, ZWaveAPIData);
//            dataService.joinedZwaveData(function(data) {
//                $scope.reset();
//                //$scope.loadTiming();
//                setData(data,data.joined);
//            });
            });
            $scope.timing = data;
        });
    };
    $scope.loadTiming();
    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    // Reset statistics
    $scope.resetTiming = function(cmd) {
        console.log(cmd);
        //dataService.runCmd(cmd);
    };


    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(data, ZWaveAPIData) {
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
            /*if (isListening) {
                type = 'type_mains';
            } else if (!isListening && hasWakeup) {
                type = 'type_battery_wakup';
            } else if (!isListening && isFLiRS) {
                type = 'type_flirs';
            } else {
                type = 'type_remote';

            }*/
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
            var timingItems = data[nodeId];

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
            obj['totalPackets'] = totalPackets;
            obj['okPackets'] = okPackets;
            obj['lastPackets'] = lastPackets;
            obj['basicType'] = basicType;
            obj['genericType'] = genericType;
            obj['specificType'] = specificType;
            $scope.devices.push(obj);
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