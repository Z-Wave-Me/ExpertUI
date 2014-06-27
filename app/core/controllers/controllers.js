/**
 * Application controllers and factories
 * @author Martin Vach
 */

/*** Controllers ***/
var appController = angular.module('appController', []);

// Base controller
appController.controller('BaseController', function($scope, $cookies, $filter, cfg, langFactory, langTransFactory) {
    // Global config
    $scope.cfg = cfg;

    // Lang settings
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
        // Is lang in language list?
        var lang_file = (cfg.lang_list.indexOf(lang) > -1 ? lang : cfg.lang);
        langFactory.get(lang_file).query(function(data) {
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
    // Navi time
    $scope.navTime = $filter('getCurrentTime');
    // Order by
    $scope.orderBy = function(field) {
        $scope.predicate = field;
        $scope.reverse = !$scope.reverse;
    };
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
appController.controller('SwitchController', function($scope, $http, $log, $filter, $timeout, DataFactory, DataTestFactory, cfg) {
    $scope.switches = [];
    $scope.rangeSlider = [];
    // Load data
    $scope.load = function(lang) {
        DataFactory.all('0').query(function(ZWaveAPIData) {
            var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
            // Loop throught devices
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                    return;
                }

                // Loop throught instances
                var cnt = 1;
                angular.forEach(node.instances, function(instance, instanceId) {
                    if (instanceId == 0 && node.instances.length > 1) {
                        return;
                    }
                    var hasBinary = 0x25 in instance.commandClasses;
                    var hasMultilevel = 0x26 in instance.commandClasses;
                    var switchAllValue = null;
                    var hasSwitchAll = (0x27 in instance.commandClasses) && (instanceId == 0);
                    if (hasSwitchAll) {
                        switchAllValue = instance.commandClasses[0x27].data.mode.value;
                    }

                    var ccId;
                    var deviceType = null;
                    if (hasMultilevel) {
                        ccId = 0x26;
                        deviceType = 'multilevel';
                    } else if (hasBinary) {
                        ccId = 0x25;
                        deviceType = 'binary';
                    } else {
                        return; // we skip instance if there is no SwitchBinary or SwitchMultilevel CCs
                    }

                    var genericType = ZWaveAPIData.devices[nodeId].data.genericType.value;
                    var specificType = ZWaveAPIData.devices[nodeId].data.specificType.value;


                    // Set object
                    var obj = {};
                    var level = $scope.updateLevel(instance.commandClasses[ccId].data.level, ccId);

                    obj['id'] = nodeId;
                    obj['cmd'] = instance.commandClasses[ccId].data.name + '.level';
                    obj['ccId'] = ccId;
                    obj['deviceType'] = deviceType;
                    obj['genericType'] = genericType;
                    obj['specificType'] = specificType;
                    obj['hasSwitchAll'] = hasSwitchAll;
                    obj['switchAllValue'] = switchAllValue;
                    obj['rowId'] = 'switch_' + nodeId + '_' + cnt;
                    obj['name'] = node.data.name;
                    obj['updateTime'] = instance.commandClasses[ccId].data.level.updateTime;
                    obj['invalidateTime'] = instance.commandClasses[ccId].data.level.invalidateTime;
                    obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Get()';
                    obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                    //obj['level'] = ZWaveAPIData.devices[nodeId].instances[instanceId].commandClasses[ccId].data.level;
                    obj['level'] = level.level_cont;
                    obj['levelColor'] = level.level_color;
                    obj['levelStatus'] = level.level_status;
                    obj['levelVal'] = level.level_val;
                    obj['urlToOff'] = 'devices[' + nodeId + '].instances[0].commandClasses[' + ccId + '].Set(0)';
                    obj['urlToOn'] = 'devices[' + nodeId + '].instances[0].commandClasses[' + ccId + '].Set(255)';
                    obj['urlToFull'] = 'devices[' + nodeId + '].instances[0].commandClasses[' + ccId + '].Set(99)';
                    obj['urlToSlide'] = 'devices[' + nodeId + '].instances[0].commandClasses[' + ccId + ']';
                    $scope.switches.push(obj);
                    $scope.rangeSlider.push(obj['range_' + nodeId] = level.level_val);
                    cnt++;
                });
            });
        });
    };

    // Load data
    $scope.load($scope.lang);

    // Refresh data
    var refresh = function() {
        DataFactory.all($filter('getTimestamp')).query(function(data) {
            //DataTestFactory.all('refresh_switches.json').query(function(data) {
            angular.forEach($scope.switches, function(v, k) {
                // Check for updated data
                if (v.cmd in data) {
                    $log.warn(v.cmd + ':' + v.id);//REM
                    var obj = data[v.cmd];
                    var level = $scope.updateLevel(obj, v.ccId);
                    var updateTime = $filter('isTodayFromUnix')(obj.updateTime);
                    var level_html = '<span style="color: ' + level.level_color + ';">' + level.level_cont + '</span> ';
                    if (level.level_status === 'on') {
                        level_html += ' <i class="fa fa-check fa-lg" style="color: #3c763d;"></i>';
                    } else {
                        level_html += ' <i class="fa fa-exclamation fa-lg" style="color: #a94442;"></i>';
                    }
                    $('#' + v.rowId + ' .row-time').html(updateTime).removeClass('is-updated-false');
                    $('#' + v.rowId + ' .row-level').html(level_html);
                    $('#update_time_tick').html($filter('getCurrentTime'));

                    $log.info('Updating:' + v.rowId + ' | At: ' + updateTime + ' | with: ' + level);//REM
                } else {
                    $log.warn(v.cmd + ': Nothing to update --- ' + $scope.lang);//REM
                }
            });
            //$log.debug('-----------');//REM
        });
        $timeout(refresh, cfg.interval);
    };
    $timeout(refresh, cfg.interval);

    // Store data from on remote server
    $scope.store = function(btn) {
        $(btn).attr('disabled', true);
        var url = $(btn).attr('data-store-url');
        DataFactory.store(url).query();
        $timeout(function() {
            $(btn).removeAttr('disabled');
        }, 1000);
    };

    // Store all data on remote server
    $scope.storeAll = function(id) {
        var btn = '#btn_update_' + id;
        var spinner = '.fa-spinner';
        $(btn).attr('disabled', true);
        $(btn).next(spinner).show();
        angular.forEach($scope.switches, function(v, k) {
            DataFactory.store(v.urlToStore).query();
        });
        $timeout(function() {
            $(btn).next(spinner).fadeOut();
            $(btn).removeAttr('disabled');
        }, 1000);
    };

    // Store data with switch all
    $scope.storeSwitchAll = function(btn) {
        $(btn).attr('disabled', true);
        var action_url = $(btn).attr('data-store-url');
        var url;
        angular.forEach($scope.switches, function(v, k) {
            url = 'devices[' + v['id'] + '].instances[0].commandClasses[0x27].' + action_url;
            if (v.hasSwitchAll) {
                DataFactory.store(url).query();
            }
        });
        $timeout(function() {
            $(btn).removeAttr('disabled');
        }, 1000);
    };

    $scope.sliderChange = function(cmd, index) {
        var val = $scope.rangeSlider[index];
        var url = cmd + '.Set(' + val + ')';
        DataFactory.store(url).query();
    };

    // Update level
    $scope.updateLevel = function(obj, ccId) {
        var level_cont;
        var level_color;
        var level_status = 'off';
        var level_val = 0;

        //var level = obj.value;
        var level = (angular.isDefined(obj.value) ? obj.value : null);

        if (level === '' || level === null) {
            level_cont = '?';
            level_color = 'gray';
        } else {
            if (level === false)
                level = 0;
            if (level === true)
                level = 255;
            level = parseInt(level, 10);
            if (level === 0) {
                level_cont = $scope._t('switched_off');
                level_color = '#a94442';
            } else if (level === 255 || level === 99) {
                level_status = 'on';
                level_cont = $scope._t('switched_on');
                level_color = '#3c763d';
                level_val = (level < 100 ? level : 99);
            } else {
                level_cont = level.toString() + ((ccId == 0x26) ? '%' : '');
                var lvlc_r = ('00' + parseInt(0x9F + 0x60 * level / 99).toString(16)).slice(-2);
                var lvlc_g = ('00' + parseInt(0x7F + 0x50 * level / 99).toString(16)).slice(-2);
                level_color = '#' + lvlc_r + lvlc_g + '00';
                level_status = 'on';
                level_val = (level < 100 ? level : 99);
            }
        }
        ;
        return {"level_cont": level_cont, "level_color": level_color, "level_status": level_status, "level_val": level_val};
    };
    /**
     * @todo Remove
     */
//    $http.get('storage/demo/switch.json').
//            success(function(data) {
//                $scope.data = data;
//            });
});

// Dimmer controller
appController.controller('DimmerController', function($scope, $http, $log) {
    $http.get('storage/demo/dimmer.json').
            success(function(data) {
                $scope.data = data;
            });
});

/**
 * Meters controller
 */
appController.controller('SensorsController', function($scope, $log, $filter, $timeout, DataFactory, DataTestFactory, cfg) {
    $scope.sensors = [];
    $scope.reset = function() {
        $scope.sensors = angular.copy([]);
    };

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
    // Load data
    $scope.load($scope.lang);

//    // Watch for lang change
//    $scope.$watch('lang', function() {
//        $scope.reset();
//        $scope.load($scope.lang);
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

                    $log.info('Updating:' + v.rowId + ' | At: ' + updateTime + ' | with: ' + level);//REM
                } else {
                    $log.warn(v.cmd + ': Nothing to update --- ' + $scope.lang);//REM
                }
            });
            //$log.debug('-----------');//REM
        });
        $timeout(refresh, cfg.interval);
    };
    $timeout(refresh, cfg.interval);



    // Store data from on remote server
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

    // Store all data on remote server
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

