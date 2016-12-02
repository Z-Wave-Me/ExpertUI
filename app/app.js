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
    'myAppTemplates'
]);

/**
 * App configuration
 */
var config_module = angular.module('appConfig', []);
// Extend cfg dongle 
angApp.run(function run($cookies, $rootScope) {
    // Run ubderscore js in views
    $rootScope._ = _;

    if ($cookies.dongle) {
        angular.extend(config_data.cfg, {dongle: $cookies.dongle});
        angular.extend(config_data.cfg, {
            update_url: '/ZWave.' + config_data.cfg.dongle + '/Data/',
            store_url: '/ZWave.' + config_data.cfg.dongle + '/Run/',
            restore_url: '/ZWave.' + config_data.cfg.dongle + '/Restore',
            queue_url: '/ZWave.' + config_data.cfg.dongle + '/InspectQueue',
            fw_update_url: '/ZWave.' + config_data.cfg.dongle + '/FirmwareUpdate',
            stat_url: '/ZWave.' + config_data.cfg.dongle + '/CommunicationStatistics',
            license_load_url: '/ZWave.' + config_data.cfg.dongle + '/ZMELicense',
            zddx_create_url: '/ZWave.' + config_data.cfg.dongle + '/CreateZDDX/'

        });
    }
});

angular.forEach(config_data, function (key, value) {
    config_module.constant(value, key);
});

/**
 * Angular run function
 * @function run
 */
angApp.run(function ($rootScope, $location, dataService, cfg) {
    // Run ubderscore js in views
    $rootScope._ = _;

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        /**
         * Check if page access is banned for the app type
         */
        if (next.appTypeBanned && next.appTypeBanned.indexOf(cfg.app_type) > -1) {
            $location.path( '/error/404');
        }

    });
});

/**
 * Intercepting HTTP calls with AngularJS.
 * @function config
 */
angApp.config(function ($provide, $httpProvider, cfg) {
    $httpProvider.defaults.timeout = 5000;
    // Intercept http calls.
    $provide.factory('MyHttpInterceptor', function ($q, $location, deviceService) {
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
                // Return the promise rejection.
                return $q.reject(rejection);
            }
        };
    });

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('MyHttpInterceptor');
});