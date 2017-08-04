/**
 * Application base
 * @author Martin Vach
 */

//Define an angular module for our app
var angApp = angular.module('angApp', [
    'ngRoute',
    'ngCookies',
    'appController',
    'appFactory',
    'appService',
    'appConfig',
    'qAllSettled',
    'angularFileUpload',
    'myAppTemplates',
    'doubleScrollBars'
]);

/**
 * App configuration
 */
var config_module = angular.module('appConfig', []);
// Extend cfg dongle 
angApp.run(function run($cookies, $rootScope,deviceService) {
    // Run ubderscore js in views
    $rootScope._ = _;
    // Get dongle from cookie
    if ($cookies.dongle) {
        angular.extend(config_data.cfg, {dongle: $cookies.dongle});
    }
    deviceService.setDongle(config_data.cfg.dongle);
});

angular.forEach(config_data, function (key, value) {
    config_module.constant(value, key);
});

/**
 * Angular run function
 * @function run
 */
angApp.run(function ($rootScope, $location, $http, $q, deviceService, cfg) {
    // Run ubderscore js in views
    $rootScope._ = _;

    $rootScope.$on("$routeChangeStart", function (event, next) {
        /**
         * Cancels pending requests
         */
        angular.forEach($http.pendingRequests, function(request) {
            request.cancel  = $q.defer();
            request.timeout = request.cancel.promise;
        });
        /**
         * Check if page access is banned for the app type
         */
        if (next.appTypeBanned && next.appTypeBanned.indexOf(cfg.app_type) > -1) {
            $location.path( '/error/404');
        }
        /**
        * Check if access is allowed for the page
        */
        if (next.requireLogin) {
            var user = deviceService.getUser();
            if (!user) {
                $location.path('/');
                return;
            }
        }

    });
});


angApp.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|blob|):/);
}]);

/**
 * Intercepting HTTP calls with AngularJS.
 * @function config
 */
angApp.config(function ($provide, $httpProvider, cfg) {
    $httpProvider.defaults.timeout = 5000;
    // Intercept http calls.
    $provide.factory('MyHttpInterceptor', function ($q, $location, $window, deviceService) {
        var path = $location.path().split('/');
        return {
            // On request success
            request: function (config) {
                // Return the config or wrap it in a promise if blank.
                return config || $q.when(config);
            },
            // On request failure
            requestError: function (rejection) {
                // Return the promise rejection.
                return $q.reject(rejection);
            },
            // On response success
            response: function (response) {
                // Return the response or promise.
                return response || $q.when(response);
            },
            // On response failture
            responseError: function (rejection) {
                deviceService.logError(rejection);
                if (rejection.status === 401) {
                    switch(cfg.app_type){
                        case 'installer':
                            deviceService.logOut();
                            break;
                        default:
                            $window.location.href = cfg.smarthome_login;
                            break;
                    }
                }
                // Return the promise rejection.
                return $q.reject(rejection);
            }
        };
    });

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('MyHttpInterceptor');
});