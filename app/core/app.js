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
    'appConfig',
    'angularFileUpload'
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
                        // Help
                when('/help/:nodeId?', {
                    templateUrl: 'app/views/help/help.html'
                }).
                // Controll
                when('/control/switch', {
                    templateUrl: 'app/views/controll/switch.html'
                }).
                when('/control/dimmer', {
                    templateUrl: 'app/views/controll/dimmer.html'
                }).
                when('/control/sensors', {
                    templateUrl: 'app/views/controll/sensors.html'
                }).
                when('/control/meters', {
                    templateUrl: 'app/views/controll/meters.html'
                }).
                when('/control/thermostat', {
                    templateUrl: 'app/views/controll/thermostat.html'
                }).
                when('/control/locks', {
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
                when('/device/type', {
                    templateUrl: 'app/views/device/type.html'
                }).
                when('/device/associations', {
                    templateUrl: 'app/views/device/associations.html'
                }).
                when('/device/security', {
                    templateUrl: 'app/views/device/security.html'
                }).
                // Config
                when('/config/configuration/:nodeId?', {
                    templateUrl: 'app/views/config/config.html'
                }).
                // Network
                when('/network/control', {
                    templateUrl: 'app/views/network/control.html'
                }).
                when('/network/routing', {
                    templateUrl: 'app/views/network/routing.html'
                }).
                when('/network/reorganization', {
                    templateUrl: 'app/views/network/reorganization.html'
                }).
                when('/network/timing', {
                    templateUrl: 'app/views/network/timing.html'
                }).
                when('/network/controller', {
                    templateUrl: 'app/views/network/controller.html'
                }).
                 when('/network/queue', {
                    templateUrl: 'app/views/network/queue.html'
                }).        
                otherwise({
                    redirectTo: '/'
                });
    }]);


