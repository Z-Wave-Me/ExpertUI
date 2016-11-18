/**
 * @overview This controller renders and handles notes.
 * @author Martin Vach
 */

/**
 * This controller renders and handles notes.
 * @class NoteController
 *
 */
appController.controller('NoteController', function ($scope, $timeout,$interval, cfg, dataService, deviceService) {
    $scope.note = {
        input: { }
    };

    /**
     * Load settings
     */
    $scope.loadSettings = function() {
        $scope.note.input= cfg.zwavecfg;
    };
    $scope.loadSettings();

    /**
     * Store settings
     * @param {object} input
     */
    $scope.storeSettings = function(input) {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('updating')};
        dataService.postApi('configupdate_url', input).then(function (response) {
            cfg.zwavecfg = input;
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