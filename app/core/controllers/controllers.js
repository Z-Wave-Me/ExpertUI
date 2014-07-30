/**
 * Application controllers and factories
 * @author Martin Vach
 */

/*** Controllers ***/
var appController = angular.module('appController', []);

// Base controller
appController.controller('BaseController', function($scope, $cookies, $filter, cfg, langFactory, langTransFactory, deviceConfigFactory, myCache, DataFactory, XmlFactory) {
    // Show page content
    $scope.showContent = false;
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
    // Get device name
    $scope.loadDeviceConfig = function() {
        deviceConfigFactory.get().query(function(data) {
            $scope.getDeviceNames = data;
        });
    };
    $scope.loadDeviceConfig();


    // Cache ZWaveAPIData
//    var cachedAPIData = myCache.get('ZWaveAPIData');
//    if (cachedAPIData) {
//        $scope.globalAPIData = cachedAPIData;
//    } else {
//        DataFactory.all('0').query(function(ZWaveAPIData) {
//            myCache.put('ZWaveAPIData', ZWaveAPIData);
//            $scope.globalAPIData = cachedAPIData;
//        });
//    }

    // Cache xml
    //Load xml data
    $scope.dataDeviceClassesXml = [];
    $scope.setXml = function(data) {
        var dataXml = [];
        var lang = 'en';
        angular.forEach(data.DeviceClasses.Generic, function(val, key) {
            var obj = {};
            var langs = {
                "en": "0",
                "de": "1",
                "ru": "2"
            };

            if (angular.isDefined(langs[$scope.lang])) {
                lang = $scope.lang;
            }
            var langId = 0;

            obj['id'] = parseInt(val._id);
            obj['generic'] = val.name.lang[langId].__text;
            obj['specific'] = val.Specific;
            obj['langId'] = langId;
            dataXml.push(obj);
            $scope.dataDeviceClassesXml.push(obj);


        });
        myCache.put('deviceClasses', dataXml);
    };
    XmlFactory.get($scope.setXml, $scope.cfg.server_url + '/translations/DeviceClasses.xml');


});

// Test controller
appController.controller('TestController', function($scope, $routeParams, cfg, $http, $log, DataFactory, DataTestFactory, $timeout, XmlFactory, testFactory, $cacheFactory, myCache) {
    $scope.timeInMs = 0;
    $scope.dataSet;
    var countUp = function() {
        $scope.timeInMs += 1;
        $timeout(countUp, 1000);
    };
    $timeout(countUp, 1000);

//    testFactory.loadItems();
//    console.log(testFactory.getItems());
//$scope.cache = $cacheFactory('cacheId');
    var cache = myCache.get('ZWaveAPIData');
    if (cache) {
        $scope.cacheVar = cache;
        angular.forEach(cache.devices, function(dev, nodeId) {

            console.log(nodeId);
        });
        console.log('Cached');
    } else {
        var data = {"id": 1};
        $scope.cacheVar = data;

        myCache.put('myData', data);
        console.log('UNNNNNNNNNCached');
    }
    console.log($scope.cacheVar);

});


