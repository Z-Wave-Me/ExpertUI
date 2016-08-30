/**
 * Application Home controller
 * @author Martin Vach
 */

/**
 * Report controller
 */
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
     $scope.controller = {
         controllerState: 0,
         startLearnMode: false
     };

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
            var isRealPrimary = ZWaveAPIData.controller.data.isRealPrimary.value;
            var hasDevices = Object.keys(ZWaveAPIData.devices).length;
            $scope.ZWaveAPIData = ZWaveAPIData;
            notInterviewDevices(ZWaveAPIData);
            notInterviewDevices(ZWaveAPIData);
            countDevices(ZWaveAPIData);
            assocRemovedDevices(ZWaveAPIData);
            notConfigDevices(ZWaveAPIData);
            batteryDevices(ZWaveAPIData);
            $scope.mainsDevices = $scope.countDevices - $scope.batteryDevices;
            $scope.controller.controllerState = ZWaveAPIData.controller.data.controllerState.value;
            $scope.controller.startLearnMode = !isRealPrimary || hasDevices < 2 ? true : false;
            dataService.joinedZwaveData(function(data) {
                $scope.reset();
                notInterviewDevices(data.joined);
                countDevices(data.joined);
                assocRemovedDevices(data.joined);
                //notConfigDevices(ZWaveAPIData);
                batteryDevices(data.joined);
                $scope.mainsDevices = $scope.countDevices - $scope.batteryDevices;
                $scope.controller.controllerState = data.joined.controller.data.controllerState.value;

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
        $route.reload();
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
    
     // Run Zwave Command
    $scope.runZwaveCmd = function (cmd) {
         $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin'};
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {
             $scope.loading = false;
        }, function (error) {
             $scope.loading = false;
            alertify.alertError($scope._t('error_load_data') + '\n' + cmd);
        });
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

// Home Dongle controller
appController.controller('HomeDongleController', function($scope, $window,$cookies,dataService) {
    // Controller vars
    $scope.homeDongle ={
        model: {
            current: $scope.cfg.dongle,
            dongle: ''
        },
        //data: ['zway','newdongle','mydongle'],
        data: []
    };
    /**
     * Load zwave dongles
     */
    $scope.loadHomeDongle = function() {
        dataService.getZwaveList().then(function(response) {
            if(response.length > 1){
                 angular.extend($scope.homeDongle,{data: response});
            }
        }, function(error) {});
    };
    $scope.loadHomeDongle();
    
    /**
     * Set dongle 
     */
    $scope.setHomeDongle = function() {
        if($scope.homeDongle.model.dongle === ''){
            return;
        }
        angular.extend($scope.cfg,{dongle: $scope.homeDongle.model.dongle});
        $cookies.dongle = $scope.homeDongle.model.dongle;
        dataService.purgeCache();
        //$route.reload();
        $window.location.reload();
    };
});