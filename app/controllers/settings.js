/**
 * @overview This controller renders and handles settings and configuration.
 * @author Martin Vach
 */

/**
 * This controller renders and handles language settings.
 * @class SettingsLangController
 *
 */
appController.controller('SettingsLangController', function ($scope, $timeout,$window,$cookies,deviceService) {
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
});

/**
 * This controller renders and handles app settings.
 * @class SettingsAppController
 *
 */
appController.controller('SettingsAppController', function ($scope, $timeout, $window, $interval, $location, cfg,dataService,deviceService) {
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
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('updating')};

        dataService.postApi('configupdate_url', input).then(function (response) {
            //$scope.reloadData();
            var data = {
                "time_zone": input.time_zone
            };
            dataService.postApi('time_zone', data, null).then(function (response) {
                $timeout( function() {
                    $window.location.reload();
                }, 10000);

                deviceService.showNotifier({message: $scope._t('update_successful')});
                deviceService.showNotifier({message: $scope._t('reloading')});
                $scope.loading = false;

            }, function (error) {
                $scope.loading = false;
                alertify.alertError($scope._t('error_load_data'));
            });
            $scope.loading = false;

        }, function (error) {
            $scope.loading = false;
            alertify.alertError($scope._t('error_update_data'));
        });
    };
});

/**
 * The controller that handles firmware update process.
 * @class SettingsFirmwareController
 *
 */
appController.controller('SettingsFirmwareController', function ($scope, $sce, $timeout, $location,dataService) {
    $scope.firmwareUpdate = {
        show: false,
        loaded: false,
        url: $sce.trustAsResourceUrl('http://' + $location.host() + ':8084/cgi-bin/main.cgi'),
        softwareCurrentVersion: $scope.boxData.controller.softwareRevisionVersion,
        softwareLatestVersion: false,
        isUpToDate: false
    };
    /**
     * Load latest version
     */
    $scope.loadRazLatest = function () {
        dataService.getRemoteData($scope.cfg.raz_latest_version_url).then(function (response) {
            $scope.firmwareUpdate.softwareLatestVersion = response.data;
            if(response.data === $scope.boxData.controller.softwareRevisionVersion){
                $scope.firmwareUpdate.isUpToDate = true;
            }

        }, function (error) {
        });
    };
    $scope.loadRazLatest();
    /**
     * Set access
     */
    $scope.setAccess = function (param, loader) {
        if (loader) {
            $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('loading')};
        }
        dataService.getApi('firmwareupdate', param, true).then(function (response) {
            if (loader) {
                $scope.firmwareUpdate.show = true;
                $timeout(function () {
                    $scope.loading = false;
                    $scope.firmwareUpdate.loaded = true;
                }, 5000);
            }

        }, function (error) {
            $scope.loading = false;
            alertify.alertError($scope._t('error_load_data'));

        });
    };

});