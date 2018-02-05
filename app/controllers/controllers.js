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
 * todo: deprecated
 * This controller handles restoring process from a backup file.
 * @class RestoreController
 *
 */
/*appController.controller('RestoreController', function ($scope, $upload, $window,deviceService,cfg,_) {
    $scope.restore = {
        allow: false,
        input: {
            restore_chip_info: '0'
        }
    };

    /!**
     * Send request to restore from backup
     * @returns {void}
     *!/
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
});*/

/**
 * todo: deprecated
 * This controller handles network inclusion.
 * @class IncludeNetworkController
 *
 */
/*appController.controller('IncludeNetworkController', function($scope, $window,$cookies,$timeout,cfg,dataService) {
    // Controller vars
    $scope.includeNetwork ={
        controllerState: 0
    };

    /!**
     * Include to network
     *!/
    $scope.includeToNetwork = function(cmd) {
        $scope.toggleRowSpinner(cmd);
        $timeout($scope.toggleRowSpinner, 1000);
        runZwaveCmd(cmd);
    };

    /!**
     * Exclude form to network
     *!/
    $scope.excludeFromNetwork = function(cmd,confirm) {
        alertify.confirm(confirm, function () {
            $scope.toggleRowSpinner(cmd);
            $timeout($scope.toggleRowSpinner, 1000);
            runZwaveCmd(cmd);
        });

    };

    /// --- Private functions --- ///

    /!**
     * Run zwave cmd
     * @param {string} cmd
     *!/
    function runZwaveCmd(cmd) {
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {
        });
    }
    ;


});*/






