/**
 * LicenseController
 * @author Martin Vach
 */
appController.controller('LicenseController', function($scope, $timeout, dataService) {
    $scope.proccessVerify = {
        'message': false,
        'status': 'is-hidden'

    };
    $scope.controllerUuid = null;
     $scope.controllerIsZeroUuid = false;
    $scope.proccessUpdate = {
        'message': false,
        'status': 'is-hidden'

    };
    $scope.formData = {
        "scratch_id": null
    };
    $scope.license = {
        "scratch_id": null,
        "capability": null,
        "uid": null,
        "license_id": null,
        "base_license": null,
        "reseller_id": null,
        "revoke": null,
        "selldate": null,
        "usedate": null
    };
    $scope.ZWaveAPIData = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.controllerUuid = ZWaveAPIData.controller.data.uuid.value;
            $scope.controllerIsZeroUuid = parseFloat(ZWaveAPIData.controller.data.uuid.value) === 0;

        });
    };
    $scope.ZWaveAPIData();
    /**
     * Get license key
     */
    $scope.getLicense = function(formData) {
        // Clear messages
        $scope.proccessVerify.message = false;
        $scope.proccessUpdate.message = false;
        if (!formData.scratch_id) {
            return;
        }
        $scope.proccessVerify = {'message': $scope._t('verifying_licence_key'), 'status': 'fa fa-spinner fa-spin'};
        var input = {
            'uuid': $scope.controllerUuid,
            'scratch': formData.scratch_id
        };
        dataService.getLicense(input).then(function(response) {
            $scope.proccessVerify = {'message': $scope._t('success_licence_key'), 'status': 'fa fa-check text-success'};
            console.log('1. ---------- SUCCESS Verification ----------', response);

            // Update capabilities
            updateCapabilities(response);

        }, function(error) {// Error verifying key
            //debugger;
            var message = $scope._t('error_no_licence_key');
            if (error.status == 404) {
                var message = $scope._t('error_404_licence_key');
            }
            $scope.proccessVerify = {'message': message, 'status': 'fa fa-exclamation-triangle text-danger'};
            console.log('1. ---------- ERROR Verification ----------', error);

        });
        return;
    };


    /// --- Private functions --- ///

    /**
     * Update capabilities
     */
    function updateCapabilities(data) {
        $scope.proccessUpdate = {'message': $scope._t('upgrading_capabilities'), 'status': 'fa fa-spinner fa-spin'};
        dataService.zmeCapabilities(data).then(function(response) {
            $scope.proccessUpdate = {'message': $scope._t('success_capabilities'), 'status': 'fa fa-check text-success'};
            console.log('2. ---------- SUCCESS updateCapabilities ----------', response);
            //proccessCapabilities(response);
        }, function(error) {
            $scope.proccessUpdate = {'message': $scope._t('error_no_capabilities'), 'status': 'fa fa-exclamation-triangle text-danger'};
            console.log('2. ---------- ERROR updateCapabilities ----------', error);
        });
    }
    ;
    /**
     * DEPRECATED
     * Update Proccess capabilities
     */
//    function proccessCapabilities(response) {
//        $('.verify-ctrl').attr('disabled', true);
//        return;
//        $timeout(function() {
//            if ('do something to check when update is complete') {
//                $scope.proccessUpdate = {'message': $scope._t('success_capabilities'), 'status': 'fa fa-check text-success'};
//                console.log('3. ---------- SUCCESS proccessCapabilities ----------', response);
//            } else {// Otherwise show error message
//                $scope.proccessUpdate = {'message': $scope._t('error_no_capabilities'), 'status': 'fa fa-exclamation-triangle text-danger'};
//                console.log('3. ---------- ERROR proccessCapabilities ----------');
//            }
//            $('.verify-ctrl').attr('disabled', false);
//            return;
//
//        }, 3000);
//
//    };
});