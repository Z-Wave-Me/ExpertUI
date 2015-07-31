/**
 * Application controllers and factories
 * @author Martin Vach
 */

/*** Controllers ***/
var appController = angular.module('appController', []);

// Base controller
appController.controller('BaseController', function($scope, $cookies, $filter, $location, $anchorScroll, $window, $route, cfg, dataService, deviceService, myCache) {
    // Custom IP
    $scope.customIP = {
        'url': cfg.server_url,
        'message': false,
        'connected': false
    };
    $scope.showHome = true;
    if (cfg.custom_ip === true) {
        $scope.showHome = false;
    }
    // Is mobile
    $scope.isMobile = false;

    // Url array
    $scope.urlArray = [];


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
        $window.alert($scope._t('language_select_reload_interface'));
        $cookies.lang = lang;
        $scope.lang = lang;
    };
    // Load language files
    $scope.loadLang = function(lang) {
        // Is lang in language list?
        var lang = (cfg.lang_list.indexOf(lang) > -1 ? lang : cfg.lang);
        dataService.getLanguageFile(function(data) {
            $cookies.langFile = {'ab': 25};
            $scope.languages = data;
        }, lang);


    };
    // Get language lines
    $scope._t = function(key) {
        return deviceService.getLangLine(key, $scope.languages);
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
    // Get body ID
    $scope.getBodyId = function() {
        var path = $location.path();
        var lastSegment = path.split('/').pop();
        $scope.urlArray = path.split('/');
        return lastSegment;
    };
    /*
     * Menu active class
     */
    $scope.isActive = function(route, segment) {
        var path = $location.path().split('/');
        return (route === path[segment] ? 'active' : '');
    };

    $scope.mobileCheck = function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            $scope.isMobile = true;
        }
    };
    $scope.mobileCheck(navigator.userAgent || navigator.vendor || window.opera);

    $scope.scrollTo = function(id) {
        $location.hash(id);
        $anchorScroll();
    };

    /**
     *Reload data
     */
    $scope.reloadData = function() {
        myCache.removeAll();
        $route.reload();
    };

});

// Test controller
appController.controller('TestController', function($scope, $filter, $interval, $timeout, dataService, _) {
    $scope.apiDataInterval;
    //$scope.devices = {};
    $scope.sucNodes = {};
    $scope.failedNodes = {};
    $scope.replaceNodes = {};
    $scope.failedBatteries = {};
    /**
     * Load data into collection
     */
    $scope.loadZwaveApiData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {

            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                $scope.failedNodes[nodeId] = {id: nodeId, name: $filter('deviceName')(nodeId, node)};
            });

            //return;
            var refresh = function() {
                var id = _.random(1, 7);
                var name = 'Test name ' + id + '_' + _.random(1000, 9999);
                var obj = {id: id, name: name};
                $scope.failedNodes[id] ? angular.extend($scope.failedNodes[id], obj) : $scope.failedNodes[id] = obj;
                //_.sortBy(arr, function(o) { return o.start.dateTime; })
                //console.log( _.sortBy($scope.failedNodes, function(v) { return v.id; }))
                dataService.loadJoinedZwaveData(ZWaveAPIData).then(function(response) {
                    console.log('Update ID ' + id + ' | ' + name)
                }, function(error) {
                    return;
                });
            };

            $scope.apiDataInterval = $interval(refresh, $scope.cfg.interval);
        }, function(error) {
            //dataService.showConnectionError(error);
            return;
        });
        return;
    };
    //$scope.loadZwaveApiData();

    /**
     * Load data
     */
    $scope.loadData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setControllerData(ZWaveAPIData);
            setDevicesData(ZWaveAPIData);
            $scope.refreshData(ZWaveAPIData);
        }, function(error) {
            //dataService.showConnectionError(error);
            return;
        });
        return;
    };
    $scope.loadData();

    /**
     * Refresh data
     */
    $scope.refreshData = function(ZWaveAPIData) {
        $scope.failedBatteries;
        var refresh = function() {
            dataService.loadJoinedZwaveData(ZWaveAPIData).then(function(response) {
                setControllerData(response.data.joined);
                setDevicesData(response.data.joined);
                setInclusionData(response.data.update);
            }, function(error) {
                return;
            });
        };
        $scope.apiDataInterval = $interval(refresh, $scope.cfg.interval);
    };


    /// --- Private functions --- ///

    /**
     * Set controller data
     */
    function setControllerData(ZWaveAPIData) {
        $scope.showContent = true;
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        var isPrimary = ZWaveAPIData.controller.data.isPrimary.value;
        var isRealPrimary = ZWaveAPIData.controller.data.isRealPrimary.value;
        var isSIS = ZWaveAPIData.controller.data.SISPresent.value;
        var hasSUC = ZWaveAPIData.controller.data.SUCNodeId.value;
        var hasDevices = Object.keys(ZWaveAPIData.devices).length;
        $scope.controllerState = ZWaveAPIData.controller.data.controllerState.value;
        $scope.secureInclusion = ZWaveAPIData.controller.data.secureInclusion.value;
        $scope.startLearnMode = !isRealPrimary || hasDevices < 2 ? true : false;
        $scope.isPrimary = isPrimary;
        $scope.isSIS = isSIS;
        if (hasSUC && hasSUC != controllerNodeId) {
            $scope.disableSUCRequest = false;
        }

        /* console.log('Controller isPrimary: ' + isPrimary);
         console.log('Controller isSIS: ' + isSIS);
         console.log('and there are other devices: ' + hasDevices + ' - ' + (hasDevices > 1 ? 'true' : 'false'));
         console.log('Learn mode: ' + $scope.startLearnMode);*/

    }
    /**
     * Set devices data
     */
    function setDevicesData(ZWaveAPIData) {

        var obj;
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            obj = {id: nodeId, name: $filter('deviceName')(nodeId, node)}
            if (nodeId == 255 || nodeId == ZWaveAPIData.controller.data.nodeId.value || node.data.isVirtual.value) {
                return;
            }
            // DEPRECATED
            // Devices
            /*if (!$scope.devices[nodeId]) {
             $scope.devices[nodeId] = obj;
             }*/

            // SUC
            if (node.data.basicType.value == 2) {
                if (!$scope.sucNodes[nodeId]) {
                    $scope.sucNodes[nodeId] = obj;
                }
            }

            // Failed and Batteries nodes
            if (ZWaveAPIData.controller.data.isPrimary.value) {
                if (node.data.isFailed.value) {
                    if (!$scope.failedNodes[nodeId]) {
                        $scope.failedNodes[nodeId] = obj;
                    }
                    if (!$scope.replaceNodes[nodeId]) {
                        $scope.replaceNodes[nodeId] = obj;
                    }
                }
                if (!node.data.isListening.value && !node.data.isFailed.value) {
                    if (!$scope.failedBatteries[nodeId]) {
                        $scope.failedBatteries[nodeId] = obj;
                    }
                }
            }
            ;
        });
    }

    /**
     * Set inclusion data
     */
    function setInclusionData(data) {
        if ('controller.data.controllerState' in data) {
            $scope.controllerState = data['controller.data.controllerState'].value;
        }
        console.log('Controller state: ' + $scope.controllerState);

        // console.log('Learn mode 2: ' + $scope.learnMode);
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

            if (deviceIncId != null) {

                var givenName = 'Device_' + deviceIncId;
                var node = data.devices[deviceIncId];
                // Device type
                var deviceXml = $scope.deviceClasses;
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
                dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
                $scope.lastIncludedDevice = $scope._t('nm_last_included_device') + '  (' + updateTime + ')  <a href="#configuration/interview/' + deviceIncId + '"><strong>' + givenName + '</strong></a>';
            }


        }
        if ('controller.data.lastExcludedDevice' in data) {
            var deviceExcId = data['controller.data.lastExcludedDevice'].value;
            if (deviceExcId != null) {
                var updateTime = $filter('isTodayFromUnix')(data['controller.data.lastExcludedDevice'].updateTime);
                //var txt = $scope._t('nm_last_excluded_device') + ' ' + (deviceExcId != 0 ? deviceExcId : $scope._t('nm_last_excluded_device_from_foreign_network'));
                if (deviceExcId != 0) {
                    var txt = $scope._t('txt_device') + ' # ' + deviceExcId + ' ' + $scope._t('nm_excluded_from_network');
                } else {
                    var txt = $scope._t('nm_last_excluded_device_from_foreign_network');
                }
                $scope.lastExcludedDevice = txt + ' (' + updateTime + ')';
            }
        }
    }
    ;

});

// Statistics controller
appController.controller('HelpController', function($scope, $routeParams) {
    $scope.nodeId = $routeParams.nodeId;
});

// Home controller
appController.controller('HomeController', function($scope, $filter, $timeout, $route, dataService, deviceService, cfg) {
    $scope.ZWaveAPIData;
    $scope.countDevices;
    $scope.failedDevices = [];
    $scope.batteryDevices;
    $scope.lowBatteryDevices = [];
    $scope.flirsDevices;
    $scope.mainsDevices;
    $scope.localyResetDevices = [];
    $scope.notInterviewDevices = [];
    $scope.assocRemovedDevices = [];
    $scope.notConfigDevices = [];
    $scope.notes = [];
    $scope.notesData = '';
    $scope.updateTime = $filter('getTimestamp');

    $scope.reset = function() {
        $scope.failedDevices = angular.copy([]);
        $scope.lowBatteryDevices = angular.copy([]);
        $scope.notInterviewDevices = angular.copy([]);
        $scope.localyResetDevices = angular.copy([]);
        $scope.assocRemovedDevices = angular.copy([]);
        $scope.notConfigDevices = angular.copy([]);

    };


    /**
     * Notes
     */
    $scope.loadNotesData = function() {
        dataService.getNotes(function(data) {
            $scope.notesData = data;
        });
    };


    /**
     * Load data
     *
     */
    $scope.loadData = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            notInterviewDevices(ZWaveAPIData);
            notInterviewDevices(ZWaveAPIData);
            countDevices(ZWaveAPIData);
            assocRemovedDevices(ZWaveAPIData);
            notConfigDevices(ZWaveAPIData);
            batteryDevices(ZWaveAPIData);
            $scope.mainsDevices = $scope.countDevices - $scope.batteryDevices;
            dataService.joinedZwaveData(function(data) {
                $scope.reset();
                notInterviewDevices(data.joined);
                countDevices(data.joined);
                assocRemovedDevices(data.joined);
                //notConfigDevices(ZWaveAPIData);
                batteryDevices(data.joined);
                $scope.mainsDevices = $scope.countDevices - $scope.batteryDevices;

            });
        });
    };
    if (!cfg.custom_ip) {
        $scope.loadData();
        $scope.loadNotesData();
    } else {
        if (cfg.server_url != '') {
            $scope.loadData();
            $scope.loadNotesData();
        }
    }


    /**
     * Set custom IP
     */
    $scope.setIP = function(ip) {
        if (!ip || ip == '') {
            $('.custom-ip-error').show();
            return;
        }
        dataService.cancelZwaveDataInterval();
        $('.custom-ip-success,.custom-ip-true .home-page').hide();
        var setIp = 'http://' + ip + ':8083';
        cfg.server_url = setIp;
        dataService.purgeCache();
        $scope.loadHomeData = true;
        //$scope.loadData();
        $route.reload();
//        $http.get(setIp)
//                .success(function(data, status, headers, config) {
//                    dataService.purgeCache();
//                    cfg.server_url = setIp;
//                    $scope.showHome = true;
//                    $scope.customIP.message = false;
//                     $scope.customIP.connected = 'Connected to: ' + setIp;
//                    $route.reload();
//                }).error(function(data, status, headers, config) {
//            $scope.showHome = false;
//            $scope.customIP.message = 'Server error';
//            $scope.customIP.connected = false;
//        });

//        dataService.getZwaveData(function(ZWaveAPIData) {
//        });
    };

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });
    /**
     * Save notes
     */
    $scope.saveNotes = function(form, btn) {
        var input = $('#' + form + ' #note').val();
        if (!input || input == '') {
            return;
        }
        $(btn).attr('disabled', true);
        dataService.putNotes(input);

        $timeout(function() {
            $(btn).removeAttr('disabled');
        }, 2000);
        return;


    };

    /// --- Private functions --- ///

    /**
     * Count devices
     */
    function countDevices(ZWaveAPIData) {
        var cnt = 0;
        var cntFlirs = 0;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {

            if (deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
            var isFLiRS = deviceService.isFLiRS(node);
            var isLocalyReset = deviceService.isLocalyReset(node);
            var isFailed = deviceService.isFailed(node);

            if (isFLiRS) {
                cntFlirs++;
            }

            var obj = {};
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['id'] = nodeId;
            if (isFailed) {
                $scope.failedDevices.push(obj);
            }
            if (isLocalyReset) {
                $scope.localyResetDevices.push(obj);
            }

            cnt++;
        });
        $scope.flirsDevices = cntFlirs;
        $scope.countDevices = cnt;
    }
    ;

    /**
     * batteryDevices
     */
    function batteryDevices(ZWaveAPIData) {
        var controllerId = ZWaveAPIData.controller.data.nodeId.value;
        var cnt = 0;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerId || node.data.isVirtual.value) {
                return;
            }
            var hasBattery = 0x80 in node.instances[0].commandClasses;
            var instanceId = 0;
            var interviewDone = false;
            var ccId = 0x80;
            if (!hasBattery) {
                return;
            }
            // Is interview done
            for (var iId in ZWaveAPIData.devices[nodeId].instances) {
                for (var ccId in ZWaveAPIData.devices[nodeId].instances[iId].commandClasses) {
                    var isDone = ZWaveAPIData.devices[nodeId].instances[iId].commandClasses[ccId].data.interviewDone.value;
                    if (isDone != false) {
                        interviewDone = true;
                    }
                }
            }
            var node = ZWaveAPIData.devices[nodeId];
            var battery_charge = parseInt(node.instances[0].commandClasses[0x80].data.last.value);
            var obj = {};
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['id'] = nodeId;
            obj['battery_charge'] = battery_charge;
            if (battery_charge <= 20 && interviewDone) {
                $scope.lowBatteryDevices.push(obj);
            }
            cnt++;
        });
        $scope.batteryDevices = cnt;
    }
    ;

    /**
     * notInterviewDevices
     */
    function notInterviewDevices(ZWaveAPIData) {
        var controllerId = ZWaveAPIData.controller.data.nodeId.value;
        var cnt = 0;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerId || node.data.isVirtual.value) {
                return;
            }
            var obj = {};
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['id'] = nodeId;
            for (var iId in ZWaveAPIData.devices[nodeId].instances) {
                for (var ccId in ZWaveAPIData.devices[nodeId].instances[iId].commandClasses) {
                    var isDone = ZWaveAPIData.devices[nodeId].instances[iId].commandClasses[ccId].data.interviewDone.value;
                    if (isDone == false) {
                        $scope.notInterviewDevices.push(obj);
                        return;
                    }
                }
            }
            cnt++;
        });
        return cnt;
    }
    ;

    /**
     * notInterviewDevices
     */
    function notConfigDevices(ZWaveAPIData) {
        var controllerId = ZWaveAPIData.controller.data.nodeId.value;
        var cnt = 0;
        var cnt = 0;
        // Loop throught devices
        dataService.getCfgXml(function(cfgXml) {
            angular.forEach(cfgXml.config.devices.deviceconfiguration, function(cfg, cfgId) {
                var node = ZWaveAPIData.devices[cfg['_id']];
                if (!node) {
                    return;
                }
                var array = JSON.parse(cfg['_parameter']);
                var cfgNum = 0;
                var cfgVal;
                var devVal;
                if (array.length > 2) {
                    cfgNum = array[0];
                    cfgVal = array[1];
                    if (node.instances[0].commandClasses[0x70].val) {
                        devVal = node.instances[0].commandClasses[0x70].data[cfgNum].val.value;
                        if (cfgVal != devVal) {
                            var obj = {};
                            obj['name'] = $filter('deviceName')(cfg['_id'], node);
                            obj['id'] = cfg['_id'];
                            $scope.notConfigDevices.push(obj);
                        }
                    }


                }
            });
        });
    }
    ;
    /**
     * assocRemovedDevices
     */
    function assocRemovedDevices(ZWaveAPIData) {
        var controllerId = ZWaveAPIData.controller.data.nodeId.value;
        var cnt = 0;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerId || node.data.isVirtual.value) {
                return;
            }
            var removedDevices = assocGedRemovedDevices(node, ZWaveAPIData);
            if (removedDevices.length > 0) {

                var obj = {};
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['id'] = nodeId;
                obj['assoc'] = removedDevices;
                $scope.assocRemovedDevices.push(obj);
                cnt++;
            }
        });
        return cnt;
    }
    ;

    /**
     * assocGedRemovedDevices
     */
    function assocGedRemovedDevices(node, ZWaveAPIData) {
        var assocDevices = [];
        var data;
        if (0x85 in node.instances[0].commandClasses) {
            var cc = node.instances[0].commandClasses[0x85].data;
            if (cc.groups.value >= 1) {
                for (var grp_num = 1; grp_num <= parseInt(cc.groups.value, 10); grp_num++) {
                    data = cc[grp_num];
                    for (var i = 0; i < data.nodes.value.length; i++) {
                        var targetNodeId = data.nodes.value[i];
                        if (!(targetNodeId in ZWaveAPIData.devices)) {
                            assocDevices.push({'id': targetNodeId, 'name': '(#' + targetNodeId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])});
                        }
                    }

                }
            }
        }

        if (0x8e in node.instances[0].commandClasses) {
            var cc = node.instances[0].commandClasses[0x8e].data;
            if (cc.groups.value >= 1) {
                for (var grp_num = 1; grp_num <= parseInt(cc.groups.value, 10); grp_num++) {

                    data = cc[grp_num];

                    for (var i = 0; i < data.nodesInstances.value.length; i += 2) {
                        var targetNodeId = data.nodesInstances.value[i];
                        var targetInstanceId = data.nodesInstances.value[i + 1];
                        var instanceId = (targetInstanceId > 0 ? '.' + targetInstanceId : '');
                        if (!(targetNodeId in ZWaveAPIData.devices)) {
                            assocDevices.push({'id': targetNodeId, 'name': '(#' + targetNodeId + instanceId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])});
                        }

                    }
                }
            }
        }
        if (assocDevices.length > 0) {
            //console.log(assocDevices)
        }

        return assocDevices;
    }
    ;
});

