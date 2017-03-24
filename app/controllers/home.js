/**
 * Application Home controller
 * @author Martin Vach
 */

/**
 * Report controller
 */
// Home controller
appController.controller('HomeController', function ($scope, $filter, $timeout, $route, $interval, dataService, deviceService, cfg) {
    $scope.home = {
        show: false,
        interval: null,
        devices: {},
        localyReset:[],
        devicesCnt: {
            mains: 0,
            battery: 0,
            flirs: 0,
            sum: 0
        },
        networkInformation: {
            mains: 0,
            battery: 0,
            flirs: 0,
            sum: 0
        }
    };
    $scope.ZWaveAPIData;
    $scope.countDevices;
    $scope.failedDevices = [];
    //$scope.batteryDevices;
    $scope.batteryWakeupDevices;
    $scope.lowBatteryDevices = [];
    //$scope.flirsDevices;
    //$scope.mainsDevices;
    $scope.localyResetDevices = [];
    $scope.notInterviewDevices = [];
    $scope.assocRemovedDevices = [];
    $scope.notConfigDevices = [];
    $scope.notes = [];
    $scope.notesData = '';
    //$scope.updateTime = $filter('getTimestamp');
    $scope.controller = {
        controllerState: 0,
        startLearnMode: false
    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.home.interval);
    });

    /*$scope.reset = function() {
     $scope.failedDevices = angular.copy([]);
     $scope.lowBatteryDevices = angular.copy([]);
     $scope.notInterviewDevices = angular.copy([]);
     $scope.localyResetDevices = angular.copy([]);
     $scope.assocRemovedDevices = angular.copy([]);
     $scope.notConfigDevices = angular.copy([]);

     };*/

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function () {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.home.show = true;
            var isRealPrimary = ZWaveAPIData.controller.data.isRealPrimary.value;
            var hasDevices = Object.keys(ZWaveAPIData.devices).length;
            $scope.ZWaveAPIData = ZWaveAPIData;
            setData(ZWaveAPIData);
            deviceChangedConfig(ZWaveAPIData);

            notInterviewDevices(ZWaveAPIData);
            countDevices(ZWaveAPIData);
            assocRemovedDevices(ZWaveAPIData);
            notConfigDevices(ZWaveAPIData);
            batteryDevices(ZWaveAPIData);
            //$scope.mainsDevices = $scope.countDevices - ($scope.batteryDevices + $scope.flirsDevices);
            $scope.controller.controllerState = ZWaveAPIData.controller.data.controllerState.value;
            $scope.controller.startLearnMode = !isRealPrimary || hasDevices < 2 ? true : false;
            $scope.refreshZwaveData();
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    //$scope.loadZwaveData();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function () {
        var refresh = function () {
            dataService.loadJoinedZwaveData().then(function (response) {
                notInterviewDevices(response.data.joined);
                countDevices(response.data.joined);
                assocRemovedDevices(response.data.joined);
                //notConfigDevices(ZWaveAPIData);
                batteryDevices(response.data.joined);
                //$scope.mainsDevices = $scope.countDevices - ($scope.batteryDevices + $scope.flirsDevices);
                $scope.controller.controllerState = response.data.joined.controller.data.controllerState.value;
            }, function (error) {
            });
        };
        $scope.home.interval = $interval(refresh, $scope.cfg.interval);
    };
    if (!cfg.custom_ip) {
        //$scope.loadData();
        $scope.loadZwaveData();
    } else {
        if (cfg.server_url != '') {
            //$scope.loadData();
            $scope.loadZwaveData();
        }
    }


    /**
     * Set custom IP
     */
    $scope.setIP = function (ip) {
        if (!ip || ip == '') {
            $('.custom-ip-error').show();
            return;
        }
        $interval.cancel($scope.home.interval);
        $('.custom-ip-success,.custom-ip-true .home-page').hide();
        var setIp = 'http://' + ip + ':8083';
        cfg.server_url = setIp;
        $scope.loadHomeData = true;
        $route.reload();
    };

    // Run Zwave Command
    $scope.runZwaveCmdConfirm = function (cmd, confirm) {
        if (confirm) {
            alertify.confirm(confirm, function () {
                _runZwaveCmd(cmd);
            });
        } else {
            _runZwaveCmd(cmd);
        }
    };

    /**
     * todo: deprecated
     * Show modal window
     *
     * @returns {void}
     */
    /*$scope.showModal = function (target, id) {

        /!*var obj = $filter('filter')($scope.devices, function(d) {
         return d.id == id;
         })[0];
         if (obj) {
         $scope.deviceInfo = {
         "id": obj.id,
         "name": obj.name
         };
         }*!/
        $(target).modal();
        return;
    };*/

    /// --- Private functions --- ///

    /**
     * Run zwave cmd
     */
    function _runZwaveCmd(cmd) {
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {
        }, function (error) {
            alertify.alertError($scope._t('error_load_data') + '\n' + cmd);
        });
    }
    ;

    /**
     * todo: move all scope settings to this function
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        var networkInformation = {
            mains: 0,
            battery: 0,
            flirs: 0,
            sum: 0
        };
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        /**
         * Loop through nodes
         */
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            if (deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
            var report = [];
            var batteryCharge = '';
            var hasBattery = false;
            var allInterviewsDone = deviceService.allInterviewsDone(node.instances);
            if(!allInterviewsDone){
                report.push('txt_interview_not');
            }
            var isFailed = deviceService.isFailed(node);
            if(isFailed){
                report.push('txt_failed');
            }
            console.log(nodeId,allInterviewsDone)
            var assocRemoved = deviceAssocRemoved(node, ZWaveAPIData);
            if (assocRemoved.length > 0) {
                report.push('txt_assoc_removed');
            }
            var isLocalyReset = deviceService.isLocalyReset(node);
             /**
             * Set network information
             */
            // Count mains devices
            if ((node.data.isListening.value && node.data.isRouting.value) || (node.data.isListening.value && !node.data.isRouting.value)) {
                networkInformation.mains++;
            }
            // Count battery devices
            else if (!node.data.isListening.value && (!node.data.sensor250.value && !node.data.sensor1000.value)) {
                batteryCharge = parseInt(node.instances[0].commandClasses[0x80].data.last.value);
                if ( batteryCharge <= 20 && allInterviewsDone) {
                    report.push('txt_low_battery')
                }
                networkInformation.battery++;
            }
            // Count flirs devices
            else if (node.data.sensor250.value || node.data.sensor1000.value) {

                networkInformation.flirs++;
            }
            networkInformation.sum++;


            var obj = {};
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['id'] = nodeId;
            obj['isController'] = controllerNodeId == nodeId;
            obj['report'] = report;
            obj['batteryCharge'] = batteryCharge;
            if(!$scope.home.devices[nodeId]){
                $scope.home.devices[nodeId] = obj;
            }
            if (isLocalyReset) {
             //$scope.localyResetDevices.push(obj);
             var findIndexR = _.findIndex($scope.home.localyReset, {id: obj.id});
             if (findIndexR > -1) {
             angular.extend($scope.home.localyReset[findIndexR], obj);

             } else {
             $scope.home.localyReset.push(obj);
             }
             }
        });
        $scope.home.networkInformation = networkInformation;
        console.log(networkInformation)
        /*if(!('isFailed' in $scope.home.devices[nodeId].report)){
         $scope.home.devices[nodeId].report.push('isFailed');
         }*/

    }

    /**
     * Device changed vonfiguration
     */
    function deviceChangedConfig(ZWaveAPIData) {
        // Loop throught devices
        dataService.xmlToJson(cfg.server_url + '/config/Configuration.xml').then(function (response) {
            //dataService.getCfgXml(function(cfgXml) {
            angular.forEach(response.config.devices.deviceconfiguration, function (cfg, cfgId) {
                var node = ZWaveAPIData.devices[cfg['_id']];
                if (!node || !$filter('hasNode')(node, 'instances.0.commandClasses.112')) {
                    return;
                }
                var nodeId = cfg['_id'];
                var array = JSON.parse(cfg['_parameter']);
                var cfgNum = 0;
                var cfgVal;
                var devVal;
                if (array.length > 2) {
                    cfgNum = array[0];
                    cfgVal = array[1];
                    if(node.instances[0].commandClasses[0x70].data[cfgNum]){
                        devVal = node.instances[0].commandClasses[0x70].data[cfgNum].val.value;
                    }
                    if ($scope.home.devices[nodeId] && (cfgVal != devVal)) {
                        if($scope.home.devices[nodeId].report.indexOf('device_changed_configuration') === -1){
                            $scope.home.devices[nodeId].report.push('device_changed_configuration');
                        }

                    }

                }
            });
        });
    }
    /**
     * Device assoc removed
     */
    function deviceAssocRemoved(node, ZWaveAPIData) {
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
                            assocDevices.push({
                                'id': targetNodeId,
                                'name': '(#' + targetNodeId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])
                            });
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
                            assocDevices.push({
                                'id': targetNodeId,
                                'name': '(#' + targetNodeId + instanceId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])
                            });
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

    /**
     * Count devices
     */
    function countDevices(ZWaveAPIData) {
        var cnt = 0;
        var cntFlirs = 0;
        var networkInformation = {
            mains: 0,
            battery: 0,
            flirs: 0,
            sum: 0
        };
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {

            if (deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
           /* var isListening = node.data.isListening.value || node.data.isRouting.value;
            var isBattery =
            var isFLiRS = (node.data.sensor250.value || node.data.sensor1000.value);*/
            if((node.data.isListening.value && node.data.isRouting.value) || (node.data.isListening.value && !node.data.isRouting.value)){ // Count mains devices
                networkInformation.mains++;
            }else if(!node.data.isListening.value && (!node.data.sensor250.value && !node.data.sensor1000.value)){// Count battery devices
                networkInformation.battery++;
            }else if(node.data.sensor250.value || node.data.sensor1000.value){// Count flirs devices

                networkInformation.flirs++;
            }

            //var isFLiRS = !node.data.isListening.value && (node.data.sensor250.value || node.data.sensor1000.value);
            //var isListening = node.data.isListening.value && node.data.isRouting.value;
            //var hasWakeup = deviceService.hasCommandClass(node, 132);
            /*if(isFLiRS){ // Count flirs devices
                networkInformation.flirs++;
            }else if(isListening){// Count mains devices
                networkInformation.mains++;
            }else{// Count battery devices
                networkInformation.battery++;
            }*/
            networkInformation.sum++;
            var isLocalyReset = deviceService.isLocalyReset(node);
            var isFailed = deviceService.isFailed(node);

            var obj = {};
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['id'] = nodeId;
            // Create object with failed devices
            if (isFailed) {
                //$scope.failedDevices.push(obj);
                var findIndexF = _.findIndex($scope.failedDevices, {id: obj.id});
                if (findIndexF > -1) {
                    angular.extend($scope.failedDevices[findIndexF], obj);

                } else {
                    $scope.failedDevices.push(obj);
                }
            }
            // Create object with localy reset devices
            if (isLocalyReset) {
                //$scope.localyResetDevices.push(obj);
                var findIndexR = _.findIndex($scope.localyResetDevices, {id: obj.id});
                if (findIndexR > -1) {
                    angular.extend($scope.localyResetDevices[findIndexR], obj);

                } else {
                    $scope.localyResetDevices.push(obj);
                }
            }

            cnt++;
        });
        $scope.home.devicesCnt = networkInformation;
        //$scope.flirsDevices = cntFlirs;
        //$scope.countDevices = cnt + cntFlirs;
    }
    ;

    /**
     * batteryDevices
     */
    function batteryDevices(ZWaveAPIData) {
        var controllerId = ZWaveAPIData.controller.data.nodeId.value;
        var batteryCnt = 0;
        var batteryWakeupCnt = 0;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            if (nodeId == 255 || nodeId == controllerId || node.data.isVirtual.value) {
                return;
            }
            var hasBattery = 0x80 in node.instances[0].commandClasses;
            var hasBatteryWakeup = 0x84 in node.instances[0].commandClasses;
            var instanceId = 0;
            var interviewDone = false;
            var ccId = 0x80;
            if (!hasBattery || !hasBatteryWakeup) {
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
                //$scope.lowBatteryDevices.push(obj);
                var findIndex = _.findIndex($scope.lowBatteryDevices, {id: obj.id});
                if (findIndex > -1) {
                    angular.extend($scope.lowBatteryDevices[findIndex], obj);

                } else {
                    $scope.lowBatteryDevices.push(obj);
                }
            }
            if (hasBattery) {
                batteryCnt++;
            }
            if (hasBatteryWakeup) {
                batteryWakeupCnt++;
            }

        });
        //$scope.batteryDevices = batteryCnt;
        $scope.batteryWakeupDevices = batteryWakeupCnt;
    }
    ;

    /**
     * notInterviewDevices
     */
    function notInterviewDevices(ZWaveAPIData) {
        var controllerId = ZWaveAPIData.controller.data.nodeId.value;
        var cnt = 0;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
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
                        //$scope.notInterviewDevices.push(obj);
                        var findIndex = _.findIndex($scope.notInterviewDevices, {id: obj.id});
                        if (findIndex > -1) {
                            angular.extend($scope.notInterviewDevices[findIndex], obj);

                        } else {
                            $scope.notInterviewDevices.push(obj);
                        }
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
        // Loop throught devices
        dataService.xmlToJson(cfg.server_url + '/config/Configuration.xml').then(function (response) {
            //dataService.getCfgXml(function(cfgXml) {
            angular.forEach(response.config.devices.deviceconfiguration, function (cfg, cfgId) {
                var node = ZWaveAPIData.devices[cfg['_id']];
                if (!node || !$filter('hasNode')(node, 'instances.0.commandClasses.112')) {
                    return;
                }
                var array = JSON.parse(cfg['_parameter']);
                var cfgNum = 0;
                var cfgVal;
                var devVal;
                if (array.length > 2) {
                    cfgNum = array[0];
                    cfgVal = array[1];
                    if(node.instances[0].commandClasses[0x70].data[cfgNum]){
                        devVal = node.instances[0].commandClasses[0x70].data[cfgNum].val.value;
                    }

                    if (cfgVal != devVal) {
                        var obj = {};
                        obj['name'] = $filter('deviceName')(cfg['_id'], node);
                        obj['id'] = cfg['_id'];
                        //$scope.notConfigDevices.push(obj);
                        var findIndex = _.findIndex($scope.notConfigDevices, {id: obj.id});
                        if (findIndex > -1) {
                            angular.extend($scope.notConfigDevices[findIndex], obj);

                        } else {
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
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            if (nodeId == 255 || nodeId == controllerId || node.data.isVirtual.value) {
                return;
            }
            var removedDevices = assocGedRemovedDevices(node, ZWaveAPIData);
            if (removedDevices.length > 0) {
                var obj = {};
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['id'] = nodeId;
                obj['assoc'] = removedDevices;
                //$scope.assocRemovedDevices.push(obj);
                var findIndex = _.findIndex($scope.assocRemovedDevices, {id: obj.id});
                if (findIndex > -1) {
                    angular.extend($scope.assocRemovedDevices[findIndex], obj);

                } else {
                    $scope.assocRemovedDevices.push(obj);
                }
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
                            assocDevices.push({
                                'id': targetNodeId,
                                'name': '(#' + targetNodeId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])
                            });
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
                            assocDevices.push({
                                'id': targetNodeId,
                                'name': '(#' + targetNodeId + instanceId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])
                            });
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
