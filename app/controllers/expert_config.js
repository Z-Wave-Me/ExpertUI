/**
 * @overview This controller handles expert config data.
 * @author Martin Vach
 */

/**
 * Load and store expert config data.
 * @class ExpertConfigController
 *
 */
appController.controller('ExpertConfigController', function ($scope, $timeout,$interval, $location, cfg,dataService,deviceService) {
    $scope.expertConfig = {
        input: {}
    };

    /**
     * Load settings
     */
    $scope.loadSettings = function() {
        $scope.expertConfig.input = cfg.zwavecfg;
    };
    $scope.loadSettings();

    /**
     * Store settings
     * @param {object} input
     */
    $scope.storeSettings = function(input,spin) {
        $scope.toggleRowSpinner(spin);
        dataService.postApi('configupdate_url', input).then(function (response) {
            deviceService.showNotifier({message: $scope._t('update_successful')});
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data'));
        });
    };
});

appController.controller('DataHolderController', function ($scope, $timeout,$interval, $location, cfg,dataService,deviceService) {

    /**
     * Store networkname
     * @param {object} input
     */
    $scope.storeNetworkName = function(input,spin) {
        $scope.toggleRowSpinner(spin);
        dataService.postApi('store_url', null, 'controller.data.homeName.value="'+input.replace(/\"/g, '\'')+'"').then(function (response) {
            $scope.save();
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data'));
        });
    };

    /**
     * Store notes
     * @param {object} input
     */
    $scope.storeNotes = function(input,spin) {
        $scope.toggleRowSpinner(spin);

        input = input.replace(/\"/g, '\'');
        input = input.replace(/\n/g, '<br>');
        dataService.postApi('store_url', null, 'controller.data.homeNotes.value="'+input+'"').then(function (response) {
            $scope.save();
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data'));
        });
    };

    /**
     * Save dataholder
     */
    $scope.save = function(){
        dataService.postApi('store_url', null, 'devices.SaveData()').then(function (response) {
            deviceService.showNotifier({message: $scope._t('update_successful')});
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            alertify.alertError($scope._t('error_update_data'));
        });
    };

});