/**
 * Meters controller
 */
appController.controller('MetersController', function($scope, $log, $filter, $timeout, DataFactory, DataTestFactory, cfg) {
    $scope.meters = [];
    $scope.reset = function() {
        $scope.meters = angular.copy([]);
    };

    // Load data
    $scope.load = function(lang) {
        DataFactory.all('0').query(function(ZWaveAPIData) {
            //DataTestFactory.all('all.json').query(function(data) {
            $scope.updateTime = ZWaveAPIData.updateTime;
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

                    // Look for Meter - Loop throught 0x32 commandClasses
                    var meters = instance.commandClasses[0x32];
                    if (angular.isObject(meters)) {
                        angular.forEach(meters.data, function(meter, key) {
                            realEMeterScales = [0, 1, 3, 8, 9];// Not in [0, 1, 3, 8, 9] !== -1
                            var sensor_type = parseInt(key, 10);
                            if (isNaN(sensor_type)) {
                                return;
                            }
                            if (meter.sensorType.value == 1 && realEMeterScales.indexOf(sensor_type) === -1) {
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
                            if (ZWaveAPIData.devices[obj['id']].instances[instanceId].commandClasses[0x32].data.version.value < 2
                                    || !ZWaveAPIData.devices[obj['id']].instances[instanceId].commandClasses[0x32].data.resettable.value) {
                                obj['urlToReset'] = null;
                            } else {
                                obj['urlToReset'] = 'devices[' + obj['id'] + '].instances[0].commandClasses[50].Reset()';
                            }

                            $scope.meters.push(obj);
                        });
                    }

                });
            });
        });
    };

    $scope.load($scope.lang);

    // Refresh data
    var refresh = function() {
        DataFactory.all($filter('getTimestamp')).query(function(data) {
            //DataTestFactory.all('device_31_updated.json').query(function(data) {
            angular.forEach($scope.meters, function(v, k) {
                // Check for updated data
                if (v.cmd in data) {
                    var obj = data[v.cmd];
                    var level = '';
                    var updateTime;
                    var levelExt;
                    if (v.cmdId == 0x30) {
                        levelExt = (obj.level.value ? $scope._t('sensor_triggered') : $scope._t('sensor_idle'));
                        updateTime = $filter('isTodayFromUnix')(obj.level.updateTime);
                        // Set updated row
                        $('#' + v.rowId + ' .row-level').html(level);
                        $('#' + v.rowId + ' .row-time').html(updateTime).removeClass('is-updated-false');
                        $('#update_time_tick').html($filter('getCurrentTime'));
                        $log.info('Updating:' + v.rowId + ' | At: ' + updateTime + ' | with: ' + level);//REM
                    } else {
                        $log.warn(v.cmd + ': Nothing to update');//REM
                    }
                }
            });

        });
        $timeout(refresh, cfg.interval);
    };
    $timeout(refresh, cfg.interval);

    // Store data from meter on remote server
    $scope.store = function(btn) {
        // Is clicked on RESET?
        var action = $(btn).attr('data-action');
        if (action === 'reset' && !window.confirm($scope._t('are_you_sure_reset_meter'))) {
            return;
        }

        // Spinner
        var spinner = $(btn).parent('td').find('.fa-spinner');
        spinner.show();
        $(btn).attr('disabled', true);

        DataFactory.store($(btn).attr('data-store-url')).query();

        $timeout(function() {
            spinner.fadeOut();
            $(btn).removeAttr('disabled');
        }, 1000);
    };

    // Store all data from sensors on remote server
    $scope.storeAll = function(id) {
        var btn = '#btn_update_' + id;
        var spinner = '.fa-spinner';
        $(btn).attr('disabled', true);
        $(btn).next(spinner).show();
        angular.forEach($scope.meters, function(v, k) {
            DataFactory.store(v.urlToStore).query();
        });
        $timeout(function() {
            $(btn).next(spinner).fadeOut();
            $(btn).removeAttr('disabled');
        }, 1000);
    };
});

