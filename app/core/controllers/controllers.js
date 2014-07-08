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
appController.controller('TestController', function($scope, $routeParams, cfg, $http, $log, DataFactory, DataTestFactory, $timeout, XmlFactory) {
    $scope.timeInMs = 0;
    $scope.dataSet;
    var countUp = function() {
        $scope.timeInMs += 1;
        $timeout(countUp, 1000);
    };
    $timeout(countUp, 1000);

    //This is the callback function
    setData = function(data) {
        $scope.dataSet = data;
        console.log(data.DeviceClasses);
        angular.forEach(data.DeviceClasses.Generic, function(val, key) {
            var obj = {};
            var langs = {
                "en": "0",
                "de": "1",
                "ru": "2"
            };
            var langId = langs['en'];
            obj['id'] = parseInt(val._id);
            obj['title'] = val.name.lang[langId].__text;
            console.log(obj);
            //console.log(val.name.lang);
//              //console.log(parseInt(val._id));
//             //yourNumber.toString(16);
//             if(parseInt(val._id) == 3){
//                  console.log(val.name.lang[0].__text);
//             }

            //console.log(val.name.lang[2].__text);
//             angular.forEach(val, function(v, k) {
//            
//             });
        });
        //console.log($scope.dataSet);
    };
    XmlFactory.get(setData, 'storage/DeviceClasses.xml');


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
});

