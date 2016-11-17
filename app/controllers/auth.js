/**
 * @overview This controller handles authentication process.
 * @author Martin Vach
 */
/**
 * Auth default controller
 * @class AuthController
 *
 */
appController.controller('AuthController', function($location) {
    $location.path('/home');

});

/**
 * Auth installer controller
 * @class AuthInstallerController
 *
 */
appController.controller('AuthInstallerController', function($scope, $location,cfg) {
    $scope.input = {
        login: '',
        password: ''
    };
    /**
     * Login proccess
     */
    $scope.login = function (input) {
        //$scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('loading')};
        if (input.login !== cfg.auth.login || input.password !== cfg.auth.password) {
            alertify.alertError($scope._t('error_load_user'));
            $scope.input = {
                login: '',
                password: ''
            };
            return;
        }
        $location.path('/home');
    };

});