// Thermostat controller
appController.controller('ThermostatController', function($scope, $http, $log, $filter, $timeout, DataFactory, DataTestFactory, cfg) {
    $scope.thermostats = [];
    $scope.rangeSlider = [];

    // Load data
    $scope.load = function(lang) {
        DataFactory.all('0').query(function(ZWaveAPIData) {
            var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
            // Loop throught devices
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                    return;
                }

                // Loop throught instances
                var cnt = 1;
                angular.forEach(node.instances, function(instance, instanceId) {
                    if (instanceId == 0 && node.instances.length > 1) {
                        return;
                    }
                    // we skip devices without ThermostatSetPint AND ThermostatMode CC
                    if (!(0x43 in instance.commandClasses) && !(0x40 in instance.commandClasses)) {
                        return;
                    }
                    var ccId = 0x43;
                    var curThermMode = 1;

                    // Set object
                    var obj = {};
                    //var level = $scope.updateLevel(instance.commandClasses[ccId].data.level, ccId);

                    obj['id'] = nodeId;
                    obj['cmd'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.' + curThermMode;
                    obj['ccId'] = ccId;
                    obj['rowId'] = 'row_' + nodeId + '_' + cnt;
                    obj['name'] = node.data.name;
                    obj['level'] = instance.commandClasses[ccId].data[curThermMode].setVal.value;
                    obj['updateTime'] = instance.commandClasses[ccId].data[curThermMode].updateTime;
                    obj['invalidateTime'] = instance.commandClasses[ccId].data[curThermMode].invalidateTime;
                    obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                    obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                    $scope.thermostats.push(obj);
                    $scope.rangeSlider.push(obj['range_' + nodeId] = obj['level']);
                    cnt++;
                });
            });
        });
    };

    // Load data
    $scope.load($scope.lang);

    // Refresh data
    var refresh = function() {
        DataFactory.all($filter('getTimestamp')).query(function(data) {
            //DataTestFactory.all('refresh_switches.json').query(function(data) {
            angular.forEach($scope.thermostats, function(v, k) {
                // Check for updated data
                if (v.cmd in data) {
                    $log.warn(v.cmd + ':' + v.id);//REM
                    var obj = data[v.cmd];
                    var level = obj.setVal.value;
                    var updateTime = $filter('isTodayFromUnix')(obj.updateTime);
                    $('#' + v.rowId + ' .row-time').html(updateTime).removeClass('is-updated-false');
                    $('#' + v.rowId + ' .row-level .level-val').html(level);
                    $('#update_time_tick').html($filter('getCurrentTime'));

                    $log.info('Updating:' + v.rowId + ' | At: ' + updateTime + ' | with: ' + level);//REM
                } else {
                    $log.warn(v.cmd + ': Nothing to update --- ');//REM
                }
            });
            //$log.debug('-----------');//REM
        });
        $timeout(refresh, cfg.interval);
    };
    $timeout(refresh, cfg.interval);

    // Change temperature on click
    $scope.tempChange = function(cmd, index, type) {
        var val = $scope.rangeSlider[index];
        var min = parseInt($scope.cfg.thermostat_range.min, 10);
        var max = parseInt($scope.cfg.thermostat_range.max, 10);
        var count = (type === '-' ? val - 1 : val + 1);
        if (count < min) {
            count = min;
        }
        if (count > max) {
            count = max;
        }
        $scope.rangeSlider[index] = count;
        var url = cmd + '.Set(1,' + count + ')';
        console.log('Sending value: ' + $scope.rangeSlider[index]);
        DataFactory.store(url).query();
    };

    // Change temperature after slider handle
    $scope.sliderChange = function(cmd, index) {
        var count = parseInt($scope.rangeSlider[index]);
        var min = parseInt($scope.cfg.thermostat_range.min, 10);
        var max = parseInt($scope.cfg.thermostat_range.max, 10);
        if (count < min) {
            count = min;
        }
        if (count > max) {
            count = max;
        }
        $scope.rangeSlider[index] = count;
        var url = cmd + '.Set(1,' + count + ')';
        console.log(url);
        DataFactory.store(url).query();
    };

    /**
     * @todo: remove
     */
