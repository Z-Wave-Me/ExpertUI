/**
 * @overview This controller renders and handles communication history.
 * @author Martin Vach
 */

/**
 * Timing root controller
 * @class TimingController
 *
 */
appController.controller('TimingController', function($scope, $filter, $q,$timeout,$interval,dataService,deviceService, cfg,_) {
    $scope.devices = {
        ids: [],
        all: [],
        interval: null,
        show: false,
        filter: true
    };

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
            /* if (timing.state === 'fulfilled') {
                $scope.timing = timing.value.data;
            } */

            // Success - zwaveData
            if (zwaveData.state === 'fulfilled') {
                //console.log(zwaveData.value)
                setData(zwaveData.value,timing.value.data,true);
                if(_.isEmpty($scope.devices.all)){
                    $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                    return;
                }
                $scope.devices.show = true;
                $scope.refreshZwaveData();
            }

        });

    };
    $scope.allSettled();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                var update = false;
                angular.forEach(response.data.update, function(v, k) {
                    // Get node ID from response
                    var findId = k.split('.')[1];
                    // Check if node ID is in the available devices
                    if($scope.devices.ids.indexOf(findId) > -1){
                        update = true;
                        //console.log('Updating nodeId: ',findId);
                        return;
                    }
                });
                // Update found - updating available devices
                if(update){
                  dataService.getApi('stat_url', null, true).then(function(timing) {
                    setData(response.data.joined,timing.data);
                  });
                }
            });
        };
        $scope.devices.interval = $interval(refresh, $scope.cfg.interval);
    };

     /**
     * Set filter
     * @param {boolean} val
     */
    $scope.setFilter = function(val) {
      $scope.devices.filter = (val);
      $interval.cancel($scope.devices.interval);
      $scope.allSettled();
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

    /**
     * TODO: complete function when back-end clear function is finished
     * Reset timing info
     * @param {text} spin
     */
    $scope.resetTimingInfo = function(spin) {
      $scope.toggleRowSpinner(spin);
      $interval.cancel($scope.devices.interval);
      $scope.allSettled();
      $timeout($scope.toggleRowSpinner, 1000);
  };

    /// --- Private functions --- ///
    /**
     * Set zwave data
     *  @param {object} ZWaveAPIData
     * @param {object} timing
     * @param {bool} reverse
     */
    function setData(ZWaveAPIData,timing) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            var type = deviceService.deviceType(node);
            var totalPackets = 0;
            var okPackets = 0;
            var lastPackets = '';
            var lastCommunication = deviceService.lastCommunication(node);
            var timingItems = timing[nodeId];

            // Packets
            if(timingItems){
              timingItems = timingItems.reverse();//(reverse ? timingItems.reverse() : timingItems);
              totalPackets = timingItems.length;
                okPackets = getOkPackets(timingItems);
                lastPackets = getLastPackets(timingItems);
            }

            if (angular.isDefined(timingItems)) {
                
            }

            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['type'] = type;
            obj['icon'] = $filter('getDeviceTypeIcon')(type);
            obj['updateTime'] = lastCommunication;
            obj['dateTime'] = $filter('getDateTimeObj')(lastCommunication);
            obj['totalPackets'] = totalPackets;
            obj['okPackets'] = okPackets;
            obj['lastPackets'] = lastPackets;
            var findIndex = _.findIndex($scope.devices.all, {rowId: obj.rowId});
            if(findIndex > -1){
                angular.extend($scope.devices.all[findIndex],obj);

            }else{
                $scope.devices.all.push(obj);
            }
            if($scope.devices.ids.indexOf(nodeId) === -1){
                $scope.devices.ids.push(nodeId);
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
        var dateTime;
        var color;
        var now = Math.round(+new Date()/1000);
        var oneDayAgo = now - 86400;
        var oneHourAgo = now - 3600;
        var oneHourOld;
       
        //angular.forEach(data.slice(-20), function(v, k) {
        angular.forEach(data, function(v, k) {
          v.date = parseInt(v.date);
         if($scope.devices.filter && v.date < oneDayAgo){
            return;
          }
          dateTime = $filter('getDateTimeObj')(v.date);
            deliveryTime = parseInt(v.deliveryTime);
            
            if (!v.delivered) {
                color = 'red';
            } else {
                color = (deliveryTime > 100 ? 'black' : 'green');
            }
            var displayTime = deliveryTime / 10;
            packets += '<span class="' + color + ' timing-packet hour-ago-'+(v.date > oneHourAgo)+'" title="'+ dateTime.date + ' ' + dateTime.time + '">' + (displayTime.toFixed() < 1 ? 1 : displayTime.toFixed()) + '</span>';
        });
        return packets;

    }
});