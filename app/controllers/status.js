/**
 * StatusController
 * @author Martin Vach
 */
appController.controller('StatusController', function ($scope, $filter, $timeout,$interval,dataService, cfg,_, deviceService) {
    $scope.statuses = {
        all: [],
        interval: null,
        show: false
    };
    $scope.interviewCommandsDevice = [];
    $scope.interviewCommands = [];
    $scope.deviceInfo = {
        "index": null,
        "id": null,
        "name": null
    };
    $scope.ZWaveAPIData;
    $scope.interviewDeviceId = null;

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.statuses.interval);
    });


    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            setData(ZWaveAPIData);
            if(_.isEmpty($scope.statuses.all)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            $scope.statuses.show = true;
            $scope.refreshZwaveData(ZWaveAPIData);
        }, function(error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshZwaveData = function(ZWaveAPIData) {
        var refresh = function() {
            dataService.loadJoinedZwaveData(ZWaveAPIData).then(function(response) {
                setData(response.data.joined);
            }, function(error) {});
        };
        //$scope.statuses.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Ping device
     * @param {string} url
     */
    $scope.pingDevice = function(url) {
        $scope.toggleRowSpinner(url);
        dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + url);
        });
    };

    /**
     * Ping all devices
     * @param {string} id
     * @param {string} urlType
     */
    $scope.pingAllDevices = function (id, urlType) {
        var lastItem = _.last($scope.statuses.all);
        $scope.toggleRowSpinner(id);
        angular.forEach($scope.statuses.all, function (v, k) {
            if (v.urlToStore) {
                $scope.toggleRowSpinner(v[urlType]);
                dataService.runZwaveCmd(cfg.store_url + v[urlType]).then(function (response) {
                    alertify.dismissAll();
                }, function (error) {
                    alertify.dismissAll();
                    alertify.alertError($scope._t('error_update_data') + '\n' + v[urlType]);
                });

            }
            if (lastItem.rowId === v.rowId) {
                $timeout($scope.toggleRowSpinner, 1000);
            }
        });

    };

    // Handle modal interview
    $scope.handleModalInterview = function (target, $event,index, id, name) {
        $scope.deviceInfo = {
            "index": index,
            "id": id,
            "name": name
        };
        $scope.interviewDeviceId = id;
        var node = $scope.ZWaveAPIData.devices[id];
        $scope.interviewCommands = deviceService.configGetInterviewCommands(node);
        $scope.handleModal(target,$event)

    };
    /**
     * Purge all command classes and start interview for a device
     * @param {string} cmd
     */
    $scope.interviewForceDevice = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };
    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        var doorLockCCId = 0x62;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            if (deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
            /*if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }*/

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
        var isController = (ZWaveAPIData.controller.data.nodeId.value == nodeId);
        var lastReceive = parseInt(node.data.lastReceived.updateTime, 10) || 0;
        var lastSend = parseInt(node.data.lastSend.updateTime, 10) || 0;
        var lastCommunication = (lastSend > lastReceive) ? lastSend : lastReceive;
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
        var operating_cont = operatingCont(lastCommunication);
        var interview_cont = false;
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

        var obj = {};
        obj['id'] = nodeId;
        obj['rowId'] = 'row_' + nodeId;
        obj['isController'] = isController;
        obj['cmd'] = bindPath.split(',');
        obj['genericType'] = genericType;
        obj['specificType'] = specificType;
        obj['name'] = $filter('deviceName')(nodeId, node);
        obj['sleeping'] = sleeping_cont;
        obj['dateTime'] = $filter('getDateTimeObj')(lastCommunication);
        obj['isFailed'] = node.data.isFailed.value;
        // obj['ddr'] = ddrCont(node);
        obj['urlToStore'] = (!isController && (isListening || isFLiRS) ? 'devices[' + nodeId + '].SendNoOperation()' : false);
        obj['interview'] = interview_cont;
        obj['isListening'] = isListening;
        obj['isFLiRS'] = isFLiRS;
        obj['hasWakeup'] = hasWakeup;
        obj['lastCommunication'] = lastCommunication;
        obj['sleepingSince'] = sleepingSince;
        obj['lastWakeup'] = lastWakeup;
        obj['interval'] = interval;
        var findIndex = _.findIndex($scope.statuses.all, {rowId: obj.rowId});
        if(findIndex > -1){
            angular.extend( $scope.statuses.all[findIndex],obj);

        }else{
            $scope.statuses.all.push(obj);
        }

    }
    ;

    // Refresh Modal Interview data
    /*function refreshModalInterview(oldCc, newCc) {
        var refresh = JSON.stringify(oldCc) !== JSON.stringify(newCc);
        if (refresh) {
            $scope.interviewCommands = deviceService.configGetInterviewCommands(newCc);
        }


    }*/

    // Refresh Modal Interview data
    /*function refreshModalInterview(oldCc, newCc) {
        var refresh = JSON.stringify(oldCc) !== JSON.stringify(newCc);
        if (refresh) {
            $scope.interviewCommands = deviceService.configGetInterviewCommands(newCc);
        }


    }*/

    // Get operating HTML
    /*function operatingCont(lastCommunication) {
//        var operating_cont = (isFailed ? ('<i class="fa fa-ban fa-lg text-danger" title="' + $scope._t('device_is_dead') + '"></i>') : ('<i class="fa fa-check fa-lg text-success" title="' + $scope._t('device_is_operating') + '"></i>')) + ' <span title="' + $scope._t('last_communication') + '" class="not_important">' + $filter('isTodayFromUnix')(lastCommunication) + '</span>';
        var operating_cont = '<span title="' + $scope._t('last_communication') + '" class="not_important">' + $filter('isTodayFromUnix')(lastCommunication) + '</span>';
        return operating_cont;
    }*/

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
            sleeping_cont = ' <i class="fa fa-clock-o fa-lg" title="' + $scope._t('battery_operated_device_with_wakeup') + '"></i> <span title="' + $scope._t('sleeping_since') + '" class="not_important">' + approx + lastSleep + '</span> &#8594; <span title="' + $scope._t('next_wakeup') + '">' + approx + nextWakeup + '</span>';
        } else if (!isListening && isFLiRS)
            sleeping_cont = '<i class="fa fa-headphones fa-lg" title="' + $scope._t('FLiRS_device') + '"></i>';
        else
            sleeping_cont = '<i class="fa fa-rss fa-lg" title="' + $scope._t('battery_operated_remote_control') + '"></i>';
        return sleeping_cont;
    }
});