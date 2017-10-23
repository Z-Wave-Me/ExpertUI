/**
 * @overview Handles Z-Wave SmartStart process.
 * @author Martin Vach
 */


/**
 * The controller that include device with DSK.
 * @class SmartStartDskController
 */
appController.controller('SmartStartDskController', function ($scope, $timeout) {
    $scope.dsk = {
        input: {
            dsk: ''
        },
        state: 'start'
    };
    /**
     * Reset state to start
     */
    $scope.resetState = function () {
        $scope.dsk.state = 'start';
        $scope.reloadData();
    };
    /**
     * Authenticate by DSK
     */
    $scope.authenticate = function () {
        console.log($scope.dsk.input.dsk)
        $scope.dsk.state = 'authenticating';
        $timeout(function () {
            $scope.dsk.state = ($scope.dsk.input.dsk ? 'success-authenticate' : 'error');
        }, 2000);
    };

    /**
     * Discover the device
     */
    $scope.discover = function () {
        $scope.dsk.state = 'discovering';
        $timeout(function () {
            //$scope.dsk.state = 'success-discover';
            $scope.dsk.state = ($scope.dsk.input.dsk == 1 ? 'error' : 'success-discover');
        }, 2000);
    };

});

/**
 * The controller that include device by scanning QR code.
 * @class SmartStartQrController
 */
appController.controller('SmartStartQrController', function ($scope, $timeout) {
    $scope.qrcode = {
        input: {
            qrcode: ''
        },
        state: 'start'
    };

    /**
     * Reset state to start
     */
    $scope.resetState = function () {
        $scope.qrcode.state = 'start';
        $scope.reloadData();
    };
    /**
     * Scan QR code
     */
    $scope.scan = function (error) {
        $scope.qrcode.state = 'scanning';
        $timeout(function () {
            $scope.qrcode.state = (error ? 'error' : 'success-scan');
        }, 4000);
    };

    /**
     * Discover the device
     */
    $scope.discover = function () {
        $scope.qrcode.state = 'discovering';
        $timeout(function () {
            $scope.qrcode.state = 'success-discover';
        }, 2000);
    };

});

/**
 * The controller that displays DSK list.
 * @class SmartStartListController
 */
appController.controller('SmartStartListController', function ($scope, $timeout, dataService) {
    $scope.list = {
        all: []
    };


    /**
     * Get DSK colection
     */
    $scope.getDsk = function () {
        dataService.getApi('get_dsk', null, true).then(function (response) {
            if (_.isEmpty(response.data)) {
                $scope.alert = {message: $scope._t('empty_dsk_list'), status: 'alert', icon: 'fa-exclamation-circle'};
                return;
            }

            $scope.list.all = response.data;
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.getDsk();
    
    /**
     * Remov a DSK item
     * @param {string} dsk
     * @returns {undefined}
     */
    $scope.removeDsk = function (dsk) {
        dataService.getApi('remove_dsk', dsk, true).then(function (response) {
             $scope.reloadData();
        }, function (error) {
            alertify.alertError($scope._t('error_delete_data'));
        });
    };



});