// Status controller
appController.controller('StatusController', function($scope, $http, $log, $filter, $timeout, DataFactory, DataTestFactory, cfg) {

    $scope.statuses = [];
    $scope.interviews = [];

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

                var basicType = node.data.basicType.value;
                var genericType = node.data.genericType.value;
                var specificType = node.data.specificType.value;
                var isListening = node.data.isListening.value;
                var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
                var hasWakeup = 0x84 in node.instances[0].commandClasses;
                var hasBattery = 0x80 in node.instances[0].commandClasses;

                // Update
                var node = ZWaveAPIData.devices[nodeId];
                var lastReceive = parseInt(node.data.lastReceived.updateTime, 10) || 0;
                var lastSend = parseInt(node.data.lastSend.updateTime, 10) || 0;
                var lastCommunication = (lastSend > lastReceive) ? lastSend : lastReceive;
                var isFailed = node.data.isFailed.value;
                var isAwake = node.data.isAwake.value;
                var prefixD = 'devices.' + nodeId + '.data.';
                var prefixIC = 'devices.' + nodeId + '.instances.0.commandClasses';
                var bindPath = prefixD + 'isFailed,' + prefixD + 'isAwake,' + prefixD + 'lastSend,' + prefixD + 'lastReceived,' + prefixD + 'queueLength,devices.' + nodeId + '.instances[*].commandClasses[*].data.interviewDone,' + prefixIC + '.' + 0x84 + '.data.lastWakeup,' + prefixIC + '.' + 0x84 + '.data.lastSleep,' + prefixIC + '.' + 0x84 + '.data.interval,' + prefixIC + '.' + 0x80 + '.data.last';
                $scope.updateDeviceInfo(ZWaveAPIData, nodeId, basicType, genericType, specificType, isFLiRS, hasWakeup, hasBattery, isListening, bindPath);
            });
        });
    };


    $scope.updateDeviceInfo = function(ZWaveAPIData, nodeId, basicType, genericType, specificType, isFLiRS, hasWakeup, hasBattery, isListening, bindPath) {
        //var nodeId = $(this).attr('device');
        var node = ZWaveAPIData.devices[nodeId];
        var lastReceive = parseInt(node.data.lastReceived.updateTime, 10) || 0;
        var lastSend = parseInt(node.data.lastSend.updateTime, 10) || 0;
        var lastCommunication = (lastSend > lastReceive) ? lastSend : lastReceive;
        var isFailed = node.data.isFailed.value;
        var isAwake = node.data.isAwake.value;

        var sleepingSince = 0;
        var lastWakeup = 0;
        var interval = 0;

        if (!isListening && hasWakeup) {
            sleepingSince = parseInt(node.instances[0].commandClasses[0x84].data.lastSleep.value, 10);
            lastWakeup = parseInt(node.instances[0].commandClasses[0x84].data.lastWakeup.value, 10);
            interval = parseInt(node.instances[0].commandClasses[0x84].data.interval.value, 10);

        }
        // Conts
        var sleeping_cont = sleepingCont(isListening, hasWakeup, isFLiRS, sleepingSince, lastWakeup, interval);
        var awake_cont = awakeCont(isAwake, isListening, isFLiRS);
        var operating_cont = operatingCont(isFailed, lastCommunication);

        var interview_cont = false;
        //var _interview_cont = '<i class="fa fa-question-circle fa-lg text-info" title="' + $scope._t('device_is_not_fully_interviewed') + '"></i>';
        var _interview_cont = $scope._t('device_is_not_fully_interviewed');
        if (ZWaveAPIData.devices[nodeId].data.nodeInfoFrame.value && ZWaveAPIData.devices[nodeId].data.nodeInfoFrame.value.length) {
            for (var iId in ZWaveAPIData.devices[nodeId].instances)
                for (var ccId in ZWaveAPIData.devices[nodeId].instances[iId].commandClasses)
                    if (!ZWaveAPIData.devices[nodeId].instances[iId].commandClasses[ccId].data.interviewDone.value) {
                        interview_cont = _interview_cont;
                    }
        } else
            interview_cont = _interview_cont;


        var obj = {};
        obj['id'] = nodeId;
        obj['rowId'] = 'row_' + nodeId;
        obj['cmd'] = bindPath.split(',');
        obj['genericType'] = genericType;
        obj['specificType'] = specificType;
        obj['name'] = node.data.name;
        obj['sleeping'] = sleeping_cont;
        obj['awake'] = awake_cont;
        obj['updateTime'] = operating_cont;
        obj['interview'] = interview_cont;
        obj['urlToStore'] = (isListening || isFLiRS ? 'devices[' + nodeId + '].SendNoOperation()' : false);
        obj['interview'] = interview_cont;
        obj['isListening'] = isListening;
        obj['isFLiRS'] = isFLiRS;
        obj['hasWakeup'] = hasWakeup;
        obj['lastCommunication'] = lastCommunication;
        obj['sleepingSince'] = sleepingSince;
        obj['lastWakeup'] = lastWakeup;
        obj['interval'] = interval;

        var interview = {};
        interview['nodeId'] = nodeId;
        interview['rows'] = '';
        for (var iId in ZWaveAPIData.devices[nodeId].instances) {
            var cnt = 0;
            for (var ccId in ZWaveAPIData.devices[nodeId].instances[iId].commandClasses) {
                //interview['rows'] += '<tr><td><a href="" class="a_instance">' + iId + '</a></td><td><a href="" class="a_command_class">' + ZWaveAPIData.devices[nodeId].instances[iId].commandClasses[ccId].name + '</a></td><td>' + (ZWaveAPIData.devices[nodeId].instances[iId].commandClasses[ccId].data.interviewDone.value ? 'Done' : '<button class="run geek"></button>') + '</td></tr>';
                interview['rows'] += '<tr><td>' + iId + '</td><td>' + ZWaveAPIData.devices[nodeId].instances[iId].commandClasses[ccId].name + '</td><td>' + (ZWaveAPIData.devices[nodeId].instances[iId].commandClasses[ccId].data.interviewDone.value ? 'Done' : '<button id="btn_interview_' + nodeId + '" class="btn btn-primary" ng-click="showOnClick()">' + $scope._t('config_ui_force_interview') + '</button>') + '</td></tr>';
                cnt++;

            }
            ;
        }
        ;

        $scope.statuses.push(obj);
        $scope.interviews.push(interview);



    };

    // Load data
    $scope.load($scope.lang);

    // Refresh data
    var refresh = function() {
        DataFactory.all($filter('getTimestamp')).query(function(data) {
            //DataTestFactory.all('refresh_device_status.json').query(function(data) {
            angular.forEach($scope.statuses, function(v, k) {
                angular.forEach(v.cmd, function(ccId, key) {
                    if (ccId in data) {
                        var node = 'devices.' + v.id;
                        var isAwakeCmd = node + '.data.isAwake';
                        var isFailedCmd = node + '.data.isFailed';
                        var lastReceiveCmd = node + '.data.lastReceived';
                        var lastSendCmd = node + '.data.lastSend';
                        var lastWakeupCmd = node + '.instances.0.commandClasses.132.data.lastWakeup';
                        var lastSleepCmd = node + '.instances.0.commandClasses.132.data.lastSleep';
                        var lastCommunication = v.lastCommunication;
                        switch (ccId) {
                            case isAwakeCmd:
                                var isAwake = data[isAwakeCmd].value;
                                var awake_cont = awakeCont(isAwake, v.isListening, v.isFLiRS);
                                $('#' + v.rowId + ' .row-awake').html(awake_cont);
                                break;
                            case isFailedCmd:
                                var isFailed = data[isFailedCmd].value;
                                var operating_cont = operatingCont(isFailed, lastCommunication);
                                $('#' + v.rowId + ' .row-time').html(operating_cont);
                                break;
                            case lastReceiveCmd:
                                var lastReceive = data[lastReceiveCmd].updateTime;
                                lastCommunication = (lastReceive > lastCommunication) ? lastReceive : lastCommunication;
                                var operating_cont_rec = operatingCont(false, lastCommunication);
                                $('#' + v.rowId + ' .row-time').html(operating_cont_rec);
                                break;
                            case lastSendCmd:
                                var lastSend = data[lastSendCmd].updateTime;
                                lastCommunication = (lastSend > lastCommunication) ? lastSend : lastCommunication;
                                var operating_cont_send = operatingCont(false, lastCommunication);
                                $('#' + v.rowId + ' .row-time').html(operating_cont_send);
                                break;
                            case lastWakeupCmd:
                                var lastWakeup = data[lastWakeupCmd].value;
                                var sleepingSince = data[lastSleepCmd].value;
                                var sleeping_cont = sleepingCont(v.isListening, v.hasWakeup, v.isFLiRS, sleepingSince, lastWakeup, v.interval);
                                $('#' + v.rowId + ' .row-sleeping').html(sleeping_cont);
                                break;
                            case lastSleepCmd:
                                //console.log(lastSleepCmd);
                                break;
                        }
                        ;

                    }

                });
            });
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
    $scope.storeAll = function(btn) {
        $(btn).attr('disabled', true);
        angular.forEach($scope.statuses, function(v, k) {
            if (v.urlToStore) {
                DataFactory.store(v.urlToStore).query();
            }
        });
        $timeout(function() {
            $(btn).removeAttr('disabled');
        }, 1000);
    };

    // Store all data on remote server
    $scope.showModal = function(target, nodeId) {
        // Modal example http://plnkr.co/edit/D29YjKGbY63OSa1EeixT?p=preview
        // alert(id);
        $(target).modal();
        var html = '<table class="table">';
        html += '<tr><th>Instance</th><th>Command Class</th><th>Result</th></th>';
        angular.forEach($scope.interviews, function(v, k) {
            if (v.nodeId == nodeId) {
                html += v.rows;
            }
        });
        html += '</table>';
        $(target).on('shown.bs.modal', function() {
            $(target + ' .modal-body').html('<p>Interview result for device: ' + nodeId + '</p>' + html);

        });

    };
    // Get Awake HTML
    function awakeCont(isAwake, isListening, isFLiRS) {
        var awake_cont = '';
        if (!isListening && !isFLiRS)
            awake_cont = isAwake ? ('<i class="fa fa-certificate fa-lg text-orange" title="' + $scope._t('device_is_active') + '"></i>') : ('<i class="fa fa-moon-o fa-lg text-primary" title="' + $scope._t('device_is_sleeping') + '"></i>');
        return awake_cont;
    }
    // Get operating HTML
    function operatingCont(isFailed, lastCommunication) {
        var operating_cont = (isFailed ? ('<i class="fa fa-power-off fa-lg text-danger" title="' + $scope._t('device_is_dead') + '"></i>') : ('<i class="fa fa-check fa-lg text-success" title="' + $scope._t('device_is_operating') + '"></i>')) + ' <span title="' + $scope._t('last_communication') + '" class="not_important">' + $filter('isTodayFromUnix')(lastCommunication) + '</span>';
        return operating_cont;
    }

    // Get Sleeping HTML
    function sleepingCont(isListening, hasWakeup, isFLiRS, sleepingSince, lastWakeup, interval) {
        var sleeping_cont;
        if (isListening)
            sleeping_cont = ''; // mains powered device
        else if (!isListening && hasWakeup) {
            var approx = '';

            if (isNaN(sleepingSince) || sleepingSince < lastWakeup) {
                sleepingSince = lastWakeup
                if (!isNaN(lastWakeup))
                    approx = '<span title="' + $scope._t('sleeping_since_approximately') + '">~</span> ';
            }
            ;
            if (interval == 0)
                interval = NaN; // to indicate that interval and hence next wakeup are unknown
            var lastSleep = $filter('isTodayFromUnix')(sleepingSince);
            var nextWakeup = $filter('isTodayFromUnix')(sleepingSince + interval);
            sleeping_cont = '<span title="' + $scope._t('sleeping_since') + '" class="not_important">' + approx + lastSleep + '</span> &#8594; <span title="' + $scope._t('next_wakeup') + '">' + approx + nextWakeup + '</span> <i class="fa fa-clock-o fa-lg" title="' + $scope._t('battery_operated_device_with_wakeup') + '"></i>';
        } else if (!isListening && isFLiRS)
            sleeping_cont = '<i class="fa fa-headphones fa-lg" title="' + $scope._t('FLiRS_device') + '"></i>';
        else
            sleeping_cont = '<i class="fa fa-rss fa-lg" title="' + $scope._t('battery_operated_remote_control') + '"></i>';

        return sleeping_cont;
    }
});

// Battery controller
appController.controller('BatteryController', function($scope, $log, $filter, $timeout, DataFactory, DataTestFactory, cfg) {

    $scope.battery = [];
    $scope.reset = function() {
        $scope.battery = angular.copy([]);
    };

    // Load data
    $scope.load = function(lang) {
        DataFactory.all('0').query(function(ZWaveAPIData) {
            //DataTestFactory.all('all.json').query(function(data) {
            var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;

            // Loop throught devices
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                    return;
                }
                var hasBattery = 0x80 in node.instances[0].commandClasses;
                var instanceId = 0;
                var ccId = 0x80;
                if (!hasBattery) {
                    return;
                }
                var node = ZWaveAPIData.devices[nodeId];
                var battery_charge = parseInt(node.instances[0].commandClasses[0x80].data.last.value);
                var battery_updateTime = node.instances[0].commandClasses[0x80].data.last.updateTime;

                // Set object
                var obj = {};
                obj['id'] = nodeId;
                obj['cmd'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].data.last';
                obj['rowId'] = 'row_' + nodeId;
                obj['name'] = node.data.name;
                obj['level'] = battery_charge;
                obj['updateTime'] = battery_updateTime;
                obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Get()';
                $scope.battery.push(obj);
            });
        });
    };

    $scope.load($scope.lang);

    // Refresh data
    var refresh = function() {
        DataFactory.all($filter('getTimestamp')).query(function(data) {
            //DataTestFactory.all('device_31_updated.json').query(function(data) {
            angular.forEach($scope.battery, function(v, k) {
                // Check for updated data
                if (v.cmd in data) {
                    var obj = data[v.cmd];
                    var level = obj.value;
                    var updateTime = $filter('isTodayFromUnix')(obj.updateTime);
                    var levelIcon = $filter('batteryIcon')(level);

                    $('#' + v.rowId + ' .row-level').html(level + '% <i class="' + levelIcon + '"></i>');
                    $('#' + v.rowId + ' .row-time').html(updateTime).removeClass('is-updated-false');
                    $('#update_time_tick').html($filter('getCurrentTime'));
                }
            });

        });
        $timeout(refresh, cfg.interval);
    };
    $timeout(refresh, cfg.interval);

    // Store single data on remote server
    $scope.store = function(btn) {
        $(btn).attr('disabled', true);
        DataFactory.store($(btn).attr('data-store-url')).query();

        $timeout(function() {
            $(btn).removeAttr('disabled');
        }, 1000);
    };

    // Store all data on remote server
    $scope.storeAll = function(btn) {
        $(btn).attr('disabled', true);
        angular.forEach($scope.battery, function(v, k) {
            DataFactory.store(v.urlToStore).query();
        });
        $timeout(function() {
            $(btn).removeAttr('disabled');
        }, 1000);
    };

});

