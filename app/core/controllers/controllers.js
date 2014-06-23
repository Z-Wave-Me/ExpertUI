/**
 * Application controllers and factories
 * @author Martin Vach
 */
//var app = angular.module("MyApp", ["ngResource"]);

/*** Controllers ***/
var appController = angular.module('appController', []);

// Base controller
appController.controller('BaseController', function($scope, $cookies, cfg, langFactory, langTransFactory) {
     $scope.lang_list = cfg.lang_list;
    // Set language
    $scope.lang = (angular.isDefined($cookies.lang) ? $cookies.lang : cfg.lang);
    $('.current-lang').html($scope.lang);  
    $scope.changeLang = function(lang) {
        $cookies.lang = lang;
        $scope.lang = lang;
    };
    // Load language files
    $scope.loadLang = function(lang) {
        langFactory.get(lang).query(function(data) {
            $scope.languages = data;
            return;
        });
    };
    // Get language lines
    $scope._t = function(key) {
        return langTransFactory.get(key, $scope.languages);
    };
    // Watch for lang change
    $scope.$watch('lang', function() {
        $('.current-lang').html($scope.lang);
        $scope.loadLang($scope.lang);
    });
});

// Test controller
appController.controller('TestController', function($scope, $routeParams, cfg, $http, $log, DataFactory, DataTestFactory, Post, $timeout, $window) {
    $scope.timeInMs = 0;
    var countUp = function() {
        $scope.timeInMs += 1;
        $timeout(countUp, 1000);
    };
    $timeout(countUp, 1000);
    // Slider
    $scope.demo6 = {
        valueA: 5000,
        valueB: 3000
    };
});


// Home controller
appController.controller('HomeController', function($scope) {
    $scope.data = 'The HomeController content comes here';

});

