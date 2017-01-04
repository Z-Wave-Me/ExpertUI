/**
 * @overview This controller renders and handles device postfix stuff.
 * @author Martin Vach
 */

/**
 * Device configuration Postfix controller
 * @class ConfigPostfixController
 *
 */
appController.controller('ConfigPostfixController', function ($scope, $routeParams, $location, $cookies, $filter, $timeout, $window, dataService, deviceService) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.deviceName = '';
    $scope.activeTab = 'postfix';
    $scope.activeUrl = 'configuration/postfix/';
    $cookies.tab_config = $scope.activeTab;
    $scope.postfix = {
        find: false,
        interview: {
            preInterview: '',
            postInterview: '',
        },
        model: {
            p_id: false,
            product: '',
            preInterview: [],
            postInterview: [],
            last_update: '',
            tester: '',
            commentary: ''
        }
    };
    // Interview data
    $scope.descriptionCont;
    $scope.deviceZddx = [];
    // Redirect to detail page
    $scope.changeDevice = function (deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };
    // Load data
    $scope.loadData = function (nodeId) {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            if(_.isEmpty($scope.devices)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            if (!node || deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.deviceName = $filter('deviceName')(nodeId, node);
            $scope.postfix.model.p_id = getPId(node);
            $scope.loadPostfix($scope.postfix.model.p_id);
        }, function (error) {
            $location.path('/error/' + error.status);
            return;
        });
    };
    $scope.loadData($routeParams.nodeId);

    // Load postfix
    $scope.loadPostfix = function (p_id) {
        if (!p_id) {
            return;
        }
        dataService.getApi('postfixget_url', '/' + p_id, false).then(function (response) {
            $scope.postfix.find = response.data;
            angular.extend($scope.postfix.model, _.omit(response.data, 'p_id'));
        }, function (error) {});
    };

    // Add interview
    $scope.addInterview = function (key) {
        var source = $scope.postfix.interview[key];
        if (key && source) {
            $scope.postfix.model[key].push(source);
            $scope.postfix.interview[key] = '';
        }
    };
    // Remove interview
    $scope.removeInterview = function (key, index) {
        $scope.postfix.model[key].splice(index, 1);
        return;
    };


    // Update a postfix
    $scope.updatePostfix = function () {
        $scope.postfix.model.last_update = $filter('getMysqlFromNow')('');
        dataService.postApi('postfixadd_url', $scope.postfix.model).then(function (response) {
            deviceService.showNotifier({message: $scope._t('zwave_reinstalled')});
            $timeout(function () {
                alertify.dismissAll();
                $window.location.reload();
            }, 5000);
        }, function (error) {
            alertify.alertError($scope._t('error_update_data'));
            return;
        });
    };
    // Delete postfix
    $scope.deletePostfix = function (message) {
        alertify.confirm(message, function () {
            var input = {p_id: $scope.postfix.model.p_id};
            dataService.postApi('postfixremove_url', input).then(function (response) {
                deviceService.showNotifier({message: $scope._t('delete_successful') + ' ' + $scope._t('zwave_reinstalled')});
                $scope.postfix.model = {p_id: $scope.postfix.model.p_id};
                $timeout(function () {
                    alertify.dismissAll();
                    $window.location.reload();
                }, 5000);
            }, function (error) {
                alertify.alertError($scope._t('error_delete_data'));
                return;
            });
        });


    };

    /// --- Private functions --- ///

    function getPId(node) {

        var mId = node.data.manufacturerId.value ? node.data.manufacturerId.value : null;
        var mPT = node.data.manufacturerProductType.value ? node.data.manufacturerProductType.value : null;
        var mPId = node.data.manufacturerProductId.value ? node.data.manufacturerProductId.value : null;

        var p_id = mId + "." + mPT + "." + mPId;

        return (p_id !== 'null.null.null' ? p_id : false);
    }
});