// Home controller
appController.controller('HomeController', function($scope, DataFactory, myCache) {
   $scope.ZWaveAPIData;
   $scope.countDevices; 
   $scope.batteryDevices; 
    /**
     * Load data
     * 
     */
    $scope.loadData = function(ZWaveAPIData) {
       $scope.countDevices = countDevices(ZWaveAPIData);
       $scope.batteryDevices = batteryDevices(ZWaveAPIData)
       console.log($scope.batteryDevices);
    };

    // Chaching data  
    var cachedAPIData = myCache.get('ZWaveAPIData');
    if (cachedAPIData) {
        //$scope.ZWaveAPIData = cachedAPIData;
         console.log('Cache');
       $scope.loadData(cachedAPIData);
    } else {
        DataFactory.all('0').query(function(ZWaveAPIData) {
            myCache.put('ZWaveAPIData', ZWaveAPIData);
             //$scope.ZWaveAPIData = ZWaveAPIData;
            $scope.loadData(ZWaveAPIData);
            console.log('NO Cache');
        });
    }
    /**
     * Count devices
     */
    function countDevices(ZWaveAPIData){
        var controllerId = ZWaveAPIData.controller.data.nodeId.value;
        var cnt = 0;
        // Loop throught devices
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || nodeId == controllerId || node.data.isVirtual.value) {
                    return;
                }
                cnt++;
            });
        return cnt;
    };
    
     /**
     * batteryDevices
     */
    function batteryDevices(ZWaveAPIData){
        var controllerId = ZWaveAPIData.controller.data.nodeId.value;
        var cnt = 0;
        // Loop throught devices
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || nodeId == controllerId || node.data.isVirtual.value) {
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
                cnt++;
            });
        return cnt;
    };
    
     /**
     * batteryDevices
     */
    function flirsDevices(ZWaveAPIData){
        var controllerId = ZWaveAPIData.controller.data.nodeId.value;
        var cnt = 0;
        // Loop throught devices
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || nodeId == controllerId || node.data.isVirtual.value) {
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
                cnt++;
            });
        return cnt;
    };

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
                    obj['name'] = $filter('deviceName')(nodeId, node);
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
                            obj['name'] = $filter('deviceName')(k, device);
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
                            obj['name'] = $filter('deviceName')(k, device);
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
                            obj['name'] = $filter('deviceName')(k, device);
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
                            obj['name'] = $filter('deviceName')(k, device);
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
                    //var curThermMode = 1;
                    var curThermMode = getCurrentThermostatMode(instance);
                    console.log(instance.commandClasses[ccId].data[1]);
                    console.log(getCurrentThermostatMode(instance));

                    // Set object
                    var obj = {};
                    //var level = $scope.updateLevel(instance.commandClasses[ccId].data.level, ccId);

                    obj['id'] = nodeId;
                    obj['cmd'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.' + curThermMode;
                    obj['ccId'] = ccId;
                    obj['rowId'] = 'row_' + nodeId + '_' + cnt;
                    obj['name'] = $filter('deviceName')(nodeId, node);
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

    // used to pick up thermstat mode
    function getCurrentThermostatMode(_instance) {
        var hasThermostatMode = 0x40 in _instance.commandClasses;

        var _curThermMode;
        if (hasThermostatMode) {
            _curThermMode = _instance.commandClasses[0x40].data.mode.value;
            if (isNaN(parseInt(_curThermMode, 10)))
                _curThermMode = null; // Mode not retrieved yet
        } else {
            // we pick up first available mode, since not ThermostatMode is supported to change modes
            _curThermMode = null;
            angular.forEach(_instance.commandClasses[0x43].data, function(name, k) {
                if (!isNaN(parseInt(name, 10))) {
                    _curThermMode = parseInt(name, 10);
                    return false;
                }
            });
        }
        ;
        return _curThermMode;
    }
    ;

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
                    obj['name'] = $filter('deviceName')(nodeId, node);
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

    // Store data on remote server
    $scope.store = function(btn) {
        $(btn).attr('disabled', true);
        var url = $(btn).attr('data-store-url');
        DataFactory.store(url).query();
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
        obj['name'] = $filter('deviceName')(nodeId, node);
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

    // Show modal window
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
                obj['name'] = $filter('deviceName')(nodeId, node);
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

    //Load xml data
    setXml = function(data) {
        var lang = 'en';
        angular.forEach(data.DeviceClasses.Generic, function(val, key) {
            var obj = {};
            var langs = {
                "en": "0",
                "de": "1",
                "ru": "2"
            };

            if (angular.isDefined(langs[$scope.lang])) {
                lang = $scope.lang;
            }
            var langId = langs[lang];

            obj['id'] = parseInt(val._id);
            obj['generic'] = val.name.lang[langId].__text;
            obj['specific'] = val.Specific;
            obj['langId'] = langId;
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
                var deviceType = $scope._t('unknown_device_type') + ': ' + genericType;
                angular.forEach(deviceXml, function(v, k) {
                    if (genericType == v.id) {
                        deviceType = v.generic;
                        angular.forEach(v.specific, function(s, sk) {
                            if (specificType == s._id) {
                                if (angular.isDefined(s.name.lang[v.langId].__text)) {
                                    deviceType = s.name.lang[v.langId].__text;
                                }
                            }
                        });
                        return;
                    }
                });
                // Set object
                var obj = {};
                obj['id'] = nodeId;
                obj['rowId'] = 'row_' + nodeId;
                obj['name'] = $filter('deviceName')(nodeId, node);
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

// Configuration controller
appController.controller('ConfigurationController', function($scope, $routeParams, $http, $filter, $location, $cookies, DataFactory, XmlFactory, DataTestFactory) {
    $scope.devices = [];
    $scope.showDevices = false;
    $scope.ZWaveAPIData;
    $scope.descriptionCont;
    $scope.configCont;
    $scope.switchAllCont;
    $scope.protectionCont;
    $scope.wakeupCont;
    $scope.fwupdateCont;
    $scope.interviewCommandsDevice;
    $scope.interviewCommands;
    $scope.assocCont;
    $scope.deviceId = $routeParams.nodeId;
    $scope.deviceName = '';
    $scope.deviceImage = '';
    $scope.commands = [];
    $scope.reset = function() {
        $scope.devices = angular.copy([]);
    };

    // Remember device id
    $scope.detailId = (angular.isDefined($cookies.configuration_id) ? $cookies.configuration_id : 0);
    // Redirect to detail page
    $scope.redirectToDetail = function(detailId) {
        if (detailId > 0) {
            $location.path('/config/configuration/' + detailId);
        }
    };

    $scope.rememberTab = function(tabId) {
        $cookies.tab_config = tabId;
    };
    // Remember active tab
    $scope.activeTab = (angular.isDefined($cookies.tab_config) ? $cookies.tab_config : 'interview');
    // Load navigation
    $scope.navigation = function() {
        DataFactory.all('0').query(function(ZWaveAPIData) {
            //DataTestFactory.all('all.json').query(function(ZWaveAPIData) {
            var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;

            // Loop throught devices
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                    return;
                }
                $scope.showContent = true;
                var node = ZWaveAPIData.devices[nodeId];

                if (nodeId == $routeParams.nodeId) {
                    $scope.deviceName = $filter('deviceName')(nodeId, node);
                }
                // Set object
                var obj = {};
                obj['id'] = nodeId;
                obj['rowId'] = 'row_' + nodeId;
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['slected'] = '';
                if (nodeId == $routeParams.nodeId) {

                    obj['slected'] = 'selected';
                }
                $scope.devices.push(obj);
            });
        });
    };
    $scope.navigation();


    // Load data
    $scope.load = function(nodeId) {
        DataFactory.all('0').query(function(ZWaveAPIData) {
            //DataTestFactory.all('all.json').query(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            var node = ZWaveAPIData.devices[nodeId];
            if (!node) {
                return;
            }
            $scope.showDevices = true;
            $scope.deviceName = $filter('deviceName')(nodeId, node);
            var zddXmlFile = null;
            if (angular.isDefined(node.data.ZDDXMLFile)) {
                zddXmlFile = node.data.ZDDXMLFile.value;
            }

            $scope.interviewCommands = interviewCommands(node);
            $scope.interviewCommandsDevice = node.data;
//            setXml = function(zddXml) {
//                $scope.configData = {
//                    "contDescription": contDescription(node, nodeId, zddXml, ZWaveAPIData)
//                };
//
//            };
//            XmlFactory.get(setXml, $scope.cfg.server_url + '/ZDDX/' + zddXmlFile);

            // Load XML service
            //$http.get($scope.cfg.server_url + '/ZDDX/' + zddXmlFile).then(function(response) {
            if (zddXmlFile) {
                $http.get($scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                    var x2js = new X2JS();
                    var zddXml = x2js.xml_str2json(response.data);
                    $scope.descriptionCont = descriptionCont(node, nodeId, zddXml, ZWaveAPIData);
                    $scope.configCont = configCont(node, nodeId, zddXml);
                    $scope.wakeupCont = wakeupCont(node, nodeId, ZWaveAPIData);
                    $scope.switchAllCont = switchAllCont(node, nodeId);
                    $scope.protectionCont = protectionCont(node, nodeId);
                    $scope.fwupdateCont = fwupdateCont(node);
                    $scope.assocCont = assocCont(node);
                });
            } else {
                $scope.descriptionCont = descriptionCont(node, nodeId, null, ZWaveAPIData);
                $scope.configCont = configCont(node, nodeId, null);
                $scope.wakeupCont = wakeupCont(node, nodeId, ZWaveAPIData);
                $scope.switchAllCont = switchAllCont(node, nodeId);
                $scope.protectionCont = protectionCont(node, nodeId);
                $scope.fwupdateCont = fwupdateCont(node);
                $scope.assocCont = assocCont(node);
            }
            /**
             * Expert commands
             */
            angular.forEach(node.instances, function(instance, instanceId) {
                angular.forEach(instance.commandClasses, function(commandClass, ccId) {
                    var methods = getMethodSpec(ZWaveAPIData, nodeId, instanceId, ccId, null);
                    var obj = {};
                    obj['nodeId'] = nodeId;
                    obj['rowId'] = 'row_' + nodeId + '_' + ccId;
                    obj['instanceId'] = instanceId;
                    obj['cmd'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                    obj['cmdData'] = ZWaveAPIData.devices[nodeId].instances[instanceId].commandClasses[ccId].data;
                    obj['cmdDataIn'] = ZWaveAPIData.devices[nodeId].instances[instanceId].data;
                    obj['commandClass'] = commandClass.name;
                    obj['command'] = getCommands(methods, ZWaveAPIData);
                    $scope.commands.push(obj);

                });
            });
            return;

        });
    };
    // Load
    if (parseInt($routeParams.nodeId, 10) > 0) {
        $scope.load($routeParams.nodeId);

    } else {
        $scope.redirectToDetail($scope.detailId);
    }


    // Redirect to another device
    $scope.goToDetail = function(detailId) {
        $cookies.configuration_id = $routeParams.nodeId;
        $location.path('/config/configuration/' + detailId);
    };

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
    /**
     * Device description
     */
    function descriptionCont(node, nodeId, zddXml, ZWaveAPIData) {
        // Set device data
        var deviceImage = 'app/images/no_device_image.png';
        var deviceDescription = '';
        var productName = '';
        var inclusionNote = '';
        var brandName = node.data.vendorString.value;
        var inclusionNote = '';
        var wakeupNote = '';
        var ZWavePlusInfo = '';
        var ZWavePlusRoles = [];
        var deviceDescriptionAppVersion = parseInt(node.data.applicationMajor.value, 10);
        var deviceDescriptionAppSubVersion = parseInt(node.data.applicationMinor.value, 10);
        if (isNaN(deviceDescriptionAppVersion))
            deviceDescriptionAppVersion = '-';
        if (isNaN(deviceDescriptionAppSubVersion))
            deviceDescriptionAppSubVersion = '-';
        var zwNodeName = '';
        if (0x77 in node.instances[0].commandClasses) {
            // NodeNaming
            zwNodeName = node.instances[0].commandClasses[0x77].data.nodename.value;
            if (zwNodeName != '') {
                zwNodeName = ' (' + zwNodeName + ')';
            }


        }
        // SDK
        var sdk;
        if (node.data.SDK.value == '') {
            sdk = '(' + node.data.ZWProtocolMajor.value + '.' + node.data.ZWProtocolMinor.value + ')';
        } else {
            sdk = node.data.SDK.value;
        }

        // Command class
        var ccNames = [];
        angular.forEach($scope.interviewCommands, function(v, k) {
            ccNames.push(v.ccName);
        });

        // Has device a zddx XML file
        if (zddXml) {
            var lang = 'en';
            var langs = {
                "en": "1",
                "de": "0",
                "ru": "2"
            };

            if (angular.isDefined(langs[$scope.lang])) {
                lang = $scope.lang;
            }
            var langId = langs[lang];
            if (angular.isDefined(zddXml.ZWaveDevice.deviceDescription.description.lang[langId])) {
                deviceDescription = zddXml.ZWaveDevice.deviceDescription.description.lang[langId].__text;
            }
            if ('productName' in zddXml.ZWaveDevice.deviceDescription) {
                productName = zddXml.ZWaveDevice.deviceDescription.productName;
            }
            if (angular.isDefined(zddXml.ZWaveDevice.deviceDescription.inclusionNote.lang[langId])) {
                inclusionNote = zddXml.ZWaveDevice.deviceDescription.inclusionNote.lang[langId].__text;
            }

            if ('brandName' in zddXml.ZWaveDevice.deviceDescription) {
                brandName = zddXml.ZWaveDevice.deviceDescription.brandName;
            }
            if (angular.isDefined(zddXml.ZWaveDevice.deviceDescription.inclusionNote.lang[langId])) {
                inclusionNote = zddXml.ZWaveDevice.deviceDescription.inclusionNote.lang[langId].__text;
            }
            if (angular.isDefined(zddXml.ZWaveDevice.deviceDescription.wakeupNote.lang[langId])) {
                wakeupNote = zddXml.ZWaveDevice.deviceDescription.wakeupNote.lang[langId].__text;
            }
            if (angular.isDefined(zddXml.ZWaveDevice.resourceLinks)) {
                deviceImage = zddXml.ZWaveDevice.resourceLinks.deviceImage._url;
            }
            /**
             * TODO: finish ZWavePlusRoles
             */
            if (angular.isDefined(zddXml.ZWaveDevice.RoleTypes)) {
                angular.forEach(zddXml.ZWaveDevice.RoleTypes, function(v, k) {
                    ZWavePlusRoles.push(v);
                });
            }
        }

        // Set device image
        $scope.deviceImage = deviceImage;
        //$filter('getDeviceName')(nodeId, null);
        // OBJ
        var obj = {};
        obj["a"] = {"key": "device_node_name", "val": $filter('deviceName')(nodeId, node)};
        obj["b"] = {"key": "device_node_id", "val": nodeId};
        obj["c"] = {"key": "device_node_type", "val": ''};
        obj["d"] = {"key": "device_description_brand", "val": brandName};
        obj["e"] = {"key": "device_description_device_type", "val": node.data.deviceTypeString.value};
        obj["f"] = {"key": "device_description_product", "val": productName};
        obj["g"] = {"key": "device_description_description", "val": deviceDescription};
        obj["h"] = {"key": "device_description_inclusion_note", "val": inclusionNote};
        obj["i"] = {"key": "device_description_wakeup_note", "val": (wakeupNote ? wakeupNote : '')};
        obj["j"] = {"key": "device_description_interview", "val": interviewStage(ZWaveAPIData, nodeId)};
        obj["k"] = {"key": "device_sleep_state", "val": deviceState(node)};
        //obj["l"] = {"key": "device_queue_length", "val": queueLength(ZWaveAPIData, node)};
        obj["m"] = {"key": "device_description_app_version", "val": deviceDescriptionAppVersion + '.' + deviceDescriptionAppSubVersion};
        obj["o"] = {"key": "device_description_sdk_version", "val": sdk};
        obj["p"] = {"key": "command_class", "val": ccNames.join(', ')};
        obj["q"] = {"key": "zwave_role_type", "val": ZWavePlusRoles.join(', ')};
        //obj[99] = {"key": "device_description_resources", "val": ''};
        return obj;

    }
    // Set interview stage
    function interviewStage(ZWaveAPIData, id) {
        var istages = [];
        istages.push((ZWaveAPIData.devices[id].data.nodeInfoFrame.value && ZWaveAPIData.devices[id].data.nodeInfoFrame.value.length) ? '+' : '-');
        istages.push('&nbsp;');
        istages.push((0x86 in ZWaveAPIData.devices[id].instances[0].commandClasses) ? (ZWaveAPIData.devices[id].instances[0].commandClasses[0x86].data.interviewDone.value ? '+' : (ZWaveAPIData.devices[id].instances[0].commandClasses[0x86].data.interviewCounter.value > 0 ? '.' : '&oslash;')) : '+'); // Version
        istages.push((0x72 in ZWaveAPIData.devices[id].instances[0].commandClasses) ? (ZWaveAPIData.devices[id].instances[0].commandClasses[0x72].data.interviewDone.value ? '+' : (ZWaveAPIData.devices[id].instances[0].commandClasses[0x72].data.interviewCounter.value > 0 ? '.' : '&oslash;')) : '+'); // ManufacturerSpecific
        istages.push((0x60 in ZWaveAPIData.devices[id].instances[0].commandClasses) ? (ZWaveAPIData.devices[id].instances[0].commandClasses[0x60].data.interviewDone.value ? '+' : (ZWaveAPIData.devices[id].instances[0].commandClasses[0x60].data.interviewCounter.value > 0 ? '.' : '&oslash;')) : '+'); // MultiChannel
        var moreCCs = false;
        for (var i in ZWaveAPIData.devices[id].instances) {
            istages.push('&nbsp;');
            var instance = ZWaveAPIData.devices[id].instances[i];
            for (var cc in instance.commandClasses) {
                moreCCs = true;
                if ((cc == 0x60 && i != 0) || ((cc == 0x86 || cc == 0x72 || cc == 0x60) && i == 0))
                    continue; // skip MultiChannel announced inside a MultiChannel and previously handled CCs.
                istages.push(instance.commandClasses[cc].data.interviewDone.value ? '+' : (instance.commandClasses[cc].data.interviewCounter.value > 0 ? '.' : '&oslash;'));
            }
        }
        ;
        if (!moreCCs) {
            istages.push('.');
        }

        var descr;
        if (istages.indexOf('&oslash;') == -1) {
            if (istages.indexOf('.') == -1 && istages.indexOf('-') == -1)
                descr = $scope._t('device_interview_stage_done');
            else
                descr = $scope._t('device_interview_stage_not_complete');
        } else
            descr = $scope._t('device_interview_stage_failed');

        return descr + '<br />' + istages.join('');
    }

    // Set device state
    function deviceState(node) {
        var out = '';
        if (!node.data.isListening.value && !node.data.sensor250.value && !node.data.sensor1000.value) {
            out = (node.data.isAwake.value ? '<i class="fa fa-certificate fa-lg text-orange""></i> ' + $scope._t('device_is_active') : '<i class="fa fa-moon-o fa-lg text-primary"></i> ' + $scope._t('device_is_sleeping'));
        } else {
            out = (node.data.isFailed.value ? '<i class="fa fa-power-off fa-lg text-danger"></i> ' + $scope._t('device_is_dead') : '<i class="fa fa-check fa-lg text-success"></i> ' + $scope._t('device_is_operating'));
        }
        return out;
    }

    // Queue length
    function queueLength(ZWaveAPIData, node) {
        var out = $scope._t('nm_queue_count_jobs_disabled');
        if (ZWaveAPIData.controller.data.countJobs.value) {
            out = node.data.queueLength.value;
        }
        return out;
    }

    // Interview commands
    function interviewCommands(node) {
        var interviews = [];
        for (var iId in node.instances) {
            var cnt = 0;
            for (var ccId in node.instances[iId].commandClasses) {
                var obj = {};
                obj['iId'] = iId;
                obj['ccId'] = ccId;
                obj['ccName'] = node.instances[iId].commandClasses[ccId].name;
                obj['interviewDone'] = node.instances[iId].commandClasses[ccId].data.interviewDone.value;
                obj['cmdData'] = node.instances[iId].commandClasses[ccId].data;
                obj['cmdDataIn'] = node.instances[iId].data;
                interviews.push(obj);
                cnt++;

            }
            ;
        }
        ;
        return interviews;
    }
    /**
     * Config cont
     */
    function configCont(node, nodeId, zddXml) {
        if (!0x70 in node.instances[0].commandClasses) {
            return null;
        }
        if (!zddXml) {
            return null;
        }

        if (!zddXml.ZWaveDevice.hasOwnProperty("configParams")) {
            return null;
        }
        var config_cont = [];
        var params = zddXml.ZWaveDevice.configParams['configParam'];
        var lang = 'en';
        var langs = {
            "en": "1",
            "de": "0"
        };

        if (angular.isDefined(langs[$scope.lang])) {
            lang = $scope.lang;
        }
        var langId = langs[lang];

        // Loop throught params
        var parCnt = 0;
        angular.forEach(params, function(conf_html, i) {

            if (!angular.isObject(conf_html)) {
                return;
            }

            have_conf_params = true;
            var conf = conf_html;
            var conf_num = conf['_number'];
            var conf_size = conf['_size'];
            var conf_name = $scope._t('configuration_parameter') + ' ' + conf_num;
            if (angular.isDefined(conf.name)) {
                if (angular.isDefined(conf.name.lang[langId])) {
                    conf_name = conf.name.lang[langId].__text;
                } else if (angular.isDefined(conf.name.lang)) {
                    conf_name = conf.name.lang.__text;

                }
            }

            var conf_description = '';
            if (angular.isDefined(conf.description)) {
                if (angular.isDefined(conf.description.lang[langId])) {
                    conf_description = conf.description.lang[langId].__text;
                } else if (angular.isDefined(conf.description)) {
                    conf_description = conf.description.lang.__text;

                }
            }
            var conf_size = conf['_size'];
            var conf_default_value = null;
            var conf_type = conf['_type'];

            // get default value from the XML
            var conf_default = null;
            if (conf['_default'] !== undefined) {
                conf_default = parseInt(conf['_default'], 16);
            }
            var isUpdated = true;
            var updateTime = '';
            if (angular.isDefined(node.instances[0].commandClasses[0x70].data[conf_num])) {
                var uTime = node.instances[0].commandClasses[0x70].data[conf_num].updateTime;
                var iTime = node.instances[0].commandClasses[0x70].data[conf_num].invalidateTime;
                var updateTime = $filter('isTodayFromUnix')(uTime);
                var isUpdated = (uTime > iTime ? true : false);
            }


            // Switch
            var conf_method_descr;
            switch (conf_type) {
                case 'rangemapped':
                    var param_struct_arr = [];
                    var conf_param_options = '';
                    angular.forEach(conf['value'], function(value_html, i) {
                        var value = value_html;
                        var value_from = parseInt(value['_from'], 16);
                        var value_to = parseInt(value['_to'], 16);
                        var value_description = 'fdf';
                        var value_description = '';
                        if (angular.isDefined(value.description)) {
                            value_description = value.description.lang[1].__text;
                            if (angular.isDefined(value.description.lang[langId])) {
                                value_description = value.description.lang[langId].__text;
                            }
                        }
                        if (angular.isDefined(value.lang)) {
                            value_description = value.lang[1].text;
                            angular.forEach(value.lang, function(lv, lk) {
                                if (lk == langId) {
                                    value_description = lv.__text;
                                }
                            });
                        }
                        var value_repr = value_from; // representative value for the range
                        if (conf_default !== null)
                            if (value_from <= conf_default && conf_default <= value_to) {
                                conf_default_value = value_description;
                                value_repr = conf_default;
                            }
                        param_struct_arr.push({
                            label: value_description,
                            type: {
                                fix: {
                                    value: value_repr
                                }
                            }
                        });
                    });
                    conf_method_descr = {
                        nodeId: nodeId,
                        label: 'Nº ' + conf_num + ' - ' + conf_name,
                        type: {
                            enumof: param_struct_arr
                        },
                        name: 'input_' + nodeId + '_' + conf_num,
                        description: conf_description,
                        updateTime: updateTime,
                        isUpdated: isUpdated,
                        defaultValue: conf_default_value,
                        confNum: conf_num,
                        confSize: conf_size
                    };

                    break;

                case 'range':
                    var param_struct_arr = [];
                    var rangeParam = conf['value'];
                    angular.forEach(rangeParam, function(value_html, ri) {
                        var value = value_html;

                        if (ri == 'description') {
                            //console.log(ri);
                            var value_from = parseInt(rangeParam['_from'], 16);
                            var value_to = parseInt(rangeParam['_to'], 16);
                            //console.log(rangeParam['description']);
                        } else {
                            var value_from = parseInt(value['_from'], 16);
                            var value_to = parseInt(value['_to'], 16);
                        }

                        var value_description = '';

                        if (angular.isDefined(value.description)) {
                            //value_description = value.description.lang[1].__text;
                            if (angular.isDefined(value.description.lang[langId])) {
                                value_description = value.description.lang[langId].__text;
                            } else if (angular.isDefined(value.description.lang)) {
                                value_description = value.description.lang.__text;
                            }
                        }
                        if (angular.isDefined(value.lang)) {

                            if (angular.isDefined(value.lang['__text'])) {
                                value_description = value.lang['__text'];
                            } else if (angular.isDefined(value.lang[langId])) {
                                value_description = value.lang[langId].__text;
                            }
                        }
                        if (conf_default !== null)
                            conf_default_value = conf_default;
                        if (value_from != value_to) {
                            if (value_description != '') {
                                var rangeVal = {
                                    label: value_description,
                                    type: {
                                        range: {
                                            min: value_from,
                                            max: value_to
                                        }
                                    }
                                };

                                param_struct_arr.push(rangeVal);
                            }
                        }
                        else // this is a fix value
                        if (value_description != '') {
                            param_struct_arr.push({
                                label: value_description,
                                type: {
                                    fix: {
                                        value: value_from
                                    }
                                }
                            });
                        }
                    });
                    if (param_struct_arr.length > 1)
                        conf_method_descr = {
                            nodeId: nodeId,
                            label: 'Nº ' + conf_num + ' - ' + conf_name,
                            type: {
                                enumof: param_struct_arr
                            },
                            name: 'input_' + nodeId + '_' + conf_num,
                            description: conf_description,
                            updateTime: updateTime,
                            isUpdated: isUpdated,
                            defaultValue: conf_default_value,
                            confNum: conf_num,
                            confSize: conf_size
                        };
                    else if (param_struct_arr.length == 1)
                        conf_method_descr = param_struct_arr[0];
                    break;

                case 'constant':
                    var param_struct_arr = [];
                    var conf_param_options = '';
                    angular.forEach(conf['value'], function(value_html, i) {
                        var value = value_html;
                        var value_from = parseInt(value['_from'], 16);
                        var value_to = parseInt(value['_to'], 16);
                        var value_description = '';
                        if (angular.isDefined(value.description)) {
                            value_description = value.description.lang.__text;

                        }
                        var value_repr = value_from; // representative value for the range
                        if (conf_default !== null)
                            if (value_from <= conf_default && conf_default <= value_to) {
                                conf_default_value = value_description;
                                value_repr = conf_default;
                            }
                        param_struct_arr.push({
                            label: value_description,
                            type: {
                                constant: {
                                    value: value_repr
                                }
                            }
                        });
                    });
                    conf_method_descr = {
                        nodeId: nodeId,
                        label: 'Nº ' + conf_num + ' - ' + conf_name,
                        type: {
                            constant: param_struct_arr
                        },
                        name: 'input_' + nodeId + '_' + conf_num,
                        description: conf_description,
                        updateTime: updateTime,
                        isUpdated: isUpdated,
                        defaultValue: conf_default_value,
                        confNum: conf_num,
                        confSize: conf_size
                    };

                    break;

                case 'bitset':
                    var param_struct_arr = [];
                    var conf_param_options = '';
                    var conf_default_value_arr = new Object;
                    if (conf_default !== null) {
                        var bit = 0;
                        do {
                            if ((1 << bit) & conf_default)
                                conf_default_value_arr[bit] = 'Bit ' + bit + ' set';
                        } while ((1 << (bit++)) < conf_default);
                    }
                    ;

                    angular.forEach(conf['value'], function(value_html, i) {
                        var value = value_html;
                        var value_from = parseInt(value['_from'], 16);
                        var value_to = parseInt(value['_to'], 16);
                        var value_description = 'fdf';
                        var value_description = '';
                        if (conf_default !== null) {
                            if (value_from == value_to) {
                                if ((1 << value_from) & conf_default)
                                    conf_default_value_arr[value_from] = value_description;
                            } else {
                                conf_default_value_arr[value_from] = (conf_default >> value_from) & ((1 << (value_to - value_from + 1)) - 1)
                                for (var bit = value_from + 1; bit <= value_to; bit++)
                                    delete conf_default_value_arr[bit];
                            }
                        }
                        ;
                        if (value_from == value_to)
                            param_struct_arr.push({
                                label: value_description,
                                name: 'input_' + nodeId + '_' + conf_num,
                                type: {
                                    bitcheck: {
                                        bit: value_from
                                    }
                                }
                            });
                        else
                            param_struct_arr.push({
                                label: value_description,
                                name: 'input_' + nodeId + '_' + conf_num,
                                type: {
                                    bitrange: {
                                        bit_from: value_from,
                                        bit_to: value_to
                                    }
                                }
                            });
                    });
                    if (conf_default !== null) {
                        conf_default_value = '';
                        for (var ii in conf_default_value_arr)
                            conf_default_value += conf_default_value_arr[ii] + ', ';
                        if (conf_default_value.length)
                            conf_default_value = conf_default_value.substr(0, conf_default_value.length - 2);
                    }
                    conf_method_descr = {
                        nodeId: nodeId,
                        label: 'Nº ' + conf_num + ' - ' + conf_name,
                        type: {
                            bitset: param_struct_arr
                        },
                        name: 'input_' + nodeId + '_' + conf_num,
                        description: conf_description,
                        updateTime: updateTime,
                        isUpdated: isUpdated,
                        defaultValue: conf_default_value,
                        confNum: conf_num,
                        confSize: conf_size
                    };

                    break;

                default:
                    return;
                    //conf_cont.append('<span>' + $.translate('unhandled_type_parameter') + ': ' + conf_type + '</span>');
            }
            ;
            config_cont.push(conf_method_descr);
            parCnt++;

        });
        return config_cont;
    }

    /**
     * Wakeup cont
     */
    function wakeupCont(node, nodeId) {
        var wakeup_cont = false;
        if (0x84 in node.instances[0].commandClasses) {
            var wakeup_zwave_min = (node.instances[0].commandClasses[0x84].data.version.value == 1) ? 0 : node.instances[0].commandClasses[0x84].data.min.value;
            var wakeup_zwave_max = (node.instances[0].commandClasses[0x84].data.version.value == 1) ? 0xFFFFFF : node.instances[0].commandClasses[0x84].data.max.value;
            var wakeup_zwave_value = node.instances[0].commandClasses[0x84].data.interval.value;
            var wakeup_zwave_default_value = (node.instances[0].commandClasses[0x84].data.version.value == 1) ? 86400 : node.instances[0].commandClasses[0x84].data['default'].value; // default is a special keyword in JavaScript
            var wakeup_zwave_nodeId = node.instances[0].commandClasses[0x84].data.nodeId.value;

            var uTime = node.instances[0].commandClasses[0x84].data.updateTime;
            var iTime = node.instances[0].commandClasses[0x84].data.invalidateTime;
            var updateTime = $filter('isTodayFromUnix')(uTime);
            var isUpdated = (uTime > iTime ? true : false);

            if (wakeup_zwave_min !== '' && wakeup_zwave_max !== '') {
                //var methods = getMethodSpec(ZWaveAPIData, nodeId, instanceId, ccId, null);
                var gui_descr = getMethodSpec($scope.ZWaveAPIData, nodeId, 0, 0x84, 'Set');
                gui_descr[0].type.range.min = parseInt(wakeup_zwave_min, 10);
                gui_descr[0].type.range.max = parseInt(wakeup_zwave_max, 10);
                var wakeup_config = null;
                var wakeup_conf_el;
                var wakeup_conf_value;
                var wakeup_conf_nodeId;
                //if (wakeup_config.size() == 1) {
                if (wakeup_config) {
                    var re = new RegExp('\\[([0-9]+),([0-9]+)\\]');
                    var rem = re.exec(wakeup_config.attr("parameter"));
                    wakeup_conf_value = (rem) ? parseInt(rem[1], 10) : null;
                    wakeup_conf_nodeId = (rem) ? parseInt(rem[2], 10) : null;
                    wakeup_conf_el = wakeup_config.get(0);
                } else {
                    if (wakeup_zwave_value != "" && wakeup_zwave_value != 0 && wakeup_zwave_nodeId != "") {
                        // not defined in config: adopt devices values
                        wakeup_conf_value = parseInt(wakeup_zwave_value, 10);
                        wakeup_conf_nodeId = parseInt(wakeup_zwave_nodeId, 10);
                    } else {
                        // values in device are missing. Use defaults
                        wakeup_conf_value = parseInt(wakeup_zwave_default_value, 10);
                        wakeup_conf_nodeId = parseInt($scope.ZWaveAPIData.controller.data.nodeId.value, 10);
                    }
                    ;
                }
                ;
                wakeup_cont = {
                    'params': gui_descr,
                    'values': {"0": wakeup_conf_value},
                    updateTime: updateTime,
                    isUpdated: isUpdated,
                    defaultValue: wakeup_conf_value,
                    cmd: 'devices[' + nodeId + '].instances[0].commandClasses[0x84]'
                };


            } else {
                //$('#wakeup_cont .cfg-block-content').append('<span>' + $scope._t('config_ui_wakeup_no_min_max') + '</span>');
            }
        }
        ;
        return wakeup_cont;
    }


    /**
     * Switch all cont
     */
    function switchAllCont(node, nodeId) {
        var switchall_cont = false;
        if (0x27 in node.instances[0].commandClasses) {
            var uTime = node.instances[0].commandClasses[0x27].data.mode.updateTime;
            var iTime = node.instances[0].commandClasses[0x27].data.mode.invalidateTime;
            var updateTime = $filter('isTodayFromUnix')(uTime);
            var isUpdated = (uTime > iTime ? true : false);

            var gui_descr = getMethodSpec($scope.ZWaveAPIData, nodeId, 0, 0x27, 'Set');
            var switchall_conf_value;
            var switchall_conf_el;
            var switchall_config = null;
            if (switchall_config) {
                switchall_conf_value = 1;
            } else {
                switchall_conf_value = 1; // by default switch all off group only
            }
            switchall_cont = {
                'params': gui_descr,
                'values': {0: switchall_conf_value},
                updateTime: updateTime,
                isUpdated: isUpdated,
                defaultValue: switchall_conf_value,
                cmd: 'devices[' + nodeId + '].instances[0].commandClasses[0x27]'
            };
        }
        ;
        return switchall_cont;
    }

    /**
     * Protection cont
     */
    function protectionCont(node, nodeId) {
        var protection_cont = false;
        if (0x75 in node.instances[0].commandClasses) {
            var uTime = node.instances[0].commandClasses[0x75].data.state.updateTime;
            var iTime = node.instances[0].commandClasses[0x75].data.state.invalidateTime;
            var updateTime = $filter('isTodayFromUnix')(uTime);
            var isUpdated = (uTime > iTime ? true : false);

            var gui_descr = getMethodSpec($scope.ZWaveAPIData, nodeId, 0, 0x75, 'Set');

            var protection_version = node.instances[0].commandClasses[0x75].data.version.value;
            var protection_config = null;
            var protection_conf_value;
            var protection_conf_rf_value;
            var protection_conf_el;
            if (protection_config) {
                protection_conf_value = 0;
                protection_conf_rf_value = 0;
            } else {
                protection_conf_value = 0; // by default protection is disabled
                protection_conf_rf_value = 0; // by default protection is disabled
            }

            protection_cont = {
                'params': gui_descr,
                'values': {0: protection_conf_value},
                updateTime: updateTime,
                isUpdated: isUpdated,
                defaultValue: protection_conf_value,
                cmd: 'devices[' + nodeId + '].instances[0].commandClasses[0x75]'
            };
        }
        ;
        return protection_cont;
    }

    /**
     * Fwupdate cont
     */
    function fwupdateCont(node) {
        var fwupdate_cont = null;
        if (0x7a in node.instances[0].commandClasses) {
            fwupdate_cont = true;
        }
        ;
        return fwupdate_cont;
    }

    /**
     * Assoc cont
     */
    function assocCont(node) {
        var assoc_cont = null;
        if (0x85 in node.instances[0].commandClasses) {
            assoc_cont = true;
        }
        ;
        return assoc_cont;
    }
    /**
     * Build expert commands
     * @returns {Array}
     */
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
            //console.log(cmd['data']);
        });
        return methodsArr;
    }
    ;


});

