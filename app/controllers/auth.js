/**
 * @overview This controller handles authentication process.
 * @author Martin Vach
 */
/**
 * Auth default controller
 * @class AuthController
 *
 */
appController.controller('AuthController', function($location,$window) {
    //$location.path('/home');
    window.location = '#/home';
    $window.location.reload();

});

/**
 * Auth installer controller
 * @class AuthInstallerController
 *
 */
appController.controller('AuthInstallerController', function($scope, $location,cfg, $window,cfg,dataService,deviceService) {
    $scope.input = cfg.auth;

    /**
     * Login proccess
     */
    $scope.login = function (input) {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('loading')};
        dataService.logInApi(input).then(function (response) {
            var user = response.data.data;
            deviceService.setZWAYSession(user.sid);
            deviceService.setUser(user);
            window.location = '#/home';
            $window.location.reload();
        }, function (error) {
            var redirect = cfg.logout_redirect[$location.host()];
            $scope.loading = false;
            var message = $scope._t('error_load_data');
            if (error.status == 401) {
                message = $scope._t('error_load_user');
            }

            // Redirect to an url from list
            if(redirect){
                $window.location.href = redirect;
                return;
            }
            alertify.alertError(message);
        });
    };

    $scope.login($scope.input);
    /**
     * Login proccess
     */
    $scope.login_ = function (input) {
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

/**
 * Logout installer controller
 * @class LogoutInstallerController
 *
 */
appController.controller('LogoutInstallerController', function(deviceService) {
    deviceService.logOut();

});