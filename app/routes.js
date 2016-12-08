/**
 * Angular route specifications
 * @author Martin Vach
 */

//Define Routing for app
angApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.// Home
        when('/', {
            templateUrl: 'app/views/auth/auth_' + config_data.cfg.app_type + '.html'
        }).// Home
        when('/home', {
            templateUrl: 'app/views/home/home_' + config_data.cfg.app_type + '.html'
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
            templateUrl: 'app/views/controll/switch.html',
            appTypeBanned: ['installer']
        }).when('/control/sensors', {
            templateUrl: 'app/views/controll/sensors.html',
            appTypeBanned: ['installer']
        }).when('/control/meters', {
            templateUrl: 'app/views/controll/meters.html',
            appTypeBanned: ['installer']
        }).when('/control/thermostat', {
            templateUrl: 'app/views/controll/thermostat.html',
            appTypeBanned: ['installer']
        }).when('/control/locks', {
            templateUrl: 'app/views/controll/locks.html',
            appTypeBanned: ['installer']
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
            templateUrl: 'app/views/network/control/control_' + config_data.cfg.app_type + '.html'
        }).// Network control old
        /*when('/network/controlold', {
            templateUrl: 'app/views/network/control/control_' + config_data.cfg.app_type + '.html'
        }).*/
        when('/network/routing', {
            templateUrl: 'app/views/network/routing.html'
        }).//                when('/network/reorganization', {
        //                    templateUrl: 'app/views/network/reorganization.html'
        //                }).
        when('/network/timing', {
            templateUrl: 'app/views/network/timing.html'
        }).when('/network/controller', {
            templateUrl: 'app/views/network/controller_' + config_data.cfg.app_type + '.html'
        }).when('/network/queue', {
            templateUrl: 'app/views/network/queue.html'
        }).when('/network/map', {
            templateUrl: 'app/views/network/map.html'
        }).// Installer - zniffer
        when('/installer/zniffer', {
            templateUrl: 'app/views/installer/zniffer.html',
            appTypeBanned: ['default']
        }).// Installer - history
        when('/installer/history', {
            templateUrl: 'app/views/installer/history.html',
            appTypeBanned: ['default']
        }).// Installer - RSSI
        when('/installer/rssi', {
            templateUrl: 'app/views/installer/rssi_background.html',
            appTypeBanned: ['default']
        }).// Settings
        when('/settings', {
            templateUrl: 'app/views/settings/settings_' + config_data.cfg.app_type + '.html'
        }).// Error page
        when('/error/:code?', {
            templateUrl: 'app/views/error.html'
        }).otherwise({
            redirectTo: '/home'
        });
    }]);