//    $http.get('storage/demo/thermostat.json').
//            success(function(data) {
//                $scope.data = data;
//            });
});

// Locks controller
appController.controller('LocksController', function($scope, $http, $log, $filter, $timeout, DataFactory, DataTestFactory, cfg) {

    $scope.locks = [];

    // Load data
    $scope.load = function(lang) {
        DataFactory.all('0').query(function(ZWaveAPIData) {
            var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
            var doorLockCCId = 0x62;
            // Loop throught devices
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                    return;
                }

                // Loop throught instances
                var cnt = 1;
                angular.forEach(node.instances, function(instance, instanceId) {
                    if (instanceId == 0 && node.instances.length > 1) {
                        return;
                    }
                    // we don't want devices without DoorLock CC
                    if (!(doorLockCCId in instance.commandClasses)) {
                        return;
                    }

                    // CC gui
                    var mode = instance.commandClasses[doorLockCCId].data.mode.value;
                    if (mode === '' || mode === null) {
                        mode = 0;
                    }

                    var ccId = 98;

                    // Set object
                    var obj = {};
                    //var level = $scope.updateLevel(instance.commandClasses[ccId].data.level, ccId);

                    obj['id'] = nodeId;
                    obj['cmd'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.mode';
                    obj['ccId'] = doorLockCCId;
                    obj['rowId'] = 'row_' + nodeId + '_' + cnt;
                    obj['name'] = node.data.name;
                    obj['level'] = mode;
                    obj['updateTime'] = instance.commandClasses[ccId].data.mode.updateTime;
                    obj['invalidateTime'] = instance.commandClasses[ccId].data.mode.invalidateTime;
                    obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                    obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                    $scope.locks.push(obj);
                    cnt++;
                });
            });
        });
    };

    // Load data
    $scope.load($scope.lang);

    // Refresh data
    var refresh = function() {
        DataFactory.all($filter('getTimestamp')).query(function(data) {
          //DataTestFactory.all('refresh_switches.json').query(function(data) {
            angular.forEach($scope.locks, function(v, k) {
                // Check for updated data
                if (v.cmd in data) {
                    var obj = data[v.cmd];
                    var level = $filter('lockStatus')(obj.value);
                    var updateTime = $filter('isTodayFromUnix')(obj.updateTime);
                    $('#' + v.rowId + ' .row-time').html(updateTime).removeClass('is-updated-false');
                    $('#' + v.rowId + ' .row-level').html(level);
                    $('#update_time_tick').html($filter('getCurrentTime'));

                    $log.info('Updating:' + v.rowId + ' | At: ' + updateTime + ' | with: ' + level);//REM
                } else {
                    $log.warn(v.cmd + ': Nothing to update --- ');//REM
                }
            });
            //$log.debug('-----------');//REM
        });
        $timeout(refresh, cfg.interval);
    };
    $timeout(refresh, cfg.interval);

    // Store data from on remote server
    $scope.store = function(btn) {
        $(btn).attr('disabled', true);
        var url = $(btn).attr('data-store-url');
        DataFactory.store(url).query();
        console.log(btn, url);
        $timeout(function() {
            $(btn).removeAttr('disabled');
        }, 1000);
    };

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
