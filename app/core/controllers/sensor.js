/**
 * SensorsController
 * @author Martin Vach
 */
appController.controller('SensorsController', function($scope, $filter, dataService) {
    $scope.sensors = [];
    $scope.reset = function() {
        $scope.sensors = angular.copy([]);
    };

    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
                refreshData(data);
            });
        });
    };
    // Load data
    $scope.load($scope.lang);

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    // Store data from on remote server
    $scope.store = function(cmd) {
        dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
    };

    // Store all data on remote server
    $scope.storeAll = function(id) {
        var btn = '#btn_update_' + id;
        angular.forEach($scope.sensors, function(v, k) {
            dataService.runCmd(v.urlToStore);
        });
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        $scope.updateTime = ZWaveAPIData.updateTime;
        $scope.controllerId = ZWaveAPIData.controller.data.nodeId.value;

        // Loop throught devices
        var cnt = 0;
        angular.forEach(ZWaveAPIData.devices, function(device, k) {
            if (k == 255 || k == $scope.controllerId || device.data.isVirtual.value) {
                return false;
            }
            // Loop throught instances

            angular.forEach(device.instances, function(instance, instanceId) {
                if (instanceId == 0 && device.instances.length > 1) {
                    return;
                }
                // Look for SensorBinary - Loop throught 0x30 commandClasses
                var sensorBinary = instance.commandClasses[0x30];

                if (angular.isObject(sensorBinary)) {
                    angular.forEach(sensorBinary.data, function(val, key) {
                        // Not a sensor type
                        var sensor_type = parseInt(key, 10);
                        if (isNaN(sensor_type)) {
                            return;
                        }
                        var devName = $filter('deviceName')(k, device);
                        // Set object
                        var obj = {};
                        obj['id'] = k;
                        obj['iId'] = instanceId;
                        obj['cmd'] = sensorBinary.data.name + '.' + val.name;
                        obj['cmdId'] = '48';
                        obj['rowId'] = sensorBinary.name + '_' + k + '_' + instanceId + '_' + sensor_type;
                        obj['name'] = devName;
                        obj['type'] = sensorBinary.name;
                        obj['purpose'] = val.sensorTypeString.value;
                        obj['level'] = (val.level.value ? '<span class="sensor-triggered">' + $scope._t('sensor_triggered') + '</span>' : $scope._t('sensor_idle'));
                        obj['html'] = true;
                        obj['levelExt'] = null;
                        obj['invalidateTime'] = val.invalidateTime;
                        obj['updateTime'] = val.updateTime;
                        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[48].Get()';
                        obj['cmdToUpdate'] = 'devices.' + obj['id'] + '.instances.' + instanceId + '.commandClasses.48.data.' + sensor_type;
                        // Push to sensors
                        $scope.sensors.push(obj);
                    });
                }


                // Look for SensorMultilevel - Loop throught 0x31 commandClasses
                var sensorMultilevel = instance.commandClasses[0x31];
                if (angular.isObject(sensorMultilevel)) {
                    angular.forEach(sensorMultilevel.data, function(val, key) {
                        // Not a sensor type
                        var sensor_type = parseInt(key, 10);
                        if (isNaN(sensor_type)) {
                            return;
                        }

                        obj = instance.commandClasses[0x31];
                        var devName = $filter('deviceName')(k, device);
                        // Check for commandClasses data
                        var obj = {};
                        obj['id'] = k;
                        obj['iId'] = instanceId;
                        obj['cmd'] = sensorMultilevel.data.name + '.' + val.name;
                        obj['cmdId'] = '49';
                        obj['rowId'] = sensorMultilevel.name + '_' + k + '_' + instanceId + '_' + sensor_type;
                        obj['name'] = devName;
                        obj['type'] = sensorMultilevel.name;
                        obj['purpose'] = val.sensorTypeString.value;
                        obj['level'] = val.val.value;
                        obj['levelExt'] = val.scaleString.value;
                        obj['invalidateTime'] = val.invalidateTime;
                        obj['updateTime'] = val.updateTime;
                        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[49].Get()';
                        obj['cmdToUpdate'] = 'devices.' + obj['id'] + '.instances.' + instanceId + '.commandClasses.49.data.' + sensor_type;
                        // Push to sensors
                        $scope.sensors.push(obj);
                    });
                }

                // Look for Meter - Loop throught 0x32 commandClasses
                var meters = instance.commandClasses[0x32];
                if (angular.isObject(meters)) {
                    angular.forEach(meters.data, function(meter, key) {
                        realEMeterScales = [0, 1, 3, 8, 9];// Not in [0, 1, 3, 8, 9] !== -1
                        var sensor_type = parseInt(key, 10);
                        if (isNaN(sensor_type)) {
                            return;
                        }

                        if (meter.sensorType.value == 1 && realEMeterScales.indexOf(sensor_type) != -1) {
                            return; // filter only for eMeters
                        }
                        if (meter.sensorType.value > 1) {
                            return; //  gas and water have real meter scales
                        }
                        var devName = $filter('deviceName')(k, device);
                        var obj = {};

                        obj['id'] = k;
                        obj['iId'] = instanceId;
                        obj['cmd'] = meters.data.name + '.' + meter.name;
                        obj['cmdId'] = '50';
                        obj['rowId'] = meters.name + '_' + k + '_' + instanceId + '_' + sensor_type;
                        obj['name'] = devName;
                        obj['type'] = meters.name;
                        obj['purpose'] = meter.sensorTypeString.value;
                        obj['level'] = meter.val.value;
                        obj['levelExt'] = meter.scaleString.value;
                        obj['invalidateTime'] = meter.invalidateTime;
                        obj['updateTime'] = meter.updateTime;
                        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[50].Get()';
                        obj['cmdToUpdate'] = 'devices.' + obj['id'] + '.instances.' + instanceId + '.commandClasses.50.data.' + sensor_type;
                        $scope.sensors.push(obj);
                    });
                }

                var alarmSensor = instance.commandClasses[0x9c];
                if (angular.isObject(alarmSensor)) {
                    //return;
                    angular.forEach(alarmSensor.data, function(val, key) {
                        // Not a sensor type
                        var sensor_type = parseInt(key, 10);
                        if (isNaN(sensor_type)) {
                            return;
                        }
                        var devName = $filter('deviceName')(k, device);
                        // Set object
                        var obj = {};
                        obj['id'] = k;
                        obj['iId'] = instanceId;
                        obj['cmd'] = alarmSensor.data.name + '.' + val.name;
                        obj['cmdId'] = '0x9c';
                        obj['rowId'] = alarmSensor.name + '_' + k + '_' + instanceId + '_' + sensor_type;
                        obj['name'] = devName;
                        obj['type'] = alarmSensor.name;
                        obj['purpose'] = val.typeString.value;
                        obj['level'] = (val.sensorState.value ? '<span class="sensor-triggered">' + $scope._t('sensor_triggered') + '</span>' : $scope._t('sensor_idle'));
                        obj['html'] = true;
                        obj['levelExt'] = null;
                        obj['invalidateTime'] = val.invalidateTime;
                        obj['updateTime'] = val.updateTime;
                        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[156].Get()';
                        obj['cmdToUpdate'] = 'devices.' + obj['id'] + '.instances.' + instanceId + '.commandClasses.156.data.' + sensor_type;
                        // Push to sensors
                        $scope.sensors.push(obj);
                    });
                }

            });

        });
    }
    /**
     * Refresh zwave data
     */
    function refreshData(data) {
        angular.forEach($scope.sensors, function(v, k) {
            // Check for updated data
            if (v.cmdToUpdate in data.update) {
                var obj = data.update[v.cmdToUpdate];
                var level = '';
                var updateTime = 0;
                var invalidateTime = 0;
                if (v.cmdId == 0x30) {
                    level = (obj.level.value ? '<span class="sensor-triggered">' + $scope._t('sensor_triggered') + '</span>' : $scope._t('sensor_idle'));
                    updateTime = obj.level.updateTime;
                    invalidateTime = obj.level.invalidateTime;

                } else if (v.cmdId == 0x9c) {
                    level = (obj.sensorState.value ? '<span class="sensor-triggered">' + $scope._t('sensor_triggered') + '</span>' : $scope._t('sensor_idle'));
                    updateTime = obj.sensorState.updateTime;
                    invalidateTime = obj.sensorState.invalidateTime;

                }
                else {
                    level = obj.val.value;
                    updateTime = obj.updateTime;
                    invalidateTime = obj.invalidateTime;

                }

                // Update row
                $('#' + v.rowId + ' .row-level').html((level == null ? '' : level) + ' &nbsp;');
                $('#' + v.rowId + ' .row-time').html($filter('isTodayFromUnix')(updateTime));
                if (updateTime > invalidateTime) {
                    $('#' + v.rowId + ' .row-time').removeClass('is-updated-false');
                } else {
                    $('#' + v.rowId + ' .row-time').addClass('is-updated-false');
                }
                //console.log('Updating: ' + v.rowId + ' | At: ' + $filter('isTodayFromUnix')(updateTime) + ' | with: ' + level);//REM

            }
        });
    }
});