// Device config update controller
appController.controller('ConfigStoreController', function($scope, DataFactory) {
    // Store data on remote server
    $scope.store = function(btn) {
        //$(btn).attr('disabled', true);
        var url = $scope.cfg.server_url + $scope.cfg.store_url + $(btn).attr('data-store-url');
        DataFactory.store($(btn).attr('data-store-url')).query();
//        if($(btn).attr('data-redirect')){
//           $location.path('/config/configuration/' + $(btn).attr('data-redirect'));
//        }


//        $timeout(function() {
//            $(btn).removeAttr('disabled');
//        }, 1000);
    };

    // Show modal dialog
    $scope.showModalInterview = function(target) {
        $(target).modal();
    };

    /**
     * Rename Device action
     * 
     * @param {object} form
     * @returns {undefined}
     */
    $scope.renameDevice = function(form) {
        var deviceId = $scope.deviceId;
        var givenName = $('#' + form + ' #device_name').val();
        var cmd = 'devices[' + deviceId + '].data.givenName.value=\'' + givenName + '\'';
        DataFactory.store(cmd).query();
        $('#config_device_name').html(givenName);
        $('#device_node_name').html(givenName);

        return;
    };
    /**
     * Update from device action
     * 
     * @param {string} cmd
     * @returns {undefined}
     */
    $scope.updateFromDevice = function(cmd) {
        DataFactory.store(cmd).query();
        return;
    };

    /**
     * Update from device - configuration section
     * 
     * @param {string} cmd
     * @param {obj} cfg
     * @returns {undefined}
     */
    $scope.updateFromDeviceCfg = function(cmd, cfg) {
         angular.forEach(cfg, function(v, k) {
            if (v.confNum) {
                var request = cmd + '(' + v.confNum + ')';
                 DataFactory.store(request).query();
            }
        });

        return;
    };

    /**
     * Apply Config action
     * 
     * @param {object} form
     * @returns {undefined}
     */
    $scope.submitApplyConfig = function(form, cmd) {
        var data = $('#' + form).serializeArray();
        var dataJoined = [];
        angular.forEach(data, function(v, k) {
            if (v.value !== '') {
                dataJoined.push(v.value);
            }

        });
        var request = cmd + '(' + dataJoined.join() + ')';
        DataFactory.store(request).query();
        return;
    };

    /**
     * Apply Config action
     * 
     * @param {object} form
     * @returns {undefined}
     */
    $scope.submitApplyConfigCfg = function(form, cmd, cfg) {
        var sections = $('#' + form).find('.cfg-control-content');
        var data = $('#' + form).serializeArray();
        var dataValues = [];

        angular.forEach(data, function(v, k) {
            if (v.value !== '') {
                dataValues.push({"value": v.value, "name": v.name});
                //dataValues.push(v.name);
            }

        });
        //console.log(cfg);
        angular.forEach(dataValues, function(n, nk) {
            var lastNum = n.name.match(/\d+$/);
            if (!lastNum) {
                return;
            }
            var num = lastNum[0];
            var confSize = 0;
            //var lastNum = n.name.match(/\d+$/);
            var value = n.value;
            angular.forEach(cfg, function(cv, ck) {
                if (cv.confNum == num) {
                    confSize = cv.confSize;
                    //dataValues.push(v.name);
                }

            });

            var request = cmd + '(' + num[0] + ',' + value + ',' + confSize + ')';
            console.log(request);
            //DataFactory.store(request).query();
        });

       return;
        
    };

    /**
     * Submit expert commands form
     * 
     * @param {obj} form
     * @param {obj} cmd
     * @returns {undefined}
     */
    $scope.submitExpertCommndsForm = function(form, cmd) {
        //var data = $('#' + form).serialize();
        var data = $('#' + form).serializeArray();
        var dataJoined = [];
        angular.forEach(data, function(v, k) {
            if (v.value !== '') {
                dataJoined.push(v.value);
            }

        });
        var request = cmd + '(' + dataJoined.join() + ')';
        DataFactory.store(request).query();
        return;

    };

});

