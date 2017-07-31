/**
 * Angular route specifications
 * @author Martin Vach
 */

//Define Routing for app
angApp.config(['$routeProvider',
    function ($routeProvider) {
        var requireLogin = (config_data.cfg.app_type === 'installer');
        var appType = config_data.cfg.app_type === 'installer'? 'installer' : 'default';
        $routeProvider.// Login
        when('/', {
            templateUrl: 'app/views/auth/auth_' + appType + '.html'
        })./* CIT init
        when('/init', {
            templateUrl: 'app/views/auth/init_installer.html',
            appTypeBanned: ['default','wd','popp','jb'],
        }).*/
        // Home
        when('/home', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/home/home_' + appType + '.html'
        }).// License
        when('/licence', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/pages/license.html'
        }).// UZB
        when('/uzb', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/pages/uzb.html'
        }).// Help
        when('/help/:nodeId?', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/help/help.html'
        }).// Controll
        when('/control/switch', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/controll/switch.html',
            appTypeBanned: ['installer']
        }).when('/control/sensors', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/controll/sensors.html',
            appTypeBanned: ['installer']
        }).when('/control/meters', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/controll/meters.html',
            appTypeBanned: ['installer']
        }).when('/control/thermostat', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/controll/thermostat.html',
            appTypeBanned: ['installer']
        }).when('/control/locks', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/controll/locks.html',
            appTypeBanned: ['installer']
        }).when('/control/notifications', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/controll/notifications.html',
            appTypeBanned: ['installer']
        }).// Device
        when('/device/status', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/device/status.html'
        }).when('/device/battery', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/device/battery.html'
        }).when('/device/type', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/device/type.html'
        }).when('/device/type', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/device/type.html'
        }).when('/device/associations', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/device/associations.html'
        }).when('/device/security', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/device/security.html'
        }).// Config
        when('/config/configuration/:nodeId?', {
            requireLogin: requireLogin,
            template: ' ',
            controller: 'ConfigRedirectController'
        }).// New Configuration
        when('/configuration/interview/:nodeId?', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/configuration/interview.html'
        }).when('/configuration/configuration/:nodeId?', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/configuration/configuration.html'
        }).when('/configuration/assoc/:nodeId?', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/configuration/assoc.html'
        }).when('/configuration/association/:nodeId?', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/configuration/assoc.html'
        }).when('/configuration/commands/:nodeId?', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/configuration/commands.html'
        }).when('/configuration/firmware/:nodeId?', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/configuration/firmware.html'
        }).when('/configuration/postfix/:nodeId?', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/configuration/postfix.html'
        }).when('/configuration/health/:nodeId?', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/configuration/health.html'
        }).// Network
        when('/network/control', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/network/control/control_' + appType + '.html'
        }).when('/network/neighbors', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/network/neighbors.html'
        }).when('/network/routing', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/network/routing.html'
        }).when('/network/reorganization', {
            templateUrl: 'app/views/network/reorganization.html',
            appTypeBanned: ['installer'],
        }).when('/network/timing', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/network/timing.html'
        }).when('/network/controller', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/network/controller_' + appType + '.html'
        }).when('/network/queue', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/network/queue.html'
        }).when('/network/routemap', {
            templateUrl: 'app/views/network/routemap.html'
        }).when('/network/map', {
            templateUrl: 'app/views/network/map.html'
        }).when('/network/statistics', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/network/statistics.html',
            appTypeBanned: []
        }).when('/network/linkstatus', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/network/linkstatus.html',
            appTypeBanned: [/*'default'*/]
        }).when('/network/linkhealth/:nodeId?', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/network/link_health.html',
            appTypeBanned: ['default','wd','popp','jb']
        }).// Installer - zniffer
        when('/installer/zniffer', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/installer/zniffer.html',
            appTypeBanned: []
        }).// Installer - history
        when('/installer/history', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/installer/history.html',
            appTypeBanned: []
        }).// Installer - RSSI
        when('/installer/rssi', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/installer/rssi_background.html',
            appTypeBanned: []
        }).
        when('/installer/rssimeter', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/installer/rssi_meter.html',
            appTypeBanned: []
        }).// Settings
        when('/settings', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/settings/settings_' + appType + '.html'
        }).// Print
        when('/print', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/print/print.html'
        }).// Error page
        when('/error/:code?', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/error.html'
        }).// Logout
        when('/logout', {
            requireLogin: requireLogin,
            appTypeBanned: ['default','wd','popp','jb'],
            templateUrl: 'app/views/auth/logout_installer.html'
        }).otherwise({
            redirectTo: '/home'
        });
    }]);