// Type controller
appController.controller('TypeController', function($scope, $log, $filter, $timeout, DataFactory, DataTestFactory, XmlFactory, cfg) {
    $scope.devices = [];
    $scope.reset = function() {
        $scope.devices = angular.copy([]);
    };
    $scope.dataXml = [];

    //This is the callback function
    setXml = function(data) {
        var lang = 'en'; 
        angular.forEach(data.DeviceClasses.Generic, function(val, key) {
            var obj = {};
            var langs = {
                "en": "0",
                "de": "1",
                "ru": "2"
            };
           
            if(angular.isDefined(langs[$scope.lang])){
                lang = $scope.lang;
            }
            var langId = langs[lang];
            
            obj['id'] = parseInt(val._id);
            obj['title'] = val.name.lang[langId].__text;
            $scope.dataXml.push(obj);
        });
       
    };
    XmlFactory.get(setXml, $scope.cfg.server_url + '/translations/DeviceClasses.xml');
    //XmlFactory.get(setXml, 'storage/DeviceClasses.xml');
    
    // Load data
    $scope.load = function(lang) {
        DataFactory.all('0').query(function(ZWaveAPIData) {
            //DataTestFactory.all('all.json').query(function(data) {
            var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;

            // Loop throught devices
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                    return;
                }
                var node = ZWaveAPIData.devices[nodeId];
                var instanceId = 0;
                var ccIds = [32, 34, 37, 38, 43, 70, 91, 94, 96, 114, 119, 129, 134, 138, 143, 152];

                var basicType = node.data.basicType.value;
                var genericType = node.data.genericType.value;
                var specificType = node.data.specificType.value;
                var deviceType = '';
                var fromSdk = true;
                var sdk;
                // SDK
                if (node.data.SDK.value == '') {
                    sdk = node.data.ZWProtocolMajor.value + '.' + node.data.ZWProtocolMinor.value;
                    fromSdk = false;
                } else {
                    sdk = node.data.SDK.value;
                }
                // Version
                var appVersion = node.data.applicationMajor.value + '.' + node.data.applicationMinor.value;

                // Security and ZWavePlusInfo
                var security = 0;
                angular.forEach(ccIds, function(v, k) {
                    var cmd = node.instances[instanceId].commandClasses[v];
                    if (angular.isObject(cmd) && cmd.name === 'Security') {
                        security = cmd.data.interviewDone.value;
                        return;
                    }
                });
                var ZWavePlusInfo = false;
                angular.forEach(ccIds, function(v, k) {
                    var cmd = node.instances[instanceId].commandClasses[v];
                    if (angular.isObject(cmd) && cmd.name === 'ZWavePlusInfo') {
                        ZWavePlusInfo = true;
                        return;
                    }
                });
                
                // Device type
                var deviceXml = $scope.dataXml;
                angular.forEach(deviceXml, function(v, k) {
                    if (genericType == v.id) {
                        deviceType = v.title;
                    }
                });
                // Set object
                var obj = {};
                obj['id'] = nodeId;
                obj['rowId'] = 'row_' + nodeId;
                obj['name'] = node.data.name;
                obj['security'] = security;
                obj['ZWavePlusInfo'] = ZWavePlusInfo;
                obj['sdk'] = sdk;
                obj['fromSdk'] = fromSdk;
                obj['appVersion'] = appVersion;
                obj['type'] = deviceType;
                obj['deviceType'] = deviceType;
                obj['basicType'] = basicType;
                obj['genericType'] = genericType;
                obj['specificType'] = specificType;
                $scope.devices.push(obj);
            });
        });
    };

    $scope.load($scope.lang);



    // Store single data on remote server
    $scope.store = function(btn) {
        $(btn).attr('disabled', true);
        DataFactory.store($(btn).attr('data-store-url')).query();

        $timeout(function() {
            $(btn).removeAttr('disabled');
        }, 1000);
    };

    // Store all data on remote server
    $scope.storeAll = function(btn) {
        $(btn).attr('disabled', true);
        angular.forEach($scope.devices, function(v, k) {
            DataFactory.store(v.urlToStore).query();
        });
        $timeout(function() {
            $(btn).removeAttr('disabled');
        }, 1000);
    };
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
appController.controller('CommandsController', function($scope, $location, $cookies, DataFactory, cfg) {
    $scope.devices = [];

    // Remember
    $scope.detailId = (angular.isDefined($cookies.expert_commands_id) ? $cookies.expert_commands_id : 0);

    // Redirect to detail page
    $scope.redirectToDetail = function() {
        if ($scope.detailId > 0) {
            $location.path('/expert/commands/' + $scope.detailId);
        }
    };
    $scope.redirectToDetail();
    // Load data
    $scope.navigation = function() {
        DataFactory.all('0').query(function(ZWaveAPIData) {
            //DataTestFactory.all('all.json').query(function(data) {
            var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;

            // Loop throught devices
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                    return;
                }
                var node = ZWaveAPIData.devices[nodeId];

                //console.log(security);
                // Set object
                var obj = {};
                obj['id'] = nodeId;
                obj['rowId'] = 'row_' + nodeId;
                obj['name'] = node.data.name;
                $scope.devices.push(obj);
            });
        });
    };
    $scope.navigation();
    $scope.goToDetail = function(detailId) {
        $location.path('/expert/commands/' + detailId);
    };
});

