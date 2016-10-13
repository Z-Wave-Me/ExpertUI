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
        $interval.cancel($scope.switches.interval);
    });


    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            setData(ZWaveAPIData);
            if(_.isEmpty($scope.statuses.all)){
                $scope.alert = {message: $scope._t('error_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
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
        $scope.statuses.interval = $interval(refresh, $scope.cfg.interval);
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
            console.log(v)
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

    // Load data
    /*$scope.load = function () {
        dataService.getZwaveData(function (ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            setData($scope.ZWaveAPIData);
            dataService.joinedZwaveData(function (data) {
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
    $scope.load($scope.lang);*/

    // Cancel interval on page destroy
    /*$scope.$on('$destroy', function () {
        dataService.cancelZwaveDataInterval();
    });*/
    /*// Store data from on remote server
    $scope.store = function (btn) {
        var url = $(btn).attr('data-store-url');
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };*/

    // Store all data on remote server
    /*$scope.storeAll = function (btn) {
        angular.forEach($scope.statuses.all, function (v, k) {
            if (v.urlToStore) {
                dataService.runCmd(v.urlToStore);
            }
        });
    };*/
    $scope.showModalInterview = function (target, index, id, name) {
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
    $scope.hideModalInterview = function () {
        $scope.interviewDeviceId = null;
    };

    // Show modal CommandClass dialog
    $scope.showModalCommandClass = function (target, instanceId, ccId, type) {
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
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
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
        var operating_cont = operatingCont(lastCommunication);
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
        /*var ddr = false;
         if (angular.isDefined(node.data.ZDDXMLFile)) {
         ddr = node.data.ZDDXMLFile.value;
         }*/

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
        obj['isFailed'] = getIsFailedCont(isFailed);
        // obj['ddr'] = ddrCont(node);
        obj['urlToStore'] = (isListening || isFLiRS ? 'devices[' + nodeId + '].SendNoOperation()' : false);
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

    // Refresh data
    function refreshData(data) {
        angular.forEach($scope.statuses.all, function (v, k) {
            angular.forEach(v.cmd, function (ccId, key) {
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
                            if (isFailed) {
                                $('#' + v.rowId + ' .row-isfailed').html(getIsFailedCont(isFailed));
                            }
                            $('#' + v.rowId + ' .row-time').html(operatingCont(lastCommunication));
                            break;
                        case lastReceiveCmd:
                            var lastReceive = data[lastReceiveCmd].updateTime;
                            lastCommunication = (lastReceive > lastCommunication) ? lastReceive : lastCommunication;
                            var operating_cont_rec = operatingCont(lastCommunication);
                            $('#' + v.rowId + ' .row-time').html(operating_cont_rec);
                            break;
                        case lastSendCmd:
                            var lastSend = data[lastSendCmd].updateTime;
                            lastCommunication = (lastSend > lastCommunication) ? lastSend : lastCommunication;
                            var operating_cont_send = operatingCont(lastCommunication);
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
    function operatingCont(lastCommunication) {
//        var operating_cont = (isFailed ? ('<i class="fa fa-ban fa-lg text-danger" title="' + $scope._t('device_is_dead') + '"></i>') : ('<i class="fa fa-check fa-lg text-success" title="' + $scope._t('device_is_operating') + '"></i>')) + ' <span title="' + $scope._t('last_communication') + '" class="not_important">' + $filter('isTodayFromUnix')(lastCommunication) + '</span>';
        var operating_cont = '<span title="' + $scope._t('last_communication') + '" class="not_important">' + $filter('isTodayFromUnix')(lastCommunication) + '</span>';
        return operating_cont;
    }

    // Get is failed
    function getIsFailedCont(isFailed) {
        var failed_cont = (isFailed ? ('<i class="fa fa-ban fa-lg text-danger" title="' + $scope._t('device_is_dead') + '"></i>') : ('<i class="fa fa-check fa-lg text-success" title="' + $scope._t('device_is_operating') + '"></i>'));
        return failed_cont;
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
            sleeping_cont = ' <i class="fa fa-clock-o fa-lg" title="' + $scope._t('battery_operated_device_with_wakeup') + '"></i> <span title="' + $scope._t('sleeping_since') + '" class="not_important">' + approx + lastSleep + '</span> &#8594; <span title="' + $scope._t('next_wakeup') + '">' + approx + nextWakeup + '</span>';
        } else if (!isListening && isFLiRS)
            sleeping_cont = '<i class="fa fa-headphones fa-lg" title="' + $scope._t('FLiRS_device') + '"></i>';
        else
            sleeping_cont = '<i class="fa fa-rss fa-lg" title="' + $scope._t('battery_operated_remote_control') + '"></i>';
        return sleeping_cont;
    }
});