// Switch controller
appController.controller('SwitchController', function($scope, $filter, dataService, cfg) {
    $scope.switches = [];
    $scope.rangeSlider = [];
    $scope.updateTime = $filter('getTimestamp');
    $scope.reset = function() {
        $scope.switches = angular.copy([]);
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
    $scope.load();

    // Refresh data
    $scope.refresh = function() {
        dataService.joinedZwaveData(function(data) {
            $scope.reset();
            setData(data.joined);
        });
    };
    //$scope.refresh();

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    // Store data from on remote server
    $scope.store = function(btn) {
        var url = $(btn).attr('data-store-url');
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };

    // Store all data on remote server
    $scope.storeAll = function(id) {
        angular.forEach($scope.switches, function(v, k) {
            dataService.runCmd(v.urlToStore);
        });
    };

    // Store data with switch all
    $scope.storeSwitchAll = function(btn) {
        var action_url = $(btn).attr('data-store-url');
        angular.forEach($scope.switches, function(v, k) {
            var url = 'devices[' + v['id'] + '].instances[0].commandClasses[0x27].' + action_url;
            if (v.hasSwitchAll) {
                dataService.runCmd(url);
            }
        });
        ;
    };

    $scope.sliderChange = function(cmd, index) {
        var val = $scope.rangeSlider[index];
        var url = cmd + '.Set(' + val + ')';
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
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
                var genspecType = genericType + '/' + specificType;

                // Set object
                var obj = {};

                // Motor devices
                var btnOn = $scope._t('switched_on');
                var btnOff = $scope._t('switched_off');
                var btnFull = $scope._t('btn_full');
                var hasMotor = false;
                var motorDevices = ['17/3', '17/5', '17/6', '17/7', '9/0', ' 9/1'];
                if (motorDevices.indexOf(genspecType) !== -1) {
                    btnOn = $scope._t('btn_switched_up');
                    btnOff = $scope._t('btn_switched_down');
                    hasMotor = true;
                }
                //console.log(nodeId + '.' + instanceId + ': ' + genspecType + ' motor: ' + hasMotor);
                var multiChannel = false;
                if (0x60 in instance.commandClasses) {
                    multiChannel = true;
                }
                var level = updateLevel(instance.commandClasses[ccId].data.level, ccId, btnOn, btnOff);

                obj['id'] = nodeId;
                obj['cmd'] = instance.commandClasses[ccId].data.name + '.level';
                obj['iId'] = instanceId;
                obj['ccId'] = ccId;
                obj['hasMotor'] = hasMotor;
                obj['multiChannel'] = multiChannel;
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
                obj['levelMax'] = level.level_max;
                obj['levelVal'] = level.level_val;
                obj['urlToOff'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Set(0)';
                obj['urlToOn'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Set(255)';
                obj['urlToFull'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Set(99)';
                obj['urlToSlide'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                obj['btnOn'] = btnOn;
                obj['btnOff'] = btnOff;
                obj['btnFull'] = btnFull;
                obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.level';


                $scope.switches.push(obj);
                $scope.rangeSlider.push(obj['range_' + nodeId] = level.level_val);
                cnt++;
            });
        });
    }
    ;

    /**
     * Refresh zwave data
     */
    function refreshData(data) {
        angular.forEach($scope.switches, function(v, k) {
            //console.log(v.cmdToUpdate);
            //return;
            var obj = data.update[v.cmdToUpdate];
            if (v.cmdToUpdate in data.update) {
                var level = updateLevel(obj, v.ccId, v.btnOn, v.btnOff);
                var updateTime = obj.updateTime;
                var invalidateTime = obj.invalidateTime;
                var formatTime = $filter('isTodayFromUnix')(updateTime);
                $('#' + v.rowId + ' .row-level').html(level.level_cont).css({color: level.level_color});
                $('#' + v.rowId + ' .row-time').html(formatTime);
                if (updateTime > invalidateTime) {
                    $('#' + v.rowId + ' .row-time').removeClass('is-updated-false');
                }
                $("#the_item_id").css({backgroundColor: "#333", color: "#FFF"});
                //console.log('Updating:' + v.rowId + ' | At: ' + updateTime + ' | with: ' + level);//REM
            }
        });
    }

    // Update level
    function updateLevel(obj, ccId, btnOn, btnOff) {

        var level_cont;
        var level_color;
        var level_status = 'off';
        var level_val = 0;
        var level_max = 99;

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
                level_cont = btnOff;
                level_color = '#a94442';
            } else if (level === 255 || level === 99) {
                level_status = 'on';
                level_cont = btnOn;
                level_color = '#3c763d';
//                if(level > 99){
//                    level_max = 255;
//                }
                //level_val = level;
                level_val = (level < 100 ? level : 99);
            } else {
                level_cont = level.toString() + ((ccId == 0x26) ? '%' : '');
                var lvlc_r = ('00' + parseInt(0x9F + 0x60 * level / 99).toString(16)).slice(-2);
                var lvlc_g = ('00' + parseInt(0x7F + 0x50 * level / 99).toString(16)).slice(-2);
                level_color = '#' + lvlc_r + lvlc_g + '00';
                level_status = 'on';
                // level_val = level;
                level_val = (level < 100 ? level : 99);
            }
        }
        ;
        return {"level_cont": level_cont, "level_color": level_color, "level_status": level_status, "level_val": level_val, "level_max": level_max};
    }
    ;
});

/**
 * Sensors controller
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
                    level = (obj.value ? '<span class="sensor-triggered">' + $scope._t('sensor_triggered') + '</span>' : $scope._t('sensor_idle'));
                    updateTime = obj.level.updateTime;
                    invalidateTime = obj.level.invalidateTime;

                } else if (v.cmdId == 0x9c) {
                    level = (obj.sensorState.value ? '<span class="sensor-triggered">' + $scope._t('sensor_triggered') + '</span>' : $scope._t('sensor_idle'));
                    updateTime = obj.sensorState.updateTime;
                    invalidateTime = obj.sensorState.invalidateTime;

                }
                else {
                    level = obj.val.value;
                    updateTime = obj.val.updateTime;
                    invalidateTime = obj.val.invalidateTime;

                }

                // Update row
                $('#' + v.rowId + ' .row-level').html((level == null ? '' : level) + ' &nbsp;');
                $('#' + v.rowId + ' .row-time').html($filter('isTodayFromUnix')(updateTime));
                if (updateTime > invalidateTime) {
                    $('#' + v.rowId + ' .row-time').removeClass('is-updated-false');
                }
                console.log('Updating: ' + v.rowId + ' | At: ' + $filter('isTodayFromUnix')(updateTime) + ' | with: ' + level);//REM

            }
        });
    }
});

/**
 * Meters controller
 */
appController.controller('MetersController', function($scope, $filter, dataService) {
    $scope.meters = [];
    $scope.reset = function() {
        $scope.meters = angular.copy([]);
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

    $scope.load();

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    // Store data from meter on remote server
    $scope.store = function(cmd, action) {
        // Is clicked on RESET?
        if (action === 'reset' && !window.confirm($scope._t('are_you_sure_reset_meter'))) {
            return;
        }
        dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
    };

    // Store all data from sensors on remote server
    $scope.storeAll = function(id) {
        angular.forEach($scope.meters, function(v, k) {
            dataService.runCmd(v.urlToStore);
        });

    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
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

                // Look for Meter - Loop throught 0x32 commandClasses
                var meters = instance.commandClasses[0x32];
                if (angular.isObject(meters)) {
                    angular.forEach(meters.data, function(meter, key) {
                        realEMeterScales = [0, 1, 3, 8, 9];// Not in [0, 1, 3, 8, 9] !== -1
                        var scaleId = parseInt(key, 10);
                        if (isNaN(scaleId)) {
                            return;
                        }
                        if (meter.sensorType.value == 1 && realEMeterScales.indexOf(scaleId) === -1) {
                            return; // filter only for eMeters
                        }
                        if (meter.sensorType.value > 1) {
                            return; //  gas and water have real meter scales
                        }
                        var obj = {};
                        obj['id'] = k;
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
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[50].Get()';
                        obj['cmdToUpdate'] = 'devices.' + k + '.instances.' + instanceId + '.commandClasses.' + 0x32 + '.data.' + scaleId;
                        if (ZWaveAPIData.devices[obj['id']].instances[instanceId].commandClasses[0x32].data.version.value < 2
                                || !ZWaveAPIData.devices[obj['id']].instances[instanceId].commandClasses[0x32].data.resettable.value) {
                            obj['urlToReset'] = null;
                        } else {
                            obj['urlToReset'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[50].Reset()';
                        }

                        $scope.meters.push(obj);
                    });
                }

            });
        });
    }

    /**
     * Refresh zwave data
     */
    function refreshData(data) {
        angular.forEach($scope.meters, function(v, k) {
            var obj = data.update[v.cmdToUpdate];
            if (v.cmdToUpdate in data.update) {
                var level = obj.val.value;
                var updateTime = $filter('isTodayFromUnix')(obj.updateTime);
                $('#' + v.rowId + ' .row-level').html(level);
                $('#' + v.rowId + ' .row-time').html(updateTime);
                if (obj.updateTime > obj.invalidateTime) {
                    $('#' + v.rowId + ' .row-time').removeClass('is-updated-false');
                }
            }
        });
    }
});