// Switch controller
appController.controller('SwitchController', function($scope, $http, $log) {
    $scope.witches = [];
    $('#update_time_tick').html($filter('getCurrentTime'));
    DataFactory.all('0').query(function(data) {
        $scope.controllerId = data.controller.data.nodeId.value;

        // Loop throught devices
        angular.forEach(data.devices, function(nodeId, node) {
            if (nodeId == 255 || nodeId == $scope.controllerId || node.data.isVirtual.value) {
                return;
            }

            // Loop throught instances
            angular.forEach(node.instances, function(instance, instanceId) {
                if (instanceId == 0 && node.instances.length > 1) {
                    return;
                }

                var hasBinary = 0x25 in instance.commandClasses;
                var hasMultilevel = 0x26 in instance.commandClasses;
                var hasSwitchAll = (0x27 in instance.commandClasses) && (instanceId == 0);
                var ccId;

                if (hasMultilevel)
                    ccId = 0x26;
                else if (hasBinary)
                    ccId = 0x25;
                else
                    return; // we skip instance if there is no SwitchBinary or SwitchMultilevel CCs

                $log.info(instanceId);
                return;
                // ---------------------------------------- this is not finished --------------------------------------------//
                // Look for SensorBinary - Loop throught 0x30 commandClasses
                var sensorBinary = instance.commandClasses[0x30];
                if (angular.isObject(sensorBinary)) {
                    angular.forEach(sensorBinary.data, function(val, key) {
                        // Not a sensor type
                        var sensor_type = parseInt(key, 10);
                        if (isNaN(sensor_type)) {
                            return;
                        }
                        // Set object
                        var obj = {};
                        obj['id'] = k;
                        obj['cmd'] = sensorBinary.data.name + '.' + val.name;
                        obj['cmdId'] = '48';
                        obj['rowId'] = sensorBinary.name + '_' + val.name + '_' + k;
                        obj['name'] = device.data.name;
                        obj['type'] = sensorBinary.name;
                        obj['purpose'] = val.sensorTypeString.value;
                        obj['level'] = (val.level.value ? 'Triggered' : 'Idle');
                        obj['levelExt'] = null;
                        obj['invalidateTime'] = val.invalidateTime;
                        obj['updateTime'] = val.updateTime;
                        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[0].commandClasses[48].Get()';
                        // Push to sensors
                        $scope.sensors.push(obj);
                    });
                }

            });
        });
    });
    $http.get('storage/demo/switch.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Dimmer controller
appController.controller('DimmerController', function($scope, $http, $log) {
    $http.get('storage/demo/dimmer.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Sensors controller
appController.controller('SensorsController', function($scope, $http, $log, $filter, $timeout, DataFactory, DataTestFactory, cfg) {
    $scope.sensors = [];
    $scope.reset = function() {
        $scope.sensors = angular.copy([]);
    };
    $('#update_time_tick').html($filter('getCurrentTime'));
    // Load data
    $scope.load = function(lang) {
        DataFactory.all('0').query(function(data) {
            //DataTestFactory.all('all.json').query(function(data) {
            $scope.updateTime = data.updateTime;
            $scope.controllerId = data.controller.data.nodeId.value;

            // Loop throught devices
            angular.forEach(data.devices, function(device, k) {
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
                            // Set object
                            var obj = {};
                            obj['id'] = k;
                            obj['cmd'] = sensorBinary.data.name + '.' + val.name;
                            obj['cmdId'] = '48';
                            obj['rowId'] = sensorBinary.name + '_' + val.name + '_' + k;
                            obj['name'] = device.data.name;
                            obj['type'] = sensorBinary.name;
                            obj['purpose'] = val.sensorTypeString.value;
                            obj['level'] = (val.level.value ? $scope._t('sensor_triggered') : $scope._t('sensor_idle'));
                            obj['levelExt'] = null;
                            obj['invalidateTime'] = val.invalidateTime;
                            obj['updateTime'] = val.updateTime;
                            obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                            obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[0].commandClasses[48].Get()';
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
                            // Check for commandClasses data
                            var obj = {};
                            obj['id'] = k;
                            obj['cmd'] = sensorMultilevel.data.name + '.' + val.name;
                            obj['cmdId'] = '49';
                            obj['rowId'] = sensorMultilevel.name + '_' + val.name + '_' + k;
                            obj['name'] = device.data.name;
                            obj['type'] = sensorMultilevel.name;
                            obj['purpose'] = val.sensorTypeString.value;
                            obj['level'] = val.val.value;
                            obj['levelExt'] = val.scaleString.value;
                            obj['invalidateTime'] = val.invalidateTime;
                            obj['updateTime'] = val.updateTime;
                            obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                            obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[0].commandClasses[49].Get()';
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
                            var obj = {};
                            obj['id'] = k;
                            obj['cmd'] = meters.data.name + '.' + meter.name;
                            obj['cmdId'] = '50';
                            obj['rowId'] = meters.name + '_' + meter.name + '_' + k;
                            obj['name'] = device.data.name;
                            obj['type'] = meters.name;
                            obj['purpose'] = meter.sensorTypeString.value;
                            obj['level'] = meter.val.value;
                            obj['levelExt'] = meter.scaleString.value;
                            obj['invalidateTime'] = meter.invalidateTime;
                            obj['updateTime'] = meter.updateTime;
                            obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                            obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[0].commandClasses[50].Get()';
                            $scope.sensors.push(obj);
                        });
                    }

                });
            });
        });
    };

    // Watch for lang change
//   $scope.$watch('lang', function() {
//        $scope.reset();
        $scope.load($scope.lang);
//    });
    
    // Refresh data 
    var refresh = function() {
        DataFactory.all($filter('getTimestamp')).query(function(data) {
            //DataTestFactory.all('device_31_updated.json').query(function(data) {
            angular.forEach($scope.sensors, function(v, k) {
                // Check for updated data
                if (v.cmd in data) {
                    var obj = data[v.cmd];
                    var level = '';
                     var updateTime;
                    // var date = $filter('isTodayFromUnix')(data.updateTime);
                    var levelExt;
                    if (v.cmdId == 0x30) {
                        levelExt = (obj.level.value ? $scope._t('sensor_triggered') : $scope._t('sensor_idle'));
                        updateTime = $filter('isTodayFromUnix')(obj.level.updateTime);
                    } else {
                        level = obj.val.value;
                        levelExt = obj.scaleString.value;
                        updateTime = $filter('isTodayFromUnix')(obj.val.updateTime);
                    }

                    // Set updated row
                    $('#' + v.rowId + ' .row-level').html(level);
                     $('#' + v.rowId + ' .row-time').html(updateTime).removeClass('is-updated-false');
                    $('#update_time_tick').html($filter('getCurrentTime'));

                    $log.info('Updating:' + v.rowId + ' | At: ' +updateTime + ' | with: ' + level);//REM
                } else {
                    $log.warn(v.cmd + ': Nothing to update --- ' + $scope.lang);//REM
                }
            });
            //$log.debug('-----------');//REM
        });
        $timeout(refresh, cfg.interval);
    };
    $timeout(refresh, cfg.interval);
    
     // Order by
    $scope.orderBy = function(field) {
        $scope.predicate = field;
        $scope.reverse = !$scope.reverse;
    };

    // Store data from sensor on remote server
    $scope.store = function(id) {
        var btn = '#btn_update_' + id;
        var spinner = '.fa-spinner';
        $(btn).attr('disabled', true);
        $(btn).next(spinner).show();
        DataFactory.store($(btn).attr('data-store-url')).query();
        $timeout(function() {
            $(btn).next(spinner).fadeOut();
            $(btn).removeAttr('disabled');
        }, 1000);
    };

    // Store all data from sensors on remote server
    $scope.storeAll = function(id) {
        var btn = '#btn_update_' + id;
        var spinner = '.fa-spinner';
        $(btn).attr('disabled', true);
        $(btn).next(spinner).show();
        angular.forEach($scope.sensors, function(v, k) {
            DataFactory.store(v.urlToStore).query();
        });
        $timeout(function() {
            $(btn).next(spinner).fadeOut();
            $(btn).removeAttr('disabled');
        }, 1000);
    };
});

// Meters controller
appController.controller('MetersController', function($scope, $http, $log) {
    $http.get('storage/demo/meters.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Thermostat controller
appController.controller('ThermostatController', function($scope, $http, $log) {
    $scope.range = {
        min: 15,
        max: 25
    };
    $http.get('storage/demo/thermostat.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Locks controller
appController.controller('LocksController', function($scope, $http, $log) {
    $http.get('storage/demo/lock.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Status controller
appController.controller('StatusController', function($scope, $http, $log) {
    $http.get('storage/demo/status.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Battery controller
appController.controller('BatteryController', function($scope, $http, $log) {
    $http.get('storage/demo/battery.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Type controller
appController.controller('TypeController', function($scope, $http, $log) {
    $http.get('storage/demo/type.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Firmware controller
appController.controller('FirmwareController', function($scope, $routeParams, $log, FirmwareFactory) {
    $log.info('FirmwareController - starting up!');
    $scope.data = FirmwareFactory.all.query();
    $log.info($scope.data);
});

// Security controller
appController.controller('SecurityController', function($scope, $http, $log) {
    $http.get('storage/demo/security.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Assoc controller
appController.controller('AssocController', function($scope, $http, $log) {
    $http.get('storage/demo/assoc.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Wakeup controller
appController.controller('WakeupController', function($scope, $http, $log) {
    $http.get('storage/demo/wakeup.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Protection controller
appController.controller('ProtectionController', function($scope, $http, $log) {
    $http.get('storage/demo/protection.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Configuration controller
appController.controller('ConfigurationController', function($scope, $http, $routeParams, $log) {
    var device_id = parseInt($routeParams.device_id);
    $scope.device_id = device_id;
    $scope.message = '';
    $http.get('storage/demo/configuration.json').
            success(function(data) {
                $scope.data = data;
            });
    $http.get('storage/demo/devices.json').
            success(function(data) {
                $scope.devices = data;
            });
    $log.info(device_id);


});

// Controll controller
appController.controller('ControllController', function($scope, $http, $log) {
    $http.get('storage/demo/controll.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Routing controller
appController.controller('RoutingController', function($scope, $http, $log) {
    $http.get('storage/demo/routing.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Reorganization controller
appController.controller('ReorganizationController', function($scope, $http, $log) {
    $http.get('storage/demo/reorganization.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Statistics controller
appController.controller('StatisticsController', function($scope, $http, $log) {
    $http.get('storage/demo/statistics.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Controller controller
appController.controller('ControllerController', function($scope, $http, $log) {
    $http.get('storage/demo/controller.json').
            success(function(data) {
                $scope.data = data;
            });
});

// Commands controller
appController.controller('CommandsController', function($scope, $http, $log) {
    $http.get('storage/demo/commands.json').
            success(function(data) {
                $scope.data = data;
            });
    $http.get('storage/demo/devices.json').
            success(function(data) {
                $scope.devices = data;
            });
    $log.info($scope.devices);
});
