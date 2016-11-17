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

//Define Routing for app
angApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.// Home
        when('/', {
            templateUrl: 'app/views/home/home.html'
        }).// Test
        when('/test', {
            templateUrl: 'app/views/test.html'
        }).// License
        when('/licence', {
            templateUrl: 'app/views/pages/license.html'
        }).// UZB
        when('/uzb', {
            templateUrl: 'app/views/pages/uzb.html'
        }).// Help
        when('/help/:nodeId?', {
            templateUrl: 'app/views/help/help.html'
        }).// Controll
        when('/control/switch', {
            templateUrl: 'app/views/controll/switch.html'
        }).when('/control/dimmer', {
            templateUrl: 'app/views/controll/dimmer.html'
        }).when('/control/sensors', {
            templateUrl: 'app/views/controll/sensors.html'
        }).when('/control/meters', {
            templateUrl: 'app/views/controll/meters.html'
        }).when('/control/thermostat', {
            templateUrl: 'app/views/controll/thermostat.html'
        }).when('/control/locks', {
            templateUrl: 'app/views/controll/locks.html'
        }).// Device
        when('/device/status', {
            templateUrl: 'app/views/device/status.html'
        }).when('/device/battery', {
            templateUrl: 'app/views/device/battery.html'
        }).when('/device/type', {
            templateUrl: 'app/views/device/type.html'
        }).when('/device/type', {
            templateUrl: 'app/views/device/type.html'
        }).when('/device/associations', {
            templateUrl: 'app/views/device/associations.html'
        }).when('/device/security', {
            templateUrl: 'app/views/device/security.html'
        }).// Config
        when('/config/configuration/:nodeId?', {
            template: ' ',
            controller: 'ConfigRedirectController'
        }).// New Configuration
        when('/configuration/interview/:nodeId?', {
            templateUrl: 'app/views/configuration/interview.html'
        }).when('/configuration/configuration/:nodeId?', {
            templateUrl: 'app/views/configuration/configuration.html'
        }).when('/configuration/assoc/:nodeId?', {
            templateUrl: 'app/views/configuration/assoc.html'
        }).when('/configuration/association/:nodeId?', {
            templateUrl: 'app/views/configuration/assoc.html'
        }).when('/configuration/commands/:nodeId?', {
            templateUrl: 'app/views/configuration/commands.html'
        }).when('/configuration/firmware/:nodeId?', {
            templateUrl: 'app/views/configuration/firmware.html'
        }).when('/configuration/postfix/:nodeId?', {
            templateUrl: 'app/views/configuration/postfix.html'
        }).when('/configuration/health/:nodeId?', {
            templateUrl: 'app/views/configuration/health.html'
        }).// Network
        when('/network/control', {
            templateUrl: 'app/views/network/control.html'
        }).when('/network/routing', {
            templateUrl: 'app/views/network/routing.html'
        }).//                when('/network/reorganization', {
        //                    templateUrl: 'app/views/network/reorganization.html'
        //                }).
        when('/network/timing', {
            templateUrl: 'app/views/network/timing.html'
        }).when('/network/controller', {
            templateUrl: 'app/views/network/controller.html'
        }).when('/network/queue', {
            templateUrl: 'app/views/network/queue.html'
        }).when('/network/map', {
            templateUrl: 'app/views/network/map.html'
        }).// Installer - zniffer
        when('/installer/zniffer', {
            templateUrl: 'app/views/installer/zniffer.html'
        }).// Installer - history
        when('/installer/history', {
            templateUrl: 'app/views/installer/history.html'
        }).// Installer - spectrum
        when('/installer/spectrum', {
            templateUrl: 'app/views/installer/spectrum.html'
        }).// Installer - spectrum
        when('/installer/rssi', {
            templateUrl: 'app/views/installer/rssi_background.html'
        }).// Settings
        when('/settings', {
            templateUrl: 'app/views/settings/settings.html'
        }).// Error page
        when('/error/:code?', {
            templateUrl: 'app/views/error.html'
        }).otherwise({
            redirectTo: '/'
        });
    }]);

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