// Thermostat controller
appController.controller('ThermostatController', function($scope, $filter, dataService) {
    $scope.thermostats = [];
    $scope.rangeSlider = [];
    $scope.mChangeMode = [];
    $scope.reset = function() {
        $scope.thermostats = angular.copy([]);
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
    $scope.load();

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });
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
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
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
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };
    // Change mode
    $scope.changeMode = function(cmd, mode) {
        if (!mode) {
            return;
        }
        var url = cmd + '.Set(' + mode + ')';
        dataService.runCmd(url);
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
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

                var ccId;
                var curThermMode = getCurrentThermostatMode(instance);
                var level = null;
                var hasExt = false;
                var changeTemperature = false;
                var updateTime;
                var invalidateTime;
                var modeType = null;
                var modeList = {};

                var hasThermostatMode = 0x40 in instance.commandClasses;
                var hasThermostatSetpoint = 0x43 in instance.commandClasses;
                var isThermostatMode = false;
                var isThermostatSetpoint = false;
                var hasThermostatSetback = 0x47 in instance.commandClasses;
                var hasClimateControlSchedule = 0x46 in instance.commandClasses;
                var curThermModeName = '';

                if (!hasThermostatSetpoint && !hasThermostatMode) { // to include more Thermostat* CCs
                    return; // we don't want devices without ThermostatSetpoint AND ThermostatMode CCs
                }
                //console.log( nodeId + ': ' + curThermMode);
                if (hasThermostatMode) {
                    ccId = 0x40;
                }
                else if (hasThermostatSetpoint) {
                    ccId = 0x43;

                }
                if (hasThermostatMode) {
                    curThermModeName = (curThermMode in instance.commandClasses[0x40].data) ? instance.commandClasses[0x40].data[curThermMode].modeName.value : "???";
                    modeList = getModeList(instance.commandClasses[0x40].data);
                    if (curThermMode in instance.commandClasses[0x40].data) {
                        updateTime = instance.commandClasses[0x40].data.mode.updateTime;
                        invalidateTime = instance.commandClasses[0x40].data.mode.invalidateTime;
                        modeType = 'hasThermostatMode';
                        isThermostatMode = true;

                    }
                }
                if (hasThermostatSetpoint) {
                    if (angular.isDefined(instance.commandClasses[0x43].data[curThermMode])) {
                        level = instance.commandClasses[0x43].data[curThermMode].setVal.value;
                        updateTime = instance.commandClasses[0x43].data[curThermMode].updateTime;
                        invalidateTime = instance.commandClasses[0x43].data[curThermMode].invalidateTime;
                        changeTemperature = true;
                        hasExt = true;
                        modeType = 'hasThermostatSetpoint';
                        isThermostatSetpoint = true;
                    }

                }

                // Set object
                var obj = {};

                obj['id'] = nodeId;
                obj['cmd'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.' + curThermMode;
                obj['ccId'] = ccId;
                obj['rowId'] = 'row_' + nodeId + '_' + cnt;
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['curThermMode'] = curThermMode;
                obj['changeTemperature'] = changeTemperature;
                obj['level'] = level;
                obj['hasExt'] = hasExt;
                obj['updateTime'] = updateTime;
                obj['invalidateTime'] = invalidateTime;
                obj['isUpdated'] = (updateTime > invalidateTime ? true : false);
                obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.' + curThermMode;
                obj['modeType'] = modeType;
                obj['isThermostatMode'] = isThermostatMode;
                obj['isThermostatSetpoint'] = isThermostatSetpoint;
                obj['modeList'] = modeList;
                $scope.thermostats.push(obj);
                $scope.rangeSlider.push(obj['range_' + nodeId] = obj['level']);
                //console.log(obj);
                cnt++;
            });
        });
    }

    /**
     * Refresh zwave data
     */
    function refreshData(data) {
        angular.forEach($scope.thermostats, function(v, k) {
            if (!v.modeType) {
                return;
            }
            var obj = data.update[v.cmdToUpdate];
            var level = null;
            var updateTime;
            var invalidateTime;
            if (!angular.isObject(data.update)) {
                return;
            }
            if (v.cmdToUpdate in data.update) {
                if (v.modeType == 'hasThermostatMode') {
                    updateTime = obj.mode.updateTime;
                    invalidateTime = obj.mode.invalidateTime;
                }
                if (v.modeType == 'hasThermostatSetpoint') {
                    updateTime = obj.updateTime;
                    invalidateTime = obj.invalidateTime;
                    level = obj.setVal.value;
                }
                var formatTime = $filter('isTodayFromUnix')(updateTime);
                $('#' + v.rowId + ' .row-level .level-val').html(level);
                $('#' + v.rowId + ' .row-time').html(formatTime);
                if (updateTime > invalidateTime) {
                    $('#' + v.rowId + ' .row-time').removeClass('is-updated-false');
                }
                console.log('Updating:' + v.rowId + ' | At: ' + formatTime + ' | with: ' + level);//REM
            }
        });
    }

    // used to pick up thermstat mode
    function getCurrentThermostatMode(_instance) {
        var hasThermostatMode = 0x40 in _instance.commandClasses;

        var _curThermMode = 1;
        if (hasThermostatMode) {
            _curThermMode = _instance.commandClasses[0x40].data.mode.value;
            if (isNaN(parseInt(_curThermMode, 10)))
                _curThermMode = null; // Mode not retrieved yet
        }
//        else {
//            // we pick up first available mode, since not ThermostatMode is supported to change modes
//            _curThermMode = null;
//            angular.forEach(_instance.commandClasses[0x43].data, function(name, k) {
//                if (!isNaN(parseInt(name, 10))) {
//                    _curThermMode = parseInt(name, 10);
//                    return false;
//                }
//            });
//        }
//        ;
        return _curThermMode;
    }
    ;
    // used to pick up thermstat mode
    function getModeList(data) {
        var list = []
        angular.forEach(data, function(v, k) {
            if (!k || isNaN(parseInt(k, 10))) {
                return;
            }
            var obj = {};
            obj['key'] = k;
            obj['val'] = $filter('hasNode')(v, 'modeName.value');
            list.push(obj);
        });

        return list;
    }
    ;
});
// Locks controller
appController.controller('LocksController', function($scope, $filter, dataService) {
    $scope.locks = [];
    $scope.reset = function() {
        $scope.locks = angular.copy([]);
    };
    // Load data
    $scope.load = function(lang) {
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
    // Store data on remote server
    $scope.store = function(btn) {
        var url = $(btn).attr('data-store-url');
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
        return;
    };
    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
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
                obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.mode';
                $scope.locks.push(obj);
                cnt++;
            });
        });
    }

    /**
     * Refresh zwave data
     */
    function refreshData(data) {
        angular.forEach($scope.locks, function(v, k) {

            if (v.cmdToUpdate in data.update) {
                var obj = data.update[v.cmdToUpdate];
                var active = obj.value;
                var level = $filter('lockStatus')(obj.value);
                var updateTime = $filter('isTodayFromUnix')(obj.updateTime);
                $('#' + v.rowId + ' .row-time').html(updateTime).removeClass('is-updated-false');
                $('#' + v.rowId + ' .row-level').html(level);
                $('#' + v.rowId + ' .btn-group-lock button').removeClass('active');
                if (active == '255') {
                    $('#' + v.rowId + ' .btn-lock').addClass('active');
                } else {
                    $('#' + v.rowId + ' .btn-unlock').addClass('active');
                }
            }
        });
    }
});
// Status controller
appController.controller('StatusController', function($scope, $filter, dataService, deviceService) {
    $scope.statuses = [];
    $scope.interviewCommandsDevice = [];
    $scope.interviewCommands = [];
    $scope.deviceInfo = {
        "index": null,
        "id": null,
        "name": null
    };
    $scope.ZWaveAPIData;
    $scope.interviewDeviceId = null;
    $scope.reset = function() {
        $scope.statuses = angular.copy([]);
    };
    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            setData($scope.ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
                if ($scope.interviewDeviceId > 1) {
                    refreshModalInterview($scope.ZWaveAPIData.devices[$scope.interviewDeviceId], data.joined.devices[$scope.interviewDeviceId]);
                }

//                $scope.reset();
//                setData(data.joined);
                refreshData(data.update);
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
    $scope.store = function(btn) {
        var url = $(btn).attr('data-store-url');
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };

    // Store all data on remote server
    $scope.storeAll = function(btn) {
        angular.forEach($scope.statuses, function(v, k) {
            if (v.urlToStore) {
                dataService.runCmd(v.urlToStore);
            }
        });
    };
    $scope.showModalInterview = function(target, index, id, name) {
        $scope.deviceInfo = {
            "index": index,
            "id": id,
            "name": name
        };
        $scope.interviewDeviceId = id;
        var node = $scope.ZWaveAPIData.devices[id];
        $scope.interviewCommands = deviceService.configGetInterviewCommands(node);
        //$scope.interviewCommands.push(deviceService.configGetInterviewCommands(node));
        $(target).modal();
    };
    // Show modal dialog
    $scope.hideModalInterview = function() {
        $scope.interviewDeviceId = null;
    };

    // Show modal CommandClass dialog
    $scope.showModalCommandClass = function(target, instanceId, ccId, type) {
        var node = $scope.ZWaveAPIData.devices[$scope.interviewDeviceId];
        if (!node) {
            return;
        }
        var ccData;
        switch (type) {
            case 'cmdData':
                ccData = $filter('hasNode')(node, 'instances.' + instanceId + '.commandClasses.' + ccId + '.data');
                break;
            case 'cmdDataIn':
                ccData = $filter('hasNode')(node, 'instances.' + instanceId + '.data');
                break;
            default:
                ccData = $filter('hasNode')(node, 'data');
                break;
        }
        var cc = deviceService.configGetCommandClass(ccData, '/', '');

        $scope.commandClass = deviceService.configSetCommandClass(cc);
        $(target).modal();
    };
    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
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
            //$scope.interviewCommands.push(interviewCommands(node));
            //$scope.interviewCommands.push(deviceService.configGetInterviewCommands(node));
            $scope.interviewCommandsDevice.push(node.data);
            updateDeviceInfo(ZWaveAPIData, nodeId, basicType, genericType, specificType, isFLiRS, hasWakeup, hasBattery, isListening, bindPath);
        });
    }

    function updateDeviceInfo(ZWaveAPIData, nodeId, basicType, genericType, specificType, isFLiRS, hasWakeup, hasBattery, isListening, bindPath) {
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
        } else {
            interview_cont = _interview_cont;
        }

        // DDR
        var ddr = false;
        if (angular.isDefined(node.data.ZDDXMLFile)) {
            ddr = node.data.ZDDXMLFile.value;
        }

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
        //obj['ddr'] = ddr;
        obj['ddr'] = ddrCont(node);
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
        $scope.statuses.push(obj);
    }
    ;

    // Refresh data
    function refreshData(data) {
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
                            if (angular.isDefined(data[lastSleepCmd])) {
                                var sleepingSince = data[lastSleepCmd].value;
                                var sleeping_cont = sleepingCont(v.isListening, v.hasWakeup, v.isFLiRS, sleepingSince, lastWakeup, v.interval);
                                $('#' + v.rowId + ' .row-sleeping').html(sleeping_cont);

                            }
                            break;
                        case lastSleepCmd:
                            //console.log(lastSleepCmd);
                            break;
                    }
                    ;
                    //$('#' + v.rowId + ' .row-time').html(node);
                }

            });

        });
    }
    ;

    // Refresh Modal Interview data
    function refreshModalInterview(oldCc, newCc) {
        var refresh = JSON.stringify(oldCc) !== JSON.stringify(newCc);
        if (refresh) {
            $scope.interviewCommands = deviceService.configGetInterviewCommands(newCc);
        }



    }

    // Refresh Modal Interview data
    function refreshModalInterview(oldCc, newCc) {
        var refresh = JSON.stringify(oldCc) !== JSON.stringify(newCc);
        if (refresh) {
            $scope.interviewCommands = deviceService.configGetInterviewCommands(newCc);
        }



    }


    // Get Awake HTML
    function awakeCont(isAwake, isListening, isFLiRS) {
        var awake_cont = '';
        if (!isListening && !isFLiRS)
            awake_cont = isAwake ? ('<i class="fa fa-certificate fa-lg text-orange" title="' + $scope._t('device_is_active') + '"></i>') : ('<i class="fa fa-moon-o fa-lg text-primary" title="' + $scope._t('device_is_sleeping') + '"></i>');
        return awake_cont;
    }
    // Get operating HTML
    function operatingCont(isFailed, lastCommunication) {
        var operating_cont = (isFailed ? ('<i class="fa fa-ban fa-lg text-danger" title="' + $scope._t('device_is_dead') + '"></i>') : ('<i class="fa fa-check fa-lg text-success" title="' + $scope._t('device_is_operating') + '"></i>')) + ' <span title="' + $scope._t('last_communication') + '" class="not_important">' + $filter('isTodayFromUnix')(lastCommunication) + '</span>';
        return operating_cont;
    }

    // Get ddr
    function ddrCont(node) {
        var ddr = '<i class="fa fa-minus"></i>';
        if (angular.isDefined(node.data.ZDDXMLFile) && node.data.ZDDXMLFile.value) {
            ddr = '<i class="fa fa-check"></i>';
        }
        return ddr;
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
appController.controller('BatteryController', function($scope, $filter, $http, dataService, myCache) {
    $scope.battery = [];
    $scope.batteryInfo = [];
    $scope.reset = function() {
        $scope.battery = angular.copy([]);
    };
    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
                refreshData(data);
//                $scope.reset();
//                setData(data.joined);
            });
        });
    };
    $scope.load($scope.lang);

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });
    // Store single data on remote server
    $scope.store = function(btn) {
        var url = $(btn).attr('data-store-url');
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };
    // Store all data on remote server
    $scope.storeAll = function(btn) {
        angular.forEach($scope.battery, function(v, k) {
            dataService.runCmd(v.urlToStore);
        });
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
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

//            var info = loadZDD(nodeId, ZWaveAPIData);
//            console.log(info);
            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['cmd'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].data.last';
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['level'] = battery_charge;
            obj['updateTime'] = battery_updateTime;
            obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Get()';
            obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data';
            obj['batteryCount'] = null;
            obj['batteryType'] = null;

            var zddXmlFile = null;
            if (angular.isDefined(node.data.ZDDXMLFile)) {
                zddXmlFile = node.data.ZDDXMLFile.value;
            }
            if (zddXmlFile) {
                var cachedZddXml = myCache.get(zddXmlFile);
                if (!cachedZddXml) {
                    $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                        var x2js = new X2JS();
                        var zddXml = x2js.xml_str2json(response.data);
                        myCache.put(zddXmlFile, zddXml);
                        var batteryInfo = getBatteryInfo(zddXml);
                        obj['batteryCount'] = batteryInfo.batteryCount;
                        obj['batteryType'] = batteryInfo.batteryType;

                    });
                } else {
                    var batteryInfo = getBatteryInfo(cachedZddXml);
                    obj['batteryCount'] = batteryInfo.batteryCount;
                    obj['batteryType'] = batteryInfo.batteryType;
                }
            }

            $scope.battery.push(obj);
        });
    }

    /**
     * Refresh zwave data
     */
    function refreshData(data) {

        angular.forEach($scope.battery, function(v, k) {
            var obj = data.update[v.cmdToUpdate];
            if (obj) {
                var level = parseInt(obj.last.value);
                var updateTime = obj.last.updateTime;
                //var invalidateTime;
                var formatTime = $filter('isTodayFromUnix')(updateTime);
                $('#' + v.rowId + ' .row-level').html(level);
                $('#' + v.rowId + ' .row-time').html(formatTime);
                //console.log('Updating:' + v.rowId + ' | At: ' + formatTime + ' | with: ' + level);//REM
            }
        });
    }

    // Load ZDDXML
    $scope.loadZDD_ = function(nodeId) {
        if (nodeId in $scope.zdd)
            return; // zdd already loaded for nodeId
        var node = $scope.ZWaveAPIData.devices[nodeId];
        if (node == undefined)
            return;
        var zddXmlFile = null;
        if (angular.isDefined(node.data.ZDDXMLFile)) {
            zddXmlFile = node.data.ZDDXMLFile.value;
        }
        if (!(zddXmlFile))
            return; // not available

        var cachedZddXml = myCache.get(zddXmlFile);
        if (!cachedZddXml) {
            $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                var x2js = new X2JS();
                var zddXml = x2js.xml_str2json(response.data);
                myCache.put(zddXmlFile, zddXml);
                if (("ZWaveDevice" in zddXml) && ("assocGroups" in zddXml.ZWaveDevice)) {
                    $scope.zdd[nodeId] = zddXml.ZWaveDevice.assocGroups;
                    if (nodeId == $scope.deviceId)
                        $scope.updateData(nodeId);
                } else {
                    $scope.zdd[nodeId] = undefined;
                }
            });
        } else {
            var zddXml = cachedZddXml;
            if (("ZWaveDevice" in zddXml) && ("assocGroups" in zddXml.ZWaveDevice)) {
                $scope.zdd[nodeId] = zddXml.ZWaveDevice.assocGroups;
                if (nodeId == $scope.deviceId)
                    $scope.updateData(nodeId);
            } else {
                $scope.zdd[nodeId] = undefined;
            }
        }
    };

    // Load ZDDXML
    function loadZDD(nodeId, ZWaveAPIData) {

        var node = ZWaveAPIData.devices[nodeId];
        if (node == undefined) {
            return;
        }

        var zddXmlFile = null;
        if (angular.isDefined(node.data.ZDDXMLFile)) {
            zddXmlFile = node.data.ZDDXMLFile.value;
        }
        if (!(zddXmlFile)) {
            return;
        }
        var cachedZddXml = myCache.get(zddXmlFile);
        if (!cachedZddXml) {
            $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                var x2js = new X2JS();
                var zddXml = x2js.xml_str2json(response.data);
                myCache.put(zddXmlFile, zddXml);
                return getBatteryInfo(zddXml);

            });
        } else {
            return getBatteryInfo(cachedZddXml);
        }
    }
    ;
    // Get battery info
    function getBatteryInfo(zddXml) {
        var info = {
            'batteryCount': null,
            'batteryType': null
        };
        if (("deviceDescription" in zddXml.ZWaveDevice)) {
            var obj = zddXml.ZWaveDevice.deviceDescription;
            if (obj) {
                if (obj.batteryCount) {
                    info.batteryCount = obj.batteryCount;
                }
                if (obj.batteryType) {
                    info.batteryType = obj.batteryType;
                }
            }
        }
        return info;
    }
});
// Type controller
appController.controller('TypeController', function($scope, $filter, dataService, deviceService) {
    $scope.devices = [];
    $scope.reset = function() {
        $scope.devices = angular.copy([]);
    };
    $scope.deviceClasses = [];
    $scope.productNames = [];
    // Load  device classes xml data
    $scope.loadDeviceClasses = function() {
        dataService.getDeviceClasses(function(data) {
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
                //obj['generic'] = val.name.lang[langId].__text;
                obj['generic'] = deviceService.configGetZddxLang(val.name.lang, $scope.lang);
                obj['specific'] = val.Specific;
                obj['langId'] = langId;
                $scope.deviceClasses.push(obj);
            });
        });
    };


    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
                $scope.reset();
                setData(data.joined);
                dataService.cancelZwaveDataInterval();
            });
        });
    };
    $scope.$watch('lang', function() {
        $scope.loadDeviceClasses();
        $scope.load();
    });


    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
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
            var major = node.data.ZWProtocolMajor.value;
            var minor = node.data.ZWProtocolMinor.value;
            var vendorName = node.data.vendorString.value;
            var zddXmlFile = $filter('hasNode')(node, 'data.ZDDXMLFile.value');
            var productName = null;
            var fromSdk = true;
            var sdk;
            // SDK
            if (node.data.SDK.value == '') {
                sdk = major + '.' + minor;
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
            // MWI and EF
            var mwief = getEXFrame(major, minor);

            // DDR
            var ddr = false;
            if (angular.isDefined(node.data.ZDDXMLFile)) {
                ddr = node.data.ZDDXMLFile.value;
            }

            // Zwave plus
            var ZWavePlusInfo = false;
            angular.forEach(ccIds, function(v, k) {
                var cmd = node.instances[instanceId].commandClasses[v];
                if (angular.isObject(cmd) && cmd.name === 'ZWavePlusInfo') {
                    ZWavePlusInfo = true;
                    return;
                }
            });
            // Device type
            var deviceXml = $scope.deviceClasses;
            var deviceType = $scope._t('unknown_device_type') + ': ' + genericType;
            angular.forEach(deviceXml, function(v, k) {
                if (genericType == v.id) {
                    deviceType = v.generic;
                    angular.forEach(v.specific, function(s, sk) {
                        if (specificType == s._id) {
                            deviceType = deviceService.configGetZddxLang(s.name.lang, $scope.lang);
//                            if (angular.isDefined(s.name.lang[v.langId].__text)) {
//                                deviceType = s.name.lang[v.langId].__text;
//                            }
                        }
                    });
                    return;
                }
            });

            // Product name from zddx file 
            if (zddXmlFile) {
                dataService.getZddXml(zddXmlFile, function(zddxml) {
                    //productName = $filter('hasNode')(zddxml, 'ZWaveDevice.deviceDescription.productName');
                    // productName = zddxml.ZWaveDevice.deviceDescription.productName;
                    $scope.productNames[nodeId] = zddxml.ZWaveDevice.deviceDescription.productName;
                });

            }
            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['security'] = security;
            obj['mwief'] = mwief;
            obj['ddr'] = ddr;
            obj['ZWavePlusInfo'] = ZWavePlusInfo;
            obj['sdk'] = (sdk == '0.0' ? '?' : sdk);
            obj['fromSdk'] = fromSdk;
            obj['appVersion'] = appVersion;
            obj['type'] = deviceType;
            obj['deviceType'] = deviceType;
            obj['basicType'] = basicType;
            obj['genericType'] = genericType;
            obj['specificType'] = specificType;
            obj['vendorName'] = vendorName;
            obj['productName'] = productName;
            $scope.devices.push(obj);
        });
    }

    /**
     * Get EXF frame
     */
    function getEXFrame($major, $minor) {
        if ($major == 1)
            return 0;
        if ($major == 2) {
            if ($minor >= 96)
                return 1;
            if ($minor == 74)
                return 1;
            return 0;
        }
        if ($major == 3)
            return 1;
        return 0;
    }

});
// Device Associations controller
appController.controller('AssociationsController', function($scope, $filter, $http, myCache, dataService) {
    $scope.devices = [];
    $scope.ZWaveAPIData = [];
    $scope.showLifeline = false;
    $scope.zdd;
    $scope.reset = function() {
        $scope.devices = angular.copy([]);
    };
    // Load data
    $scope.load = function(lang) {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
        });
    };
    // Load data
    $scope.load($scope.lang);

    // Refresh data
    $scope.refresh = function() {
        dataService.joinedZwaveData(function(data) {
            $scope.reset();
            setData(data.joined);
            dataService.cancelZwaveDataInterval();
        });
    };
    //$scope.refresh();


    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });
    // Store data on remote server
    $scope.lifeline = function(status) {
        $scope.reset();
        $scope.showLifeline = status;
        $scope.load($scope.lang);
    };
    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        var cnt = 1;
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }
            var zddXmlFile = null;
            if (angular.isDefined(node.data.ZDDXMLFile)) {
                zddXmlFile = node.data.ZDDXMLFile.value;
            }
            var zdd;
            if (zddXmlFile && zddXmlFile !== 'undefined') {
                var cachedZddXml = myCache.get(zddXmlFile);
                if (!cachedZddXml) {
                    $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                        var x2js = new X2JS();
                        var zddXml = x2js.xml_str2json(response.data);
                        myCache.put(zddXmlFile, zddXml);
                        var assocGroup = [];
                        if (("ZWaveDevice" in zddXml) && ("assocGroups" in zddXml.ZWaveDevice)) {
                            zdd = zddXml.ZWaveDevice.assocGroups;
                            var assocDevices = getAssocDevices(node, ZWaveAPIData, zdd, controllerNodeId);
                            $scope.devices.push({
                                'id': nodeId,
                                'rowId': 'row_' + nodeId + '_' + cnt,
                                'name': $filter('deviceName')(nodeId, node),
                                'assocGroup': assocDevices
                            });
                        }

                    });
                } else {
                    var zddXml = cachedZddXml;
                    var assocGroup = [];
                    if (("ZWaveDevice" in zddXml) && ("assocGroups" in zddXml.ZWaveDevice)) {
                        zdd = zddXml.ZWaveDevice.assocGroups;
                        var assocDevices = getAssocDevices(node, ZWaveAPIData, zdd, controllerNodeId);
                        $scope.devices.push({
                            'id': nodeId,
                            'rowId': 'row_' + nodeId + '_' + cnt,
                            'name': $filter('deviceName')(nodeId, node),
                            'assocGroup': assocDevices
                        });
                    }
                }
            } else {
                zdd = null;
                var assocDevices = getAssocDevices(node, ZWaveAPIData, zdd, controllerNodeId);
                $scope.devices.push({
                    'id': nodeId,
                    'rowId': 'row_' + nodeId + '_' + cnt,
                    'name': $filter('deviceName')(nodeId, node),
                    'assocGroup': assocDevices
                });
            }


            cnt++;
        });
    }
    /**
     * Get group name
     */
    function getGroupLabel(assocGroups, index, instance) {
        // Set default assoc group name
        var label = $scope._t('association_group') + " " + (index + 1);

        // Attempt to get assoc group name from the zdd file
        var langs = $filter('hasNode')(assocGroups, 'description.lang');
        if (langs) {
            if ($.isArray(langs)) {
                angular.forEach(langs, function(lang, index) {
                    if (("__text" in lang) && (lang["_xml:lang"] == $scope.lang)) {
                        label = lang.__text;
                        return false;
                    }
                    if (("__text" in lang) && (lang["_xml:lang"] == "en")) {
                        label = lang.__text;
                    }
                });
            } else {
                if (("__text" in langs)) {
                    label = langs.__text;
                }
            }
        } else {
            // Attempt to get assoc group name from the command class
            angular.forEach(instance[0].commandClasses, function(v, k) {
                if (v.name == 'AssociationGroupInformation') {
                    label = $filter('hasNode')(v, 'data.' + (index + 1) + '.groupName.value');
                }

            });
        }

        return label;
    }
    ;
    /**
     * Get assoc devices
     */
    function getAssocDevices(node, ZWaveAPIData, zdd, controllerNodeId) {
        var assocGroups = [];
        var assocDevices = [];
        var assoc = [];
        var data;
        if (0x85 in node.instances[0].commandClasses) {
            var cc = node.instances[0].commandClasses[0x85].data;
            if (cc.groups.value >= 1) {
                for (var grp_num = 1; grp_num <= parseInt(cc.groups.value, 10); grp_num++) {
                    var groupArr = [];
                    var groupDev = [];
                    if (assocGroups.indexOf(grp_num) == -1) {
                        assocGroups.push(grp_num);
                    }

                    data = cc[grp_num];
                    for (var i = 0; i < data.nodes.value.length; i++) {
                        var targetNodeId = data.nodes.value[i];
                        var device = {'id': targetNodeId, 'name': '(#' + targetNodeId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])};
                        assocDevices.push({'group': grp_num, 'device': device});
                    }

                }
            }
        }

        if (0x8e in node.instances[0].commandClasses) {
            var cc = node.instances[0].commandClasses[0x8e].data;
            if (cc.groups.value >= 1) {
                for (var grp_num = 1; grp_num <= parseInt(cc.groups.value, 10); grp_num++) {
                    var groupDev = [];
                    if (assocGroups.indexOf(grp_num) == -1) {
                        assocGroups.push(grp_num);
                    }
                    data = cc[grp_num];

                    for (var i = 0; i < data.nodesInstances.value.length; i += 2) {
                        var targetNodeId = data.nodesInstances.value[i];
                        var targetInstanceId = data.nodesInstances.value[i + 1];
                        var instanceId = (targetInstanceId > 0 ? '.' + targetInstanceId : '')
                        var device = {'id': targetNodeId, 'name': '(#' + targetNodeId + instanceId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])};
                        assocDevices.push({'group': grp_num, 'device': device});
                    }
                }
            }
        }

        angular.forEach(assocGroups, function(v, k) {

            var dev = [];
            var name;

            if (zdd) {
                angular.forEach(zdd, function(zddval, zddkey) {
                    if (angular.isArray(zddval)) {
                        angular.forEach(zddval, function(val, key) {
                            if (val._number == v)
                                name = getGroupLabel(val, v, node.instances);
                        });
                    } else {
                        if (zddval._number == v)
                            name = getGroupLabel(zddval, v, node.instances);

                    }
                });
            } else {
                name = getGroupLabel([], v - 1, node.instances);
            }

            angular.forEach(assocDevices, function(d, key, nodeId) {
                //console.log(d)
                if (d['group'] == v) {
                    if ($scope.showLifeline) {
                        dev.push(d.device.name);
                    } else {
                        if (controllerNodeId != d.device.id) {
                            dev.push(d.device.name);
                        }
                    }
                }

            });

            if (dev.length > 0) {
                assoc.push({'name': name, 'devices': dev});
            }
        });

        return assoc;
    }


});
// Controll controller
appController.controller('ControllController', function($scope, $filter, $upload, $interval,$location, cfg, dataService,deviceService) {
    $scope.apiDataInterval;
    $scope.devices = {};
    $scope.sucNodes = {};
    $scope.failedNodes = {};
    $scope.replaceNodes = {};
    $scope.failedBatteries = {};
    $scope.modelSucSicNode = 1;
    //$scope.sucNodes = [];
    $scope.disableSUCRequest = true;
    $scope.controllerState = 0;
    $scope.secureInclusion;
    $scope.lastExcludedDevice;
    $scope.lastIncludedDevice;
    $scope.startLearnMode;
    $scope.lastIncludedDevice = null;
    $scope.lastExcludedDevice = null;
    $scope.restoreBackupStatus = 0;
    $scope.deviceInfo = {
        "id": null,
        "name": null
    };
    $scope.deviceClasses = [];
    $scope.goReset = false;
    $scope.refresh = true;
    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        //dataService.cancelZwaveDataInterval();
        $interval.cancel($scope.apiDataInterval);
    });
    // DEPRECATED
