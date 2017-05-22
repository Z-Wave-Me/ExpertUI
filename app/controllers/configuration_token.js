/**
 * @overview This controller renders and handles device firmware update stuff.
 * @author Martin Vach
 */

/**
 * Device configuration token controller
 * @class ConfigTokenController
 *
 */
appController.controller('ConfigTokenController', function ($scope, $routeParams, $location, $cookies, $timeout, $filter, $interval, cfg, dataService, deviceService) {
    $scope.devices = [];
    $scope.deviceName = '';
    $scope.deviceId = 0;
    //$scope.activeTab = 'firmware';
    $scope.activeUrl = 'configuration/token/';
    $cookies.tab_config = 'token';

    $scope.token = {
        input: {
            token: ''
        }
    };

    // Load zwave data
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


        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.load($routeParams.nodeId);

    /**
     * Create/Update a token
     */
    $scope.addToken = function () {
        if ($scope.token.input.token === '') {
            return;
        }
        console.log('Adding token: ',$scope.token.input.token)

    };
});