// Controll controller
appController.controller('ControllController', function($scope, $filter, $route, $timeout, DataFactory, DataTestFactory, XmlFactory, myCache) {
    $scope.devices = [];
    $scope.failedNodes = [];
    $scope.replaceNodes = [];
    $scope.failedBatteries = [];
    $scope.controllerState = 0;
    $scope.secureInclusion;
    $scope.lastExcludedDevice;
    $scope.lastIncludedDevice;
    $scope.isRealPrimary;
    $scope.lastIncludedDevice = null;
    $scope.lastExcludedDevice = null;

    $scope.dataXml = [];
    $scope.deviceXml;

    //Load xml data
    setXml = function(data) {
        var lang = 'en';
        angular.forEach(data.DeviceClasses.Generic, function(val, key) {
            var obj = {};
            var langs = {
                "en": "0",
                "de": "1",
                "ru": "2"
            };

            if (angular.isDefined(langs[$scope.lang])) {
                lang = $scope.lang;
            }
            var langId = 0;

            obj['id'] = parseInt(val._id);
            obj['generic'] = val.name.lang[langId].__text;
            obj['specific'] = val.Specific;
            obj['langId'] = langId;
            $scope.dataXml.push(obj);

        });

    };



    /**
     * Load data
     * 
     */
    $scope.loadData = function(ZWaveAPIData) {
        $scope.showContent = true;
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        $scope.controllerState = ZWaveAPIData.controller.data.controllerState.value;
        $scope.secureInclusion = ZWaveAPIData.controller.data.secureInclusion.value;
        $scope.isRealPrimary = !ZWaveAPIData.controller.data.isRealPrimary.value || ZWaveAPIData.devices.length <= 2 ? true : false;
        /**
         * Loop throught devices
         */
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }
            $scope.devices.push({"id": nodeId, "name": node.data.name});

        });
        /**
         * Loop throught failed nodes
         */
        if (ZWaveAPIData.controller.data.isPrimary.value) {
            angular.forEach(ZWaveAPIData.devices, function(dev, nodeId) {
                if (dev.data.isFailed.value) {
                    $scope.failedNodes.push({"id": nodeId});
                    $scope.replaceNodes.push({"id": nodeId});
                }
                //if (dev.data.isFailed.value || (!dev.data.isListening.value && !dev.data.isFailed.value)) {
                if (!dev.data.isListening.value && !dev.data.isFailed.value) {
                    $scope.failedBatteries.push({"id": nodeId});
                }

            });
        }
        ;


    };

    // Chaching data  
    var cachedAPIData = myCache.get('ZWaveAPIData');
    if (cachedAPIData) {
        $scope.loadData(cachedAPIData);
        console.log('Cached ZWaveAPIData');
    } else {
        DataFactory.all('0').query(function(ZWaveAPIData) {
            myCache.put('ZWaveAPIData', ZWaveAPIData);
            $scope.loadData(ZWaveAPIData);
        });
        console.log('NO CACHED ZWaveAPIData');
    }

    // Chaching  xml data  
    var cachedDeviceClasses = myCache.get('deviceClasses');
    if (cachedDeviceClasses) {
        $scope.deviceXml = cachedDeviceClasses;
        console.log('Cached XML');
    } else {
        XmlFactory.get($scope.setXml, $scope.cfg.server_url + '/translations/DeviceClasses.xml');
        $scope.deviceXml = $scope.dataDeviceClassesXml;
        myCache.put('deviceClasses', $scope.dataDeviceClassesXml);
        console.log('NO CACHED XML');
    }

    /**
     * Load data
     * todo: remove it
     */
    $scope.load = function() {
        DataFactory.all('0').query(function(ZWaveAPIData) {
            //DataTestFactory.all('all.json').query(function(ZWaveAPIData) {
            $scope.showContent = true;
            var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
            $scope.controllerState = ZWaveAPIData.controller.data.controllerState.value;
            $scope.secureInclusion = ZWaveAPIData.controller.data.secureInclusion.value;
            $scope.isRealPrimary = !ZWaveAPIData.controller.data.isRealPrimary.value || ZWaveAPIData.devices.length <= 2 ? true : false;
            /**
             * Loop throught devices
             */
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                    return;
                }
                $scope.devices.push({"id": nodeId, "name": node.data.name});

            });
            /**
             * Loop throught failed nodes
             */
            if (ZWaveAPIData.controller.data.isPrimary.value) {
                angular.forEach(ZWaveAPIData.devices, function(dev, nodeId) {
                    if (dev.data.isFailed.value) {
                        $scope.failedNodes.push({"id": nodeId});
                        $scope.replaceNodes.push({"id": nodeId});
                    }
                    //if (dev.data.isFailed.value || (!dev.data.isListening.value && !dev.data.isFailed.value)) {
                    if (!dev.data.isListening.value && !dev.data.isFailed.value) {
                        $scope.failedBatteries.push({"id": nodeId});
                    }

                });
            }
            ;

        });
    };
    //$scope.load();

    // Refresh data
    var refresh = function() {
        DataFactory.all($filter('getTimestamp')).query(function(data) {
            //DataTestFactory.all('refresh_net.json').query(function(data) {
            if ('controller.data.controllerState' in data) {
                $scope.controllerState = data['controller.data.controllerState'].value;
            }
            if ('controller.data.lastExcludedDevice' in data) {
                $scope.lastExcludedDevice = data['controller.data.lastExcludedDevice'].value;
            }

            if ('controller.data.lastIncludedDevice' in data) {
                $scope.lastIncludedDevice = data['controller.data.lastIncludedDevice'].value;

            }
            if ('controller.data.secureInclusion' in data) {
                $scope.secureInclusion = data['controller.data.secureInclusion'].value;

            }
            if ('controller.data.lastIncludedDevice' in data) {
                var deviceIncId = data['controller.data.lastIncludedDevice'].value;
                //device .data.givenNAME:uPDATE
                //XmlFactory.get(setXml, $scope.cfg.server_url + '/translations/DeviceClasses.xml');
                if (deviceIncId != null) {

                    var givenName = 'Device' + '_' + deviceIncId;
                    var node = data.devices[deviceIncId];
                    // Device type
                    var deviceXml = $scope.deviceXml;
                    if (angular.isDefined(data.devices[deviceIncId])) {
                        var genericType = node.data.genericType.value;
                        var specificType = node.data.specificType.value;
                        angular.forEach(deviceXml, function(v, k) {
                            if (genericType == v.id) {
                                var deviceType = v.generic;
                                angular.forEach(v.specific, function(s, sk) {
                                    if (specificType == s._id) {
                                        if (angular.isDefined(s.name.lang[v.langId].__text)) {
                                            deviceType = s.name.lang[v.langId].__text;
                                        }
                                    }
                                });
                                givenName = deviceType + '_' + deviceIncId;
                                return;
                            }
                        });
                    }
                    var updateTime = $filter('isTodayFromUnix')(data['controller.data.lastIncludedDevice'].updateTime);

                    //Run CMD
                    var cmd = 'devices[' + deviceIncId + '].data.givenName.value=\'' + givenName + '\'';
                    DataFactory.store(cmd).query();
                    $scope.lastIncludedDevice = $scope._t('nm_last_included_device') + '  (' + updateTime + ')  <a href="#config/configuration/' + deviceIncId + '"><strong>' + givenName + '</strong></a>';
                }


            }
            //$scope.lastIncludedDevice = '<a href="#config/configuration/3"><strong>Given_name</strong></a>';
            if ('controller.data.lastExcludedDevice' in data) {
                var deviceExcId = data['controller.data.lastExcludedDevice'].value;
                if (deviceExcId != null) {
                    var updateTime = $filter('isTodayFromUnix')(data['controller.data.lastExcludedDevice'].updateTime);
                    //var txt = $scope._t('nm_last_excluded_device') + ' ' + (deviceExcId != 0 ? deviceExcId : $scope._t('nm_last_excluded_device_from_foreign_network'));
                    if (deviceExcId != 0) {
                        var txt = 'Device # ' + deviceExcId + 'excluded from network';
                    } else {
                        var txt = 'Device excluded ' + $scope._t('nm_last_excluded_device_from_foreign_network');
                    }
                    $scope.lastExcludedDevice = txt + ' (' + updateTime + ')';
                }
            }


        });
        $timeout(refresh, $scope.cfg.interval);
    };
    $timeout(refresh, $scope.cfg.interval);

    /**
     * Show modal window
     * 
     * @returns {void}
     */
    $scope.showModal = function(target) {
        $(target).modal();
        return;
    };


    /**
     * Run command
     * 
     * @returns {void}
     */
    $scope.runCmd = function(cmd, hideModal, url) {
        var folder = (url ? url : '/ZWaveAPI/Run/');
        if (angular.isArray(cmd)) {
            angular.forEach(cmd, function(v, k) {
                DataFactory.runCmd(folder + v).query();
                //DataFactory.debug(folder + v);
            });
        } else {
            //runCmdFactory.debug(cmd);
            DataFactory.runCmd(folder + cmd).query();
            //DataFactory.debug(folder + cmd);
        }
        if (hideModal) {
            $(hideModal).modal('hide');
        }
//        if (reload) {
//            $timeout(function() {
//                $route.reload();
//                //location.reload();
//            }, 1000);
//        }

        return;
    };

    /**
     * Send request restore backup
     * 
     * @todo: Reload after success function
     * 
     * @returns {void}
     */
    $scope.restoreBackup = function(cmd) {
        //var url = 'controller.SetDefault()';
        // http://192.168.10.167:8083/ZWaveAPI/Restore?restore_chip_info=0"
        var url = 'Restore?restore_chip_info=0';
        DataFactory.runCmd('/ZWaveAPI/' + cmd).query();

        return;
    };

    /**
     * Send request NIF from all devices
     * 
     * @returns {void}
     */
    $scope.requestNifAll = function(btn) {
        angular.forEach($scope.devices, function(v, k) {
            var url = 'devices[' + v.id + '].RequestNodeInformation()';
            DataFactory.store(url).query();
        });
        return;
    };
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
appController.controller('ControllerController', function($scope, DataFactory, myCache) {
   $scope.funcList;
   $scope.ZWaveAPIData;
   $scope.info = {};
    
    /**
     * Load data
     * 
     */
    $scope.loadData = function(ZWaveAPIData) {
        $scope.ZWaveAPIData = ZWaveAPIData;
//        if (path == 'controller.data.nonManagmentJobs')
//		return; // we don't want to redraw this page on each (de)queued packet
            
        var homeId = ZWaveAPIData.controller.data.homeId.value;
	var nodeId = ZWaveAPIData.controller.data.nodeId.value;

	var canAdd = ZWaveAPIData.controller.data.isPrimary.value;
	var isRealPrimary = ZWaveAPIData.controller.data.isRealPrimary.value;
	var haveSIS = ZWaveAPIData.controller.data.SISPresent.value;
	//var isSUC = ZWaveAPIData.controller.data.isSUC.value;
	var SUCNodeID = ZWaveAPIData.controller.data.SUCNodeId.value;

	var vendor = ZWaveAPIData.controller.data.vendor.value;
	var ZWChip = ZWaveAPIData.controller.data.ZWaveChip.value;
	var productId = ZWaveAPIData.controller.data.manufacturerProductId.value;
	var productType = ZWaveAPIData.controller.data.manufacturerProductType.value;

	var sdk = ZWaveAPIData.controller.data.SDK.value;
	var libType = ZWaveAPIData.controller.data.libType.value;
	var api = ZWaveAPIData.controller.data.APIVersion.value;
	
	var revId = ZWaveAPIData.controller.data.softwareRevisionId.value;
	var revVer = ZWaveAPIData.controller.data.softwareRevisionVersion.value;
	var revDate = ZWaveAPIData.controller.data.softwareRevisionDate.value;
        
        var obj = {};
        $scope.info['ctrl_info_nodeid_value'] = nodeId;
	$scope.info['ctrl_info_homeid_value'] = '0x' + ('00000000' + (homeId + (homeId < 0 ? 0x100000000 : 0)).toString(16)).slice(-8);
	$scope.info['ctrl_info_primary_value'] = canAdd?'yes':'no';
	$scope.info['ctrl_info_real_primary_value'] = isRealPrimary?'yes':'no';
	$scope.info['ctrl_info_suc_sis_value'] = (SUCNodeID != 0)?(SUCNodeID.toString() + ' (' + (haveSIS?'SIS':'SUC') + ')'):$scope._t('nm_suc_not_present');

	$scope.info['ctrl_info_hw_vendor_value'] = vendor;
	$scope.info['ctrl_info_hw_product_value'] = productType.toString() + " / " + productId.toString();
	$scope.info['ctrl_info_hw_chip_value'] = ZWChip;

	$scope.info['ctrl_info_sw_lib_value'] = libType;
	$scope.info['ctrl_info_sw_sdk_value'] = sdk;
	$scope.info['ctrl_info_sw_api_value'] = api;

	$scope.info['ctrl_info_sw_rev_ver_value'] = revVer;
	$scope.info['ctrl_info_sw_rev_id_value'] = revId;
	$scope.info['ctrl_info_sw_rev_date_value'] = revDate;
        
        /**
         * Function list
         */
        var funcList = '';
	var _fc = array_unique(ZWaveAPIData.controller.data.capabilities.value.concat(ZWaveAPIData.controller.data.functionClasses.value));
	_fc.sort(function(a,b) { return a - b });
	angular.forEach(_fc, function ( func,index) {
		var fcIndex = ZWaveAPIData.controller.data.functionClasses.value.indexOf(func);
		var capIndex = ZWaveAPIData.controller.data.capabilities.value.indexOf(func);
		var fcName = (fcIndex != -1) ? ZWaveAPIData.controller.data.functionClassesNames.value[fcIndex] : 'Not implemented';
		funcList += '<span style="color: ' + ((capIndex != -1) ? ((fcIndex != -1) ? '' : 'gray') : 'red') + '">' + fcName + ' (0x' + ('00' + func.toString(16)).slice(-2) + ')</span>, ';
	});
        $scope.funcList = funcList;

    };

    // Chaching data  
    var cachedAPIData = myCache.get('ZWaveAPIData');
    if (cachedAPIData) {
        $scope.loadData(cachedAPIData);
    } else {
        DataFactory.all('0').query(function(ZWaveAPIData) {
            myCache.put('ZWaveAPIData', ZWaveAPIData);
            $scope.loadData(ZWaveAPIData);
        });
    }
    /**
     * 
     * Run cmd
     */
    $scope.runCmd = function(cmd){
        DataFactory.store(cmd).query();
    };

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
                obj['name'] = $filter('deviceName')(nodeId, node);
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
appController.controller('CommandsDetailController', function($scope, $routeParams, $filter, $location, $cookies, $timeout, DataFactory, DataTestFactory) {
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
            //DataTestFactory.all('all.json').query(function(ZWaveAPIData) {
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
                obj['name'] = $filter('deviceName')(nodeId, node);
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
            //DataTestFactory.all('all.json').query(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;

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
                    obj['cmd'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                    obj['cmdData'] = ZWaveAPIData.devices[nodeId].instances[instanceId].commandClasses[ccId].data;
                    obj['cmdDataIn'] = ZWaveAPIData.devices[nodeId].instances[instanceId].data;
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
            //console.log(cmd['data']);
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
            obj['name'] = v.name;
            devices.push(obj);
        });
        return devices;
    };

    // Redirect to another device
    $cookies.expert_commands_id = $routeParams.nodeId;
    $scope.goToDetail = function(detailId) {
        $location.path('/expert/commands/' + detailId);
    };

    // Store single data on remote server
    $scope.submitForm = function(form, cmd) {
        //var data = $('#' + form).serialize();
        var data = $('#' + form).serializeArray();
        var dataJoined = [];
        angular.forEach(data, function(v, k) {
            if (v.value !== '') {
                dataJoined.push(v.value);
            }

        });
        var request = cmd + '(' + dataJoined.join() + ')';
        DataFactory.store(request).query();
        console.log(request);
        return;

    };

});