// Commands controller
appController.controller('CommandsDetailController', function($scope, $routeParams, $location, $cookies, $timeout, DataFactory) {
    $scope.devices = [];
    $scope.ZWaveAPIData;
    $scope.commands = [];
    $scope.deviceId = $routeParams.nodeId;
    $scope.deviceName = '';
    $scope.reset = function() {
        $scope.devices = angular.copy([]);
    };

    // Load navigation
    $scope.navigation = function() {
        DataFactory.all('0').query(function(ZWaveAPIData) {
            //DataTestFactory.all('all.json').query(function(data) {
            var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;

            // Loop throught devices
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                    return;
                }
                var node = ZWaveAPIData.devices[nodeId];

                if (nodeId == $routeParams.nodeId) {
                    $scope.deviceName = node.data.name;
                }
                // Set object
                var obj = {};
                obj['id'] = nodeId;
                obj['rowId'] = 'row_' + nodeId;
                obj['name'] = node.data.name;
                obj['slected'] = '';
                if (nodeId == $routeParams.nodeId) {
                    $scope.deviceName = node.data.name;
                    obj['slected'] = 'selected';
                }
                $scope.devices.push(obj);
            });
        });
    };
    $scope.navigation();

    // Load data
    $scope.load = function() {
        DataFactory.all('0').query(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            //DataTestFactory.all('all.json').query(function(data) {
            // Loop throught devices
            var ZWaveAPIData = ZWaveAPIData;
            var nodeId = $routeParams.nodeId;
            var instancesCount = 0;

            angular.forEach(ZWaveAPIData.devices[nodeId].instances, function(instance, instanceId) {

                var commandClassesCount = 0;
                angular.forEach(instance.commandClasses, function(commandClass, ccId) {
                    var methodsCount = 0;
                    var methods = getMethodSpec(ZWaveAPIData, nodeId, instanceId, ccId, null);
                    var obj = {};
                    obj['nodeId'] = nodeId;
                    obj['rowId'] = 'row_' + nodeId + '_' + ccId;
                    obj['instanceId'] = instanceId;
                    obj['cmd'] = 'devices[' + nodeId + '].instances[0].commandClasses[' + ccId + ']';
                    obj['commandClass'] = commandClass.name;
                    obj['command'] = getCommands(methods, ZWaveAPIData);
                    $scope.commands.push(obj);

                });
            });
        });
    };
    $scope.load();

    function getCommands(methods, ZWaveAPIData) {
        var methodsArr = [];

        angular.forEach(methods, function(params, method) {
            //str.split(',');
            var cmd = {};
            var values = repr_array(method_defaultValues(ZWaveAPIData, methods[method]));
            cmd['data'] = {
                'method': method,
                'params': methods[method],
                'values': method_defaultValues(ZWaveAPIData, methods[method])
            };
            cmd['method'] = method;
            cmd['params'] = methods[method];
            cmd['values'] = repr_array(method_defaultValues(ZWaveAPIData, methods[method]));

            methodsArr.push(cmd);
            //console.log(values);
        });
        return methodsArr;
    }
    ;

    $scope.getNodeDevices = function() {
        var devices = [];
        angular.forEach($scope.devices, function(v, k) {
            if (devices_htmlSelect_filter($scope.ZWaveAPIData, 'span', v.id, 'node')) {
                return;
            }
            ;
            var obj = {};
            obj['id'] = v.id;
            obj['name'] = v.name;
            devices.push(obj);
        });
        return devices;
    };

// Show modal dialog
    $scope.showModal = function(target, nodeId) {
        // Modal example http://plnkr.co/edit/D29YjKGbY63OSa1EeixT?p=preview
        $(target).modal();
        var html = 'Command Class data';

        $(target).on('shown.bs.modal', function() {
            $(target + ' .modal-body').html('<p>Command class data: ' + nodeId + '</p>');

        });

    };
    // Redirect to another device
    $cookies.expert_commands_id = $routeParams.nodeId;
    $scope.goToDetail = function(detailId) {
        $location.path('/expert/commands/' + detailId);
    };

    // Store single data on remote server
    $scope.store = function(btn) {
        $(btn).attr('disabled', true);
        DataFactory.store($(btn).attr('data-store-url')).query();

        $timeout(function() {
            $(btn).removeAttr('disabled');
        }, 1000);
    };

});

