/**
 * @overview This controller handles data holder and expert config data.
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

/**
 * Handles data holder.
 * @class DataHolderController
 *
 */
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
        });
    };
    $scope.loadZwaveData();

    /**
     * Store networkname
     * @param {object} input
     */
    $scope.storeNetworkName = function(form,input,spin) {
        if(!form.$dirty){
            return;
        }
        var homeName = input.replace(/\"/g, '\'');
        $scope.toggleRowSpinner(spin);
        dataService.postApi('store_url', null, 'controller.data.homeName.value="'+ homeName +'"').then(function (response) {
            cfg.controller.homeName = homeName;
            $scope.save();
            form.$setPristine();
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data'));
        });
    };

    /**
     * Store notes
     * @param {object} input
     */
    $scope.storeNotes = function(form,input,spin) {
        if(!form.$dirty){
            return;
        }
        $scope.toggleRowSpinner(spin);

        input = input.replace(/\"/g, '\'');
        input = input.replace(/\n/g, '<br>');
        dataService.postApi('store_url', null, 'controller.data.homeNotes.value="'+input+'"').then(function (response) {
            $scope.save();
            form.$setPristine();
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
            //deviceService.showNotifier({message: $scope._t('update_successful')});
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

/**
 * Displays data holder info.
 * @class DataHolderInfoController
 *
 */
appController.controller('DataHolderInfoController', function($scope, $filter, deviceService) {
    $scope.dataHolderInfo = {
        all: {}
    }
    // Show modal dialog
    $scope.dataHolderModal = function(target, $event, interviewCommands, ccId, type) {
        var imodalId = '#' + target;
        var interviewData = {};
        var updateTime;
        //$(target).modal();
        if (type) {
            angular.forEach(interviewCommands, function(v, k) {
                if (v.ccId == ccId) {
                    interviewData = v[type];
                    updateTime = v.updateTime;
                    return;
                }
            });
        } else {
            interviewData = interviewCommands;
        }

        // Get data
        var html = deviceService.configGetCommandClass(interviewData, '/', '');

        //$scope.dataHolderInfo.all =  deviceService.configGetCommandClass(interviewData, '/', '');
        //console.log(html)
        // Fill modal with data
        $scope.handleModal(target, $event);
        $(imodalId + ' .appmodal-body').html(html);
    };

});