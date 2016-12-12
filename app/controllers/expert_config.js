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
    $scope.dataHolder = {
        controller: {}
    };
    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function () {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            setControllerData(ZWaveAPIData);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Store networkname
     * @param {object} input
     */
    $scope.storeNetworkName = function(input,spin) {
        var homeName = input.replace(/\"/g, '\'');
        $scope.toggleRowSpinner(spin);
        dataService.postApi('store_url', null, 'controller.data.homeName.value="'+ homeName +'"').then(function (response) {
            cfg.controller.homeName = homeName;
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

    /// --- Private functions --- ///
    /**
     * Set controller data
     * @param {object} ZWaveAPIData
     */
    function setControllerData(ZWaveAPIData) {
       $scope.dataHolder.controller.homeName = ZWaveAPIData.controller.data.homeName.value || cfg.controller.homeName;
        $scope.dataHolder.controller.homeNotes = ZWaveAPIData.controller.data.homeNotes.value.replace(/<br>/g, '\n' );
    }

});