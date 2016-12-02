/**
 * UzbController
 * @author Martin Vach
 */
appController.controller('UzbController', function($scope, $timeout, dataService) {
    $scope.uzbUpgrade = [];
    $scope.uzbFromUrl = [];
    $scope.alert = {message: false, status: 'is-hidden', icon: false};
    /**
     * Load data
     *
     */
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            var vendorId = parseInt(ZWaveAPIData.controller.data.manufacturerId.value, 10);
            //0x0115 = 277, 0x0147 = 327
            var allowedVendors = [277, 327];
            if (allowedVendors.indexOf(vendorId) === -1) {
                $scope.alert = {message: $scope._t('noavailable_firmware_update'), status: 'alert-info', icon: 'fa-info-circle'};
                return;
            }
            var appVersion = ZWaveAPIData.controller.data.APIVersion.value.split('.');
            var appVersionMajor = parseInt(appVersion[0], 10);
            var appVersionMinor = parseInt(appVersion[1], 10);
            var urlParams = '?vendorId=' + vendorId + '&appVersionMajor=' + appVersionMajor + '&appVersionMinor=' + appVersionMinor;
            //return;
            // Load uzb
            loadUzb(urlParams);
        });
    };
    $scope.load();

    // Upgrade bootloader/firmware
    $scope.upgrade = function(row, action, url) {
        $scope.alert = {message: false};
        var cmd = $scope.cfg.server_url + action;
        var data = {
            url: url
        };
        $('.update-ctrl button').attr('disabled', true);
        $scope.alert = {message: $scope._t('upgrade_bootloader_proccess'), status: 'alert-warning', icon: 'fa-spinner fa-spin'};
        dataService.updateUzb(cmd, data).then(function(response) {
            if (action == '/ZWaveAPI/ZMEFirmwareUpgrade') {
                $scope.alert = {message: $scope._t('success_firmware_update'), status: 'alert-success', icon: 'fa-check'};
                console.log('---------- SUCCESS firmware ----------', response);
                //upgradeFirmware(response);
            } else {
                $scope.alert = {message: $scope._t('success_bootloader_update'), status: 'alert-success', icon: 'fa-check'};
                console.log('---------- SUCCESS bootloader  ----------', response);


                //upgradeBootloader(response);
            }
            $('.update-ctrl button').attr('disabled', false);
        }, function(error) {
            $scope.alert = {message: $scope._t('error_handling_data'), status: 'alert-danger', icon: 'fa-exclamation-triangle'};
            console.log('ERROR', error);
            $('.update-ctrl button').attr('disabled', false);
        });
    };

    /// --- Private functions --- ///

    /**
     * Load uzb data
     */
    function loadUzb(urlParams) {
        $scope.alert = {message: $scope._t('loading_data_remote'), status: 'alert-warning', icon: 'fa-spinner fa-spin'};
        dataService.getUzb(urlParams).then(function(response) {
            if (response.length > 0) {
                $scope.uzbUpgrade = response;
                $scope.alert = {message: false};
            } else {
                $scope.alert = {message: $scope._t('noavailable_firmware_update'), status: 'alert-info', icon: 'fa-info-circle'};
            }
        }, function(error) {
            $scope.alert = {message: $scope._t('error_handling_data_remote'), status: 'alert-danger', icon: 'fa-exclamation-triangle'};
            console.log('ERROR', error);
        });
    }
    ;

    /**
     * DEPRECATED
     * Proccessing bootloader upgrade
     */
//    function upgradeBootloader(response) {
//        $('.update-ctrl button').attr('disabled', true);
//        $scope.alert = {message: $scope._t('upgrade_bootloader_proccess'), status: 'alert-warning', icon: 'fa-spinner fa-spin'};
//        //console.log(response);
//        return;
//        $timeout(function() {
//            if ('do something to check when update is complete') {
//                $scope.alert = {message: $scope._t('success_bootloader_update'), status: 'alert-success', icon: 'fa-check'};
//                console.log('---------- SUCCESS bootloader ----------', response);
//            } else {// Otherwise show error message
//                $scope.alert = {message: $scope._t('error_bootloader_update'), status: 'alert-danger', icon: 'fa-exclamation-triangle'};
//                console.log('---------- ERROR bootloader ----------');
//            }
//            $('.update-ctrl button').attr('disabled', false);
//
//        }, 3000);
//
//    }
//    ;

    /**
     * Proccessing firmware upgrade
     */
//    function upgradeFirmware(response) {
//        $('.update-ctrl button').attr('disabled', true);
//        $scope.alert = {message: $scope._t('upgrade_firmware_proccess'), status: 'alert-warning', icon: 'fa-spinner fa-spin'};
//        //console.log(response);
//        return;
//        $timeout(function() {
//            if ('do something to check when update is complete') {
//               $scope.alert = {message: $scope._t('success_firmware_update'), status: 'alert-success', icon: 'fa-check'};
//                console.log('---------- SUCCESS firmware ----------', response);
//            } else {// Otherwise show error message
//                $scope.alert = {message: $scope._t('error_firmware_update'), status: 'alert-danger', icon: 'fa-exclamation-triangle'};
//                console.log('---------- ERROR firmware ----------');
//            }
//        }, 3000);
//
//    } ;

});