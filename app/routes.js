/**
 * Angular route specifications
 * @author Martin Vach
 */

//Define Routing for app
angApp.config(['$routeProvider',
    function ($routeProvider) {
        var requireLogin = false;
        $routeProvider.// Login
        when('/', {
            templateUrl: 'app/views/auth/auth.html'
        }).
        // Home
        when('/home', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/home/home.html'
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
            templateUrl: 'app/views/controll/switch.html'
        }).when('/control/sensors', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/controll/sensors.html'
        }).when('/control/meters', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/controll/meters.html'
        }).when('/control/thermostat', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/controll/thermostat.html'
        }).when('/control/locks', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/controll/locks.html'
        }).when('/control/notifications', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/controll/notifications.html'
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
            templateUrl: 'app/views/network/control/control.html'
        }).when('/network/neighbors', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/network/neighbors.html'
        }).when('/network/routing', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/network/routing.html'
        }).when('/network/reorganization', {
            templateUrl: 'app/views/network/reorganization.html'
        }).when('/network/timing', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/network/timing.html'
        }).when('/network/controller', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/network/controller.html'
        }).when('/network/queue', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/network/queue.html'
        }).when('/network/map', {
            templateUrl: 'app/views/network/map.html'
        }).when('/network/linkstatus', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/network/linkstatus.html'
        }).//SmartStart with QR code
        when('/smartstartqr', {
            templateUrl: 'app/views/smartstart/smartstart_qr.html',
            requireLogin: requireLogin
        }).
        //SmartStart with dsk
        when('/smartstartdsk', {
            templateUrl: 'app/views/smartstart/smartstart_dsk_entry.html',
            requireLogin: requireLogin
        }).//SmartStart with dsk
        when('/smartstartlist', {
            templateUrl: 'app/views/smartstart/smartstart_dsk_list.html',
            requireLogin: requireLogin
        }).when('/installer/routemap', {
            templateUrl: 'app/views/network/routemap.html'
        }).// Installer - zniffer
        when('/installer/zniffer', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/installer/zniffer.html'
        }).//Installer - zniffer/A.R.T
        when('/installer/zniffer-art', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/installer/zniffer-art.html'
        }).// Installer - history
        when('/installer/history', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/installer/history.html'
        }).// Installer - RSSI
        when('/installer/rssi', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/installer/rssi_background.html'
        }).
        when('/installer/rssimeter', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/installer/rssi_meter.html'
        }).when('/installer/statistics', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/installer/statistics.html'
        }).when('/installer/rssi_report', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/installer/rssi_report.html'
        }).when('/installer/packets', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/installer/packets.html'
        }).
            // Settings
        when('/settings', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/settings/settings.html'
        }).// Print
        when('/print', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/print/print.html'
        }).// Error page
        when('/error/:code?', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/error.html'
        }).otherwise({
            redirectTo: '/home'
        });
    }]);
