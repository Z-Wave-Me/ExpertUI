/**
 * @overview This controller renders and handles meters.
 * @author Martin Vach
 */

/**
 * Allows to control different kind of meters.
 * @class MetersController
 *
 */
appController.controller('MetersController', function($scope, $filter, $timeout,$interval,dataService, cfg,_) {
    $scope.meters = {
        ids: [],
        all: [],
        interval: null,
        show: false
    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.meters.interval);
    });

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            if(_.isEmpty($scope.meters.all)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            $scope.meters.show = true;
            $scope.refreshZwaveData();
        }, function(error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                var update = false;
                angular.forEach(response.data.update, function(v, k) {
                    // Get node ID from response
                    var findId = k.split('.')[1];
                    // Check if node ID is in the available devices
                    if($scope.meters.ids.indexOf(findId) > -1){
                        update = true;
                        //console.log('Updating nodeId: ',findId);
                        return;
                    }
                });
                // Update found - updating available devices
                if(update){
                    setData(response.data.joined);
                }
            });
        };
        $scope.meters.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Update meter
     * @param {string} url
     */
    $scope.updateMeter = function(url) {
        $scope.toggleRowSpinner(url);
        dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + url);
        });
    };

    /**
     * Update all meters
     * @param {string} id
     * @param {string} urlType
     */
    $scope.updateAllMeters = function(id,urlType) {
        var lastItem = _.last($scope.meters.all);
        $scope.toggleRowSpinner(id);
        angular.forEach($scope.meters.all, function(v, k) {
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
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        $scope.controllerId = ZWaveAPIData.controller.data.nodeId.value;

        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(device, k) {
            if (k == 255 || k == $scope.controllerId || device.data.isVirtual.value) {
                return false;
            }
            // Loop throught instances
            angular.forEach(device.instances, function(instance, instanceId) {
                if (instanceId == 0 && device.instances.length > 1) {
                    return;
                }

                // Command Class Meter (0x32/50)
                var meters = instance.commandClasses[0x32];
                if (angular.isObject(meters)) {
                    angular.forEach(meters.data, function(meter, key) {
                        // Z-Wave differentiates different meter types and different meter scales.
                        realEMeterScales = [0, 1, 3, 8, 9];
                        var scaleId = parseInt(key, 10);
                        if (isNaN(scaleId)) {
                            return;
                        }
                        if (meter.sensorType.value == 1 && realEMeterScales.indexOf(scaleId) === -1) {
                            return; // filter only for eMeters
                        }
                        /*if (meter.sensorType.value > 1) {
                            return; //  gas and water have real meter scales
                        }*/

                        var obj = {};
                        obj['id'] = k;
                        obj['idSort'] = $filter('zeroFill')(k);
                        obj['iId'] = instanceId;
                        obj['cmd'] = meters.name + '.' + meter.name;
                        obj['cmdId'] = 0x30;
                        obj['rowId'] = meters.name + '_' + meter.name + '_' + k;
                        obj['name'] = $filter('deviceName')(k, device);
                        obj['type'] = meters.name;
                        obj['purpose'] = meter.sensorTypeString.value;
                        obj['level'] = meter.val.value;
                        obj['levelExt'] = meter.scaleString.value;
                        obj['invalidateTime'] = meter.invalidateTime;
                        obj['updateTime'] = meter.updateTime;
                        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                        obj['dateTime'] = $filter('getDateTimeObj')(meter.updateTime,obj['invalidateTime']);
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[50].Get()';
                        obj['cmdToUpdate'] = 'devices.' + k + '.instances.' + instanceId + '.commandClasses.' + 0x32 + '.data.' + scaleId;
                        if (ZWaveAPIData.devices[obj['id']].instances[instanceId].commandClasses[0x32].data.version.value < 2
                                || !ZWaveAPIData.devices[obj['id']].instances[instanceId].commandClasses[0x32].data.resettable.value) {
                            obj['urlToReset'] = null;
                        } else {
                            obj['urlToReset'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[50].Reset()';
                        }

                        var findIndex = _.findIndex($scope.meters.all, {rowId: obj.rowId});
                        if(findIndex > -1){
                            angular.extend($scope.meters.all[findIndex],obj);

                        }else{
                            $scope.meters.all.push(obj);
                        }
                        if($scope.meters.ids.indexOf(k) === -1){
                            $scope.meters.ids.push(k);
                        }
                    });
                }

            });
        });
    }
});