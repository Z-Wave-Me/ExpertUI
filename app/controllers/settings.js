/**
 * @overview Renders and handles settings.
 * @author Martin Vach
 */

/**
 * This controller renders and handles settings.
 * @class SettingsController
 *
 */
appController.controller('SettingsController', function ($scope, $filter, $timeout,$interval,dataService,deviceService, cfg,_) {
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
        dataService.postApi('configupdate_url', input).then(function (response) {
            $scope.reloadData();
            deviceService.showNotifier({message: $scope._t('update_successful')});
        }, function (error) {
            alertify.alertError($scope._t('error_update_data'));
        });
    };
});
