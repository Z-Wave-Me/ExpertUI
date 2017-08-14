/**
 * @overview This controller handles authentication process.
 * @author Martin Vach
 */
/**
 * Auth default controller
 * @class AuthController
 *
 */
appController.controller('InitInstallerController', function ($scope, $location, $timeout, $window, $cookies, $routeParams, cfg, dataService, deviceService) {
    $scope.auth = {
        input: {
            user: '',
            pass: '',
            cit_identifier: cfg.system_info.cit_identifier || ''
        },
        alert: {},
        findcit_referrer: false,
        hostname: $location.host()
    };

    var path = $location.path().split('/');

    /**
     * Set referrer
     */
    $scope.setReferrerCookie = function () {
        $cookies.findcit_referrer = $window.document.referrer;
    };
    $scope.setReferrerCookie();

    /**
     * Get session (ie for users holding only a session id, or users that require no login)
     */
    $scope.getSession = function () {
        var hasCookie = ($cookies.user) ? true : false;
        if (hasCookie) {
            dataService.sessionApi().then(function (response) {
                var user = response.data.data;
                deviceService.setZWAYSession(user.sid);
                deviceService.setUser(user);
                $window.location.href = '#/home';
                $window.location.reload();
            });
        }
    };

    /**
     * Get referrer from cookie and parse it
     */
    /*$scope.forward = function () {
        dataService.getApi('system_info_url',false,true).then(function (response) {
            $scope.auth.cit_login_forward = response.data.data.cit_forward_auth? response.data.data.cit_forward_auth : undefined;
            console.log(response)
            if ($scope.auth.cit_login_forward && $scope.auth.cit_login_forward.allowed) {
                $scope.toggleRowSpinner('installer_auth');
                $scope.login({
                    'login': $scope.auth.cit_login_forward.user,
                    'password': 'password'
                });
            }

        }, function (error) {
        });

    };
    $scope.forward();*/


    /**
     * Get referrer from cookie and parse it
     */
    $scope.getReferrer = function () {
        if($cookies.findcit_referrer){
            var parseUrl = new URL($cookies.findcit_referrer);
            $scope.auth.findcit_referrer = (parseUrl.hostname === cfg.find_cit.hostname);
        }
    };
    $scope.getReferrer();

    if ((typeof $routeParams.logout === 'undefined' ||
        !$routeParams.logout || path[1] === '') &&
        $scope.cfg.find_hosts.indexOf($location.host()) === -1) {
        $scope.getSession();
    }

    /**
     * Login proccess
     */
    $scope.authenticate = function (input) {
        $scope.auth.alert = {};
        $scope.toggleRowSpinner('installer_auth');
        var auth = {
            'login': input.user.toLowerCase(),
            'password': input.pass
        };

        // test login without cit auth
        if(cfg.dev_host.indexOf($location.host()) > -1){
            $scope.login(auth);
            return;
        }

        // cit authentication
        dataService.postApi('installer_auth', input).then(function (response) {
            if (!response.data.data.result) {
                $scope.auth.alert = {
                    message: $scope._t(response.data.data.key) + ' ' + response.data.data.result_message,
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
            $window.location.href = '#/home';
            $window.location.reload();
        }, function (error) {
            var redirect = cfg.logout_redirect[$location.host()];
            $scope.loading = false;
            var message = $scope._t('error_load_data');
            if (error.status == 401) {
                message = $scope._t('error_load_cit_user');
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
appController.controller('AuthController', function ($location, $window, $timeout) {
    $location.path('/home');
    $timeout(function() {
        $window.location.reload();
    }, 1);
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