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

/**
 * Auth controller
 */
appController.controller('AuthController', function($scope, $routeParams, cfg,deviceService) {
    $scope.input = {
        login: '',
        password: ''
    };
    /**
     * Login proccess
     */
    $scope.login = function (input) {
        //$scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('loading')};
        if (input.login !== cfg.auth.login && input.password !== cfg.auth.password) {
           alertify.alertError($scope._t('error_load_user'));
            $scope.input = {
                login: '',
                password: ''
            };
            return;
        }
        window.location.href = '#/home';
    };

});


