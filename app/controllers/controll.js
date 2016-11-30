/**
 * ControllController
 * @author Martin Vach
 */
appController.controller('ControllController', function($scope, $filter, $window, $upload, $interval, $location, cfg, dataService, deviceService) {
    $scope.apiDataInterval;
    $scope.devices = {};
    $scope.sucNodes = {};
    $scope.failedNodes = {};
    $scope.replaceNodes = {};
    $scope.failedBatteries = {};
    $scope.modelSucSicNode = 1;
    //$scope.sucNodes = [];
    $scope.frequency = false;
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
    $scope.modelRestoreChipInfo = 0;
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
            }, function(error) {
                deviceService.showConnectionError(error);
                return;
            });
        };
        $scope.apiDataInterval = $interval(refresh, $scope.cfg.interval);
    };


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
    $scope.runCmd = function(cmd, hideModal, url, id, action) {
        //$scope.toggleRowSpinner(id);
        var folder = (url ? url : cfg.store_url);
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
                    break;
            }
        }
        if (hideModal) {
            $(hideModal).modal('hide');
            deviceService.showNotifier({message: $scope._t('reloading')});
            $timeout( function() {
                $window.location.reload();
            }, 1000);
        }
        return;
    };
    
     /**
     * Send request restore backup
     * @returns {void}
     */
    $scope.restoreFromFile = function($files, show, hide) {
        var chip = (!$scope.modelRestoreChipInfo ? 0 : $scope.modelRestoreChipInfo);
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
        $scope.frequency = $filter('hasNode')(ZWaveAPIData, 'controller.data.frequency.value');
        $scope.controllerState = ZWaveAPIData.controller.data.controllerState.value;
        $scope.secureInclusion = ZWaveAPIData.controller.data.secureInclusion.value;
        $scope.startLearnMode = !isRealPrimary || hasDevices < 2 ? true : false;
        $scope.isPrimary = isPrimary;
        $scope.isSIS = isSIS;
        if (hasSUC && hasSUC != controllerNodeId) {
            $scope.disableSUCRequest = false;
        }
        //console.log($scope.frequency)

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