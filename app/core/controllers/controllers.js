/**
 * Application controllers
 * @author Martin Vach
 */

// Test controller
appController.controller('TestController', function($scope, $filter, $interval, $timeout, dataService, _) {
});

// Statistics controller
appController.controller('HelpController', function($scope, $routeParams) {
    $scope.nodeId = $routeParams.nodeId;
});
/**
 * Error controller
 */
appController.controller('ErrorController', function($scope, $routeParams, deviceService) {
    $scope.errorCfg = {
        code: false,
        icon: 'fa-warning'
    };
    /**
     * Logout proccess
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


