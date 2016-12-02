/**
 * @overview The uncategorized controllers.
 * @author Martin Vach
 */

/**
 * The controller that handles help page.
 * @class HelpController
 */
appController.controller('HelpController', function($scope, $routeParams) {
    $scope.nodeId = $routeParams.nodeId;
});
/**
 * The controller that handles errors.
 * @class ErrorController
 */
appController.controller('ErrorController', function($scope, $routeParams, deviceService) {
    $scope.errorCfg = {
        code: false,
        icon: 'fa-warning'
    };
    /**
     * Load error
     */
    $scope.loadError = function(code) {
        if (code) {
            $scope.errorCfg.code = code;
        } else {
            $scope.errorCfg.code = 0;
        }
        deviceService.showConnectionError(code);

    };
    $scope.loadError($routeParams.code);

});

/**
 * todo: Replace $upload vith version from the SmartHome
 * This controller handles restoring process from a backup file.
 * @class RestoreController
 *
 */
appController.controller('RestoreController', function ($scope, $upload, $window,deviceService,cfg,_) {
    $scope.restore = {
        allow: false,
        input: {
            restore_chip_info: '0'
        }
    };

    /**
     * Send request to restore from backup
     * @returns {void}
     */
    $scope.restoreFromBackup = function($files) {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('restore_wait')};
        var chip = $scope.restore.input.restore_chip_info;
        var url = cfg.server_url + cfg.restore_url + '?restore_chip_info=' + chip;
        //return;
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            $upload.upload({
                url: url,
                fileFormDataName: 'config_backup',
                file: $file
            }).progress(function(evt) {
                //$scope.restoreBackupStatus = 1;
            }).success(function(data, status, headers, config) {
                $scope.handleModal('restoreModal');
                if (data && data.replace(/(<([^>]+)>)/ig, "") !== "null") {//Error
                    alertify.alertError($scope._t('restore_backup_failed'));
                    //$scope.restoreBackupStatus = 3;
                } else {// Success
                    deviceService.showNotifier({message: $scope._t('restore_done_reload_ui')});
                    $window.location.reload();
                    //$scope.restoreBackupStatus = 2;
                }
            }).error(function(data, status) {
                $scope.handleModal('restoreModal');
                alertify.alertError($scope._t('restore_backup_failed'));
                //$scope.restoreBackupStatus = 3;
            });

        }
    };
});



/**
 * This controller handles dongles.
 * @class DongleController'
 *
 */
appController.controller('DongleController', function($scope, $window,$cookies,cfg,dataService) {
    // Controller vars
    $scope.homeDongle ={
        model: {
            current: $scope.cfg.dongle,
            dongle: ''
        },
        //data: ['zway','newdongle','mydongle'],
        data: cfg.dongle_list
    };

    /**
     * Set dongle
     */
    $scope.setHomeDongle = function() {
        if($scope.homeDongle.model.dongle === ''){
            return;
        }
        angular.extend($scope.cfg,{dongle: $scope.homeDongle.model.dongle});
        $cookies.dongle = $scope.homeDongle.model.dongle;
        dataService.purgeCache();
        $window.location.reload();
    };
});




