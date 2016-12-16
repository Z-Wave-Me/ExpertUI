/**
 * @overview This controller renders and handles device firmware update stuff.
 * @author Martin Vach
 */

/**
 * Device configuration firmware controller
 * @class ConfigFirmwareController
 *
 */
appController.controller('ConfigFirmwareController', function ($scope, $routeParams, $location, $cookies, $timeout,cfg, dataService, deviceService) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'firmware';
    $scope.activeUrl = 'configuration/firmware/';
    $scope.showForm = false;
    $scope.formFirmware = {};
    $scope.firmwareProgress = 0;

    $scope.firmware = {
        input:{
            url: '',
            targetId: ''
        }
    };

    $cookies.tab_config = $scope.activeTab;

    // Load data
    $scope.load = function (nodeId) {
        dataService.getZwaveData(function (ZWaveAPIData) {
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            if(_.isEmpty($scope.devices)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
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

            if (0x7a in node.instances[0].commandClasses) {
                $scope.showForm = true;
            }
        });
    };
    $scope.load($routeParams.nodeId);

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
    $scope.updateDeviceFirmware = function (input,id) {
        $scope.toggleRowSpinner(id);
        var cmd = cfg.server_url + cfg.fw_update_url + '/' + $scope.deviceId
        var fd = new FormData();

        fd.append('file',$scope.myFile);
        fd.append('url', input.url);
        fd.append('targetId', input.targetId|| '0');
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


});