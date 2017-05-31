/**
 * @overview This controller handles authentication process.
 * @author Martin Vach
 */
/**
 * Auth default controller
 * @class AuthController
 *
 */
appController.controller('InitInstallerController', function ($scope, $location, $timeout, $window, cfg, dataService, deviceService) {
    $scope.auth = {
        input: {
            user: '',
            pass: '',
            cit_identifier: cfg.system_info.cit_identifier || ''
        },
        alert: {}
    };

    /**
     * Login proccess
     */
    $scope.authenticate = function (input) {
        $scope.auth.alert = {};
        $scope.toggleRowSpinner('installer_auth');
        var auth = {
            'login': input.user,
            'password': input.pass
        };
        // cit authentication
        dataService.postApi('installer_auth', input).then(function (response) {
            if (!response.data.data.result) {
                $scope.auth.alert = {
                    message: $scope._t('cit_check_login') + ' ' + response.data.data.result_message,
                    status: 'alert-danger',
                    icon: 'fa-exclamation-triangle'
                };
            } else {
                $scope.login(auth);
            }

        }, function (error) {
            if (cfg.system_info.cit_authorized && error.status == 504) {
                $scope.login(auth);
            } else {
                console.log(error);
                var message = $scope._t('initial_fail');// + ' ' + response.data.data.result_message;
                if (error.status == 500) {
                    message = $scope._t('error_load_data');
                }
                $scope.auth.alert = {message: message, status: 'alert-danger', icon: 'fa-exclamation-triangle'};
            }

        }).finally(function () {
            $timeout($scope.toggleRowSpinner, 1000);
        });
    };

    /**
     * Login proccess
     */
    $scope.login = function (input) {
        dataService.logInApi(input).then(function (response) {
            var user = response.data.data;
            deviceService.setZWAYSession(user.sid);
            deviceService.setUser(user);
            $location.path('/home');
            //window.location = '#/home';
            $window.location.reload();
        }, function (error) {
            var redirect = cfg.logout_redirect[$location.host()];
            $scope.loading = false;
            var message = $scope._t('error_load_data');
            if (error.status == 401) {
                message = $scope._t('error_load_user');
            }

            // Redirect to an url from list
            if (redirect) {
                $window.location.href = redirect;
                return;
            }
            $scope.auth.alert = {message: message, status: 'alert-danger', icon: 'fa-exclamation-triangle'};
        }).finally(function () {
            $timeout($scope.toggleRowSpinner, 1000);
        });
    };

});

/**
 * Auth default controller
 * @class AuthController
 *
 */
appController.controller('AuthController', function ($location, $window) {
    $location.path('/home');
    //window.location = '#/home';
    $window.location.reload();

});

/**
 * Auth installer controller
 * @class AuthInstallerController
 *
 */
appController.controller('AuthInstallerController', function ($scope, $location, cfg, $window, cfg, dataService, deviceService) {
    $scope.input = cfg.auth;
    //$location.path('/init');

    /**
     * Login proccess
     */
    $scope.login = function (input) {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('loading')};
        dataService.logInApi(input).then(function (response) {
            var user = response.data.data;
            deviceService.setZWAYSession(user.sid);
            deviceService.setUser(user);
            $location.path('/home');
            //window.location = '#/home';
            $window.location.reload();
        }, function (error) {
            var redirect = cfg.logout_redirect[$location.host()];
            $scope.loading = false;
            var message = $scope._t('error_load_data');
            if (error.status == 401) {
                message = $scope._t('error_load_user');
            }

            // Redirect to an url from list
            if (redirect) {
                $window.location.href = redirect;
                return;
            }
            alertify.alertError(message);
        });
    };
    //cfg.system_info.cit_authorized = true;
    // Redirect to init page
    if (!cfg.system_info.cit_authorized) {
        $location.path('/init');
        $window.location.reload();
    } else { // Login
        $scope.login($scope.input);
    }


});

/**
 * Logout installer controller
 * @class LogoutInstallerController
 *
 */
appController.controller('LogoutInstallerController', function (dataService, deviceService) {
    dataService.getApi('logout_url').then(function (response) {
    }, function (error) {
    })
        .finally(function () {
            deviceService.logOut();
        });

});