// Command class modal window controller
appController.controller('CommandModalController', function($scope, $filter) {
    // Show modal dialog
    $scope.showModal = function(target, data) {
        // Modal example http://plnkr.co/edit/D29YjKGbY63OSa1EeixT?p=preview
        $(target).modal();
        // Formated output
        var getCmdData = function(data, space) {
            var html = '<div class="data-element">' + space + data.name + ': <span class="' + ((data.updateTime > data.invalidateTime) ? 'green' : 'red') + '">' + ((typeof (data.value) !== 'undefined' && data.value != null) ? data.value.toString() : 'None') + '</span>' + ' (<span class="' + ((data.updateTime > data.invalidateTime) ? '' : 'red') + '">' + $filter('isTodayFromUnix')(data.updateTime) + '</span>)</div>';
            return html;
        };

        // Get data
        var html = getCmdData(data, '');

        angular.forEach(data, function(el, key) {
            if (key != 'name' && key != 'type' && key != 'updateTime' && key != 'invalidateTime' && key != 'value' && // these are internal values
                    key != 'capabilitiesNames') { // these make the dialog monstrious
                html += getCmdData(el, '');
                angular.forEach(el, function(v, k) {
                    if (angular.isObject(v)) {
                        html += getCmdData(v, ' - ');
                    }

                });
            }
        });

        // Fill modal with data
        $(target).on('shown.bs.modal', function() {
            $(target + ' .modal-body').html(html);
        });
    };

});

