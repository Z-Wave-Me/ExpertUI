/**
 * @overview This controller renders and handles settings.
 * @author Martin Vach
 */

/**
 * This controller renders and handles settings.
 * @class SettingsController
 *
 */
appController.controller('SettingsController', function ($scope, $filter, $timeout,$interval,$window,$cookies,dataService,deviceService, cfg,_) {
    $scope.settings = {
        input: {}
    };
    /**
     * Set app language
     * @param {string} lang
     */
    $scope.setLang = function (lang) {
        //$window.alert($scope._t('language_select_reload_interface'));
        deviceService.showNotifier({message: $scope._t('reloading')});
        $cookies.lang = lang;
        $scope.lang = lang;
        $timeout( function() {
            $window.location.reload();
        }, 1000);

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