//    $scope.reset = function(refresh) {
//        $scope.devices = angular.copy([]);
//        if (refresh) {
//            $scope.failedNodes = angular.copy([]);
//            $scope.replaceNodes = angular.copy([]);
//            $scope.failedBatteries = angular.copy([]);
//        }
//
//    };

    // Load  device classes xml data
    $scope.loadDeviceClasses = function() {
        dataService.getDeviceClasses(function(data) {
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
                $scope.deviceClasses.push(obj);
            });
        });
    };
    $scope.loadDeviceClasses();

    /**
     * Load data
     */
    $scope.loadData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setControllerData(ZWaveAPIData);
            setDevicesData(ZWaveAPIData);
            $scope.refreshData(ZWaveAPIData);
            deviceService.updateTimeTick(ZWaveAPIData.updateTime);
        }, function(error) {
            $location.path('/error/' + error.status);
            return;
        });
        return;
    };
    $scope.loadData();

    /**
     * Refresh data
     */
    $scope.refreshData = function(ZWaveAPIData) {
        $scope.failedBatteries;
        var refresh = function() {
            dataService.loadJoinedZwaveData(ZWaveAPIData).then(function(response) {
                setControllerData(response.data.joined);
                setDevicesData(response.data.joined);
                setInclusionData(response.data.update);
                deviceService.updateTimeTick(response.data.update.updateTime);
            }, function(error) {
                deviceService.showConnectionError(error);
                return;
            });
        };
        $scope.apiDataInterval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * DEPRECATED
     * Load data
     */
//    $scope.load = function() {
//        dataService.getZwaveData(function(ZWaveAPIData) {
//            setData(ZWaveAPIData, true);
//            dataService.joinedZwaveData(function(data) {
//                //$scope.reset($scope.refresh);
//                //setData(data.joined, $scope.refresh);
//                $scope.reset(false);
//                setData(data.joined, false);
//                refresh(data.update);
//            });
//        });
//    };
//    $scope.load();


    /**
     * Show modal window
     *
     * @returns {void}
     */
    $scope.showModal = function(target, id) {

        var obj = $filter('filter')($scope.devices, function(d) {
            return d.id == id;
        })[0];
        if (obj) {
            $scope.deviceInfo = {
                "id": obj.id,
                "name": obj.name
            };
        }
        $(target).modal();
        return;
    };
    /**
     * Run command
     *
     * @returns {void}
     */
    $scope.runCmd = function(cmd, hideModal, url, action) {
        var folder = (url ? url : '/ZWaveAPI/Run/');
        if (angular.isArray(cmd)) {
            angular.forEach(cmd, function(v, k) {
                dataService.runCmd(null, folder + v);
                //console.log(folder + v);

            });
        } else {
            dataService.runCmd(null, folder + cmd, $scope._t('error_handling_data'));
            //console.log(folder + cmd);
        }
        if (action) {
            switch (action.name) {
                case 'remove_option':
                    $(action.id + ' option[value=' + action.value + ']').remove();
                    break;
                case 'reset_controller':
                    $("#reset_confirm").attr('checked', false);
                    $scope.goReset = false;
                    console.log('reset_controller');
                    break;
            }
        }

        if (hideModal) {
            $(hideModal).modal('hide');
        }

        return;
    };
    /**
     * Send request restore backup
     * @returns {void}
     */
    $scope.restoreBackup = function($files, chip, show, hide) {
        chip = (!chip ? 0 : chip);
        //var url = 'upload.php?restore_chip_info=' + chip;
        var url = cfg.server_url + cfg.restore_url + '?restore_chip_info=' + chip;
        //$files: an array of files selected, each file has name, size, and type.
        $(show).show();
        $(hide).hide();
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            $upload.upload({
                url: url,
                fileFormDataName: 'config_backup',
                file: $file
            }).progress(function(evt) {
                $scope.restoreBackupStatus = 1;
                //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                if (data && data.replace(/(<([^>]+)>)/ig, "") !== "null") {//Error
                    $scope.restoreBackupStatus = 3;
                } else {// Success
                    $scope.restoreBackupStatus = 2;
                }

                // file is uploaded successfully
                //console.log(data, status);
            }).error(function(data, status) {
                $scope.restoreBackupStatus = 3;
                //console.log(data, status);
            });

        }
    };

    /**
     * Close reset controller modal window
     *
     * @returns {void}
     */
    $scope.changeSelectNode = function(val) {
        if (val > 0) {
            $scope.refresh = false;
        } else {
            $scope.refresh = true;
        }

    };

    /**
     * Close failed node modal window
     */
    $scope.closeFailedNode = function(modal) {
        console.log('closeFailedNode')
        $("#remove_node_confirm").attr('checked', false);
        $scope.goFailedNode = false;
        $(modal).modal('hide');

    };
    /**
     * Close reset controller modal window
     *
     * @returns {void}
     */
    $scope.closeResetController = function(modal) {
        $("#reset_confirm").attr('checked', false);
        $scope.goReset = false;
        $(modal).modal('hide');

    };
    /**
     * Close restore modal window
     *
     * @returns {void}
     */
    $scope.closeBackup = function(modal) {
        $('#btn_upload').show();
        $('.btn-spinner').hide();
        $("#restore_confirm").attr('checked', false);
        $("#restore_chip_info").attr('checked', false);
        $scope.goRestore = false;
        $scope.restoreBackupStatus = 0;
        $(modal).modal('hide');

        // $route.reload();
        //window.location.reload();

    };
    /**
     * Send request NIF from all devices
     *
     * @returns {void}
     */
    $scope.requestNifAll = function(btn) {
        angular.forEach($scope.devices, function(v, k) {
            var url = 'devices[' + v.id + '].RequestNodeInformation()';
            dataService.runCmd(url, false, $scope._t('error_handling_data'));
        });
        return;
    };

    /// --- Private functions --- ///

    /**
     * Set controller data
     */
    function setControllerData(ZWaveAPIData) {
        $scope.showContent = true;
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        var isPrimary = ZWaveAPIData.controller.data.isPrimary.value;
        var isRealPrimary = ZWaveAPIData.controller.data.isRealPrimary.value;
        var isSIS = ZWaveAPIData.controller.data.SISPresent.value;
        var hasSUC = ZWaveAPIData.controller.data.SUCNodeId.value;
        var hasDevices = Object.keys(ZWaveAPIData.devices).length;
        $scope.controllerState = ZWaveAPIData.controller.data.controllerState.value;
        $scope.secureInclusion = ZWaveAPIData.controller.data.secureInclusion.value;
        $scope.startLearnMode = !isRealPrimary || hasDevices < 2 ? true : false;
        $scope.isPrimary = isPrimary;
        $scope.isSIS = isSIS;
        if (hasSUC && hasSUC != controllerNodeId) {
            $scope.disableSUCRequest = false;
        }

        /* console.log('Controller isPrimary: ' + isPrimary);
         console.log('Controller isSIS: ' + isSIS);
         console.log('and there are other devices: ' + hasDevices + ' - ' + (hasDevices > 1 ? 'true' : 'false'));
         console.log('Learn mode: ' + $scope.startLearnMode);*/

    }
    /**
     * Set devices data
     */
    function setDevicesData(ZWaveAPIData) {
        var obj;
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            obj = {id: nodeId, name: $filter('deviceName')(nodeId, node)}
            if (nodeId == 255 || nodeId == ZWaveAPIData.controller.data.nodeId.value || node.data.isVirtual.value) {
                return;
            }

            // Devices
            if (!$scope.devices[nodeId]) {
                $scope.devices[nodeId] = obj;
            }

            // SUC
            if (node.data.basicType.value == 2) {
                if (!$scope.sucNodes[nodeId]) {
                    $scope.sucNodes[nodeId] = obj;
                }
            }

            // Failed and Batteries nodes
            if (ZWaveAPIData.controller.data.isPrimary.value) {
                if (node.data.isFailed.value) {
                    if (!$scope.failedNodes[nodeId]) {
                        $scope.failedNodes[nodeId] = obj;
                    }
                    if (!$scope.replaceNodes[nodeId]) {
                        $scope.replaceNodes[nodeId] = obj;
                    }
                }
                if (!node.data.isListening.value && !node.data.isFailed.value) {
                    if (!$scope.failedBatteries[nodeId]) {
                        $scope.failedBatteries[nodeId] = obj;
                    }
                }
            }
            ;
        });
    }

    /**
     * Set inclusion data
     */
    function setInclusionData(data) {
        if ('controller.data.controllerState' in data) {
            $scope.controllerState = data['controller.data.controllerState'].value;
        }
        console.log($filter('getCurrentTime')(Math.round(+new Date() / 1000)) + ': Controller state: ' + $scope.controllerState);

        // console.log('Learn mode 2: ' + $scope.learnMode);
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

            if (deviceIncId != null) {

                var givenName = 'Device_' + deviceIncId;
                var node = data.devices[deviceIncId];
                // Device type
                var deviceXml = $scope.deviceClasses;
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
                dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
                $scope.lastIncludedDevice = $scope._t('nm_last_included_device') + '  (' + updateTime + ')  <a href="#configuration/interview/' + deviceIncId + '"><strong>' + givenName + '</strong></a>';
            }


        }
        if ('controller.data.lastExcludedDevice' in data) {
            var deviceExcId = data['controller.data.lastExcludedDevice'].value;
            if (deviceExcId != null) {
                var updateTime = $filter('isTodayFromUnix')(data['controller.data.lastExcludedDevice'].updateTime);
                //var txt = $scope._t('nm_last_excluded_device') + ' ' + (deviceExcId != 0 ? deviceExcId : $scope._t('nm_last_excluded_device_from_foreign_network'));
                if (deviceExcId != 0) {
                    var txt = $scope._t('txt_device') + ' # ' + deviceExcId + ' ' + $scope._t('nm_excluded_from_network');
                    //Remove failed/battery/replace nodes
                    $scope.failedNodes[deviceExcId] = null;
                    delete $scope.failedNodes[deviceExcId];
                    $scope.replaceNodes[deviceExcId] = null;
                    delete $scope.replaceNodes[deviceExcId];
                    $scope.failedBatteries[deviceExcId] = null;
                    delete $scope.failedBatteries[deviceExcId];
                } else {
                    var txt = $scope._t('nm_last_excluded_device_from_foreign_network');
                }

                $scope.lastExcludedDevice = txt + ' (' + updateTime + ')';
            }
        }
    }
    ;
    /**
     * DEPRECATED
     * Set zwave data
     */
