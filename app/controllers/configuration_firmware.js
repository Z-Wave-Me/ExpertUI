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
    $scope.activeTab = 'firmware';
    $scope.activeUrl = 'configuration/firmware/';
    /*$scope.showForm = false;
     $scope.formFirmware = {};
     $scope.firmwareProgress = 0;*/

    $scope.firmware = {
        show: false,
        input: {
            url: '',
            targetId: ''
        },
        interval: null,

        update: {
            progress: 0,
            updateStatus: null,
            fragmentTransmitted: 0,
            fragmentCount: 0,
            waitTime: 0
        }

    };

    $cookies.tab_config = $scope.activeTab;

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

            if ('122' in node.instances[0].commandClasses) {
                $scope.firmware.show = true;
                //setFirmwareData(node);
                //$scope.refreshZwaveData();
            }else{
                $scope.alert = {message: $scope._t('no_device_service'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }

        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.load($routeParams.nodeId);

    /**
     * todo: not needed?
     * Refresh zwave data
     */
    /*$scope.refreshZwaveData = function () {
        var refresh = function () {
            dataService.loadJoinedZwaveData().then(function (response) {
                var node = response.data.joined.devices[nodeId];
                setFirmwareData(node);
            }, function (error) {
            });
        };
        $scope.firmware.interval = $interval(refresh, $scope.cfg.interval);
    };*/

    // Redirect to detail page
    $scope.changeDevice = function (deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };
    /**
     * Handles device firmware update
     * @param {object} input
     * @param {string} id
     */
    $scope.updateDeviceFirmware = function (input, id) {
        $scope.toggleRowSpinner(id);
        var cmd = cfg.server_url + cfg.fw_update_url + '/' + $scope.deviceId
        var fd = new FormData();

        fd.append('file', $scope.myFile);
        fd.append('url', input.url);
        fd.append('targetId', input.targetId || '0');
        dataService.uploadApiFile(cmd, fd).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
            deviceService.showNotifier({message: $scope._t('success_device_firmware_update')});
            /*$timeout(function () {
             alertify.dismissAll();
             $window.location.reload();
             }, 2000);*/
        }, function (error) {
            $timeout($scope.toggleRowSpinner, 1000);
            alertify.alertError($scope._t('error_device_firmware_update'));
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
                $scope.firmware.show = false;
                return;
            }
            var fragmentTransmitted = fw.data.updateStatus.value;
            var fragmentCount = fw.data.fragmentCount.value;
            var progress = ((fragmentTransmitted / fragmentCount) * 100).toFixed();

            $scope.firmware.update.fragmentTransmitted = fragmentTransmitted;
            $scope.firmware.update.fragmentCount = fragmentCount;
            $scope.firmware.update.fragmentCount = fragmentCount;
            $scope.firmware.update. progress =  progress;

            $scope.firmware.update.updateStatus = fw.data.updateStatus.value;
            $scope.firmware.update.waitTime = fw.data.waitTime.value;

            return;

        });

    }


});