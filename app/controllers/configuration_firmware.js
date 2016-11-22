/**
 * @overview This controller renders and handles device firmware update stuff.
 * @author Martin Vach
 */

/**
 * Device configuration firmware controller
 * @class ConfigFirmwareController
 *
 */
appController.controller('ConfigFirmwareController', function ($scope, $routeParams, $location, $cookies, dataService, deviceService) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'firmware';
    $scope.activeUrl = 'configuration/firmware/';
    $scope.showForm = false;
    $scope.formFirmware = {};
    $scope.firmwareProgress = 0;

    $cookies.tab_config = $scope.activeTab;

    // Load data
    $scope.load = function (nodeId) {
        dataService.getZwaveData(function (ZWaveAPIData) {
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
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
     * update Firmware
     * todo: complete this function
     */
    $scope.updateFirmware = function (nodeId) {
        if (!$scope.formFirmware.url && !$scope.formFirmware.targetId) {
            return;
        }
        // $('.fa-spin').show();

        // File upload test
        var data = {
            'url': $scope.formFirmware.url,
            'file': $scope.myFile,
            'targetId': $scope.formFirmware.targetId
        };

//        dataService.joinedZwaveData(function(data) {
//            $scope.firmwareProgress++;
//            console.log($filter('hasNode')(data.update,'FirmwareUpdate.data.fragmentTransmitted.value'));
//
////                refresh(data.update);
//        });

        // Watch for progress change
        $scope.$watch('firmwareProgress', function () {
            if ($scope.firmwareProgress >= 100) {
                $('.fa-spin').fadeOut();
                dataService.cancelZwaveDataInterval();
            }

        });
        // Cancel interval on page destroy
        $scope.$on('$destroy', function () {
            dataService.cancelZwaveDataInterval();
        });

        dataService.fwUpdate(nodeId, data);
        return;
    };

});