//    function setData(ZWaveAPIData, refresh) {
//        console.log(ZWaveAPIData.controller.data);
//        $scope.showContent = true;
//        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
//        var isPrimary = ZWaveAPIData.controller.data.isPrimary.value;
//        var isRealPrimary = ZWaveAPIData.controller.data.isRealPrimary.value;
//        var isSIS = ZWaveAPIData.controller.data.SISPresent.value;
//        var hasSUC = ZWaveAPIData.controller.data.SUCNodeId.value;
//        var hasDevices = Object.keys(ZWaveAPIData.devices).length;
//        $scope.controllerState = ZWaveAPIData.controller.data.controllerState.value;
//        $scope.secureInclusion = ZWaveAPIData.controller.data.secureInclusion.value;
//        $scope.startLearnMode = !isRealPrimary || hasDevices < 2 ? true : false;
//        $scope.isPrimary = isPrimary;
//        $scope.isSIS = isSIS;
//        if (hasSUC && hasSUC != controllerNodeId) {
//            $scope.disableSUCRequest = false;
//        }
//
//        console.log('Controller isPrimary: ' + isPrimary);
//        console.log('Controller isSIS: ' + isSIS);
//        console.log('and there are other devices: ' + hasDevices + ' - ' + (hasDevices > 1 ? 'true' : 'false'));
//        console.log('Learn mode: ' + $scope.startLearnMode);
//        /**
//         * Loop throught devices
//         */
//        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
//            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
//                return;
//            }
//            $scope.devices.push({"id": nodeId, "name": $filter('deviceName')(nodeId, node)});
//            if (node.data.basicType.value == 2) {
//                $scope.sucNodes.push({"id": nodeId, "name": $filter('deviceName')(nodeId, node)});
//            }
//        });
//        /**
//         * Loop throught failed nodes
//         */
//        if (refresh) {
//            if (ZWaveAPIData.controller.data.isPrimary.value) {
//                angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
//                    if (node.data.isFailed.value) {
//                        $scope.failedNodes.push({"id": nodeId, "name": $filter('deviceName')(nodeId, node)});
//                        $scope.replaceNodes.push({"id": nodeId, "name": $filter('deviceName')(nodeId, node)});
//                    }
//                    //if (dev.data.isFailed.value || (!dev.data.isListening.value && !dev.data.isFailed.value)) {
//                    if (!node.data.isListening.value && !node.data.isFailed.value) {
//                        $scope.failedBatteries.push({"id": nodeId, "name": $filter('deviceName')(nodeId, node)});
//                    }
//                });
//            }
//            ;
//        }
//
//    }


    /**
     * DEPRECATED
     * Refresh data
     */
