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
            zme_bootloader_upgrade: '/ZWave.' + config_data.cfg.dongle + '/ZMEBootloaderUpgrade',
            zme_firmware_upgrade: '/ZWave.' + config_data.cfg.dongle + '/ZMEFirmwareUpgrade',
            license_load_url: '/ZWave.' + config_data.cfg.dongle + '/ZMELicense',
            zddx_create_url: '/ZWave.' + config_data.cfg.dongle + '/CreateZDDX/',
            'stat_url': '/ZWave.' + config_data.cfg.dongle + '/CommunicationStatistics',
            'postfixget_url': '/ZWave.' + config_data.cfg.dongle + '/PostfixGet',
            'postfixadd_url': '/ZWave.' + config_data.cfg.dongle + '/PostfixAdd',
            'postfixremove_url': '/ZWave.' + config_data.cfg.dongle + '/PostfixRemove',
            //'communication_history_url': '/ZWave.' + config_data.cfg.dongle + '/CommunicationHistory',
            'configget_url': '/ZWave.' + config_data.cfg.dongle + '/ExpertConfigGet',
            'configupdate_url': '/ZWave.' + config_data.cfg.dongle + '/ExpertConfigUpdate'

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
angApp.run(function ($rootScope, $location, deviceService, cfg) {
    // Run ubderscore js in views
    $rootScope._ = _;

    $rootScope.$on("$routeChangeStart", function (event, next) {
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
                if (rejection.status === 401 && cfg.app_type !== 'installer') {
                    console.log('indow.location.href = cfg.smarthome_login')
                    //$location.path(cfg.smarthome_login);
                    //window.location.href = cfg.smarthome_login;
                }
                /*if(config_data.cfg.app_type === "installer" && rejection.data.code == 401) {
                    //alertify.alertWarning($scope._t('Login'));
                    $location.path("/");
                    return $q.reject(rejection);
                } else {
                    // Return the promise rejection.
                    return $q.reject(rejection);
                }*/


                /*switch(rejection.status){
                    case 401:
                        if (path[1] !== '') {
                            deviceService.logOut();
                            break;

                        }
                    default:
                        break;

                }*/
                // Return the promise rejection.
                return $q.reject(rejection);
            }
        };
    });

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('MyHttpInterceptor');
});