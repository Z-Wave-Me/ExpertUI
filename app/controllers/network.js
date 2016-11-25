/**
 * This controller renders and handles app settings.
 * @class NetworkController
 *
 */
appController.controller('NetworkController', function ($scope, $timeout,$interval, $location, cfg,dataService,deviceService) {
    $scope.settings = {
        input: {}
    };

    /**
     * Load settings
     */
    $scope.loadSettings = function() {
        $scope.settings.input = cfg.zwavecfg;
    };
    $scope.loadSettings();

    /**
     * Store settings
     * @param {object} input
     */
    $scope.storeSettings = function(input) {
        console.log(input);
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('updating')};
        dataService.postApi('configupdate_url', input).then(function (response) {
            //$scope.reloadData();

            deviceService.showNotifier({message: $scope._t('update_successful')});
            //$window.location.reload();
            $scope.reloadData();
            $scope.loading = false;
        }, function (error) {
            $scope.loading = false;
            alertify.alertError($scope._t('error_update_data'));
        });
    };
});