//    function refresh(data) {
//        if ('controller.data.controllerState' in data) {
//            $scope.controllerState = data['controller.data.controllerState'].value;
//        }
//        console.log('Controller state: ' + $scope.controllerState);
//
//        // console.log('Learn mode 2: ' + $scope.learnMode);
//        if ('controller.data.lastExcludedDevice' in data) {
//            $scope.lastExcludedDevice = data['controller.data.lastExcludedDevice'].value;
//        }
//
//        if ('controller.data.lastIncludedDevice' in data) {
//            $scope.lastIncludedDevice = data['controller.data.lastIncludedDevice'].value;
//        }
//        if ('controller.data.secureInclusion' in data) {
//            $scope.secureInclusion = data['controller.data.secureInclusion'].value;
//        }
//        if ('controller.data.lastIncludedDevice' in data) {
//            var deviceIncId = data['controller.data.lastIncludedDevice'].value;
//
//            if (deviceIncId != null) {
//
//                var givenName = 'Device_' + deviceIncId;
//                var node = data.devices[deviceIncId];
//                // Device type
//                var deviceXml = $scope.deviceClasses;
//                if (angular.isDefined(data.devices[deviceIncId])) {
//                    var genericType = node.data.genericType.value;
//                    var specificType = node.data.specificType.value;
//                    angular.forEach(deviceXml, function(v, k) {
//                        if (genericType == v.id) {
//                            var deviceType = v.generic;
//                            angular.forEach(v.specific, function(s, sk) {
//                                if (specificType == s._id) {
//                                    if (angular.isDefined(s.name.lang[v.langId].__text)) {
//                                        deviceType = s.name.lang[v.langId].__text;
//                                    }
//                                }
//                            });
//                            givenName = deviceType + '_' + deviceIncId;
//                            return;
//                        }
//                    });
//                }
//                var updateTime = $filter('isTodayFromUnix')(data['controller.data.lastIncludedDevice'].updateTime);
//                //Run CMD
//                var cmd = 'devices[' + deviceIncId + '].data.givenName.value=\'' + givenName + '\'';
//                dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
//                $scope.lastIncludedDevice = $scope._t('nm_last_included_device') + '  (' + updateTime + ')  <a href="#configuration/interview/' + deviceIncId + '"><strong>' + givenName + '</strong></a>';
//            }
//
//
//        }
//        if ('controller.data.lastExcludedDevice' in data) {
//            var deviceExcId = data['controller.data.lastExcludedDevice'].value;
//            if (deviceExcId != null) {
//                var updateTime = $filter('isTodayFromUnix')(data['controller.data.lastExcludedDevice'].updateTime);
//                //var txt = $scope._t('nm_last_excluded_device') + ' ' + (deviceExcId != 0 ? deviceExcId : $scope._t('nm_last_excluded_device_from_foreign_network'));
//                if (deviceExcId != 0) {
//                    var txt = $scope._t('txt_device') + ' # ' + deviceExcId + ' ' + $scope._t('nm_excluded_from_network');
//                } else {
//                    var txt = $scope._t('nm_last_excluded_device_from_foreign_network');
//                }
//                $scope.lastExcludedDevice = txt + ' (' + updateTime + ')';
//            }
//        }
//    }
//    ;
});
// Routing controller
appController.controller('RoutingController', function($scope, $filter, dataService, cfg) {

    $scope.devices = [];
    $scope.nodes = {};
    $scope.data = {};
    $scope.ZWaveAPIData;
    $scope.updating = {};
    $scope.cellState = function(nodeId, nnodeId, routesCount, nodeName, nnodeName) {
        var node = $scope.nodes[nodeId].node;
        var nnode = $scope.nodes[nnodeId].node;
        var tooltip = nodeId + ': ' + nodeName + ' - ' + nnodeId + ': ' + nnodeName + ' ';
        var info;
        if ($filter('associationExists')(node, nnodeId)) {
            info = '*';
            tooltip += ' (' + $scope._t('rt_associated') + ')';
        } else {
            info = '';
        }
        var clazz = 'rtDiv line' + nodeId + ' ';
        if (nodeId == nnodeId
                || node.data.isVirtual.value
                || nnode.data.isVirtual.value
                || node.data.basicType.value == 1
                || nnode.data.basicType.value == 1) {
            clazz = 'rtDiv rtUnavailable';
        } else if ($.inArray(parseInt(nnodeId, 10), node.data.neighbours.value) != -1)
            clazz += 'rtDirect';
        else if (routesCount[nnodeId]
                && routesCount[nnodeId][1] > 1)
            clazz += 'rtRouted';
        else if (routesCount[nnodeId]
                && routesCount[nnodeId][1] == 1)
            clazz += 'rtBadlyRouted';
        else
            clazz += 'rtNotLinked';
        return {
            info: info,
            clazz: clazz,
            tooltip: tooltip
        };
    };
    $scope.processUpdateNodesNeighbours = function(current) {
        var done = function() {
            var spinner = $('#RoutingTable .fa-spinner');
            $('div.rtDiv').css({"border-color": ""});
            $scope.updating[current.nodeId] = false;
            spinner.fadeOut();
        };

        var spinner = $('#RoutingTable .fa-spinner');
        spinner.show();
        // process-states
        if (!("timeout" in current)) {
            current.timeout = (new Date()).getTime() + cfg.route_update_timeout;
        }
        $('div.line' + current.nodeId).css({"border-color": "blue"});
        dataService.store('devices[' + current.nodeId + '].RequestNodeNeighbourUpdate()', function(response) {
            var pollForNodeNeighbourUpdate = function() {
                dataService.updateZwaveDataSince(current.since, function(updateZWaveAPIData) {
                    if ("devices." + current.nodeId + ".data.neighbours" in updateZWaveAPIData) {
                        var obj = updateZWaveAPIData["devices." + current.nodeId + ".data.neighbours"]
                        $('#update' + current.nodeId).attr('class', $filter('getUpdated')(obj));
                        $('#update' + current.nodeId).html($filter('isTodayFromUnix')(obj.updateTime));
                        if (current.since < obj.updateTime && obj.invalidateTime < obj.updateTime) {
                            $scope.ZWaveAPIData.devices[current.nodeId].data.neighbours = obj;
                            $scope.nodes[current.nodeId].node = $scope.ZWaveAPIData.devices[current.nodeId];
                            $scope.updateData(current.nodeId);
                            done();
                            return;
                        }
                    }
                    if (current.timeout < (new Date()).getTime()) {
                        // timeout waiting for an update-route occured, proceed
                        done();
                        return;
                    }
                    // routes not yet updated, poll again
                    window.setTimeout(pollForNodeNeighbourUpdate, cfg.interval);
                });
            };
            // first polling
            pollForNodeNeighbourUpdate();
        });
    };
    // update a route
    $scope.update = function(nodeId) {
        dataService.purgeCache();
        // retry once
        if ($filter('updateable')($scope.nodes[nodeId].node, nodeId)) {
            var hasBattery = 0x80 in $scope.nodes[nodeId].node.instances[0].commandClasses;
            var current = {"nodeId": nodeId, "retry": 0, "type": (hasBattery ? "battery" : "mains"), "since": $scope.ZWaveAPIData.updateTime};
            // avoid overall routing-table updates during update
            $scope.updating[nodeId] = true;
            $scope.processUpdateNodesNeighbours(current, {});
        }
    };
    $scope.updateData = function(nodeId, nodeName) {
        var node = $scope.ZWaveAPIData.devices[nodeId];
        if (nodeId == 255 || node.data.isVirtual.value || node.data.basicType.value == 1)
            return;
        var routesCount = $filter('getRoutesCount')($scope.ZWaveAPIData, nodeId);
        var line = [];
        var nnodeName;
        angular.forEach($scope.ZWaveAPIData.devices, function(nnode, nnodeId) {
            if (nnodeId == 255 || nnode.data.isVirtual.value || nnode.data.basicType.value == 1) {
                return;
            }
            nnodeName = $filter('deviceName')(nnodeId, nnode);
            //console.log(nodeId + ' ' + nodeName + ' - ' + nnodeId + ' ' + nnodeName)    
            line[nnodeId] = $scope.cellState(nodeId, nnodeId, routesCount, nodeName, nnodeName);
        });
        $scope.data[nodeId] = line;
    };
    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            // Prepare devices and nodes
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || node.data.isVirtual.value || node.data.basicType.value == 1)
                    return;
                $scope.devices.push(nodeId);
                $scope.nodes[nodeId] = {"label": $filter('deviceName')(nodeId, node), "node": node};
            });
            // Loop throught devices and gather routesCount and cellState
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                $scope.updateData(nodeId, $filter('deviceName')(nodeId, node));
            });
        });
    };
    $scope.load();
});
// Reorganization controller
appController.controller('ReorganizationController', function($scope, $filter, $interval, $timeout, dataService, cfg) {

    $scope.mainsPowered = true;
    $scope.batteryPowered = false;
    $scope.devices = [];
    $scope.nodes = {};
    $scope.ZWaveAPIData;
    $scope.processQueue = [];
    $scope.reorganizing = true;
    $scope.log = [];
    $scope.logged = "";
    $scope.appendLog = function(str, line) {
        if (line !== undefined) {
            $scope.log[line] += str;
        } else {
            $scope.log.push($filter('getTime')(new Date().getTime() / 1000) + ": " + str);
        }
        dataService.putReorgLog($scope.log.join("\n"));
        return $scope.log.length - 1;
    };
    $scope.downloadLog = function() {
        var hiddenElement = $('<a id="hiddenElement" href="' + cfg.server_url + cfg.reorg_log_url + '?at=' + (new Date()).getTime() + '" target="_blank" download="reorg.log"></a>').appendTo($('body'));
        hiddenElement.get(0).click();
        hiddenElement.detach();
    };
    var refreshLog = function() {
        // Assign to scope within callback to avoid data flickering on screen
        dataService.getReorgLog(function(log) {
            $scope.logged = log;
            // scroll to bottom
            var textarea = $("#reorg_log").get(0);
            textarea.scrollTop = textarea.scrollHeight;
        });
    };
    var promise = $interval(refreshLog, 1000);
    // Cancel interval on page changes
    $scope.$on('$destroy', function() {
        if (angular.isDefined(promise)) {
            $interval.cancel(promise);
            promise = undefined;
        }
    });
    $scope.reorgNodesNeighbours = function(current, result, doNext) {
        if (("complete" in current) && current.complete) {
            doNext();
            return;
        }
        dataService.store('devices[' + current.nodeId + '].RequestNodeNeighbourUpdate()', function(response) {
            var pollForNodeNeighbourUpdate = function(current) {
                dataService.updateZwaveDataSince(current.since, function(updateZWaveAPIData) {
                    $scope.appendLog(".", current.line);
                    try {
                        if ("devices." + current.nodeId + ".data.neighbours" in updateZWaveAPIData) {
                            var obj = updateZWaveAPIData["devices." + current.nodeId + ".data.neighbours"]
                            if (current.since < obj.updateTime && obj.invalidateTime < obj.updateTime) {
                                $scope.ZWaveAPIData.devices[current.nodeId].data.neighbours = obj;
                                $scope.nodes[current.nodeId].node = $scope.ZWaveAPIData.devices[current.nodeId];
                                // routes updated
                                var routesCount = $filter('getRoutesCount')($scope.ZWaveAPIData, current.nodeId);
                                $.each($scope.ZWaveAPIData.devices, function(nnodeId, nnode) {
                                    if (!routesCount[nnodeId]) {
                                        return;
                                    }
                                });
                                $scope.appendLog(" " + $scope._t('reorg_done'), current.line);
                                if (current.type == "battery") {
                                    if ("battery_completed" in result) {
                                        result.battery_completed++;
                                    } else {
                                        result.battery_completed = 1;
                                    }
                                } else {
                                    if ("mains_completed" in result) {
                                        result.mains_completed++;
                                    } else {
                                        result.mains_completed = 1;
                                    }
                                }
                                // mark all retries in processQueue as complete
                                for (var i = 0; i < $scope.processQueue.length; i++) {
                                    if ($scope.processQueue[i].nodeId == current.nodeId) {
                                        $scope.processQueue[i].complete = true;
                                    }
                                }
                                current.complete = true;
                                doNext();
                                return;
                            }
                        }
                    } catch (exception) {
                        $scope.appendLog(" " + e.message, current.line);
                    }
                    if (current.timeout < (new Date()).getTime()) {
                        // timeout waiting for an update-route occured, proceed
                        $scope.appendLog(" " + $scope._t('reorg_timeout'), current.line);
                        if (current.retry == 3) {
                            if (current.type == "battery") {
                                if ("battery_pending" in result) {
                                    result.battery_pending++;
                                } else {
                                    result.battery_pending = 1;
                                }
                            } else {
                                if ("mains_pending" in result) {
                                    result.mains_pending++;
                                } else {
                                    result.mains_pending = 1;
                                }
                            }
                        }
                        current.complete = true;
                        doNext();
                        return;
                    }
                    // routes not yet updated, poll again
                    window.setTimeout(pollForNodeNeighbourUpdate, cfg.interval, current);
                }, function(error) {
                    // error handler
                    $scope.appendLog(error, current.line);
                    if (current.retry == 3) {
                        if (current.type == "battery") {
                            if ("battery_pending" in result) {
                                result.battery_pending++;
                            } else {
                                result.battery_pending = 1;
                            }
                        } else {
                            if ("mains_pending" in result) {
                                result.mains_pending++;
                            } else {
                                result.mains_pending = 1;
                            }
                        }
                    }
                    current.complete = true;
                    doNext();
                });
            };
            // first polling
            pollForNodeNeighbourUpdate(current);
        }, function(error) {
            // error handler
            $scope.appendLog(error, current.line);
            if (current.type == "battery") {
                if ("battery_pending" in result) {
                    result.battery_pending++;
                } else {
                    result.battery_pending = 1;
                }
            } else {
                if ("mains_pending" in result) {
                    result.mains_pending++;
                } else {
                    result.mains_pending = 1;
                }
            }
            current.complete = true;
            doNext();
        });
    };
    $scope.processReorgNodesNeighbours = function(result, pos) {
        if ($scope.processQueue.length <= pos) {
            if ($scope.reorganizing) {
                $scope.appendLog($scope._t('reorg_completed') + ":");
                if ("mains_completed" in result)
                    $scope.appendLog(result.mains_completed + " " + $scope._t('reorg_mains_powered_done'));
                if ("battery_completed" in result)
                    $scope.appendLog(result.battery_completed + " " + $scope._t('reorg_battery_powered_done'));
                if ("mains_pending" in result)
                    $scope.appendLog(result.mains_pending + " " + $scope._t('reorg_mains_powered_pending'));
                if ("battery_pending" in result)
                    $scope.appendLog(result.battery_pending + " " + $scope._t('reorg_battery_powered_pending'));
                if ($.isEmptyObject(result))
                    $scope.appendLog($scope._t('reorg_nothing'));
                $scope.reorganizing = false;
            }
            return;
        }
        var current = $scope.processQueue[pos];
        if (!("complete" in current) || !current.complete) {
            if (!("line" in current)) {
                current.posInQueue = pos;
                current.line = $scope.appendLog($scope._t('reorg_reorg') + " " + current.nodeId + " " + (current.retry > 0 ? current.retry + ". " + $scope._t('reorg_retry') : "") + " ");
            }
            // process-states
            if (!("timeout" in current)) {
                current.timeout = (new Date()).getTime() + cfg.route_update_timeout;
            }
        }
        if (current.fork) {
            // batteries are processed in parallel, forking
            $scope.reorgNodesNeighbours(current, result, function() {
            });
            pos++;
            $scope.processReorgNodesNeighbours(result, pos);
        } else {
            // main powereds are processed sequential
            $scope.reorgNodesNeighbours(current, result, function() {
                pos++;
                $scope.processReorgNodesNeighbours(result, pos);
            });
        }
    };
    // reorgAll routes
    $scope.reorgAll = function() {
        $scope.reorganizing = true;
        $scope.log = [];
        $scope.appendLog($scope._t('reorg_started'));
        // retry each element up to 4 times
        $scope.processQueue = [];
        var logInfo = "";
        if ($scope.mainsPowered) {
            for (var retry = 0; retry < 4; retry++) {
                // first RequestNodeNeighbourUpdate for non-battery devices
                $.each($scope.devices, function(index, nodeId) {
                    if ($filter('updateable')($scope.nodes[nodeId].node, nodeId, false)) {
                        $scope.processQueue.push({"nodeId": nodeId, "retry": retry, "type": "mains", "since": $scope.ZWaveAPIData.updateTime, "fork": false});
                        if (retry == 0) {
                            if (logInfo != "") {
                                logInfo += ", ";
                            }
                            logInfo += nodeId;
                        }
                    }
                });
                if (retry == 0) {
                    $scope.appendLog($scope._t('reorg_all_mains') + ": " + logInfo);
                    logInfo = "";
                }
            }
        }
        if ($scope.batteryPowered) {
            for (var retry = 0; retry < 4; retry++) {
                // second RequestNodeNeighbourUpdate for battery devices
                $.each($scope.devices, function(index, nodeId) {
                    if ($filter('updateable')($scope.nodes[nodeId].node, nodeId, true)) {
                        $scope.processQueue.push({"nodeId": nodeId, "retry": retry, "type": "battery", "since": $scope.ZWaveAPIData.updateTime, "fork": true});
                        if (retry == 0) {
                            if (logInfo != "") {
                                logInfo += ", ";
                            }
                            logInfo += nodeId;
                        }
                    }
                });
                // use last in retry-group as sequential-blocker
                $scope.processQueue[$scope.processQueue.length - 1].fork = false;
                if (retry == 0) {
                    $scope.appendLog($scope._t('reorg_all_battery') + ": " + logInfo);
                }
            }
        }
        $scope.processReorgNodesNeighbours({}, 0);
    };
    // Load data
    $scope.load = function(lang) {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            // Prepare devices and nodes
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || node.data.isVirtual.value || node.data.basicType.value == 1)
                    return;
                $scope.devices.push(nodeId);
                $scope.nodes[nodeId] = {"label": $filter('deviceName')(nodeId, node), "node": node};
            });
            $scope.reorganizing = false;
        });
    };
    $scope.load($scope.lang);
});
// Statistics controller
appController.controller('TimingController', function($scope, $filter, dataService) {
    $scope.devices = [];
    $scope.timing = [];
    $scope.reset = function() {
        $scope.devices = angular.copy([]);
        //$scope.timing = angular.copy([]);
    };



    // Load data
//    $scope.load = function() {
//        dataService.getZwaveData(function(ZWaveAPIData) {
//            console.log($scope.timing);
//            setData(ZWaveAPIData);
//            dataService.joinedZwaveData(function(data) {
//                $scope.reset();
//                //$scope.loadTiming();
//                setData(data.joined);
//            });
//        });
//    };

    //$scope.load();

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
            if (isListening) {
                type = 'type_mains';
            } else if (!isListening && hasWakeup) {
                type = 'type_battery_wakup';
            } else if (!isListening && isFLiRS) {
                type = 'type_flirs';
            } else {
                type = 'type_remote';

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
// Controller controller
appController.controller('ControllerController', function($scope, $window, $filter, dataService) {
    $scope.funcList;
    $scope.ZWaveAPIData;
    $scope.info = {};
    $scope.master = {};
    $scope.runQueue = false;

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelQueueDataInterval();
        dataService.cancelZwaveDataInterval();
    });
    /**
     * DEPRECATED
     * Load data
     *
     */
//    $scope.load = function() {
//        dataService.getZwaveData(function(ZWaveAPIData) {
//
//            $scope.ZWaveAPIData = ZWaveAPIData;
////        if (path == 'controller.data.nonManagmentJobs')
////		return; // we don't want to redraw this page on each (de)queued packet
//
//            var homeId = ZWaveAPIData.controller.data.homeId.value;
//            var nodeId = ZWaveAPIData.controller.data.nodeId.value;
//            var canAdd = ZWaveAPIData.controller.data.isPrimary.value;
//            var isRealPrimary = ZWaveAPIData.controller.data.isRealPrimary.value;
//            var haveSIS = ZWaveAPIData.controller.data.SISPresent.value;
//            //var isSUC = ZWaveAPIData.controller.data.isSUC.value;
//            var SUCNodeID = ZWaveAPIData.controller.data.SUCNodeId.value;
//            var vendor = ZWaveAPIData.controller.data.vendor.value;
//            var productId = ZWaveAPIData.controller.data.manufacturerProductId.value;
//
//            var sdk = ZWaveAPIData.controller.data.SDK.value;
//            var libType = ZWaveAPIData.controller.data.libType.value;
//            var api = ZWaveAPIData.controller.data.APIVersion.value;
//            var revId = ZWaveAPIData.controller.data.softwareRevisionId.value;
//            var revVer = ZWaveAPIData.controller.data.softwareRevisionVersion.value;
//            var revDate = ZWaveAPIData.controller.data.softwareRevisionDate.value;
//            var manufactrerId = ZWaveAPIData.controller.data.manufacturerId.value;
//            var manufacturerProductId = ZWaveAPIData.controller.data.manufacturerProductId.value;
//            var ZWChip = ZWaveAPIData.controller.data.ZWaveChip.value;
//            var productType = ZWaveAPIData.controller.data.manufacturerProductType.value;
//            var obj = {};
//
//            $scope.info['ctrl_info_nodeid_value'] = nodeId;
//            $scope.info['ctrl_info_homeid_value'] = '0x' + ('00000000' + (homeId + (homeId < 0 ? 0x100000000 : 0)).toString(16)).slice(-8);
//            $scope.info['ctrl_info_primary_value'] = canAdd ? 'yes' : 'no';
//            $scope.info['ctrl_info_real_primary_value'] = isRealPrimary ? 'yes' : 'no';
//            $scope.info['ctrl_info_suc_sis_value'] = (SUCNodeID != 0) ? (SUCNodeID.toString() + ' (' + (haveSIS ? 'SIS' : 'SUC') + ')') : $scope._t('nm_suc_not_present');
//            $scope.info['ctrl_info_hw_vendor_value'] = vendor;
//            $scope.info['ctrl_info_hw_product_value'] = productType.toString() + " / " + productId.toString();
//            $scope.info['ctrl_info_hw_chip_value'] = ZWChip;
//            $scope.info['ctrl_info_sw_lib_value'] = libType;
//            $scope.info['ctrl_info_sw_sdk_value'] = sdk;
//            $scope.info['ctrl_info_sw_api_value'] = api;
//            $scope.info['ctrl_info_sw_rev_ver_value'] = revVer;
//            $scope.info['ctrl_info_sw_rev_id_value'] = revId;
//            $scope.info['ctrl_info_sw_rev_date_value'] = revDate;
//            $scope.info['manufactrerId'] = manufactrerId;
//            $scope.info['ZWaveChip'] = ZWChip;
//            $scope.info['manufacturerProductType'] = productType;
//            $scope.info['manufacturerProductId'] = manufacturerProductId;
//            /**
//             * Function list
//             */
//            var funcList = '';
//            var _fc = array_unique(ZWaveAPIData.controller.data.capabilities.value.concat(ZWaveAPIData.controller.data.functionClasses.value));
//            _fc.sort(function(a, b) {
//                return a - b
//            });
//            angular.forEach(_fc, function(func, index) {
//                var fcIndex = ZWaveAPIData.controller.data.functionClasses.value.indexOf(func);
//                var capIndex = ZWaveAPIData.controller.data.capabilities.value.indexOf(func);
//                var fcName = (fcIndex != -1) ? ZWaveAPIData.controller.data.functionClassesNames.value[fcIndex] : 'Not implemented';
//                funcList += '<span style="color: ' + ((capIndex != -1) ? ((fcIndex != -1) ? '' : 'gray') : 'red') + '">' + fcName + ' (0x' + ('00' + func.toString(16)).slice(-2) + ')</span>, ';
//            });
//            $scope.funcList = funcList;
//
//        });
//    };
    //$scope.load();

    /**
     * Load data
     *
     */
    $scope.loadData = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            $scope.master['controller.data.nodeId'] = ZWaveAPIData.controller.data.nodeId.value;
            $scope.master['controller.data.homeId'] = ZWaveAPIData.controller.data.homeId.value;
            $scope.master['controller.data.isPrimary'] = ZWaveAPIData.controller.data.isPrimary.value;
            $scope.master['controller.data.isRealPrimary'] = ZWaveAPIData.controller.data.isRealPrimary.value;
            $scope.master['controller.data.SUCNodeId'] = ZWaveAPIData.controller.data.SUCNodeId.value;
            $scope.master['controller.data.SISPresent'] = ZWaveAPIData.controller.data.SISPresent.value;
            $scope.master['controller.data.vendor'] = ZWaveAPIData.controller.data.vendor.value;
            $scope.master['controller.data.manufacturerProductType'] = ZWaveAPIData.controller.data.manufacturerProductType.value;
            $scope.master['controller.data.manufacturerProductId'] = ZWaveAPIData.controller.data.manufacturerProductId.value;
            $scope.master['controller.data.manufacturerId'] = ZWaveAPIData.controller.data.manufacturerId.value;
            $scope.master['controller.data.ZWaveChip'] = ZWaveAPIData.controller.data.ZWaveChip.value;
            $scope.master['controller.data.libType'] = ZWaveAPIData.controller.data.libType.value;
            $scope.master['controller.data.SDK'] = ZWaveAPIData.controller.data.SDK.value;
            $scope.master['controller.data.APIVersion'] = ZWaveAPIData.controller.data.APIVersion.value;
            $scope.master['controller.data.APIVersion'] = ZWaveAPIData.controller.data.APIVersion.value;
            $scope.master['controller.data.softwareRevisionVersion'] = ZWaveAPIData.controller.data.softwareRevisionVersion.value;
            $scope.master['controller.data.softwareRevisionId'] = ZWaveAPIData.controller.data.softwareRevisionId.value;
            $scope.master['controller.data.softwareRevisionDate'] = ZWaveAPIData.controller.data.softwareRevisionDate.value;
            $scope.master['controller.data.softwareRevisionDate'] = ZWaveAPIData.controller.data.softwareRevisionDate.value;

            // Texts
            $scope.master['txtHomeId'] = '';
            $scope.master['txtSucSis'] = '';
            setText($scope.master);

            // Function list
            var funcList = '';
            var _fc = array_unique(ZWaveAPIData.controller.data.capabilities.value.concat(ZWaveAPIData.controller.data.functionClasses.value));
            _fc.sort(function(a, b) {
                return a - b
            });
            angular.forEach(_fc, function(func, index) {
                var fcIndex = ZWaveAPIData.controller.data.functionClasses.value.indexOf(func);
                var capIndex = ZWaveAPIData.controller.data.capabilities.value.indexOf(func);
                var fcName = (fcIndex != -1) ? ZWaveAPIData.controller.data.functionClassesNames.value[fcIndex] : 'Not implemented';
                funcList += '<span style="color: ' + ((capIndex != -1) ? ((fcIndex != -1) ? '' : 'gray') : 'red') + '">' + fcName + ' (0x' + ('00' + func.toString(16)).slice(-2) + ')</span>, ';
            });
            $scope.funcList = funcList;
        });
    };
    $scope.loadData();

    /**
     * Refresh data
     *
     */
    $scope.refresh = function() {
        dataService.joinedZwaveData(function(data) {
            var src = {};
            angular.forEach(data.update, function(v, k) {
                if ($filter('hasProp')($scope.master, k)) { // true
                    src[k] = v['value'];
                    angular.extend($scope.master, src);
                }
            });
            setText($scope.master);
        });
    };
    $scope.refresh();
    /**
     *
     * Run cmd
     */
    $scope.runCmd = function(cmd) {
        dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
    };

    /**
     * Inspect Queue
     */
    $scope.inspectQueue = function(target, cancel) {
        $(target).modal();
        if (cancel) {
            dataService.cancelQueueDataInterval();
            return;
        }
        // Load queue
        dataService.getQueueData(function(data) {
            getQueueUpdate(data);
        });
        // Refresh queue
        dataService.updateQueueData(function(data) {
            getQueueUpdate(data);
        });
        return;


    };

    $scope.openQueue = function() {
        $window.open('#network/queue', 'MyWindow', "width=1200, height=400");
    };

    /// --- Private functions --- ///


    // Get Queue updates
    function getQueueUpdate(data) {
        var trs = '';
        angular.forEach(data, function(job, jobIndex) {
            var buff = '';
            for (var b in job[5]) {
                buff += job[5][b].toString(16) + ' ';
            }
            ;
            var progress;
            if (job[4] === null) {
                progress = '';
            } else if (typeof (job[4]) == 'string') {
                progress = job[4].replace(/\n/g, '<br/>')
            } else {
                job[4].join('<br />');
            }

            trs +=
                    '<tr>' +
                    '<td>' + job[1][0] + '</td>' +
                    '<td>' + (job[1][11] ? "U" : " ") + '</td>' +
                    '<td>' + (job[1][1] ? "W" : " ") + '</td>' +
                    '<td>' + (job[1][2] ? "S" : " ") + '</td>' +
                    '<td>' + (job[1][3] ? "E" : " ") + '</td>' +
                    '<td>' + (job[1][4] ? "D" : " ") + '</td>' +
                    '<td>' + (job[1][5] ? (job[1][6] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + (job[1][7] ? (job[1][8] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + (job[1][9] ? (job[1][10] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + parseFloat(job[0]).toFixed(2) + '</td>' +
                    '<td>' + job[2] + '</td>' +
                    '<td class="alignleft">' + job[3] + '</td>' +
                    '<td class="alignleft">' + progress + '</td>' +
                    '<td class="alignleft">' + buff + '</td>' +
                    '</tr>\n';
        });
        if (trs == '') {
            trs = '<tr><td colspan="12"><i>' + $scope._t('inspect_queue_empty') + '</i></td></tr>';
        }
        $('#inspect_queue_len').html('Queue length: ' + data.length);
        $('#inspect_queue_table_body').html(trs);
        return trs;
    }
    // Get Queue updates
    function setText(master) {
        angular.forEach(master, function(v, k) {
            var src = {};
            switch (k) {
                case 'controller.data.SUCNodeId':
                    src['txtSucSis'] = (v != 0) ? (v.toString() + ' (' + (master['controller.data.SISPresent'] ? 'SIS' : 'SUC') + ')') : $scope._t('nm_suc_not_present');
                    angular.extend($scope.master, src);
                    break;
                case 'controller.data.homeId':
                    src['txtHomeId'] = '0x' + ('00000000' + (v + (v < 0 ? 0x100000000 : 0)).toString(16)).slice(-8);
                    ;
                    angular.extend($scope.master, src);
                    break;

                default:
                    break;
            }

        });
        return;

    }
});
// Commands controller
appController.controller('QueueController', function($scope, dataService) {
    /**
     * Inspect Queue
     */
    $scope.inspectQueue = function() {
        // Load queue
        dataService.getQueueData(function(data) {
            getQueueUpdate(data);
        });
        // Refresh queue
        dataService.updateQueueData(function(data) {
            getQueueUpdate(data);
        });
        return;
    };

    $scope.inspectQueue();

    /// --- Private functions --- ///


    // Get Queue updates
    function getQueueUpdate(data) {
        var trs = '';
        angular.forEach(data, function(job, jobIndex) {
            var buff = '';
            for (var b in job[5]) {
                buff += job[5][b].toString(16) + ' ';
            }
            ;
            var progress;
            if (job[4] === null) {
                progress = '';
            } else if (typeof (job[4]) == 'string') {
                progress = job[4].replace(/\n/g, '<br/>')
            } else {
                job[4].join('<br />');
            }

            trs +=
                    '<tr>' +
                    '<td>' + job[1][0] + '</td>' +
                    '<td>' + (job[1][11] ? "U" : " ") + '</td>' +
                    '<td>' + (job[1][1] ? "W" : " ") + '</td>' +
                    '<td>' + (job[1][2] ? "S" : " ") + '</td>' +
                    '<td>' + (job[1][3] ? "E" : " ") + '</td>' +
                    '<td>' + (job[1][4] ? "D" : " ") + '</td>' +
                    '<td>' + (job[1][5] ? (job[1][6] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + (job[1][7] ? (job[1][8] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + (job[1][9] ? (job[1][10] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + parseFloat(job[0]).toFixed(2) + '</td>' +
                    '<td>' + job[2] + '</td>' +
                    '<td class="alignleft">' + job[3] + '</td>' +
                    '<td class="alignleft">' + progress + '</td>' +
                    '<td class="alignleft">' + buff + '</td>' +
                    '</tr>\n';
        });
        if (trs == '') {
            trs = '<tr><td colspan="12"><i>' + $scope._t('inspect_queue_empty') + '</i></td></tr>';
        }
        $('#inspect_queue_len').html($scope._t('txt_queue_length') + ': ' + data.length);
        $('#inspect_queue_table_body').html(trs);
        return trs;
    }
    ;
});
// Command class modal window controller
appController.controller('InterviewCommandController', function($scope, $filter, deviceService) {
    // Show modal dialog
    $scope.showModal = function(target, interviewCommands, ccId, type) {
        var interviewData = {};
        var updateTime;
        $(target).modal();
        if (type) {
            angular.forEach(interviewCommands, function(v, k) {
                if (v.ccId == ccId) {
                    interviewData = v[type];
                    updateTime = v.updateTime;
                    return;
                }
            });
        } else {
            interviewData = interviewCommands;
        }
// DEPRECATED
        // Formated output
//        var getCmdData = function(data, name, space) {
//            if (name == undefined) {
//                return '';
//            }
//            var html = '<div class="cc-data-element">' + space + name + ': <span class="' + ((data.updateTime > data.invalidateTime) ? 'green' : 'red') + '">' + ((typeof (data.value) !== 'undefined' && data.value != null) ? data.value.toString() : 'None') + '</span>' + ' (<span class="' + ((data.updateTime > data.invalidateTime) ? '' : 'red') + '">' + $filter('isTodayFromUnix')(data.updateTime) + '</span>)</div>';
//            angular.forEach(data, function(el, key) {
//
//                if (key != 'type' && key != 'updateTime' && key != 'invalidateTime' && key != 'value' && // these are internal values
//                        key != 'capabilitiesNames') { // these make the dialog monstrious
//                    html += getCmdData(el, key, space + '&nbsp;&nbsp;&nbsp;&nbsp;');
//                }
//            });
//            return html;
//        };
        // Get data
        //var html = getCmdData(interviewData, '/', '');
        var html = deviceService.configGetCommandClass(interviewData, '/', '');
        /*if(updateTime){
         html += '<p class="help-block"><em>' + $filter('dateFromUnix')(updateTime )+ '<em></p>'; 
         }*/


        // Fill modal with data
        $(target).on('shown.bs.modal', function() {
            $(target + ' .modal-body').html(html);
        });
    };
});
// LicenseController
appController.controller('LicenseController', function($scope, $timeout, dataService) {
    $scope.proccessVerify = {
        'message': false,
        'status': 'is-hidden'

    };
    $scope.controllerUuid = null;
    $scope.proccessUpdate = {
        'message': false,
        'status': 'is-hidden'

    };
    $scope.formData = {
        "scratch_id": null
    };
    $scope.license = {
        "scratch_id": null,
        "capability": null,
        "uid": null,
        "license_id": null,
        "base_license": null,
        "reseller_id": null,
        "revoke": null,
        "selldate": null,
        "usedate": null
    };
    $scope.ZWaveAPIData = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.controllerUuid = ZWaveAPIData.controller.data.uuid.value;

        });
    };
    $scope.ZWaveAPIData();
    /**
     * Get license key
     */
    $scope.getLicense = function(formData) {
        // Clear messages
        $scope.proccessVerify.message = false;
        $scope.proccessUpdate.message = false;
        if (!formData.scratch_id) {
            return;
        }
        $scope.proccessVerify = {'message': $scope._t('verifying_licence_key'), 'status': 'fa fa-spinner fa-spin'};
        var input = {
            'uuid': $scope.controllerUuid,
            'scratch': formData.scratch_id
        };
        dataService.getLicense(input).then(function(response) {
            $scope.proccessVerify = {'message': $scope._t('success_licence_key'), 'status': 'fa fa-check text-success'};
            console.log('1. ---------- SUCCESS Verification ----------', response);

            // Update capabilities
            updateCapabilities(response);

        }, function(error) {// Error verifying key
            //debugger;
            var message = $scope._t('error_no_licence_key');
            if (error.status == 404) {
                var message = $scope._t('error_404_licence_key');
            }
            $scope.proccessVerify = {'message': message, 'status': 'fa fa-exclamation-triangle text-danger'};
            console.log('1. ---------- ERROR Verification ----------', error);

        });
        return;
    };


    /// --- Private functions --- ///

    /**
     * Update capabilities
     */
    function updateCapabilities(data) {
        $scope.proccessUpdate = {'message': $scope._t('upgrading_capabilities'), 'status': 'fa fa-spinner fa-spin'};
        dataService.zmeCapabilities(data).then(function(response) {
            $scope.proccessUpdate = {'message': $scope._t('success_capabilities'), 'status': 'fa fa-check text-success'};
            console.log('2. ---------- SUCCESS updateCapabilities ----------', response);
            //proccessCapabilities(response);
        }, function(error) {
            $scope.proccessUpdate = {'message': $scope._t('error_no_capabilities'), 'status': 'fa fa-exclamation-triangle text-danger'};
            console.log('2. ---------- ERROR updateCapabilities ----------', error);
        });
    }
    ;
    /**
     * DEPRECATED
     * Update Proccess capabilities
     */
//    function proccessCapabilities(response) {
//        $('.verify-ctrl').attr('disabled', true);
//        return;
//        $timeout(function() {
//            if ('do something to check when update is complete') {
//                $scope.proccessUpdate = {'message': $scope._t('success_capabilities'), 'status': 'fa fa-check text-success'};
//                console.log('3. ---------- SUCCESS proccessCapabilities ----------', response);
//            } else {// Otherwise show error message
//                $scope.proccessUpdate = {'message': $scope._t('error_no_capabilities'), 'status': 'fa fa-exclamation-triangle text-danger'};
//                console.log('3. ---------- ERROR proccessCapabilities ----------');
//            }
//            $('.verify-ctrl').attr('disabled', false);
//            return;
//
//        }, 3000);
//
//    };
});
// UzbController
appController.controller('UzbController', function($scope, $timeout, dataService) {
    $scope.uzbUpgrade = [];
    $scope.uzbFromUrl = [];
    $scope.alert = {message: false, status: 'is-hidden', icon: false};
    /**
     * Load data
     *
     */
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            var vendorId = parseInt(ZWaveAPIData.controller.data.manufacturerId.value, 10);
            //0x0115 = 277, 0x0147 = 327
            var allowedVendors = [277, 327];
            if (allowedVendors.indexOf(vendorId) === -1) {
                $scope.alert = {message: $scope._t('noavailable_firmware_update'), status: 'alert-info', icon: 'fa-info-circle'};
                return;
            }
            var appVersion = ZWaveAPIData.controller.data.APIVersion.value.split('.');
            var appVersionMajor = parseInt(appVersion[0], 10);
            var appVersionMinor = parseInt(appVersion[1], 10);
            var urlParams = '?vendorId=' + vendorId + '&appVersionMajor=' + appVersionMajor + '&appVersionMinor=' + appVersionMinor;
            //return;
            // Load uzb
            loadUzb(urlParams);
        });
    };
    $scope.load();

    // Upgrade bootloader/firmware
    $scope.upgrade = function(row, action, url) {
        $scope.alert = {message: false};
        var cmd = $scope.cfg.server_url + action;
        var data = {
            url: url
        };
        $('.update-ctrl button').attr('disabled', true);
        $scope.alert = {message: $scope._t('upgrade_bootloader_proccess'), status: 'alert-warning', icon: 'fa-spinner fa-spin'};
        dataService.updateUzb(cmd, data).then(function(response) {
            if (action == '/ZWaveAPI/ZMEFirmwareUpgrade') {
                $scope.alert = {message: $scope._t('success_firmware_update'), status: 'alert-success', icon: 'fa-check'};
                console.log('---------- SUCCESS firmware ----------', response);
                //upgradeFirmware(response);
            } else {
                $scope.alert = {message: $scope._t('success_bootloader_update'), status: 'alert-success', icon: 'fa-check'};
                console.log('---------- SUCCESS bootloader  ----------', response);


                //upgradeBootloader(response);
            }
            $('.update-ctrl button').attr('disabled', false);
        }, function(error) {
            $scope.alert = {message: $scope._t('error_handling_data'), status: 'alert-danger', icon: 'fa-exclamation-triangle'};
            console.log('ERROR', error);
            $('.update-ctrl button').attr('disabled', false);
        });
    };

    /// --- Private functions --- ///

    /**
     * Load uzb data
     */
    function loadUzb(urlParams) {
        $scope.alert = {message: $scope._t('loading_data_remote'), status: 'alert-warning', icon: 'fa-spinner fa-spin'};
        dataService.getUzb(urlParams).then(function(response) {
            if (response.length > 0) {
                $scope.uzbUpgrade = response;
                $scope.alert = {message: false};
            } else {
                $scope.alert = {message: $scope._t('noavailable_firmware_update'), status: 'alert-info', icon: 'fa-info-circle'};
            }
        }, function(error) {
            $scope.alert = {message: $scope._t('error_handling_data_remote'), status: 'alert-danger', icon: 'fa-exclamation-triangle'};
            console.log('ERROR', error);
        });
    }
    ;

    /**
     * DEPRECATED
     * Proccessing bootloader upgrade
     */
//    function upgradeBootloader(response) {
//        $('.update-ctrl button').attr('disabled', true);
//        $scope.alert = {message: $scope._t('upgrade_bootloader_proccess'), status: 'alert-warning', icon: 'fa-spinner fa-spin'};
//        //console.log(response);
//        return;
//        $timeout(function() {
//            if ('do something to check when update is complete') {
//                $scope.alert = {message: $scope._t('success_bootloader_update'), status: 'alert-success', icon: 'fa-check'};
//                console.log('---------- SUCCESS bootloader ----------', response);
//            } else {// Otherwise show error message
//                $scope.alert = {message: $scope._t('error_bootloader_update'), status: 'alert-danger', icon: 'fa-exclamation-triangle'};
//                console.log('---------- ERROR bootloader ----------');
//            }
//            $('.update-ctrl button').attr('disabled', false);
//           
//        }, 3000);
//
//    }
//    ;

    /**
     * Proccessing firmware upgrade
     */
//    function upgradeFirmware(response) {
//        $('.update-ctrl button').attr('disabled', true);
//        $scope.alert = {message: $scope._t('upgrade_firmware_proccess'), status: 'alert-warning', icon: 'fa-spinner fa-spin'};
//        //console.log(response); 
//        return;
//        $timeout(function() {
//            if ('do something to check when update is complete') {
//               $scope.alert = {message: $scope._t('success_firmware_update'), status: 'alert-success', icon: 'fa-check'};
//                console.log('---------- SUCCESS firmware ----------', response);
//            } else {// Otherwise show error message
//                $scope.alert = {message: $scope._t('error_firmware_update'), status: 'alert-danger', icon: 'fa-exclamation-triangle'};
//                console.log('---------- ERROR firmware ----------');
//            }
//        }, 3000);
//
//    } ;

});
/**
 * Error controller
 */
appController.controller('ErrorController', function($scope, $routeParams, deviceService) {
    $scope.errorCfg = {
        code: false,
        icon: 'fa-warning'
    };
    /**
     * Logout proccess
     */
    $scope.loadError = function(code) {
        if (code) {
            $scope.errorCfg.code = code;
        } else {
            $scope.errorCfg.code = 0;
        }
        deviceService.showConnectionError(code);

    };
    $scope.loadError($routeParams.code);

});


