/**
 * @overview This controller renders and handles device firmware update stuff.
 * @author Martin Vach
 */

/**
 * Device configuration firmware controller
 * @class ConfigFirmwareController
 *
 */
appController.controller('ConfigFirmwareController', function ($scope, $routeParams, $location, $cookies, $timeout, $filter, $interval, cfg, dataService, deviceService) {
    $scope.devices = [];
    $scope.deviceName = '';
    $scope.deviceId = 0;
    //$scope.activeTab = 'firmware';
    $scope.activeUrl = 'configuration/firmware/';
    $cookies.tab_config = 'firmware';

    $scope.firmware = {
        show: false,
        input: {
            action: 'file',
            url: null,
            targetId: null,
            file: null
        },
        interval: null,
        firmware_targets: [$scope._t('ota_zwave_chip')],
        update: {
            show : false,
            status: '',
            progress: 0,
            updateStatus: null,
            fragmentTransmitted: null,
            fragmentCount: null,
            waitTime: 0,
            buttonId: 'btn_update',
            alert: {}
        }

    };
    $scope.firmwareVersion = '';
    /**
     * Load firmwares from the storage data
     */
    function loadFirmwares(urlParams) {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin'};
        dataService.getFirmwares(urlParams).then(function (response) {
            if (response.length > 0) {
                $scope.firmwares = response;
            }
            $scope.loading = false;
        }, function (error) {
            $scope.loading = false;
            alertify.alertError($scope._t('error_handling_data_remote'));
        });
    };

    // Load data
    $scope.load = function (nodeId) {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            if (_.isEmpty($scope.devices)) {
                $scope.alert = {
                    message: $scope._t('device_404'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation-circle'
                };
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            if (!node || deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
            // Remember device id
            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.deviceName = $filter('deviceName')(nodeId, node);
            if(deviceService.hasCommandClass(node,122)){
                $scope.firmware.show = true;
                var fwCount = node.instances[0].commandClasses[122].data.firmwareCount.value;
                if (fwCount) // FirmwareUpdate v1 did't had this DH
                    for (var fw_num = 1; fw_num <= fwCount; fw_num++)
                        $scope.firmware.firmware_targets.push($scope._t('ota_additional_target') + ' ' + fw_num.toString());
                $scope.refreshZwaveData($scope.deviceId);
            }else{
                $scope.alert = {message: $scope._t('no_device_service'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }

            var manufacturerId = node.data.manufacturerId.value;
            var productTypeId = node.data.manufacturerProductType.value;
            var productId = node.data.manufacturerProductId.value
            var appVersionMajor = node.data.applicationMajor.value;
            var appVersionMinor = node.data.applicationMinor.value;
            $scope.firmwareVersion = appVersionMajor + '.' + appVersionMinor;
            var fromFrequency = ZWaveAPIData.controller.data.frequency.value;
            var urlParams = 
                '?manufacturerId=' + manufacturerId +
                '&productTypeId=' + productTypeId +
                '&productId=' + productId +
                '&appVersionMajor=' + appVersionMajor +
                '&appVersionMinor=' + appVersionMinor +
                '&fromFrequency=' + fromFrequency;

            loadFirmwares(urlParams);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.load($routeParams.nodeId);

    /**
     * todo: not needed?
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function (nodeId) {
        var refresh = function () {
            dataService.loadZwaveApiData(true).then(function (ZWaveAPIData) {
                var node = ZWaveAPIData.devices[nodeId];
                setFirmwareData(node);
            }, function (error) {
            });
        };
        $scope.firmware.interval = $interval(refresh, $scope.cfg.interval);
    };

    // Redirect to device
    $scope.redirectToDevice = function (deviceId) {
        if (deviceId) {
            $location.path($scope.activeUrl + deviceId);
        }
    };
    /**
     * Handles device firmware update
     * @param {object} input
     * @param {string} id
     */
    $scope.updateDeviceFirmware = function (input, id) {

        if (input.action === 'url') {
            input.file = undefined;
        } else {
            input.url = undefined;
        }

        if (input.file && cfg.upload.fw_or_bootloader.extension.indexOf($filter('fileExtension')(input.file.name)) === -1) {
            alertify.alertError(
                $scope._t('upload_format_unsupported', {'__extension__': $filter('fileExtension')(input.file.name)}) + ' ' +
                $scope._t('upload_allowed_formats', {'__extensions__': cfg.upload.fw_or_bootloader.extension.toString()})
            );

            return;
        }

        var fd = new FormData();
        if (!fd) {
            return;
        }

        $scope.toggleRowSpinner(id);
        var cmd = cfg.server_url + cfg.fw_update_url + '/' + $scope.deviceId

        fd.append('file', input.file);
        fd.append('url', input.url);
        fd.append('targetId', input.targetId || '0');
        dataService.uploadApiFile(cmd, fd).then(function (response) {
            $scope.firmware.update.show = true;
            $scope.firmware.update.status = 'in progress';
            $scope.firmware.update.buttonId = id;
        }, function (error) {
            $timeout($scope.toggleRowSpinner, 1000);
            alertify.alertError($scope._t('error_device_firmware_update') + ':<br/>' + error.data);
        });
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setFirmwareData(device) {
        angular.forEach(device.instances, function (instance, instanceId) {
            if (instanceId == 0 && device.instances.length > 1) {
                return;
            }
            var fw = instance.commandClasses['122'];
            if (!fw) {
                //$scope.firmware.show = false;
                return;
            }

            if(!$filter('hasNode')(fw,'data.fragmentTransmitted')){
                angular.extend(fw.data,{fragmentTransmitted:{value: null}});
            }

            if(!$filter('hasNode')($scope.firmware,'update.fragmentTransmitted')){
                angular.extend($scope.firmware,{update:{fragmentTransmitted: null}});
            }

            if (fw.data.fragmentTransmitted.value !== $scope.firmware.update.fragmentTransmitted && !!$scope.firmware.update.fragmentTransmitted){
                if (!$scope.rowSpinner[$scope.firmware.update.buttonId]) {
                    $scope.toggleRowSpinner($scope.firmware.update.buttonId);
                }
                $scope.firmware.update.status = 'in progress';
                $scope.firmware.update.show = true;
            }
            var inProgress = $scope.firmware.update.status === 'in progress';
            var updateStatus = fw.data.updateStatus.value;
            var fragmentTransmitted = fw.data.fragmentTransmitted.value;
            var fragmentCount = fw.data.fragmentCount.value;
            var progress = ((fragmentTransmitted / fragmentCount) * 100).toFixed();
            var updateMessages = {
                "0x00": "fw_update_checksum_err", //The device was unable to receive the requested firmware data without checksum error. Not updated.
                "0x01": "fw_update_receive_err", //The device was unable to receive the requested firmware data. Not updated.
                "0x02": "fw_update_err_wrong_manufacturer_id", //The transferred image does not match the Manufacturer ID. Not updated.
                "0x03": "fw_update_err_wrong_fw_id", //The transferred image does not match the Firmware ID. Not updated.
                "0x04": "fw_update_err_wrong_fw_target", //The transferred image does not match the Firmware Target. Not updated.
                "0x05": "fw_update_err_invalid_file_header_info", //Invalid file header information. Not updated.
                "0x06": "fw_update_err_invalid_file_header_format", //Invalid file header format. Not updated.
                "0x07": "fw_update_err_insufficient_memory", //Insufficient memory. Not updated.
                "0xFD": "fw_update_download_success_activation_cmd", //Firmware image downloaded successfully. Waiting for activation command.
                "0xFE": "fw_update_download_success_manual_restart", //Firmware image downloaded successfully. Manual restart needed.
                "0xFF": "fw_update_download_success_auto_upgrade", //Firmware image downloaded successfully. The device will now start upgrading. Then the device will restart itself.
            };

            $scope.firmware.update.fragmentTransmitted = fragmentTransmitted;
            $scope.firmware.update.fragmentCount = fragmentCount;
            $scope.firmware.update.progress =  isNaN(progress)? 0 : (progress > 100 ? 100 : progress);

            $scope.firmware.update.updateStatus = updateStatus;
            $scope.firmware.update.waitTime = fw.data.waitTime.value;

            if (inProgress && updateStatus && !!updateStatus) {
                $scope.firmware.update.alert = {
                    message: $scope._t(updateMessages[$filter('decToHex')(updateStatus, 2, '0x')]),
                    status: 'alert-warning',
                    icon: 'fa-exclamation-circle'
                };
            }
            if (inProgress) {
                if($scope.firmware.update.progress === 100) {
                    $timeout($scope.toggleRowSpinner, 1000);
                    deviceService.showNotifier({message: $scope._t('success_device_firmware_update')});
                    $scope.firmware.update.status = 'done';
                } else if ([0,1,2,3,4,5,6,7].indexOf(updateStatus) >= 0) {
                    $timeout($scope.toggleRowSpinner, 1000);
                    deviceService.showNotifier({message: $scope._t('error_device_firmware_update'), type: 'error'});
                    $scope.firmware.update.status = 'fail';
                    $scope.firmware.update.show = false;
                }
            }
        });
    }

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.firmware.interval);
        $scope.firmware = {};
        $timeout($scope.toggleRowSpinner, 1000);
    });
});
