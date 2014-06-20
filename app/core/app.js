/**
 * Application base
 * @author Martin Vach
 */

//Define an angular module for our app
var angApp = angular.module('angApp', [
    'ngRoute',
    'appController',
    'appFactory',
    'appConfig'
]);

//Define Routing for app
angApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
                // Home
                when('/', {
                    templateUrl: 'app/views/home/home.html'
                }).
                // Test
                when('/test', {
                    templateUrl: 'app/views/test.html'
                }).
                // Controll
                when('/controll/switch', {
                    templateUrl: 'app/views/controll/switch.html'
                }).
                when('/controll/dimmer', {
                    templateUrl: 'app/views/controll/dimmer.html'
                }).
                when('/controll/sensors', {
                    templateUrl: 'app/views/controll/sensors.html'
                }).
                when('/controll/meters', {
                    templateUrl: 'app/views/controll/meters.html'
                }).
                when('/controll/thermostat', {
                    templateUrl: 'app/views/controll/thermostat.html'
                }).
                when('/controll/locks', {
                    templateUrl: 'app/views/controll/locks.html'
                }).
                // Device
                when('/device/status', {
                    templateUrl: 'app/views/device/status.html'
                }).
                when('/device/battery', {
                    templateUrl: 'app/views/device/battery.html'
                }).
                when('/device/type', {
                    templateUrl: 'app/views/device/type.html'
                }).
                when('/device/firmware', {
                    templateUrl: 'app/views/device/firmware.html'
                }).
                when('/device/security', {
                    templateUrl: 'app/views/device/security.html'
                }).
                // Config
                when('/config/assoc', {
                    templateUrl: 'app/views/config/assoc.html'
                }).
                when('/config/wakeup', {
                    templateUrl: 'app/views/config/wakeup.html'
                }).
                when('/config/protection', {
                    templateUrl: 'app/views/config/protection.html'
                }).
                when('/config/configuration/:device_id?', {
                    templateUrl: 'app/views/config/configuration.html'
                }).
                // Network
                when('/network/controll', {
                    templateUrl: 'app/views/network/controll.html'
                }).
                when('/network/routing', {
                    templateUrl: 'app/views/network/routing.html'
                }).
                when('/network/reorganization', {
                    templateUrl: 'app/views/network/reorganization.html'
                }).
                when('/network/statistics', {
                    templateUrl: 'app/views/network/statistics.html'
                }).
                // Expert
                when('/expert/controller', {
                    templateUrl: 'app/views/expert/controller.html'
                }).
                when('/expert/commands', {
                    templateUrl: 'app/views/expert/commands.html'
                }).
                // Test
                when('/detail/:phoneId', {
                    templateUrl: 'app/views/detail.html'
                }).
                when('/list', {
                    templateUrl: 'app/views/list.html'
                }).
                otherwise({
                    redirectTo: '/'
                });
    }]);


