/**
 * @overview This controller renders and handles reorganizations.
 * @author Martin Vach
 */
/**
 * Reorganization root controller
 * @class ReorganizationController
 *
 */
appController.controller('ReorganizationController', function ($scope, $filter, $timeout, $interval, $window, cfg, dataService, _) {
    $scope.reorganizations = {
        input: {
            reorgMain: true,
            reorgBattery: false
        },
        trace: 'stop',
        run: false,
        all: [],
        interval: null,
        show: false,
        lastUpdate: 0
    };


    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.reorganizations.interval);
    });

    /**
     * Set trace
     */
    $scope.setTrace = function (trace, input) {
        $interval.cancel($scope.reorganizations.interval);
        switch (trace) {
            case 'pause':
                $scope.reorganizations.trace = 'pause';
                //$interval.cancel($scope.reorganizations.interval);
                $scope.reorganizations.run = false;
                break;
            case 'run':
                /*if($scope.reorganizations.trace === 'stop'){
                    $scope.reorganizations.all = [];
                }*/
                $scope.runReorganization(input);
                $scope.reorganizations.trace = 'run';


                break;
            case 'stop':
                $scope.reorganizations.all = [];
                $scope.reorganizations.trace = 'stop';
                //$interval.cancel($scope.reorganizations.interval);
                $scope.reorganizations.run = false;
                break;
            default:
                 break;

        }
        //console.log('Set trace: ',  $scope.zniffer.trace)
    };

    /**
     * Run reorganization
     */
    $scope.runReorganization = function (input) {
        var params = '?reorgMain=' + input.reorgMain + '&reorgBattery=' + input.reorgBattery;
        $scope.reorganizations.all = [];
        $scope.reorganizations.run = false;
        dataService.getApi('reorg_run_url', params, true).then(function (response) {
            $scope.reorganizations.run = {
                message: response.data.data,
                status: 'alert-success',
                icon: 'fa-spinner fa-spin'
            };
            $scope.loadReorganizationLog(true);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    //$scope.runReorganization($scope.reorganizations.input);

    /**
     * Load reorganization log
     */
    $scope.loadReorganizationLog = function (refresh) {
        dataService.getApi('reorg_log_url', null, true).then(function (response) {
            //response.data = [];
            if(_.isEmpty(response.data)){
                $scope.reorganizations.run = {
                    message: $scope._t('reorg_empty'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation'
                };
                $scope.reorganizations.trace = 'stop';
                return;
            }

            //$scope.reorganizations.all = [];
            setData(response.data);
            if (refresh) {
                $scope.refreshReorganization();
            } else {
                $scope.reorganizations.lastUpdate = $filter('getDateTimeObj')(response.data.pop().timestamp / 1000);
            }

        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };



    /**
     * Download reorganization log
     */
    $scope.downloadReorganizationLog = function () {
        // Build a log
        var data = '';
        angular.forEach($scope.reorganizations.all, function (v, k) {
            data += v.dateTime.time + ': ' + v.message + '\n';
        });

        // Download a log
        var log = data;
        blob = new Blob([log], {type: 'text/plain'}),
            url = $window.URL || $window.webkitURL;
        $scope.fileUrl = url.createObjectURL(blob);
    };

    /**
     * Refresh zwave data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshReorganization = function () {
        var refresh = function () {
            dataService.getApi('reorg_log_url', null, true).then(function (response) {
                setData(response.data);
            }, function (error) {
            });
        };
        $scope.reorganizations.interval = $interval(refresh,cfg.reorg_interval);
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(data) {
        //$scope.reorganizations.all.push(data);
        //$scope.reorganizations.all = [];

        // Loop throught data
        angular.forEach(data, function (v, k) {

            /*var obj = {};
            obj['timestamp'] = v.timestamp;
            obj['message'] = v.message;
            obj['dateTime'] = $filter('getDateTimeObj')(v.timestamp / 1000);*/
            v. dateTime = $filter('getDateTimeObj')(v.timestamp / 1000);
            var findIndex = _.findIndex($scope.reorganizations.all, {timestamp: v.timestamp});

            if (findIndex === -1) {
                $scope.reorganizations.all.push(v);

            } else {

            }
            /*var isComplete = v.message.search("reorg complete");
            if(isComplete > -1){
                $scope.setTrace('pause');
            }*/
            //console.log(isComplete);


        });
    }

    $scope.loadReorganizationLog();
});
/**
 * OLD ReorganizationController
 * @author Martin Vach
 */
appController.controller('ReorganizationOldController', function ($scope, $filter, $interval, $timeout, dataService, cfg) {

    $scope.mainsPowered = true;
    $scope.batteryPowered = false;
    $scope.devices = [];
    $scope.nodes = {};
    $scope.ZWaveAPIData;
    $scope.processQueue = [];
    $scope.reorganizing = true;
    $scope.log = [];
    $scope.logged = "";
    $scope.appendLog = function (str, line) {
        if (line !== undefined) {
            $scope.log[line] += str;
        } else {
            $scope.log.push($filter('getTime')(new Date().getTime() / 1000) + ": " + str);
        }
        dataService.putReorgLog($scope.log.join("\n"));
        return $scope.log.length - 1;
    };
    $scope.downloadLog = function () {
        var hiddenElement = $('<a id="hiddenElement" href="' + cfg.server_url + cfg.reorg_log_url + '?at=' + (new Date()).getTime() + '" target="_blank" download="reorg.log"></a>').appendTo($('body'));
        hiddenElement.get(0).click();
        hiddenElement.detach();
    };
    var refreshLog = function () {
        // Assign to scope within callback to avoid data flickering on screen
        dataService.getReorgLog(function (log) {
            $scope.logged = log;
            // scroll to bottom
            var textarea = $("#reorg_log").get(0);
            textarea.scrollTop = textarea.scrollHeight;
        });
    };
    var promise = $interval(refreshLog, 1000);
    // Cancel interval on page changes
    $scope.$on('$destroy', function () {
        if (angular.isDefined(promise)) {
            $interval.cancel(promise);
            promise = undefined;
        }
    });
    $scope.reorgNodesNeighbours = function (current, result, doNext) {
        if (("complete" in current) && current.complete) {
            doNext();
            return;
        }
        dataService.store('devices[' + current.nodeId + '].RequestNodeNeighbourUpdate()', function (response) {
            var pollForNodeNeighbourUpdate = function (current) {
                dataService.updateZwaveDataSince(current.since, function (updateZWaveAPIData) {
                    $scope.appendLog(".", current.line);
                    try {
                        if ("devices." + current.nodeId + ".data.neighbours" in updateZWaveAPIData) {
                            var obj = updateZWaveAPIData["devices." + current.nodeId + ".data.neighbours"]
                            if (current.since < obj.updateTime && obj.invalidateTime < obj.updateTime) {
                                $scope.ZWaveAPIData.devices[current.nodeId].data.neighbours = obj;
                                $scope.nodes[current.nodeId].node = $scope.ZWaveAPIData.devices[current.nodeId];
                                // routes updated
                                var routesCount = $filter('getRoutesCount')($scope.ZWaveAPIData, current.nodeId);
                                $.each($scope.ZWaveAPIData.devices, function (nnodeId, nnode) {
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
                }, function (error) {
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
        }, function (error) {
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
    $scope.processReorgNodesNeighbours = function (result, pos) {
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
            $scope.reorgNodesNeighbours(current, result, function () {
            });
            pos++;
            $scope.processReorgNodesNeighbours(result, pos);
        } else {
            // main powereds are processed sequential
            $scope.reorgNodesNeighbours(current, result, function () {
                pos++;
                $scope.processReorgNodesNeighbours(result, pos);
            });
        }
    };
    // reorgAll routes
    $scope.reorgAll = function () {
        $scope.reorganizing = true;
        $scope.log = [];
        $scope.appendLog($scope._t('reorg_started'));
        // retry each element up to 4 times
        $scope.processQueue = [];
        var logInfo = "";
        if ($scope.mainsPowered) {
            for (var retry = 0; retry < 4; retry++) {
                // first RequestNodeNeighbourUpdate for non-battery devices
                $.each($scope.devices, function (index, nodeId) {
                    if ($filter('updateable')($scope.nodes[nodeId].node, nodeId, false)) {
                        $scope.processQueue.push({
                            "nodeId": nodeId,
                            "retry": retry,
                            "type": "mains",
                            "since": $scope.ZWaveAPIData.updateTime,
                            "fork": false
                        });
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
                $.each($scope.devices, function (index, nodeId) {
                    if ($filter('updateable')($scope.nodes[nodeId].node, nodeId, true)) {
                        $scope.processQueue.push({
                            "nodeId": nodeId,
                            "retry": retry,
                            "type": "battery",
                            "since": $scope.ZWaveAPIData.updateTime,
                            "fork": true
                        });
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
    $scope.load = function (lang) {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            // Prepare devices and nodes
            angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
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