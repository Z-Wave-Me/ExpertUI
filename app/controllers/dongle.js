/**
 * @overview This controller renders and handles dongles.
 * @author Martin Vach
 */

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