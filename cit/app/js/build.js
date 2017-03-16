/* Copyright:  Z-Wave Europe, Created: 16-03-2017 09:59:07 */
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
                    console.log(cfg.smarthome_login)
                    window.location.href = cfg.smarthome_login;
                }
                // Return the promise rejection.
                return $q.reject(rejection);
            }
        };
    });

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('MyHttpInterceptor');
});
/**
 * Angular route specifications
 * @author Martin Vach
 */

//Define Routing for app
angApp.config(['$routeProvider',
    function ($routeProvider) {
        var requireLogin = (config_data.cfg.app_type === 'installer');
        $routeProvider.// Login
        when('/', {
            templateUrl: 'app/views/auth/auth_' + config_data.cfg.app_type + '.html'
        }).// Home
        when('/home', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/home/home_' + config_data.cfg.app_type + '.html'
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
            templateUrl: 'app/views/network/control/control_' + config_data.cfg.app_type + '.html'
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
            templateUrl: 'app/views/network/controller_' + config_data.cfg.app_type + '.html'
        }).when('/network/queue', {
            requireLogin: requireLogin,
            templateUrl: 'app/views/network/queue.html'
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
            appTypeBanned: ['default']
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
            templateUrl: 'app/views/settings/settings_' + config_data.cfg.app_type + '.html'
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
            appTypeBanned: ['default'],
            templateUrl: 'app/views/auth/logout_installer.html'
        }).otherwise({
            redirectTo: '/home'
        });
    }]);
angular.module('myAppTemplates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/views/auth/auth_default.html',
    "<div ng-controller=AuthController></div>"
  );


  $templateCache.put('app/views/auth/auth_installer.html',
    "<div ng-controller=AuthInstallerController></div>"
  );


  $templateCache.put('app/views/auth/logout_installer.html',
    "<div ng-controller=LogoutInstallerController></div>"
  );


  $templateCache.put('app/views/configuration/assoc.html',
    "<div id=AssociationTable ng-controller=ConfigAssocController><div ng-include=\"'app/views/configuration/navi.html'\"></div><div class=\"row row-configuration\"><div class=\"col-md-3 menu-vertical\"><div ng-include=\"'app/views/configuration/menu.html'\"></div></div><div class=\"col-md-9 col-content\"><bb-alert alert=alert></bb-alert><div ng-show=deviceId><div class=table-responsive ng-if=\"assocGroups.length > 0\"><button class=\"btn btn-primary\" type=button ng-click=\"updateFromDevice('updateFromDevice')\" ng-disabled=\"rowSpinner['updateFromDevice']\"><bb-row-spinner spinner=\"rowSpinner['updateFromDevice']\" label=\"_t('btn_update_from_device')\" icon=\"'fa-files-o'\"></bb-row-spinner></button><br><br><div class=\"alert alert-warning\" ng-if=\"nodeCfg.hasBattery && nodeCfg.notAwake.length > 0\"><i class=\"fa fa-info-circle text-warning\"></i> {{_t('conf_apply_battery')}}</div><table class=\"table table-striped_ table-condensed\"><tbody><tr ng-repeat=\"v in assocGroups track by $index\"><td class=association-text><h5>{{v.label}} ({{ _t('assoc_max')}} {{v.max}} {{ _t('assoc_nodes')}}) <span>| <i class=\"fa fa-clock-o\"></i> <span class={{v.timeClass}}>{{v.updateTime| isTodayFromUnix}}</span></span></h5><div><div class=\"btn-group btn-group-assoc-devices {{d.status}}\" role=group ng-repeat=\"d in assocGroupsDevices[v.groupId] track by d.elId\" id={{d.elId}}><button type=button class=\"btn btn-info\"><i class=\"fa fa-exclamation-triangle text-danger\" ng-if=\"d.status !== 'true-true'\"></i>(#{{d.id}}<span ng-if=nodeCfg.hasMca>.{{d.instance}}</span>) {{d.name|cutText:true:20}}</button> <button type=button class=\"btn btn-primary\" ng-click=deleteAssoc(d) ng-if=!d.isNew><i class=\"fa fa-times text-danger\"></i></button></div></div><p class=text-alert-list ng-if=\"v.remaining < 1\"><i class=\"fa fa-exclamation-circle text-warning\"></i> {{_t('assoc_max_nodes_reached')}}</p></td><td class=association-action style=\"text-align: right; width: 20%\"><button class=\"btn btn-primary\" type=button ng-if=\"v.remaining > 0\" ng-click=\"handleAssocModal('assocAddModal',$event,v)\" ng-disabled=\"rowSpinner['group_' + v.groupId]\"><bb-row-spinner spinner=\"rowSpinner['group_' + v.groupId]\" icon=\"'fa-plus'\"></bb-row-spinner></button></td></tr></tbody></table><div class=legend-entry><div class=legend-row><i class=\"fa fa-square fa-lg orange\"></i> {{_t('assoc_legend_2')}}</div><div class=legend-row><i class=\"fa fa-square fa-lg gray-light\"></i> {{_t('assoc_legend_3')}}</div><div class=legend-row><i class=\"fa fa-square fa-lg blue-info\"></i> {{_t('assoc_legend_4')}}</div></div><div ng-include=\"'app/views/configuration/modal_assoc_add.html'\"></div></div></div></div></div></div>"
  );


  $templateCache.put('app/views/configuration/commands.html',
    "<div ng-controller=ConfigCommandsController><div ng-include=\"'app/views/configuration/navi.html'\"></div><div class=\"row row-configuration\"><div class=\"col-md-3 menu-vertical\"><div ng-include=\"'app/views/configuration/menu.html'\"></div></div><div class=\"col-md-9 col-content\"><bb-alert alert=alert></bb-alert><div id=table_mobile ng-show=deviceId><table class=table><thead><tr><th>{{_t('th_instance')}}</th><th>{{_t('th_command_class')}}</th><th>{{_t('th_command_param')}}</th></tr></thead><tbody><tr ng-repeat=\"(k,v) in commands | orderBy:predicate:reverse\" id=\"{{ v.nodeId}}\"><td data-title=\"{{_t('th_instance')}}\" ng-class=\"($index == 0 ? 'no-class' : 'mobile-hide')\"><button class=\"btn btn-default\" ng-click=\"handleCmdClassModal('cmdClassModal',$event,v.instanceId, $index, v.ccId, 'cmdDataIn')\">{{v.instanceId}}</button> &nbsp;</td><td data-title=\"{{_t('th_command_class')}}\"><button class=\"btn btn-default\" href=\"\" ng-click=\"handleCmdClassModal('cmdClassModal',$event,v.instanceId,$index,v.ccId, 'cmdData')\">{{v.commandClass}}</button> &nbsp;</td><td data-title=\"{{_t('th_command_param')}}\"><div class=commands-data ng-repeat=\"c in v.command| orderBy:predicate:reverse\" ng-init=\"formName = 'form_' + c.data.method + '_' + v.rowId\"><form name={{formName}} id={{formName}} class=\"form form_commands\" role=form ng-submit=\"storeExpertCommnds(formName, v.cmd + '.' + c.data.method)\" novalidate><div class=commands-data-control><div class=form-inline ng-repeat=\"(pk,p) in c.data.params\"><expert-command-input collection=p values=c.data.values[pk] devices=devices name=c.data.method get-node-devices=getNodeDevices></expert-command-input></div><button class=\"btn btn-primary\" type=submit ng-disabled=\"rowSpinner[v.cmd + '.' + c.data.method]\"><bb-row-spinner spinner=\"rowSpinner[v.cmd + '.' + c.data.method]\" label=c.data.method icon=\"'fa-circle-o'\"></bb-row-spinner></button></div></form></div>&nbsp;</td></tr></tbody></table></div><div ng-include=\"'app/views/configuration/modal_cmdclass.html'\"></div></div></div></div>"
  );


  $templateCache.put('app/views/configuration/configuration.html',
    "<div ng-controller=ConfigConfigurationController><div ng-include=\"'app/views/configuration/navi.html'\"></div><div class=\"row row-configuration\"><div class=\"col-md-3 menu-vertical\"><div ng-include=\"'app/views/configuration/menu.html'\"></div></div><div class=\"col-md-9 col-content\"><bb-alert alert=alert></bb-alert><div ng-show=deviceId><div ng-include=\"'app/views/configuration/configuration_commands.html'\"></div><div ng-if=\"!configCont && deviceZddx.length > 0\"><button id=btn_show_description class=\"btn btn-default\" ng-click=\"handleModal('loadXmlModal', $event)\"><i class=\"fa fa-clone\"></i> {{_t('select_zddx_help')}}</button><div ng-include=\"'app/views/configuration/modal_loadxml.html'\"></div></div><div ng-include=\"'app/views/configuration/configuration_config.html'\"></div><div ng-include=\"'app/views/configuration/configuration_wakeup.html'\"></div><div ng-include=\"'app/views/configuration/configuration_switchall.html'\"></div><div ng-include=\"'app/views/configuration/configuration_protection.html'\"></div></div></div></div></div>"
  );


  $templateCache.put('app/views/configuration/configuration_commands.html',
    "<div class=cfg-block ng-if=hasConfigurationCc.command ng-controller=ConfigCommandsController><h4>{{hasConfigurationCc.commandClass}}</h4><div class=commands-data ng-repeat=\"c in hasConfigurationCc.command| orderBy:predicate:reverse\" ng-init=\"formName = 'form_' + c.data.method + '_' + v.rowId\"><form name={{formName}} id={{formName}} class=\"form form_commands\" role=form ng-submit=\"storeExpertCommnds(formName, hasConfigurationCc.cmd + '.' + c.data.method)\" novalidate><div class=commands-data-control><div class=form-inline ng-repeat=\"(pk,p) in c.data.params\"><expert-command-input collection=p values=c.data.values[pk] devices=devices name=c.data.method get-node-devices=getNodeDevices></expert-command-input></div><button class=\"btn btn-primary\" type=submit ng-disabled=\"rowSpinner[hasConfigurationCc.cmd + '.' + c.data.method]\"><bb-row-spinner spinner=\"rowSpinner[hasConfigurationCc.cmd + '.' + c.data.method]\" label=c.data.method icon=\"'fa-circle-o'\"></bb-row-spinner></button></div></form></div></div>"
  );


  $templateCache.put('app/views/configuration/configuration_config.html',
    "<div class=cfg-block-content ng-if=configCont ng-init=\"formName = 'form_config'\"><form name={{formName}} id={{formName}} class=form ng-submit=\"submitApplyConfigCfg(formName,{'id': deviceId,'instance': '0','commandclass': '70','command': 'Set'}, configCont, hasBattery,false,false,false,'saveIntoDevice')\" novalidate><div class=cfg-block><button class=\"btn btn-primary\" type=button ng-click=\"updateFromDeviceCfg('devices[' + deviceId + '].instances[0].commandClasses[0x70].Get', configCont, deviceId, formName,'updateFromDevice')\" ng-disabled=\"rowSpinner['updateFromDevice']\"><bb-row-spinner spinner=\"rowSpinner['updateFromDevice']\" label=\"_t('btn_update_from_device')\" icon=\"'fa-files-o'\"></bb-row-spinner></button> <button class=\"btn btn-primary\" type=submit ng-disabled=\"rowSpinner['saveIntoDevice']\"><bb-row-spinner spinner=\"rowSpinner['saveIntoDevice']\" label=\"_t('apply_config')\" icon=\"'fa-save'\"></bb-row-spinner></button> <button class=\"btn btn-primary\" type=button ng-click=\"setAllToDefault({'id': deviceId, 'instance': '0', 'commandclass': '70', 'command': 'Set'}, configCont, hasBattery, formName,'allToDefault')\" ng-disabled=\"rowSpinner['allToDefault']\"><bb-row-spinner spinner=\"rowSpinner['allToDefault']\" label=\"_t('set_all_default')\" icon=\"'fa-undo'\"></bb-row-spinner></button></div><div class=cfg-control-content id=cfg_control_{{v.confNum}} ng-repeat=\"v in configCont\"><div class=form-inline><expert-command-input collection=v div_id=$index default_value=v.defaultValue show_default_value=v.showDefaultValue curr_value=v.configCconfigValue></expert-command-input></div><div class=\"text-danger text-alert\" ng-if=\"v.configCconfigValue != v.configZwaveValue\" title=\"Val: {{v.configCconfigValue}} | Device: {{v.configZwaveValue}}\"><i class=\"fa fa-exclamation-triangle\"></i> {{_t('value_changed_to')}} <strong>{{v.configCconfigValue}}</strong> {{_t('value_not_stored_indevice')}}</div><p class=cfg-info><span class=is-updated-{{v.isUpdated}}>{{_t('rt_header_update_time')}}: {{v.updateTime}}</span> <span>| {{_t('set_value')}}: {{v.configCconfigValue}}</span> <span>| {{_t('default_value_is')}}:<config-default-value collection=v show_default_value=v.showDefaultValue default_value=v.defaultValue></config-default-value></span></p><br><p ng-if=v.description><i class=\"fa fa-info-circle fa-lg text-primary\"></i> <em>{{v.description}}</em></p><div><button class=\"btn btn-default\" type=button ng-click=\"submitApplyConfigCfg(formName, {'id': deviceId, 'instance': '0', 'commandclass': '70', 'command': 'Set'}, configCont, hasBattery, v.confNum,false,false,'save_' + v.confNum)\" ng-disabled=\"rowSpinner['save_' + v.confNum]\"><bb-row-spinner spinner=\"rowSpinner['save_' + v.confNum]\" label=\"_t('apply_config_into_device')\" icon=\"'fa-save text-success'\"></bb-row-spinner></button> <button class=\"btn btn-default\" type=button ng-click=\"submitApplyConfigCfg(formName, {'id': deviceId, 'instance': '0', 'commandclass': '70', 'command': 'Set'}, configCont, hasBattery, v.confNum, {confNum: v.confNum, showDefaultValue: v.showDefaultValue},false,'default_' + v.confNum)\" ng-disabled=\"rowSpinner['default_' + v.confNum]\"><bb-row-spinner spinner=\"rowSpinner['default_' + v.confNum]\" label=\"_t('set_to_default')\" icon=\"'fa-undo text-success'\"></bb-row-spinner></button></div></div></form></div>"
  );


  $templateCache.put('app/views/configuration/configuration_protection.html',
    "<div class=cfg-block id=protection_cont ng-if=protectionCont><h4>{{_t('protection_list')}}</h4><div class=cfg-block-content ng-init=\"formName = 'form_protection_list'\"><form name={{formName}} id={{formName}} class=form ng-submit=\"submitApplyConfigCfg(formName,{'id': deviceId,'instance': '0','commandclass': '75','command': 'Set'}, protectionCont, hasBattery,false,false,false,'saveIntoDeviceProtection')\" novalidate><div><button class=\"btn btn-primary\" type=button ng-click=\"uupdateFromDevice(protectionCont.cmd + '.Get()', hasBattery, deviceId, formName,'updateFromDeviceProtection')\" ng-disabled=\"rowSpinner['updateFromDeviceProtection']\"><bb-row-spinner spinner=\"rowSpinner['updateFromDeviceProtection']\" label=\"_t('btn_update_from_device')\" icon=\"'fa-files-o'\"></bb-row-spinner></button> <button class=\"btn btn-primary\" type=submit ng-disabled=\"rowSpinner['saveIntoDeviceProtection']\"><bb-row-spinner spinner=\"rowSpinner['saveIntoDeviceProtection']\" label=\"_t('apply_config')\" icon=\"'fa-save'\"></bb-row-spinner></button></div><div class=cfg-control-content ng-repeat=\"v in protectionCont.params\"><div class=form-inline><expert-command-input collection=v values=protectionCont.values[0] default_value=protectionCont.defaultValue curr_value=protectionCont.configCconfigValue name=protectionCont.name is_dropdown=1></expert-command-input></div><p class=cfg-info><span class=is-updated-{{protectionCont.isUpdated}}>{{_t('updated')}}: {{protectionCont.updateTime}} </span><span>| {{_t('default_value_is')}}:<config-default-value collection=v show_default_value=protectionCont.showDefaultValue default_value=protectionCont.defaultValue></config-default-value></span></p></div></form></div></div>"
  );


  $templateCache.put('app/views/configuration/configuration_switchall.html',
    "<div class=cfg-block id=switchall_cont ng-if=switchAllCont><h4>{{_t('switchall_list')}}</h4><div class=cfg-block-content ng-init=\"formName = 'form_switch_all'\"><form name={{formName}} id={{formName}} class=form ng-submit=\"submitApplyConfigCfg(formName,{'id': deviceId,'instance': '0','commandclass': '27','command': 'Set'}, switchAllCont, hasBattery,false,false,false,'saveIntoDeviceSwitchall')\" novalidate><div><button class=\"btn btn-primary\" type=button ng-click=\"updateFromDevice(switchAllCont.cmd + '.Get()', hasBattery, deviceId, formName,'updateFromDeviceSwitchall')\" ng-disabled=\"rowSpinner['updateFromDeviceSwitchall']\"><bb-row-spinner spinner=\"rowSpinner['updateFromDeviceSwitchall']\" label=\"_t('btn_update_from_device')\" icon=\"'fa-files-o'\"></bb-row-spinner></button> <button class=\"btn btn-primary\" type=submit ng-disabled=\"rowSpinner['saveIntoDeviceSwitchall']\"><bb-row-spinner spinner=\"rowSpinner['saveIntoDeviceSwitchall']\" label=\"_t('apply_config')\" icon=\"'fa-save'\"></bb-row-spinner></button></div><div class=cfg-control-content ng-repeat=\"v in switchAllCont.params\"><div class=form-inline><expert-command-input collection=v values=switchAllCont.values[0] default_value=switchAllCont.defaultValue curr_value=switchAllCont.configCconfigValue name=switchAllCont.name is_dropdown=1></expert-command-input></div><p class=cfg-info><span class=is-updated-{{switchAllCont.isUpdated}}>{{_t('updated')}}: {{switchAllCont.updateTime}} </span><span>| {{_t('default_value_is')}}:<config-default-value collection=v show_default_value=switchAllCont.showDefaultValue default_value=switchAllCont.defaultValue></config-default-value></span></p></div></form></div></div>"
  );


  $templateCache.put('app/views/configuration/configuration_wakeup.html',
    "<div class=cfg-block id=wakeup_cont ng-if=wakeupCont><h4>{{_t('wakeup_list')}}</h4><div class=cfg-block-content ng-init=\"formName = 'form_wakeup'\"><form name={{formName}} id={{formName}} class=form ng-submit=\"submitApplyConfigCfg(formName,{'id': deviceId,'instance': '0','commandclass': '84','command': 'Set'}, wakeupCont, hasBattery,false,false,false,'saveIntoDeviceWakeup')\" novalidate><div><button class=\"btn btn-primary\" type=button ng-click=\"updateFromDevice(wakeupCont.cmd + '.Get()', hasBattery, deviceId, formName,'updateFromDeviceWakeup')\" ng-disabled=\"rowSpinner['updateFromDeviceWakeup']\"><bb-row-spinner spinner=\"rowSpinner['updateFromDeviceWakeup']\" label=\"_t('btn_update_from_device')\" icon=\"'fa-files-o'\"></bb-row-spinner></button> <button class=\"btn btn-primary\" type=submit ng-disabled=\"rowSpinner['saveIntoDeviceWakeup']\"><bb-row-spinner spinner=\"rowSpinner['saveIntoDeviceWakeup']\" label=\"_t('apply_config')\" icon=\"'fa-save'\"></bb-row-spinner></button></div><div class=clearfix></div><div class=cfg-control-content><div ng-repeat=\"v in wakeupCont.params\"><div class=form-inline><expert-command-input collection=v values=wakeupCont.values[0] devices=devices get-node-devices=getNodeDevices curr_value=wakeupCont.configCconfigValue curr_node_value=wakeupCont.configCconfigNodeValue name=wakeupCont.name></expert-command-input></div></div><div class=clearfix></div><p class=cfg-info><span class=is-updated-{{wakeupCont.isUpdated}}>{{_t('updated')}}: {{wakeupCont.updateTime}} </span><span>| {{_t('default_value_is')}}:<config-default-value collection=v show_default_value=wakeupCont.showDefaultValue default_value=wakeupCont.defaultValue></config-default-value></span></p></div></form></div></div>"
  );


  $templateCache.put('app/views/configuration/firmware.html',
    "<div ng-controller=ConfigFirmwareController><div ng-include=\"'app/views/configuration/navi.html'\"></div><div class=\"row row-configuration\"><div class=\"col-md-3 menu-vertical\"><div ng-include=\"'app/views/configuration/menu.html'\"></div></div><div class=\"col-md-9 col-content\"><bb-alert alert=alert></bb-alert><div ng-show=deviceId><form name=form_firmware_update id=form_firmware_update class=\"form form-inline\" ng-if=firmware.show ng-submit=\"updateDeviceFirmware(firmware.input,'btn_update')\" novalidate><input id=url name=url class=form-control ng-model=firmware.input.url placeholder=\"{{_t('firmware_url')}}\" title=\"{{_t('firmware_url')}}\"><select name=devices class=form-control ng-model=firmware.input.targetId><option value=\"\" ng-selected=\"v.id != deviceId\">--- {{_t('target_id')}} ---</option><option value={{k}} ng-repeat=\"(k,v) in cfg.firmware_target\" ng-selected=\"k === 0\">{{k}}: {{_t(v)}}</option></select><input type=file class=form-control file-model=myFile> <button type=submit class=\"btn btn-primary\" id=btn_update ng-disabled=\"rowSpinner['btn_update']\"><bb-row-spinner spinner=\"rowSpinner['btn_update']\" label=\"_t('update')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></form></div></div></div></div>"
  );


  $templateCache.put('app/views/configuration/health.html',
    "<div ng-controller=ConfigHealthController><div ng-include=\"'app/views/configuration/navi.html'\"></div><div class=\"row row-configuration\"><div class=\"col-md-3 menu-vertical\"><div ng-include=\"'app/views/configuration/menu.html'\"></div></div><div class=\"col-md-9 col-content\"><bb-alert alert=alert></bb-alert><div ng-show=\"deviceId && !_.isEmpty(health.neighbours)\"><div id=table_mobile><div class=\"alert ng-scope alert-warning\" ng-if=!health.device.hasPowerLevel><i class=\"fa fa-exclamation-circle\"></i> {{_t('link_health_no_powerlevel')}}</div><table class=\"table table-striped table-condensed table-hover\"><thead class=cf><tr><th><a href=\"\" ng-click=\"orderBy('id')\">{{ _t('link_to_node')}} <span ng-show=\"predicate == 'id'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th><a href=\"\" ng-click=\"orderBy('name')\">{{ _t('device_name')}} <span ng-show=\"predicate == 'name'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th><a href=\"\" ng-click=\"orderBy('type')\">{{_t('device_description_device_type')}} <span ng-show=\"predicate == 'type'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th><a href=\"\" ng-click=\"orderBy('updateTime')\">{{ _t('datetime')}} <span ng-show=\"predicate == 'updateTime'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th>{{ _t('linkquality')}}</th><th class=mobile-show><button class=\"btn btn-primary\" id=btn_test_all_1 ng-if=health.device.hasPowerLevel ng-click=\"testAllLinks('all_1')\" ng-disabled=\"rowSpinner['all_1']\"><bb-row-spinner icon=\"'fa-circle-o'\" spinner=\"rowSpinner['all_1']\" label=\"_t('test_all_links')\"></bb-row-spinner></button></th></tr></thead><tbody><tr ng-repeat=\"v in health.neighbours| orderBy:predicate:reverse track by $index\" id={{v.rowId}}><td data-title=#><button class=\"btn btn-default btn-sm btn-{{v.type}}\">{{ v.id}}</button></td><td data-title=\"{{ _t('device_description_device_type')}}\">{{ v.name}}</td><td data-title=\"{{ _t('type')}}\"><i class=fa ng-class=v.icon title={{_t(v.type)}}></i></td><td data-title=\"{{ _t('datetime')}}\"><span class=\"row-time {{v.indicator.updateTimeColor}}\" ng-if=v.powerLevel>{{ v.indicator.updateTime | isTodayFromUnix }} </span><span class=\"row-time {{health.timing.indicator.updateTimeColor}}\" ng-if=\"!v.powerLevel && v.id === health.ctrlNodeId\">{{ health.timing.indicator.updateTime | isTodayFromUnix }}</span></td><td data-title=\"{{ _t('linkquality')}}\"><i class=\"fa fa-circle fa-2x clickable {{v.indicator.color}}\" ng-if=v.powerLevel ng-click=\"handlePowerLevelModal('healthPowerLevelModal', $event, v)\"></i> <i class=\"fa fa-circle fa-2x clickable {{health.timing.indicator.color}}\" ng-if=\"!v.powerLevel && v.id === health.ctrlNodeId\" ng-click=\"handleTimingModal('healthTimingModal', $event, v)\"></i></td><td data-title=\"\" ng-switch on=v.deviceType><button class=\"btn btn-default\" id=\"btn_test_{{ v.id}}\" ng-if=health.device.hasPowerLevel ng-click=runZwaveCmd(v.cmdTestNode) ng-disabled=rowSpinner[v.cmdTestNode]><bb-row-spinner icon=\"'fa-circle-o text-success'\" spinner=rowSpinner[v.cmdTestNode] label=\"_t('test_link')\"></bb-row-spinner></button> <button class=\"btn btn-default\" id=\"btn_nop_{{ v.id}}\" ng-if=\"!health.device.hasPowerLevel && v.type === 'static'\" ng-click=runZwaveNopCmd(v.cmdNop) ng-disabled=rowSpinner[v.cmdNop]><bb-row-spinner icon=\"'fa-circle-o text-success'\" spinner=rowSpinner[v.cmdNop] label=\"_t('nop')\"></bb-row-spinner></button></td></tr></tbody></table></div><div class=\"legend-entry legend-inline\"><div class=legend-row><button class=\"btn btn-default btn-sm btn-static\">&nbsp;</button> {{_t('static')}}</div><div class=legend-row><button class=\"btn btn-default btn-sm btn-portable\">&nbsp;</button> {{_t('portable')}}</div><div class=legend-row><button class=\"btn btn-default btn-sm btn-battery\">&nbsp;</button> {{_t('battery')}}</div><div class=legend-row><button class=\"btn btn-default btn-sm btn-flirs\">&nbsp;</button> {{_t('flirs')}}</div><div class=legend-row><button class=\"btn btn-default btn-sm btn-mains\">&nbsp;</button> {{_t('mains')}}</div><div class=legend-row><button class=\"btn btn-default btn-sm btn-unknown\">&nbsp;</button> {{_t('unknown')}}</div></div></div><div id=healthPowerLevelModal class=appmodal ng-if=modalArr.healthPowerLevelModal><div class=appmodal-in><div class=appmodal-header><span class=appmodal-close ng-click=\"handlePowerLevelModal('healthPowerLevelModal', $event)\"><i class=\"fa fa-times\"></i></span><h3>{{health.device.find.name|cutText:true:30}}</h3></div><div class=appmodal-body ng-bind-html=\"health.device.commandClass | toTrusted\"></div><div class=appmodal-footer><button type=button class=\"btn btn-default\" ng-click=\"handlePowerLevelModal('healthPowerLevelModal', $event)\"><i class=\"fa fa-times text-danger\"></i> <span class=btn-name>{{_t('btn_close')}}</span></button></div></div></div><div id=healthTimingModal class=appmodal ng-if=modalArr.healthTimingModal><div class=appmodal-in><div class=appmodal-header><span class=appmodal-close ng-click=\"handleTimingModal('healthTimingModal', $event)\"><i class=\"fa fa-times\"></i></span><h3>{{health.device.find.name|cutText:true:30}}</h3></div><div class=appmodal-body><p><strong>{{_t('th_total')}} (pkts)</strong>: {{health.timing.find.totalPackets}}</p><p><strong>{{_t('th_ok')}}</strong>: {{health.timing.find.okPackets}}%</p><p><strong>{{_t('th_lastpackets')}}</strong>: <span ng-bind-html=\"health.timing.find.lastPackets | toTrusted\"></span></p><p><strong>{{_t('timing_color_description')}}:</strong><br><i class=\"fa fa-square fa-lg\" style=\"color: green\"></i> {{_t('timing_green')}}<br><i class=\"fa fa-square fa-lg\" style=\"color: black\"></i> {{_t('timing_black')}}<br><i class=\"fa fa-square fa-lg\" style=\"color: red\"></i> {{_t('timing_red')}}.<br></p></div><div class=appmodal-footer><button type=button class=\"btn btn-default\" ng-click=\"handleTimingModal('healthTimingModal', $event)\"><i class=\"fa fa-times text-danger\"></i> <span class=btn-name>{{_t('btn_close')}}</span></button></div></div></div></div></div></div>"
  );


  $templateCache.put('app/views/configuration/interview.html',
    "<div ng-controller=ConfigInterviewController><div ng-include=\"'app/views/configuration/navi.html'\"></div><div class=\"row row-configuration\"><div class=\"col-md-3 menu-vertical\"><div ng-include=\"'app/views/configuration/menu.html'\"></div></div><div class=\"col-md-9 col-content\"><bb-alert alert=alert></bb-alert><div ng-show=deviceId><div class=cfg-block><div class=row><div class=col-md-8><div class=table-responsive_><table class=\"table table-striped table-condensed table-cfg-interview\"><tbody><tr><th>{{_t('device_node_name')}}</th><td><div ng-hide=goDeviceName ng-click=\"goDeviceName = true\">{{deviceName}} <button type=button class=\"btn btn-default\" ng-hide=\"cfg.controller.zwayNodeId == deviceId\" ng-click=\"goDeviceName = true\" ng-disabled=\"rowSpinner['deviceName']\"><bb-row-spinner spinner=\"rowSpinner['deviceName']\" icon=\"'fa-pencil'\"></bb-row-spinner></button></div><form name=form_rename id=form_rename ng-model=form_rename class=\"form _form-inline\" ng-show=goDeviceName ng-submit=\"renameDevice(form_rename,deviceName,'deviceName');goDeviceName = !goDeviceName\" novalidate><div class=input-group><input name=device_name id=device_name class=form-control value={{deviceName}} ng-model=deviceName><div class=input-group-btn><button type=submit class=\"btn btn-primary\" title=\"{{_t('btn_save')}}\"><i class=\"fa fa-circle-o\"></i> <span class=btn-name>{{_t('btn_save')}}</span></button></div></div></form></td></tr><tr ng-repeat=\"v in descriptionCont track by $index\" ng-hide=\"v.val === '' || v.val === false || v.val === null\"><th>{{_t(v.key)}}</th><td id={{v.key}}><div ng-switch on=v.key><div ng-switch-when=command_class><span ng-repeat=\"cc in interviewCommands\"><a href=\"\" ng-click=\"handleCmdClassModal('cmdClassModal',$event,cc.iId,cc.ccId, 'cmdData')\">{{cc.ccName}} </a>&#8226;&nbsp;</span></div><div class=config-interview-val ng-switch-default ng-bind-html=\"v.val | toTrusted\"></div></div></td></tr><tr><th>{{_t('device_interview_indicator')}}</th><td><div class=progress ng-if_=\"zwaveInterview.progress > 0 && zwaveInterview.progress < 101\"><div class=progress-bar style=\"min-height:40px;min-width: 2em; width: {{zwaveInterview.progress}}%\" ng-class=\"zwaveInterview.progress < 100 ? 'progress-bar-danger progress-bar-striped active' : 'progress-bar-success'\">{{zwaveInterview.progress}}%</div></div></td></tr></tbody></table></div></div><div class=col-md-4><img src={{deviceImage}} class=config-device-img alt=Image></div></div></div><div class=cfg-block><button id=btn_request_nif class=\"btn btn-primary\" ng-click=\"requestNodeInformation('devices[' + deviceId + '].RequestNodeInformation()')\" ng-disabled=\"rowSpinner['devices[' + deviceId + '].RequestNodeInformation()']\"><bb-row-spinner spinner=\"rowSpinner['devices[' + deviceId + '].RequestNodeInformation()']\" label=\"_t('config_ui_request_node_info')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button> <button class=\"btn btn-primary\" id=btn_interview_force ng-click=\"interviewForce('devices[' + deviceId + '].InterviewForce()')\" ng-disabled=\"rowSpinner['devices[' + deviceId + '].InterviewForce()']\"><bb-row-spinner spinner=\"rowSpinner['devices[' + deviceId + '].InterviewForce()']\" label=\"_t('config_ui_force_interview')\" icon=\"'fa-fire'\"></bb-row-spinner></button> <button id=btn_show_interview_result class=\"btn btn-default\" ng-click=\"handleModal('interviewModal',$event)\"><i class=\"fa fa-clone\"></i> {{_t('config_ui_show_interview_results')}}</button> <button id=btn_show_description class=\"btn btn-default\" ng-click=\"handleModal('loadXmlModal', $event)\"><i class=\"fa fa-clone\"></i> {{_t('config_ui_select_xml')}}</button></div></div><div ng-include=\"'app/views/configuration/modal_interview.html'\"></div><div ng-include=\"'app/views/configuration/modal_cmdclass.html'\"></div><div ng-include=\"'app/views/configuration/modal_loadxml.html'\"></div></div></div></div>"
  );


  $templateCache.put('app/views/configuration/menu.html',
    "<ul class=list-group><li class=\"list-group-item clickable\" title=\"{{v.name }}\" ng-repeat=\"v in devices\" ng-click=changeDevice(v.id) ng-class=\"v.id == deviceId ? 'active': ''\">(#{{v.id}}) {{v.name | cutText:true:30}}</li></ul>"
  );


  $templateCache.put('app/views/configuration/modal_assoc_add.html',
    "<div id=assocAddModal class=appmodal ng-show=modalArr.assocAddModal><div class=appmodal-in><div class=appmodal-header><span class=appmodal-close ng-click=closeAssocModal()><i class=\"fa fa-times\"></i></span><h3>{{_t('th_command_class')}}</h3></div><div class=\"appmodal-body modal-h-600\" style=\"white-space: normal\"><div class=form-inline>{{ _t('fro')}} {{nodeCfg.name}} {{ _t('to_locate')}}<br><div class=form-group><select class=form-control ng-model=input.toNode ng-change=showAssocNodeInstance(input.toNode,nodeCfg.hasMca)><option value=\"\" ng-selected=true>&lt; {{ _t('assoc_select_to_node')}} &gt;</option><option ng-repeat=\"v in assocAddDevices track by $index\" value={{v.id}}>(#{{v.id}}) {{v.name}}</option></select></div><div class=form-group ng-if=\"nodeCfg.hasMca && assocAddInstances\"><select class=form-control ng-model=input.toInstance><option value=\"\" ng-selected=true>&lt; {{ _t('assoc_select_to_instance')}} &gt;</option><option value=plain ng-selected=true>{{ _t('plain_association')}}</option><option ng-repeat=\"v in assocAddInstances track by $index\" value={{v.key}}>{{v.val}}</option></select></div></div></div><div class=appmodal-footer><button type=button class=\"btn btn-default\" ng-click=closeAssocModal()><i class=\"fa fa-times text-danger\"></i> <span class=btn-name>{{_t('btn_cancel')}}</span></button> <button type=submit class=\"btn btn-primary\" ng-click=storeAssoc(input) ng-disabled=\"!input.toNode || ((assocAddInstances) && !input.toInstance)\"><i class=\"fa fa-circle-o\"></i> <span class=btn-name>{{ _t('dialog_add')}}</span></button></div></div></div>"
  );


  $templateCache.put('app/views/configuration/modal_cmdclass.html',
    "<div id=cmdClassModal class=appmodal ng-show=modalArr.cmdClassModal><div class=appmodal-in><div class=appmodal-header><span class=appmodal-close ng-click=\"handleModal('cmdClassModal', $event)\"><i class=\"fa fa-times\"></i></span><h3>{{_t('th_command_class')}}</h3></div><div class=\"appmodal-body modal-h-600\"><div ng-bind-html=commandClass|toTrusted></div></div><div class=appmodal-footer><button type=button class=\"btn btn-default\" ng-click=\"handleModal('cmdClassModal', $event)\"><i class=\"fa fa-times text-danger\"></i> <span class=btn-name>{{_t('btn_cancel')}}</span></button></div></div></div>"
  );


  $templateCache.put('app/views/configuration/modal_interview.html',
    "<div id=interviewModal class=appmodal ng-show=modalArr.interviewModal><div class=appmodal-in><div class=appmodal-header><span class=appmodal-close ng-click=\"handleModal('interviewModal', $event)\"><i class=\"fa fa-times\"></i></span><h3>{{_t('interview_results_dialog_title')}}</h3></div><div class=\"appmodal-body modal-h-600\"><p>{{_t('interview_results_title')}} <button class=\"btn btn-default\" ng-click=\"handleCmdClassModal('cmdClassModal',$event)\"><i class=\"fa fa-clone\"></i> {{deviceName}}</button></p><div id=table_mobile_modal_1><table class=\"table table-condensed\"><thead><tr><th>{{_t('th_instance')}}</th><th>{{_t('th_command_class')}}</th><th>{{_t('th_result')}}</th></tr></thead><tbody><tr ng-repeat=\"v in interviewCommands track by $index\" id={{v.ccId}}><td data-title=\"{{_t('th_instance')}}\" ng-class=\"($index == 0 ? 'no-class' : 'mobile-hide')\"><a href=\"\" ng-click=\"handleCmdClassModal('cmdClassModal',$event,v.iId,v.ccId, 'cmdDataIn')\">{{v.iId}}</a> &nbsp;</td><td data-title=\"{{_t('th_command_class')}}\"><a href=\"\" ng-click=\"handleCmdClassModal('cmdClassModal',$event,v.iId,v.ccId, 'cmdData')\">{{v.ccName}}</a></td><td data-title=\"{{_t('th_result')}}\"><span ng-if=v.interviewDone><i class=\"fa fa-check text-success\"></i></span> <button id=btn_force_interview_{{v.ccId}} class=\"btn btn-primary btn-sm\" ng-init=\"apiUrl = 'devices[' +deviceId + '].instances[' + v.iId+'].commandClasses[' + v.ccId + '].Interview()'\" ng-if=!v.interviewDone ng-click=interviewForceDevice(apiUrl) ng-disabled=rowSpinner[apiUrl]><bb-row-spinner spinner=rowSpinner[apiUrl] label=\"_t('config_ui_force_interview')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button> &nbsp;</td></tr></tbody></table></div></div><div class=appmodal-footer><button type=button class=\"btn btn-default\" ng-click=\"handleModal('interviewModal', $event)\"><i class=\"fa fa-times text-danger\"></i> <span class=btn-name>{{_t('btn_cancel')}}</span></button></div></div></div>"
  );


  $templateCache.put('app/views/configuration/modal_loadxml.html',
    "<div id=loadXmlModa class=appmodal ng-if=modalArr.loadXmlModal><div class=appmodal-in ng-controller=LoadDeviceXmlController><div class=appmodal-header><span class=appmodal-close ng-click=\"handleModal('loadXmlModal', $event)\"><i class=\"fa fa-times\"></i></span><h3>{{_t('config_ui_select_xml')}}</h3></div><div class=\"appmodal-body modal-h-600\"><p ng-bind-html=\"_t('select_zddx_help') | toTrusted\"></p><select id=select_zddx_help class=form-control ng-change=changeDeviceXml(deviceXml.input) ng-model=deviceXml.input.fileName><option value=\"\">---</option><option ng-init=\"selectCfg = {\r" +
    "\n" +
    "                                'name':((v.brandName == '' && v.productName == '')?('Unnamed ZDDX: ' + v.fileName):(v.brandName + ' ' + v.productName))}\" ng-repeat=\"v in deviceXml.all | orderBy:'brandName':false track by $index\" ng-selected=\"deviceZddxFile == v.fileName\" value={{v.fileName}}>{{selectCfg.name}}</option></select><div id=device_select_image_container ng-if=\"!_.isEmpty(deviceXml.find) && deviceXml.find.deviceImage\"><div id=device_select_image><img ng-src={{deviceXml.find.deviceImage}}></div></div></div><div class=appmodal-footer><button type=button class=\"btn btn-default\" ng-click=\"handleModal('loadXmlModal', $event)\"><i class=\"fa fa-times text-danger\"></i> <span class=btn-name>{{_t('btn_cancel')}}</span></button> <button class=\"btn btn-primary\" ng-if=!_.isEmpty(deviceXml.find) ng-click=\"storeDeviceXml(deviceXml.input,'storeDeviceXml')\" ng-disabled=\"rowSpinner['storeDeviceXml']\"><bb-row-spinner spinner=\"rowSpinner['storeDeviceXml']\" label=\"_t('btn_save')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></div></div></div>"
  );


  $templateCache.put('app/views/configuration/navi.html',
    "<div class=\"tabs-wrap form-inline\" ng-show=\"deviceId > 0\"><div class=\"btn-group btn-goup-tabs\" ng-class=\"cfg.zwavecfg.debug ? 'btn-tabs-7': 'btn-tabs-6'\"><a class=\"btn btn-default\" title=\"{{_t('nav_device_interview')}}\" href=#configuration/interview/{{deviceId}} ng-class=\"activeTab == 'interview' ? 'active' : ''\"><i class=\"fa fa-commenting\"></i> <span class=btn-name>{{_t('nav_device_interview')}}</span> </a><a class=\"btn btn-default\" title=\"{{_t('nav_device_configuration')}}\" href=#configuration/configuration/{{deviceId}} ng-class=\"activeTab == 'configuration' ? 'active' : ''\"><i class=\"fa fa-cogs\"></i> <span class=btn-name>{{_t('nav_device_configuration')}}</span> </a><a class=\"btn btn-default\" title=\"{{_t('nav_device_assoc')}}\" href=#configuration/association/{{deviceId}} ng-class=\"activeTab == 'association' ? 'active' : ''\"><i class=\"fa fa-share-alt\"></i> <span class=btn-name>{{_t('nav_device_assoc')}} </span></a><a class=\"btn btn-default\" title=\"{{_t('link_health')}}\" href=#configuration/health/{{deviceId}} ng-class=\"activeTab == 'health' ? 'active' : ''\"><i class=\"fa fa-unlink\"></i> <span class=btn-name>{{_t('link_health')}}</span> </a><a class=\"btn btn-default\" title=\"{{_t('nav_expert_commands')}}\" href=#configuration/commands/{{deviceId}} ng-class=\"activeTab == 'commands' ? 'active' : ''\"><i class=\"fa fa-file-code-o\"></i> <span class=btn-name>{{_t('nav_expert_commands')}}</span> </a><a class=\"btn btn-default\" title=\"{{_t('nav_firmware_update')}}\" href=#configuration/firmware/{{deviceId}} ng-class=\"activeTab == 'firmware' ? 'active' : ''\"><i class=\"fa fa-upload\"></i> <span class=btn-name>{{_t('nav_firmware_update')}}</span> </a><a class=\"btn btn-default\" title=\"{{_t('nav_postfix_update')}}\" href=#configuration/postfix/{{deviceId}} ng-class=\"activeTab == 'postfix' ? 'active' : ''\" ng-if=cfg.zwavecfg.debug><i class=\"fa fa-tasks\"></i> <span class=btn-name>{{_t('nav_postfix_update')}}</span></a></div></div><div class=menu-horizontal><div class=\"page-header form-inline\" ng-if=\"_.size(devices) > 0\"><div class=\"btn-group btn-goup-block_ btn-goup-2_\" ng-click=\"expandNavi('configDevices', $event)\"><button class=\"btn btn-default\"><span ng-if=\"deviceId > 0\">(#{{deviceId}}) {{deviceName | cutText:true:40}}</span> <span ng-if=\"!deviceId > 0\">{{_t('select_device')}}</span></button> <button class=\"btn btn-default\"><i class=\"fa fa-chevron-down\"></i></button></div></div><div class=page-navi ng-if=naviExpanded.configDevices><div class=page-navi-in><div class=page-navi-content><a class=\"btn btn-default btn-tag\" title={{v.name}} ng-repeat=\"v in devices| orderBy:predicate:reverse\" ng-click=changeDevice(v.id) ng-class=\"v.id == deviceId ? 'active': ''\">(#{{v.id}}) {{v.name | cutText:true:30}}</a></div></div></div></div>"
  );


  $templateCache.put('app/views/configuration/postfix.html',
    "<div ng-controller=ConfigPostfixController><div ng-include=\"'app/views/configuration/navi.html'\"></div><div class=\"row row-configuration\"><div class=\"col-md-3 menu-vertical\"><div ng-include=\"'app/views/configuration/menu.html'\"></div></div><div class=\"col-md-9 col-content\"><bb-alert alert=alert></bb-alert><div ng-show=deviceId><div class=\"alert alert-warning\" ng-if=!postfix.model.p_id><i class=\"fa fa-exclamation-circle\"></i> {{_t('postfix_missingid')}}</div><form id=postfix_form name=postfix_form role=form class=form novalidate ng-if=postfix.model.p_id ng-submit=updatePostfix()><div class=cfg-block><table class=\"table table-striped table-condensed table-cfg-interview\"><tbody><tr><th>{{_t('p_id')}}</th><td>{{postfix.model.p_id}}</td><td>&nbsp;</td></tr><tr><th>{{_t('product')}}</th><td><input name=product id=product class=form-control ng-model=postfix.model.product></td><td>&nbsp;</td></tr><tr><th>{{_t('preInterview')}}</th><td><input name=preInterview id=preInterview class=form-control ng-model=postfix.interview.preInterview><div ng-repeat=\"v in postfix.model.preInterview track by $index\">{{v}} <span class=clickable ng-click=\"removeInterview('preInterview',$index)\"><i class=\"fa fa-times text-danger\"></i></span></div></td><td><button type=button class=\"btn btn-default\" ng-click=\"addInterview('preInterview')\"><i class=\"fa fa-plus text-success\"></i></button></td></tr><tr><th>{{_t('postInterview')}}</th><td><input name=postInterview id=postInterview class=form-control ng-model=postfix.interview.postInterview><div ng-repeat=\"v in postfix.model.postInterview\">{{v}} <span class=clickable ng-click=\"removeInterview('postInterview',$index)\"><i class=\"fa fa-times text-danger\"></i></span></div></td><td><button type=button class=\"btn btn-default\" ng-click=\"addInterview('postInterview')\"><i class=\"fa fa-plus text-success\"></i></button></td></tr><tr><th>{{_t('tester')}}</th><td><input name=tester id=tester class=form-control ng-model=postfix.model.tester></td><td>&nbsp;</td></tr><tr><th>{{_t('commentary')}}</th><td><input name=commentary id=commentary class=form-control ng-model=postfix.model.commentary></td><td>&nbsp;</td></tr></tbody></table></div><div class=\"cfg-block text-right\"><button type=button class=\"btn btn-default\" ng-click=\"deletePostfix(_t('lb_delete_confirm'))\" ng-if=postfix.find><i class=\"fa fa-times text-danger\"></i> {{_t('dialog_remove')}}</button> <a class=\"btn btn-default\" href=\"{{cfg.postfixget_url + '/' + postfix.model.p_id}}\" target=blank ng-if=postfix.find><i class=\"fa fa-file-code-o text-success\"></i> {{_t('show_json')}} </a><button type=submit class=\"btn btn-primary\"><i class=\"fa fa-circle-o\"></i> {{_t('btn_save')}}</button></div></form></div></div></div></div>"
  );


  $templateCache.put('app/views/controll/locks.html',
    "<div ng-controller=LocksController><div class=page-header><h1>{{_t('nav_locks')}}</h1></div><bb-alert alert=alert></bb-alert><div id=table_mobile ng-if=locks.show><table class=\"table table-striped table-condensed table-hover\"><thead><tr><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'id'\" label=\"'#'\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'name'\" label=\"_t('device_name')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'status'\" label=\"_t('nav_status')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'updateTime'\" label=\"_t('datetime')\"></sort-by></th><th>&nbsp;</th><th>&nbsp;</th></tr></thead><tbody><tr ng-repeat=\"v in locks.all | orderBy:predicate:reverse track by $index\" id=\"{{ v.rowId}}\"><td data-title=#>{{ v.id}}</td><td data-title=\"{{ _t('device_name')}}\">{{ v.name}}</td><td data-title=\"{{ _t('nav_status')}}\" class=row-level>{{_t(v.status)}} &nbsp;</td><td data-title=\"{{ _t('datetime')}}\"><bb-date-time obj=v.dateTime updated=v.isUpdated></bb-date-time></td><td class=td-action data-title=\"\"><button class=\"btn btn-default\" id=\"btn_update_{{ v.rowId}}\" ng-click=updateLock(v.urlToStore) ng-disabled=rowSpinner[v.urlToStore]><bb-row-spinner spinner=rowSpinner[v.urlToStore] label=\" _t('update')\" icon=\"'fa-circle-o text-success'\"></bb-row-spinner></button></td><td class=\"lock-controll td-action\" data-title=\"\"><div class=\"btn-group btn-group-lock\"><button type=button class=\"btn btn-default btn-lock\" id=\"btn_lock_{{ v.rowId}}\" title=\"{{_t('btn_close')}}\" ng-class=\"{active: v.level=='255'}\" ng-click=updateLock(v.urlToOn) ng-disabled=rowSpinner[v.urlToOn]><bb-row-spinner spinner=rowSpinner[v.urlToOn] icon=\"'fa-lock text-success'\"></bb-row-spinner></button> <button type=button class=\"btn btn-default btn-unlock\" id=\"btn_unlock_{{ v.rowId}}\" title=\"{{_t('btn_open')}}\" ng-class=\"{active: v.level=='0'}\" ng-click=updateLock(v.urlToOff) ng-disabled=rowSpinner[v.urlToOff]><bb-row-spinner spinner=rowSpinner[v.urlToOff] icon=\"'fa-unlock text-danger'\"></bb-row-spinner></button></div></td></tr></tbody></table></div></div>"
  );


  $templateCache.put('app/views/controll/meters.html',
    "<div ng-controller=MetersController><div class=page-header><h1>{{_t('nav_meters')}}</h1></div><bb-alert alert=alert></bb-alert><div id=table_mobile ng-if=meters.show><table class=\"table table-striped table-condensed table-hover\"><thead><tr><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'id'\" label=\"'#'\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'name'\" label=\"_t('device_name')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'purpose'\" label=\"_t('device_description_device_type')\"></sort-by></th><th class=text-right><sort-by callback=orderBy(field) obj=orderByArr field=\"'level'\" label=\"_t('th_level')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'levelExt'\" label=\"_t('th_scale')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'updateTime'\" label=\"_t('datetime')\"></sort-by></th><th class=\"mobile-show td-action\"><button class=\"btn btn-primary\" id=btn_update_all_1 ng-click=\"updateAllMeters('all_1','urlToStore')\" ng-disabled=\"rowSpinner['all_1']\"><bb-row-spinner spinner=\"rowSpinner['all_1']\" label=\"_t('switches_update_all')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></th></tr></thead><tbody><tr ng-repeat=\"v in meters.all | orderBy:predicate:reverse track by $index\" id=\"{{ v.rowId}}\"><td data-title=#>{{ v.id}}<span ng-show=\"v.iId != 0\">.{{v.iId}}</span></td><td data-title=\"{{ _t('device_name')}}\">{{ v.name}}</td><td data-title=\"{{ _t('device_description_device_type')}}\">{{ v.purpose}} &nbsp;</td><td data-title=\"{{ _t('th_level')}}\" class=\"row-level text-right\">{{ v.level}} &nbsp;</td><td data-title=\"{{ _t('th_scale')}}\" class=row-level-ext>{{ v.levelExt}} &nbsp;</td><td data-title=\"{{ _t('datetime')}}\"><bb-date-time obj=v.dateTime updated=v.isUpdated></bb-date-time></td><td class=td-action data-title=\"\"><button class=\"btn btn-default\" id=\"btn_update_{{ v.rowId}}\" ng-click=updateMeter(v.urlToStore) ng-disabled=rowSpinner[v.urlToStore]><bb-row-spinner spinner=rowSpinner[v.urlToStore] label=\" _t('update')\" icon=\"'fa-circle-o text-success'\"></bb-row-spinner></button> <button class=\"btn btn-default\" id=\"btn_reset_{{ v.rowId}}\" ng-if=v.urlToReset ng-click=updateMeter(v.urlToReset) ng-disabled=rowSpinner[v.urlToReset]><bb-row-spinner spinner=rowSpinner[v.urlToReset] label=\" _t('reset')\" icon=\"'fa-refresh text-success'\"></bb-row-spinner></button></td></tr></tbody></table></div></div>"
  );


  $templateCache.put('app/views/controll/notifications.html',
    "<div ng-controller=NotificationController><div class=page-header><h1>{{_t('notifications')}}</h1></div><bb-alert alert=alert></bb-alert><div id=table_mobile ng-if=notifications.show><table class=\"table table-striped table-condensed table-hover\"><thead><tr><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'id'\" label=\"'#'\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'name'\" label=\"_t('device_name')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'typeString'\" label=\"_t('notification')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'eventString'\" label=\"_t('event')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'updateTime'\" label=\"_t('datetime')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'status'\" label=\"_t('nav_status')\"></sort-by></th><th class=\"mobile-show td-action\"><button class=\"btn btn-primary\" id=btn_update_all_1 ng-click=\"updateAllNotifications('all_1','urlToStore')\" ng-disabled=\"rowSpinner['all_1']\"><bb-row-spinner spinner=\"rowSpinner['all_1']\" label=\"_t('switches_update_all')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></th></tr></thead><tbody><tr ng-repeat=\"v in notifications.all | orderBy:predicate:reverse track by $index\" id=\"{{ v.rowId}}\"><td data-title=#>{{ v.id}}</td><td data-title=\"{{ _t('device_name')}}\">{{ v.name}}</td><td data-title=\"{{ _t('notification')}}\" title={{v.typeId}}>{{v.typeString}}</td><td data-title=\"{{ _t('event')}}\" title={{v.event}}>{{v.eventString}}</td><td data-title=\"{{ _t('datetime')}}\"><bb-date-time obj=v.dateTime updated=v.isUpdated></bb-date-time></td><td data-title=\"{{ _t('nav_status')}}\"><div ng-if=\"v.version >1\"><label class=switcher title={{_t(v.statusString)}} ng-class=\"v.status === 255 ? 'ison':'isoff'\" ng-hide=\"rowSpinner['btn_all_of'] || rowSpinner['btn_all_on']\" ng-click=\"setStatus(\r" +
    "\n" +
    "                               v.status === 255?  v.urlToOff : v.urlToOn);\r" +
    "\n" +
    "                               v.status = (v.status === 255 ?  0 : 255)\"><div class=\"switcher-slider round\"><span class=switcher-slider-in>{{v.status === 255 ? 'I':'0'}}</span></div></label><i class=\"fa fa-spinner fa-spin fa-lg\" ng-if=\"rowSpinner['btn_all_of'] || rowSpinner['btn_all_on'] \"></i></div><span ng-if=\"v.version === 1\">{{_t(v.statusString)}}</span></td><td class=td-action data-title=\"\"><button class=\"btn btn-default\" id=\"btn_update_{{ v.rowId}}\" ng-click=updateNotification(v.urlToStore) ng-disabled=rowSpinner[v.urlToStore]><bb-row-spinner spinner=rowSpinner[v.urlToStore] label=\" _t('update')\" icon=\"'fa-circle-o text-success'\"></bb-row-spinner></button></td></tr></tbody></table></div></div>"
  );


  $templateCache.put('app/views/controll/sensors.html',
    "<div ng-controller=SensorsController><div class=page-header><h1>{{ _t('h1_sensor')}}</h1></div><bb-alert alert=alert></bb-alert><div id=table_mobile ng-if=sensors.show><table class=\"table table-striped table-condensed table-hover\"><thead><tr><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'id'\" label=\"'#'\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'name'\" label=\"_t('device_name')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'purpose'\" label=\"_t('device_description_device_type')\"></sort-by></th><th class=text-right><sort-by callback=orderBy(field) obj=orderByArr field=\"'level'\" label=\"_t('th_level')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'levelExt'\" label=\"_t('th_scale')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'updateTime'\" label=\"_t('datetime')\"></sort-by></th><th class=\"mobile-show td-action\"><button class=\"btn btn-primary\" id=btn_update_all_1 ng-click=\"updateAllSensors('all_1','urlToStore')\" ng-disabled=\"rowSpinner['all_1']\"><bb-row-spinner spinner=\"rowSpinner['all_1']\" label=\"_t('switches_update_all')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></th></tr></thead><tbody><tr ng-repeat=\"v in sensors.all| orderBy:predicate:reverse track by $index\" id=\"{{ v.rowId}}\"><td data-title=#>{{ v.id}}<span ng-show=\"v.iId != 0\">.{{v.iId}}</span></td><td data-title=\"{{ _t('device_name')}}\">{{ v.name}}</td><td data-title=\"{{ _t('device_description_device_type')}}\">{{v.purpose}} &nbsp;</td><td data-title=\"{{ _t('th_level')}}\" class=\"row-level text-right\"><span ng-if=!v.html ng-bind=v.level></span> <span ng-if=v.html ng-bind-html=v.level|toTrusted></span> &nbsp;</td><td data-title=\"{{ _t('th_scale')}}\" class=row-level-ext>{{v.levelExt}} &nbsp;</td><td data-title=\"{{ _t('datetime')}}\"><bb-date-time obj=v.dateTime updated=v.isUpdated></bb-date-time></td><td class=td-action data-title=\"\"><button class=\"btn btn-default\" id=\"btn_update_{{ v.rowId}}\" ng-click=updateSensor(v.cmdToUpdate,v.urlToStore) ng-disabled=rowSpinner[v.cmdToUpdate]><bb-row-spinner spinner=rowSpinner[v.cmdToUpdate] label=\" _t('update')\" icon=\"'fa-circle-o text-success'\"></bb-row-spinner></button></td></tr></tbody></table></div></div>"
  );


  $templateCache.put('app/views/controll/switch.html',
    "<div ng-controller=SwitchController><div class=page-header><h1>{{_t('nav_switch')}}</h1></div><bb-alert alert=alert></bb-alert><div id=table_mobile ng-if=switches.show><table class=\"table table-striped table-condensed table-hover\"><thead class=cf><tr><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'id'\" label=\"'#'\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'name'\" label=\"_t('device_name')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'level'\" label=\"_t('th_level')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'updateTime'\" label=\"_t('datetime')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'switchAllValue'\" label=\"_t('th_switchall')\"></sort-by></th><th class=mobile-show><button class=\"btn btn-primary\" id=btn_update_all_1 ng-click=\"updateAllSwitches('all_1','urlToStore')\" ng-disabled=\"rowSpinner['all_1']\"><bb-row-spinner spinner=\"rowSpinner['all_1']\" label=\"_t('switches_update_all')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></th><th class=mobile-show><div class=btn-group style=\"min-width: 150px !important\"><button class=\"btn btn-primary\" id=btn_all_of ng-click=\"updateAllSwitches('btn_all_of','urlToOff')\" ng-disabled=\"rowSpinner['btn_all_of']\"><bb-row-spinner spinner=\"rowSpinner['btn_all_of']\" label=\" _t('btn_all_off')\" icon=\"'fa-toggle-off'\"></bb-row-spinner></button> <button class=\"btn btn-primary\" id=btn_all_on ng-click=\"updateAllSwitches('btn_all_on','urlToOn')\" ng-disabled=\"rowSpinner['btn_all_on']\"><bb-row-spinner spinner=\"rowSpinner['btn_all_on']\" label=\"_t('btn_all_on')\" icon=\"'fa-toggle-on'\"></bb-row-spinner></button></div></th><th class=\"th-slider td-action\">&nbsp;</th></tr></thead><tbody><tr ng-repeat=\"v in switches.all| orderBy:predicate:reverse track by $index\" id=\"{{ v.rowId}}\" ng-init=\"range.maxs = v.levelVal\"><td data-title=#>{{ v.id}}<span ng-show=\"v.multiChannel || v.iId > 0\">.{{v.iId}}</span></td><td data-title=\"{{ _t('device_name')}}\">{{v.name}}</td><td data-title=\"{{ _t('th_level')}}\"><strong class=\"row-level text-right\" style=\"color: {{ v.levelColor}}\">{{ v.level}}</strong></td><td data-title=\"{{ _t('datetime')}}\"><bb-date-time obj=v.dateTime updated=v.isUpdated></bb-date-time></td><td data-title=\"{{ _t('th_switchall')}}\"><switch-all-icon hasall=\"{{ v.switchAllValue}}\" ng-if=\"v.switchAllValue !== null\"></switch-all-icon>&nbsp;</td><td data-title=\"\"><button class=\"btn btn-default\" id=\"btn_update_{{ v.rowId}}\" ng-click=updateSwitch(v.urlToStore) ng-disabled=rowSpinner[v.urlToStore]><bb-row-spinner spinner=rowSpinner[v.urlToStore] label=\" _t('update')\" icon=\"'fa-circle-o text-success'\"></bb-row-spinner></button></td><td data-title=\"\" ng-switch on=v.deviceType><div ng-switch-when=multilevel><div class=btn-group style=\"min-width: 110px !important\"><label class=switcher title={{v.levelStatus}} ng-class=\"v.levelStatus === 'on' ? 'ison':'isoff'\" ng-hide=\"rowSpinner['btn_all_of'] || rowSpinner['btn_all_on']\" ng-click=\"updateSwitch(\r" +
    "\n" +
    "                               v.levelStatus === 'on' ?  v.urlToOff : v.urlToOn);\r" +
    "\n" +
    "                               v.levelStatus = (v.levelStatus === 'on' ?  'off' : 'on')\"><div class=\"switcher-slider round\"></div></label><i class=\"fa fa-spinner fa-spin fa-lg\" ng-if=\"rowSpinner['btn_all_of'] || rowSpinner['btn_all_on'] \"></i></div><button class=\"btn btn-default\" id=\"btn_full_{{ v.rowId}}\" ng-show_=!v.hasMotor ng-disabled=rowSpinner[v.urlToFull] ng-click=updateSwitch(v.urlToFull)><bb-row-spinner spinner=rowSpinner[v.urlToFull] label=v.btnFull icon=\"'fa-circle-o-notch text-success'\"></bb-row-spinner></button></div><div class=btn-group ng-switch-when=binary><label class=switcher title={{v.levelStatus}} ng-class=\"v.levelStatus === 'on' ? 'ison':'isoff'\" ng-hide=\"rowSpinner['btn_all_of'] || rowSpinner['btn_all_on']\" ng-click=\"updateSwitch(\r" +
    "\n" +
    "                               v.levelStatus === 'on' ?  v.urlToOff : v.urlToOn);\r" +
    "\n" +
    "                               v.levelStatus = (v.levelStatus === 'on' ?  'off' : 'on')\"><div class=\"switcher-slider round\"></div></label><i class=\"fa fa-spinner fa-spin fa-lg\" ng-if=\"rowSpinner['btn_all_of'] || rowSpinner['btn_all_on'] \"></i></div><div ng-switch-default>&nbsp;</div></td><td class=td-action data-title=\"\" ng-switch on=v.deviceType><div ng-switch-when=multilevel id=range_slider_{{$index}} class=app-range-slider range-slider min=0 max=v.levelMax model-max=switches.rangeSlider[$index] pin-handle=min on-handle-down=sliderOnHandleDown() on-handle-up=sliderOnHandleUp(v.urlToSlide,$index)></div><div ng-switch-default>&nbsp;</div></td></tr></tbody></table></div></div>"
  );


  $templateCache.put('app/views/controll/thermostat.html',
    "<div ng-controller=ThermostatController><div class=page-header><h1>{{_t('nav_thermostat')}}</h1></div><bb-alert alert=alert></bb-alert><div id=table_mobile ng-if=thermostats.show><table class=\"table table-striped table-condensed table-hover\"><thead><tr><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'id'\" label=\"'#'\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'name'\" label=\"_t('device_name')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'level'\" label=\"_t('switch_point_temp')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'updateTime'\" label=\"_t('datetime')\"></sort-by></th><th>&nbsp;</th><th>&nbsp;</th><th class=th-slider>&nbsp;</th></tr></thead><tbody><tr ng-repeat=\"v in thermostats.all| orderBy:predicate:reverse track by v.id\" id=\"{{ v.rowId}}\"><td data-title=#>{{ v.id}}</td><td data-title=\"{{ _t('device_name')}}\">{{v.name}}</td><td data-title=\"{{ _t('switch_point_temp')}}\" class=row-level><span class=level-val ng-show=\"v.level != null\">{{ v.level}}</span>&nbsp;<span ng-show=v.hasExt>{{ v.scale}}</span></td><td data-title=\"{{ _t('datetime')}}\" class=row-time><bb-date-time obj=v.dateTime updated=v.isUpdated ng-if=\"v.level != null\"></bb-date-time></td><td><div class=form-inline ng-show=v.isThermostatMode><select class=form-control ng-model=thermostats.mChangeMode[v.id] ng-change=updateThermostatMode(v.urlToStore,thermostats.mChangeMode[v.id])><option value=\"\">--- {{_t.('thermostat_mode_change')}} ---</option><option ng-repeat=\"m in v.modeList\" value={{m.key}} ng-selected=\"m.key == v.curThermMode\">{{m.val}}</option></select><bb-row-spinner spinner=rowSpinner[v.urlToStore]></bb-row-spinner></div></td><td><div class=btn-group ng-show=v.isThermostatSetpoint><button title=\"{{_t.('btn_minus')}}\" class=\"btn btn-default\" ng-click=\"updateThermostatTempClick(v, $index, '-')\"><i class=\"fa fa-minus text-danger\"></i></button> <button title=\"{{_t.('btn_plus')}}\" class=\"btn btn-default\" ng-click=\"updateThermostatTempClick(v, $index, '+')\"><i class=\"fa fa-plus text-success\"></i></button></div><bb-row-spinner spinner=rowSpinner[v.urlChangeTemperature]></bb-row-spinner></td><td><div ng-show=v.isThermostatSetpoint ng-init=\"dec = v.range.decimal\"><div id=range_slider_{{$index}} class=app-range-slider range-slider min=v.range.min max=v.range.max model-max=thermostats.rangeSlider[$index] pin-handle=min decimal-places=1 step=0 on-handle-down=sliderOnHandleDown() on-handle-up=sliderOnHandleUp(v,$index)></div></div></td></tr></tbody></table></div></div>"
  );


  $templateCache.put('app/views/device/associations.html',
    "<div ng-controller=AssociationsController><div class=page-header><h1>{{_t('nav_active_associations')}}</h1></div><bb-alert alert=alert></bb-alert><div id=table_mobile ng-if=devices.show><table class=\"table table-striped table-condensed table-hover\"><thead><tr><th><a href=\"\" ng-click=\"orderBy('id')\"># <span ng-show=\"predicate == 'id'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th style=\"width: 20%\"><a href=\"\" ng-click=\"orderBy('name')\">{{ _t('device_name')}} <span ng-show=\"predicate == 'name'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th>{{ _t('th_assoc_group_name')}}</th><th class=\"mobile-show td-action\" style=\"width: 20%\"><button class=\"btn btn-primary\" ng-show=!hideLifeline ng-click=\"hideLifeline = !hideLifeline;\r" +
    "\n" +
    "                                        lifeline(true)\"><i class=\"fa fa-eye\"></i> {{ _t('btn_show_lifeline')}}</button> <button class=\"btn btn-default\" ng-show=hideLifeline ng-click=\"hideLifeline = false;\r" +
    "\n" +
    "                                        lifeline(false)\"><i class=\"fa fa-eye-slash\"></i> {{ _t('btn_hide_lifeline')}}</button></th></tr></thead><tbody><tr ng-repeat=\"v in devices.all | orderBy:predicate:reverse track by $index\" id=\"{{ v.rowId}}\" ng-show=v.assocGroup><td data-title=#>{{ v.id}}</td><td data-title=\"{{ _t('device_name')}}\"><a href=#configuration/interview/{{v.id}}>{{ v.name}}</a></td><td data-title=\"{{ _t('th_assoc_group_name')}}\"><div ng-repeat=\"g in v.assocGroup\"><p>{{g.name}}<br><button class=\"btn btn-default\" ng-repeat=\"d in g.devices\">{{d}}</button></p>&nbsp;</div></td><td class=td-action><a class=\"btn btn-default\" href=#configuration/interview/{{v.id}}><i class=\"fa fa-pencil text-success\"></i> {{ _t('btn_change')}}</a>&nbsp;</td></tr></tbody></table></div></div>"
  );


  $templateCache.put('app/views/device/battery.html',
    "<div ng-controller=BatteryController><div class=page-header><h1>{{_t('nav_battery')}}</h1></div><bb-alert alert=alert></bb-alert><div id=table_mobile ng-if=batteries.show><table class=\"table table-striped table-condensed table-hover\"><thead><tr><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'id'\" label=\"'#'\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'name'\" label=\"_t('device_name')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'batteryType'\" label=\"_t('th_battery_type')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'level'\" label=\"_t('th_level')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'updateTime'\" label=\"_t('datetime')\"></sort-by></th><th class=\"mobile-show td-action\"><button class=\"btn btn-primary\" id=btn_update_all_1 ng-click=\"updateAllBatteries('all_1','urlToStore')\" ng-disabled=\"rowSpinner['all_1']\"><bb-row-spinner spinner=\"rowSpinner['all_1']\" label=\"_t('switches_update_all')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></th></tr></thead><tbody><tr ng-repeat=\"v in batteries.all | orderBy:predicate:reverse track by $index\" id=\"{{ v.rowId}}\"><td data-title=#>{{ v.id }}</td><td data-title=\"{{ _t('device_name')}}\"><a href=#configuration/interview/{{v.id}}>{{ v.name}}</a></td><td data-title=\"{{ _t('th_battery_type')}}\">{{ v.batteryCount }}<span ng-show=v.batteryCount>*</span>{{ v.batteryType }} &nbsp;</td><td data-title=\"{{ _t('th_level')}}\"><i class=\"fa fa-lg {{ v.level | getBatteryIcon }}\"></i>&nbsp;<span class=row-level>{{ v.level+v.scale }}</span></td><td data-title=\"{{ _t('datetime')}}\"><bb-date-time obj=v.dateTime updated=v.isUpdated></bb-date-time></td><td class=td-action><button class=\"btn btn-default\" id=\"btn_update_{{ v.rowId}}\" ng-click=updateBattery(v.urlToStore) ng-disabled=rowSpinner[v.urlToStore]><bb-row-spinner spinner=rowSpinner[v.urlToStore] label=\" _t('update')\" icon=\"'fa-circle-o text-success'\"></bb-row-spinner></button></td></tr></tbody></table></div></div>"
  );


  $templateCache.put('app/views/device/modal_status_interview.html',
    "<div id=interviewModal class=appmodal ng-show=modalArr.interviewModal><div class=appmodal-in><div class=appmodal-header><span class=appmodal-close ng-click=\"interviewDeviceId = null;handleModal('interviewModal', $event)\"><i class=\"fa fa-times\"></i></span><h3>{{_t('interview_results_dialog_title')}}: {{deviceInfo.name}}</h3></div><div class=\"appmodal-body modal-h-600\"><div id=table_mobile_modal_1><table class=\"table table-condensed\"><thead><tr><th>{{_t('th_command_class')}}</th><th>{{_t('th_result')}}</th></tr></thead><tbody><tr ng-repeat=\"v in interviewCommands track by $index\" id={{v.ccId}}><td data-title=\"{{_t('th_command_class')}}\">{{v.ccName}}</td><td data-title=\"{{_t('th_result')}}\"><span ng-if=v.interviewDone><i class=\"fa fa-check text-success\"></i></span> <button id=btn_force_interview_{{v.ccId}} class=\"btn btn-primary btn-sm\" ng-init=\"apiUrl = 'devices[' + deviceInfo.id + '].instances[' + v.iId + '].commandClasses[' +v.ccId+ '].Interview()'\" ng-if=!v.interviewDone ng-click=interviewForceDevice(apiUrl) ng-disabled=rowSpinner[apiUrl]><bb-row-spinner spinner=rowSpinner[apiUrl] label=\"_t('config_ui_force_interview')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button> &nbsp;</td></tr></tbody></table></div></div><div class=appmodal-footer><button type=button class=\"btn btn-default\" ng-click=\"interviewDeviceId = null;handleModal('interviewModal', $event)\"><i class=\"fa fa-times text-danger\"></i> <span class=btn-name>{{_t('btn_cancel')}}</span></button></div></div></div>"
  );


  $templateCache.put('app/views/device/status.html',
    "<div ng-controller=StatusController><div class=page-header><h1>{{_t('nav_status')}}</h1></div><bb-alert alert=alert></bb-alert><div id=table_mobile ng-if=statuses.show><table class=\"table table-striped table-condensed table-hover\"><thead><tr><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'id'\" label=\"'#'\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'name'\" label=\"_t('device_name')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'type'\" label=\"_t('th_type')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'sleeping'\" label=\"_t('th_sleeping')\"></sort-by></th><th>&nbsp;</th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'updateTime'\" label=\"_t('datetime')\"></sort-by></th><th class=print-hide>&nbsp;</th><th class=\"mobile-show td-action print-hide\"><button class=\"btn btn-primary\" id=btn_ping_all_1 ng-click=\"pingAllDevices('btn_ping_all_1','urlToStore')\" ng-disabled=\"rowSpinner['btn_ping_all_1']\"><bb-row-spinner spinner=\"rowSpinner['btn_ping_all_1']\" label=\"_t('btn_checkall')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></th></tr></thead><tbody><tr ng-repeat=\"v in statuses.all | orderBy:predicate:reverse track by $index\" id=\"{{ v.rowId}}\"><td data-title=#>{{ v.id}}</td><td data-title=\"{{ _t('device_name')}}\"><a href=#configuration/interview/{{v.id}}>{{ v.name}}</a></td><td data-title=\"{{_t('th_type')}}\"><i class=fa ng-class=v.icon title={{_t(v.type)}}></i></td><td data-title=\"{{ _t('th_sleeping')}}\" class=row-sleeping><span ng-show=v.sleeping><i class=\"fa fa-clock-o fa-lg\" title=\"{{_t('battery_operated_device_with_wakeup')}}\"></i> <span title=\"{{_t('sleeping_since_approximately')}}\" ng-show=v.sleeping.approx>{{v.sleeping.approx}}</span> <span title=\"{{_t('sleeping_since')}}\">{{v.sleeping.lastSleep}}</span> &#8594; <span title=\"{{_t('next_wakeup')}}\">{{v.approx + v.sleeping.nextWakeup}}</span> </span>&nbsp;</td><td><i class=\"fa fa-ban fa-lg text-danger\" title=\"{{_t('device_is_dead')}}\" ng-show=v.isFailed></i> <i class=\"fa fa-check fa-lg text-success\" title=\"{{_t('device_is_operating')}}\" ng-hide=v.isFailed></i></td><td data-title=\"{{ _t('last_communication')}}\"><bb-date-time obj=v.dateTime updated=v.isUpdated></bb-date-time></td><td class=\"row-interview print-hide\"><button class=\"btn btn-default\" title=\"{{_t('device_is_not_fully_interviewed')}}\" ng-hide=\"v.interviewDone || v.isController\" ng-click=\"handleModalInterview('interviewModal',$event,$index,v.id,v.name)\" title={{v.interview}}><i class=\"fa fa-search-minus fa-lg text-danger\"></i></button> &nbsp;</td><td class=\"row-ping td-action print-hide\"><button class=\"btn btn-default\" id=\"btn_ping_{{ v.rowId}}\" title=\"{{_t('pingDevice')}}\" title=\"{{ _t('pingDevice')}}\" ng-show=v.urlToStore ng-click=pingDevice(v.urlToStore) ng-disabled=rowSpinner[v.urlToStore]><bb-row-spinner spinner=rowSpinner[v.urlToStore] icon=\"'fa-circle-o text-success'\"></bb-row-spinner></button></td></tr></tbody></table></div><div ng-include=\"'app/views/device/modal_status_interview.html'\"></div></div>"
  );


  $templateCache.put('app/views/device/type.html',
    "<div ng-controller=TypeController><div class=page-header><h1>{{_t('nav_type_info')}}</h1></div><bb-alert alert=alert></bb-alert><div id=table_mobile ng-if=devices.show><table class=\"table table-striped table-condensed table-hover\"><thead><tr><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'id'\" label=\"'#'\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'name'\" label=\"_t('device_name')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'security'\" label=\"_t('th_security')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'mwief'\" label=\"_t('th_mwief')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'zWavePlus'\" label=\"_t('th_zwaveplus')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'sdk'\" label=\"_t('th_sdk')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'vendorName'\" label=\"_t('th_vendor')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'productName'\" label=\"_t('th_product')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'appVersion'\" label=\"_t('th_appversion')\"></sort-by></th><th><sort-by callback=orderBy(field) obj=orderByArr field=\"'type'\" label=\"_t('device_description_device_type')\"></sort-by></th></tr></thead><tbody><tr ng-repeat=\"v in devices.all | orderBy:predicate:reverse track by $index\" id=\"{{ v.rowId}}\"><td data-title=# ng-bind=v.id></td><td data-title=\"{{ _t('device_name')}}\"><a href=#configuration/interview/{{v.id}} ng-bind=v.name></a></td><td data-title=\"{{ _t('th_security')}}\"><i class=\"{{ v.security | securityIcon }}\"></i>&nbsp;</td><td data-title=\"{{ _t('th_mwief')}}\"><i class=\"{{v.mwief| mwiefIcon}}\"></i>&nbsp;</td><td data-title=\"{{ _t('th_zwaveplus')}}\"><i class=\"{{ v.ZWavePlusInfo | zWavePlusIcon}}\"></i>&nbsp;</td><td data-title=\"{{ _t('th_sdk')}}\"><span ng-show=v.fromSdk ng-bind=v.sdk></span> <span ng-show=!v.fromSdk>(<em ng-bind=v.sdk></em>)</span></td><td data-title=\"{{ _t('th_vendor')}}\"><span ng-bind=v.vendorName></span>&nbsp;</td><td data-title=\"{{ _t('th_product')}}\"><span ng-bind=productNames[v.id]></span>&nbsp;</td><td data-title=\"{{ _t('th_appversion')}}\"><span ng-bind=v.appVersion></span>&nbsp;</td><td data-title=\"{{ _t('device_description_device_type')}}\"><span ng-bind=v.deviceType></span>&nbsp;</td></tr></tbody></table></div></div>"
  );


  $templateCache.put('app/views/dir-pagination.html',
    "<ul class=pagination ng-if=\"1 < pages.length\"><li ng-if=boundaryLinks ng-class=\"{ disabled : pagination.current == 1 }\"><a href=\"\" ng-click=setCurrent(1)>&laquo;</a></li><li ng-if=directionLinks ng-class=\"{ disabled : pagination.current == 1 }\" class=ng-scope><a href=\"\" ng-click=\"setCurrent(pagination.current - 1)\" class=ng-binding>‹</a></li><li ng-repeat=\"pageNumber in pages track by $index\" ng-class=\"{ active : pagination.current == pageNumber, disabled : pageNumber == '...' }\"><a href=\"\" ng-click=setCurrent(pageNumber)>{{ pageNumber }}</a></li><li ng-if=directionLinks ng-class=\"{ disabled : pagination.current == pagination.last }\" class=ng-scope><a href=\"\" ng-click=\"setCurrent(pagination.current + 1)\" class=ng-binding>›</a></li><li ng-if=boundaryLinks ng-class=\"{ disabled : pagination.current == pagination.last }\"><a href=\"\" ng-click=setCurrent(pagination.last)>&raquo;</a></li></ul>"
  );


  $templateCache.put('app/views/error.html',
    "<div ng-controller=ErrorController><div class=\"alert alert-danger\"><i class=\"fa {{errorCfg.icon}}\"></i> <span ng-bind=\"_t('error_' + errorCfg.code)\"></span></div></div>"
  );


  $templateCache.put('app/views/help/help.html',
    "<div ng-controller=HelpController><div class=page-header><h1>{{ _t('nav_help')}}</h1></div><h3>Interview is not complete</h3><p>Right after inclusion Z-Way determines the functions and capabilities of the new device by sending a lot of requests to the very device. The message „Interview is not complete“ indicates that Z-Way did not receive all the information requested. There are multiple reasons for this:</p><ul><li>Z-Way is just too busy and needs more time. You should wait up to 30 seconds.</li><li>The new device is battery operated and went into deep sleep mode too fast to complete the interview. Just wake up the battery-operated device following the instructions for manual wakeup in the devices manual. Usually this completes the interview.</li><li>The device has a malfunction and can’t complete the interview. This must not happen for certified Z-wave devices but may sometimes happen for uncertified test and evaluation devices.</li></ul><p>It is also possible that some wireless interference impacted the interview process. You can go to the <a href=#configuration/interview/{{nodeId}}>“Interview” page </a>and review the process of the interview by clicking the button “Show Interview Results”. All incomplete command classes offer a button to re-do the interview for this command class only. Doing this sometimes helps to finish interview. It is also possible to re-do the whole interview process by hitting the button “Force re-Interview”.</p><p><em>Note: If the reason for an incomplete interview is a failed secure command class you must re-include the device. The secure communication must be established within 10 seconds after inclusion.</em></p><h3>Device Failed</h3><p>Z-Way can’t connect to this device anymore. This means that the device is</p><ul><li>not powered: Repower it!</li><li>moved to a position outside the wireless network coverage. Move the device back within the wireless range of the network.</li><li>damaged. Remove or Replace the device using the function in the <a href=#network/control>network management tab</a>.</li></ul></div>"
  );


  $templateCache.put('app/views/home/_backup_restore.html',
    "<div class=\"panel panel-default\"><div class=panel-heading><i class=\"fa fa-download\"></i> {{_t('nm_backup_title')}}</div><div class=panel-body><a class=\"btn btn-info\" href={{cfg.server_url}}/ZWaveAPI/Backup><i class=\"fa fa-download\"></i> {{_t('nm_backup_download')}} </a>&nbsp; <button class=\"btn btn-info\" ng-click=\"handleModal('restoreModal', $event)\"><i class=\"fa fa-repeat\"></i> {{_t('nm_restore_backup_upload')}}</button></div></div>"
  );


  $templateCache.put('app/views/home/device_reset.html',
    "<div class=\"panel panel-default\"><div class=panel-heading><i class=\"fa fa-info-circle\"></i> {{_t('device_reset_locally')}}</div><div class=panel-body><ul class=list-report><li ng-repeat=\"v in localyResetDevices\">(#{{v.id}}) {{v.name}}</li><li ng-show=\"localyResetDevices.length < 1\">{{_t('no_device_reset_locally')}}</li></ul></div></div>"
  );


  $templateCache.put('app/views/home/dongle.html',
    "<div class=\"panel panel-default\" ng-controller=DongleController ng-if=\"cfg.app_type !== 'installer'\"><div class=panel-heading><i class=\"fa fa-code-fork\"></i> {{_t('zwave_network')}}</div><div class=panel-body><div ng-if=\"homeDongle.data.length < 2\"><strong>{{cfg.dongle}}</strong></div><div ng-if=\"homeDongle.data.length > 1\"><select class=form-control ng-model=homeDongle.model.dongle ng-change=setHomeDongle()><option value=\"\" class=hidden-selectopt>--- Select one ---</option><option ng-repeat=\"v in homeDongle.data\" ng-selected=\"homeDongle.model.current == v\" value={{v}}>{{v}}</option></select></div></div></div>"
  );


  $templateCache.put('app/views/home/home_default.html',
    "<div ng-controller=HomeController><div ng-include=\"'app/views/home/ip.html'\"></div><div class=\"row home-page_\" ng-if=home.show><div class=\"col-sm-6 home-page-image\"><div ng-include=\"'app/views/home/promo_default.html'\"></div><div ng-include=\"'app/views/home/notes.html'\"></div></div><div class=\"col-sm-6 product-data-list_ pull-right_\"><div ng-include=\"'app/views/home/dongle.html'\"></div><div ng-include=\"'app/views/home/network_informations.html'\"></div><div ng-include=\"'app/views/home/network_health.html'\"></div><div ng-include=\"'app/views/home/device_reset.html'\"></div></div></div></div>"
  );


  $templateCache.put('app/views/home/home_installer.html',
    "<div ng-controller=HomeController><div ng-controller=SetPromiscuousModeController ng-init=\"setPromiscuousMode('SetPromiscuousMode(true)')\"></div><div ng-include=\"'app/views/home/ip.html'\"></div><div class=\"row home-page_\" ng-if=home.show><div class=\"col-sm-6 home-page-image\"><div ng-include=\"'app/views/home/promo_installer.html'\"></div><div ng-include=\"'app/views/home/use_cit.html'\"></div><div ng-include=\"'app/views/home/network_name.html'\"></div><div ng-include=\"'app/views/home/notes.html'\"></div></div><div class=\"col-sm-6 product-data-list_ pull-right_\"><div ng-include=\"'app/views/home/network_informations.html'\"></div><div ng-include=\"'app/views/network/control/control_different.html'\" ng-controller=ControlController></div><div ng-include=\"'app/views/network/control/control_restore.html'\" ng-controller=ControlController></div></div></div></div>"
  );


  $templateCache.put('app/views/home/ip.html',
    "<div class=\"form-inline form-home-ip\" ng-if=cfg.custom_ip><div class=\"form-home-ip-in product-data-list\"><input name=custom_ip id=custom_ip class=form-control ng-model=customIP.url value={{customIP.url}} placeholder=\"Server Name or IP, e.g. 192.168.1.1\"> <button type=button class=\"btn btn-primary\" id=btn_add_ip ng-click=setIP(customIP.url)>Connect</button><div class=\"text-danger custom-ip-message custom-ip-error\">Error in connecting {{cfg.server_url}}</div><div class=\"text-success custom-ip-message custom-ip-success\">Connected to {{cfg.server_url}}</div></div></div>"
  );


  $templateCache.put('app/views/home/network_health.html',
    "<div class=\"panel panel-default\"><div class=panel-heading><i class=\"fa fa-plus-square\"></i> {{_t('txt_net_health')}}</div><div class=panel-body><ul class=list-report><li ng-if=\"lowBatteryDevices.length > 0\"><p ng-repeat=\"v in lowBatteryDevices\"><a class=text-danger href=#device/battery>(#{{v.id}}) {{v.name}} {{_t('txt_low_battery')}} ({{v.battery_charge}}%)</a></p></li><li ng-if=\"cfg.app_type === 'default'\"><p ng-repeat=\"v in notInterviewDevices\"><a class=text-danger href=#help/{{v.id}}>(#{{v.id}}) {{v.name}} {{_t('txt_interview_not')}}</a></p></li><li ng-show=\"assocRemovedDevices.length > 1\"><p ng-repeat=\"v in assocRemovedDevices\"><a class=text-danger href=#configuration/interview/{{v.id}}>(#{{v.id}}) {{v.name}} {{_t('txt_assoc_removed')}}:</a><br><em ng-repeat=\"a in v.assoc\">{{a.name}},</em></p></li><li><p ng-repeat=\"v in failedDevices\"><a class=text-danger href=#help/{{v.id}}>(#{{v.id}}) {{v.name}} {{_t('txt_failed')}}</a></p></li><li><p ng-repeat=\"v in notConfigDevices| unique:id\"><a class=text-danger href=#configuration/interview/{{v.id}}>(#{{v.id}}) {{v.name}} {{_t('device_changed_configuration')}}</a></p></li></ul></div></div>"
  );


  $templateCache.put('app/views/home/network_informations.html',
    "<div class=\"panel panel-default\"><div class=panel-heading><i class=\"fa fa-info-circle\"></i> {{_t('txt_network_info')}} (<em>{{home.networkInformation.sum}} {{_t('txt_devices_present')}})</em></div><div class=panel-body><ul class=list-report><li><strong>{{home.networkInformation.mains}}</strong> {{_t('txt_devices_mains')}}</li><li><strong>{{home.networkInformation.battery}}</strong> {{_t('txt_devices_battery')}}</li><li><strong>{{home.networkInformation.flirs}}</strong> {{_t('txt_devices_flirs')}}</li></ul></div></div>"
  );


  $templateCache.put('app/views/home/network_name.html',
    "<div class=\"panel panel-default\" ng-controller=DataHolderController><div class=panel-heading><i class=\"fa fa-code-fork\"></i> {{_t('network_name')}}</div><div class=panel-body><div ng-hide=goNetworkName ng-click=\"goNetworkName = true\">{{dataHolder.controller.homeName}} <button type=button class=\"btn btn-default\" ng-click=\"goNetworkName = true\" ng-disabled=\"rowSpinner['spinNetworkName']\"><bb-row-spinner spinner=\"rowSpinner['spinNetworkName']\" icon=\"'fa-pencil'\"></bb-row-spinner></button></div><form name=form_network_name id=form_network_name class=form ng-show=goNetworkName ng-submit=\"storeNetworkName(form_network_name,dataHolder.controller.homeName,'spinNetworkName');goNetworkName = !goNetworkName\" novalidate><div class=input-group><input name=network_name class=form-control placeholder=\"{{_t('network_name')}}\" ng-model=dataHolder.controller.homeName value={{dataHolder.controller.homeName}}><div class=input-group-btn><button type=submit class=\"btn btn-primary\" title=\"{{_t('btn_save')}}\"><i class=\"fa fa-circle-o\"></i> <span class=btn-name>{{_t('btn_save')}}</span></button></div></div></form></div></div>"
  );


  $templateCache.put('app/views/home/notes.html',
    "<div class=\"panel panel-default\"><div class=panel-heading><i class=\"fa fa-list text-info\"></i> {{_t('txt_notes')}}</div><div class=panel-body><div ng-hide=goNotes ng-click=\"goNotes = true\"><span class=newlines ng-if=dataHolder.controller.homeNotes>{{dataHolder.controller.homeNotes|stripTags}} </span>&nbsp; <button type=button class=\"btn btn-default\" ng-click=\"goNotes = true\" ng-disabled=\"rowSpinner['spinNotes']\"><bb-row-spinner spinner=\"rowSpinner['spinNotes']\" icon=\"'fa-pencil'\"></bb-row-spinner></button></div><form name=form_notes id=form_notes class=form ng-show=goNotes ng-submit=\"storeNotes(form_notes,dataHolder.controller.homeNotes,'spinNotes');goNotes = !goNotes\" novalidate><textarea id=notes class=form-control rows=10 ng-model=dataHolder.controller.homeNotes>{{dataHolder.controller.homeNotes}}\r" +
    "\n" +
    "            </textarea><div class=text-right><button class=\"btn btn-primary\" title=\"{{_t('btn_save')}}\" ng-disabled=\"rowSpinner['spinNotes']\"><bb-row-spinner spinner=\"rowSpinner['spinNotes']\" label=\" _t('btn_save')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></div></form></div></div>"
  );


  $templateCache.put('app/views/home/promo_default.html',
    "<img class=product-logo ng-src=\"{{getCustomCfgVal('logo')}}\" alt=Logo><p></p><div class=product-description ng-bind-html=\"_t('txt_homepage_promo_default') | toTrusted\"></div>"
  );


  $templateCache.put('app/views/home/promo_installer.html',
    "<img class=product-logo ng-src=\"{{getCustomCfgVal('logo')}}\" alt=Logo><p></p><div class=product-description ng-bind-html=\"_t('txt_homepage_promo_installer') | toTrusted\"></div>"
  );


  $templateCache.put('app/views/home/use_cit.html',
    "<div class=\"panel panel-default\" ng-controller=DataHolderController><div class=panel-heading><i class=\"fa fa-info-circle\"></i> {{_t('use_cit')}}</div><div class=panel-body><a class=\"btn btn-default\" href=\"/cit/storage/data/docs/Z-Wave Alliance Certified Installer Toolkit User Guide (v0.5).pdf\" target=_blank><i class=\"fa fa-book\"></i> {{_t('user_guide')}}</a></div></div>"
  );


  $templateCache.put('app/views/indicator.html',
    "<span><a href=#network/queue target=_blank class=timestamp>{{_t('jobs')}}</a>: {{cfg.busy_indicator.result}}&nbsp;</span><span class=text-success ng-if=\"cfg.busy_indicator.result <= 0\"><i class=\"fa fa-stop\"></i> </span><span class=text-warning ng-if=\"cfg.busy_indicator.result > 0 && cfg.busy_indicator.result < 20 \"><i class=\"fa fa-stop\"></i><i class=\"fa fa-stop\"></i> </span><span class=text-danger ng-if=\"cfg.busy_indicator.result > 19\"><i class=\"fa fa-stop\"></i><i class=\"fa fa-stop\"></i><i class=\"fa fa-stop\"></i></span>"
  );


  $templateCache.put('app/views/installer/history.html',
    "<div ng-controller=ZnifferHistoryController><div class=page-header><h1>{{ _t('nav_history')}}</h1></div><table class=\"table table-condensed table-hover\"><thead><tr><th>&nbsp;</th><th>{{ _t('date')}}</th><th>{{ _t('time')}}</th><th><div class=input-group><i class=\"fa fa-filter clickable\" ng-class=\"zniffer.filter.model['src'].value !== '' ? 'text-success' : ''\" ng-click=\"expandFilter('znifferFilterSrc', $event)\"></i> {{ _t('src')}}<div class=\"app-dropdown app-dropdown-left\" ng-if=filterExpanded.znifferFilterSrc><div class=app-dropdown-content><div class=form-group><input class=form-control id=filter_src placeholder=\"{{_t('enter_value')}}. {{_t('use_charcter_delimit')}}\" ng-model=zniffer.filter.model.src.value></div><div class=\"form-group form-inline\"><input class=form-control_ type=radio name=src_show value=1 ng-model=zniffer.filter.model.src.show ng-checked=\"zniffer.filter.model.src.show == '1'\"> {{_t('show')}} <input class=form-control_ type=radio name=src_show value=0 ng-model=zniffer.filter.model.src.show ng-checked=\"zniffer.filter.model.src.show == '0'\"> {{_t('hide')}}</div></div><div class=appdropdown-footer ng-click=resetZnifferFilter()><button class=\"btn btn-default\" type=button ng-click=\"expandFilter('znifferFilterSrc', $event);resetZnifferFilter('src')\"><i class=\"fa fa-times text-danger\"></i> {{_t('reset_filter')}}</button> <button class=\"btn btn-success\" type=button ng-click=\"expandFilter('znifferFilterSrc', $event);setZnifferFilter('src')\"><i class=\"fa fa-check\"></i> {{_t('th_ok')}}</button></div></div></div></th><th><div class=input-group><i class=\"fa fa-filter clickable\" ng-class=\"zniffer.filter.model['dest'].value !== '' ? 'text-success' : ''\" ng-click=\"expandFilter('znifferFilterDest', $event)\"></i> {{ _t('dest')}}<div class=\"app-dropdown app-dropdown-left\" ng-if=filterExpanded.znifferFilterDest><div class=app-dropdown-content><div class=form-group><input class=form-control id=filter_dest placeholder=\"{{_t('enter_value')}}. {{_t('use_charcter_delimit')}}\" ng-model=zniffer.filter.model.dest.value></div><div class=\"form-group form-inline\"><input class=form-control_ type=radio name=dest_show value=1 ng-model=zniffer.filter.model.dest.show ng-checked=\"zniffer.filter.model.dest.show == '1'\"> {{_t('show')}} <input class=form-control_ type=radio name=dest_show value=0 ng-model=zniffer.filter.model.dest.show ng-checked=\"zniffer.filter.model.dest.show == '0'\"> {{_t('hide')}}</div></div><div class=appdropdown-footer ng-click=resetZnifferFilter()><button class=\"btn btn-default\" type=button ng-click=\"expandFilter('znifferFilterDest', $event);resetZnifferFilter('dest')\"><i class=\"fa fa-times text-danger\"></i> {{_t('reset_filter')}}</button> <button class=\"btn btn-success\" type=button ng-click=\"expandFilter('znifferFilterDest', $event);setZnifferFilter('dest')\"><i class=\"fa fa-check\"></i> {{_t('th_ok')}}</button></div></div></div></th><th>{{ _t('speed')}}</th><th>{{ _t('rssi')}}</th><th>{{ _t('hops')}}</th><th>{{ _t('encapsulation')}}</th><th>{{ _t('application')}}</th><th class=text-right><button class=\"btn btn-default\" type=button ng-show=!_.isEmpty(zniffer.filter.used) ng-click=resetZnifferFilterAll()><i class=\"fa fa-times text-danger\"></i> {{_t('reset_all_filters')}}</button></th></tr></thead><tbody><tr class=zniffer-row-{{v.data}} dir-paginate=\"v in zniffer.all| orderBy: '-id' | itemsPerPage: pageSize\" current-page=currentPage id=row_{{v.id}}><td><i title={{v.type}} class=\"fa fa-long-arrow-right\" ng-if=\"v.type === 'incoming'\"></i> <i title={{v.type}} class=\"fa fa-long-arrow-left\" ng-if=\"v.type === 'outgoing'\"></i></td><td>{{v.dateTime.date}}</td><td>{{v.dateTime.time}}</td><td ng-class=\"zniffer.filter.model['src'].value !== '' ? 'bcg-success' : ''\">{{v.src}}</td><td ng-class=\"zniffer.filter.model['dest'].value !== '' ? 'bcg-success' : ''\">{{v.dest}}</td><td>{{v.speed||'-'}}</td><td>{{v.rssi||'-'}}</td><td>{{v.hops||'-'}}</td><td>{{v.encaps||'-'}}</td><td title={{v.bytes}}>{{v.application}} ({{v.bytes|cutText:tue:20}})</td><td>&nbsp;</td></tr></tbody></table><div class=\"text-center mobile-padding\" ng-if_=\"collection.length > 0\"><dir-pagination-controls boundary-links=true></dir-pagination-controls></div></div>"
  );


  $templateCache.put('app/views/installer/rssi_background.html',
    "<div class=rssi-container ng-controller=ZnifferRSSIController><div id=chart1 class=rssi-entry></div><div id=chart2 class=rssi-entry></div></div>"
  );


  $templateCache.put('app/views/installer/rssi_meter.html',
    "<div ng-controller=ZnifferRSSIMeterController><div class=form-inline><div class=form-group><div class=btn-group><button class=\"btn btn-default\" title=\"Start new trace\" ng-class=\"rssi.trace === 'start' ? 'btn-success' : ''\" ng-disabled=\"rssi.trace === 'start'\" ng-click=\"setTrace('start')\"><i class=\"fa fa-play\"></i></button> <button class=\"btn btn-default\" title=\"Pause trace\" ng-class=\"rssi.trace === 'pause' ? 'btn-warning' : ''\" ng-disabled=\"rssi.trace === 'pause'\" ng-click=\"setTrace('pause')\"><i class=\"fa fa-pause\"></i></button></div></div></div><div id=gauge1 class=gauge></div><div id=gauge2 class=gauge></div></div>"
  );


  $templateCache.put('app/views/installer/zniffer.html',
    "<div ng-controller=ZnifferController><div class=page-header><h1>{{ _t('nav_zniffer')}}</h1></div><div class=form-inline><div class=form-group><div class=btn-group><button class=\"btn btn-default\" title=\"Start new trace\" ng-class=\"zniffer.trace === 'start' ? 'btn-success' : ''\" ng-disabled=\"zniffer.trace === 'start'\" ng-click=\"setTrace('start')\"><i class=\"fa fa-play\"></i></button> <button class=\"btn btn-default\" title=\"Pause trace\" ng-class=\"zniffer.trace === 'pause' ? 'btn-warning' : ''\" ng-disabled=\"zniffer.trace === 'pause'\" ng-click=\"setTrace('pause')\"><i class=\"fa fa-pause\"></i></button> <button class=\"btn btn-default\" title=\"Stop trace\" ng-class=\"zniffer.trace === 'stop' ? 'btn-danger' : ''\" ng-disabled=\"zniffer.trace === 'stop'\" ng-click=\"setTrace('stop')\"><i class=\"fa fa-stop\"></i></button></div></div></div><table class=\"table table-condensed table-hover\"><thead><tr><th>&nbsp;</th><th>{{ _t('date')}}</th><th>{{ _t('time')}}</th><th>{{ _t('src')}}</th><th>{{ _t('dest')}}</th><th>{{ _t('speed')}}</th><th>{{ _t('rssi')}}</th><th>{{ _t('hops')}}</th><th>{{ _t('encapsulation')}}</th><th>{{ _t('application')}}</th></tr></thead><tbody><tr class=zniffer-row-{{v.data}} ng-repeat=\"v in zniffer.all| orderBy: '-id' track by $index\"><td><i title={{v.type}} class=\"fa fa-long-arrow-right\" ng-if=\"v.type === 'incoming'\"></i> <i title={{v.type}} class=\"fa fa-long-arrow-left\" ng-if=\"v.type === 'outgoing'\"></i></td><td>{{v.dateTime.date}}</td><td>{{v.dateTime.time}}</td><td>{{v.src}}</td><td>{{v.dest}}</td><td>{{v.speed||'-'}}</td><td>{{v.rssi||'-'}}</td><td>{{v.hops||'-'}}</td><td>{{v.encaps||'-'}}</td><td title={{v.bytes}}>{{v.application}} ({{v.bytes|cutText:tue:20}})</td></tr></tbody></table></div>"
  );


  $templateCache.put('app/views/installer/zniffer_table.html',
    "<table class=\"table table-condensed table-hover\"><thead><tr><th>&nbsp;</th><th>{{ _t('date')}}</th><th>{{ _t('time')}}</th><th><div class=input-group><span class=clickable ng-class=\"zniffer.filter.model['src'].value !== '' ? 'text-success' : ''\" ng-click=\"expandFilter('znifferFilterSrc', $event)\"><i class=\"fa fa-filter\"></i> {{ _t('src')}}</span><div class=\"app-dropdown app-dropdown-left\" ng-if=filterExpanded.znifferFilterSrc><div class=app-dropdown-content><div class=form-group><input class=form-control id=filter_src placeholder=\"{{_t('enter_value')}}. {{_t('use_charcter_delimit')}}\" ng-model=zniffer.filter.model.src.value></div><div class=\"form-group form-inline\"><input class=form-control_ type=radio name=src_show value=1 ng-model=zniffer.filter.model.src.show ng-checked=\"zniffer.filter.model.src.show == '1'\"> {{_t('show')}} <input class=form-control_ type=radio name=src_show value=0 ng-model=zniffer.filter.model.src.show ng-checked=\"zniffer.filter.model.src.show == '0'\"> {{_t('hide')}}</div></div><div class=appdropdown-footer ng-click=resetZnifferFilter()><button class=\"btn btn-default\" type=button ng-click=\"expandFilter('znifferFilterSrc', $event);resetZnifferFilter('src')\"><i class=\"fa fa-times text-danger\"></i> {{_t('reset_filter')}}</button> <button class=\"btn btn-success\" type=button ng-click=\"expandFilter('znifferFilterSrc', $event);setZnifferFilter('src')\"><i class=\"fa fa-check\"></i> {{_t('th_ok')}}</button></div></div></div></th><th><div class=input-group><span class=clickable ng-class=\"zniffer.filter.model['dest'].value !== '' ? 'text-success' : ''\" ng-click=\"expandFilter('znifferFilterDest', $event)\"><i class=\"fa fa-filter\"></i> {{ _t('dest')}}</span><div class=\"app-dropdown app-dropdown-left\" ng-if=filterExpanded.znifferFilterDest><div class=app-dropdown-content><div class=form-group><input class=form-control id=filter_dest placeholder=\"{{_t('enter_value')}}. {{_t('use_charcter_delimit')}}\" ng-model=zniffer.filter.model.dest.value></div><div class=\"form-group form-inline\"><input class=form-control_ type=radio name=dest_show value=1 ng-model=zniffer.filter.model.dest.show ng-checked=\"zniffer.filter.model.dest.show == '1'\"> {{_t('show')}} <input class=form-control_ type=radio name=dest_show value=0 ng-model=zniffer.filter.model.dest.show ng-checked=\"zniffer.filter.model.dest.show == '0'\"> {{_t('hide')}}</div></div><div class=appdropdown-footer ng-click=resetZnifferFilter()><button class=\"btn btn-default\" type=button ng-click=\"expandFilter('znifferFilterDest', $event);resetZnifferFilter('dest')\"><i class=\"fa fa-times text-danger\"></i> {{_t('reset_filter')}}</button> <button class=\"btn btn-success\" type=button ng-click=\"expandFilter('znifferFilterDest', $event);setZnifferFilter('dest')\"><i class=\"fa fa-check\"></i> {{_t('th_ok')}}</button></div></div></div></th><th><div class=input-group><span class=clickable ng-class=\"zniffer.filter.model['data'].value !== '' ? 'text-success' : ''\" ng-click=\"expandFilter('znifferFilterData', $event)\"><i class=\"fa fa-filter\"></i> {{ _t('data')}}</span><div class=\"app-dropdown app-dropdown\" ng-if=filterExpanded.znifferFilterData><div class=app-dropdown-content><div class=form-group><select class=form-control ng-model=zniffer.filter.model.data.value><option value={{v}} ng-repeat=\"v in zniffer.filter.items.data\">{{v}}</option></select></div><div class=\"form-group form-inline\"><input class=form-control_ type=radio name=data_show value=1 ng-model=zniffer.filter.model.data.show ng-checked=\"zniffer.filter.model.data.show == '1'\"> {{_t('show')}} <input class=form-control_ type=radio name=data_show value=0 ng-model=zniffer.filter.model.data.show ng-checked=\"zniffer.filter.model.data.show == '0'\"> {{_t('hide')}}</div></div><div class=appdropdown-footer ng-click=resetZnifferFilter()><button class=\"btn btn-default\" type=button ng-click=\"expandFilter('znifferFilterData', $event);resetZnifferFilter('data')\"><i class=\"fa fa-times text-danger\"></i> {{_t('reset_filter')}}</button> <button class=\"btn btn-success\" type=button ng-click=\"expandFilter('znifferFilterData', $event);setZnifferFilter('data')\"><i class=\"fa fa-check\"></i> {{_t('th_ok')}}</button></div></div></div></th><th>{{ _t('application')}}</th><th class=text-right><button class=\"btn btn-default\" type=button ng-show=!_.isEmpty(zniffer.filter.used) ng-click=resetZnifferFilterAll()><i class=\"fa fa-times text-danger\"></i> {{_t('reset_all_filters')}}</button></th></tr></thead><tbody><tr class=zniffer-row-{{v.data}} ng-repeat=\"v in zniffer.all| orderBy: '-id' track by $index\"><td><i title={{v.type}} class=\"fa fa-long-arrow-right\" ng-if=\"v.type === 'incoming'\"></i> <i title={{v.type}} class=\"fa fa-long-arrow-left\" ng-if=\"v.type === 'outgoing'\"></i></td><td>{{v.dateTime.date}}</td><td>{{v.dateTime.time}}</td><td ng-class=\"zniffer.filter.model['src'].value !== '' ? 'bcg-success' : ''\">{{v.src}}</td><td ng-class=\"zniffer.filter.model['dest'].value !== '' ? 'bcg-success' : ''\">{{v.dest}}</td><td ng-class=\"zniffer.filter.model['data'].value !== '' ? 'bcg-success' : ''\">{{v.data}}</td><td>{{v.application}}</td><td>{{v.bytes}}</td></tr></tbody></table>"
  );


  $templateCache.put('app/views/network/_link_health.html',
    "<div ng-controller=ConfigHealthController><div class=page-header><h1>{{_t('nav_linkhealth_info')}}</h1></div><div ng-show=\"deviceId && !_.isEmpty(health.neighbours)\"><div id=table_mobile><table class=\"table table-striped table-condensed table-hover\"><thead class=cf><tr><th><a href=\"\" ng-click=\"orderBy('id')\">{{ _t('link_to_node')}} <span ng-show=\"predicate == 'id'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th><a href=\"\" ng-click=\"orderBy('name')\">{{ _t('device_name')}} <span ng-show=\"predicate == 'name'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th><a href=\"\" ng-click=\"orderBy('type')\">{{_t('device_description_device_type')}} <span ng-show=\"predicate == 'type'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th><a href=\"\" ng-click=\"orderBy('updateTime')\">{{ _t('datetime')}} <span ng-show=\"predicate == 'updateTime'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th>{{ _t('linkquality')}}</th><th class=mobile-show><button class=\"btn btn-primary\" id=btn_test_all_1 ng-click=\"testAllLinks('all_1')\" ng-disabled=\"rowSpinner['all_1']\"><bb-row-spinner icon=\"'fa-circle-o'\" spinner=\"rowSpinner['all_1']\" label=\"_t('test_all_links')\"></bb-row-spinner></button></th></tr></thead><tbody><tr ng-repeat=\"v in health.neighbours| orderBy:predicate:reverse track by $index\" id={{v.rowId}}><td data-title=#><button class=\"btn btn-default btn-{{v.type}}\">{{ v.id}}</button></td><td data-title=\"{{ _t('device_description_device_type')}}\">{{ v.name}}</td><td data-title=\"{{ _t('type')}}\"><i class=fa ng-class=v.icon title={{_t(v.type)}}></i></td><td data-title=\"{{ _t('datetime')}}\"><span class=\"row-time {{v.indicator.updateTimeColor}}\" ng-if=v.powerLevel>{{ v.indicator.updateTime | isTodayFromUnix }} </span><span class=\"row-time {{health.timing.indicator.updateTimeColor}}\" ng-if=\"!v.powerLevel && v.id === health.ctrlNodeId\">{{ health.timing.indicator.updateTime | isTodayFromUnix }}</span></td><td data-title=\"{{ _t('linkquality')}}\"><i class=\"fa fa-circle fa-2x clickable {{v.indicator.color}}\" ng-if=v.powerLevel ng-click=\"handlePowerLevelModal('healthPowerLevelModal', $event, v)\"></i> <i class=\"fa fa-circle fa-2x clickable {{health.timing.indicator.color}}\" ng-if=\"!v.powerLevel && v.id === health.ctrlNodeId\" ng-click=\"handleTimingModal('healthTimingModal', $event, v)\"></i></td><td data-title=\"\" ng-switch on=v.deviceType><button class=\"btn btn-default\" id=\"btn_test_{{ v.id}}\" ng-if=health.device.hasPowerLevel ng-click=runZwaveCmd(v.cmdTestNode) ng-disabled=rowSpinner[v.cmdTestNode]><bb-row-spinner icon=\"'fa-circle-o text-success'\" spinner=rowSpinner[v.cmdTestNode] label=\"_t('test_link')\"></bb-row-spinner></button> <button class=\"btn btn-default\" id=\"btn_nop_{{ v.id}}\" ng-if=\"!health.device.hasPowerLevel && v.type === 'static'\" ng-click=runZwaveNopCmd(v.cmdNop) ng-disabled=rowSpinner[v.cmdNop]><bb-row-spinner icon=\"'fa-circle-o text-success'\" spinner=rowSpinner[v.cmdNop] label=\"_t('nop')\"></bb-row-spinner></button></td></tr></tbody></table></div><div class=\"legend-entry legend-inline\"><div class=legend-row><button class=\"btn btn-default btn-sm btn-static\">&nbsp;</button> {{_t('static')}}</div><div class=legend-row><button class=\"btn btn-default btn-sm btn-portable\">&nbsp;</button> {{_t('portable')}}</div><div class=legend-row><button class=\"btn btn-default btn-sm btn-battery\">&nbsp;</button> {{_t('battery')}}</div><div class=legend-row><button class=\"btn btn-default btn-sm btn-flirs\">&nbsp;</button> {{_t('flirs')}}</div><div class=legend-row><button class=\"btn btn-default btn-sm btn-mains\">&nbsp;</button> {{_t('mains')}}</div><div class=legend-row><button class=\"btn btn-default btn-sm btn-unknown\">&nbsp;</button> {{_t('unknown')}}</div></div></div><div id=healthPowerLevelModal class=appmodal ng-if=modalArr.healthPowerLevelModal><div class=appmodal-in><div class=appmodal-header><span class=appmodal-close ng-click=\"handlePowerLevelModal('healthPowerLevelModal', $event)\"><i class=\"fa fa-times\"></i></span><h3>{{health.device.find.name|cutText:true:30}}</h3></div><div class=appmodal-body ng-bind-html=\"health.device.commandClass | toTrusted\"></div><div class=appmodal-footer><button type=button class=\"btn btn-default\" ng-click=\"handlePowerLevelModal('healthPowerLevelModal', $event)\"><i class=\"fa fa-times text-danger\"></i> <span class=btn-name>{{_t('btn_close')}}</span></button></div></div></div><div id=healthTimingModal class=appmodal ng-if=modalArr.healthTimingModal><div class=appmodal-in><div class=appmodal-header><span class=appmodal-close ng-click=\"handleTimingModal('healthTimingModal', $event)\"><i class=\"fa fa-times\"></i></span><h3>{{health.device.find.name|cutText:true:30}}</h3></div><div class=appmodal-body><p><strong>{{_t('th_total')}} (pkts)</strong>: {{health.timing.find.totalPackets}}</p><p><strong>{{_t('th_ok')}}</strong>: {{health.timing.find.okPackets}}%</p><p><strong>{{_t('th_lastpackets')}}</strong>: <span ng-bind-html=\"health.timing.find.lastPackets | toTrusted\"></span></p><p><strong>{{_t('timing_color_description')}}:</strong><br><i class=\"fa fa-square fa-lg\" style=\"color: green\"></i> {{_t('timing_green')}}<br><i class=\"fa fa-square fa-lg\" style=\"color: black\"></i> {{_t('timing_black')}}<br><i class=\"fa fa-square fa-lg\" style=\"color: red\"></i> {{_t('timing_red')}}.<br></p></div><div class=appmodal-footer><button type=button class=\"btn btn-default\" ng-click=\"handleTimingModal('healthTimingModal', $event)\"><i class=\"fa fa-times text-danger\"></i> <span class=btn-name>{{_t('btn_close')}}</span></button></div></div></div></div>"
  );


  $templateCache.put('app/views/network/_linkstatus.html',
    "<div ng-controller=LinkStatusController><div class=page-header><h1>{{_t('nav_linkhealth_info')}}</h1></div><bb-alert alert=alert></bb-alert><div id=table_mobile ng-if=linkStatus.show><table id=RoutingTable class=\"table table-striped table-condensed table-hover\"><thead class=cf><tr><th><a href=\"\" ng-click=\"orderBy('id')\"># <span ng-show=\"predicate == 'id'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th><a href=\"\" ng-click=\"orderBy('name')\">{{ _t('device_name')}} <span ng-show=\"predicate == 'name'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th><a href=\"\" ng-click=\"orderBy('type')\">{{_t('device_description_device_type')}} <span ng-show=\"predicate == 'type'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th><a href=\"\" ng-click=\"orderBy('updateTime')\">{{ _t('datetime')}} <span ng-show=\"predicate == 'updateTime'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th ng-repeat=\"pl in linkStatus.pwLvl\" style=text-align:center>{{pl}}</th><th class=mobile-show>&nbsp;</th></tr></thead><tbody><tr ng-repeat=\"v in linkStatus.all| orderBy:predicate:reverse track by $index\" id={{v.rowId}}><td data-title=#>{{ v.id}}</td><td data-title=\"{{ _t('device_description_device_type')}}\">{{ v.name}}</td><td data-title=\"{{ _t('type')}}\" title={{v.type}}><i class=fa ng-class=v.icon title={{_t(v.type)}}></i></td><td data-title=\"{{ _t('datetime')}}\"><bb-date-time ng-if=v.dateTime obj=v.dateTime updated=v.isUpdated></bb-date-time><span ng-if=!v.dateTime>-</span></td><td class=rtCell ng-repeat=\"n in linkStatus.pwLvlData[v.id] track by $index\"><div class=\"rtDiv {{n.color}}\" title={{n}} ng-class=\"{\r" +
    "\n" +
    "                             'rtGray': n == 0,\r" +
    "\n" +
    "                              'rtRed': n > 0 && n < 50,\r" +
    "\n" +
    "                              'rtOrange': n > 50 && n < 100,\r" +
    "\n" +
    "                              'rtGreen': n > 99\r" +
    "\n" +
    "                             }\"><i class=\"fa fa-check\" ng-if=\"linkStatus.pwLvlTested.indexOf(v.id) > -1\"></i>&nbsp;</div></td><td class=td-action data-title=\"\"><button class=\"btn btn-primary\" id=\"btn_test_{{ v.id}}\" ng-click=runZwaveTestNode(v) ng-disabled=rowSpinner[v.paramsTestNode]><bb-row-spinner icon=\"'fa-circle-o'\" spinner=rowSpinner[v.paramsTestNode] label=\"_t('test_link')\"></bb-row-spinner></button></td></tr></tbody></table></div><div id=RoutingComments><i class=\"fa fa-square fa-lg gray\"></i> {{_t('Unavailable')}}<br><i class=\"fa fa-square fa-lg green\"></i> {{_t('dBm 100%')}}<br><i class=\"fa fa-square fa-lg orange\"></i> {{_t('dBm from 50% to 99%')}}<br><i class=\"fa fa-square fa-lg red\"></i> {{_t('dBm from 1% to 50%')}}<br></div><div ng-include=\"'app/views/network/linkstatus_modal.html'\"></div></div>"
  );


  $templateCache.put('app/views/network/_linkstatus_modal.html',
    "<div id=linkStatusModal class=appmodal ng-if=modalArr.linkStatusModal ng-controller=BackupRestoreController><div class=appmodal-in><div class=appmodal-header><span class=appmodal-close ng-click=\"handleModal('linkStatusModal', $event)\"><i class=\"fa fa-times\"></i></span><h3>{{testNode.name|cutText:true:25}}</h3></div><div class=appmodal-body><div class=\"progress modal-progress\" ng-repeat=\"v in testNode.data track by $index\"><div class=progress-bar title={{v}}% style=\"width: {{v}}%\" ng-class=\"{'progress-bar-danger': v <= 30 ,\r" +
    "\n" +
    "                     'progress-bar-warning': v > 30 && v <= 50,\r" +
    "\n" +
    "                     'progress-bar-info': v > 50 && v <= 70,\r" +
    "\n" +
    "                    'progress-bar-success': v == 100\r" +
    "\n" +
    "                    }\"><span>{{v}}%</span></div></div></div><div class=appmodal-footer><button type=button class=\"btn btn-default\" ng-click=\"handleModal('linkStatusModal', $event)\"><i class=\"fa fa-times text-danger\"></i> <span class=btn-name>{{_t('btn_cancel')}}</span></button></div></div></div>"
  );


  $templateCache.put('app/views/network/_neighbors_info.html',
    "<div class=table-responsive ng-if=routings.show><table class=\"table table-striped table-condensed table-hover table-neighbors\"><thead><tr><th>#</th><th>{{ _t('device_name')}}</th><th>{{ _t('nav_type_info')}}</th><th>{{ _t('rt_header_update_time')}}</th><th class=\"mobile-show td-action print-hide\"><button class=\"btn btn-primary\" id=btn_update_all_1 ng-click=\"updateAllRoutess('all_1','urlToStore')\" ng-disabled=\"rowSpinner['all_1']\"><bb-row-spinner spinner=\"rowSpinner['all_1']\" label=\"_t('switches_update_all')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></th><th><span class=rt-cell ng-repeat=\"v in routings.all track by $index\">{{v.id}}</span></th></tr></thead><tbody><tr ng-repeat=\"v in routings.all track by $index\"><td>{{v.id}}</td><td>{{v.name}}</td><td><i class=fa ng-class=v.icon title={{_t(v.type)}}></i></td><td class=\"row-time is-updated-{{v.isUpdated}}\">{{ v.updateTime | isTodayFromUnix }} &nbsp;</td><td class=\"td-action print-hide\"><button class=\"btn btn-default\" id=\"btn_update_{{ v.rowId}}\" ng-click=updateRoute(v.urlToStore) ng-disabled=rowSpinner[v.urlToStore]><bb-row-spinner spinner=rowSpinner[v.urlToStore] label=\" _t('update')\" icon=\"'fa-circle-o text-success'\"></bb-row-spinner></button>&nbsp;</td><td ng-bind-html=htmlNeighbors[v.id]|toTrusted></td></tr></tbody></table></div>"
  );


  $templateCache.put('app/views/network/_neighbors_routing.html',
    "<div class=overflow ng-if=routings.show><table class=table-neighbors><thead><tr><td>&nbsp;</td><td><span class=rt-cell ng-repeat=\"v in routings.all track by $index\">{{v.id}}</span></td></tr></thead><tbody><tr ng-repeat=\"v in routings.all track by $index\"><td class=rt-node-id><div class=\"tool-tip right rt-cell rt-cell-th\">{{v.id}}<div class=tool-tip-entry><p>{{v.name}}</p><p><strong>Type info:</strong> <i class=fa ng-class=v.icon title={{_t(v.type)}}></i></p><p><strong>Updated:</strong> {{ v.updateTime | isTodayFromUnix }}</p><div><button class=\"btn btn-primary\" id=\"btn_update_{{ v.rowId}}\" ng-click=updateRoute(v.urlToStore) ng-disabled=rowSpinner[v.urlToStore]><bb-row-spinner spinner=rowSpinner[v.urlToStore] label=\" _t('update')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></div></div></div></td><td ng-bind-html=htmlNeighbors[v.id]|toTrusted></td></tr></tbody></table></div>"
  );


  $templateCache.put('app/views/network/_queue.html',
    "<div ng-controller=QueueController><div class=page-header><h1>{{_t('nm_inspect_queue_title')}}</h1></div><div><strong>{{_t('inspect_queue_legend_title')}}</strong><p ng-bind-html=\"_t('inspect_queue_legend_help') | toTrusted\"></p></div><div class=table-responsive><table id=inspect_queue_table class=table-striped><thead><tr><th>n</th><th>U</th><th>W</th><th>S</th><th>E</th><th>D</th><th>Ack</th><th>Resp</th><th>Cbk</th><th>{{_t('th_timeout')}}</th><th>{{_t('th_nodeid')}}</th><th>{{_t('th_description')}}</th><th>{{_t('th_progress')}}</th><th>{{_t('th_buffer')}}</th></tr></thead><tbody id=inspect_queue_table_body></tbody></table><div><div id=inspect_queue_len></div><br></div></div><script>function closeWindow() {\r" +
    "\n" +
    "                    window.open('', '_parent', '');\r" +
    "\n" +
    "                    window.close();\r" +
    "\n" +
    "                }</script><a class=\"btn btn-primary\" href=javascript:closeWindow();>{{_t('btn_close')}}</a></div>"
  );


  $templateCache.put('app/views/network/control/control_controller_maintance.html',
    "<div class=\"panel panel-default\" ng-controller=ZwaveChipRebootResetController><div class=panel-heading><i class=\"fa fa-gear\"></i> {{_t('nm_ctrl_maintance')}}</div><div class=panel-body><div class=\"cfg-block form-inline\"><p class=input-help>{{_t('nm_chip_reboot_war')}}</p><button class=\"btn btn-primary\" id=btn_chip_reboot ng-disabled=\"[1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"serialAPISoftReset('SerialAPISoftReset()')\" ng-disabled=\"rowSpinner['SerialAPISoftReset()']\"><bb-row-spinner spinner=\"rowSpinner['SerialAPISoftReset()']\" label=\"_t('nm_soft_reset_controller')\" icon=\"'fa-refresh'\"></bb-row-spinner></button></div><div class=\"cfg-block form-inline\"><p class=input-help ng-hide=\"cfg.app_type === 'installer'\">{{_t('nm_chip_reset_war')}}</p><p class=input-help ng-if=\"cfg.app_type === 'installer'\">{{_t('nm_chip_reset_war_ima')}}</p><button class=\"btn btn-danger\" ng-disabled=\"[1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"handleModal('rebootResetModal', $event)\"><i class=\"fa fa-exclamation-triangle\"></i> {{_t('nm_reset_controller')}}</button></div></div></div><div id=rebootResetModal class=appmodal ng-if=modalArr.rebootResetModal ng-controller=ZwaveChipRebootResetController><div class=appmodal-in><div class=appmodal-header><span class=appmodal-close ng-click=\"handleModal('rebootResetModal', $event)\"><i class=\"fa fa-times\"></i></span><h3>{{_t('nm_reset_controller')}}</h3></div><div class=appmodal-body><div class=\"alert alert-warning\"><p>{{_t('nm_controller_reset_war')}}</p><p></p><p><input type=checkbox name=reset_confirm id=reset_confirm value=1 ng-click=\"goSetDefault = !goSetDefault\"> {{_t('yes')}}</p><p></p></div></div><div class=appmodal-footer><button type=button class=\"btn btn-default\" ng-click=\"handleModal('rebootResetModal', $event)\"><i class=\"fa fa-times text-danger\"></i> <span class=btn-name>{{_t('btn_cancel')}}</span></button> <button type=button class=\"btn btn-danger\" id=btn_reset_controller ng-show=goSetDefault ng-click=\"setDefault('controller.SetDefault()');handleModal('rebootResetModal', $event)\" ng-disabled=\"rowSpinner['controller.SetDefault()']\"><bb-row-spinner spinner=\"rowSpinner['controller.SetDefault()']\" label=\"_t('nm_reset_controller')\" icon=\"'fa-exclamation-triangle'\"></bb-row-spinner></button></div></div></div>"
  );


  $templateCache.put('app/views/network/control/control_default.html',
    "<div ng-controller=ControlController><div class=page-header><h1>{{_t('nav_control')}}</h1></div><div class=row id=row_controll><div class=\"col-md-6 col-lg-6\"><div ng-include=\"'app/views/network/control/control_management.html'\"></div><div ng-include=\"'app/views/network/control/control_different.html'\"></div><div ng-include=\"'app/views/network/control/control_restore.html'\"></div><div ng-include=\"'app/views/network/control/control_controller_maintance.html'\"></div><div ng-include=\"'app/views/network/control/control_frequency.html'\"></div></div><div class=\"col-md-6 col-lg-6\"><div ng-include=\"'app/views/network/control/control_network_maintance.html'\"></div><div ng-include=\"'app/views/network/control/control_sucsic.html'\"></div></div></div></div>"
  );


  $templateCache.put('app/views/network/control/control_different.html',
    "<div class=\"panel panel-default\" ng-controller=IncludeDifferentNetworkController><div class=panel-heading><i class=\"fa fa-sitemap\"></i> {{_t('nm_inc_into_nw')}}</div><div class=panel-body><div ng-if=\"controlDh.controller.isRealPrimary && (!controlDh.controller.hasDevices)\"><p class=input-help>{{_t('device_not_included_info')}}</p><bb-alert alert=controlDh.network.alert></bb-alert><button class=\"btn btn-primary\" id=btn_learn_start ng-disabled=\"rowSpinner['controller.SetLearnMode(1)'] || [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1 || (SUCNodeId == controllerNodeId && isSIS && hasDevices)\" ng-show=\"[9].indexOf(controlDh.controller.controllerState) == -1\" ng-click=\"includeToNetwork('controller.SetLearnMode(1)','successNetworkIncludeModal',$event)\"><i class=\"fa fa-play-circle\"></i> {{_t('include_into_network')}}</button> <button class=\"btn btn-danger\" id=btn_learn_stop ng-show=\"[9].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"includeToNetwork('controller.SetLearnMode(0)')\"><i class=\"fa fa-stop-circle\"></i> {{_t('include_into_network_stop')}}</button></div><div ng-if=\"controlDh.controller.isRealPrimary && (controlDh.controller.hasDevices)\"><p class=input-help>{{_t('device_included_info')}}</p><button class=\"btn btn-primary\" id=btn_learn_start_2 disabled>{{_t('leave_network')}}</button></div><div ng-if=!controlDh.controller.isRealPrimary><p class=input-help>{{_t('device_included_info')}}</p><div ng-hide=\"controlDh.network.modal && [0].indexOf(controlDh.controller.controllerState) > -1\"><bb-alert alert=controlDh.network.alert></bb-alert></div><div><bb-alert alert=controlDh.alert></bb-alert></div><button class=\"btn btn-info\" id=btn_learn_start ng-disabled=\"[1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-hide=\"(controlDh.network.inclusionProcess && !controlDh.network.modal) || [9].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"excludeFromNetwork('controller.SetLearnMode(1)',_t('before_leaving_network'))\"><i class=\"fa fa-play-circle\"></i> {{_t('leave_network')}}</button> <button class=\"btn btn-danger\" id=btn_learn_stop ng-show=\"[9].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"includeToNetwork('controller.SetLearnMode(0)')\"><i class=\"fa fa-stop-circle\"></i> {{_t('leave_network_stop')}}</button></div></div><div id=successNetworkIncludeModal class=appmodal ng-if=\"controlDh.network.modal && !controlDh.controller.isRealPrimary\"><div class=appmodal-in><div class=appmodal-header><span class=appmodal-close ng-click=\"closeNetworkModal('successNetworkIncludeModal', $event)\"><i class=\"fa fa-times\"></i></span><h3>{{_t('include_into_network')}}</h3></div><div class=appmodal-body><div class=\"alert alert-success\"><i class=\"fa fa-smile-o\"></i> {{_t('success_controller_include')}}</div><div class=cfg-block><button class=\"btn btn-primary\" ng-click=\"handleModal('restoreModal', $event);handleModal('successNetworkIncludeModal', $event)\"><i class=\"fa fa-repeat\"></i> {{_t('make_restore')}}</button></div><div class=cfg-block ng-controller=RequestNifAllController><button class=\"btn btn-primary\" id=btn_request_nif ng-click=\"requestNifAll('requestNifAll');handleModal('successNetworkIncludeModal', $event)\" ng-disabled=\"rowSpinner['requestNifAll']\"><bb-row-spinner spinner=\"rowSpinner['requestNifAll']\" label=\"_t('detect_all_nodes')\" icon=\"'fa-search-plus'\"></bb-row-spinner></button></div><div class=cfg-block><button type=button class=\"btn btn-primary\" ng-click=\"closeNetworkModal('successNetworkIncludeModal', $event)\"><i class=\"fa fa-arrow-right\"></i> <span class=btn-name>{{_t('just_proceed')}}</span></button></div></div></div></div></div><div ng-include=\"'app/views/network/control/control_restore_modal.html'\"></div>"
  );


  $templateCache.put('app/views/network/control/control_frequency.html',
    "<div class=\"panel panel-default\" ng-if=controlDh.controller.frequency><div class=panel-heading><i class=\"fa fa-map-marker\"></i> {{_t('nm_frequency_title')}}</div><div class=panel-body ng-controller=ChangeFrequencyController><div>{{_t('current_frequency')}}: <strong>{{controlDh.controller.frequency}}</strong></div><div class=text-alert-list><i class=\"fa fa-info-circle text-info\"></i> {{_t('frequency_info')}}</div><div class=\"cfg-block form-inline block-frequency\"><button class=btn id=btn_nm_freq_change_eu ng-class=\"controlDh.controller.frequency === cfg.frequency[0] ? 'btn-default' : 'btn-primary'\" ng-disabled=\"rowSpinner['ZMEFreqChange(0)'] || [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"zmeFreqChange('ZMEFreqChange(0)')\"><bb-row-spinner spinner=\"rowSpinner['ZMEFreqChange(0)']\"></bb-row-spinner>EU</button> <button class=btn id=btn_nm_freq_change_ru ng-class=\"controlDh.controller.frequency === cfg.frequency[1] ? 'btn-default' : 'btn-primary'\" ng-disabled=\"rowSpinner['ZMEFreqChange(1)'] || [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"zmeFreqChange('ZMEFreqChange(1)')\"><bb-row-spinner spinner=\"rowSpinner['ZMEFreqChange(1)']\"></bb-row-spinner>RU</button> <button class=btn id=btn_nm_freq_change_in ng-class=\"controlDh.controller.frequency === cfg.frequency[2] ? 'btn-default' : 'btn-primary'\" ng-disabled=\"rowSpinner['ZMEFreqChange(2)'] || [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"zmeFreqChange('ZMEFreqChange(2)')\"><bb-row-spinner spinner=\"rowSpinner['ZMEFreqChange(2)']\"></bb-row-spinner>IN</button> <button class=btn id=btn_nm_freq_change_cn ng-class=\"controlDh.controller.frequency === cfg.frequency[6] ? 'btn-default' : 'btn-primary'\" ng-disabled=\"rowSpinner['ZMEFreqChange(6)'] || [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"zmeFreqChange('ZMEFreqChange(6)')\"><bb-row-spinner spinner=\"rowSpinner['ZMEFreqChange(6)']\"></bb-row-spinner>CN</button> <button class=btn id=btn_nm_freq_change_my ng-class=\"controlDh.controller.frequency === cfg.frequency[10] ? 'btn-default' : 'btn-primary'\" ng-disabled=\"rowSpinner['ZMEFreqChange(10)'] || [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"zmeFreqChange('ZMEFreqChange(10)')\"><bb-row-spinner spinner=\"rowSpinner['ZMEFreqChange(10)']\"></bb-row-spinner>MY</button></div><div class=\"cfg-block form-inline\"><button class=btn id=btn_nm_freq_change_anz ng-class=\"controlDh.controller.frequency === cfg.frequency[4] ? 'btn-default' : 'btn-primary'\" ng-disabled=\"rowSpinner['ZMEFreqChange(4)'] || [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"zmeFreqChange('ZMEFreqChange(4)')\"><bb-row-spinner spinner=\"rowSpinner['ZMEFreqChange(4)']\"></bb-row-spinner>ANZ/BR</button> <button class=btn id=btn_nm_freq_change_hk ng-class=\"controlDh.controller.frequency === cfg.frequency[5] ? 'btn-default' : 'btn-primary'\" ng-disabled=\"rowSpinner['ZMEFreqChange(5)'] || [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"zmeFreqChange('ZMEFreqChange(5)')\"><bb-row-spinner spinner=\"rowSpinner['ZMEFreqChange(5)']\"></bb-row-spinner>HK</button> <button class=btn id=btn_nm_freq_change_kr ng-class=\"controlDh.controller.frequency === cfg.frequency[8] ? 'btn-default' : 'btn-primary'\" ng-disabled=\"rowSpinner['ZMEFreqChange(8)'] || [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"zmeFreqChange('ZMEFreqChange(8)')\"><bb-row-spinner spinner=\"rowSpinner['ZMEFreqChange(8)']\"></bb-row-spinner>KR</button> <button class=btn id=btn_nm_freq_change_jp ng-class=\"controlDh.controller.frequency === cfg.frequency[7] ? 'btn-default' : 'btn-primary'\" ng-disabled=\"rowSpinner['ZMEFreqChange(7)'] || [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"zmeFreqChange('ZMEFreqChange(7)')\"><bb-row-spinner spinner=\"rowSpinner['ZMEFreqChange(7)']\"></bb-row-spinner>JP</button></div><div class=\"cfg-block form-inline\"><button class=btn id=btn_nm_freq_change_us ng-class=\"controlDh.controller.frequency === cfg.frequency[3] ? 'btn-default' : 'btn-primary'\" ng-disabled=\"rowSpinner['ZMEFreqChange(3)'] || [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"zmeFreqChange('ZMEFreqChange(3)')\"><bb-row-spinner spinner=\"rowSpinner['ZMEFreqChange(3)']\"></bb-row-spinner>US</button> <button class=btn id=btn_nm_freq_change_il ng-class=\"controlDh.controller.frequency === cfg.frequency[9] ? 'btn-default' : 'btn-primary'\" ng-disabled=\"rowSpinner['ZMEFreqChange(9)'] || [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"zmeFreqChange('ZMEFreqChange(9)')\"><bb-row-spinner spinner=\"rowSpinner['ZMEFreqChange(9)']\"></bb-row-spinner>IL</button></div></div></div>"
  );


  $templateCache.put('app/views/network/control/control_installer.html',
    "<div ng-controller=ControlController><div class=page-header><h1>{{_t('nav_control')}}</h1></div><div class=row id=row_controll><div class=\"col-md-6 col-lg-6\"><div ng-include=\"'app/views/network/control/control_management.html'\"></div><div ng-include=\"'app/views/network/control/control_different.html'\"></div><div ng-include=\"'app/views/network/control/control_controller_maintance.html'\"></div><div ng-include=\"'app/views/network/control/control_promiscuous.html'\" ng-if=controlDh.controller.SetPromiscuousMode></div><div ng-include=\"'app/views/network/control/control_frequency.html'\"></div></div><div class=\"col-md-6 col-lg-6\"><div ng-include=\"'app/views/network/control/control_link_controller.html'\"></div><div ng-include=\"'app/views/network/control/control_network_maintance.html'\"></div><div ng-include=\"'app/views/network/control/control_sucsic.html'\"></div></div></div></div>"
  );


  $templateCache.put('app/views/network/control/control_link_controller.html',
    "<div class=\"panel panel-default\"><div class=panel-heading><a href=#network/controller><i class=\"fa fa-info-circle\"></i> {{_t('nav_controller_info')}}</a></div></div>"
  );


  $templateCache.put('app/views/network/control/control_management.html',
    "<div class=\"panel panel-default panel-highlighted\"><div class=panel-heading><i class=\"fa fa-cubes\"></i> {{_t('nm_device_management')}}</div><div class=panel-body><div class=cfg-block ng-controller=SetSecureInclusionController>{{_t('nm_force_unsecure')}}<div class=btn-group><button type=button class=\"btn btn-primary\" id=btn_force_secure_lock ng-class=\"controlDh.controller.secureInclusion ? 'active' : ''\" ng-click=\"setSecureInclusion('controller.data.secureInclusion=true')\" ng-disabled=\"[1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1 || rowSpinner['controller.data.secureInclusion=true']\"><bb-row-spinner spinner=\"rowSpinner['controller.data.secureInclusion=true']\" label=\"_t('btn_secure')\" icon=\"'fa-lock'\"></bb-row-spinner></button> <button type=button class=\"btn btn-primary\" id=btn_force_unsecure_lock ng-class=\"!controlDh.controller.secureInclusion ? 'active' : ''\" ng-click=\"setSecureInclusion('controller.data.secureInclusion=false')\" ng-disabled=\"[1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1 || rowSpinner['controller.data.secureInclusion=false']\"><bb-row-spinner spinner=\"rowSpinner['controller.data.secureInclusion=false']\" label=\"_t('btn_unsecure')\" icon=\"'fa-unlock'\"></bb-row-spinner></button></div></div><div class=cfg-block ng-controller=IncludeExcludeDeviceController><p class=input-help ng-show=\"controlDh.controller.isSIS || controlDh.controller.isPrimary\">{{_t('nm_learn_mode_you_are_primary_no_sis')}}</p><p class=input-help ng-show=\"!controlDh.controller.isSIS && !controlDh.controller.isPrimary\">{{_t('nm_learn_mode_you_are_secondary_can_not_add')}}</p><div ng-hide=\"controlDh.inclusion.lastIncludedDevice.message || controlDh.inclusion.lastExcludedDevice.message\"><bb-alert alert=controlDh.inclusion.alertPrimary></bb-alert><bb-alert alert=controlDh.inclusion.alert></bb-alert></div><bb-alert alert=controlDh.inclusion.lastIncludedDevice></bb-alert><bb-alert alert=controlDh.inclusion.lastExcludedDevice></bb-alert><button class=\"btn btn-primary\" id=btn_nm_include_start title=\"{{_t('nm_include_start_tooltip')}}\" ng-disabled=\"[5, 6, 7, 20].indexOf(controlDh.controller.controllerState) > -1\" ng-show=\"[1, 2, 3, 4].indexOf(controlDh.controller.controllerState) == -1\" ng-click=\"addNodeToNetwork('controller.AddNodeToNetwork(1)')\"><i class=\"fa fa-play-circle\"></i> {{_t('nm_include_start')}}</button> <button class=\"btn btn-danger\" id=btn_nm_include_stop ng-show=\"[1, 2, 3, 4].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"addNodeToNetwork('controller.AddNodeToNetwork(0)')\"><i class=\"fa fa-stop-circle\"></i> {{_t('nm_include_stop')}}</button> <button class=\"btn btn-info\" id=nm_exclude_start title=\"{{_t('nm_exclude_start_tooltip')}}\" ng-disabled=\"[1, 2, 3, 4, 20].indexOf(controlDh.controller.controllerState) > -1\" ng-show=\"[5, 6, 7].indexOf(controlDh.controller.controllerState) == -1\" ng-click=\"removeNodeToNetwork('controller.RemoveNodeFromNetwork(1)')\"><i class=\"fa fa-play-circle\"></i> {{_t('nm_exclude_start')}}</button> <button class=\"btn btn-danger\" id=nm_exclude_stop ng-show=\"[5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"removeNodeToNetwork('controller.RemoveNodeFromNetwork(0)')\"><i class=\"fa fa-stop-circle\"></i> {{_t('nm_exclude_stop')}}</button></div></div></div>"
  );


  $templateCache.put('app/views/network/control/control_network_maintance.html',
    "<div class=\"panel panel-default\"><div class=panel-heading><i class=\"fa fa-sitemap\"></i> {{_t('nm_net_maintance')}}</div><div class=panel-body><div><div class=\"cfg-block form-inline\"><p class=input-help>{{_t('nm_remove_node_war')}}</p><select name=remove_failed_node id=remove_failed_node class=form-control ng-disabled=\"[1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-hide=_.isEmpty(controlDh.nodes.failedNodes) ng-model=controlDh.input.failedNodes><option ng-hide=\"controlDh.removed.failedNodes.indexOf(v) > -1\" ng-repeat=\"v in controlDh.nodes.failedNodes track by $index\" value={{v}}>{{v}}</option></select>&nbsp; <button class=\"btn btn-primary\" id=btn_remove_failed_mode ng-click=\"handleModal('failedNodeModal', $event)\" ng-disabled=!controlDh.input.failedNodes><bb-row-spinner spinner=\"rowSpinner['devices[' + controlDh.input.failedNodes + '].RemoveFailedNode()']\" label=\"_t('nm_remove_failed')\" icon=\"'fa-minus-circle'\"></bb-row-spinner></button></div><div class=\"cfg-block form-inline\" ng-controller=ReplaceFailedNodeController><p class=input-help>{{_t('nm_replace_node_war')}}</p><div class=\"alert nm-response alert-danger\" ng-show=\"[17, 18].indexOf(controllerState) != -1\">{{_t('nm_controller_state_' + controllerState)}}</div><select name=replace_failed_node id=replace_failed_node class=form-control ng-disabled=\"[1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-hide=_.isEmpty(controlDh.nodes.failedNodes) ng-model=controlDh.input.replaceNodes><option ng-hide=\"controlDh.removed.replaceNodes.indexOf(v) > -1\" ng-repeat=\"v in controlDh.nodes.failedNodes track by $index\" value={{v}}>{{v}}</option></select>&nbsp; <button class=\"btn btn-primary\" id=btn_replace_failed_node ng-click=\"replaceFailedNode('ReplaceFailedNode(' + controlDh.input.replaceNodes + ')')\" ng-disabled=!controlDh.input.replaceNodes><bb-row-spinner spinner=\"rowSpinner['ReplaceFailedNode(' + controlDh.input.replaceNodes + ')']\" label=\"_t('nm_replace_node')\" icon=\"'fa-exchange'\"></bb-row-spinner>{{_t('')}}</button></div><div class=\"cfg-block form-inline\"><p class=input-help>{{_t('nm_mark_node_war')}}</p><select name=mark_battery_failed id=mark_battery_failed class=form-control ng-disabled=\"[1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-hide=_.isEmpty(controlDh.nodes.failedBatteries) ng-change=changeSelectNode(modelBatteryFailed) ng-model=controlDh.input.failedBatteries><option ng-hide=\"controlDh.removed.failedBatteries.indexOf(v) > -1\" ng-repeat=\"v in controlDh.nodes.failedBatteries track by $index\" value={{v}}>{{v}}</option></select>&nbsp; <button class=\"btn btn-primary\" ng-click=\"handleModal('failedBatteryModal', $event)\" ng-disabled=!controlDh.input.failedBatteries><bb-row-spinner spinner=\"rowSpinner['devices[' + controlDh.input.failedBatteries + '].SendNoOperation()']\" label=\"_t('nm_mark_battery_as_failed')\" icon=\"'fa-thumb-tack'\"></bb-row-spinner></button></div></div><div><div class=\"cfg-block form-inline\" ng-controller=ControllerChangeController><p class=input-help>{{_t('nm_change_controller_war')}}</p><div class=nm-response ng-class=\"controllerState == 0 ? 'text-info' : 'text - danger'\" ng-show=\"[13, 14, 15, 16].indexOf(controllerState) > -1\">{{_t('nm_controller_state_' + controllerState)}}</div><button class=\"btn btn-primary\" id=btn_controller_change_start ng-show=\"[13, 14, 15, 16].indexOf(controlDh.controller.controllerState) == -1\" ng-click=\"controllerChange('controller.ControllerChange(1)')\" ng-disabled=\"[1, 2, 3, 4, 5, 6, 7, 20].indexOf(controlDh.controller.controllerState) > -1 || isPrimary == false || rowSpinner['controller.ControllerChange(1)']\"><bb-row-spinner spinner=\"rowSpinner['controller.ControllerChange(1)']\" label=\"_t('nm_controller_change_start')\" icon=\"'fa-database'\"></bb-row-spinner></button> <button class=\"btn btn-danger\" id=btn_controller_change_stop ng-show=\"[13, 14, 15, 16].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"controllerChange('controller.ControllerChange(0)')\" ng-disabled=\"rowSpinner['controller.ControllerChange(0)']\"><bb-row-spinner spinner=\"rowSpinner['controller.ControllerChange(0)']\" label=\"_t('nm_controller_change_stop')\" icon=\"'fa-database'\"></bb-row-spinner></button></div><div class=\"cfg-block form-inline\" ng-controller=RequestNifAllController><p class=input-help>{{_t('nm_nif_all_war')}}</p><button class=\"btn btn-primary\" id=btn_request_nif ng-disabled=\"[1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"requestNifAll('requestNifAll')\" ng-disabled=\"rowSpinner['requestNifAll']\"><bb-row-spinner spinner=\"rowSpinner['requestNifAll']\" label=\"_t('nm_request_all_node_information')\" icon=\"'fa-search-plus'\"></bb-row-spinner></button></div></div></div></div><div id=failedNodeModal class=appmodal ng-if=modalArr.failedNodeModal ng-controller=RemoveFailedNodeController><div class=appmodal-in><div class=appmodal-header><span class=appmodal-close ng-click=\"handleModal('failedNodeModal', $event);controlDh.input.failedNodes = 0\"><i class=\"fa fa-times\"></i></span><h3>{{_t('nm_remove_failed') + ' #' + controlDh.input.failedNodes}}</h3></div><div class=appmodal-body><div class=\"alert alert-warning\"><input type=checkbox name=remove_node_confirm id=remove_node_confirm value=1 ng-click=\"goFailedNode = !goFailedNode\"> <span ng-bind-html=\"_t('are_you_sure_remove_node') | toTrusted\"></span> <strong>{{deviceInfo.name}}</strong><p>{{_t('txt_controller_delete_node')}}</p></div></div><div class=appmodal-footer><button type=button class=\"btn btn-default\" ng-click=\"handleModal('failedNodeModal', $event);controlDh.input.failedNodes = 0\"><i class=\"fa fa-times text-danger\"></i> <span class=btn-name>{{_t('btn_cancel')}}</span></button> <button type=button class=\"btn btn-danger\" id=btn_reset_controller ng-show=goFailedNode ng-click=\"removeFailedNode('devices[' + controlDh.input.failedNodes + '].RemoveFailedNode()',handleModal('failedNodeModal', $event))\"><i class=\"fa fa-exclamation-triangle\"></i> {{_t('nm_remove_failed')}}</button></div></div></div><div id=failedBatteryModal class=appmodal ng-if=modalArr.failedBatteryModal ng-controller=BatteryDeviceFailedController><div class=appmodal-in><div class=appmodal-header><span class=appmodal-close ng-click=\"handleModal('failedBatteryModal', $event);controlDh.input.failedBatteries = 0\"><i class=\"fa fa-times\"></i></span><h3>{{_t('nm_mark_battery_as_failed') + ' #' + controlDh.input.failedBatteries}}</h3></div><div class=appmodal-body>{{_t('nm_mark_node_war_modal')}}</div><div class=appmodal-footer><button type=button class=\"btn btn-default\" ng-click=\"handleModal('failedBatteryModal', $event);controlDh.input.failedBatteries = 0\"><i class=\"fa fa-times text-danger\"></i> <span class=btn-name>{{_t('btn_cancel')}}</span></button> <button type=button class=\"btn btn-primary\" id=btn_reset_controller ng-click=\"markFailedNode(\r" +
    "\n" +
    "                    ['devices[' + controlDh.input.failedBatteries + '].SendNoOperation()',\r" +
    "\n" +
    "                    'devices[' + controlDh.input.failedBatteries + '].WakeupQueue()'],handleModal('failedBatteryModal', $event))\"><i class=\"fa fa-check\"></i> {{_t('nm_mark_battery_as_failed')}}</button></div></div></div>"
  );


  $templateCache.put('app/views/network/control/control_promiscuous.html',
    "<div class=\"panel panel-default\" ng-controller=SetPromiscuousModeController><div class=panel-heading><i class=\"fa fa-files-o\"></i> {{_t('promiscuous_mode')}}</div><div class=panel-body><div class=btn-group><button type=button class=\"btn btn-primary\" id=btn_promi_on ng-click=\"setPromiscuousMode('SetPromiscuousMode(true)')\" ng-disabled=\"[1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1 || rowSpinner['SetPromiscuousMode(true)']\"><bb-row-spinner spinner=\"rowSpinner['SetPromiscuousMode(true)']\" label=\"_t('on')\"></bb-row-spinner></button> <button type=button class=\"btn btn-default\" id=btn_promi_off ng-click=\"setPromiscuousMode('SetPromiscuousMode(false)')\" ng-disabled=\"[1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1 || rowSpinner['SetPromiscuousMode(false)']\"><bb-row-spinner spinner=\"rowSpinner['SetPromiscuousMode(false)']\" label=\"_t('off')\"></bb-row-spinner></button></div></div></div>"
  );


  $templateCache.put('app/views/network/control/control_restore.html',
    "<div class=\"panel panel-default\"><div class=panel-heading><i class=\"fa fa-download\"></i> {{_t('nm_backup_title')}}</div><div class=panel-body><a class=\"btn btn-primary\" href={{cfg.server_url}}/ZWaveAPI/Backup ng-disabled=\"[1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\"><i class=\"fa fa-download\"></i> {{_t('nm_backup_download')}} </a>&nbsp; <button class=\"btn btn-primary\" ng-disabled=\"[1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-click=\"handleModal('restoreModal', $event)\"><i class=\"fa fa-repeat\"></i> {{_t('nm_restore_backup_upload')}}</button></div></div><div ng-include=\"'app/views/network/control/control_restore_modal.html'\"></div>"
  );


  $templateCache.put('app/views/network/control/control_restore_modal.html',
    "<div id=restoreModal class=appmodal ng-if=modalArr.restoreModal ng-controller=BackupRestoreController><div class=appmodal-in><form name=form_notes id=form_modal class=form ng-model=notes.input ng-submit=\"handleModal('restoreModal', $event);storeSettings(settings.input)\" novalidate><div class=appmodal-header><span class=appmodal-close ng-click=\"handleModal('restoreModal', $event)\"><i class=\"fa fa-times\"></i></span><h3>{{_t('nm_restore_backup_upload')}}</h3></div><div class=appmodal-body><bb-loader></bb-loader><div class=restore-backup-control ng-if_=\"restoreBackupStatus == 0\"><div class=\"alert alert-warning\"><input type=checkbox name=restore_confirm value=1 id=restore_confirm ng-click=\"restore.allow = !restore.allow\"> <span ng-bind-html=\"_t('are_you_sure_restore') | toTrusted\"></span></div><div ng-if=restore.allow><p ng-if=controlDh.controller.isRealPrimary><input type=checkbox name=restore_chip_info id=restore_chip_info value=1 ng-true-value=1 ng-false-value=0 ng-model=restore.input.restore_chip_info> {{_t('restore_backup_chip')}}</p><p class=text-center><input id=btn_upload type=file name=file onchange=angular.element(this).scope().restoreFromBackup(this.files)></p></div></div></div><div class=appmodal-footer><button type=button class=\"btn btn-default\" ng-click=\"handleModal('restoreModal', $event)\"><i class=\"fa fa-times text-danger\"></i> <span class=btn-name>{{_t('btn_cancel')}}</span></button></div></form></div></div>"
  );


  $templateCache.put('app/views/network/control/control_sucsic.html',
    "<div class=\"panel panel-default\" ng-controller=SucSisController><div class=panel-heading><i class=\"fa fa-share-alt\"></i> {{_t('nm_suc_sis_title')}}</div><div class=panel-body><div class=\"cfg-block form-inline\"><button class=\"btn btn-primary\" ng-click=\"getSUCNodeId('controller.GetSUCNodeId()')\" ng-disabled=\"rowSpinner['controller.GetSUCNodeId()'] || [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\"><bb-row-spinner spinner=\"rowSpinner['controller.GetSUCNodeId()']\" label=\"_t('nm_get_suc_nodeid')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button> <button class=\"btn btn-primary\" ng-click=\"requestNetworkUpdate('controller.RequestNetworkUpdate()')\" ng-disabled=\"controlDh.controller.disableSUCRequest || rowSpinner['controller.RequestNetworkUpdate()'] || [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\"><bb-row-spinner spinner=\"rowSpinner['controller.RequestNetworkUpdate()']\" label=\"_t('nm_request_network_update')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></div><div class=\"cfg-block form-inline\"><button class=\"btn btn-primary\" data-ng-click=\"setSUCNodeId('controller.SetSUCNodeId(' + controlDh.input.sucSis + ')')\" ng-disabled=\"rowSpinner['controller.SetSUCNodeId(' + controlDh.input.sucSis + ')'] || [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\"><bb-row-spinner spinner=\"rowSpinner['controller.SetSUCNodeId(' + controlDh.input.sucSis + ')']\" label=\"_t('nm_start_suc')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button> <button class=\"btn btn-primary\" data-ng-click=\"setSISNodeId('controller.SetSISNodeId(' + controlDh.input.sucSis + ')')\" ng-disabled=\"rowSpinner['controller.SetSISNodeId(' + controlDh.input.sucSis + ')']|| [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\"><bb-row-spinner spinner=\"rowSpinner['controller.SetSISNodeId(' + controlDh.input.sucSis + ')']\" label=\"_t('nm_start_sis')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button> <button class=\"btn btn-primary\" data-ng-click=\"disableSUCNodeId('controller.DisableSUCNodeId(' + controlDh.input.sucSis + ')')\" ng-disabled=\"rowSpinner['controller.DisableSUCNodeId(' + controlDh.input.sucSis + ')'] || [1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\"><bb-row-spinner spinner=\"rowSpinner['controller.DisableSUCNodeId(' + controlDh.input.sucSis + ')']\" label=\"_t('nm_stop_suc_sis')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button><p><br>{{_t('nm_start_suc_on_node')}}<select name=suc_sic_node id=suc_sic_node class=form-control ng-disabled=\"[1, 2, 3, 4, 5, 6, 7].indexOf(controlDh.controller.controllerState) > -1\" ng-model=controlDh.input.sucSis><option ng-repeat=\"v in controlDh.nodes.sucSis track by $index\" value={{v}} ng-selected=\"v == controlDh.controller.nodeId\">{{v}}</option></select></p><p></p></div></div></div>"
  );


  $templateCache.put('app/views/network/controller_default.html',
    "<div ng-controller=ControllerController><div class=page-header><h1>{{_t('nav_controller_info')}}</h1></div><div class=\"well well-sm\"><a href=#network/queue target=_blank class=\"btn btn-primary\"><i class=\"fa fa-search\"></i> {{_t('nm_inspect_queue_title')}}</a> <em>{{_t('txt_inspect_queue')}}</em></div><div class=\"table-responsive table-controller\"><h3>{{_t('ctrl_info_role_title')}}</h3><table class=\"table table-condensed\"><tbody><tr><td id=ctrl_info_nodeid_title class=controller-th>{{_t('ctrl_info_nodeid_title')}}</td><td id=ctrl_info_nodeid_value>{{master['controller.data.nodeId']}}</td></tr><tr><td id=ctrl_info_homeid_title class=controller-th>{{_t('ctrl_info_homeid_title')}}</td><td id=ctrl_info_homeid_value>{{master['txtHomeId']}}</td></tr><tr><td id=ctrl_info_primary_title class=controller-th>{{_t('ctrl_info_primary_title')}}</td><td id=ctrl_info_primary_value>{{master['controller.data.isPrimary']? 'Yes': 'No'}}</td></tr><tr><td id=ctrl_info_real_primary_title class=controller-th>{{_t('ctrl_info_real_primary_title')}}</td><td id=ctrl_info_real_primary_value>{{master['controller.data.isRealPrimary']? 'Yes': 'No'}}</td></tr><tr><td id=ctrl_info_suc_sis_title class=controller-th>{{_t('ctrl_info_suc_sis_title')}}</td><td id=ctrl_info_suc_sis_value>{{master['txtSucSis']}}</td></tr></tbody></table><h3>{{_t('ctrl_info_hw_title')}}</h3><table class=\"table table-condensed\"><tbody><tr><td id=ctrl_info_hw_vendor_title class=controller-th>{{_t('ctrl_info_hw_vendor_title')}}</td><td id=ctrl_info_hw_vendor_value>{{master['controller.data.vendor']}}</td></tr><tr><td id=ctrl_info_hw_product_title class=controller-th>{{_t('ctrl_info_hw_product_title')}}</td><td id=ctrl_info_hw_product_value>{{master['controller.data.manufacturerProductType']}} / {{master['controller.data.manufacturerProductId']}}</td></tr><tr><td id=ctrl_info_hw_chip_title class=controller-th>{{_t('ctrl_info_hw_chip_title')}}</td><td id=ctrl_info_hw_chip_value>{{master['controller.data.ZWaveChip']}}</td></tr></tbody></table><h3>{{_t('ctrl_info_sw_title')}}</h3><table class=\"table table-condensed\"><tbody><tr><td id=ctrl_info_sw_lib_title class=controller-th>{{_t('ctrl_info_sw_lib_title')}}</td><td id=ctrl_info_sw_lib_value>{{master['controller.data.libType']}}</td></tr><tr><td id=ctrl_info_sw_sdk_title class=controller-th>{{_t('ctrl_info_sw_sdk_title')}}</td><td id=ctrl_info_sw_sdk_value>{{master['controller.data.SDK']}}</td></tr><tr><td id=ctrl_info_sw_api_title class=controller-th>{{_t('ctrl_info_sw_api_title')}}</td><td id=ctrl_info_sw_api_value>{{master['controller.data.APIVersion']}}</td></tr></tbody></table><h3>{{_t('ctrl_info_sw_caps_title')}}</h3><table class=\"table table-condensed\"><tbody><tr><td id=ctrl_info_uuid_title class=controller-th>{{_t('ctrl_info_uuid_title')}}</td><td id=ctrl_info_uuid_value>{{master['controller.data.uuid']}}</td></tr><tr><td id=ctrl_info_caps_subvendor_title class=controller-th>{{_t('ctrl_info_caps_subvendor_title')}}</td><td id=ctrl_info_caps_subvendor_value>{{master['controller.data.caps.subvendor']}}</td></tr><tr><td id=ctrl_info_caps_nodes_title class=controller-th>{{_t('ctrl_info_caps_nodes_title')}}</td><td id=ctrl_info_caps_nodes_value>{{master['controller.data.caps.nodes']}}</td></tr><tr><td id=ctrl_info_caps_cap_title class=controller-th>{{_t('ctrl_info_caps_cap_title')}}</td><td id=ctrl_info_caps_cap_value>{{master['controller.data.caps.cap']}}</td></tr></tbody></table><h3>{{_t('ctrl_info_sw_rev_title')}}</h3><table class=\"table table-condensed\"><tbody><tr><td id=ctrl_info_sw_rev_ver_title class=controller-th>{{_t('ctrl_info_sw_rev_ver_title')}}</td><td id=ctrl_info_sw_rev_ver_value>{{master['controller.data.softwareRevisionVersion']}}</td></tr><tr><td id=ctrl_info_sw_rev_id_title class=controller-th>{{_t('ctrl_info_sw_rev_id_title')}}</td><td id=ctrl_info_sw_rev_id_value>{{master['controller.data.softwareRevisionId']}}</td></tr><tr><td id=ctrl_info_sw_rev_date_title class=controller-th>{{_t('ctrl_info_sw_rev_date_title')}}</td><td id=ctrl_info_sw_rev_date_value>{{master['controller.data.softwareRevisionDate']}}</td></tr></tbody></table><h3>{{_t('ui')}}</h3><table class=\"table table-condensed\"><tbody><tr><td id=ctrl_ui_version class=controller-th>{{_t('ui_version')}}</td><td id=ctrl_ui_version_value>{{cfg.app_version}}</td></tr><tr><td id=ctrl_ui_version class=controller-th>{{_t('built_date')}}</td><td id=ctrl_ui_version_value>{{builtInfo.built}}</td></tr></tbody></table></div><div class=\"well well-sm\"><button class=\"btn btn-primary\" ng-controller=SendNodeInformationController data-ng-click=\"sendNodeInformation('controller.SendNodeInformation()')\" ng-disabled=\"rowSpinner['controller.SendNodeInformation()']\"><bb-row-spinner spinner=\"rowSpinner['controller.SendNodeInformation()']\" label=\"_t('nm_send_node_information')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button> <button class=btn ng-class=\"cfg.zwavecfg.debug === true ? 'btn-success active': 'btn-primary'\" ng-click=\"setDebugMode(cfg.zwavecfg.debug === true ? false : true,'debugMode')\" ng-disabled=\"rowSpinner['debugMode']\"><bb-row-spinner spinner=\"rowSpinner['debugMode']\" label=\"_t('debug_mode')\" icon=\"'fa-bug'\"></bb-row-spinner></button> <button class=\"btn btn-default\" ng-controller=DataHolderInfoController ng-click=\"dataHolderModal('dataHolderModal',$event, ZWaveAPIData.controller.data)\"><i class=\"fa fa-clone\"></i> {{_t('ctrl_info_data')}}</button> <button class=\"btn btn-default\" ng-controller=DataHolderInfoController ng-click=\"dataHolderModal('dataHolderModal',$event, ZWaveAPIData.devices[ZWaveAPIData.controller.data.nodeId.value].data)\"><i class=\"fa fa-clone\"></i> {{_t('ctrl_info_device_data')}}</button> <a href=#uzb class=\"btn btn-default\"><i class=\"fa fa-long-arrow-up\"></i> {{_t('upgrade_bootloader_firmware')}} </a><a href=#licence class=\"btn btn-default\" ng-if=\"master['controller.data.manufacturerProductId'] == 1 && master['controller.data.manufacturerId'] == 277 && master['controller.data.manufacturerProductType'] == 1024 && master['controller.data.ZWaveChip'] == 'ZW0500'\"><i class=\"fa fa-level-up\"></i> {{_t('licence_upgrade')}}</a></div><div class=\"panel panel-default\"><div class=panel-heading><h3 class=panel-title>{{_t('ctrl_info_func_list_title')}}</h3></div><div class=panel-body ng-bind-html=\"funcList | toTrusted\"></div></div><div id=dataHolderModal class=\"appmodal appmodal-100\" ng-show=modalArr.dataHolderModal><div class=appmodal-in><div class=appmodal-header><span class=appmodal-close ng-click=\"handleModal('dataHolderModal', $event)\"><i class=\"fa fa-times\"></i></span><h3>{{_t('th_command_class')}}</h3></div><div class=\"appmodal-body modal-h-400\">{{dataHolderInfo.all}}</div><div class=appmodal-footer><button type=button class=\"btn btn-default\" ng-click=\"handleModal('dataHolderModal', $event)\"><i class=\"fa fa-times text-danger\"></i> <span class=btn-name>{{_t('btn_cancel')}}</span></button></div></div></div></div>"
  );


  $templateCache.put('app/views/network/controller_installer.html',
    "<div ng-controller=ControllerController><div class=page-header><h1>{{_t('nav_controller_info')}}</h1></div><div class=\"well well-sm\"><a href=#network/queue target=_blank class=\"btn btn-primary\" _ngs-click=openQueue()><i class=\"fa fa-search\"></i> {{_t('nm_inspect_queue_title')}}</a> <em>{{_t('txt_inspect_queue')}}</em></div><div class=\"table-responsive table-controller\"><h3>{{_t('ctrl_info_role_title')}}</h3><table class=\"table table-condensed\"><tbody><tr><td id=ctrl_info_nodeid_title class=controller-th>{{_t('ctrl_info_nodeid_title')}}</td><td id=ctrl_info_nodeid_value>{{master['controller.data.nodeId']}}</td></tr><tr><td id=ctrl_info_homeid_title class=controller-th>{{_t('ctrl_info_homeid_title')}}</td><td id=ctrl_info_homeid_value><span ng-if=\"boxData.controller.isPrimary && boxData.controller.hasDevices\">{{_t('my_own')}} </span><span ng-if=\"!boxData.controller.isPrimary || !boxData.controller.hasDevices\">{{_t('other_network')}}</span></td></tr><tr><td id=ctrl_info_primary_title class=controller-th>{{_t('ctrl_info_primary_title')}}</td><td id=ctrl_info_primary_value>{{master['controller.data.isPrimary']? 'Yes': 'No'}}</td></tr><tr><td id=ctrl_info_real_primary_title class=controller-th>{{_t('ctrl_info_real_primary_title')}}</td><td id=ctrl_info_real_primary_value>{{master['controller.data.isRealPrimary']? 'Yes - ' + _t('secondary_inclusion_controller') : 'No'}}</td></tr><tr><td id=ctrl_info_suc_sis_title class=controller-th>{{_t('ctrl_info_suc_sis_title')}}</td><td id=ctrl_info_suc_sis_value>{{master['txtSucSis']}}</td></tr></tbody></table><h3>{{_t('ctrl_info_hw_title')}}</h3><table class=\"table table-condensed\"><tbody><tr><td id=ctrl_info_hw_vendor_title class=controller-th>{{_t('ctrl_info_hw_vendor_title')}}</td><td id=ctrl_info_hw_vendor_value>{{master['controller.data.vendor']}}</td></tr><tr><td id=ctrl_info_hw_product_title class=controller-th>{{_t('ctrl_info_hw_product_title')}}</td><td id=ctrl_info_hw_product_value>0001 / 0001</td></tr><tr><td id=ctrl_info_hw_chip_title class=controller-th>{{_t('ctrl_info_hw_chip_title')}}</td><td id=ctrl_info_hw_chip_value>{{master['controller.data.ZWaveChip']}}</td></tr></tbody></table><h3>{{_t('ctrl_info_sw_title')}}</h3><table class=\"table table-condensed\"><tbody><tr><td id=ctrl_info_sw_lib_title class=controller-th>{{_t('ctrl_info_sw_lib_title')}}</td><td id=ctrl_info_sw_lib_value>{{master['controller.data.libType']}}</td></tr><tr><td id=ctrl_info_sw_sdk_title class=controller-th>{{_t('ctrl_info_sw_sdk_title')}}</td><td id=ctrl_info_sw_sdk_value>{{master['controller.data.SDK']}}</td></tr><tr><td id=ctrl_info_sw_api_title class=controller-th>{{_t('ctrl_info_sw_api_title')}}</td><td id=ctrl_info_sw_api_value>{{master['controller.data.APIVersion']}}</td></tr></tbody></table><h3>{{_t('ctrl_info_sw_rev_title')}}</h3><table class=\"table table-condensed\"><tbody><tr><td id=ctrl_info_sw_rev_ver_title class=controller-th>{{_t('ctrl_info_sw_rev_ver_title')}}</td><td id=ctrl_info_sw_rev_ver_value>{{master['controller.data.softwareRevisionVersion']}}</td></tr><tr><td id=ctrl_info_sw_rev_id_title class=controller-th>{{_t('ctrl_info_sw_rev_id_title')}}</td><td id=ctrl_info_sw_rev_id_value>{{master['controller.data.softwareRevisionId']}}</td></tr><tr><td id=ctrl_info_sw_rev_date_title class=controller-th>{{_t('ctrl_info_sw_rev_date_title')}}</td><td id=ctrl_info_sw_rev_date_value>{{master['controller.data.softwareRevisionDate']}}</td></tr></tbody></table><h3>{{_t('ui')}}</h3><table class=\"table table-condensed\"><tbody><tr><td id=ctrl_ui_version class=controller-th>{{_t('ui_version')}}</td><td id=ctrl_ui_version_value>{{cfg.app_version}}</td></tr><tr><td id=ctrl_ui_version class=controller-th>{{_t('built_date')}}</td><td id=ctrl_ui_version_value>{{builtInfo.built}}</td></tr></tbody></table><h3>{{_t('nm_frequency_title')}}</h3><table class=\"table table-condensed\"><tbody><tr><td class=controller-th>{{_t('current_frequency')}}</td><td>{{master['controller.data.frequency']}}</td></tr></tbody></table></div></div>"
  );


  $templateCache.put('app/views/network/linkstatus.html',
    "<div ng-controller=LinkStatusController><div class=\"page-header row\"><div class=\"col-sm-8 header-col\"><h1>{{ _t('nav_linkhealth_info')}}</h1></div><div class=\"col-sm-4 text-right header-col\"><div class=btn-group><button class=\"btn btn-default\" ng-class=\"linkStatus.showInfo ? 'active': ''\" ng-click=changeView(true)><i class=\"fa fa-th-list\"></i> {{_t('info_link_status')}}</button> <button class=\"btn btn-default\" ng-class=\"!linkStatus.showInfo ? 'active': ''\" ng-click=changeView(false)><i class=\"fa fa-th-large\"></i> {{_t('nav_linkhealth_info')}}</button></div></div></div><bb-alert alert=alert></bb-alert><div class=table-scroll ng-if=linkStatus.show><div data-double-scroll-bar-horizontal><table class=table-neighbors ng-class=\"linkStatus.showInfo ? 'table table-condensed table-hover ':'table-neighbors-noinfo'\"><thead><tr><th class=th-id>&nbsp;</th><th class=neighbor-hide><a href=\"\" ng-click=\"orderBy('name')\">{{ _t('device_name')}} <span ng-show=\"predicate == 'name'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th class=neighbor-hide><a href=\"\" ng-click=\"orderBy('type')\">{{_t('device_description_device_type')}} <span ng-show=\"predicate == 'type'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th class=neighbor-hide><a href=\"\" ng-click=\"orderBy('updateTime')\">{{ _t('rt_header_update_time')}} <span ng-show=\"predicate == 'updateTime'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th class=\"neighbor-hide print-hide\">&nbsp;</th><th><span class=rt-cell ng-repeat=\"v in linkStatus.all track by $index\">{{v.id}}</span></th></tr></thead><tbody><tr id={{v.rowId}} ng-repeat=\"v in linkStatus.all| orderBy:predicate:reverse track by $index\" ng-hide=v.isController><td class=headcol><span class=\"tool-tip right rt-cell rt-cell-th\">{{v.id}}</span></td><td class=neighbor-hide data-title=\"{{ _t('device_name')}}\">{{ v.name}}</td><td class=neighbor-hide data-title=\"{{ _t('type')}}\" title={{v.type}}><i class=fa ng-class=v.icon title={{_t(v.type)}}></i></td><td class=neighbor-hide data-title=\"{{ _t('datetime')}}\"><bb-date-time ng-if=v.dateTime obj=v.dateTime updated=v.isUpdated></bb-date-time><span ng-if=!v.dateTime>-</span></td><td class=\"neighbor-hide td-action print-hide\" data-title=\"\"><button class=\"btn btn-primary\" id=\"btn_test_{{ v.id}}\" ng-if=v.hasPowerLevel ng-click=testAllLinks(v.id) ng-disabled=rowSpinner[v.id]><bb-row-spinner icon=\"'fa-circle-o'\" spinner=rowSpinner[v.id] label=\"_t('test_link')\"></bb-row-spinner></button> <button class=\"btn btn-default\" id=\"btn_nop_{{ v.id}}\" ng-if=!v.hasPowerLevel ng-click=runZwaveNop(v.cmdNop) ng-disabled=rowSpinner[v.cmdNop]><bb-row-spinner icon=\"'fa-circle-o text-success'\" spinner=rowSpinner[v.cmdNop] label=\"_t('nop')\"></bb-row-spinner></button></td><td ng-bind-html=htmlNeighbors[v.id]|toTrusted>{{htmlNeighbors[v.id]}}</td></tr><tr class=print-hide><th class=th-id>&nbsp;</th><th class=neighbor-hide><a href=\"\" ng-click=\"orderBy('name')\">{{ _t('device_name')}} <span ng-show=\"predicate == 'name'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th class=neighbor-hide><a href=\"\" ng-click=\"orderBy('type')\">{{_t('device_description_device_type')}} <span ng-show=\"predicate == 'type'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th class=neighbor-hide><a href=\"\" ng-click=\"orderBy('updateTime')\">{{ _t('rt_header_update_time')}} <span ng-show=\"predicate == 'updateTime'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th class=neighbor-hide>&nbsp;</th><th><span class=rt-cell ng-repeat=\"v in linkStatus.all track by $index\">{{v.id}}</span></th></tr></tbody></table></div></div><div class=legend-entry><div class=legend-row><i class=\"fa fa-square fa-lg gray\"></i> {{_t('unavailable')}}</div><div class=legend-row><i class=\"fa fa-square fa-lg green\"></i> {{_t('very_good')}}</div><div class=legend-row><i class=\"fa fa-square fa-lg orange\"></i> {{_t('good')}}</div><div class=legend-row><i class=\"fa fa-square fa-lg red\"></i> {{_t('poor')}}</div></div></div>"
  );


  $templateCache.put('app/views/network/map.html',
    "<div ng-controller=NetworkMapController><div id=cy></div></div>"
  );


  $templateCache.put('app/views/network/neighbors.html',
    "<div ng-controller=NeighborController><div class=\"page-header row\"><div class=\"col-sm-8 header-col\"><h1>{{ _t('neighbors')}}</h1></div><div class=\"col-sm-4 text-right header-col\"><div class=btn-group><button class=\"btn btn-default\" ng-class=\"routings.showInfo ? 'active': ''\" ng-click=\"changeView('table')\"><i class=\"fa fa-th-list\"></i> {{_t('info_neighbors')}}</button> <button class=\"btn btn-default\" ng-class=\"!routings.showInfo ? 'active': ''\" ng-click=\"changeView('neighbors')\"><i class=\"fa fa-th-large\"></i> {{_t('neighbors')}}</button></div></div></div><div class=table-scroll ng-if=routings.show><div data-double-scroll-bar-horizontal><table class=\"table-neighbors data-size-{{routings.dataSize}}\" ng-class=\"routings.showInfo ? 'table table-condensed table-hover ':'table-neighbors-noinfo'\"><thead><tr><th class=th-id>&nbsp;</th><th class=neighbor-hide>{{ _t('device_name')}}</th><th class=neighbor-hide>{{ _t('nav_type_info')}}</th><th class=neighbor-hide>{{ _t('rt_header_update_time')}}</th><th class=\"neighbor-hide mobile-show td-action print-hide\"><button class=\"btn btn-primary\" id=btn_update_all_1 ng-click=\"updateAllRoutess('all_1','urlToStore')\" ng-disabled=\"rowSpinner['all_1']\"><bb-row-spinner spinner=\"rowSpinner['all_1']\" label=\"_t('switches_update_all')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></th><th><span class=rt-cell ng-repeat=\"v in routings.all track by $index\">{{v.id}}</span></th></tr></thead><tbody><tr ng-repeat=\"v in routings.all track by $index\"><td class=headcol><span class=\"tool-tip right rt-cell rt-cell-th\">{{v.id}}</span></td><td class=neighbor-hide>{{v.name}}</td><td class=neighbor-hide><i class=fa ng-class=v.icon title={{_t(v.type)}}></i></td><td class=\"neighbor-hide row-time is-updated-{{v.isUpdated}}\">{{ v.updateTime | isTodayFromUnix }} &nbsp;</td><td class=\"neighbor-hide td-action print-hide\"><button class=\"btn btn-default\" id=\"btn_update_{{ v.rowId}}\" ng-click=updateRoute(v.urlToStore) ng-disabled=rowSpinner[v.urlToStore]><bb-row-spinner spinner=rowSpinner[v.urlToStore] label=\" _t('update')\" icon=\"'fa-circle-o text-success'\"></bb-row-spinner></button>&nbsp;</td><td ng-bind-html=htmlNeighbors[v.id]|toTrusted></td></tr><tr><th class=th-id>&nbsp;</th><th class=neighbor-hide>{{ _t('device_name')}}</th><th class=neighbor-hide>{{ _t('nav_type_info')}}</th><th class=neighbor-hide>{{ _t('rt_header_update_time')}}</th><th class=\"neighbor-hide mobile-show td-action print-hide\"><button class=\"btn btn-primary\" id=btn_update_all_1 ng-click=\"updateAllRoutess('all_1','urlToStore')\" ng-disabled=\"rowSpinner['all_1']\"><bb-row-spinner spinner=\"rowSpinner['all_1']\" label=\"_t('switches_update_all')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></th><th><span class=rt-cell ng-repeat=\"v in routings.all track by $index\">{{v.id}}</span></th></tr></tbody></table></div></div><div class=legend-entry><div class=legend-row><i class=\"fa fa-square fa-lg green\"></i> {{_t('in_range')}}</div><div class=legend-row><i class=\"fa fa-square fa-lg red\"></i> {{_t('notin_range')}}</div></div></div>"
  );


  $templateCache.put('app/views/network/queue.html',
    "<div ng-controller=QueueController><div class=page-header><h1>{{_t('nm_inspect_queue_title')}}</h1></div><p>{{ _t('txt_queue_length')}}: {{queueData.length}}<bb-alert-text alert=alert></bb-alert-text></p><div id=inspect_queue_table class=table-responsive><table id=inspect_queue_table__ class=\"table table-striped table-condensed table-hover\"><thead><tr><th title=\"Send count\">n</th><th title=Urgent>U</th><th title=\"Wait wakeup\">W</th><th title=\"Wait security\">S</th><th title=Encapsulated>E</th><th title=Done>D</th><th>Ack</th><th>Resp</th><th>Cbk</th><th>{{_t('th_timeout')}}</th><th>{{_t('th_nodeid')}}</th><th>{{_t('th_description')}}</th><th>{{_t('th_progress')}}</th><th>{{_t('th_buffer')}}</th></tr></thead><tbody><tr ng-repeat=\"v in queueData.all track by $index\"><td>{{v.n}}</td><td>{{v.U}}</td><td>{{v.W}}</td><td>{{v.S}}</td><td>{{v.E}}</td><td>{{v.D}}</td><td>{{v.Ack}}</td><td>{{v.Resp}}</td><td>{{v.Cbk}}</td><td>{{v.Timeout}}</td><td>{{v.NodeId}}</td><td ng-bind-html=\"v.Description | toTrusted\"></td><td ng-bind-html=\"v.Progress | toTrusted\"></td><td>{{v.Buffer}}</td></tr></tbody></table></div><div class=legend-entry><div class=legend-title>{{_t('legend')}}</div><div class=legend-row>{{_t('inspect_queue_legend_help')}}</div></div><hr><div class=text-right><a href=javascript:closeWindow(); class=\"btn btn-default\"><i class=\"fa fa-times text-danger\"></i> <span class=\"btn-name ng-binding\">{{_t('btn_close')}}</span></a></div><script>function closeWindow() {\r" +
    "\n" +
    "            window.open('', '_parent', '');\r" +
    "\n" +
    "            window.close();\r" +
    "\n" +
    "        }</script></div>"
  );


  $templateCache.put('app/views/network/reorganization.html',
    "<div ng-controller=ReorganizationController><div class=page-header><h1>{{ _t('nav_reorganization')}}</h1></div><bb-alert alert=alert></bb-alert><div><div class=\"form-group form-inline\"><input id=reorgMain type=checkbox ng-model=reorganizations.input.reorgMain><label for=reorgMain>{{ _t('reorg_mains_powered')}}</label><input id=reorgBattery type=checkbox ng-model=reorganizations.input.reorgBattery><label for=reorgBattery>{{ _t('reorg_battery_powered')}}</label></div><div class=\"form-group form-inline\"><div class=btn-group><button class=\"btn btn-default\" title=\"{{ _t('reorg_start')}}\" ng-click=\"setTrace('run',reorganizations.input)\" ng-disabled=\"reorganizations.trace === 'run'\" ng-class=\"reorganizations.trace === 'run' ? 'active' : ''\"><i class=\"fa fa-play\"></i></button> <button class=\"btn btn-default\" title=\"{{_t('pause')}}\" ng-class=\"reorganizations.trace === 'pause' ? 'active' : ''\" ng-disabled=\"reorganizations.trace !== 'run'\" ng-click=\"setTrace('pause')\"><i class=\"fa fa-pause\"></i></button> <button class=\"btn btn-default\" title=\"{{_t('stop')}}\" ng-class=\"zniffer.trace === 'stop' ? 'active' : ''\" ng-disabled=\"reorganizations.trace === 'stop'\" ng-click=\"setTrace('stop')\"><i class=\"fa fa-stop\"></i></button> <a ng-href=\"{{ fileUrl }}\" class=\"btn btn-default\" title=\"{{_t('reorg_download_log')}}\" download=reorganization.txt ng-click=downloadReorganizationLog() ng-disabled=\"reorganizations.trace !== 'pause'\"><i class=\"fa fa-download\"></i></a></div><span>{{_t('reorg_last_update')}} <i class=\"fa fa-clock-o\"></i> {{reorganizations.lastUpdate.time}} {{reorganizations.lastUpdate.date}}</span></div><bb-alert alert=reorganizations.run></bb-alert><table class=\"table table-condensed\"><tbody><tr ng-repeat=\"v in reorganizations.all track by $index\" id=\"{{ v.rowId}}\"><td>{{v.dateTime.time}}</td><td>{{v.message}}</td></tr></tbody></table></div></div>"
  );


  $templateCache.put('app/views/network/routing.html',
    "<div ng-controller=RoutingController><bb-loader></bb-loader><div class=\"page-header row\"><div class=col-sm-8><h1>{{ _t('neighbors')}}</h1></div><div class=\"col-sm-4 text-right\"><div class=btn-group><button class=\"btn btn-default\" ng-class=\"routings.view === 'table' ? 'active': ''\" ng-click=\"changeView('table')\"><i class=\"fa fa-th-list\"></i> {{_t('Info and Neighbors')}}</button> <button class=\"btn btn-default\" ng-class=\"routings.view === 'neighbors' ? 'active': ''\" ng-click=\"changeView('neighbors')\"><i class=\"fa fa-th-large\"></i> {{_t('Neighbors only')}}</button></div></div></div><div ng-if=\"routings.view === 'neighbors'\" ng-include=\"'app/views/network/routing_neigbors.html'\"></div><div ng-if=\"routings.view === 'table'\" ng-include=\"'app/views/network/routing_table.html'\"></div><div id=RoutingComments><i class=\"fa fa-square fa-lg green\"></i> {{_t('direct')}}<br><i class=\"fa fa-square fa-lg green-light\"></i> {{_t('routed')}}<br><i class=\"fa fa-square fa-lg yellow\"></i> {{_t('badly_routed')}}<br><i class=\"fa fa-square fa-lg red\"></i> {{_t('not_linked')}}<br><i class=\"fa fa-square fa-lg gray\"></i> {{_t('unavailable')}}<br></div></div>"
  );


  $templateCache.put('app/views/network/routing_neigbors.html',
    "<div class=table-responsive ng-if=routings.show><table class=table-routing><thead><tr><td>&nbsp;</td><td ng-repeat=\"v in routings.all | limitTo:increment\" style=text-align:center>{{v.id}}</td></tr></thead><tbody><tr ng-repeat=\"v in routings.all | limitTo:increment track by $index\"><td class=rt-node-id><div class=\"tool-tip right rt-cell rt-cell-th\">{{v.id}}<div class=tool-tip-entry><p>{{v.name}}</p><p><strong>Type info:</strong> <i class=fa ng-class=v.icon title={{_t(v.type)}}></i></p><p><strong>Updated:</strong> {{ v.updateTime | isTodayFromUnix }}</p><div><button class=\"btn btn-primary\" id=\"btn_update_{{ v.rowId}}\" ng-click=updateRoute(v.urlToStore) ng-disabled=rowSpinner[v.urlToStore]><bb-row-spinner spinner=rowSpinner[v.urlToStore] label=\" _t('update')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></div></div></div></td><td ng-repeat=\"n in v.cellState | limitTo:increment\"><div class=\"rt-cell {{n.cssClass}}\" title={{n.tooltip}}><span class=info ng-if=n.hasAssoc>*</span> <span class=info ng-if=!n.hasAssoc>&nbsp;</span></div></td></tr></tbody></table></div>"
  );


  $templateCache.put('app/views/network/routing_table.html',
    "<div class=table-responsive ng-if=routings.show><table id=RoutingTable class=\"table table-striped table-condensed table-hover table-routing\"><thead><tr><th>#</th><th>{{ _t('device_name')}}</th><th>{{ _t('nav_type_info')}}</th><th>{{ _t('rt_header_update_time')}}</th><th class=\"mobile-show td-action print-hide\"><button class=\"btn btn-primary\" id=btn_update_all_1 ng-click=\"updateAllRoutess('all_1','urlToStore')\" ng-disabled=\"rowSpinner['all_1']\"><bb-row-spinner spinner=\"rowSpinner['all_1']\" label=\"_t('switches_update_all')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></th><th ng-repeat=\"v in routings.all | limitTo:increment\" style=text-align:center>{{v.id}}</th></tr></thead><tbody><tr ng-repeat=\"v in routings.all  | limitTo:increment track by $index\"><td>{{v.id}}</td><td>{{v.name}}</td><td><i class=fa ng-class=v.icon title={{_t(v.type)}}></i></td><td class=\"row-time is-updated-{{v.isUpdated}}\">{{ v.updateTime | isTodayFromUnix }} &nbsp;</td><td class=\"td-action print-hide\"><button class=\"btn btn-default\" id=\"btn_update_{{ v.rowId}}\" ng-click=updateRoute(v.urlToStore) ng-disabled=rowSpinner[v.urlToStore]><bb-row-spinner spinner=rowSpinner[v.urlToStore] label=\" _t('update')\" icon=\"'fa-circle-o text-success'\"></bb-row-spinner></button>&nbsp;</td><td class=rt-cell ng-repeat=\"n in v.cellState | limitTo:increment\"><div class={{n.cssClass}} title={{n.tooltip}}><span class=info ng-if=n.hasAssoc>*</span> <span class=info ng-if=!n.hasAssoc>&nbsp;</span></div></td></tr></tbody></table></div>"
  );


  $templateCache.put('app/views/network/statistics.html',
    "<div ng-controller=NetworkStatisticsController ng-init=\"updateNetworkStatistics('GetNetworkStats()')\"><div class=page-header><h1>{{_t('statistics')}}</h1></div><bb-alert alert=alert></bb-alert><div class=\"text-right print-hide\"><button class=\"btn btn-primary\" id=btn_update_all_1 ng-click=\"updateNetworkStatistics('GetNetworkStats()')\" ng-disabled=\"rowSpinner['GetNetworkStats()']\"><bb-row-spinner spinner=\"rowSpinner['GetNetworkStats()']\" label=\"_t('update')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button> <button class=\"btn btn-primary\" id=btn_update_all_1 ng-click=\"updateNetworkStatistics('ClearNetworkStats()')\" ng-disabled=\"rowSpinner['ClearNetworkStats()']\"><bb-row-spinner spinner=\"rowSpinner['ClearNetworkStats()']\" label=\"_t('reset')\" icon=\"'fa-refresh'\"></bb-row-spinner></button></div><div class=statistic-entry ng-repeat=\"v in netStat.all track by $index\"><div class=statistic-title>{{_t(v.name)}} <span class=\"label label-default\">{{v.dateTime.today}}</span></div><div ng-switch=v.name><div ng-switch-when=RFRxLRCErrors ng-click=\"expandNavi(v.name, $event)\"><div class=\"progress clickable\"><div class=\"progress-bar progress-bar-success\" title=\"{{_t('ok')}} {{v.success}}%\" style=\"width: {{v.success}}%\"><span>{{v.success}}% {{_t('success_reception')}}</span></div><div class=\"progress-bar progress-bar-danger\" title=\"{{_t(v.failCRC8Name)}} {{v.failCRC8}}%\" style=\"width: {{v.failCRC8}}%\"><span>{{v.failCRC8}}% {{_t('failCRC8')}}</span></div><div class=\"progress-bar progress-bar-warning\" title=\"{{_t(v.failCRC16Name)}} {{v.failCRC16}}%\" style=\"width: {{v.failCRC16}}%\"><span>{{v.failCRC16}}% {{_t('failCRC16')}}</span></div></div><div class=page-navi ng-if=naviExpanded[v.name]><div class=page-navi-in><div class=page-navi-content><span class=text-success>{{ _t('success_on_reception')}}: <strong>{{v.frameValue}}</strong></span><br><span class=text-danger>{{_t('failCRC8Name')}}: <strong>{{_t(v.failCRC8Value)}}</strong></span><br><span class=text-warning>{{_t('failCRC16Name')}}: <strong>{{_t(v.failCRC16Value)}}</strong></span></div></div></div></div><div ng-switch-default><div class=\"progress clickable\" ng-click=\"expandNavi(v.name, $event)\"><div class=\"progress-bar progress-bar-success\" title=\"{{_t('ok')}} {{v.success}}% \" style=\"width: {{v.success}}%\"><span ng-if=\"v.name == 'RFRxForeignHomeID'\">{{v.success}}% {{_t('own')}}</span> <span ng-if=\"v.name == 'RFTxLBTBackOffs'\">{{v.success}}% {{_t('ok')}}</span></div><div class=\"progress-bar progress-bar-danger\" title=\"{{_t(v.name)}} {{v.fail}}%\" style=\"width: {{v.fail}}%\"><span ng-if=\"v.name == 'RFRxForeignHomeID'\">{{v.fail}}% {{_t('foreign')}}</span> <span ng-if=\"v.name == 'RFTxLBTBackOffs'\">{{v.fail}}% {{_t('error')}}</span></div></div><div class=page-navi ng-if=naviExpanded[v.name]><div class=page-navi-in><div ng-if=\"v.name == 'RFRxForeignHomeID'\" class=page-navi-content><span class=text-success>{{ _t('own_frames_desc')}}: <strong>{{v.frameValue}}</strong></span><br><span class=text-danger>{{_t('foreign_frames_desc')}}: <strong>{{_t(v.value)}}</strong></span></div><div ng-if=\"v.name == 'RFTxLBTBackOffs'\" class=page-navi-content><span class=text-success>{{ _t(v.frameName)}}: <strong>{{v.frameValue}}</strong></span><br><span class=text-danger>{{_t('RFTxLBTBackOffs_error')}}: <strong>{{_t(v.value)}}</strong></span></div></div></div></div></div></div></div>"
  );


  $templateCache.put('app/views/network/timing.html',
    "<div ng-controller=TimingController><div class=page-header><h1>{{_t('nav_timing_info')}}</h1></div><bb-alert alert=alert></bb-alert><div id=table_mobile ng-if=devices.show><table class=\"table table-striped table-condensed table-hover\"><thead><tr><th><a href=\"\" ng-click=\"orderBy('id')\">{{_t('th_node')}} <span ng-show=\"predicate == 'id'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th><a href=\"\" ng-click=\"orderBy('name')\">{{ _t('device_name')}} <span ng-show=\"predicate == 'name'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th><a href=\"\" ng-click=\"orderBy('type')\">{{_t('th_type')}} <span ng-show=\"predicate == 'type'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th><a href=\"\" ng-click=\"orderBy('updateTime')\">{{ _t('datetime')}} <span ng-show=\"predicate == 'updateTime'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th><a href=\"\" ng-click=\"orderBy('totalPackets')\">{{_t('th_total')}} (pkts) <span ng-show=\"predicate == 'totalPackets'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th><a href=\"\" ng-click=\"orderBy('okPackets')\">{{_t('th_ok')}} <span ng-show=\"predicate == 'okPackets'\"><i ng-show=!reverse class=\"fa fa-sort-asc\"></i><i ng-show=reverse class=\"fa fa-sort-desc\"></i></span></a></th><th>{{_t('th_lastpackets')}}&nbsp;</th><th class=\"mobile-show text-right\"><button class=\"btn btn-primary\" ng-click=\"updateTimingInfo('updateTimingInfo')\" ng-disabled=\"rowSpinner['updateTimingInfo']\"><bb-row-spinner spinner=\"rowSpinner['updateTimingInfo']\" label=\" _t('update')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></th></tr></thead><tbody><tr ng-repeat=\"v in devices.all | orderBy:predicate:reverse track by $index\" id=\"{{ v.rowId}}\"><td data-title=\"{{_t('th_node')}}\">{{ v.id}}</td><td data-title=\"{{ _t('device_name')}}\">{{ v.name }}</td><td data-title=\"{{_t('th_type')}}\"><i class=fa ng-class=v.icon title={{_t(v.type)}}></i></td><td data-title=\"{{ _t('datetime')}}\"><bb-date-time obj=v.dateTime updated=v.isUpdated></bb-date-time></td><td data-title=\"{{_t('th_total')}}\">{{ v.totalPackets}} &nbsp;</td><td data-title=\"{{_t('th_ok')}}\">{{ v.okPackets}}% &nbsp;</td><td data-title=\"{{_t('th_lastpackets')}}\"><span ng-bind-html=\"v.lastPackets | toTrusted\"></span> &nbsp;</td><td>&nbsp;</td></tr></tbody></table></div><div class=legend-entry><div class=legend-title>{{_t('timing_color_description')}}</div><div class=legend-row><i class=\"fa fa-square fa-lg green\"></i> {{_t('timing_green')}}</div><div class=legend-row><i class=\"fa fa-square fa-lg black\"></i> {{_t('timing_black')}}</div><div class=legend-row><i class=\"fa fa-square fa-lg red\"></i> {{_t('timing_red')}}</div></div></div>"
  );


  $templateCache.put('app/views/pages/license.html',
    "<div ng-controller=LicenseController><div class=page-header><h1>{{_t('licence_upgrade')}}</h1></div><p>{{_t('licence_upgrade_info')}}</p><div class=\"panel panel-default\"><div class=panel-heading><i class=\"fa fa-sign-in\"></i> {{_t('licence_key_get')}}</div><div class=panel-body><p><a ng-href={{cfg.buy_licence_key}} class=\"btn btn-info btn-lg\">{{_t('btn_licence_buy')}}</a></p></div></div><p>{{_t('licence_upgrade_key')}}</p><div class=\"panel panel-default panel-highlighted\"><div class=panel-heading><i class=\"fa fa-key\"></i> {{_t('licence_key_insert')}}</div><div class=panel-body><div class=\"alert alert-danger\" ng-if=controllerIsZeroUuid><i class=\"fa fa-plug\"></i> {{_t('replug_device')}}</div><div class=cfg-block><div class=form-inline><input class=\"form-control spin-true verify-ctrl\" name=scratch_id id=scratch_id ng-disabled=controllerIsZeroUuid ng-model=formData.scratch_id> <button class=\"btn btn-primary verify-ctrl\" ng-click=getLicense(formData) ng-disabled=controllerIsZeroUuid>{{_t('btn_licence_verify')}}</button></div></div><p ng-if=proccessVerify.message><i class=fa-lg ng-class=proccessVerify.status></i> <span ng-bind=proccessVerify.message></span></p><p ng-if=proccessUpdate.message><i class=fa-lg ng-class=proccessUpdate.status></i> <span ng-bind=proccessUpdate.message></span></p></div></div></div>"
  );


  $templateCache.put('app/views/pages/uzb.html',
    "<div data-ng-controller=UzbController><bb-loader></bb-loader><div class=page-header><h1>{{_t('upgrade_bootloader_firmware')}}</h1></div><p>{{_t('txt_uzb_info')}}</p><bb-alert alert=alert></bb-alert><div><table class=\"table table-striped table-condensed table-hover\" ng-if=\"uzbUpgrade.length > 0\"><tbody><tr ng-repeat=\"v in uzbUpgrade| orderBy:predicate:reverse\" id=row_{{v.id}} ngif=\"v.file == 'bin'\"><td style=\"white-space: nowrap\"><strong>{{v.released | date:'yyyy-MM-dd'}}</strong></td><td>{{v.appVersionMajor + '.' + v.appVersionMinor}}</td><td>{{v.comment}}</td><td class=update-ctrl><button class=\"btn btn-primary\" id=btn_boot_{{v.id}} ng-click=\"upgrade('zme_bootloader_upgrade', cfg.uzb_url + v.fileURL)\" ng-if=\"v.type == 'bootloader'\" ng-disabled=\"rowSpinner['zme_bootloader_upgrade']\"><bb-row-spinner spinner=\"rowSpinner['zme_bootloader_upgrade']\" label=\"_t('upgrade_bootloader')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button> <button class=\"btn btn-info\" id=btn_firmware_{{v.id}} ng-click=\"upgrade('zme_firmware_upgrade', cfg.uzb_url + v.fileURL)\" ng-if=\"v.type=='firmware'\" ng-disabled=\"rowSpinner['zme_firmware_upgrade']\"><bb-row-spinner spinner=\"rowSpinner['zme_firmware_upgrade']\" label=\"_t('upgrade_firmware')\" icon=\"'fa-circle-o'\"></bb-row-spinner></button></td><td><div ng-if=\"v.type === 'bootloader'\"><input class=inputfile type=file name=file id=file{{v.id}} ng-click=\"icons.find = v\" onchange=\"angular.element(this).scope().uploadFile('zme_bootloader_upgrade',this.files)\" ng-disabled=\"rowSpinner['zme_bootloader_upgrade']\"><label for=file{{v.id}} class=\"btn btn-primary\" title=\"{{_t('upload_bootloader')}}\"><bb-row-spinner spinner=\"rowSpinner['zme_bootloader_upgrade']\" label=\"_t('upload_bootloader')\" icon=\"'fa-upload'\"></bb-row-spinner></label></div><div ng-if=\"v.type === 'firmware'\"><input class=inputfile type=file name=file id=file{{v.id}} ng-click=\"icons.find = v\" onchange=\"angular.element(this).scope().uploadFile('zme_firmware_upgrade',this.files)\" ng-disabled=\"rowSpinner['zme_firmware_upgrade']\"><label for=file{{v.id}} class=\"btn btn-info\" title=\"{{_t('upload_firmware')}}\"><bb-row-spinner spinner=\"rowSpinner['zme_firmware_upgrade']\" label=\"_t('upload_firmware')\" icon=\"'fa-upload'\"></bb-row-spinner></label></div></td></tr></tbody></table></div></div>"
  );


  $templateCache.put('app/views/print/print.html',
    "<div class=print-header><p><strong>Network name:</strong> {{cfg.zwavecfg.network_name}}</p><p><strong>Date:</strong> {{ nowDate | date : 'yyyy-MM-dd' }}</p></div><div class=print-section><h2 class=section-title>Device Info und Device Status</h2><div class=print-entry><div ng-include=\"'app/views/device/status.html'\"></div></div><div class=print-entry><div ng-include=\"'app/views/device/type.html'\"></div></div></div><div class=\"print-section page-break\"><h2 class=section-title>Radio Situation</h2><div class=print-entry><div ng-include=\"'app/views/installer/rssi_background.html'\"></div></div><div class=print-entry><div ng-include=\"'app/views/network/statistics.html'\"></div></div></div><div class=\"print-section page-break\"><h2 class=section-title>Link status</h2><div class=print-entry><div ng-include=\"'app/views/network/neighbors.html'\"></div></div><div class=print-entry><div ng-include=\"'app/views/network/linkstatus.html'\"></div></div></div><div class=\"print-section page-break\"><h2 class=section-title>{{ _t('txt_notes') }}</h2><div class=print-entry ng-controller=DataHolderController><span class=newlines ng-if=dataHolder.controller.homeNotes>{{dataHolder.controller.homeNotes|stripTags}} </span>&nbsp;</div></div>"
  );


  $templateCache.put('app/views/settings/modal_timezone.html',
    "<div id=timezoneModal class=appmodal ng-show=modalArr.timezoneModal><div class=appmodal-in><div class=appmodal-header><h3><i class=\"fa fa-exclamation-circle\"></i> {{getCustomCfgVal('title')}}</h3></div><div class=appmodal-body><div class=\"alert alert-warning\"><i class=\"fa fa-spinner fa-spin fa-lg\"></i> {{ _t('z_way_restart', {__val__: settings.countdown,__level__: _t('seconds')})}}</div></div></div></div>"
  );


  $templateCache.put('app/views/settings/settings_app_default.html',
    "<h2 class=accordion-entry-title ng-click=\"expandElement('settingsApp')\"><i class=\"fa fa-cogs\"></i> {{_t('app_settings')}} <i class=\"fa accordion-arrow\" ng-class=\"expand.settingsApp ? 'fa-chevron-up':'fa-chevron-down'\"></i></h2><div class=accordion-entry-ctrl ng-class=\"\" ng-if=expand.settingsApp ng-controller=SettingsAppFormatController><bb-loader></bb-loader><form name=form_settings id=form_settings class=\"form form-page\" ng-submit=storeFormatSettings(settingsFormat.input) novalidate><fieldset><div class=\"form-group form-inline\"><label>{{_t('date_format')}}:</label><select name=date_format name=date_format class=form-control ng-model=settingsFormat.input.date_format><option ng-repeat=\"v in cfg.date_format_list\" value={{v}} ng-selected=\"v === cfg.zwavecfg.date_format\">{{v}}</option></select></div><div class=\"form-group form-inline\"><label>{{_t('time_format')}}:</label><select name=time_format name=time_format class=form-control ng-model=settingsFormat.input.time_format><option ng-repeat=\"v in cfg.time_format_list\" value={{v}} ng-selected=\"v === cfg.zwavecfg.time_format\">{{v}} {{_t('hours')}}</option></select></div></fieldset><fieldset class=submit-entry><button type=submit class=\"btn btn-submit\" title=\"{{_t('btn_save')}}\"><i class=\"fa fa-check\"></i> <span class=btn-name>{{_t('btn_save')}}</span></button></fieldset></form></div>"
  );


  $templateCache.put('app/views/settings/settings_app_installer.html',
    "<h2 class=accordion-entry-title ng-click=\"expandElement('settingsApp')\"><i class=\"fa fa-cogs\"></i> {{_t('app_settings')}} <i class=\"fa accordion-arrow\" ng-class=\"expand.settingsApp ? 'fa-chevron-up':'fa-chevron-down'\"></i></h2><div class=accordion-entry-ctrl ng-class=\"\" ng-if=expand.settingsApp ng-controller=SettingsAppController><bb-loader></bb-loader><form name=form_settings id=form_settings class=\"form form-page\" ng-submit=\"storeSettings(settings.input, $event)\" novalidate><fieldset><div class=\"form-group form-inline\"><label for=network_name>{{_t('cit_identifier')}}:</label><input name=network_name id=network_name class=form-control placeholder=\"{{_t('cit_identifier')}}\" value={{settings.input.cit_identifier}} ng-model=settings.input.cit_identifier></div><div class=\"form-group form-inline\"><label>{{_t('ssid_name')}}:</label><input name=ssid_name id=ssid_name class=form-control placeholder=\"{{_t('ssid_name')}}\" value={{settings.input.ssid_name}} ng-model=settings.input.ssid_name></div><div class=\"form-group form-inline\"><label>{{_t('wifi_password')}}:</label><input name=wifi_password id=wifi_password type=password class=form-control placeholder=\"{{_t('wifi_password')}}\" value={{settings.input.wifi_password}} ng-model=settings.input.wifi_password ng-blur=\"passwordBlur = true\" ng-minlength=8 ng-maxlength=63><bb-validator input-name=form_settings.wifi_password.$error.minlength trans='_t(\"wifi_password_valid\")' has-blur=passwordBlur></bb-validator><bb-validator input-name=form_settings.wifi_password.$error.maxlength trans='_t(\"wifi_password_valid\")' has-blur=passwordBlur></bb-validator></div><div class=\"form-group form-inline\"><label>{{_t('date_format')}}:</label><select name=date_format name=date_format class=form-control ng-model=settings.input.date_format><option ng-repeat=\"v in cfg.date_format_list\" value={{v}} ng-selected=\"v === cfg.zwavecfg.date_format\">{{v}}</option></select></div><div class=\"form-group form-inline\"><label>{{_t('time_format')}}:</label><select name=time_format name=time_format class=form-control ng-model=settings.input.time_format><option ng-repeat=\"v in cfg.time_format_list\" value={{v}} ng-selected=\"v === cfg.zwavecfg.time_format\">{{v}} {{_t('hours')}}</option></select></div></fieldset><fieldset class=submit-entry><button type=submit class=\"btn btn-submit\" title=\"{{_t('btn_save')}}\"><i class=\"fa fa-check\"></i> <span class=btn-name>{{_t('btn_save')}}</span></button></fieldset></form><div ng-include=\"'app/views/settings/modal_timezone.html'\"></div></div>"
  );


  $templateCache.put('app/views/settings/settings_default.html',
    "<div class=page-header><h1>{{_t('settings')}}</h1></div><div class=accordion-entry ng-include=\"'app/views/settings/settings_lang.html'\"></div><div class=accordion-entry ng-include=\"'app/views/settings/settings_app_default.html'\"></div><div class=accordion-entry ng-include=\"'app/views/settings/settings_firmware.html'\"></div><div class=accordion-entry ng-include=\"'app/views/settings/settings_report.html'\"></div>"
  );


  $templateCache.put('app/views/settings/settings_firmware.html',
    "<h2 class=accordion-entry-title ng-click=\"expandElement('settingsFirmware')\"><i class=\"fa fa-level-up\"></i> {{_t('nav_firmware_update')}} <i class=\"fa accordion-arrow\" ng-class=\"expand.settingsFirmware  ? 'fa-chevron-up':'fa-chevron-down'\"></i></h2><div class=accordion-entry-ctrl ng-class=\"\" ng-if=expand.settingsFirmware ng-controller=SettingsFirmwareController><bb-loader></bb-loader><form name=form_firmware id=form_firmware class=\"form form-page\" ng-submit=updateFirmware() ng-if_=!firmwareUpdate.isUpToDate><fieldset><p class=form-control-static><span ng-bind=\"_t('current_firmware')\"></span>: {{firmwareUpdate.softwareCurrentVersion}}</p><div class=form-group><bb-help-text trans=\"_t('firmware_update_info')\"></bb-help-text></div></fieldset><fieldset class=submit-entry><button type=button class=\"btn btn-submit\" title=\"{{_t('update_to_latest')}}\" ng-click=\"setAccess('?allow_access=1',true);handleModal('firmwareUpdateModal', $event)\"><i class=\"fa fa-level-up\"></i> <span class=btn-name>{{_t('update_to_latest')}} ({{firmwareUpdate.softwareLatestVersion}})</span></button></fieldset></form><div id=firmwareUpdateModal class=\"appmodal appmodal-100\" ng-if=\"modalArr.firmwareUpdateModal && firmwareUpdate.show\"><div class=appmodal-in><div class=appmodal-header><span class=appmodal-close ng-click=\"redirectAfterUpdate();setAccess('?allow_access=0');handleModal('firmwareUpdateModal', $event)\"><i class=\"fa fa-times\"></i></span><h3>{{_t('nav_firmware_update')}}</h3></div><div class=\"appmodal-body text-center\"><iframe ng-src={{firmwareUpdate.url}} height=600 style=\"width: 100%\" ng-if=firmwareUpdate.loaded></iframe></div></div></div><div ng-include=\"'app/views/settings/modal_timezone.html'\"></div></div>"
  );


  $templateCache.put('app/views/settings/settings_installer.html',
    "<div class=page-header><h1>{{_t('settings')}}</h1></div><div class=accordion-entry ng-include=\"'app/views/settings/settings_lang.html'\"></div><div class=accordion-entry ng-include=\"'app/views/settings/settings_app_installer.html'\"></div><div class=accordion-entry ng-include=\"'app/views/settings/settings_firmware.html'\"></div><div class=accordion-entry ng-include=\"'app/views/settings/settings_report.html'\"></div>"
  );


  $templateCache.put('app/views/settings/settings_lang.html',
    "<h2 class=\"accordion-entry-title expanded-only_\" ng-init_=\"expandElement('settingsLang')\" ng-click=\"expandElement('settingsLang')\"><i class=\"fa fa-globe\"></i> {{_t('language')}} <i class=\"fa accordion-arrow\" ng-class=\"expand.settingsLang  ? 'fa-chevron-up':'fa-chevron-down'\"></i></h2><div class=accordion-entry-ctrl ng-class=\"\" ng-if=expand.settingsLang ng-controller=SettingsLangController><div class=form-page><div class=\"fieldset settings-lang\"><a href=\"\" title={{v}} ng-repeat=\"v in lang_list\" ng-click=setLang(v) ng-class=\"v === lang ? 'active': ''\"><img ng-src=app/images/flags/{{v}}.png alt=\"{{ v }}\"></a></div></div></div>"
  );


  $templateCache.put('app/views/settings/settings_report.html',
    "<h2 class=accordion-entry-title ng-click=\"expandElement('report')\"><i class=\"fa fa-bug\"></i> <span ng-bind=\"_t('nav_report')\"></span> <i class=\"fa accordion-arrow\" ng-class=\"expand.report  ? 'fa-chevron-up':'fa-chevron-down'\"></i></h2><div class=accordion-entry-ctrl ng-if=expand.report ng-controller=SettingsReportController><bb-loader></bb-loader><form name=form_report id=form_profile class=\"form form-page\" ng-submit=sendReport(form_report,input) novalidate><fieldset><div class=\"alert alert-warning\"><i class=\"fa fa-exclamation-circle\"></i> {{_t('bugreport_info')}}</div><div class=form-group><textarea name=content id=content class=\"form-control report-content\" ng-blur=\"contentBlur = true\" ng-model=input.content ng-required=true></textarea><bb-validator input-name=form_report.content.$error.required trans='_t(\"field_required\")' has-blur=contentBlur></bb-validator></div><div class=\"form-group form-inline\"><label>{{_t('lb_email')}}:</label><input name=email id=email type=email class=form-control value={{input.email}} ng-blur=\"emailBlur = true\" ng-model=input.email ng-required=true><bb-validator input-name=form_report.email.$error.required trans='_t(\"email_invalid\")' has-blur=emailBlur></bb-validator></div><div class=\"form-group form-inline last\"><input name=log id=log type=checkbox ng-model=input.log ng-value=true ng-change=\"showLogWarning(input.log ? _t('include_log_warning'):false)\"><label>{{_t('include_log')}}</label></div></fieldset><fieldset class=submit-entry><button type=submit class=\"btn btn-submit\" title=\"{{_t('lb_submit')}}\" ng-disabled=form_report.$invalid><i class=\"fa fa-check\"></i> <span class=btn-name>{{_t('lb_submit')}}</span></button></fieldset></form></div>"
  );

}]);

/**
 * @overview Angular module qAllSettled executes a number of operations concurrently.
 */
'use strict';
/**
 * This method is often used in its static form on arrays of promises, in order to execute a number of operations concurrently 
 * and be notified when they all finish, regardless of success or failure.
 * Returns a promise that is fulfilled with an array of promise state snapshots,
 * but only after all the original promises have settled, i.e. become either fulfilled or rejected.
 * @method qAllSettled
 */
angular.module('qAllSettled', []).config(function($provide) {
  $provide.decorator('$q', function($delegate) {
    var $q = $delegate;
     $q.allSettled = function(promises) {
        var wrappedPromises = angular.isArray(promises) ? promises.slice(0) : {};
        angular.forEach(promises, function(promise, index){
          wrappedPromises[index] = promise.then(function(value){
            return { state: 'fulfilled', value: value };
          }, function(reason){
            return { state: 'rejected', reason: reason };
          });
        });
        return $q.all(wrappedPromises);
      };
    return $q;
  });
});
/**
 * Application directives
 * @author Martin Vach
 */

/**
 * Window history back
 * @class bbGoBack
 */
angApp.directive('bbGoBack', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                $window.history.back();
            });
        }
    };
}]);

/**
 * Displays an alert message within the div
 * @class bbAlert
 */
angApp.directive('bbAlert', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {alert: '='},
        template: '<div class="alert" ng-if="alert.message" ng-class="alert.status" ng-cloak>'
                + '<i class="fa fa-lg" ng-class="alert.icon"></i> <span ng-bind-html="alert.message|toTrusted"></span>'
                + '</div>'
    };
});

/**
 * Displays an alert message within the span
 * @class bbAlertText
 */
angApp.directive('bbAlertText', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {alert: '='},
        template: '<span class="alert-text" ng-if="alert.message" ng-class="alert.status">'
        + '<i class="fa" ng-class="alert.icon"></i> <span ng-bind-html="alert.message|toTrusted"></span>'
        + '</span>'
    };
});
/**
 * Handles and displays sort by buttons
 * @class sortBy
 */
angApp.directive('sortBy', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            callback: '&',
            obj: '=',
            label: '=',
            field: '='
        },
        template: '<span class="order-by clickable">{{label}}&nbsp<span ng-show="obj.field == field">'
        + '<i ng-show="!obj.reverse" class="fa fa-sort-asc"></i><i ng-show="obj.reverse" class="fa fa-sort-desc"></i>'
        + '</span></span>',
        link: function(scope, element, attrs) {
            element.bind('click', function (e) {
                scope.callback({field: scope.field});
            });

        },
    };
});
/**
 * Displays a help text
 * @class bbHelpText
 */
angApp.directive('bbHelpText', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            trans: '=',
            display: '=',
            icon: '='
        },
        template: '<span class="help-text" ng-class="display"><i class="fa text-info" ng-class="icon ? icon : \' fa-info-circle\'"></i> {{trans}}</span>'
    };
});

/**
 * Displays a page loader
 * @class bbLoader
 */
angApp.directive('bbLoader', function () {
    return {
        restrict: "E",
        replace: true,
        template: '<div id="loading" ng-show="loading" ng-class="loading.status"><div class="loading-in">'
                + '<i class="fa fa-lg" ng-class="loading.icon"></i> <span ng-bind-html="loading.message|toTrusted"></span>'
                + '</div></div>'
    };
});

/**
 * Displays a dta/time in the table row
 * @class bbRowSpinner
 */
angApp.directive('bbDateTime', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            obj: '=',
            updated: '='
        },
        template: '<span class="is-updated-{{updated}}" title="Update: {{obj.date}} {{obj.time}}, invalid: {{obj.invalidateTime}}">' +
        '{{obj.today}}' +
        '</span>'
    };
});

/**
 * Displays a spinner in the table row
 * @class bbRowSpinner
 */
angApp.directive('bbRowSpinner', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            label: '=',
            spinner: '=',
            icon: '='
        },
        template: '<span title="{{label}}">' +
        '<i class="fa " ng-class="spinner ? \'fa-spinner fa-spin\':icon"></i>' +
        '&nbsp;<span class="btn-label">' +
        '{{label}}' +
        '</span></span>'
    };
});

angApp.directive('btnSpinner', function () {
    return {
        restrict: "E",
        replace: true,
        template: '<i class="fa fa-spinner fa-spin fa-lg" style="display:none;"></i>'
    };
});

angApp.directive('tooltip', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).hover(function () {
                // on mouseenter
                $(element).tooltip('show');
            }, function () {
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});
/**
 * Hide collapsed navi after click on mobile devices
 */
angApp.directive('collapseNavbar', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).click(function () {
                $("#nav_collapse").removeClass("in").addClass("collapse");
            });
        }
    };
});

/**
 * Displays a validation error
 * @class bbValidator
 */
angApp.directive('bbValidator', function ($window) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            inputName: '=',
            trans: '=',
            hasBlur: '='
        },
        template: '<div class="valid-error text-danger" ng-if="inputName && !inputName.$pristine && hasBlur">*{{trans}}</div>'
    };
});

angApp.directive('draggable', ['$document', function ($document) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                var startX, startY, initialMouseX, initialMouseY;
                elm.css({position: 'absolute'});

                elm.bind('mousedown', function ($event) {
                    startX = elm.prop('offsetLeft');
                    startY = elm.prop('offsetTop');
                    initialMouseX = $event.clientX;
                    initialMouseY = $event.clientY;
                    $document.bind('mousemove', mousemove);
                    $document.bind('mouseup', mouseup);
                    return false;
                });

                function mousemove($event) {
                    var dx = $event.clientX - initialMouseX;
                    var dy = $event.clientY - initialMouseY;
                    elm.css({
                        top: startY + dy + 'px',
                        left: startX + dx + 'px'
                    });
                    return false;
                }

                function mouseup() {
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }
            }
        };
    }]);

// Switch all icons
//@todo: move to filters
angApp.directive('switchAllIcon', function () {
    return {
        restrict: "E",
        replace: true,
        template: '<img src="{{src}}" />',
        link: function (scope, elem, attr) {
            var src;
            if (attr.hasall !== null) {
                switch (parseInt(attr.hasall, 10)) {
                    case 0:
                        src = 'app/images/icons/switch_all_xx_xxx.png';
                        break;

                    case 1:
                        src = 'app/images/icons/switch_all_xx_off.png';
                        break;

                    case 2:
                        src = 'app/images/icons/switch_all_on_xxx.png';
                        break;

                    case 255:
                        src = 'app/images/icons/switch_all_on_off.png';
                        break;

                    default:
                        src = 'app/images/icons/1x1.png';
                        break;
                }
            }
            ;
            scope.src = src;
        }
    };
});


// Routyng icons
//@todo: move to filters
angApp.directive('routingTypeIcon', function () {
    return {
        restrict: "E",
        replace: true,
        template: '<i class="fa {{cls}} fa-lg" title="{{title}}"></i>',
        link: function ($scope, elem, attr) {
            var src;
            var title;
            var cls;
            if (attr.nodeId !== null && $scope.ZWaveAPIData) {
                var node = $scope.ZWaveAPIData.devices[attr.nodeId];

                var isListening = node.data.isListening.value;
                var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
                var hasWakeup = 0x84 in node.instances[0].commandClasses;
                var hasBattery = 0x80 in node.instances[0].commandClasses;
                var isPortableRemoteControl = (node.data.deviceTypeString.value == "Portable Remote Controller");

                if (isListening) { // mains powered
                    cls = 'fa-bolt text-warning';
                     title = $scope._t('conf_apply_mains');
                } else if (hasWakeup) {
                    cls = 'fa-battery-full text-success';
                    title = $scope._t('battery_powered_device');
                } else if (isFLiRS) {
                    cls = 'fa-fire text-info';
                    title = $scope._t('FLiRS_device');
                } else if (isPortableRemoteControl) {
                    cls = 'fa-feed text-primary';
                    title = $scope._t('battery_operated_remote_control');
                } else {
                    cls = '';
                    title = "";
                }
            }
            $scope.src = src;
            $scope.title = title;
            $scope.cls = cls;
        }
    };
});

angApp.directive('expertCommandInput', function (cfg,$filter) {
    // Get text input
    function getText(label, value, min, max, name) {
        var input = '';
        var inName = $filter('stringToSlug')(name ? name : label);
        input += '<label>' + label + '</label> ';
        input += '<input class="form-control" name="' + inName + '" type="text" class="form-control" value="' + value + '" title=" min: ' + min + ', max: ' + max + '" />';
        return input;
    }
    // Get node
    function getNode(label, devices, currValue, name) {
        var input = '';
        var inName = $filter('stringToSlug')(name ? name : label);

        input += '<label>' + label + '</label> ';
        input += '<select name="select_' + inName + '" class="form-control">';
        angular.forEach(devices, function (v, k) {
            var selected = (v.id == currValue ? ' selected' : '');
            input += '<option value="' + v.id + '"' + selected + '>' + v.name + '</option>';
        });

        input += '</select>';

        return input;
    }

    // Get enumerators
    function getEnum(label, enums, defaultValue, name, hideRadio, currValue) {

        var input = '';
        if (!enums) {
            return;
        }

        //var inName = $filter('stringToSlug')(name ? name : label);
        input += '<label>' + label + '</label><br />';
        var cnt = 1;
        var value = (currValue !== undefined ? currValue : defaultValue);
        angular.forEach(enums.enumof, function (v, k) {
            //var inName =  $filter('stringToSlug')(name ? v.name : label);
            var inName = (name ? name + '_' +label : v.name);// + '_' +label;
           /* var inName = v.name;
                if(name){
                    inName = name  + '_' +label;
                }*/
            //console.log(inName);
            var title = v.label || '';
            var type = v.type;
            var enumVal = $filter('hasNode')(v, 'type.fix.value');
            var checked = (cnt == 1 ? ' checked="checked"' : '');
            var isCurrent = (cnt == 1 ? ' commads-is-current' : '');

            if ('fix' in type) {
                if (defaultValue) {
                    if (isNaN(parseInt(defaultValue, 10))) {
                        isCurrent = (v.label == defaultValue ? ' commads-is-current' : '');
                    } else {
                        isCurrent = '';
                    }
                }

                if (!isNaN(parseInt(value, 10))) {
                    checked = (enumVal == value ? ' checked="checked"' : '');
                }
                input += '<input name="' + inName + '" class="commands-data-chbx" type="radio" value="' + type.fix.value + '"' + checked + ' /> (' + type.fix.value + ') <span class="commands-label' + isCurrent + '">' + title + '</span><br />';
            } else if ('range' in type) {
                //var textName =  $filter('stringToSlug')(name ? v.textName : label);
                var textName = v.textName || inName;
                var min = type.range.min;
                var max = type.range.max;
                var disabled = ' disabled="true"';
                var setVal = (value ? value : min);
                if (defaultValue) {
                    if (defaultValue >= min && defaultValue <= max) {
                        disabled = '';
                        isCurrent = ' commads-is-current';
                    }

                } else {
                    isCurrent = '';
                }
                if (value) {
                    if (value >= min && value <= max) {
                        checked = ' checked="checked"';
                        disabled = '';
                    }

                } else {
                    checked = '';
                }

                if (hideRadio) {
                    disabled = '';
                }

//                input += '<input name="radio_' + inName + '" class="commands-data-chbx" type="radio" value=""' + checked + ' /> ' + title + ' <input type="text" name="radio_' + inName + '_txt" class="form-control commands-data-txt-chbx" value="' + min + '" title=" min: ' + min + ', max: ' + max + '"'+ disabled + ' /><br />'; 
                if (!hideRadio) {
                    input += '<div><input name="' + inName + '" class="commands-data-chbx commands-data-chbx-hastxt" type="radio" value="N/A"' + checked + ' /> <span class="commands-label' + isCurrent + '">' + title + '</span> <input type="text" name="' + textName + '" class="form-control commands-data-txt-chbx" value="' + setVal + '" title=" min: ' + min + ', max: ' + max + '"' + disabled + ' /> (min: ' + min + ', max: ' + max + ')</div>';
                } else {
                    input += (title !== '' ? '<span class="commands-title-block">' + title + ' </span>' : '') + '<input type="text" name="' + textName + '" class="form-control" value="' + setVal + '" title=" min: ' + min + ', max: ' + max + '" /> (min: ' + min + ', max: ' + max + ')<br />';
                }


            } else {
                input = '';
            }
            cnt++;

        });
        return input;
    }

    // Get dropdown list
    function getDropdown(label, enums, defaultValue, name, currValue) {
        var input = '';
        var cValue = (currValue !== undefined ? currValue : defaultValue);
        var inName = $filter('stringToSlug')(name ? name : label);
        input += '<label>' + label + '</label><br />';
        input += '<select name="select_' + inName + '" class="form-control">';
        var cnt = 1;
        angular.forEach(enums.enumof, function (v, k) {
            var title = v.label;
            var type = v.type;
            var value;
            if ('fix' in type) {
                value = type.fix.value;
            } else if ('range' in type) {
                value = type.range.min;
            }

            if (value) {
                var selected = (type.fix.value == cValue ? ' selected' : '');
            }
            input += '<option value="' + value + '"' + selected + '> ' + title + '</option>';
            cnt++;

        });
        input += '</select">';
        return input;
    }

    // Get constant 
    function getConstant(label, type, defaultValue, name, currValue) {
        var input = '';
        var inName = $filter('stringToSlug')(name ? name : label);
        input += '<label>' + label + '</label><br />';
        if (type.constant.length > 0) {
            input += '<select name="select_' + inName + '" class="form-control">';
            angular.forEach(type.constant, function (v, k) {

                input += '<option value="' + v.type.constant.value + '"> ' + v.label + '</option>';
            });


            input += '</select">';
        }
        //console.log(type,defaultValue);
        input += '<em>Constant type</em>';
        return input;
    }
    // Get string
    function getString(label, value, name) {
        var input = '';
        var inName = $filter('stringToSlug')(name ? name : label);
        input += '<label>' + label + '</label> ';
        input += '<input class="form-control" name="' + inName + '" type="text" class="form-control" value="' + value + '" />';
        return input;
    }

    // Get bitset
    function getBitset(label, enums, currValue, name) {
        if (!enums) {
            return;
        }
        var input = '';
        var bitArray = $filter('getBitArray')(currValue, 32);
        input += '<label>' + label + '</label><br />';
        var setVal = 0;//(currValue !== undefined ? currValue : 0);
        angular.forEach(enums.bitset, function (v, k) {
            // var inName =  $filter('stringToSlug')(name ? v.name : label);
            var inName = name ? name : v.name;
            var title = v.label || '---';
            var type = v.type;
            var inBitArray = bitArray[k];
            var checked = (inBitArray ? ' checked="checked"' : '');
            if ('bitrange' in type) {
                var min = type.bitrange.bit_from;
                var max = type.bitrange.bit_to;
                input += '<div><input type="text" name="' + inName + '" class="form-control commands-data-txt-chbx_" value="' + setVal + '" title=" min: ' + min + ', max: ' + max + '" /> (min: ' + min + ', max: ' + max + ')</div>';
            } else if ('bitcheck' in type) {
                input += '<input name="' + inName + '" class="commands-data-chbx" type="checkbox" value="' + type.bitcheck.bit + '"' + checked + ' /> (' + type.bitcheck.bit + ')'
                        + '<span class="commands-label"> ' + title + '</span><br />';
            } else {
                input += '';
            }
        });
        return input;
    }

    // Get default
    function getDefault(label) {

        var input = '';
        input += '<label>' + label + '</label><br />';
        return input;
    }

    return {
        restrict: "E",
        replace: true,
        template: '<div class="form-group" ng-bind-html="input | toTrusted"></div>',
        scope: {
            collection: '=',
            devices: '=',
            getNodeDevices: '=',
            values: '=',
            isDropdown: '=',
            defaultValue: '=',
            showDefaultValue: '=',
            currValue: '=',
            currNodeValue: '=',
            name: '=',
            divId: '='
        },
        link: function (scope, element, attrs) {
            var input = '';
            if (!scope.collection) {
                return;
            }
            var label = scope.collection.label;
            var type = scope.collection.type;
            //var name = (scope.collection.name || scope.name);
            var name = scope.name;
            var hideRadio = scope.collection.hideRadio;
            if (scope.isDropdown) {
                input = getDropdown(label, type, scope.defaultValue, name, scope.currValue);
                scope.input = input;
                return;
            }
            //if (label && type) {
            if (type) {
                if ('range' in type) {
                    input = getText(label, scope.values, type.range.min, type.range.max, name);
                } else if ('node' in type) {
                    input = getNode(label, scope.getNodeDevices(), scope.currNodeValue, name);
                } else if ('enumof' in type) {
                    input = getEnum(label, type, scope.defaultValue, name, hideRadio, scope.currValue);
                } else if ('bitset' in type) {
                    input = getBitset(label, type, scope.currValue, name);
                } else if ('constant' in type) {
                    input = getConstant(label, type, scope.defaultValue, name, scope.currValue);
                } else if ('string' in type) {
                    input = getString(label, scope.values, name, scope.currValue);
                } else {
                    input = getDefault(label);
                }
                scope.input = input;
                return;
            }

        }

    };
});

angApp.directive('configDefaultValue', function () {
    return {
        restrict: "E",
        replace: true,
        template: '<span class="default-value-format"> {{input}}</span>',
        scope: {
            collection: '=',
            defaultValue: '=',
            showDefaultValue: '='
        },
        link: function (scope, element, attrs) {
            scope.input = scope.showDefaultValue;
            var input = '';
            if (!scope.collection) {
                return;
            }
            var label = scope.collection.label;
            var type = scope.collection.type;
            var name = scope.collection.name;
            var hideRadio = scope.collection.hideRadio;
            if (type) {
                if ('range' in type) {
                    //input = getText(label, scope.values, type.range.min, type.range.max, name);
                } else if ('node' in type) {
                    //input = getNode(label, scope.getNodeDevices(), 'null', name);
                } else if ('enumof' in type) {
                    input = getEnum(type, scope.defaultValue, scope.showDefaultValue);

                } else if ('constant' in type) {
                    //input = getConstant(label, type, scope.defaultValue, name);
                } else if ('string' in type) {
                    //input = getString(label, scope.values, name);
                } else if ('bitset' in type) {
                    input = scope.defaultValue;
                } else {
                    input = scope.showDefaultValue;
                }
                scope.input = input;

                return;
            }


        }

    };

    // Get enumerators
    function getEnum(enums, defaultValue, showDefaultValue) {
        //console.log(enums)
        var input = showDefaultValue;
        if (!enums) {
            return;
        }
        angular.forEach(enums.enumof, function (v, k) {

            var title = v.label ? v.label : showDefaultValue;
            var type = v.type;
            // debugger; 
            if ('fix' in type) {
                if (type.fix.value == showDefaultValue) {
                    input = title;
                    return;
                }

            } else if ('range' in type) {
                var min = type.range.min;
                var max = type.range.max;
                var setVal = (defaultValue ? defaultValue : min);
                if (setVal == showDefaultValue) {
                    input = showDefaultValue;
                    return;
                }
            }

        });

        return input;
    }

    // Get bitset
    function getBitset(enums, defaultValue, showDefaultValue) {
        //console.log(enums)
        var input = showDefaultValue;
        if (!enums) {
            return;
        }
        angular.forEach(enums.enumof, function (v, k) {

            var title = v.label ? v.label : showDefaultValue;
            var type = v.type;
            // debugger; 
            if ('fix' in type) {
                if (type.fix.value == showDefaultValue) {
                    input = title;
                    return;
                }

            } else if ('range' in type) {
                var min = type.range.min;
                var max = type.range.max;
                var setVal = (defaultValue ? defaultValue : min);
                if (setVal == showDefaultValue) {
                    input = showDefaultValue;
                    return;
                }
            }

        });

        return input;
    }
});

angApp.directive('configValueTitle', function () {
    return {
        restrict: "A",
        //replace: true,
        template: '<span title="{{showValue}}">{{input}}</span>',
        scope: {
            collection: '=',
            showValue: '='
        },
        link: function (scope, element, attrs) {
            scope.input = scope.showValue;
            var input = '';
            if (!scope.collection) {
                return;
            }
            var type = scope.collection.type;

            if (type) {
                if ('range' in type) {
                    //input = getText(label, scope.values, type.range.min, type.range.max, name);
                } else if ('node' in type) {
                    //input = getNode(label, scope.getNodeDevices(), 'null', name);
                } else if ('enumof' in type) {
                    input = getEnum(type, scope.showValue);

                } else if ('constant' in type) {
                    //input = getConstant(label, type, scope.defaultValue, name);
                } else if ('string' in type) {
                    //input = getString(label, scope.values, name);
                } else {
                    input = scope.showValue;
                }
                scope.input = input;

                return;
            }


        }

    };

    // Get enumerators
    function getEnum(enums, showValue) {
        //console.log(enums)
        var input = showValue;
        if (!enums) {
            return;
        }
        angular.forEach(enums.enumof, function (v, k) {

            var title = v.label ? v.label : showValue;
            var type = v.type;
            // debugger; 
            if ('fix' in type) {
                if (type.fix.value == showValue) {
                    input = title;
                    return;
                }

            } else if ('range' in type) {
                var min = type.range.min;
                var max = type.range.max;
                var setVal = (showValue ? showValue : min);
                if (setVal == showValue) {
                    input = showValue;
                    return;
                }
            }

        });

        return input;
    }
});

angApp.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

/**
 * Catch a key event
 * @class bbKeyEvent
 */
angApp.directive('bbKeyEvent', function () {
    return function (scope, element, attrs) {
        element.bind("keyup", function (event) {
            if (event.which !== 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.bbKeyEvent);
                });

                event.preventDefault();
            }
        });
    };
});

/*** Fixes ***/
// js holder fix
angApp.directive('jsholderFix', function () {
    return {
        link: function (scope, element, attrs) {
            Holder.run({images: element[0], nocss: true});
        }
    };
});


/*
 *  Angular RangeSlider Directive
 * 
 *  Version: 0.0.7
 *
 *  Author: Daniel Crisp, danielcrisp.com
 *
 *  The rangeSlider has been styled to match the default styling
 *  of form elements styled using Twitter's Bootstrap
 * 
 *  Originally forked from https://github.com/leongersen/noUiSlider
 *

    This code is released under the MIT Licence - http://opensource.org/licenses/MIT

    Copyright (c) 2013 Daniel Crisp

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

*/

(function () {
    'use strict';

    /**
     * RangeSlider, allows user to define a range of values using a slider
     * Touch friendly.
     * @directive
     */
   angApp.directive('rangeSlider', ["$document", "$filter", "$log", function($document, $filter, $log) {

        // test for mouse, pointer or touch
        var EVENT = window.PointerEvent ? 1 : (window.MSPointerEvent ? 2 : ('ontouchend' in document ? 3 : 4)), // 1 = IE11, 2 = IE10, 3 = touch, 4 = mouse
            eventNamespace = '.rangeSlider',

            defaults = {
                disabled: false,
                orientation: 'horizontal',
                step: 0,
                decimalPlaces: 0,
                showValues: true,
                preventEqualMinMax: false
            },

            onEvent = (EVENT === 1 ? 'pointerdown' : (EVENT === 2 ? 'MSPointerDown' : (EVENT === 3 ? 'touchstart' : 'mousedown'))) + eventNamespace,
            moveEvent = (EVENT === 1 ? 'pointermove' : (EVENT === 2 ? 'MSPointerMove' : (EVENT === 3 ? 'touchmove' : 'mousemove'))) + eventNamespace,
            offEvent = (EVENT === 1 ? 'pointerup' : (EVENT === 2 ? 'MSPointerUp' : (EVENT === 3 ? 'touchend' : 'mouseup'))) + eventNamespace,

            // get standarised clientX and clientY
            client = function (f) {
                try {
                    return [(f.clientX || f.originalEvent.clientX || f.originalEvent.touches[0].clientX), (f.clientY || f.originalEvent.clientY || f.originalEvent.touches[0].clientY)];
                } catch (e) {
                    return ['x', 'y'];
                }
            },

            restrict = function (value) {

                // normalize so it can't move out of bounds
                return (value < 0 ? 0 : (value > 100 ? 100 : value));

            },

            isNumber = function (n) {
               // console.log(n);
                return !isNaN(parseFloat(n)) && isFinite(n);
            };

        if (EVENT < 4) {
            // some sort of touch has been detected
            angular.element('html').addClass('ngrs-touch');
        } else {
            angular.element('html').addClass('ngrs-no-touch');
        }


        return {
            restrict: 'A',
            replace: true,
            template: ['<div class="ngrs-range-slider">',
                         '<div class="ngrs-runner">',
                           '<div class="ngrs-handle ngrs-handle-min"><i></i></div>',
                           '<div class="ngrs-handle ngrs-handle-max"><i></i></div>',
                           '<div class="ngrs-join"></div>',
                         '</div>',
                         '<div class="ngrs-value ngrs-value-min" ng-show="showValues">{{filteredModelMin}}</div>',
                         '<div class="ngrs-value ngrs-value-max" ng-show="showValues">{{filteredModelMax}}</div>',
                       '</div>'].join(''),
            scope: {
                disabled: '=?',
                min: '=',
                max: '=',
                modelMin: '=?',
                modelMax: '=?',
                onHandleDown: '&', // calls optional function when handle is grabbed
                onHandleUp: '&', // calls optional function when handle is released 
                orientation: '@', // options: horizontal | vertical | vertical left | vertical right
                step: '@',
                decimalPlaces: '@',
                filter: '@',
                filterOptions: '@',
                showValues: '@',
                pinHandle: '@',
                preventEqualMinMax: '@'
            },
            link: function(scope, element, attrs, controller) {

                /** 
                 *  FIND ELEMENTS
                 */

                var $slider = angular.element(element),
                    handles = [element.find('.ngrs-handle-min'), element.find('.ngrs-handle-max')],
                    join = element.find('.ngrs-join'),
                    pos = 'left',
                    posOpp = 'right',
                    orientation = 0,
                    allowedRange = [0, 0],
                    range = 0;

                // filtered
                scope.filteredModelMin = scope.modelMin;
                scope.filteredModelMax = scope.modelMax;

                /**
                 *  FALL BACK TO DEFAULTS FOR SOME ATTRIBUTES
                 */

                attrs.$observe('disabled', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.disabled = defaults.disabled;
                    }

                    scope.$watch('disabled', setDisabledStatus);
                });

                attrs.$observe('orientation', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.orientation = defaults.orientation;
                    }

                    var classNames = scope.orientation.split(' '),
                        useClass;

                    for (var i = 0, l = classNames.length; i < l; i++) {
                        classNames[i] = 'ngrs-' + classNames[i];
                    }

                    useClass = classNames.join(' ');

                    // add class to element
                    $slider.addClass(useClass);

                    // update pos
                    if (scope.orientation === 'vertical' || scope.orientation === 'vertical left' || scope.orientation === 'vertical right') {
                        pos = 'top';
                        posOpp = 'bottom';
                        orientation = 1;
                    }
                });

                attrs.$observe('step', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.step = defaults.step;
                    }
                });

                attrs.$observe('decimalPlaces', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.decimalPlaces = defaults.decimalPlaces;
                    }
                });

                attrs.$observe('showValues', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.showValues = defaults.showValues;
                    } else {
                        if (val === 'false') {
                            scope.showValues = false;
                        } else {
                            scope.showValues = true;
                        }
                    }
                });

                attrs.$observe('pinHandle', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.pinHandle = null;
                    } else {
                        if (val === 'min' || val === 'max') {
                            scope.pinHandle = val;
                        } else {
                            scope.pinHandle = null;
                        }
                    }

                    scope.$watch('pinHandle', setPinHandle);
                });

                attrs.$observe('preventEqualMinMax', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.preventEqualMinMax = defaults.preventEqualMinMax;
                    } else {
                        if (val === 'false') {
                            scope.preventEqualMinMax = false;
                        } else {
                            scope.preventEqualMinMax = true;
                        }
                    }
                });



                // listen for changes to values
                scope.$watch('min', setMinMax);
                scope.$watch('max', setMinMax);

                scope.$watch('modelMin', setModelMinMax);
                scope.$watch('modelMax', setModelMinMax);

                /**
                 * HANDLE CHANGES
                 */

                function setPinHandle (status) {
                    if (status === "min") {
                        angular.element(handles[0]).css('display', 'none');
                        angular.element(handles[1]).css('display', 'block');
                    } else if (status === "max") {
                        angular.element(handles[0]).css('display', 'block');
                        angular.element(handles[1]).css('display', 'none');
                    } else {
                        angular.element(handles[0]).css('display', 'block');
                        angular.element(handles[1]).css('display', 'block');
                    }
                }

                function setDisabledStatus (status) {
                    if (status) {
                        $slider.addClass('disabled');
                    } else {
                        $slider.removeClass('disabled');
                    }
                }

                function setMinMax () {

                    if (scope.min > scope.max) {
                        throwError('min must be less than or equal to max');
                    }

                    // only do stuff when both values are ready
                    if (angular.isDefined(scope.min) && angular.isDefined(scope.max)) {

                        // make sure they are numbers
                        if (!isNumber(scope.min)) {
                            throwError('min must be a number');
                        }

                        if (!isNumber(scope.max)) {
                            throwError('max must be a number');
                        }

                        range = scope.max - scope.min;
                        allowedRange = [scope.min, scope.max];

                        // update models too
                        setModelMinMax();

                    }
                }

                function setModelMinMax () {

                    if (scope.modelMin > scope.modelMax) {
                        throwWarning('modelMin must be less than or equal to modelMax');
                        // reset values to correct
                        scope.modelMin = scope.modelMax;
                    }

                    // only do stuff when both values are ready
                    if (
                        (angular.isDefined(scope.modelMin) || scope.pinHandle === 'min') &&
                        (angular.isDefined(scope.modelMax) || scope.pinHandle === 'max')
                    ) {

                        // make sure they are numbers
                        if (!isNumber(scope.modelMin)) {
                            if (scope.pinHandle !== 'min') {
                                throwWarning('modelMin must be a number');
                            }
                            scope.modelMin = scope.min;
                        }

                        if (!isNumber(scope.modelMax)) {
                            if (scope.pinHandle !== 'max') {
                                throwWarning('modelMax must be a number');
                            }
                            scope.modelMax = scope.max;
                        }

                        var handle1pos = restrict(((scope.modelMin - scope.min) / range) * 100),
                            handle2pos = restrict(((scope.modelMax - scope.min) / range) * 100);

                        // make sure the model values are within the allowed range
                        scope.modelMin = Math.max(scope.min, scope.modelMin);
                        scope.modelMax = Math.min(scope.max, scope.modelMax);

                        if (scope.filter) {
                            scope.filteredModelMin = $filter(scope.filter)(scope.modelMin, scope.filterOptions);
                            scope.filteredModelMax = $filter(scope.filter)(scope.modelMax, scope.filterOptions);
                        } else {
                            scope.filteredModelMin = scope.modelMin;
                            scope.filteredModelMax = scope.modelMax;
                        }

                        // check for no range
                        if (scope.min === scope.max && scope.modelMin == scope.modelMax) {

                            // reposition handles
                            angular.element(handles[0]).css(pos, '0%');
                            angular.element(handles[1]).css(pos, '100%');

                            // reposition join
                            angular.element(join).css(pos, '0%').css(posOpp, '0%');

                        } else {

                            // reposition handles
                            angular.element(handles[0]).css(pos, handle1pos + '%');
                            angular.element(handles[1]).css(pos, handle2pos + '%');

                            // reposition join
                            angular.element(join).css(pos, handle1pos + '%').css(posOpp, (100 - handle2pos) + '%');

                            // ensure min handle can't be hidden behind max handle
                            if (handle1pos >  95) {
                                angular.element(handles[0]).css('z-index', 3);
                            }
                        }

                    }

                }

                function handleMove(index) {

                    var $handle = handles[index];

                    // on mousedown / touchstart
                    $handle.bind(onEvent + 'X', function (event) {

                        var handleDownClass = (index === 0 ? 'ngrs-handle-min' : 'ngrs-handle-max') + '-down',
                            unbind = $handle.add($document).add('body'),
                            modelValue = (index === 0 ? scope.modelMin : scope.modelMax) - scope.min,
                            originalPosition = (modelValue / range) * 100,
                            originalClick = client(event),
                            previousClick = originalClick,
                            previousProposal = false;

                        if (angular.isFunction(scope.onHandleDown)) {
                            scope.onHandleDown();
                        }

                        // stop user accidentally selecting stuff
                        angular.element('body').bind('selectstart' + eventNamespace, function () {
                            return false;
                        });

                        // only do stuff if we are disabled
                        if (!scope.disabled) {

                            // add down class
                            $handle.addClass('ngrs-down');

                            $slider.addClass('ngrs-focus ' + handleDownClass);

                            // add touch class for MS styling
                            angular.element('body').addClass('ngrs-touching');

                            // listen for mousemove / touchmove document events
                            $document.bind(moveEvent, function (e) {
                                // prevent default
                                e.preventDefault();

                                var currentClick = client(e),
                                    movement,
                                    proposal,
                                    other,
                                    per = (scope.step / range) * 100,
                                    otherModelPosition = (((index === 0 ? scope.modelMax : scope.modelMin) - scope.min) / range) * 100;

                                if (currentClick[0] === "x") {
                                    return;
                                }

                                // calculate deltas
                                currentClick[0] -= originalClick[0];
                                currentClick[1] -= originalClick[1];

                                // has movement occurred on either axis?
                                movement = [
                                    (previousClick[0] !== currentClick[0]), (previousClick[1] !== currentClick[1])
                                ];

                                // propose a movement
                                proposal = originalPosition + ((currentClick[orientation] * 100) / (orientation ? $slider.height() : $slider.width()));

                                // normalize so it can't move out of bounds
                                proposal = restrict(proposal);

                                if (scope.preventEqualMinMax) {

                                    if (per === 0) {
                                        per = (1 / range) * 100; // restrict to 1
                                    }

                                    if (index === 0) {
                                        otherModelPosition = otherModelPosition - per;
                                    } else if (index === 1) {
                                        otherModelPosition = otherModelPosition + per;
                                    }
                                }

                                // check which handle is being moved and add / remove margin
                                if (index === 0) {
                                    proposal = proposal > otherModelPosition ? otherModelPosition : proposal;
                                } else if (index === 1) {
                                    proposal = proposal < otherModelPosition ? otherModelPosition : proposal;
                                }

                                if (scope.step > 0) {
                                    // only change if we are within the extremes, otherwise we get strange rounding
                                    if (proposal < 100 && proposal > 0) {
                                        proposal = Math.round(proposal / per) * per;
                                    }
                                }

                                if (proposal > 95 && index === 0) {
                                    $handle.css('z-index', 3);
                                } else {
                                    $handle.css('z-index', '');
                                }

                                if (movement[orientation] && proposal != previousProposal) {

                                    if (index === 0) {

                                        // update model as we slide
                                        scope.modelMin = parseFloat((((proposal * range) / 100) + scope.min)).toFixed(scope.decimalPlaces);

                                    } else if (index === 1) {

                                        scope.modelMax = parseFloat((((proposal * range) / 100) + scope.min)).toFixed(scope.decimalPlaces);
                                    }

                                    // update angular
                                    scope.$apply();

                                    previousProposal = proposal;

                                }

                                previousClick = currentClick;

                            }).bind(offEvent, function () {

                                if (angular.isFunction(scope.onHandleUp)) {
                                    scope.onHandleUp();
                                }

                                unbind.off(eventNamespace);

                                angular.element('body').removeClass('ngrs-touching');

                                // remove down class
                                $handle.removeClass('ngrs-down');

                                // remove active class
                                $slider.removeClass('ngrs-focus ' + handleDownClass);

                            });
                        }

                    });
                }

                function throwError (message) {
                    scope.disabled = true;
                    throw new Error("RangeSlider: " + message);
                }

                function throwWarning (message) {
                    $log.warn(message);
                }

                /**
                 * DESTROY
                 */

                scope.$on('$destroy', function () {

                    // unbind event from slider
                    $slider.off(eventNamespace);

                    // unbind from body
                    angular.element('body').off(eventNamespace);

                    // unbind from document
                    $document.off(eventNamespace);

                    // unbind from handles
                    for (var i = 0, l = handles.length; i < l; i++) {
                        handles[i].off(eventNamespace);
                        handles[i].off(eventNamespace + 'X');
                    }

                });

                /**
                 * INIT
                 */

                $slider
                    // disable selection
                    .bind('selectstart' + eventNamespace, function (event) {
                        return false;
                    })
                    // stop propagation
                    .bind('click', function (event) {
                        event.stopPropagation();
                    });

                // bind events to each handle
                handleMove(0);
                handleMove(1);

            }
        };
    }]);
    
    // requestAnimationFramePolyFill
    // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
        return window.requestAnimationFrame    ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}());
/**
 * @overview AngularJS module for paginating (almost) anything.
 * @author Created by Michael.
 */
angApp.directive('dirPaginate', function($compile, $parse, $timeout, paginationService) {
        return  {
            priority: 5000, //High priority means it will execute first
            terminal: true,
            compile: function(element, attrs){
                attrs.$set('ngRepeat', attrs.dirPaginate); //Add ng-repeat to the dom

                var expression = attrs.dirPaginate;
                // regex taken directly from https://github.com/angular/angular.js/blob/master/src/ng/directive/ngRepeat.js#L211
                var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

                var filterPattern = /\|\s*itemsPerPage:\s*\S+\s*/;
                if (match[2].match(filterPattern) === null) {
                    throw "pagination directive: the 'itemsPerPage' filter must be set.";
                }
                var itemsPerPageFilterRemoved = match[2].replace(filterPattern, '');
                var collectionGetter = $parse(itemsPerPageFilterRemoved);

                //Now that we added ng-repeat to the element, proceed with compilation
                //but skip directives with priority 5000 or above to avoid infinite
                //recursion (we don't want to compile ourselves again)
                var compiled =  $compile(element, null, 5000);

                paginationService.paginationDirectiveInitialized = true;

                return function(scope, element, attrs){
                    var currentPageGetter;
                    if (attrs.currentPage) {
                        currentPageGetter = $parse(attrs.currentPage);
                    } else {
                        // if the current-page attribute was not set, we'll make our own
                        scope.__currentPage = 1;
                        currentPageGetter = $parse('__currentPage');
                    }
                    paginationService.setCurrentPageParser(currentPageGetter, scope);

                    scope.$watchCollection(function() {
                        return collectionGetter(scope);
                    }, function(collection) {
                        if (collection) {
                            paginationService.setCollectionLength(collection.length);
                        }
                    });

                    compiled(scope);
                };
            }
        };
    })

    .filter('itemsPerPage', function(paginationService) {
        return function(collection, itemsPerPage) {
            itemsPerPage = itemsPerPage || 9999999999;
            var start = (paginationService.getCurrentPage() - 1) * itemsPerPage;
            var end = start + itemsPerPage;
            paginationService.setItemsPerPage(itemsPerPage);

            return collection.slice(start, end);
        };
    })

    .service('paginationService', function() {
        var itemsPerPage;
        var collectionLength;
        var currentPageParser;
        var context;
        this.paginationDirectiveInitialized = false;

        this.setCurrentPageParser = function(val, scope) {
            currentPageParser = val;
            context = scope;
        };
        this.setCurrentPage = function(val) {
            currentPageParser.assign(context, val);
        };
        this.getCurrentPage = function() {
            return currentPageParser(context);
        };

        this.setItemsPerPage = function(val) {
            itemsPerPage = val;
        };
        this.getItemsPerPage = function() {
            return itemsPerPage;
        };

        this.setCollectionLength = function(val) {
            collectionLength = val;
        };
        this.getCollectionLength = function() {
            return collectionLength;
        };
    })

    .directive('dirPaginationControls', function(paginationService) {

        /**
         * Generate an array of page numbers (or the '...' string) which is used in an ng-repeat to generate the
         * links used in pagination
         *
         * @param currentPage
         * @param dataset
         * @param rowsPerPage
         * @param paginationRange
         * @returns {Array}
         */
        function generatePagesArray(currentPage, collectionLength, rowsPerPage, paginationRange) {
            var pages = [];
            var totalPages = Math.ceil(collectionLength / rowsPerPage);
            var halfWay = Math.ceil(paginationRange / 2);
            var position;

            if (currentPage <= halfWay) {
                position = 'start';
            } else if (totalPages - halfWay < currentPage) {
                position = 'end';
            } else {
                position = 'middle';
            }

            var ellipsesNeeded = paginationRange < totalPages;
            var i = 1;
            while (i <= totalPages && i <= paginationRange) {
                var pageNumber = calculatePageNumber(i, currentPage, paginationRange, totalPages);

                var openingEllipsesNeeded = (i === 2 && (position === 'middle' || position === 'end'));
                var closingEllipsesNeeded = (i === paginationRange - 1 && (position === 'middle' || position === 'start'));
                if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
                    pages.push('...');
                } else {
                    pages.push(pageNumber);
                }
                i ++;
            }
            return pages;
        }

        /**
         * Given the position in the sequence of pagination links [i], figure out what page number corresponds to that position.
         *
         * @param i
         * @param currentPage
         * @param paginationRange
         * @param totalPages
         * @returns {*}
         */
        function calculatePageNumber(i, currentPage, paginationRange, totalPages) {
            var halfWay = Math.ceil(paginationRange/2);
            if (i === paginationRange) {
                return totalPages;
            } else if (i === 1) {
                return i;
            } else if (paginationRange < totalPages) {
                if (totalPages - halfWay < currentPage) {
                    return totalPages - paginationRange + i;
                } else if (halfWay < currentPage) {
                    return currentPage - halfWay + i;
                } else {
                    return i;
                }
            } else {
                return i;
            }
        }

        return {
            restrict: 'AE',
            templateUrl:  'app/views/dir-pagination.html',
            scope: {},
            link: function(scope, element, attrs) {
                if (!scope.maxSize) { scope.maxSize = 9; }
                scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : true;
                scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : false;

                if (paginationService.paginationDirectiveInitialized === false) {
                    throw "pagination directive: the pagination controls cannot be used without the corresponding pagination directive.";
                }

                var paginationRange = Math.max(scope.maxSize, 5);
                scope.pages = [];
                scope.pagination = {
                    last: 1,
                    current: 1
                };

                scope.$watch(function() {
                   return paginationService.getCollectionLength() * paginationService.getItemsPerPage();
                }, function(length) {
                    if (0 < length) {
                        generatePagination();
                    }
                });

                scope.$watch(function() {
                    return paginationService.getCurrentPage();
                }, function(currentPage) {
                    scope.pages = generatePagesArray(currentPage, paginationService.getCollectionLength(), paginationService.getItemsPerPage(), paginationRange);
                });

                scope.setCurrent = function(num) {
                    if (/^\d+$/.test(num)) {
                        if (0 < num && num <= scope.pagination.last) {
                            paginationService.setCurrentPage(num);
                            scope.pages = generatePagesArray(num, paginationService.getCollectionLength(), paginationService.getItemsPerPage(), paginationRange);
                            scope.pagination.current = num;
                        }
                    }
                };

                function generatePagination() {
                    scope.pages = generatePagesArray(1, paginationService.getCollectionLength(), paginationService.getItemsPerPage(), paginationRange);
                    scope.pagination.last = scope.pages[scope.pages.length - 1];
               
                    if (scope.pagination.last < scope.pagination.current) {
                        scope.setCurrent(scope.pagination.last);
                    }
                }
            }
        };
    });
/* AngularJS directives for double scroll bars by @przno, v0.1.5, https://github.com/przno/double-scroll-bars, MIT license */!function(a){"use strict";a.module("doubleScrollBars",[]).directive("doubleScrollBarHorizontal",["$timeout","$dsb","$$dsbStorage",function(a,b,c){return{restrict:"A",transclude:!0,scope:{doubleScrollBarHorizontal:"@",id:"@"},template:"<div class=\"double-scroll\"> <div style=\"overflow-y:hidden;\" data-ng-style=\"{height:nativeScrollBarHeight}\">  <div style=\"overflow-y:hidden;position:relative;top:-1px;\" data-ng-style=\"{'overflow-x':doubleScrollBarHorizontal=='always'?'scroll':'auto',height:scrollBarElementHeight}\">   <div data-ng-style=\"{width:wrapper2scrollWidth,height:scrollBarElementHeight}\"></div>  </div> </div> <div data-ng-style=\"{'overflow-x':doubleScrollBarHorizontal=='always'?'scroll':'auto'}\">  <div data-ng-transclude></div> </div></div>",link:function(d,e,f,g){var h=b.getSize();d.nativeScrollBarHeight=h+"px",d.scrollBarElementHeight=parseInt(h+1)+"px",d.wrapper2scrollWidth="0px";var i=e.children().eq(0),j=i.children().eq(0).children().eq(0),k=i.children().eq(1),l=j[0],m=k[0];j.on("scroll",function(){m.scrollLeft=l.scrollLeft}),k.on("scroll",function(){l.scrollLeft=m.scrollLeft});var n=!0;d.$watch(function(){return d.wrapper2scrollWidth=m.scrollWidth+"px"},function(b,e){a(function(){d.$apply(),n&&(l.scrollLeft=c.get(d.id)||0,m.scrollLeft=c.get(d.id)||0,n=!1)})}),d.$on("$destroy",function(){void 0!==d.id&&c.set(d.id,l.scrollLeft)})}}}]).service("$$dsbStorage",function(){var a={};return{get:function(b){return a[b]},set:function(b,c){a[b]=c}}}).service("$dsb",function(){function a(){var a=document.createElement("div"),b=document.createElement("div");a.style.width="100%",a.style.height="200px",b.style.width="200px",b.style.height="150px",b.style.position="absolute",b.style.top="0",b.style.left="0",b.style.visibility="hidden",b.style.overflow="hidden",b.appendChild(a),document.body.appendChild(b);var c=a.offsetWidth;b.style.overflow="scroll";var d=b.clientWidth;return document.body.removeChild(b),c-d}var b;return{getSize:function(){return b=b||a()}}})}(angular);
/**
 * App filters
 * @author Martin Vach
 * @author Martin Hartnagel
 */

/**
 * Check if JSON keys/nodes exist
 */
angApp.filter('hasNode', function () {
    return function (obj, path) {
        path = path.split('.');
        var p = obj || {};
        for (var i in path) {
            if (p === null || typeof p[path[i]] === 'undefined') {
                return null;
            }
            p = p[path[i]];
        }
        return p;
    };
});

/**
 * Convert text to slug
 */
angApp.filter('stringToSlug', function () {
    return function (str,delim) {
        delim = delim||'-';
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to = "aaaaeeeeiiiioooouuuunc------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g,  delim) // collapse whitespace and replace by -
            .replace(/-+/g,  delim); // collapse dashes

        return str;
    };
});

/**
 * Cut text into x chars
 */
angApp.filter('cutText', function () {
    return function (value, wordwise, max, tail) {
        if ((!value && value !== 0) || value === undefined || value === null) {
            return '';
        }
        if (!value.length) {
            return value;
        }


        max = parseInt(max, 10);
        if (!max) {
            return value;
        }

        if (value.length <= max) {
            return value;
        }


        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});
/**
 * Get object length
 */
angApp.filter('getObjectLength', function () {
    return function (obj) {
        if (angular.isObject(obj)) {
            return Object.keys(obj).length;
        }
        return 0;

    };
});
/**
 * Has property
 */
angApp.filter('hasProp', function () {
    return function (obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);

    };
});
/**
 * Set a configuration value
 */
angApp.filter('setConfigValue', function () {
    return function (value) {
        if (isNaN(parseInt(value))) {
            return '\'' + value + '\'';
        } else {
            return value;
        }

    };
});

/**
 * Build an array from bits
 */
angApp.filter('getBitArray', function () {
    return function (value, length) {
        value = parseInt(value, 10);
        length = length || 32;
        var base2_ = (value).toString(2).split("").reverse().join("");
        var baseL_ = new Array(length - base2_.length).join("0");
        var base2 = base2_ + baseL_;
        return base2.split('').map(Number);
        ;

    };
});

/**
 * Get object length
 */
angApp.filter('getFirstObjectKey', function () {
    return function (obj) {
        if (angular.isObject(obj)) {
            return Object.keys(obj)[0];
        }
        return {};

    };
});

/**
 * Get only unique values
 */
angApp.filter('unique', function () {
    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});

/**
 * Get time from the box and displays it in the hrs:min:sec format
 * @function setTimeFromBox
 */
angApp.filter('setTimeFromBox', function (cfg, $filter) {
    return function (timestamp, offset) {
        // time from server comes with correct added timezone offset so it isn't necessary to add it again
        var d = new Date(timestamp * 1000);
        // browser add his own tz offset to date object so it is necessary to remove it's offset
        // because it is already negative we needn't multiplicate it by (-1)
        var browserTZO = parseInt(d.getTimezoneOffset() * 60 * 1000);
        // create new date object with correct time
        d = new Date(d.getTime() + browserTZO);

        return $filter('getFormattedTime')(
            d,
            false,
            cfg.zwavecfg.time_format
        );
    };
});

/**
 * Get date time as object
 * @function getDateTimeObj
 */
angApp.filter('getDateTimeObj', function ($filter, cfg) {
    return function (timestamp, invalidateTime) {
        // Count time with offset http://stackoverflow.com/questions/7403486/add-or-subtract-timezone-difference-to-javascript-date
        /* ----------- NEW with time offset ----------- */
        var targetTime = (timestamp ? new Date(timestamp * 1000) : new Date());
        var browserTZO = parseInt(targetTime.getTimezoneOffset() * 60 * 1000);
        //console.log('targetTime: ',targetTime);
        //console.log('browserTZO: ', browserTZO);
        //time zone value from config
        var tzo = parseInt(cfg.route.time.offset * (-1) * 60 * 60 * 1000, 10);
        //console.log('tzo:',tzo);
        //get the timezone offset from local time in minutes
        //var tzDifference = tzo * 60 * 1000;
        //console.log(tzDifference)
        //convert the offset to milliseconds, add to targetTime, and make a new Date
        var d = new Date(targetTime.getTime() + tzo + browserTZO);

        var di = (invalidateTime ? new Date(invalidateTime * 1000 + tzo + browserTZO) : null);
        var obj = {
            date: $filter('getFormattedDate')(d),
            time: $filter('getFormattedTime')(
                d,
                false,
                cfg.zwavecfg.time_format, d
            ),
            invalidateTime: (di ?
            $filter('getFormattedDate')(di) + ' '
            + $filter('getFormattedTime')(di, false, cfg.zwavecfg.time_format)
                : ''),
            today: (d.toDateString() === (new Date()).toDateString()
                ? $filter('getFormattedTime')(
                d,
                'hh:mm',
                cfg.zwavecfg.time_format
            )
                : $filter('getFormattedDate')(d))

        };
        return obj;
    };

});

/**
 * Check if is today
 * YES: displays time
 * NO: displays date
 * @function isTodayFromUnix
 */
angApp.filter('isTodayFromUnix', function (cfg, $filter) {
    return function (input) {
        if (!input || isNaN(input)) {
            return '-';
        }
        var d = new Date(input * 1000);

        var browserTZO = parseInt(d.getTimezoneOffset() * 60 * 1000);
        //time zone value from config
        var tzo = parseInt(cfg.route.time.offset * (-1) * 60 * 60 * 1000, 10);
        //convert the offset to milliseconds, add to targetTime, and make a new Date
        d = new Date(d.getTime() + tzo + browserTZO);

        if (d.toDateString() == (new Date()).toDateString()) {

            return $filter('getFormattedTime')(
                d,
                'hh:mm',
                cfg.zwavecfg.time_format
            );

        } else {
            return $filter('getFormattedDate')(d);
        }
    };
});
/**
 * Get formated date
 * @function getFormattedTime
 */
angApp.filter('getFormattedTime', function () {
    return function (date, stringFormat, timeFormat) {
        var str = '';
        var suffix = '';

        //var h = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
        var h = date.getHours();

        var m = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
        var s = (date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds();

        //console.log(h,m)

        // 12 hrs format?
        if (timeFormat === '12') {
            h = h % 12 || 12;
            suffix = (h < 12) ? ' AM' : ' PM';
        }
        h = (h < 10) ? "0" + h : h;

        switch (stringFormat) {
            case 'hh:mm':
                str = h + ':' + m;
                break;
            case 'hh':
                str = h;
                break;
            default:
                str = h + ':' + m + ':' + s;
                break;
        }
        return str + suffix;

    };
});

/**
 * TODO: deprecated
 * Get formated date
 * @function getFormattedTime
 */
angApp.filter('getFormattedTime____', function () {
    return function (time, stringFormat, timeFormat) {
        var str = '';
        var suffix = '';
        var arr = time.split(':').map(function (x) {
            return parseInt(x, 10);
        });
        // 12 hrs format?
        if (timeFormat === '12') {
            arr[0] = arr[0] % 12 || 12;
            suffix = (arr[0] < 12) ? ' AM' : ' PM';
        }

        var h = arr[0];
        var m = (arr[1] < 10 ? '0' + arr[1] : arr[1]);
        var s = (arr[2] < 10 ? '0' + arr[2] : arr[2]);
        switch (stringFormat) {
            case 'hh:mm':
                str = h + ':' + m;
                break;
            case 'hh':
                str = h;
                break;
            default:
                str = h + ':' + m + ':' + s;
                break;
        }
        //var time = h + ':' + m + ':' + s;
        return str + suffix;

    };
});

/**
 * Get formated date
 * @function getFormattedDate
 */
angApp.filter('getFormattedDate', function (cfg) {
    return function (d) {
        var day = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
        var mon = d.getMonth() + 1; //Months are zero based
        mon = (mon < 10 ? '0' + mon : mon);
        var year = d.getFullYear();

        switch (cfg.zwavecfg.date_format) {
            case 'dd-mm-yyyy':
                return day + '-' + mon + '-' + year;
            case 'yyyy-mm-dd':
                return year + '-' + mon + '-' + day;
            case 'yyyy/mm/dd':
                return year + '/' + mon + '/' + day;
            case 'mm/dd/yyyy':
                return mon + '/' + day + '/' + year;
            case 'dd/mm/yyyy':
                return day + '/' + mon + '/' + year;
            default:
                return day + '.' + mon + '.' + year;
        }

    };
});

//Get mysql datetime from now
angApp.filter('getMysqlFromNow', function () {
    return function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = (date.getMonth() + 1 < 10) ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate();
        var h = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
        var m = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
        var s = (date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds();
        return year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
    };
});

/**
 * Compare software version number
 * Return values:
 * a number < 0 if a < b
 * a number > 0 if a > b
 * 0 if a = b
 */
angApp.filter('cmpVersion', function () {
    return function (a, b) {
        var i, diff;
        var regExStrip0 = /(\.0+)+$/;
        var segmentsA = a.replace(regExStrip0, '').split('.');
        var segmentsB = b.replace(regExStrip0, '').split('.');
        var l = Math.min(segmentsA.length, segmentsB.length);

        for (i = 0; i < l; i++) {
            diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
            if (diff) {
                return diff;
            }
        }
        return segmentsA.length - segmentsB.length;
    };
});


/**
 * @todo: Deprecated
 * Convert unix timastamp to date
 */
/*angApp.filter('getTimestamp', function () {
 return Math.round(+new Date() / 1000);
 });*/

/**
 * Calculates difference between two dates in days
 */
angApp.filter('days_between', function () {
    return function (date1, date2) {
        return Math.round(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
    };
});

/**
 * Return string with date in smart format: "hh:mm:ss" if current day, "hh:mm dd" if this week, "hh:mm dd mmmm" if this year, else "hh:mm dd mmmm yyyy"
 */
angApp.filter('getTime', function ($filter) {
    return function (timestamp, invalidReturn) {
        var d = new Date(parseInt(timestamp, 10) * 1000);
        if (timestamp === 0 || isNaN(d.getTime()))
            return invalidReturn

        var day = d.getDate();
        var mon = d.getMonth() + 1; //Months are zero based
        var year = d.getFullYear();
        var hrs = d.getHours();
        var min = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
        var sec = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());

        var cd = new Date();

        var time;
        if ($filter('days_between')(cd, d) < 1 && cd.getDate() == d.getDate()) // this day
            time = hrs + ':' + min + ':' + sec;
        else if ($filter('days_between')(cd, d) < 7 && ((cd < d) ^ (cd.getDay() >= d.getDay()))) // this week
            time = day + '. ' + hrs + ':' + min;
        else if (cd.getFullYear() == d.getFullYear()) // this year
            time = day + '.' + mon + '. ' + hrs + ':' + min;
        else // one upon a time
            time = day + '.' + mon + '.' + year + ' ' + hrs + ':' + min;

        return time;
    };
});


/**
 * Return "red" if the data is outdated or "" if up to date
 */
angApp.filter('getUpdated', function () {
    return function (data) {
        if (data === undefined)
            return '';
        return ((data.updateTime > data.invalidateTime) ? '' : 'red');
    };
});

/**
 * Strip HTML tags
 */
angApp.filter('stripTags', function () {
    return function (input) {
        return String(input).replace(/<[^>]+>/gm, '');
        //return  input.replace(/<\/?[^>]+(>|$)/g, "");
    };
});
/**
 * Display HTML tags in scope
 */
angApp.filter('toTrusted', ['$sce', function ($sce) {

    return function (text) {
        if (text == null) {
            return '';
        }
        return $sce.trustAsHtml(text);
    };
}]);

/**
 * Display device name
 */
angApp.filter('deviceName', function (cfg, deviceService) {
    return function (deviceId, node) {

        if (deviceId == cfg.controller.zwayNodeId) {
            return deviceService.getCustomCfgVal('controller_name');
        }
        var type = '';
        var isListening = node.data.isListening.value;
        var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
        var hasWakeup = 0x84 in node.instances[0].commandClasses;

        if (hasWakeup || isFLiRS) {
            type = 'Battery';
        } else if (isListening) {
            type = 'Mains';
        }
        var name = type + 'Device ' + '_' + deviceId;
        if (node === undefined) {
            return name;
        }
        if (node.data.givenName.value != '') {
            name = node.data.givenName.value;
        }
        return name;
    };
});

/**
 * todo: deprecated
 * Display device name
 */
/*angApp.filter('getDeviceName', function () {
    return function (deviceId, data) {
        var name = 'Device ' + deviceId;
        angular.forEach(data, function (v, k) {
            if (v.id == deviceId) {
                name = v.name;
                return;
            }

        });
        return name;
    };
});*/

angApp.filter('getByProperty', function () {
    return function (propertyName, propertyValue, collection) {
        var i = 0, len = collection.length;
        for (; i < len; i++) {
            if (collection[i][propertyName] == +propertyValue) {
                return collection[i];
            }
        }
        return null;
    };
});


//Convert decimal to hex
angApp.filter('decToHex', function () {
    return function (decimal, chars, x) {
        var hex = (decimal + Math.pow(16, chars)).toString(16).slice(-chars).toUpperCase();
        return (x || '') + hex;
    };
});


/**
 * Replace Lock state with text
 */
angApp.filter('lockStatus', function () {
    return function (mode) {
        var mode_lbl;

        switch (mode) {
            case 0:
                mode_lbl = 'open';
                break;
            case 16:
                mode_lbl = 'open_from_inside';
                break;
            case 32:
                mode_lbl = 'open_from_outside';
                break;
            case 255:
                mode_lbl = 'closed';
                break;
            default:
                mode_lbl = '-';
                break;
        }
        ;
        return mode_lbl;
    };
});

/**
 * Replace Lock state with text
 */
angApp.filter('lockIsOpen', function () {
    return function (input) {
        var mode = input;
        var status = true;

        if (mode === '' || mode === null) {
            status = false;
        } else {
            switch (mode) {
                case 0x00:
                    status = true;
                    break;
                case 0x10:
                    status = true;
                    break;
                case 0x20:
                    status = true;
                    break;
                case 0xff:
                    status = false;
                    break;
            }
            ;
        }
        ;
        return status;
    };
});

/**
 * Get battery icon
 */
angApp.filter('getBatteryIcon', function () {
    return function (input) {
        var icon = 'fa-battery-full';
        if (isNaN(input)) {
            return icon;
        }
        var level = parseInt(input);
        if (level >= 95) {
            icon = 'fa-battery-full text-success';
        } else if (level >= 70 && level < 95) {
            icon = 'fa-battery-3 text-success';
        } else if (level >= 50 && level < 70) {
            icon = 'fa-battery-2 text-primary';
        } else if (level > 30 && level <= 50) {
            icon = 'fa-battery-2 text-info';
        } else if (level >= 1 && level <= 30) {
            icon = 'fa-battery-1 text-danger';
        } else {
            icon = 'fa-battery-0 text-danger';
        }
        return icon;
    };
});
/**
 * Get device type icon
 */
angApp.filter('getDeviceTypeIcon', function () {
    return function (input) {
        var icon;
        switch (input) {
            case 'static':
                icon = 'fa-cog';
                break;
            case 'flirs':
                icon = 'fa-fire text-info';
                break;
            case 'mains':
                icon = 'fa-bolt text-warning';
                break;
            case 'battery':
                icon = 'fa-battery-full text-success';
                break;
            case 'portable':
                icon = 'fa-feed text-primary';
                break;
            default:
                icon = 'fa-ellipsis-h';
                break;
        }
        return icon;
    };
});

/**
 * Returns <code>true</code> if an association (in Association or Multichannel Association
 class) form fromNode is set to toNodeId, <code>false</code> elsewise.
 * @param fromNode node to check if an association is set to toNodeId.
 * @param toNodeId node to check if an association from fromNode exists.
 */
angApp.filter('associationExists', function () {
    return function (fromNode, toNodeId) {
        var exists = false;
        $.each(fromNode.instances, function (index, instance) {
            if (!("commandClasses" in instance)) {
                return;
            }

            if (0x85 in instance.commandClasses) {
                for (var group = 0; group < instance.commandClasses[0x85].data.groups.value; group++) {
                    var associations = instance.commandClasses[0x85].data[group + 1].nodes.value;
                    if ($.inArray(parseInt(toNodeId), associations) != -1) {
                        exists = true;
                        return false;
                    }
                }
            }
            if (0x8e in instance.commandClasses) {
                for (var group = 0; group < instance.commandClasses[0x8e].data.groups.value; group++) {
                    var associations = instance.commandClasses[0x8e].data[group + 1].nodesInstances.value;
                    for (var i = 0; i < associations.length; i += 2) {
                        if (parseInt(toNodeId) == associations[i]) {
                            exists = true;
                            return false;
                        }
                    }
                }
            }
        });
        return exists;
    };
});

/**
 * Filter nodes which are updateable concerning routes.
 * @param batteryOnly if undefined includes all devices, if true includes only battery devices, if false includes only non-battery devices
 */
angApp.filter('updateable', function () {
    return function (node, nodeId, batteryOnly) {
        var nodeIsVirtual = node.data.isVirtual;
        var nodeBasicType = node.data.basicType;
        if (nodeId == 255 || nodeIsVirtual == null || nodeIsVirtual.value == true || nodeBasicType == null || nodeBasicType.value == 1) {
            return false;
        }
        if (batteryOnly != undefined) {
            var hasBattery = 0x80 in node.instances[0].commandClasses;
            return batteryOnly == hasBattery;
        }
        return true;
    };
});

/**
 * Count Routes
 */
angApp.filter('getRoutesCount', function ($filter) {
    return function (ZWaveAPIData, nodeId) {
        var in_array = function (v, arr, return_index) {
            for (var i = 0; i < arr.length; i++)
                if (arr[i] == v)
                    return return_index ? i : true;
            return false;
        };
        var getFarNeighbours = function (nodeId, exludeNodeIds, hops) {
            if (hops === undefined) {
                var hops = 0;
                var exludeNodeIds = [nodeId];
            }
            ;

            if (hops > 2) // Z-Wave allows only 4 routers, but we are interested in only 2, since network becomes unstable if more that 2 routers are used in communications
                return [];

            var nodesList = [];
            angular.forEach(ZWaveAPIData.devices[nodeId].data.neighbours.value, function (nnodeId, index) {
                if (!(nnodeId in ZWaveAPIData.devices))
                    return; // skip deviced reported in routing table but absent in reality. This may happen after restore of routing table.
                if (!in_array(nnodeId, exludeNodeIds)) {
                    nodesList.push({nodeId: nnodeId, hops: hops});
                    if (ZWaveAPIData.devices[nnodeId].data.isListening.value && ZWaveAPIData.devices[nnodeId].data.isRouting.value)
                        $.merge(nodesList, getFarNeighbours(nnodeId, $.merge([nnodeId], exludeNodeIds) /* this will not alter exludeNodeIds */, hops + 1));
                }
            });
            return nodesList;
        };

        var routesCount = {};
        angular.forEach(getFarNeighbours(nodeId), function (nnode, index) {
            if (nnode.nodeId in routesCount) {
                if (nnode.hops in routesCount[nnode.nodeId])
                    routesCount[nnode.nodeId][nnode.hops]++;
                else
                    routesCount[nnode.nodeId][nnode.hops] = 1;
            } else {
                routesCount[nnode.nodeId] = new Array();
                routesCount[nnode.nodeId][nnode.hops] = 1;
            }
        });
        return routesCount;
    };
});

/*
 * Set security icon
 */
angApp.filter('securityIcon', function () {
    return function (input) {
        var icon = 'fa fa-unlock-alt fa-lg text-danger';
        if (input) {
            icon = 'fa fa-lock fa-lg text-success';
        }
        return icon;
    };
});

/*
 * Set mwief icon
 */
angApp.filter('mwiefIcon', function () {
    return function (input) {
        //var icon = 'fa fa-minus';
        var icon = '&nbsp';
//        if(input === false){
//            icon = 'fa fa-check fa-lg text-danger';
//        }
        if (input) {
            icon = 'fa fa-check fa-lg text-success';
        }
        return icon;
    };
});

/*
 * Set mwief icon
 */
angApp.filter('checkedIcon', function () {
    return function (input) {
        //var icon = 'fa fa-minus';
        var icon = '&nbsp';
//        if(input === false){
//            icon = 'fa fa-check fa-lg text-danger';
//        }
        if (input) {
            icon = 'fa fa-check fa-lg text-success';
        } else {
            icon = 'fa fa-ban fa-lg text-danger';
        }
        return icon;
    };
});

/**
 * Set zWavePlus icon
 */
angApp.filter('zWavePlusIcon', function () {
    return function (input) {
        //var icon = 'fa fa-minus';
        var icon = '&nbsp';
        if (input === true) {
            icon = 'fa fa-plus fa-lg text-success';
        }
        return icon;
    };
});

/**
 * todo: finish this filter
 * Set device icon
 */
angApp.filter('deviceIcon', function () {
    return function (input) {
        //var icon = 'fa fa-minus';
        var icon = 'fa-circle';
        switch (parseInt(input.genericType, 10)) {
            case 1:
                icon = 'fa-wifi';
                break;

            default:
                break;
        }
        return icon;
    };
});

/**
 * Application factories
 * @author Martin Vach
 */

/*** Factories ***/
var appFactory = angular.module('appFactory', ['ngResource']);

/**
 * Caching the river...
 */
appFactory.factory('myCache', function ($cacheFactory) {
    return $cacheFactory('myData');
});

/**
 * Underscore
 */
appFactory.factory('_', function () {
    return window._; // assumes underscore has already been loaded on the page
});
/**
 * Data service
 * @todo: Replace all data handler with this service
 * @todo: Complete error handling
 */
appFactory.factory('dataService', function ($http, $q, $interval, $filter, $location, $window, deviceService, myCache, cfg) {
    var updatedTime = Math.round(+new Date() / 1000);
    var apiData;
    // todo: deprecated
    //var apiDataInterval;
    //var queueDataInterval;
    /**
     * Public functions
     */
    return({
        // With promises
        getCfgXml: getCfgXml,
        putCfgXml: putCfgXml,
        getUzb: getUzb,
        updateUzb: updateUzb,
        getLicense: getLicense,
        zmeCapabilities: zmeCapabilities,
        getLanguageFile: getLanguageFile,
        logInApi:  logInApi,
        getApiLocal: getApiLocal,
        loadZwaveApiData: loadZwaveApiData,
        loadJoinedZwaveData: loadJoinedZwaveData,
        runZwaveCmd: runZwaveCmd,
        getApi: getApi,
        postApi: postApi,
        postToRemote: postToRemote,
        getRemoteData: getRemoteData,
        sessionApi: sessionApi,
        xmlToJson: xmlToJson,
        getTextFile: getTextFile,
        storeTextToFile: storeTextToFile,
        uploadApiFile: uploadApiFile,
        postReport: postReport,
        getAppBuiltInfo: getAppBuiltInfo,
        // Probably remove
        store: store,
        updateZwaveDataSince: updateZwaveDataSince,
        getReorgLog: getReorgLog,
        putReorgLog: putReorgLog
    });
    /**
     * Get IP
     */
    function getAppIp() {
        if (cfg.custom_ip) {
            var ip = cfg.server_url;
            if (!ip || ip == '') {
                $location.path('/');
            }
        }

    }

    /**
     * Get config XML file
     */
    function getCfgXml() {
        // NOT Cached data
        return $http({
            method: 'get',
            url: cfg.server_url + '/config/Configuration.xml'
        }).then(function (response) {
            var x2js = new X2JS();
            var json = x2js.xml_str2json(response.data);
            if (json) {
                return json;
            } else {// invalid response
                return $q.reject(response);
            }
        }, function (response) {// something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Put config XML file
     */
    function putCfgXml(data) {
        return $http({
            method: "POST",
            //dataType: "text",
            url: cfg.server_url + '/config/Configuration.xml',
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {
            return response;
        }, function (error) {// something went wrong

            return $q.reject(error);
        });
    }
    /**
     * Update Uzb
     */
    function getUzb(params) {
        return $http({
            method: 'get',
            url: cfg.uzb_url + params
        }).then(function (response) {
            if (typeof response.data.data === 'object') {
                return response.data.data;
            } else {
                // invalid response
                return $q.reject(response);
            }
        }, function (response) {
            // something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Update Uzb
     */
    function updateUzb(url, data) {
        //alert('Run HTTP request: ' + url);
        return $http({
            method: 'POST',
            url: url,
            data: $.param(data),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {
            return response;
        }, function (response) {
            // something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Get license key
     */
    function getLicense(data) {
        return $http({
            method: 'post',
            url: cfg.license_url,
            data: $.param(data),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {
            if (response.data.license.length > 1) {
                return response.data.license;
            } else {
                // invalid response
                return $q.reject(response);
            }
        }, function (response) {
            //debugger;
            // something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Set ZME Capabilities
     */
    function zmeCapabilities(data) {
        return $http({
            method: 'POST',
            url: cfg.server_url + cfg.license_load_url,
            data: $.param({license: data.toString()}),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {
            return response;
        }, function (response) {
            // something went wrong
            return $q.reject(response);
        });

    }


    /**
     * Get a file with language keys values from the app/lang directory
     * @param {string} lang
     * @returns {unresolved}
     */
    function getLanguageFile(lang) {
        var langFile = 'language.' + lang + '.json';
        var cached = myCache.get(langFile);

        if (cached) {
            var deferred = $q.defer();
            deferred.resolve(cached);
            return deferred.promise;
        }
        return $http({
            method: 'get',
            url: cfg.lang_dir + langFile
        }).then(function (response) {
            if (typeof response.data === 'object') {
                myCache.put(langFile, response);
                return response;
            } else {
                return $q.reject(response);
            }
        }, function (response) {// something went wrong
            return $q.reject(response);
        });
    }





    /**
     * Handles login process
     * @param {object} data
     * @returns {unresolved}
     */
    function logInApi(data) {
        return $http({
            method: "post",
            data: data,
            url: cfg.server_url + cfg['login']
        }).then(function (response) {
            return response;
        }, function (response) {// something went wrong
            //return response;
            return $q.reject(response);
        });
    }
    /**
     * Get local data from the storage directory
     * @param {string} file
     * @returns {unresolved}
     */
    function getApiLocal(file) {
        return $http({
            method: 'get',
            url: cfg.local_data_url + file
        }).then(function (response) {
            if (typeof response.data === 'object') {
                return response;
            } else {// invalid response
                return $q.reject(response);
            }
        }, function (response) {// something went wrong
            return $q.reject(response);
        });

    }
    /**
     * Load ZwaveApiData 
     */
    function loadZwaveApiData(noCache) {
        // Cached data
        var cacheName = 'zwaveapidata';
        var cached = myCache.get(cacheName);
        if (!noCache && cached) {
            var deferred = $q.defer();
            deferred.resolve(cached);
            return deferred.promise;
        }
        return $http({
            method: 'post',
            url: cfg.server_url + cfg.update_url + "0"
        }).then(function (response) {
            if (typeof response.data === 'object') {
                myCache.put(cacheName, response.data);
                return response.data;
            } else {
                // invalid response
                return $q.reject(response);
            }
        }, function (response) {
            // something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Get updated data and join with ZwaveData
     */
    function  loadJoinedZwaveData() {
        var cacheName = 'zwaveapidata';
        var apiData = myCache.get(cacheName);// || ZWaveAPIData;
        var result = {
            joined: apiData,
            update: {}
        };
        return $http({
            method: 'post',
            url: cfg.server_url + cfg.update_url + updatedTime
        }).then(function (response) {
            if (_.size(response.data)> 1 && apiData) {
                //console.log('Response > 1')
                angular.forEach(response.data, function (obj, path) {
                    if (!angular.isString(path)) {
                        return;
                    }
                    var pobj = apiData;
                    var pe_arr = path.split('.');
                    for (var pe in pe_arr.slice(0, -1)) {
                        pobj = pobj[pe_arr[pe]];
                    }
                    pobj[pe_arr.slice(-1)] = obj;
                });
                result.update = response.data;
                response.data = result;
                updatedTime = ($filter('hasNode')(response, 'data.update.updateTime') || Math.round(+new Date() / 1000));
                myCache.put(cacheName, apiData);
                return response;
            } else {
                response.data = result;
                //console.log('Response === 1')
                return response;
                // invalid response
                //return $q.reject(response);
            }
        }, function (response) {
            // something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Run zwave command
     */
    function runZwaveCmd(cmd) {
        return $http({
            method: 'post',
            url: cfg.server_url + cmd
        }).then(function (response) {
            return response;
        }, function (response) {// something went wrong
            return $q.reject(response);
        });
    }
    /**
     * Get ZAutomation api data
     * @param {string} api
     * @param {string} params
     * @param {boolean} noCache
     * @returns {unresolved}
     */
    function getApi(api, params, noCache) {
        // Cached data
        var cacheName = api + (params || '');
        var cached = myCache.get(cacheName);
        if (!noCache && cached) {
            var deferred = $q.defer();
            deferred.resolve(cached);
            return deferred.promise;
        }
        return $http({
            method: 'get',
            url: cfg.server_url + cfg[api] + (params ? params : '')
        }).then(function (response) {
            if (!angular.isDefined(response.data)) {
                return $q.reject(response);
            }
            if (typeof response.data === 'object') {
                myCache.put(cacheName, response);
                return response;
            } else {// invalid response
                return $q.reject(response);
            }

        }, function (response) {// something went wrong
            return $q.reject(response);
        });
    }


    /**
     * Post ZAutomation api data
     * @param {string} api
     * @param {object} data
     * @param {string} params
     * @returns {unresolved}
     */
    function postApi(api, data, params) {
        return $http({
            method: "post",
            data: data,
            url: cfg.server_url + cfg[api] + (params ? params : '')
        }).then(function (response) {
            return response;
        }, function (response) {// something went wrong
            if(response.status == 401 && cfg.app_type == "installer") {
                var auth = cfg.auth;

                logInApi(auth).then(function (response) {
                    var user = response.data.data;
                    deviceService.setZWAYSession(user.sid);
                    deviceService.setUser(user);

                    postApi(api,data,params);

                }, function (error) {
                    var message = $scope._t('error_load_data');
                    if (error.status == 401) {
                        message = $scope._t('error_load_user');
                    }
                    alertify.alertError(message);
                });

            } else {
                return $q.reject(response);
            }
        });
    }

    /**
     * Get data from the remote resource
     * @param {string} url
     * @param {boolean} noCache
     * @returns {unresolved}
     */
    function getRemoteData(url, noCache) {
        // Cached data
        var cacheName = 'cache_' + url;
        var cached = myCache.get(cacheName);

        if (!noCache && cached) {
            var deferred = $q.defer();
            deferred.resolve(cached);
            return deferred.promise;
        }
        // NOT Cached data
        return $http({
            method: 'get',
            url: url
            /*headers: {
             'Accept-Language': lang
             }*/
        }).then(function (response) {
            return response;
        }, function (error) {// something went wrong

            return $q.reject(error);
        });
    }

    /**
     * Post on the remote server
     * @param {string} url
     * @param {object} data
     * @returns {unresolved}
     */
    function postToRemote(url, data, headers) {

        return $http({
            method: 'POST',
            url: url,
            data: data,
            headers: headers
        }).then(function (response) {
            return response;
        }, function (error) {// something went wrong

            return $q.reject(error);
        });
    }

    /**
     * Get Z-Wave session
     * @returns {unresolved}
     */
    function sessionApi() {
        return $http({
            method: "get",
            url: cfg.server_url + cfg['session']
        }).then(function (response) {
            return response;
        }, function (response) {// something went wrong
            //return response;
            return $q.reject(response);
        });
    }

    /**
     * Get XML from url and convert it to JSON
     * @param {string} url
     * @param {boolean} noCache
     * @returns {unresolved}
     */
    function xmlToJson(url, noCache) {
        // Cached data
        var cacheName = 'cache_' + url;
        var cached = myCache.get(cacheName);

        if (!noCache && cached) {
            var deferred = $q.defer();
            deferred.resolve(cached);
            return deferred.promise;
        }
        // NOT Cached data
        return $http({
            method: 'get',
            url: url
        }).then(function (response) {
            var x2js = new X2JS();
            var json = x2js.xml_str2json(response.data);
            if (json) {
                myCache.put(cacheName, json);
                return json;
            } else {// invalid response
                return $q.reject(response);
            }
        }, function (response) {// something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Get data from given text file
     * @param url
     * @returns {*}
     */
    function getTextFile(url) {
        return $http({
            method: 'get',
            url: url
        }).then(function (response) {
            return response;
        }, function (response) {// something went wrong
            return $q.reject(response);
        });

    }

    /**
     * Store text data to a given file url
     * @param {string} file
     * @param {string} data
     * @returns {*}
     */
    function storeTextToFile(url,data) {
        return $http({
            method: "POST",
            dataType: "text",
            url: url,
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            return response;
        }, function (response) {// something went wrong
            return $q.reject(response);
        });
    }


    /**
     * Upload a file to ZAutomation
     * @param {type} cmd
     * @param {type} data
     * @returns {unresolved}
     */
    function uploadApiFile(cmd, data) {
        var uploadUrl = cfg.server_url + cmd;
        return  $http.post(uploadUrl, data, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            return response;
        }, function (response) {// something went wrong
            return $q.reject(response);
        });

    }

    /**
     * Post a bug report on the remote server
     * @param {object} data
     * @returns {unresolved}
     */
    function postReport(data) {
        return $http({
            method: "POST",
            url: cfg.post_report_url,
            data: $.param(data),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {
            return response;
        }, function (response) {// something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Get app built info
     * @param {string} file
     * @returns {unresolved}
     */
    function getAppBuiltInfo() {
        return $http({
            method: 'get',
            url: cfg.app_built_info
        }).then(function (response) {
            if (typeof response.data === 'object') {
                return response;
            } else {// invalid response
                return $q.reject(response);
            }
        }, function (response) {// something went wrong
            return $q.reject(response);
        });

    }

    /* /////////////////////////////////////// Probably remove /////////////////////////////////////////////// */
    /**
     *
     * Handle errors
     */
    function handleError(message, showResponse, hideContent) {
        // Custom IP show/hide
        $('.custom-ip-error').show();
        $('.custom-ip-success').hide();

        var msg = (message ? message : 'Error handling data from server');
        if (showResponse) {
            $('#respone_container').show();
            $('#respone_container_inner').html('<div class="alert alert-danger alert-dismissable response-message"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> <i class="icon-ban-circle"></i> ' + msg + '</div>');
        }
        $('.error-hide').hide();

        if (hideContent) {
            $('#main_content').hide();
        }

        console.log('Error');

    }

    /**
     *
     * Handle cmd errors
     */
    function handleCmdError(message) {
        var msg = (message ? message : 'Error handling data from server');
        $('#respone_container').show();
        $('#respone_container_inner').html('<div class="alert alert-danger alert-dismissable response-message"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> <i class="icon-ban-circle"></i> ' + msg + '</div>');
        console.log('Error');

    }

    /**
     * Clear the cached ZWaveData.
     */
    function purgeCache() {
        apiData = undefined;
    }
    /**
     * todo: Deprecated (used only in ReorganizationController)
     * Gets one update of data in the remote collection since a specific time.
     * @param since the time (in seconds) to update from.
     * @param callback called in case of successful data reception.
     * @param errorCallback called in case of error.
     */
    function updateZwaveDataSince(since, callback, errorCallback) {
        var time = since;
        var request = $http({
            method: "POST",
            url: cfg.server_url + cfg.update_url + time
        });
        request.success(function (data) {
            time = data.updateTime;
            return callback(data);
        }).error(function (error) {
            handleError();
            if (errorCallback !== undefined)
                errorCallback(error);
        });
    }
    /**
     * todo: Deprecated (used only in ReorganizationController)
     * Run store api cmd
     */
    function store(param, success, error) {
        var url = cfg.server_url + cfg.store_url + param;
        var request = $http({
            method: 'POST',
            url: url
        });
        request.success(function (data) {
            //handleSuccess(data);
            if (success)
                success();
        }).error(function (err) {
            handleError();
            if (error)
                error(err);
        });

    }

    /**
     * todo: Deprecated (used only in ReorganizationController)
     * Gets reorg log from remote text file
     */
    function getReorgLog(callback) {
        return $http({method: 'GET', url: cfg.server_url + cfg.reorg_log_url + '?at=' + (new Date()).getTime()}).success(function (data, status, headers, config) {
            callback(data);
        });
    }

    /**
     * todo: Deprecated (used only in ReorganizationController)
     * Put reorg log in remote text file
     */
    function putReorgLog(log) {
        return $.ajax({
            type: "PUT",
            dataType: "text",
            url: cfg.server_url + cfg.reorg_log_url,
            contentType: "text/plain",
            data: log
        });
    }



    /* /////////////////////////////////////// Remove /////////////////////////////////////////////// */

    /**
     * todo: deprecated
     * Gets all of the data in the remote collection.
     */
    /*function getZwaveData(callback, noCache) {
     getAppIp();
     var time = Math.round(+new Date() / 1000);
     if (apiData && !noCache) {
     return callback(apiData);
     } else {

     //pageLoader();
     var request = $http({
     method: "POST",
     url: cfg.server_url + cfg.update_url + "0"
     //url: 'storage/all_cp.json'
     });
     request.success(function (data) {
     apiData = data;
     //pageLoader(true);
     return callback(data);
     }).error(function () {
     //pageLoader(true);
     handleError(false, true, false);


     });
     }
     }*/



    /**
     * todo: deprecated
     * Get updated data and join with ZwaveData
     */
    /*
    function  joinedZwaveData(callback) {
        var time = Math.round(+new Date() / 1000);

        var result = {};
        var refresh = function () {
            //console.log(apiData);
            var request = $http({
                method: "POST",
                //url: "storage/updated.json"
                url: cfg.server_url + cfg.update_url + time
            });
            request.success(function (data) {
                if (!apiData || !data)
                    return;
                time = data.updateTime;
                angular.forEach(data, function (obj, path) {
                    if (!angular.isString(path)) {
                        return;
                    }
                    var pobj = apiData;
                    var pe_arr = path.split('.');
                    for (var pe in pe_arr.slice(0, -1)) {
                        pobj = pobj[pe_arr[pe]];
                    }
                    pobj[pe_arr.slice(-1)] = obj;
                });
                result = {
                    "joined": apiData,
                    "update": data
                };
                return callback(result);
            }).error(function () {
                handleError();

            });
        };
        apiDataInterval = $interval(refresh, cfg.interval);
    }*/



    /**
     * todo: deprecated
     * Cancel data interval
     */
    /*function cancelZwaveDataInterval() {
        if (angular.isDefined(apiDataInterval)) {
            $interval.cancel(apiDataInterval);
            apiDataInterval = undefined;
        }
        return;
    }*/


    /**
     * todo: deprecated
     * Run api cmd
     */
    /*function runCmd(param, request, error, noFade) {
     var url = (request ? cfg.server_url + request : cfg.server_url + cfg.store_url + param);
     var request = $http({
     method: 'POST',
     url: url
     });
     request.success(function (data) {
     if (!noFade) {
     $('button .fa-spin,a .fa-spin').fadeOut(1000);
     }

     handleSuccess(data);
     }).error(function () {
     if (!noFade) {
     $('button .fa-spin,a .fa-spin').fadeOut(1000);
     }
     if (error) {
     $window.alert(error + '\n' + url);
     }

     });

     }*/


    /**
     * todo: deprecated
     * Get zddx device selection
     */
    /*function getSelectZDDX(nodeId, callback, alert) {
     var request = $http({
     method: "POST",
     url: cfg.server_url + cfg.store_url + 'devices[' + nodeId + '].GuessXML()'
     });
     request.success(function (data) {
     return callback(data);
     }).error(function () {
     $(alert).removeClass('allert-hidden');

     });
     }*/

    /**
     * todo: deprecated
     * Get ZddXml file
     */
    /*function getZddXml(file, callback) {
     var cachedZddXml = myCache.get(file);
     if (cachedZddXml) {
     return callback(cachedZddXml);
     } else {
     var request = $http({
     method: "get",
     url: cfg.server_url + cfg.zddx_url + file
     });
     request.success(function (data) {
     var x2js = new X2JS();
     var json = x2js.xml_str2json(data);
     myCache.put(file, json);
     return callback(json);
     }).error(function () {
     handleError();

     });
     }
     }*/



    /**
     * todo: deprecated
     * Run JavaScript cmd
     */
    /*function runJs(param) {
     var request = $http({
     method: 'POST',
     dataType: "json",
     url: cfg.server_url + cfg.runjs_url + param
     });
     request.success(function (data) {
     handleSuccess(data);
     }).error(function () {
     handleError();

     });

     }*/

    /**
     * todo: deprecated
     * Run Firmware Update
     */
    /*function fwUpdate(nodeId, data) {
     var uploadUrl = cfg.server_url + cfg.fw_update_url + '/' + nodeId;
     var fd = new FormData();
     fd.append('file', data.file);
     fd.append('url', data.url);
     fd.append('targetId', data.targetId);
     $http.post(uploadUrl, fd, {
     transformRequest: angular.identity,
     headers: {'Content-Type': undefined}
     }).success(function () {
     handleSuccess(data);
     }).error(function () {
     handleError();
     });

     }*/





    /**
     * todo: deprecated
     * Load Queue data
     */
    /*function getQueueData(callback) {
     if (typeof (callback) != 'function') {
     return;
     }
     ;
     var request = $http({
     method: "POST",
     url: cfg.server_url + cfg.queue_url
     });
     request.success(function (data) {
     return callback(data);
     }).error(function () {
     handleError();

     });
     }*/

    /**
     * todo: deprecated
     * Load and update Queue data
     */
    /*function updateQueueData(callback) {
     var refresh = function () {
     getQueueData(callback);
     };
     queueDataInterval = $interval(refresh, cfg.queue_interval);
     }*/

    /**
     * todo: deprecated
     * Show / Hide page loader
     */
   /* function pageLoader(hide) {
        // Custom IP show/hide
        $('.custom-ip-error').hide();
        $('.custom-ip-success').show();

        if (hide) {
            $('#respone_container').hide();
            $('#main_content').show();
            $('.error-hide').show();
            return;
        }
        //$('#main_content').hide();
        $('#respone_container').show();
        $('#respone_container_inner').html('<div class="alert alert-warning page-load-spinner"><i class="fa fa-spinner fa-lg fa-spin"></i><br /> Loading data....</div>');
        return;

    }*/


    /**
     * todo: deprecated
     * Run Firmware Update
     */
    /*function updateDeviceFirmware(nodeId, data) {
        var uploadUrl = cfg.server_url + cfg.fw_update_url + '/' + nodeId;
        var fd = new FormData();
        fd.append('file', data.file);
        fd.append('url', data.url);
        fd.append('targetId', data.targetId);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function () {
            handleSuccess(data);
        }).error(function () {
            handleError();
        });

    }*/

    /**
     * todo: deprecated
     * Handle success response
     */
    /*function handleSuccess(response) {
        console.log('Success');
        return;

    }*/
});



/**
 * Application services
 * @author Martin Vach
 */
var appService = angular.module('appService', []);

/**
 * Device service
 */
appService.service('deviceService', function($filter, $log, $cookies,$window,cfg,_) {
    /// --- Public functions --- ///

    /**
     * Mobile device detect
     */
    this.isMobile = function(a) {
        return isMobile(a);
    };
    /**
     * Get language line by key
     */
    this.getLangLine = function(key, languages,replacement) {
        return getLangLine(key, languages,replacement);
    };
    
    /**
     * Render alertify notifier
     * @param {object} notifier
     * @returns {undefined}
     */
    this.showNotifier = function (notifier) {
        var param = _.defaults(notifier, {position: 'top-right', message: false, type: 'success', wait: 5});
        if (notifier.message) {
            alertify.set('notifier', 'position', param.position);
            alertify.notify(param.message, param.type, param.wait);
        }
    };

    /**
     * Show connection error
     */
    this.showConnectionError = function(error) {
        $('#update_time_tick').html('<i class="fa fa-minus-circle fa-lg text-danger"></i>');
        return this.logError(error, 'Unable to recieve HTTP data');
    };

    /**
     * Log error
     */
    this.logError = function(error, message) {
        message = message || 'ERROR:';
        $log.error('---------- ' + message + ' ----------', error);
    };

    /**
     * Get user data from cookies
     * @returns {Array|Boolean}
     */
    this.getUser = function () {
        var user = ($cookies.user !== 'undefined' ? angular.fromJson($cookies.user) : false);
        return user;
    };

    /**
     * Set user data
     * @param {object} data
     * @returns {Boolean|Object}
     */
    this.setUser = function (data) {
        if (!data) {
            delete $cookies['user'];
            return false;
        }
        $cookies.user = angular.toJson(data);
        return data;
    };

    /**
     * Unset user data - delete user cookies
     * @returns {undefined}
     */
    this.unsetUser = function () {
        this.setUser(null);
        this.setZWAYSession(null);
    };

    /**
     * Get ZWAY session
     * @returns {string}
     */
    this.getZWAYSession = function () {
        return $cookies.ZWAYSession;
    };
    /**
     * Set ZWAY session
     * @param {string} sid
     * @returns {Boolean|Object}
     */
    this.setZWAYSession = function (sid) {
        if (!sid) {
            delete $cookies['ZWAYSession'];
            return false;
        }
        $cookies.ZWAYSession = sid;
    };

    /**
     * Logout from the system
     * @returns {undefined}
     */
    this.logOut = function () {
        this.setUser(null);
        this.setZWAYSession(null);
        $window.location.href = '#/';
        $window.location.reload();

    };

    /**
     * Check if is not device
     */
    this.notDevice = function(ZWaveAPIData, node, nodeId) {
        /*if (nodeId == 255 || nodeId == ZWaveAPIData.controller.data.nodeId.value || node.data.isVirtual.value) {
            return true;
        }*/
        if (nodeId == 255 || node.data.isVirtual.value) {
            return true;
        }
        return false;
    };

    /**
     * Get device type
     */
    this.deviceType = function(node) {
        var type;
        var isListening = node.data.isListening.value;
        var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
        var hasWakeup = 0x84 in node.instances[0].commandClasses;

        if (node.data.genericType.value === 1) {
            type = 'portable';
        } else if (node.data.genericType.value === 2) {
            type = 'static';
        } else if (isFLiRS) {
            type = 'flirs';
        } else if (hasWakeup) {
            type = 'battery';
        } else if (isListening) {
            type = 'mains';
        } else {
            type = 'unknown';
        }
        return type;
    };

    /**
     * Get last communication
     */
    this.lastCommunication = function(node) {
        var lastReceive = parseInt(node.data.lastReceived.updateTime, 10) || 0;
        var lastSend = parseInt(node.data.lastSend.updateTime, 10) || 0;
        return (lastSend > lastReceive) ? lastSend : lastReceive;
    };

    /**
     * Check if device isFailed
     */
    this.isFailed = function(node) {
        return node.data.isFailed.value;
    };

    /**
     * Check if device isListening
     */
    this.isListening = function(node) {
        return node.data.isListening.value;
    };

    /**
     * Check if device isFLiRS
     */
    this.isFLiRS = function(node) {
        return  (node.data.sensor250.value || node.data.sensor1000.value);
       // return !node.data.isListening.value && (node.data.sensor250.value || node.data.sensor1000.value);
    };

    /**
     * Check if device is reset locally
     */
    this.isLocalyReset = function(node) {
        return isLocalyReset(node);
    };

    /**
     * Check if device has a given command class
     */
    this.hasCommandClass = function(node,ccId) {
        var hasCc = false;
        angular.forEach(node.instances, function(instance, instanceId) {
        if(instance.commandClasses[ccId]){
            hasCc = instance.commandClasses[ccId];
            return;
           }
        });
        return hasCc;
    };

    /**
     * Get a value from custom config
     * @param {string} key
     * @returns {string}
     */
    this.getCustomCfgVal = function (key) {
        if (cfg.custom_cfg[cfg.app_type]) {
            return cfg.custom_cfg[cfg.app_type][key] || '';
        }
        return '';
    };
    
    /**
     * Get percentage of delivered packets
     */
    this.getOkPackets = function(data) {
        var isDelivered = 0;
        var notDelivered = 0;
        angular.forEach(data, function(v, k) {
            if (v.delivered == true) {
                isDelivered++;
            } else {
                notDelivered++;
            }

        });
        var calcPercent = isDelivered / data.length * 100;
        var percent = 0;
        if (!isNaN(calcPercent)) {
            percent = calcPercent.toFixed(0);
        }
        return percent;
    };
    
     /**
     * Get list of last packets
     */
    this.getLastPackets = function(data) {
        var packets = '&nbsp;';
        var deliveryTime = 0;
        var color;
        angular.forEach(data.slice(-20), function(v, k) {
            deliveryTime = parseInt(v.deliveryTime);
            if (!v.delivered) {
                color = 'red';
            } else {
                color = (deliveryTime > 100 ? 'black' : 'green');
            }
            var displayTime = deliveryTime / 10;
            packets += '<span class="' + color + ' timing-packet">' + (displayTime.toFixed() < 1 ? 1 : displayTime.toFixed()) + '</span> ';
        });
        return packets;

    };
    
     /**
     * Set Zniffer data
     */
    this.setZnifferData = function(data) {
        return _.chain(data)
                .flatten()
                .filter(function (v) {
                    v.dateTime = $filter('getDateTimeObj')(v.updateTime);
                    v.bytes = (_.isArray(v.value) ? v.value.toString() : v.value);
                    v.rssi = (_.isArray(v.rssi) ? v.rssi.toString() : v.rssi);
                    v.hops = (_.isArray(v.hops) ? v.hops.toString() : v.hops);
                    return v;
                });

    };

    /**
     * Get language from zddx
     */
    this.configGetZddxLang = function(node, lang) {
        return configGetZddxLang(node, lang);
    };

    /**
     * Get config navigation devices
     */
    this.configGetNav = function(ZWaveAPIData) {
        return configGetNav(ZWaveAPIData);
    };
    
    /**
     *  Get expert commands
     */
    this.configGetCommands = function(methods, ZWaveAPIData) {
        return configGetCommands(methods, ZWaveAPIData);
    };

    /**
     *  Get interview ommands
     */
    this.configGetInterviewCommands = function(node, updateTime) {
        return configGetInterviewCommands(node, updateTime);
    };

    /**
     *  Get CommandClass
     */
    this.configGetCommandClass = function(data, name, space) {
        return configGetCommandClass(data, name, space);
    };

    /**
     *  Set CommandClass
     */
    this.configSetCommandClass = function(data, updateTime) {
        return configSetCommandClass(data, updateTime);
    };


    /**
     *  Get interview stage
     */
    this.configInterviewStage = function(ZWaveAPIData, id, languages) {
        return configInterviewStage(ZWaveAPIData, id, languages);
    };

    /**
     *  Set device state
     */
    this.configDeviceState = function(node, languages) {
        return configDeviceState(node, languages);
    };


    /**
     * Config cont
     */
    this.configConfigCont = function(node, nodeId, zddXml, cfgXml, lang, languages) {
        return configConfigCont(node, nodeId, zddXml, cfgXml, lang, languages);
    };

    /**
     *  Switch all cont
     */
    this.configSwitchAllCont = function(node, nodeId, ZWaveAPIData, cfgXml) {
        return configSwitchAllCont(node, nodeId, ZWaveAPIData, cfgXml);
    };

    /**
     * Protection cont
     */
    this.configProtectionCont = function(node, nodeId, ZWaveAPIData, cfgXml) {
        return configProtectionCont(node, nodeId, ZWaveAPIData, cfgXml);
    };

    /**
     * Wakeup cont
     */
    this.configWakeupCont = function(node, nodeId, ZWaveAPIData, cfgXml) {
        return configWakeupCont(node, nodeId, ZWaveAPIData, cfgXml);
    };

    /**
     * Get xml config param
     */
    this.getCfgXmlParam = function(cfgXml, nodeId, instance, commandClass, command) {
        return getCfgXmlParam(cfgXml, nodeId, instance, commandClass, command);
    };

    /**
     * Check if device is in config
     */
    this.isInCfgXml = function(data, cfgXml) {
        return isInCfgXml(data, cfgXml);
    };

    /**
     * Get assoc xml config param
     */
    this.getCfgXmlAssoc = function(cfgXml, nodeId, instance, commandClass, command, groupId) {
        return getCfgXmlAssoc(cfgXml, nodeId, instance, commandClass, command, groupId);
    };


    /**
     *Build config XML file
     */
    this.buildCfgXml = function(data, cfgXml, id, commandclass) {
        return buildCfgXml(data, cfgXml, id, commandclass);
    };

    /**
     *Build assoc config XML file
     */
    this.buildCfgXmlAssoc = function(data, cfgXml) {
        return buildCfgXmlAssoc(data, cfgXml);
    };
    /**
     *Delete from CFG XML - asoc
     */
    this.deleteCfgXmlAssoc = function(data, cfgXml) {
        return deleteCfgXmlAssoc(data, cfgXml);
    };

    /// --- Private functions --- ///

    /**
     * Mobile device detect
     */
    function isMobile(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * Get language line by key
     */
    function getLangLine(key, languages,replacement) {
        var line = key;
        if (angular.isObject(languages)) {
            if (angular.isDefined(languages[key])) {
                line = (languages[key] !== '' ? languages[key] : key);
            }
        }
        return setLangLine(line, replacement,key);
    }
    ;

    /**
     * Set lang line params
     */
    function setLangLine(line, replacement,key) {
        for (var val in replacement) {
            line = line.split(val).join(replacement[val]);
        }
        return line;
    }

    /**
     * isLocalyReset
     */
    function isLocalyReset(node) {
        var isLocalyReset = false;
        for (var iId in node.instances) {
            if (node.instances[iId].commandClasses[90]) {
                isLocalyReset = node.instances[iId].commandClasses[90].data.reset.value;
            }
        }
        return isLocalyReset;
    }

    /**
     *  Get language from zddx
     */
    function configGetZddxLang(langs, currLang) {
        if (!langs) {
            return null;
        }
        if (!angular.isArray(langs)) {
            if (("__text" in langs)) {
                return langs.__text;
            }
            return null;
        }
        var lang = _.findWhere(langs, {'_xml:lang': currLang});
        if (lang) {
            return lang.__text;
        }
        var defaultLang = _.findWhere(langs, {'_xml:lang': 'en'});
        if (defaultLang) {
            return defaultLang.__text;
        }
        return null;
    }


    /**
     *  Get config navigation devices
     */
    function configGetNav(ZWaveAPIData) {
        var devices = [];
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || node.data.isVirtual.value) {
                return;
            }
            /*if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }*/
            var node = ZWaveAPIData.devices[nodeId];
            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['isController'] = (controllerNodeId == nodeId);
            devices.push(obj);
        });
        return devices;
    }

    /**
     *  Get expert commands
     */
    function configGetCommands(methods, ZWaveAPIData) {
        var methodsArr = [];
        angular.forEach(methods, function(params, method) {
            //str.split(',');
            var cmd = {};
            var values = repr_array(method_defaultValues(ZWaveAPIData, methods[method]));
            cmd['data'] = {
                'method': method,
                'params': methods[method],
                'values': method_defaultValues(ZWaveAPIData, methods[method])
            };
            cmd['method'] = method;
            cmd['params'] = methods[method];
            cmd['values'] = repr_array(method_defaultValues(ZWaveAPIData, methods[method]));
            methodsArr.push(cmd);
        });
        return methodsArr;
    }

    /**
     *  Get interview Commands
     */
    function configGetInterviewCommands(node, updateTime) {
        var interviews = [];
        for (var iId in node.instances) {
            var cnt = 0;
            for (var ccId in node.instances[iId].commandClasses) {
                var obj = {};
                obj['iId'] = iId;
                obj['ccId'] = ccId;
                obj['ccName'] = node.instances[iId].commandClasses[ccId].name;
                obj['interviewDone'] = node.instances[iId].commandClasses[ccId].data.interviewDone.value;
                obj['cmdData'] = node.instances[iId].commandClasses[ccId].data;
                obj['cmdDataIn'] = node.instances[iId].data;
                obj['updateTime'] = updateTime;
                interviews.push(obj);
                cnt++;
            }
            ;
        }
        ;
        return interviews;
    }

    /**
     *  Get CommandClass Commands
     */
    function configGetCommandClass(data, name, space) {
        // Formated output
        //var getCmdData = function(data, name, space) {
        if (name == undefined) {
            return '';
        }
        var html = '<div class="cc-data-element">' + space + name + ': <span class="' + ((data.updateTime > data.invalidateTime) ? 'green' : 'red') + '">' + ((typeof (data.value) !== 'undefined' && data.value != null) ? data.value.toString() : 'None') + '</span>' + ' (<span class="' + ((data.updateTime > data.invalidateTime) ? '' : 'red') + '">' + $filter('isTodayFromUnix')(data.updateTime) + '</span>)</div>';
        angular.forEach(data, function(el, key) {

            if (key != 'type' && key != 'updateTime' && key != 'invalidateTime' && key != 'value' && // these are internal values
                    key != 'capabilitiesNames') { // these make the dialog monstrious
                html += configGetCommandClass(el, key, space + '&nbsp;&nbsp;&nbsp;&nbsp;');
            }
        });
        return html;
        //};
    }

    /**
     *  Set CommandClass Commands
     */
    function configSetCommandClass(data, updateTime) {
        var html = data;
        /*if(updateTime){
         html += '<p class="help-block"><em>' + $filter('dateFromUnix')(updateTime )+ '<em></p>'; 
         }*/
        return html;
    }

    /**
     *  Get interview stage
     */
    function configInterviewStage(ZWaveAPIData, id, languages) {
        var istages = [];
        istages.push((ZWaveAPIData.devices[id].data.nodeInfoFrame.value && ZWaveAPIData.devices[id].data.nodeInfoFrame.value.length) ? '+' : '-');
        istages.push('&nbsp;');
        istages.push((0x86 in ZWaveAPIData.devices[id].instances[0].commandClasses) ? (ZWaveAPIData.devices[id].instances[0].commandClasses[0x86].data.interviewDone.value ? '+' : (ZWaveAPIData.devices[id].instances[0].commandClasses[0x86].data.interviewCounter.value > 0 ? '.' : '&oslash;')) : '+'); // Version
        istages.push((0x72 in ZWaveAPIData.devices[id].instances[0].commandClasses) ? (ZWaveAPIData.devices[id].instances[0].commandClasses[0x72].data.interviewDone.value ? '+' : (ZWaveAPIData.devices[id].instances[0].commandClasses[0x72].data.interviewCounter.value > 0 ? '.' : '&oslash;')) : '+'); // ManufacturerSpecific
        istages.push((0x60 in ZWaveAPIData.devices[id].instances[0].commandClasses) ? (ZWaveAPIData.devices[id].instances[0].commandClasses[0x60].data.interviewDone.value ? '+' : (ZWaveAPIData.devices[id].instances[0].commandClasses[0x60].data.interviewCounter.value > 0 ? '.' : '&oslash;')) : '+'); // MultiChannel
        var moreCCs = false;
        for (var i in ZWaveAPIData.devices[id].instances) {
            istages.push('&nbsp;');
            var instance = ZWaveAPIData.devices[id].instances[i];
            for (var cc in instance.commandClasses) {
                moreCCs = true;
                if ((cc == 0x60 && i != 0) || ((cc == 0x86 || cc == 0x72 || cc == 0x60) && i == 0))
                    continue; // skip MultiChannel announced inside a MultiChannel and previously handled CCs.
                istages.push(instance.commandClasses[cc].data.interviewDone.value ? '+' : (instance.commandClasses[cc].data.interviewCounter.value > 0 ? '.' : '&oslash;'));
            }
        }
        ;
        if (!moreCCs) {
            istages.push('.');
        }

        var descr;
        if (istages.indexOf('&oslash;') == -1) {
            if (istages.indexOf('.') == -1 && istages.indexOf('-') == -1)
                descr = getLangLine('device_interview_stage_done', languages);
            else
                descr = getLangLine('device_interview_stage_not_complete', languages);
        } else
            descr = getLangLine('device_interview_stage_failed', languages);
        return descr + '<br />' + istages.join('');
    }

    /**
     *  Set device state
     */
    function configDeviceState(node, languages) {
        var out = '';
        if (!node.data.isListening.value && !node.data.sensor250.value && !node.data.sensor1000.value) {
            out = (node.data.isAwake.value ? '<i class="fa fa-certificate fa-lg text-orange""></i> ' + getLangLine('device_is_active', languages) : '<i class="fa fa-moon-o fa-lg text-primary"></i> ' + getLangLine('device_is_sleeping', languages));
        } else {
            out = (node.data.isFailed.value ? '<i class="fa fa-ban fa-lg text-danger"></i> ' + getLangLine('device_is_dead', languages) : '<i class="fa fa-check fa-lg text-success"></i> ' + getLangLine('device_is_operating', languages));
        }
        return out;
    }

    /**
     * Config cont
     */
    function configConfigCont(node, nodeId, zddXml, cfgXml, lang, languages) {
        if (!0x70 in node.instances[0].commandClasses) {
            return null;
        }
        if (!zddXml) {
            return null;
        }

        if (!zddXml.ZWaveDevice.hasOwnProperty("configParams")) {
            return null;
        }
        var config_cont = [];
        var params = zddXml.ZWaveDevice.configParams['configParam'];

        // Loop throught params
        var parCnt = 0;
        var cfgFile = getCfgXmlParam(cfgXml, nodeId, '0', '70', 'Set');
        angular.forEach(params, function(conf_html, i) {
            //console.log(zddXml);
            if (!angular.isObject(conf_html)) {
                return;
            }

            have_conf_params = true;
            var conf = conf_html;
            var conf_num = conf['_number'];
            //console.log(cfgFile[conf_num])
            var conf_size = conf['_size'];
            var conf_name = configGetZddxLang($filter('hasNode')(conf, 'name.lang'), lang) || getLangLine('configuration_parameter', languages) + ' ' + conf_num;
            var conf_description = configGetZddxLang($filter('hasNode')(conf, 'description.lang'), lang);
            var conf_size = conf['_size'];
            var conf_default_value = null;
            var conf_type = conf['_type'];
            var showDefaultValue = null;
            var config_config_value;

            // get value from the Z-Wave data
            var config_zwave_value = null;

            if (angular.isDefined(node.instances[0].commandClasses[0x70])) {
                if (node.instances[0].commandClasses[0x70].data[conf_num] != null && node.instances[0].commandClasses[0x70].data[conf_num].val.value !== "") {
                    config_zwave_value = node.instances[0].commandClasses[0x70].data[conf_num].val.value;
                    conf_default = config_zwave_value;

                }

            }

            // get default value
            var conf_default = null;
            if (conf['_default'] !== undefined) {
                conf_default = parseInt(conf['_default'], 16);
                showDefaultValue = conf_default;
            }

            // get default value from the config XML
            if (cfgFile[conf_num] !== undefined) {
                config_config_value = cfgFile[conf_num];
            } else {
                if (config_zwave_value !== null) {
                    config_config_value = config_zwave_value;
                } else {
                    config_config_value = conf_default;
                }
            }

            var isUpdated = true;
            var updateTime = '';
            if (angular.isDefined(node.instances[0].commandClasses[0x70])
                    && angular.isDefined(node.instances[0].commandClasses[0x70].data[conf_num])) {
                var uTime = node.instances[0].commandClasses[0x70].data[conf_num].updateTime;
                var iTime = node.instances[0].commandClasses[0x70].data[conf_num].invalidateTime;
                var updateTime = $filter('isTodayFromUnix')(uTime);
                var isUpdated = (uTime > iTime ? true : false);
            }

            // Switch
            var conf_method_descr;
            //console.log(conf_name + ' --- ' + conf_type)
            switch (conf_type) {
                case 'constant':
                case 'rangemapped':
                    var param_struct_arr = [];
                    var conf_param_options = '';

                    angular.forEach(conf['value'], function(value_html, i) {
                        var value = value_html;
                        var value_from = parseInt(value['_from'], 16);
                        var value_to = parseInt(value['_to'], 16);
                        var value_description = null;
                        if (angular.isDefined(value.description)) {
                            value_description = configGetZddxLang($filter('hasNode')(value, 'description.lang'), lang);
                        }
                        if (angular.isDefined(value.lang)) {
                            value_description = configGetZddxLang($filter('hasNode')(value, 'lang'), lang);

                        }
                        var value_repr = value_from; // representative value for the range
                        if (conf_default !== null)
                            if (value_from <= conf_default && conf_default <= value_to) {
                                conf_default_value = value_description;
                                value_repr = conf_default;
                            }
                        param_struct_arr.push({
                            label: value_description,
                             name:  'constant_input_' + nodeId + '_' + conf_num,
                            type: {
                                fix: {
                                    value: value_repr
                                }
                            }
                        });
                    });
                    conf_method_descr = {
                        nodeId: nodeId,
                        label: 'Nº ' + conf_num + ' - ' + conf_name,
                        type: {
                            enumof: param_struct_arr
                        },
                        name: 'constant_input_' + nodeId + '_' + conf_num,
                        description: conf_description,
                        updateTime: updateTime,
                        isUpdated: isUpdated,
                        defaultValue: conf_default_value,
                        showDefaultValue: showDefaultValue,
                        configCconfigValue: config_config_value,
                        configZwaveValue: config_zwave_value,
                        confNum: conf_num,
                        confSize: conf_size
                    };
                    break;
                case 'range':

                    var param_struct_arr = [];
                    var rangeParam = conf['value'];
                    //console.log(rangeParam, conf_num);
                    var rangeParamCnt = 0;
                    if (!rangeParam) {
                        conf_method_descr = {
                            nodeId: nodeId,
                            label: 'Nº ' + conf_num + ' - ' + conf_name,
                            type: {
                                noval: null
                            },
                            name: 'range_input_' + nodeId + '_' + conf_num,
                            description: conf_description,
                            updateTime: updateTime,
                            isUpdated: isUpdated,
                            defaultValue: null,
                            showDefaultValue: showDefaultValue,
                            configCconfigValue: config_config_value,
                            configZwaveValue: config_zwave_value,
                            confNum: conf_num,
                            confSize: conf_size
                        };
                        break;
                    }
                    angular.forEach(rangeParam, function(value_html, ri) {
                        //console.log(ri);
                        var value = value_html;

                        if (ri == 'description') {
                            //console.log(ri);
                            var value_from = parseInt(rangeParam['_from'], 16);
                            var value_to = parseInt(rangeParam['_to'], 16);

                        } else {
                            var value_from = parseInt(value['_from'], 16);
                            var value_to = parseInt(value['_to'], 16);
                        }
                        var value_description = '';
                        if (angular.isDefined(value.description)) {
                            value_description = configGetZddxLang($filter('hasNode')(value, 'description.lang'), lang);
                        }
                        if (angular.isDefined(value.lang)) {
                            value_description = configGetZddxLang($filter('hasNode')(value, 'lang'), lang);
                        }
                        //var value_description = deviceService.configGetZddxLang($filter('hasNode')(value, 'lang'), $scope.lang);

                        if (conf_default !== null)
                            conf_default_value = conf_default;


                        if (value_from != value_to) {
                            if (value_description != '') {
                                var rangeVal = {
                                    label: value_description,
                                    name: 'range_input_' + nodeId + '_' + conf_num,
                                    textName: 'range_input_text_' + rangeParamCnt +'_' + nodeId + '_' + conf_num,
                                    type: {
                                        range: {
                                            min: value_from,
                                            max: value_to
                                        }
                                    }
                                };
                                param_struct_arr.push(rangeVal);
                            }
                        }
                        else // this is a fix value
                        if (value_description != '') {
                            param_struct_arr.push({
                                label: value_description,
                                name: 'range_input_' + nodeId + '_' + conf_num,
                                type: {
                                    fix: {
                                        value: value_from
                                    }
                                }
                            });
                        }
                    rangeParamCnt++;
                    });

                    if (param_struct_arr.length > 1)
                        conf_method_descr = {
                            nodeId: nodeId,
                            label: 'Nº ' + conf_num + ' - ' + conf_name,
                            type: {
                                enumof: param_struct_arr
                            },
                            hideRadio: false,
                            name: 'range_input_' + nodeId + '_' + conf_num,
                            description: conf_description,
                            updateTime: updateTime,
                            isUpdated: isUpdated,
                            defaultValue: conf_default_value,
                            showDefaultValue: showDefaultValue,
                            configCconfigValue: config_config_value,
                            configZwaveValue: config_zwave_value,
                            confNum: conf_num,
                            confSize: conf_size
                        };
                    else if (param_struct_arr.length == 1) {

                        conf_method_descr = {
                            nodeId: nodeId,
                            label: 'Nº ' + conf_num + ' - ' + conf_name,
                            type: {
                                enumof: param_struct_arr
                            },
                            name: 'range_input_' + nodeId + '_' + conf_num,
                            hideRadio: true,
                            description: conf_description,
                            updateTime: updateTime,
                            isUpdated: isUpdated,
                            defaultValue: conf_default_value,
                            showDefaultValue: showDefaultValue,
                            configCconfigValue: config_config_value,
                            configZwaveValue: config_zwave_value,
                            confNum: conf_num,
                            confSize: conf_size
                        };
                    }
                    break;
                case 'bitset':
                    // Remove when a bitset view completed
                    //return;
                    var param_struct_arr = [];
                    var conf_param_options = '';
                    var conf_default_value_arr = new Object;
                    if (conf_default !== null) {
                        var bit = 0;
                        do {
                            if ((1 << bit) & conf_default)
                                conf_default_value_arr[bit] = 'Bit ' + bit + ' set';
                        } while ((1 << (bit++)) < conf_default);
                    }
                    ;
                    angular.forEach(conf['value'], function(value_html, i) {
                        var value = value_html;
                        var value_from = parseInt(value['_from'], 16);
                        var value_to = parseInt(value['_to'], 16);
                        var value_description = '';
                        if (angular.isDefined(value.description)) {
                            value_description = configGetZddxLang($filter('hasNode')(value, 'description.lang'), lang);
                        }
                        if (angular.isDefined(value.lang)) {
                            value_description = configGetZddxLang($filter('hasNode')(value, 'lang'), lang);

                        }
                        //console.log(value_description)
                        if (conf_default !== null) {
                            if (value_from == value_to) {
                                if ((1 << value_from) & conf_default)
                                    conf_default_value_arr[value_from] = value_description;
                            } else {
                                conf_default_value_arr[value_from] = (conf_default >> value_from) & ((1 << (value_to - value_from + 1)) - 1)
                                for (var bit = value_from + 1; bit <= value_to; bit++)
                                    delete conf_default_value_arr[bit];
                            }
                        }
                        ;
                        if (value_from == value_to)
                            param_struct_arr.push({
                                label: value_description,
                                name: 'bitcheck_input_' + nodeId + '_' + conf_num,
                                type: {
                                    bitcheck: {
                                        bit: value_from
                                    }
                                }
                            });
                        else
                            param_struct_arr.push({
                                label: value_description,
                                name: 'bitrange_input_' + nodeId + '_' + conf_num,
                                type: {
                                    bitrange: {
                                        bit_from: value_from,
                                        bit_to: value_to
                                    }
                                }
                            });
                    });
                    if (conf_default !== null) {
                        conf_default_value = '';
                        for (var ii in conf_default_value_arr)
                            conf_default_value += conf_default_value_arr[ii] + ', ';
                        if (conf_default_value.length)
                            conf_default_value = conf_default_value.substr(0, conf_default_value.length - 2);
                    }
                    conf_method_descr = {
                        nodeId: nodeId,
                        label: 'Nº ' + conf_num + ' - ' + conf_name,
                        type: {
                            bitset: param_struct_arr
                        },
                        name: 'bitset_input_' + nodeId + '_' + conf_num,
                        description: conf_description,
                        updateTime: updateTime,
                        isUpdated: isUpdated,
                        defaultValue: conf_default_value,
                        showDefaultValue: showDefaultValue,
                        configCconfigValue: config_config_value,
                        configZwaveValue: config_zwave_value,
                        confNum: conf_num,
                        confSize: conf_size
                    };
                    //console.log(conf_method_descr)
                    break;
                default:
                    return;
                    //conf_cont.append('<span>' + $.translate('unhandled_type_parameter') + ': ' + conf_type + '</span>');
            }
            ;

            config_cont.push(conf_method_descr);
            parCnt++;
        });
        return config_cont;
    }

    /**
     * Switch all cont
     */
    function configSwitchAllCont(node, nodeId, ZWaveAPIData, cfgXml) {
        var switchall_cont = false;
        if (0x27 in node.instances[0].commandClasses) {
            var cfgFile = getCfgXmlParam(cfgXml, nodeId, '0', '27', 'Set');
            var uTime = node.instances[0].commandClasses[0x27].data.mode.updateTime;
            var iTime = node.instances[0].commandClasses[0x27].data.mode.invalidateTime;
            var updateTime = $filter('isTodayFromUnix')(uTime);
            var isUpdated = (uTime > iTime ? true : false);
            var gui_descr = getMethodSpec(ZWaveAPIData, nodeId, 0, 0x27, 'Set');
            var conf_default_value = 0;
            var switchall_conf_value;
            if (cfgFile !== undefined) {
                switchall_conf_value = cfgFile[0];
            } else {
                switchall_conf_value = 1;// by default switch all off group only
            }
            switchall_cont = {
                'params': gui_descr,
                'values': {0: switchall_conf_value},
                name: 'switchall_' + nodeId + '_' + 0,
                updateTime: updateTime,
                isUpdated: isUpdated,
                defaultValue: conf_default_value,
                showDefaultValue: conf_default_value,
                configCconfigValue: switchall_conf_value,
                confNum: 0,
                confSize: 0,
                cmd: 'devices[' + nodeId + '].instances[0].commandClasses[0x27]'
            };

        }
        ;
        return switchall_cont;
    }

    /**
     * Protection cont
     */
    function configProtectionCont(node, nodeId, ZWaveAPIData, cfgXml) {
        var protection_cont = false;
        if (0x75 in node.instances[0].commandClasses) {
            var cfgFile = getCfgXmlParam(cfgXml, nodeId, '0', '75', 'Set');
            var uTime = node.instances[0].commandClasses[0x75].data.state.updateTime;
            var iTime = node.instances[0].commandClasses[0x75].data.state.invalidateTime;
            var updateTime = $filter('isTodayFromUnix')(uTime);
            var isUpdated = (uTime > iTime ? true : false);
            var gui_descr = getMethodSpec(ZWaveAPIData, nodeId, 0, 0x75, 'Set');
            var conf_default_value = 0;
            var protection_conf_value;
            //var protection_conf_rf_value;
            // get default value from the config XML
            if (cfgFile !== undefined) {
                protection_conf_value = cfgFile[0];
            } else {
                protection_conf_value = 0;// by default switch all off group only
            }

            protection_cont = {
                'params': gui_descr,
                'values': {0: protection_conf_value},
                name: 'protection_' + nodeId + '_' + 0,
                updateTime: updateTime,
                isUpdated: isUpdated,
                defaultValue: conf_default_value,
                showDefaultValue: conf_default_value,
                configCconfigValue: protection_conf_value,
                confNum: 0,
                confSize: 0,
                cmd: 'devices[' + nodeId + '].instances[0].commandClasses[0x75]'
            };
        }
        ;
        return protection_cont;
    }

    /**
     * Wakeup cont
     */
    function configWakeupCont(node, nodeId, ZWaveAPIData, cfgXml) {
        var wakeup_cont = false;
        if (0x84 in node.instances[0].commandClasses) {
            var cfgFile = getCfgXmlParam(cfgXml, nodeId, '0', '84', 'Set');
            var wakeup_zwave_min = (node.instances[0].commandClasses[0x84].data.version.value == 1) ? 0 : node.instances[0].commandClasses[0x84].data.min.value;
            var wakeup_zwave_max = (node.instances[0].commandClasses[0x84].data.version.value == 1) ? 0xFFFFFF : node.instances[0].commandClasses[0x84].data.max.value;
            var wakeup_zwave_value = node.instances[0].commandClasses[0x84].data.interval.value;
            var wakeup_zwave_default_value = (node.instances[0].commandClasses[0x84].data.version.value == 1) ? 86400 : node.instances[0].commandClasses[0x84].data['default'].value; // default is a special keyword in JavaScript
            var wakeup_zwave_nodeId = node.instances[0].commandClasses[0x84].data.nodeId.value;
            var uTime = node.instances[0].commandClasses[0x84].data.updateTime;
            var iTime = node.instances[0].commandClasses[0x84].data.invalidateTime;
            var updateTime = $filter('isTodayFromUnix')(uTime);
            var isUpdated = (uTime > iTime ? true : false);
            if (wakeup_zwave_min !== '' && wakeup_zwave_max !== '') {
                var gui_descr = getMethodSpec(ZWaveAPIData, nodeId, 0, 0x84, 'Set');
                gui_descr[0].type.range.min = parseInt(wakeup_zwave_min, 10);
                gui_descr[0].type.range.max = parseInt(wakeup_zwave_max, 10);
                var wakeup_conf_value;
                var wakeup_conf_node_value = 0;
                if (angular.isArray(cfgFile) && cfgFile.length > 0) {
                    wakeup_conf_value = cfgFile[0] || 0;
                    wakeup_conf_node_value = cfgFile[1] || 0;
                } else {
                    if (wakeup_zwave_value != "" && wakeup_zwave_value != 0 && wakeup_zwave_nodeId != "") {
                        // not defined in config: adopt devices values
                        wakeup_conf_value = parseInt(wakeup_zwave_value, 10);
                    } else {
                        // values in device are missing. Use defaults
                        wakeup_conf_value = parseInt(wakeup_zwave_default_value, 10);
                    }
                    ;
                }
                ;
                wakeup_cont = {
                    'params': gui_descr,
                    'values': {"0": wakeup_conf_value},
                    name: 'wakeup_' + nodeId + '_' + 0,
                    updateTime: updateTime,
                    isUpdated: isUpdated,
                    defaultValue: wakeup_zwave_default_value,
                    showDefaultValue: wakeup_zwave_default_value,
                    configCconfigValue: wakeup_conf_value,
                    configCconfigNodeValue: wakeup_conf_node_value,
                    confNum: 0,
                    confSize: 0,
                    cmd: 'devices[' + nodeId + '].instances[0].commandClasses[0x84]'
                };
            } else {
                //$('#wakeup_cont .cfg-block-content').append('<span>' + $scope._t('config_ui_wakeup_no_min_max') + '</span>');
            }
        }
        ;
        return wakeup_cont;
    }
    /**
     * Get xml config param
     */
    function getCfgXmlParam(cfgXml, nodeId, instance, commandClass, command) {
        //console.log(cfgXml)
        var collection = [];
        var cfg = $filter('hasNode')(cfgXml, 'config.devices.deviceconfiguration');
        var parseParam = function(v,nodeId, instance, commandClass, command){
            if (v['_id'] == nodeId && v['_instance'] == instance && v['_commandclass'] == commandClass && v['_command'] == command) {

                var array = JSON.parse(v['_parameter']);
                if (array.length > 2) {
                    collection[array[0]] = array[1];
                }
                else if (array.length == 2) {
                    collection = array;

                }
                else {
                    collection[0] = array[0];
                    return;
                }
            }
        }
        if (!cfg) {
            return [];
        }
        // Get data for given device by id
        if(_.isArray(cfg) ){
            angular.forEach(cfg, function(v, k) {
                parseParam(v,nodeId, instance, commandClass, command);

            });
        }else{
           parseParam(cfg,nodeId, instance, commandClass, command);
        }

        return collection;

    }

    /**
     * Check if device is in config
     */
    function isInCfgXml(data, cfgXml) {
        var inConfig = false;
        var hasCfgXml = false;
        if (angular.isObject(cfgXml) && $filter('hasNode')(cfgXml, 'config.devices.deviceconfiguration')) {
            hasCfgXml = cfgXml.config.devices.deviceconfiguration;
            if (!_.isArray(hasCfgXml)) {
                var obj = {};
                obj['id'] = hasCfgXml['_id'];
                obj['instance'] = hasCfgXml['_instance'];
                obj['commandclass'] = hasCfgXml['_commandclass'];
                obj['command'] = hasCfgXml['_command'];
                obj['parameter'] = hasCfgXml['_parameter'];
                if (JSON.stringify(obj) === JSON.stringify(data)) {
                    return true;
                }
                return false;
            }
            angular.forEach(hasCfgXml, function(v, k) {

                var obj = {};
                obj['id'] = v['_id'];
                obj['instance'] = v['_instance'];
                obj['commandclass'] = v['_commandclass'];
                obj['command'] = v['_command'];
                obj['parameter'] = v['_parameter'];

                /*console.log('XML:',JSON.stringify(obj))
                 console.log('DATA:',JSON.stringify(data))*/
                if (JSON.stringify(obj) === JSON.stringify(data)) {
                    inConfig = true;
                    return;
                }
            });
        }
        return inConfig;
    }
    /**
     * Get assoc xml config param
     */
    function getCfgXmlAssoc(cfgXml, nodeId, instance, commandClass, command, groupId) {
        var cfg = $filter('hasNode')(cfgXml, 'config.devices.deviceconfiguration');
        if (!cfg) {
            return [];
        }
        // Get data for given device by id
        var collection = [];
        collection[groupId] = {
            nodes: [],
             nodeInstances: []
        };
        if (!(_.isArray(cfg))) {
            if (cfg['_id'] == nodeId && cfg['_instance'] == instance && cfg['_commandclass'] == commandClass && cfg['_command'] == command) {

                var obj = {};
                var array = JSON.parse(cfg['_parameter']);

                if (array.length == 2) {
                    obj['groupId'] = array[0];
                    obj['deviceId'] = array[1];
                    if (array[0] == groupId && array[1] > 1) {
                        collection[groupId].nodes.push(array[1]);
                    }


                }
                if (array.length > 2) {
                        obj['groupId'] = array[0];
                        obj['deviceId'] = array[1];
                        obj['instanceId'] = array[2];
                        if (array[0] == groupId && array[1] > 0) {
                            collection[groupId].nodeInstances.push(array[1] + '_' + array[2]);
                        }
                    }
                }
        } else {
            angular.forEach(cfg, function(v, k) {
                if (v['_id'] == nodeId && v['_instance'] == instance && v['_commandclass'] == commandClass && v['_command'] == command) {
                    var obj = {};
                    var array = JSON.parse(v['_parameter']);
                    if (array.length == 2) {
                        obj['groupId'] = array[0];
                        obj['deviceId'] = array[1];
                        if (array[0] == groupId && array[1] > 0) {
                             collection[groupId].nodes.push(array[1]);
                        }
                    }
                    if (array.length > 2) {
                        obj['groupId'] = array[0]; 
                        obj['deviceId'] = array[1];
                        obj['instanceId'] = array[2];
                        if (array[0] == groupId && array[1] > 0) {
                            collection[groupId].nodeInstances.push(array[1] + '_' + array[2]);
                        }
                    }
                }

            }); 
        }
        return collection;

    }

    /**
     *Build config XML file
     */
    function buildCfgXml(data, cfgXml, id, commandclass) {
        var hasCfgXml = false;
        var assocCc = [133, 142];
       /* var formData = [];
        if (commandclass == '84') {
            var par1 = JSON.parse(data[0]['parameter']);
            var par2 = JSON.parse(data[1]['parameter']);
            var wakeData = {
                'id': id,
                'instance': data[0]['instance'],
                'commandclass': commandclass,
                'command': data[0]['command'],
                'parameter': '[' + par1 + ',' + par2 + ']'
            };
            formData.push(wakeData);
        } else {
            formData = data;
        }
        var xmlData = formData;*/
        var xmlData = data;
        if (angular.isObject(cfgXml) && $filter('hasNode')(cfgXml, 'config.devices.deviceconfiguration')) {
            hasCfgXml = cfgXml.config.devices.deviceconfiguration;
            angular.forEach(hasCfgXml, function(v, k) {
                var obj = {};
                if (v['_id'] == id && v['_commandclass'] == commandclass) {
                    return;
                }
                obj['id'] = v['_id'];
                obj['instance'] = v['_instance'];
                obj['commandclass'] = v['_commandclass'];
                obj['command'] = v['_command'];
                obj['parameter'] = v['_parameter'];
                obj['group'] = v['_group'];
                xmlData.push(obj);

            });
        }
        var ret = buildCfgXmlFile(xmlData);
        return ret;

    }

    /**
     *Build config assoc XML file
     */
    function buildCfgXmlAssoc(data, cfgXml) {
        var hasCfgXml = false;
        var xmlData = [];
        if (angular.isObject(cfgXml) && $filter('hasNode')(cfgXml, 'config.devices.deviceconfiguration')) {
            hasCfgXml = cfgXml.config.devices.deviceconfiguration;
            if (_.isArray(hasCfgXml)) {
                angular.forEach(hasCfgXml, function(v, k) {
                    var obj = {};
                    obj['id'] = v['_id'];
                    obj['instance'] = v['_instance'];
                    obj['commandclass'] = v['_commandclass'];
                    obj['command'] = v['_command'];
                    obj['parameter'] = v['_parameter'];
                    if (JSON.stringify(obj) !== JSON.stringify(data)) {
                        xmlData.push(obj);
                    }
                });

            } else {
                var obj = {};
                obj['id'] = hasCfgXml['_id'];
                obj['instance'] = hasCfgXml['_instance'];
                obj['commandclass'] = hasCfgXml['_commandclass'];
                obj['command'] = hasCfgXml['_command'];
                obj['parameter'] = hasCfgXml['_parameter'];
                if (JSON.stringify(obj) !== JSON.stringify(data)) {
                    xmlData.push(obj);
                }
            }
        }
        xmlData.push(data);
        var ret = buildCfgXmlFile(xmlData);
        return ret;

    }

    /**
     *Delete from cfg xml file - assoc
     */
    function deleteCfgXmlAssoc(data, cfgXml) {
        
        var xmlData = [];
        var hasCfgXml = $filter('hasNode')(cfgXml, 'config.devices.deviceconfiguration');
        if (hasCfgXml) {
            if (_.isArray(hasCfgXml)) {
                angular.forEach(hasCfgXml, function(v, k) {
                    var obj = {};
                    obj['id'] = v['_id'];
                    obj['instance'] = v['_instance'];
                    obj['commandclass'] = v['_commandclass'];
                    obj['command'] = v['_command'];
                    obj['parameter'] = v['_parameter'];
                    if (JSON.stringify(obj) !== JSON.stringify(data)) {
                        xmlData.push(obj);
                        /* 
                         console.log('XML:',JSON.stringify(obj))
                         console.log('DATA:',JSON.stringify(data))*/
                    }

                });
            } else {
                var obj = {};
                obj['id'] = hasCfgXml['_id'];
                obj['instance'] = hasCfgXml['_instance'];
                obj['commandclass'] = hasCfgXml['_commandclass'];
                obj['command'] = hasCfgXml['_command'];
                obj['parameter'] = hasCfgXml['_parameter'];
               
                if (JSON.stringify(obj) !== JSON.stringify(data)) {
                    xmlData.push(obj);
                }
            }

        }
        return buildCfgXmlFile(xmlData);
    }

    /**
     * Build cfg XML file
     */
    function buildCfgXmlFile(xmlData) {
        var xml = '<config><devices>' + "\n";
        angular.forEach(xmlData, function(v, k) {
            if (_.isNumber(parseInt(v.id, 10))) {
                xml += '<deviceconfiguration id="' + v.id + '" instance="' + v.instance + '" commandclass="' + v.commandclass + '" command="' + v.command + '" parameter="' + v.parameter + '"/>' + "\n";
            }
        });
        xml += '</devices></config>' + "\n";
        return xml;

    }
});

/**
 * @overview The parent controller that stores all function used in the child controllers.
 * @author Martin Vach
 */

/**
 * Angular module instance
 */

var appController = angular.module('appController', []);
/**
 * The app base controller.
 * @class BaseController
 */
appController.controller('BaseController', function ($scope, $rootScope, $cookies, $filter, $location, $anchorScroll, $window, $route, $interval, $timeout, cfg, dataService, deviceService, myCache) {
    $scope.nowDate = new Date();
    $scope.loading = false;
    $scope.alert = {message: false, status: 'is-hidden', icon: false};
    $scope.languages = {};
    $scope.orderByArr = {
        field: '',
        reverse:  false
    }


    // Custom IP
    $scope.customIP = {
        'url': cfg.server_url,
        'message': false,
        'connected': false
    };
    $scope.showHome = true;
    if (cfg.custom_ip === true) {
        $scope.showHome = false;
    }

    // Url array
    $scope.urlArray = [];


    // Show page content
    $scope.showContent = false;
    // Global config
    $scope.cfg = cfg;

// Lang settings
    $scope.lang_list = cfg.lang_list;
    // Set language
    $scope.lang = (angular.isDefined($cookies.lang) ? $cookies.lang : cfg.lang);
    //TODO: deprecated
    /*$('.current-lang').html($scope.lang);
    $scope.changeLang = function (lang) {
        $window.alert($scope._t('language_select_reload_interface'));
        $cookies.lang = lang;
        $scope.lang = lang;
    };*/
    // Load language files
    $scope.loadLang = function (lang) {
        // Is lang in language list?
        var lang = (cfg.lang_list.indexOf(lang) > -1 ? lang : cfg.lang);
        dataService.getLanguageFile(lang).then(function (response) {
            angular.extend($scope.languages, response.data);
        }, function (error) {
        });
     };
    $scope.loadLang($scope.lang);

    // Get language lines
    $scope._t = function (key, replacement) {
        return deviceService.getLangLine(key, $scope.languages, replacement);
    };

    // Watch for lang change
    //TODO: deprecated
    /*$scope.$watch('lang', function () {
        $('.current-lang').html($scope.lang);
        $scope.loadLang($scope.lang);
    });*/
    // Order by
    $scope.orderBy = function (field) {
        $scope.orderByArr = {
            field: field,
            reverse:  !$scope.orderByArr.reverse
        }
        $scope.predicate = field;
        $scope.reverse = !$scope.reverse;
    };
    // Get body ID
    $scope.getBodyId = function () {
        var path = $location.path();
        var lastSegment = path.split('/').pop();
        $scope.urlArray = path.split('/');
        return lastSegment;
    };
    /*
     * Menu active class
     */
    $scope.isActive = function (route, segment) {
        var path = $location.path().split('/');
        return (route === path[segment] ? 'active' : '');
    };
    
    /**
     * Check if route match the pattern.
     * @param {string} path
     * @returns {Boolean}
     */
    $scope.routeMatch = function (path) {
        if ($route.current && $route.current.regexp) {
            return $route.current.regexp.test(path);
        }
        return false;
    };

    /**
     *
     * Mobile detect
     */
    $scope.isMobile = deviceService.isMobile(navigator.userAgent || navigator.vendor || window.opera);

    $scope.scrollTo = function (id) {
        $location.hash(id);
        $anchorScroll();
    };

    /**
     *Reload data
     */
    $scope.reloadData = function () {

        myCache.removeAll();
        $route.reload();
    };

    $scope.naviExpanded = {};
    /**
     * Expand/collapse navigation
     * @param {string} key
     * @param {object} $event
     * @param {boolean} status
     * @returns {undefined}
     */
    $scope.expandNavi = function (key, $event, status) {
        if ($scope.naviExpanded[key]) {
            $scope.naviExpanded = {};
            $event.stopPropagation();
            return;
        }
        $scope.naviExpanded = {};
        if (typeof status === 'boolean') {
            $scope.naviExpanded[key] = status;
        } else {
            $scope.naviExpanded[key] = !$scope.naviExpanded[key];
        }
        $event.stopPropagation();
    };
    // Collapse element/menu when clicking outside
    window.onclick = function () {
        if ($scope.naviExpanded) {
            angular.copy({}, $scope.naviExpanded);
            $scope.$apply();
        }
    };

    $scope.modalArr = {};
    /**
     * Open/close a modal window
     * @param {string} key
     * @param {object} $event
     * @param {boolean} status
     * @returns {undefined}
     */
    $scope.handleModal = function (key, $event, status) {
       if (typeof status === 'boolean') {
            $scope.modalArr[key] = status;
        } else {
           if(key){
               $scope.modalArr[key] = !($scope.modalArr[key]);
           }else{
               $scope.modalArr = {};
           }

        }
        if($event){
            $event.stopPropagation();
        }

    };
    // Collapse element/menu when clicking outside
    window.onclick = function () {
        if ($scope.naviExpanded) {
            angular.copy({}, $scope.naviExpanded);
            $scope.$apply();
        }
    };

    $scope.filterExpanded = {};
    /**
     * Expand/collapse filter
     * @param {string} key
     * @param {object} $event
     * @param {boolean} status
     * @returns {undefined}
     */
    $scope.expandFilter = function (key, $event, status) {
        if ($scope.filterExpanded[key]) {
            $scope.filterExpanded = {};
            $event.stopPropagation();
            return;
        }
        $scope.filterExpanded = {};
        if (typeof status === 'boolean') {
            $scope.filterExpanded[key] = status;
        } else {
            $scope.filterExpanded[key] = !$scope.filterExpanded[key];
        }
        $event.stopPropagation();
    };

    $scope.expand = {};
    /**
     * Expand/collapse an element
     * @param {string} key
     * @returns {undefined}
     */
    $scope.expandElement = function (key) {
        $scope.expand[key] = !($scope.expand[key]);
    };

    $scope.rowSpinner = [];
    /**
     * Toggle row spinner
     * @param {string} key
     * @returns {undefined}
     */
    $scope.toggleRowSpinner = function (key) {
        if (!key) {
            $scope.rowSpinner = [];
            return;
        }
        $scope.rowSpinner[key] = !$scope.rowSpinner[key];
    };

    /**
     * Get a value from custom config
     * @param {string} key
     * @returns {string}
     */
    $scope.getCustomCfgVal = function (key) {
        return deviceService.getCustomCfgVal(key);
    };
    // Alertify defaults
    alertify.defaults.glossary.title = cfg.app_name;
    alertify.defaults.glossary.ok = 'OK';
    alertify.defaults.glossary.cancel = 'CANCEL';

    // Extend existing alert (ERROR) dialog
    if (!alertify.alertError) {
        //define a new errorAlert base on alert
        alertify.dialog('alertError', function factory() {
            return{
                build: function () {
                    var errorHeader = '<span class="fa fa-exclamation-triangle fa-lg text-danger" '
                            + 'style="vertical-align:middle;">'
                            + '</span> ' + $scope.getCustomCfgVal('title') + ' - ERROR';
                    this.setHeader(errorHeader);
                }
            };
        }, true, 'alert');
    }

    // Extend existing alert (WARNING) dialog
    if (!alertify.alertWarning) {
        alertify.dialog('alertWarning', function factory() {
            return{
                build: function () {
                    var errorHeader = '<span class="fa fa-exclamation-circle fa-lg text-warning" '
                            + 'style="vertical-align:middle;">'
                            + '</span> ' + $scope.getCustomCfgVal('title') + ' - WARNING';
                    this.setHeader(errorHeader);
                }
            };
        }, true, 'alert');
    }

    /// --- Common APIs  --- ///
    /**
     * Run zwave command
     * @param {string} cmd
     * @param {int} timeout
     */
    $scope.runZwaveCmd = function (cmd, timeout,hideError) {
        timeout = timeout || 1000;
        $scope.toggleRowSpinner(cmd);
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {
            $timeout($scope.toggleRowSpinner, timeout);
        }, function (error) {
            $scope.toggleRowSpinner();
            if(!hideError){
                alertify.alertError($scope._t('error_update_data') + '\n' + cmd);
            }

        });
    };

    /**
     * Set zwave configuration
     * @returns {undefined}
     */
    $scope.loadZwaveConfig = function (nocache) {
        // Set config
        dataService.getApi('configget_url', null, nocache).then(function (response) {
            angular.extend(cfg.zwavecfg, response.data);
        }, function (error) {});
    };

    /**
     * Load zwave dongles
     */
    $scope.setDongle = function () {
        dataService.getApi('zwave_list').then(function (response) {
           if (response.data.length === 1) {
                angular.extend(cfg, {dongle: response.data[0]});
                $cookies.dongle = response.data[0];
            }
                angular.extend(cfg,{dongle_list: response.data});

                angular.extend(cfg, {
                    update_url: '/ZWave.' + cfg.dongle + '/Data/',
                    store_url: '/ZWave.' + cfg.dongle + '/Run/',
                    restore_url: '/ZWave.' + cfg.dongle + '/Restore',
                    queue_url: '/ZWave.' + cfg.dongle + '/InspectQueue',
                    fw_update_url: '/ZWave.' + cfg.dongle + '/FirmwareUpdate',
                    zme_bootloader_upgrade: '/ZWave.' + cfg.dongle + '/ZMEBootloaderUpgrade',
                    zme_firmware_upgrade: '/ZWave.' + cfg.dongle + '/ZMEFirmwareUpgrade',
                    license_load_url: '/ZWave.' + cfg.dongle + '/ZMELicense',
                    zddx_create_url: '/ZWave.' + cfg.dongle + '/CreateZDDX/',
                    'stat_url': '/ZWave.' + cfg.dongle + '/CommunicationStatistics',
                    'postfixget_url': '/ZWave.' + cfg.dongle + '/PostfixGet',
                    'postfixadd_url': '/ZWave.' + cfg.dongle + '/PostfixAdd',
                    'postfixremove_url': '/ZWave.' + cfg.dongle + '/PostfixRemove',
                    //'communication_history_url': '/ZWave.' + cfg.dongle + '/CommunicationHistory',
                    'configget_url': '/ZWave.' + cfg.dongle + '/ExpertConfigGet',
                    'configupdate_url': '/ZWave.' + cfg.dongle + '/ExpertConfigUpdate'

                });

        }, function (error) {
            // todo: deprecated
           /* if (error.status === 401 && cfg.app_type !== 'installer') {
                window.location.href = cfg.smarthome_login;
            }*/

        });
    };


    /**
     * Set timestamp and ping server if request fails
     * @returns {undefined}
     */
    $scope.setTimeStamp = function () {
        dataService.getApi('time', null, true).then(function (response) {
            $interval.cancel($scope.timeZoneInterval);
            angular.extend(cfg.route.time, {string: $filter('setTimeFromBox')(response.data.data.localTimeUT,true)},
                {timestamp: response.data.data.localTimeUT},
                {offset: response.data.data.localTimeZoneOffset});
            var refresh = function () {
                cfg.route.time.timestamp += (cfg.interval < 1000 ? 1 : Math.floor(cfg.interval/1000));
                cfg.route.time.string = $filter('setTimeFromBox')(cfg.route.time.timestamp);
            };

            cfg.zwavecfg.time_zone = response.data.data.localTimeZone;
            $scope.timeZoneInterval = $interval(refresh,cfg.interval);
        }, function (error) {});

    };


    /**
     * Load Box API data
     */
    $scope.boxData = {
        controller: {}
    };
    $scope.loadBoxApiData = function () {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            var hasDevices = Object.keys(ZWaveAPIData.devices).length;
            var homeId = ZWaveAPIData.controller.data.homeId.value;
            var zwayNodeId = ZWaveAPIData.controller.data.nodeId.value;
            var APIVersion = ZWaveAPIData.controller.data.APIVersion.value;
            var showAnalytics = $filter('cmpVersion')(APIVersion,cfg.analytics.required);
            // Changes MK
            //$scope.boxData.controller.controllerState = ZWaveAPIData.controller.data.controllerState.value;
            // Rewrite config
            var cfgController = {
                homeName: ZWaveAPIData.controller.data.homeName.value || cfg.controller.homeName,
                isRealPrimary: ZWaveAPIData.controller.data.isRealPrimary.value,
                homeId: homeId,
                homeIdHex: '0x' + ('00000000' + (homeId + (homeId < 0 ? 0x100000000 : 0)).toString(16)).slice(-8),
                hasDevices: hasDevices < 2 ? false : true,
                zwayNodeId: zwayNodeId,
                APIVersion: APIVersion
            }

            angular.extend(cfg.controller,cfgController);
            if(cfg.app_type === 'installer' ||  showAnalytics > -1){
                angular.extend(cfg.analytics,{show: true});
            }
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));

        });
    };
    /**
     * Load queue data
     */
    $scope.loadBusyIndicator = function () {
        var refresh = function() {
            dataService.getApi('queue_url',null,true).then(function (response) {
                setBusyIndicator(response.data);
            }, function (error) {});

        };
        $interval(refresh, cfg.queue_interval);
    };
    /**
     * Load common APIs
     */
    if($scope.getBodyId() !== ''){
        $scope.loadZwaveConfig();
        $scope.setDongle();
        $scope.setTimeStamp();
        $scope.loadBusyIndicator();
        $scope.loadBoxApiData();
        /*if(cfg.app_type === 'installer'){

            $scope.loadBoxApiData();
        }
*/
    }

    /// --- Private functions --- ///
    /**
     * Set busy indicator
     * @param {object} ZWaveAPIData
     */
    function setBusyIndicator(data) {
        var ret = {
            queueLength: data.length,
            busyLength: 0,
            result: 0,
            /*arrCnt: {
            v: 0,
            s: 0,
            d: 0
        }*/
        }
        angular.forEach(data, function(job, jobIndex) {
            if(job[1][1] === 0 || job[1][2] === 0 || job[1][4] === 0){
                ret.busyLength += 1;
            }
            /*ret.arrCnt.v += job[1][1];
            ret.arrCnt.s += job[1][2];
            ret.arrCnt.d += job[1][4];*/
        });
        ret.result = (ret.queueLength - ret.busyLength);
        //console.log(ret)
        angular.extend(cfg.busy_indicator, ret);
    }

});

/**
 * @overview The uncategorized controllers.
 * @author Martin Vach
 */

/**
 * The controller that handles help page.
 * @class HelpController
 */
appController.controller('HelpController', function($scope, $routeParams) {
    $scope.nodeId = $routeParams.nodeId;
});
/**
 * The controller that handles errors.
 * @class ErrorController
 */
appController.controller('ErrorController', function($scope, $routeParams, deviceService) {
    $scope.errorCfg = {
        code: false,
        icon: 'fa-warning'
    };
    /**
     * Load error
     */
    $scope.loadError = function(code) {
        if (code) {
            $scope.errorCfg.code = code;
        } else {
            $scope.errorCfg.code = 0;
        }
        deviceService.showConnectionError(code);

    };
    $scope.loadError($routeParams.code);

});

/**
 * todo: deprecated
 * This controller handles restoring process from a backup file.
 * @class RestoreController
 *
 */
/*appController.controller('RestoreController', function ($scope, $upload, $window,deviceService,cfg,_) {
    $scope.restore = {
        allow: false,
        input: {
            restore_chip_info: '0'
        }
    };

    /!**
     * Send request to restore from backup
     * @returns {void}
     *!/
    $scope.restoreFromBackup = function($files) {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('restore_wait')};
        var chip = $scope.restore.input.restore_chip_info;
        var url = cfg.server_url + cfg.restore_url + '?restore_chip_info=' + chip;
        //return;
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            $upload.upload({
                url: url,
                fileFormDataName: 'config_backup',
                file: $file
            }).progress(function(evt) {
                //$scope.restoreBackupStatus = 1;
            }).success(function(data, status, headers, config) {
                $scope.handleModal('restoreModal');
                if (data && data.replace(/(<([^>]+)>)/ig, "") !== "null") {//Error
                    alertify.alertError($scope._t('restore_backup_failed'));
                    //$scope.restoreBackupStatus = 3;
                } else {// Success
                    deviceService.showNotifier({message: $scope._t('restore_done_reload_ui')});
                    $window.location.reload();
                    //$scope.restoreBackupStatus = 2;
                }
            }).error(function(data, status) {
                $scope.handleModal('restoreModal');
                alertify.alertError($scope._t('restore_backup_failed'));
                //$scope.restoreBackupStatus = 3;
            });

        }
    };
});*/

/**
 * todo: deprecated
 * This controller handles network inclusion.
 * @class IncludeNetworkController
 *
 */
/*appController.controller('IncludeNetworkController', function($scope, $window,$cookies,$timeout,cfg,dataService) {
    // Controller vars
    $scope.includeNetwork ={
        controllerState: 0
    };

    /!**
     * Include to network
     *!/
    $scope.includeToNetwork = function(cmd) {
        $scope.toggleRowSpinner(cmd);
        $timeout($scope.toggleRowSpinner, 1000);
        runZwaveCmd(cmd);
    };

    /!**
     * Exclude form to network
     *!/
    $scope.excludeFromNetwork = function(cmd,confirm) {
        alertify.confirm(confirm, function () {
            $scope.toggleRowSpinner(cmd);
            $timeout($scope.toggleRowSpinner, 1000);
            runZwaveCmd(cmd);
        });

    };

    /// --- Private functions --- ///

    /!**
     * Run zwave cmd
     * @param {string} cmd
     *!/
    function runZwaveCmd(cmd) {
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {
        }, function (error) {
            alertify.alertError($scope._t('error_load_data') + '\n' + cmd);
        });
    }
    ;


});*/







/**
 * @overview This controller handles data holder and expert config data.
 * @author Martin Vach
 */

/**
 * Load and store expert config data.
 * @class ExpertConfigController
 *
 */
appController.controller('ExpertConfigController', function ($scope, $timeout,$interval, $location, cfg,dataService,deviceService) {
    $scope.expertConfig = {
        input: {}
    };

    /**
     * Load settings
     */
    $scope.loadSettings = function() {
        $scope.expertConfig.input = cfg.zwavecfg;
    };
    $scope.loadSettings();

    /**
     * Store settings
     * @param {object} input
     */
    $scope.storeSettings = function(input,spin) {
        $scope.toggleRowSpinner(spin);
        dataService.postApi('configupdate_url', input).then(function (response) {
            deviceService.showNotifier({message: $scope._t('update_successful')});
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data'));
        });
    };
});

/**
 * Handles data holder.
 * @class DataHolderController
 *
 */
appController.controller('DataHolderController', function ($scope, $timeout,$interval, $location, cfg,dataService,deviceService) {
    $scope.dataHolder = {
        controller: {}
    };
    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function () {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            setControllerData(ZWaveAPIData);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Store networkname
     * @param {object} input
     */
    $scope.storeNetworkName = function(form,input,spin) {
        if(!form.$dirty){
            return;
        }
        var homeName = input.replace(/\"/g, '\'');
        $scope.toggleRowSpinner(spin);
        dataService.postApi('store_url', null, 'controller.data.homeName.value="'+ homeName +'"').then(function (response) {
            cfg.controller.homeName = homeName;
            $scope.save();
            form.$setPristine();
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data'));
        });
    };

    /**
     * Store notes
     * @param {object} input
     */
    $scope.storeNotes = function(form,input,spin) {
        if(!form.$dirty){
            return;
        }
        $scope.toggleRowSpinner(spin);

        input = input.replace(/\"/g, '\'');
        input = input.replace(/\n/g, '<br>');
        dataService.postApi('store_url', null, 'controller.data.homeNotes.value="'+input+'"').then(function (response) {
            $scope.save();
            form.$setPristine();
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data'));
        });
    };

    /**
     * Save dataholder
     */
    $scope.save = function(){
        dataService.postApi('store_url', null, 'devices.SaveData()').then(function (response) {
            //deviceService.showNotifier({message: $scope._t('update_successful')});
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            alertify.alertError($scope._t('error_update_data'));
        });
    };

    /// --- Private functions --- ///
    /**
     * Set controller data
     * @param {object} ZWaveAPIData
     */
    function setControllerData(ZWaveAPIData) {
       $scope.dataHolder.controller.homeName = ZWaveAPIData.controller.data.homeName.value || cfg.controller.homeName;
        $scope.dataHolder.controller.homeNotes = ZWaveAPIData.controller.data.homeNotes.value.replace(/<br>/g, '\n' );
    }

});

/**
 * Displays data holder info.
 * @class DataHolderInfoController
 *
 */
appController.controller('DataHolderInfoController', function($scope, $filter, deviceService) {
    $scope.dataHolderInfo = {
        all: {}
    }
    // Show modal dialog
    $scope.dataHolderModal = function(target, $event, interviewCommands, ccId, type) {
        var imodalId = '#' + target;
        var interviewData = {};
        var updateTime;
        //$(target).modal();
        if (type) {
            angular.forEach(interviewCommands, function(v, k) {
                if (v.ccId == ccId) {
                    interviewData = v[type];
                    updateTime = v.updateTime;
                    return;
                }
            });
        } else {
            interviewData = interviewCommands;
        }

        // Get data
        var html = deviceService.configGetCommandClass(interviewData, '/', '');

        //$scope.dataHolderInfo.all =  deviceService.configGetCommandClass(interviewData, '/', '');
        //console.log(html)
        // Fill modal with data
        $scope.handleModal(target, $event);
        $(imodalId + ' .appmodal-body').html(html);
    };

});
/**
 * @overview This controller handles authentication process.
 * @author Martin Vach
 */
/**
 * Auth default controller
 * @class AuthController
 *
 */
appController.controller('AuthController', function($location,$window) {
    //$location.path('/home');
    window.location = '#/home';
    $window.location.reload();

});

/**
 * Auth installer controller
 * @class AuthInstallerController
 *
 */
appController.controller('AuthInstallerController', function($scope, $location,cfg, $window,cfg,dataService,deviceService) {
    $scope.input = cfg.auth;

    /**
     * Login proccess
     */
    $scope.login = function (input) {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('loading')};
        dataService.logInApi(input).then(function (response) {
            var user = response.data.data;
            deviceService.setZWAYSession(user.sid);
            deviceService.setUser(user);
            window.location = '#/home';
            $window.location.reload();
        }, function (error) {
            $scope.loading = false;
            var message = $scope._t('error_load_data');
            if (error.status == 401) {
                message = $scope._t('error_load_user');
            }
            alertify.alertError(message);
        });
    };

    $scope.login($scope.input);
    /**
     * Login proccess
     */
    $scope.login_ = function (input) {
        //$scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('loading')};
        if (input.login !== cfg.auth.login || input.password !== cfg.auth.password) {
            alertify.alertError($scope._t('error_load_user'));
            $scope.input = {
                login: '',
                password: ''
            };
            return;
        }
        $location.path('/home');
    };

});

/**
 * Logout installer controller
 * @class LogoutInstallerController
 *
 */
appController.controller('LogoutInstallerController', function(deviceService) {
    deviceService.logOut();

});
/**
 * @overview This controller renders and handles settings and configuration.
 * @author Martin Vach
 */

/**
 * This controller renders and handles language settings.
 * @class SettingsLangController
 *
 */
appController.controller('SettingsLangController', function ($scope, $timeout,$window,$cookies,dataService,deviceService) {
   /**
     * Set app language
     * @param {string} lang
     */
    $scope.setLang = function (lang) {
        //$window.alert($scope._t('language_select_reload_interface'));

        alertify.confirm($scope._t('change_date_time_format'))
            .setting('labels', {'ok': $scope._t('yes'),'cancel': $scope._t('no')})
            .set('onok', function (closeEvent) {//after clicking OK
                var input = $scope.cfg.lang_date_time_format[lang]
                dataService.postApi('configupdate_url', input).then(function (response) {
                    deviceService.showNotifier({message: $scope._t('reloading')});
                    deviceService.showNotifier({message: $scope._t('update_successful')});
                    $cookies.lang = lang;
                    $scope.lang = lang;
                    $timeout( function() {
                        $window.location.reload();
                    }, 1000);

                }, function (error) {
                    alertify.alertError($scope._t('error_update_data'));
                });
            })
            .set('oncancel', function (closeEvent) {
                deviceService.showNotifier({message: $scope._t('reloading')});
                $cookies.lang = lang;
                $scope.lang = lang;
                $timeout( function() {
                    $window.location.reload();
                }, 1000);
            });


    };
});

/**
 * This controller renders and handles app settings.
 * @class SettingsAppController
 *
 */
appController.controller('SettingsAppController', function ($scope, $timeout, $window, $interval, $location, $q, cfg,dataService,deviceService) {
    $scope.settings = {
        input: {},
        lastTZ: "",
        lastSsid: "",
        countdown: 60
    };

    /**
     * Load settings
     */
    $scope.loadSettings = function() {

        dataService.getApi('wifi_settings').then(function (response) {
            $scope.settings.input.ssid_name = response.data.data.ssid;
            $scope.settings.lastSsid = response.data.data.ssid;
        }, function (error) {
            $scope.loading = false;
            alertify.alertError($scope._t('error_load_data'));
        });

        $scope.settings.input = cfg.zwavecfg;
        $scope.settings.lastTZ = cfg.zwavecfg.time_zone;
    };

    $scope.loadSettings();

    /**
     * Store settings
     * @param {object} input
     */
    $scope.storeSettings = function(input,$event) {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('updating')};

        if(input.wifi_password !== '' || input.ssid_name !== $scope.settings.lastSsid) {

            var data = {
                "password": input.wifi_password,
                "ssid": input.ssid_name === $scope.settings.lastSsid ? "" : input.ssid_name
            };

            dataService.postApi('wifi_settings', data, null).then(function(response) {
                deviceService.showNotifier({message: $scope._t('update_successful')});
                $timeout( function() {
                    $window.location.reload();
                }, 1000);
                $scope.loading = false;
            }, function(error) {
                $scope.input.ssid_name = $scope.settings.lastSsid;
                alertify.alertError($scope._t('error_load_data'));
            });
        }

        if(input.time_zone !== $scope.settings.lastTZ) {
            var data = {
                    "time_zone": input.time_zone
                };

            dataService.postApi('time_zone', data, null).then(function (response) {
                $scope.loading = false;
                $scope.handleModal('timezoneModal', $event);
                var myint = $interval(function(){
                    $scope.settings.countdown--;
                    if($scope.settings.countdown === 0){
                        $interval.cancel(myint);
                        $location.path('/');
                    }
                }, 1000);
                    // todo: deprecated

                    /*$timeout(function() {
                        $location.path('/');
                    }, timeout);

                    $scope.settings.lastTZ = input.time_zone;
                    alertify.alertWarning($scope._t('z_way_restart', {
                        __val__: timeout/1000,
                        __level__: $scope._t('seconds')
                    }));

                    deviceService.showNotifier({message: $scope._t('update_successful')});
                    $scope.loading = false;*/

                }, function (error) {
                   alertify.alertError($scope._t('error_load_data'));

                });
        } else {
            deviceService.showNotifier({message: $scope._t('update_successful')});
        }

        dataService.postApi('configupdate_url', input).then(function (response) {
            $scope.loading = false;
        }, function (error) {
            $scope.loading = false;
            alertify.alertError($scope._t('error_update_data'));
        });
    };
});

/**
 * This controller renders and handles app settings for default version.
 * @class SettingsAppController
 *
 */
appController.controller('SettingsAppFormatController', function ($scope, $timeout, $window, $interval, $location, $q, cfg,dataService,deviceService) {
    $scope.settingsFormat = {
        input: cfg.zwavecfg
    };

    /**
     * Store settings
     * @param {object} input
     */
    $scope.storeFormatSettings = function(input) {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('updating')};
        dataService.postApi('configupdate_url', input).then(function (response) {
            $scope.loading = false;
        }, function (error) {
            $scope.loading = false;
            alertify.alertError($scope._t('error_update_data'));
        });
    };
});

/**
 * The controller that handles firmware update process.
 * @class SettingsFirmwareController
 *
 */
appController.controller('SettingsFirmwareController', function ($scope, $sce, $timeout, $location, $interval, dataService) {
    $scope.settings = {
        countdown: 60,
        hasSession: true
    };

    $scope.firmwareUpdate = {
        show: false,
        loaded: false,
        url: $sce.trustAsResourceUrl('http://' + $location.host() + ':8084/cgi-bin/main.cgi'),
        softwareCurrentVersion: $scope.boxData.controller.softwareRevisionVersion,
        softwareLatestVersion: false,
        isUpToDate: false
    };
    /**
     * Load latest version
     */
    $scope.loadRazLatest = function () {
        dataService.getRemoteData($scope.cfg.raz_latest_version_url).then(function (response) {
            $scope.firmwareUpdate.softwareLatestVersion = response.data;
            if(response.data === $scope.boxData.controller.softwareRevisionVersion){
                $scope.firmwareUpdate.isUpToDate = true;
            }

        }, function (error) {
        });
    };
    $scope.loadRazLatest();
    /**
     * Set access
     */
    $scope.setAccess = function (param, loader) {
        if (loader) {
            $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('loading')};
        }
        dataService.getApi('firmwareupdate', param, true).then(function (response) {
            if (loader) {
                $scope.firmwareUpdate.show = true;
                $timeout(function () {
                    $scope.loading = false;
                    $scope.firmwareUpdate.loaded = true;
                }, 5000);
            }

        }, function (error) {
            $scope.loading = false;
            if($scope.settings.hasSession){
                alertify.alertError($scope._t('error_load_data'));
            }
        });
    };

    $scope.redirectAfterUpdate = function ($event) {
        dataService.sessionApi().then(function (sessionRes) {
            // do nothing
        }, function (error) {
            $scope.settings.hasSession = false;

            $scope.loading = false;
            $scope.handleModal('timezoneModal', $event);
            var myint = $interval(function(){
                $scope.settings.countdown--;
                if($scope.settings.countdown === 0){
                    $interval.cancel(myint);
                    $location.path('/');
                }
            }, 1000);
        });
    };

});

/**
 * The controller that handles bug report info.
 * @class SettingsReportController
 */
appController.controller('SettingsReportController', function ($scope, $window, $route, cfg,dataService,deviceService) {
    $scope.ZwaveApiData = false;
    $scope.remoteAccess = false;
    $scope.builtInfo = false;
    $scope.input = {
        browser_agent: '',
        browser_version: '',
        browser_info: '',
        shui_version: cfg.app_version,
        zwave_vesion: '',
        controller_info: '',
        remote_id: '',
        remote_activated: 0,
        remote_support_activated: 0,
        zwave_binding: 0,
        email: null,
        content: null,
        app_name:  cfg.app_name,
        app_version: cfg.app_version,
        app_id: cfg.app_id,
        app_type: cfg.app_type,
        app_built_date: '',
        app_built_timestamp: '',
        log: false,
    };

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            $scope.ZwaveApiData = ZWaveAPIData;
        }, function(error) {});
    };
    $scope.loadZwaveData();

    /**
     * Load app built info
     */
    $scope.loadAppBuiltInfo = function() {
        dataService.getAppBuiltInfo().then(function(response) {
            $scope.builtInfo = response.data;
        }, function(error) {});
    };
    $scope.loadAppBuiltInfo();
    /**
     * Load Remote access data
     */
    $scope.loadRemoteAccess = function () {
        dataService.getApi('instances', '/RemoteAccess').then(function (response) {
            $scope.remoteAccess = response.data.data[0];
        }, function (error) {});
    };

    $scope.loadRemoteAccess();

    /**
     * Show log warning
     */
    $scope.showLogWarning = function (message) {
        if(message){
            alertify.alertWarning(message);
        }

    };

    /**
     * Send a report
     */
    $scope.sendReport = function (form, input) {
        if (form.$invalid) {
            return;
        }
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('sending')};
        if ($scope.ZwaveApiData) {
            input.zwave_binding = 1;
            input.zwave_vesion = $scope.ZwaveApiData.controller.data.softwareRevisionVersion.value;
            input.controller_info = JSON.stringify($scope.ZwaveApiData.controller.data);
        }
        if ($scope.builtInfo) {
            input.app_built_date = $scope.builtInfo.built;
            input.app_built_timestamp =  $scope.builtInfo.timestamp;
        }

        if (Object.keys($scope.remoteAccess).length > 0) {
            input.remote_activated = $scope.remoteAccess.params.actStatus ? 1 : 0;
            input.remote_support_activated = $scope.remoteAccess.params.sshStatus ? 1 : 0;
            input.remote_id = $scope.remoteAccess.params.userId;

        }
        input.browser_agent = $window.navigator.appCodeName;
        input.browser_version = $window.navigator.appVersion;
        input.browser_info = 'PLATFORM: ' + $window.navigator.platform + '\nUSER-AGENT: ' + $window.navigator.userAgent;
        if(input.log){
            $scope.sendReportLog(input);

        }else{
            $scope.sendReportNoLog(input);
        }
        //console.log(input)
        //return;

    };

    /**
     *  Send a report without log
     * @param {array}input
     */
    $scope.sendReportNoLog = function (input) {
        dataService.postReport(input).then(function (response) {
            $scope.loading = false;
            deviceService.showNotifier({message: $scope._t('success_send_report') + ' ' + input.email});
            $route.reload();
        }, function (error) {
            alertify.alertError($scope._t('error_send_report'));
            $scope.loading = false;
        });
    };

    /**
     *  Send a report with log
     * @param {array}input
     */
    $scope.sendReportLog= function (input) {
        dataService.postApi('post_report_api', input).then(function (response) {
            $scope.loading = false;
            deviceService.showNotifier({message: $scope._t('success_send_report') + ' ' + input.email});
            $route.reload();
        }, function (error) {
            alertify.alertError($scope._t('error_send_report'));
            $scope.loading = false;
        });
    };
});
/**
 * @overview This controller renders and handles dongles.
 * @author Martin Vach
 */

/**
 * This controller handles dongles.
 * @class DongleController'
 *
 */
appController.controller('DongleController', function($scope, $window,$cookies,cfg,dataService) {
    // Controller vars
    $scope.homeDongle ={
        model: {
            current: $scope.cfg.dongle,
            dongle: ''
        },
        //data: ['zway','newdongle','mydongle'],
        data: cfg.dongle_list
    };

    /**
     * Set dongle
     */
    $scope.setHomeDongle = function() {
        if($scope.homeDongle.model.dongle === ''){
            return;
        }
        angular.extend($scope.cfg,{dongle: $scope.homeDongle.model.dongle});
        $cookies.dongle = $scope.homeDongle.model.dongle;
        $window.location.reload();
    };
});
/**
 * @overview This controller renders and handles switches.
 * @author Martin Vach
 */

/**
 * Switch root controller
 * @class SwitchController
 *
 */
appController.controller('SwitchController', function ($scope, $filter, $timeout, $interval, dataService, deviceService,cfg, _) {
    $scope.switches = {
        ids: [],
        all: [],
        interval: null,
        rangeSlider: [],
        switchButton: [],
        show: false
    };
    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.switches.interval);
    });

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function () {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            setData(ZWaveAPIData);
            if (_.isEmpty($scope.switches.all)) {
                $scope.alert = {
                    message: $scope._t('device_404'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation-circle'
                };
                return;
            }
            $scope.switches.show = true;
            $scope.refreshZwaveData();
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function () {
        var refresh = function () {
            dataService.loadJoinedZwaveData().then(function (response) {
                var update = false;
                angular.forEach(response.data.update, function(v, k) {
                    // Get node ID from response
                    var findId = k.split('.')[1];
                    // Check if node ID is in the available devices
                    if($scope.switches.ids.indexOf(findId) > -1){
                        update = true;
                        //console.log('Updating nodeId: ',findId);
                        return;
                    }
                });
                // Update found - updating available devices
                if(update){
                    setData(response.data.joined);
                }
                //setData(response.data.joined,nodeId);
            }, function (error) {
            });
        };
        $scope.switches.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Update switch
     * @param {string} url
     */
    $scope.updateSwitch = function (url, $index) {
        $scope.toggleRowSpinner(url);
        dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + url);
        });
    };
    /**
     * Update all switches
     * @param {string} id
     * @param {string} urlType
     */
    $scope.updateAllSwitches = function (id, urlType) {
        var lastItem = _.last($scope.switches.all);
        $scope.toggleRowSpinner(id);
        angular.forEach($scope.switches.all, function (v, k) {
            $scope.toggleRowSpinner(v[urlType]);
            dataService.runZwaveCmd(cfg.store_url + v[urlType]).then(function (response) {
                alertify.dismissAll();
            }, function (error) {
                alertify.dismissAll();
                alertify.alertError($scope._t('error_update_data') + '\n' + v[urlType]);
            });
            if (lastItem.rowId === v.rowId) {
                $timeout($scope.toggleRowSpinner, 1000);
            }
        });

    };

    /**
     * Calls function when slider handle is grabbed
     */
    $scope.sliderOnHandleDown = function () {
        $interval.cancel($scope.switches.interval);
    };

    /**
     * Calls function when slider handle is released
     * @param {string} cmd
     * @param {int} index
     */
    $scope.sliderOnHandleUp = function (cmd, index) {
        $scope.refreshZwaveData(null);
        var val = $scope.switches.rangeSlider[index];
        var url = cmd + '.Set(' + val + ')';
        dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
            $scope.toggleRowSpinner();
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + url);
        });
    };

    /**
     * Update switch with slider
     * @param {string} cmd
     * @param {int} index
     */
    /*$scope.sliderChange = function(cmd, index) {
     var val = $scope.switches.rangeSlider[index];
     var url = cmd + '.Set(' + val + ')';
     dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
     $scope.toggleRowSpinner();
     }, function (error) {
     $scope.toggleRowSpinner();
     alertify.alertError($scope._t('error_update_data') + '\n' + url);
     });
     };*/

    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        /**
         * todo: does not work properly - check "Update all"
         * Set data for one device only
         */
        /*if(nodeId && ZWaveAPIData.devices[nodeId]){
            console.log('Updating only nodeId: ',nodeId)
            setNodeInstance(ZWaveAPIData.devices[nodeId], nodeId);
            return;
        }*/
        /**
         * Set data for all available devices
         */
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop through devices
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            var type = deviceService.deviceType(node);
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value || type == 'static') {
                return;
            }
            setNodeInstance(node, nodeId);

        });
    }
    ;
    /**
     * Set node instance
     * @param node
     * @param nodeId
     */
    function setNodeInstance(node, nodeId){
        // Loop throught instances
        var cnt = 0;
        angular.forEach(node.instances, function (instance, instanceId) {
            cnt++;
            // angular.forEach([0x25, 0x26], function(ccId) {
            /*if (!(ccId in instance.commandClasses)) return;
             var switchAllValue = null;
             var hasSwitchAll = (0x27 in instance.commandClasses) && (instanceId == 0);
             if (hasSwitchAll) {
             switchAllValue = instance.commandClasses[0x27].data.mode.value;
             }*/
            /* if (instanceId == 0 && _.size(node.instances) > 1) {
             return;// we skip instance 0 if there are more, since it should be mapped to other instances or their superposition
             }*/
            var hasBinary = 0x25 in instance.commandClasses;
            var hasMultilevel = 0x26 in instance.commandClasses;
            var hasSwitchAll = (0x27 in instance.commandClasses) && (instanceId == 0);
            var ccId;
            var switchAllValue = null;

            if (hasMultilevel) {
                ccId = 0x26;
            } else if (hasBinary) {
                ccId = 0x25;
            } else {
                return; // we skip instance if there is no SwitchBinary or SwitchMultilevel CCs
            }


            // var hasSwitchAll = (0x27 in instance.commandClasses) && (instanceId == 0);
            if (hasSwitchAll) {
                switchAllValue = instance.commandClasses[0x27].data.mode.value;
            }
            var deviceType = ccId == 0x25 ? 'binary' : 'multilevel';

            var genericType = node.data.genericType.value;
            var specificType = node.data.specificType.value;
            var genspecType = genericType + '/' + specificType;

            // Set object
            var obj = {};

            // Motor devices
            var btnOn = $scope._t('switched_on');
            var btnOff = $scope._t('switched_off');
            var btnFull = $scope._t('btn_full');
            var hasMotor = false;
            var motorDevices = ['17/3', '17/5', '17/6', '17/7', '9/0', ' 9/1'];
            if (motorDevices.indexOf(genspecType) !== -1) {
                btnOn = $scope._t('btn_switched_up');
                btnOff = $scope._t('btn_switched_down');
                hasMotor = true;
            }
            //console.log(nodeId + '.' + instanceId + ': ' + genspecType + ' motor: ' + hasMotor);
            var multiChannel = false;
            if (0x60 in instance.commandClasses) {
                multiChannel = true;
            }
            var level = updateLevel(instance.commandClasses[ccId].data.level, ccId, btnOn, btnOff);
            obj['id'] = nodeId;
            obj['cmd'] = instance.commandClasses[ccId].data.name + '.level';
            obj['iId'] = instanceId;
            obj['ccId'] = ccId;
            obj['hasMotor'] = hasMotor;
            obj['multiChannel'] = multiChannel;
            obj['deviceType'] = deviceType;
            obj['genericType'] = genericType;
            obj['specificType'] = specificType;
            obj['hasSwitchAll'] = hasSwitchAll;
            obj['switchAllValue'] = switchAllValue;
            obj['rowId'] = 'switch_' + nodeId + '_' + cnt;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['updateTime'] = instance.commandClasses[ccId].data.level.updateTime;
            obj['invalidateTime'] = instance.commandClasses[ccId].data.level.invalidateTime;
            obj['dateTime'] = $filter('getDateTimeObj')(instance.commandClasses[ccId].data.level.updateTime, obj['invalidateTime']);
            obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Get()';
            obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
            //obj['level'] = ZWaveAPIData.devices[nodeId].instances[instanceId].commandClasses[ccId].data.level;
            obj['level'] = level.level_cont;
            obj['levelColor'] = level.level_color;
            obj['levelStatus'] = level.level_status;
            obj['levelMax'] = level.level_max;
            obj['levelVal'] = level.level_val;
            obj['urlToOff'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Set(0)';
            obj['urlToOn'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Set(255)';
            obj['urlToFull'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Set(99)';
            obj['urlToSlide'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
            obj['btnOn'] = btnOn;
            obj['btnOff'] = btnOff;
            obj['btnFull'] = btnFull;
            obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.level';
            // obj['deviceIcon'] = $filter('deviceIcon')(obj);
            var findIndex = _.findIndex($scope.switches.all, {rowId: obj.rowId});
            if (findIndex > -1) {
                angular.extend($scope.switches.all[findIndex], obj);
                $scope.switches.rangeSlider[findIndex] = level.level_val;

            } else {
                $scope.switches.all.push(obj);
                $scope.switches.rangeSlider.push(obj['range_' + nodeId] = level.level_val);
            }
            // Push available device id to an array
            if($scope.switches.ids.indexOf(nodeId) === -1){
                $scope.switches.ids.push(nodeId);
            }

            //});
        });
    }

    /**
     * Update level
     * @param {object} obj
     * @param {number}  ccId
     * @param {string} btnOn
     * @param {string} btnOff
     * @returns {{level_cont: *, level_color: *, level_status: string, level_val: number, level_max: number}}
     */
    function updateLevel(obj, ccId, btnOn, btnOff) {

        var level_cont;
        var level_color;
        var level_status = 'off';
        var level_val = 0;
        var level_max = 99;

        //var level = obj.value;
        var level = (angular.isDefined(obj.value) ? obj.value : null);

        if (level === '' || level === null) {
            level_cont = '?';
            level_color = 'gray';
        } else {
            if (level === false)
                level = 0;
            if (level === true)
                level = 255;
            level = parseInt(level, 10);
            if (level === 0) {
                level_cont = btnOff;
                level_color = '#a94442';
            } else if (level === 255 || level === 99) {
                level_status = 'on';
                level_cont = btnOn;
                level_color = '#3c763d';
//                if(level > 99){
//                    level_max = 255;
//                }
                //level_val = level;
                level_val = (level < 100 ? level : 99);
            } else {
                level_cont = level.toString() + ((ccId == 0x26) ? '%' : '');
                var lvlc_r = ('00' + parseInt(0x9F + 0x60 * level / 99).toString(16)).slice(-2);
                var lvlc_g = ('00' + parseInt(0x7F + 0x50 * level / 99).toString(16)).slice(-2);
                level_color = '#' + lvlc_r + lvlc_g + '00';
                level_status = 'on';
                // level_val = level;
                level_val = (level < 100 ? level : 99);
            }
        }
        ;
        return {
            "level_cont": level_cont,
            "level_color": level_color,
            "level_status": level_status,
            "level_val": level_val,
            "level_max": level_max
        };
    }
    ;
});
/**
 * @overview This controller renders and handles sensors.
 * @author Martin Vach
 */

/**
 * Sensor root controller
 * @class SensorsController
 *
 */
appController.controller('SensorsController', function($scope, $filter, $timeout,$interval,cfg,dataService,_) {
    $scope.sensors = {
        ids: [],
        all: [],
        interval: null,
        show: false
    };
    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.sensors.interval);
    });

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            if(_.isEmpty($scope.sensors.all)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            $scope.sensors.show = true;
            $scope.refreshZwaveData();
        }, function(error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                var update = false;
                angular.forEach(response.data.update, function(v, k) {
                    // Get node ID from response
                    var findId = k.split('.')[1];
                    // Check if node ID is in the available devices
                    if($scope.sensors.ids.indexOf(findId) > -1){
                        update = true;
                        //console.log('Updating nodeId: ',findId);
                        return;
                    }
                });
                // Update found - updating available devices
                if(update){
                    setData(response.data.joined);
                }
            }, function(error) {});
        };
        $scope.sensors.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Update sensor
     * @param {string} url
     */
    $scope.updateSensor = function(id,url) {
        $scope.toggleRowSpinner(id);
        dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + url);
        });
    };

    /**
     * Update all sensors
     * @param {string} id
     * @param {string} urlType
     */
    $scope.updateAllSensors = function(id,urlType) {
        var lastItem = _.last($scope.sensors.all);
        $scope.toggleRowSpinner(id);
        angular.forEach($scope.sensors.all, function(v, k) {
            $scope.toggleRowSpinner(v.cmdToUpdate);
            dataService.runZwaveCmd(cfg.store_url + v[urlType]).then(function (response) {
                alertify.dismissAll();
            }, function (error) {
                alertify.dismissAll();
                alertify.alertError($scope._t('error_update_data') + '\n' +  v[urlType]);
            });
            if(lastItem.rowId === v.rowId){
                $timeout($scope.toggleRowSpinner, 1000);
            }
        });

    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        $scope.updateTime = ZWaveAPIData.updateTime;
        $scope.controllerId = ZWaveAPIData.controller.data.nodeId.value;

        var cnt = 0;
        // Loop through devices
        angular.forEach(ZWaveAPIData.devices, function(device, k) {
            if (k == 255 || k == $scope.controllerId || device.data.isVirtual.value) {
                return false;
            }
            // Loop through instances
            angular.forEach(device.instances, function(instance, instanceId) {
                if (instanceId == 0 && device.instances.length > 1) {
                    return;
                }// Look for SensorBinary - Loop throught 0x30 commandClasses
                var sensorBinary = instance.commandClasses[0x30];

                if (angular.isObject(sensorBinary)) {
                    angular.forEach(sensorBinary.data, function(val, key) {
                        // Not a sensor type
                        var sensor_type = parseInt(key, 10);
                        if (isNaN(sensor_type)) {
                            return;
                        }
                        var devName = $filter('deviceName')(k, device);
                        // Set object
                        var obj = {};
                        obj['id'] = k;
                        obj['iId'] = instanceId;
                        obj['cmd'] = sensorBinary.data.name + '.' + val.name;
                        obj['cmdId'] = '48';
                        obj['rowId'] = sensorBinary.name + '_' + k + '_' + instanceId + '_' + sensor_type;
                        obj['name'] = devName;
                        obj['type'] = sensorBinary.name;
                        obj['purpose'] = val.sensorTypeString.value;
                        obj['level'] = (val.level.value ? '<span class="sensor-triggered">' + $scope._t('sensor_triggered') + '</span>' : $scope._t('sensor_idle'));
                        obj['html'] = true;
                        obj['levelExt'] = null;
                        obj['invalidateTime'] = val.invalidateTime;
                        obj['updateTime'] = val.updateTime;
                        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                        obj['dateTime'] = $filter('getDateTimeObj')(val.updateTime,obj['invalidateTime']);
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[48].Get()';
                        obj['cmdToUpdate'] = 'devices.' + obj['id'] + '.instances.' + instanceId + '.commandClasses.48.data.' + sensor_type;
                        var findIndex = _.findIndex($scope.sensors.all, {rowId: obj.rowId});
                        if(findIndex > -1){
                            angular.extend($scope.sensors.all[findIndex],obj);

                        }else{
                            $scope.sensors.all.push(obj);
                        }
                        if($scope.sensors.ids.indexOf(k) === -1){
                            $scope.sensors.ids.push(k);
                        }
                    });
                }


                // Look for SensorMultilevel - Loop throught 0x31 commandClasses
                var sensorMultilevel = instance.commandClasses[0x31];
                if (angular.isObject(sensorMultilevel)) {
                    angular.forEach(sensorMultilevel.data, function(val, key) {
                        // Not a sensor type
                        var sensor_type = parseInt(key, 10);
                        if (isNaN(sensor_type)) {
                            return;
                        }

                        obj = instance.commandClasses[0x31];
                        var devName = $filter('deviceName')(k, device);
                        // Check for commandClasses data
                        var obj = {};
                        obj['id'] = k;
                        obj['iId'] = instanceId;
                        obj['cmd'] = sensorMultilevel.data.name + '.' + val.name;
                        obj['cmdId'] = '49';
                        obj['rowId'] = sensorMultilevel.name + '_' + k + '_' + instanceId + '_' + sensor_type;
                        obj['name'] = devName;
                        obj['type'] = sensorMultilevel.name;
                        obj['purpose'] = val.sensorTypeString.value;
                        obj['level'] = val.val.value;
                        obj['levelExt'] = val.scaleString.value;
                        obj['invalidateTime'] = val.invalidateTime;
                        obj['updateTime'] = val.updateTime;
                        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                        obj['dateTime'] = $filter('getDateTimeObj')(val.updateTime,obj['invalidateTime']);
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[49].Get()';
                        obj['cmdToUpdate'] = 'devices.' + obj['id'] + '.instances.' + instanceId + '.commandClasses.49.data.' + sensor_type;
                        var findIndex = _.findIndex($scope.sensors.all, {rowId: obj.rowId});
                        if(findIndex > -1){
                            angular.extend($scope.sensors.all[findIndex],obj);

                        }else{
                            $scope.sensors.all.push(obj);

                        }
                        if($scope.sensors.ids.indexOf(k) === -1){
                            $scope.sensors.ids.push(k);
                        }
                    });
                }

                // Look for Meter - Loop throught 0x32 commandClasses
                var meters = instance.commandClasses[0x32];
                if (angular.isObject(meters)) {
                    angular.forEach(meters.data, function(meter, key) {
                        realEMeterScales = [0, 1, 3, 8, 9];// Not in [0, 1, 3, 8, 9] !== -1
                        var sensor_type = parseInt(key, 10);
                        if (isNaN(sensor_type)) {
                            return;
                        }

                        if (meter.sensorType.value == 1 && realEMeterScales.indexOf(sensor_type) != -1) {
                            return; // filter only for eMeters
                        }
                        if (meter.sensorType.value > 1) {
                            return; //  gas and water have real meter scales
                        }
                        var devName = $filter('deviceName')(k, device);
                        var obj = {};

                        obj['id'] = k;
                        obj['iId'] = instanceId;
                        obj['cmd'] = meters.data.name + '.' + meter.name;
                        obj['cmdId'] = '50';
                        obj['rowId'] = meters.name + '_' + k + '_' + instanceId + '_' + sensor_type;
                        obj['name'] = devName;
                        obj['type'] = meters.name;
                        obj['purpose'] = meter.sensorTypeString.value;
                        obj['level'] = meter.val.value;
                        obj['levelExt'] = meter.scaleString.value;
                        obj['invalidateTime'] = meter.invalidateTime;
                        obj['updateTime'] = meter.updateTime;
                        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                        obj['dateTime'] = $filter('getDateTimeObj')(meter.updateTime,obj['invalidateTime']);
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[50].Get()';
                        obj['cmdToUpdate'] = 'devices.' + obj['id'] + '.instances.' + instanceId + '.commandClasses.50.data.' + sensor_type;
                        var findIndex = _.findIndex($scope.sensors.all, {rowId: obj.rowId});
                        if(findIndex > -1){
                            angular.extend($scope.sensors.all[findIndex],obj);

                        }else{
                            $scope.sensors.all.push(obj);
                            $scope.sensors.ids.push(k);
                        }
                        if($scope.sensors.ids.indexOf(k) === -1){
                            $scope.sensors.ids.push(k);
                        }
                    });
                }

                var alarmSensor = instance.commandClasses[0x9c];
                if (angular.isObject(alarmSensor)) {
                    //return;
                    angular.forEach(alarmSensor.data, function(val, key) {
                        // Not a sensor type
                        var sensor_type = parseInt(key, 10);
                        if (isNaN(sensor_type)) {
                            return;
                        }
                        var devName = $filter('deviceName')(k, device);
                        // Set object
                        var obj = {};
                        obj['id'] = k;
                        obj['iId'] = instanceId;
                        obj['cmd'] = alarmSensor.data.name + '.' + val.name;
                        obj['cmdId'] = '0x9c';
                        obj['rowId'] = alarmSensor.name + '_' + k + '_' + instanceId + '_' + sensor_type;
                        obj['name'] = devName;
                        obj['type'] = alarmSensor.name;
                        obj['purpose'] = val.typeString.value;
                        obj['level'] = (val.sensorState.value ? '<span class="sensor-triggered">' + $scope._t('sensor_triggered') + '</span>' : $scope._t('sensor_idle'));
                        obj['html'] = true;
                        obj['levelExt'] = null;
                        obj['invalidateTime'] = val.invalidateTime;
                        obj['updateTime'] = val.updateTime;
                        obj['dateTime'] = $filter('getDateTimeObj')(val.updateTime,obj['invalidateTime']);
                        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[156].Get()';
                        obj['cmdToUpdate'] = 'devices.' + obj['id'] + '.instances.' + instanceId + '.commandClasses.156.data.' + sensor_type;
                        var findIndex = _.findIndex($scope.sensors.all, {rowId: obj.rowId});
                        if(findIndex > -1){
                            angular.extend($scope.sensors.all[findIndex],obj);

                        }else{
                            $scope.sensors.all.push(obj);
                        }
                        if($scope.sensors.ids.indexOf(k) === -1){
                            $scope.sensors.ids.push(k);
                        }

                    });
                }

            });

        });
    }
});
/**
 * @overview This controller renders and handles meters.
 * @author Martin Vach
 */

/**
 * Meter root controller
 * @class MetersController
 *
 */
appController.controller('MetersController', function($scope, $filter, $timeout,$interval,dataService, cfg,_) {
    $scope.meters = {
        ids: [],
        all: [],
        interval: null,
        show: false
    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.meters.interval);
    });

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            if(_.isEmpty($scope.meters.all)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            $scope.meters.show = true;
            $scope.refreshZwaveData();
        }, function(error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                var update = false;
                angular.forEach(response.data.update, function(v, k) {
                    // Get node ID from response
                    var findId = k.split('.')[1];
                    // Check if node ID is in the available devices
                    if($scope.meters.ids.indexOf(findId) > -1){
                        update = true;
                        //console.log('Updating nodeId: ',findId);
                        return;
                    }
                });
                // Update found - updating available devices
                if(update){
                    setData(response.data.joined);
                }
            }, function(error) {});
        };
        $scope.meters.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Update meter
     * @param {string} url
     */
    $scope.updateMeter = function(url) {
        $scope.toggleRowSpinner(url);
        dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + url);
        });
    };

    /**
     * Update all meters
     * @param {string} id
     * @param {string} urlType
     */
    $scope.updateAllMeters = function(id,urlType) {
        var lastItem = _.last($scope.meters.all);
        $scope.toggleRowSpinner(id);
        angular.forEach($scope.meters.all, function(v, k) {
            $scope.toggleRowSpinner(v[urlType]);
            dataService.runZwaveCmd(cfg.store_url + v[urlType]).then(function (response) {
                alertify.dismissAll();
            }, function (error) {
                alertify.dismissAll();
                alertify.alertError($scope._t('error_update_data') + '\n' +  v[urlType]);
            });
            if(lastItem.rowId === v.rowId){
                $timeout($scope.toggleRowSpinner, 1000);
            }
        });

    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        $scope.controllerId = ZWaveAPIData.controller.data.nodeId.value;

        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(device, k) {
            if (k == 255 || k == $scope.controllerId || device.data.isVirtual.value) {
                return false;
            }
            // Loop throught instances
            angular.forEach(device.instances, function(instance, instanceId) {
                if (instanceId == 0 && device.instances.length > 1) {
                    return;
                }

                // Look for Meter - Loop throught 0x32 commandClasses
                var meters = instance.commandClasses[0x32];
                if (angular.isObject(meters)) {
                    angular.forEach(meters.data, function(meter, key) {
                        realEMeterScales = [0, 1, 3, 8, 9];// Not in [0, 1, 3, 8, 9] !== -1
                        var scaleId = parseInt(key, 10);
                        if (isNaN(scaleId)) {
                            return;
                        }
                        if (meter.sensorType.value == 1 && realEMeterScales.indexOf(scaleId) === -1) {
                            return; // filter only for eMeters
                        }
                        /*if (meter.sensorType.value > 1) {
                            return; //  gas and water have real meter scales
                        }*/
                        var obj = {};
                        obj['id'] = k;
                        obj['iId'] = instanceId;
                        obj['cmd'] = meters.name + '.' + meter.name;
                        obj['cmdId'] = 0x30;
                        obj['rowId'] = meters.name + '_' + meter.name + '_' + k;
                        obj['name'] = $filter('deviceName')(k, device);
                        obj['type'] = meters.name;
                        obj['purpose'] = meter.sensorTypeString.value;
                        obj['level'] = meter.val.value;
                        obj['levelExt'] = meter.scaleString.value;
                        obj['invalidateTime'] = meter.invalidateTime;
                        obj['updateTime'] = meter.updateTime;
                        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                        obj['dateTime'] = $filter('getDateTimeObj')(meter.updateTime,obj['invalidateTime']);
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[50].Get()';
                        obj['cmdToUpdate'] = 'devices.' + k + '.instances.' + instanceId + '.commandClasses.' + 0x32 + '.data.' + scaleId;
                        if (ZWaveAPIData.devices[obj['id']].instances[instanceId].commandClasses[0x32].data.version.value < 2
                                || !ZWaveAPIData.devices[obj['id']].instances[instanceId].commandClasses[0x32].data.resettable.value) {
                            obj['urlToReset'] = null;
                        } else {
                            obj['urlToReset'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[50].Reset()';
                        }

                        var findIndex = _.findIndex($scope.meters.all, {rowId: obj.rowId});
                        if(findIndex > -1){
                            angular.extend($scope.meters.all[findIndex],obj);

                        }else{
                            $scope.meters.all.push(obj);
                        }
                        if($scope.meters.ids.indexOf(k) === -1){
                            $scope.meters.ids.push(k);
                        }
                    });
                }

            });
        });
    }
});
/**
 * @overview This controller renders and handles thermostats.
 * @author Martin Vach
 */

/**
 * Thermostat root controller
 * @class ThermostatController
 *
 */
appController.controller('ThermostatController', function($scope, $filter, $timeout,$interval,dataService, cfg,_) {
    $scope.thermostats = {
        ids: [],
        all: [],
        interval: null,
        show: false,
        rangeSlider: [],
        mChangeMode: []
    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.thermostats.interval);
    });

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            if(_.isEmpty($scope.thermostats.all)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            $scope.thermostats.show = true;
            $scope.refreshZwaveData(ZWaveAPIData);
        }, function(error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                var update = false;
                angular.forEach(response.data.update, function(v, k) {
                    // Get node ID from response
                    var findId = k.split('.')[1];
                    // Check if node ID is in the available devices
                    if($scope.thermostats.ids.indexOf(findId) > -1){
                        update = true;
                        //console.log('Updating nodeId: ',findId);
                        return;
                    }
                });
                // Update found - updating available devices
                if(update){
                    setData(response.data.joined);
                }
            }, function(error) {});
        };
        $scope.thermostats.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Update thermostat mode
     * @param {string} url
     * @param {string} mode
     */
    $scope.updateThermostatMode = function(url,mode) {
        if (!mode) {
            return;
        }
        $scope.toggleRowSpinner(url);
        url = url + '.Set(' + mode + ')';
        updateThermostat(url);
    };

    /**
     * Update thermostat temperature on click
     * @param {string} url
     * @param {int}  index
     * @param {string}  type
     */
    $scope.updateThermostatTempClick = function(v, index, type) {
        var url = v.urlChangeTemperature;
        var step = v.range.step;
        $scope.toggleRowSpinner(url);
        var val = $scope.thermostats.rangeSlider[index];
        var min = parseInt( v.range.min,1);
        var max = parseInt(v.range.max, 1);
        var count = (type === '-' ? val - step: val + step);
        if (count < min) {
            count = min;
        }
        if (count > max) {
            count = max;
        }
        $scope.thermostats.rangeSlider[index] = count;
        url += '.Set('+v.curThermMode+',' + count + ')';
        updateThermostat(url);
    };

    /**
     * Calls function when slider handle is grabbed
     */
    $scope.sliderOnHandleDown = function() {
        $interval.cancel($scope.thermostats.interval);
    };


    /**
     * Calls function when slider handle is released
     * @param {string} cmd
     * @param {int} index
     */
    $scope.sliderOnHandleUp = function(v, index) {
        var url = v.urlChangeTemperature;
        var step = v.range.step;
        $scope.toggleRowSpinner(url);
        $scope.refreshZwaveData();
        var count = parseFloat($scope.thermostats.rangeSlider[index]);
        var min = parseInt( v.range.min,1);
        var max = parseInt(v.range.max, 1);
        if (count < min) {
            count = min;
        }
        if (count > max) {
            count = max;
        }
        //count =  Math.round(count*2)/2;
        if((step % 1) === 0){//Step is a whole number
            count = Math.round(count);
        }else{//Step has a decimal place
            // Dec Number is > 5 - Rounding up
            // E.g.: 22.7 to 23
            if((count % 1) > step){
                count = Math.round(count);
            }
            // Dec Number is =< 5 - Rounding down + step
            // E.g.: 22.2 to 22.5
            else if((count % 1) > 0.0 && (count % 1) < 0.6){
                count = (Math.round(count) +step);
            }
        }

        $scope.thermostats.rangeSlider[index] = count;
        url += '.Set('+v.curThermMode+',' + count + ')';
        updateThermostat(url);
    };

    /// --- Private functions --- ///

    /**
     * Update thermostat
     * @param {string} url
     */
    function updateThermostat(url) {
        dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + url);
        });
    };

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }

            // Loop throught instances
            var cnt = 1;
            angular.forEach(node.instances, function(instance, instanceId) {
                // we skip devices without ThermostatSetPint AND ThermostatMode CC
                if (!(0x43 in instance.commandClasses) && !(0x40 in instance.commandClasses)) {
                    return;
                }

                var ccId;
                var curThermMode = getCurrentThermostatMode(instance);
                var level = null;
                var hasExt = false;
                var updateTime;
                var invalidateTime;
                var modeType = null;
                var modeList = {};
                //var urlChangeTemperature = false;
                var scale = null;

                var hasThermostatMode = 0x40 in instance.commandClasses;
                var hasThermostatSetpoint = 0x43 in instance.commandClasses;
                var isThermostatMode = false;
                var isThermostatSetpoint = false;
                //var hasThermostatSetback = 0x47 in instance.commandClasses;
                //var hasClimateControlSchedule = 0x46 in instance.commandClasses;
                //var curThermModeName = '';

                if (!hasThermostatSetpoint && !hasThermostatMode) { // to include more Thermostat* CCs
                    return; // we don't want devices without ThermostatSetpoint AND ThermostatMode CCs
                }
                if (hasThermostatMode) {
                    ccId = 0x40;
                }
                else if (hasThermostatSetpoint) {
                    ccId = 0x43;

                }
                if (hasThermostatMode) {
                    //curThermModeName = (curThermMode in instance.commandClasses[0x40].data) ? instance.commandClasses[0x40].data[curThermMode].modeName.value : "???";
                    modeList = getModeList(instance.commandClasses[0x40].data);
                    if (curThermMode in instance.commandClasses[0x40].data) {
                        updateTime = instance.commandClasses[0x40].data.mode.updateTime;
                        invalidateTime = instance.commandClasses[0x40].data.mode.invalidateTime;
                        modeType = 'hasThermostatMode';
                        isThermostatMode = true;

                    }
                }
                if (hasThermostatSetpoint) {
                    if (angular.isDefined(instance.commandClasses[0x43].data[curThermMode])) {
                        level = instance.commandClasses[0x43].data[curThermMode].setVal.value;
                        scale = instance.commandClasses[0x43].data[curThermMode].scaleString.value;
                        updateTime = instance.commandClasses[0x43].data[curThermMode].updateTime;
                        invalidateTime = instance.commandClasses[0x43].data[curThermMode].invalidateTime;
                        hasExt = true;
                        modeType = 'hasThermostatSetpoint';
                        isThermostatSetpoint = true;
                    }

                }
                // Set object
                var obj = {};

                obj['id'] = nodeId;
                obj['cmd'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.' + curThermMode;
                obj['ccId'] = ccId;
                obj['rowId'] = 'row_' + nodeId + '_' + cnt;
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['curThermMode'] = curThermMode;
                obj['level'] = level;
                obj['scale'] = scale;
                obj['range'] = (scale === '°F' ? cfg.thermostat.f : cfg.thermostat.c);
                obj['hasExt'] = hasExt;
                obj['updateTime'] = updateTime;
                obj['invalidateTime'] = invalidateTime;
                obj['dateTime'] = $filter('getDateTimeObj')(obj['updateTime'],obj['invalidateTime']);
                obj['isUpdated'] = (updateTime > invalidateTime ? true : false);
                obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                obj['urlChangeTemperature'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + 0x43 + ']';
                obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.' + curThermMode;
                obj['modeType'] = modeType;
                obj['isThermostatMode'] = isThermostatMode;
                obj['isThermostatSetpoint'] = isThermostatSetpoint;
                obj['modeList'] = modeList;

                var findIndex = _.findIndex($scope.thermostats.all, {rowId: obj.rowId});
                if(findIndex > -1){
                    angular.extend($scope.thermostats.all[findIndex],obj);
                    $scope.thermostats.rangeSlider[findIndex] = level;

                }else{
                    $scope.thermostats.all.push(obj);
                    $scope.thermostats.rangeSlider.push(obj['range_' + nodeId] = obj['level']);
                }
                if($scope.thermostats.ids.indexOf(nodeId) === -1){
                    $scope.thermostats.ids.push(nodeId);
                }
                cnt++;
            });
        });
    }

    /**
     * Used to pick up thermostat mode
     * @param {object} _instance
     * @returns {number}
     */
    function getCurrentThermostatMode(_instance) {
        var hasThermostatMode = 0x40 in _instance.commandClasses;

        var _curThermMode = 1;
        if (hasThermostatMode) {
            _curThermMode = _instance.commandClasses[0x40].data.mode.value;
            if (isNaN(parseInt(_curThermMode, 10)))
                _curThermMode = null; // Mode not retrieved yet
        }
//        else {
//            // we pick up first available mode, since not ThermostatMode is supported to change modes
//            _curThermMode = null;
//            angular.forEach(_instance.commandClasses[0x43].data, function(name, k) {
//                if (!isNaN(parseInt(name, 10))) {
//                    _curThermMode = parseInt(name, 10);
//                    return false;
//                }
//            });
//        }
//        ;
        return _curThermMode;
    }
    ;
    /**
     * Build a list with the thermostat modes
     * @param {object} data
     * @returns {Array}
     */
    function getModeList(data) {
        var list = []
        angular.forEach(data, function(v, k) {
            if (!k || isNaN(parseInt(k, 10))) {
                return;
            }
            var obj = {};
            obj['key'] = k;
            obj['val'] = $filter('hasNode')(v, 'modeName.value');
            list.push(obj);
        });

        return list;
    }
    ;
});
/**
 * @overview This controller renders and handles locks.
 * @author Martin Vach
 */

/**
 * Lock root controller
 * @class LocksController
 *
 */
appController.controller('LocksController', function($scope, $filter, $timeout,$interval,dataService, cfg,_) {
    $scope.locks = {
        ids: [],
        all: [],
        interval: null,
        show: false
    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.locks.interval);
    });

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            if(_.isEmpty($scope.locks.all)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            $scope.locks.show = true;
            $scope.refreshZwaveData();
        }, function(error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                var update = false;
                angular.forEach(response.data.update, function(v, k) {
                    // Get node ID from response
                    var findId = k.split('.')[1];
                    // Check if node ID is in the available devices
                    if( $scope.locks.ids.indexOf(findId) > -1){
                        update = true;
                        //console.log('Updating nodeId: ',findId);
                        return;
                    }
                });
                // Update found - updating available devices
                if(update){
                    setData(response.data.joined);
                }
            }, function(error) {});
        };
        $scope.locks.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Update lock
     * @param {string} url
     */
    $scope.updateLock = function(url) {
        $scope.toggleRowSpinner(url);
        dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + url);
        });
    };
    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        var doorLockCCId = 0x62;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }

            // Loop throught instances
            var cnt = 1;
            angular.forEach(node.instances, function(instance, instanceId) {
                // we don't want devices without DoorLock CC
                if (!(doorLockCCId in instance.commandClasses)) {
                    return;
                }

                // CC gui
                var mode = instance.commandClasses[doorLockCCId].data.mode.value;

                var ccId = 98;
                // Set object
                var obj = {};
                //var level = $scope.updateLevel(instance.commandClasses[ccId].data.level, ccId);
                var apiUrl = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';

                obj['id'] = nodeId;
                obj['cmd'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.mode';
                obj['ccId'] = doorLockCCId;
                obj['rowId'] = 'row_' + nodeId + '_' + cnt;
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['status'] = $filter('lockStatus')(mode);
                obj['level'] = mode;
                obj['updateTime'] = instance.commandClasses[ccId].data.mode.updateTime;
                obj['invalidateTime'] = instance.commandClasses[ccId].data.mode.invalidateTime;
                obj['dateTime'] = $filter('getDateTimeObj')(obj['updateTime'],obj['invalidateTime']);
                obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                obj['urlToStore'] = apiUrl + '.Get()';
                obj['urlToOff'] =  apiUrl + '.Set(0)';
                obj['urlToOn'] =  apiUrl + '.Set(255)';
                obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.mode';
                var findIndex = _.findIndex($scope.locks.all, {rowId: obj.rowId});
                if(findIndex > -1){
                    angular.extend($scope.locks.all[findIndex],obj);

                }else{
                    $scope.locks.all.push(obj);
                }
                if($scope.locks.ids.indexOf(k) === -1){
                    $scope.locks.ids.push(k);
                }
                cnt++;
            });
        });
    }
});
/**
 * @overview Used to report alarm events from binary sensors.
 * @author Martin Vach
 */

/**
 * Notificationr root controller
 * @class NotificationController
 *
 */
appController.controller('NotificationController', function ($scope, $filter, $timeout, $interval, dataService, cfg, deviceService, _) {
    $scope.notifications = {
        all: [],
        interval: null,
        show: false
    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.notifications.interval);
    });
    /**
     * Load Alarms.xml
     */
    $scope.loadXmlData = function () {
        dataService.xmlToJson(cfg.server_url + cfg.alarms_url).then(function (response) {
            $scope.loadZwaveData(response.Alarms.Alarm);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadXmlData();

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function (alarms) {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            setData(ZWaveAPIData, alarms);
            if (_.isEmpty($scope.notifications.all)) {
                $scope.alert = {
                    message: $scope._t('device_404'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation-circle'
                };
                return;
            }
            $scope.notifications.show = true;
            $scope.refreshZwaveData(alarms);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    // $scope.loadZwaveData();


    /**
     * Refresh zwave data
     * @param {object}  alarms
     */
    $scope.refreshZwaveData = function (alarms) {
        var refresh = function () {
            dataService.loadJoinedZwaveData().then(function (response) {
                setData(response.data.joined, alarms);
            }, function (error) {
            });
        };
        $scope.notifications.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Set status
     * @param {string} url
     */
    $scope.setStatus = function (url) {
        $scope.runZwaveCmd(url);
    };

    /**
     * Update notification
     * @param {string} url
     */
    $scope.updateNotification = function (url) {
        $scope.runZwaveCmd(url);
    };

    /**
     * Update all notifications
     * @param {string} id
     * @param {string} urlType
     */
    $scope.updateAllNotifications = function (id, urlType) {
        var lastItem = _.last($scope.notifications.all);
        $scope.toggleRowSpinner(id);
        angular.forEach($scope.notifications.all, function (v, k) {
            $scope.toggleRowSpinner(v[urlType]);
            dataService.runZwaveCmd(cfg.store_url + v[urlType]).then(function (response) {
                alertify.dismissAll();
            }, function (error) {
                alertify.dismissAll();
                alertify.alertError($scope._t('error_update_data') + '\n' + v[urlType]);
            });
            if (lastItem.rowId === v.rowId) {
                $timeout($scope.toggleRowSpinner, 1000);
            }
        });

    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData, alarms) {
        $scope.controllerId = ZWaveAPIData.controller.data.nodeId.value;

        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function (device, k) {
            if (k == 255 || k == $scope.controllerId || device.data.isVirtual.value) {
                return false;
            }
            // Loop throught instances
            angular.forEach(device.instances, function (instance, instanceId) {
                if (instanceId == 0 && device.instances.length > 1) {
                    return;
                }

                // Look for Notifications - Loop throught 0x71/113 commandClasses
                var hasNotification = instance.commandClasses[0x71];
                if (!angular.isObject(hasNotification)) {
                    return;
                }
                var version = parseInt(hasNotification.data.version.value, 10);

                var obj = {};
                obj['id'] = parseInt(k, 10);
                obj['rowId'] = hasNotification.name + '_' + k + '_' + instanceId + '_' + '113' + '_';
                obj['instanceId'] = instanceId;
                obj['name'] = $filter('deviceName')(k, device);
                obj['version'] = version;
                if (version > 1) {
                    notificationV2(obj, hasNotification.data, alarms);
                } else {
                    notificationV1(obj, hasNotification.data);
                }


            });
        });
    }

    /**
     * Set notifications version 1
     * @param {object} data
     */
    function notificationV1(node, data) {
        /*var alarmCfg = {
         type: hasNotification.data.V1event.alarmType.value,
         typeHex: $filter('decToHex')(hasNotification.data.V1event.alarmType.value, 2, '0x'),
         status: hasNotification.data.V1event.level.value,
         statusHex:$filter('decToHex')(hasNotification.data.V1event.level.value, 2, '0x')
         }

         var alarm = _.findWhere(alarms,{_id:  alarmCfg.typeHex});
         if(alarm){
         type = deviceService.configGetZddxLang(alarm.name.lang, $scope.lang);
         var event = _.findWhere(alarm.Event,{_id:  alarmCfg.statusHex});
         if(event){
         status = deviceService.configGetZddxLang(event.name.lang, $scope.lang);
         }
         }*/
        var typeId = parseInt(data.V1event.alarmType.value, 10);
        if (isNaN(typeId)) {
            return;
        }
        var obj = {};
        obj['id'] = node.id;
        obj['rowId'] = node.rowId + typeId;
        obj['instanceId'] = node.instanceId;
        obj['name'] = node.name;
        obj['version'] = node.version;
        obj['typeId'] = typeId;
        obj['typeString'] = typeId;
        obj['event'] = data.V1event.level.value;
        obj['eventString'] = data.V1event.level.value;
        obj['status'] = 0;
        obj['statusString'] = '-';
        obj['invalidateTime'] = data.V1event.alarmType.invalidateTime;
        obj['updateTime'] = data.V1event.alarmType.updateTime;
        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
        obj['dateTime'] = $filter('getDateTimeObj')(data.V1event.alarmType.updateTime,obj['updateTime']);
        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + obj['instanceId'] + '].commandClasses[113].Get(' + typeId + ')';
        //console.log(obj)
        var findIndex = _.findIndex($scope.notifications.all, {rowId: obj.rowId});
        if (findIndex > -1) {
            angular.extend($scope.notifications.all[findIndex], obj);

        } else {
            $scope.notifications.all.push(obj);
        }
    }


    /**
     * Set notifications version 2
     * @param {object} data
     */
    function notificationV2(node, data, alarms) {
        angular.forEach(data, function (v, k) {
            var typeId = parseInt(k, 10);
            if (isNaN(typeId)) {
                return;
            }
            var typeHex = $filter('decToHex')(typeId, 2, '0x');
            var eventHex = $filter('decToHex')(v.event.value, 2, '0x');
            var typeString = v.typeString.value;
            var eventString = v.eventString.value;
            var status= parseInt(v.status.value, 10);
            var statusSet= status ? 0 : 255;
            var alarm = _.findWhere(alarms, {_id: typeHex});
            if (alarm) {
                typeString = deviceService.configGetZddxLang(alarm.name.lang, $scope.lang);
                var event = _.findWhere(alarm.Event, {_id: eventHex});
                if (event) {
                    eventString = deviceService.configGetZddxLang(event.name.lang, $scope.lang);
                }
            }

            var obj = {};
            obj['id'] = node.id;
            obj['rowId'] = node.rowId + typeId;
            obj['instanceId'] = node.instanceId;
            obj['name'] = node.name;
            obj['version'] = node.version;
            obj['typeId'] = typeId;
            obj['typeString'] = typeString;
            obj['event'] = v.event.value;
            obj['eventString'] = eventString;
            obj['status'] = v.status.value;
            obj['statusString'] = (v.status.value === 255 ? 'on' : 'off');
            obj['invalidateTime'] = v.invalidateTime;
            obj['updateTime'] = v.updateTime;
            obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
            obj['dateTime'] = $filter('getDateTimeObj')(obj['updateTime'],obj['invalidateTime']);
            obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + obj['instanceId'] + '].commandClasses[113].Get(' + typeId + ')';
            obj['urlToOn'] = 'devices[' + obj['id'] + '].instances[' + obj['instanceId'] + '].commandClasses[113].Set(' + typeId + ',255)';
            obj['urlToOff'] = 'devices[' + obj['id'] + '].instances[' + obj['instanceId'] + '].commandClasses[113].Set(' + typeId + ',0)';
            //console.log(obj)
            var findIndex = _.findIndex($scope.notifications.all, {rowId: obj.rowId});
            if (findIndex > -1) {
                angular.extend($scope.notifications.all[findIndex], obj);

            } else {
                $scope.notifications.all.push(obj);
            }
        });
    }
});

/**
 * @overview This controller renders and handles device statuses.
 * @author Martin Vach
 */

/**
 * Status root controller
 * todo: remove commented stuff
 * @class StatusController
 *
 */
appController.controller('StatusController', function ($scope, $filter, $timeout, $interval, dataService, cfg, _, deviceService) {
    $scope.statuses = {
        ids: [],
        all: [],
        interval: null,
        show: false
    };
    $scope.interviewCommandsDevice = [];
    $scope.interviewCommands = [];
    $scope.deviceInfo = {
        "index": null,
        "id": null,
        "name": null
    };
    $scope.ZWaveAPIData;
    $scope.interviewDeviceId = null;

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.statuses.interval);
    });


    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function () {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            setData(ZWaveAPIData);
            if (_.isEmpty($scope.statuses.all)) {
                $scope.alert = {
                    message: $scope._t('device_404'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation-circle'
                };
                return;
            }
            $scope.statuses.show = true;
            $scope.refreshZwaveData();
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function () {
        var refresh = function () {
            dataService.loadJoinedZwaveData().then(function (response) {
                //setData(response.data.joined);
                var update = false;
                angular.forEach(response.data.update, function(v, k) {
                    // Get node ID from response
                    var findId = k.split('.')[1];
                    // Check if node ID is in the available devices
                    if($scope.statuses.ids.indexOf(findId) > -1){
                        update = true;
                        //console.log('Updating nodeId: ',findId);
                        return;
                    }
                });
                // Update found - updating available devices
                if(update){
                    setData(response.data.joined);
                }
            }, function (error) {
            });
        };
        $scope.statuses.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Ping device
     * @param {string} url
     */
    $scope.pingDevice = function (url) {
        $scope.toggleRowSpinner(url);
        dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + url);
        });
    };

    /**
     * Ping all devices
     * @param {string} id
     * @param {string} urlType
     */
    $scope.pingAllDevices = function (id, urlType) {
        var lastItem = _.last($scope.statuses.all);
        $scope.toggleRowSpinner(id);
        angular.forEach($scope.statuses.all, function (v, k) {
            if (v.urlToStore) {
                $scope.toggleRowSpinner(v[urlType]);
                dataService.runZwaveCmd(cfg.store_url + v[urlType]).then(function (response) {
                    alertify.dismissAll();
                }, function (error) {
                    alertify.dismissAll();
                    alertify.alertError($scope._t('error_update_data') + '\n' + v[urlType]);
                });

            }
            if (lastItem.rowId === v.rowId) {
                $timeout($scope.toggleRowSpinner, 1000);
            }
        });

    };

    /**
     * Handle modal interview
     * @param {string} target
     * @param $event - angular event
     * @param {int} index - object index
     * @param {object id} id
     * @param name
     */
    $scope.handleModalInterview = function (target, $event, index, id, name) {
        $scope.deviceInfo = {
            "index": index,
            "id": id,
            "name": name
        };
        $scope.interviewDeviceId = id;
        var node = $scope.ZWaveAPIData.devices[id];
        $scope.interviewCommands = deviceService.configGetInterviewCommands(node);
        $scope.handleModal(target, $event)

    };
    /**
     * Purge all command classes and start interview for a device
     * @param {string} cmd
     */
    $scope.interviewForceDevice = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };
    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        //var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            if (deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
            var isListening = node.data.isListening.value;
            var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
            var hasWakeup = 0x84 in node.instances[0].commandClasses;
            var isFailed = node.data.isFailed.value;
            var isAwake = node.data.isAwake.value;
            var prefixD = 'devices.' + nodeId + '.data.';
            var prefixIC = 'devices.' + nodeId + '.instances.0.commandClasses';
            var bindPath = prefixD + 'isFailed,' + prefixD + 'isAwake,' + prefixD + 'lastSend,' + prefixD + 'lastReceived,' + prefixD + 'queueLength,devices.' + nodeId + '.instances[*].commandClasses[*].data.interviewDone,' + prefixIC + '.' + 0x84 + '.data.lastWakeup,' + prefixIC + '.' + 0x84 + '.data.lastSleep,' + prefixIC + '.' + 0x84 + '.data.interval,' + prefixIC + '.' + 0x80 + '.data.last';

            var isController = (ZWaveAPIData.controller.data.nodeId.value == nodeId);
            var lastReceive = parseInt(node.data.lastReceived.updateTime, 10) || 0;
            var lastSend = parseInt(node.data.lastSend.updateTime, 10) || 0;
            var lastCommunication = (lastSend > lastReceive) ? lastSend : lastReceive;
            var sleepingSince = 0;
            var lastWakeup = 0;
            var interval = 0;
            var type = deviceService.deviceType(node);
            var sleeping;
            if (!isListening && hasWakeup) {

                sleepingSince = parseInt(node.instances[0].commandClasses[0x84].data.lastSleep.value, 10);
                lastWakeup = parseInt(node.instances[0].commandClasses[0x84].data.lastWakeup.value, 10);
                interval = parseInt(node.instances[0].commandClasses[0x84].data.interval.value, 10);
                //hasSleeping = getSleeping(sleepingSince, lastWakeup, interval);
                sleeping = setSleeping(sleepingSince, lastWakeup, interval);
            }

            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['isController'] = isController;
            obj['cmd'] = bindPath.split(',');
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['sleeping'] = sleeping;
            obj['updateTime'] = lastCommunication;
            obj['dateTime'] = $filter('getDateTimeObj')(lastCommunication);
            obj['isFailed'] = node.data.isFailed.value;
            obj['type'] = type;
            obj['icon'] = $filter('getDeviceTypeIcon')(type);
            obj['urlToStore'] = (!isController && (isListening || isFLiRS) ? 'devices[' + nodeId + '].SendNoOperation()' : false);
            obj['interviewDone'] = interviewDone(node);
            var findIndex = _.findIndex($scope.statuses.all, {rowId: obj.rowId});
            if (findIndex > -1) {
                //console.log('Updating nodeId: ',obj.rowId);
                angular.extend($scope.statuses.all[findIndex], obj);

            } else {
                $scope.statuses.all.push(obj);
            }
            if( $scope.statuses.ids.indexOf(nodeId) === -1){
                $scope.statuses.ids.push(nodeId);
            }
            $scope.interviewCommandsDevice.push(node.data);
        });
    }

    /**
     * Check if is an interview done
     * @param {object} node
     * @returns {boolean}
     */
    function interviewDone(node) {
        var interview_cont = true;
        if (node.data.nodeInfoFrame.value && node.data.nodeInfoFrame.value.length) {
            for (var iId in node.instances)
                for (var ccId in node.instances[iId].commandClasses)
                    if (!node.instances[iId].commandClasses[ccId].data.interviewDone.value) {
                        interview_cont = false;
                    }
        } else {
            interview_cont = false;
        }
        return interview_cont;

    }

    /**
     * Set sleeping data
     * @param {int} sleepingSince
     * @param {int} lastWakeup
     * @param {int} interval
     * @returns {string}
     */
    function setSleeping(sleepingSince, lastWakeup, interval) {
        var sleeping = {
            approx: false,
            lastSleep: '',
            nextWakeup: ''
        };
        if (isNaN(sleepingSince) || sleepingSince < lastWakeup) {
            sleepingSince = lastWakeup
            if (!isNaN(lastWakeup)) {
                sleeping.approx = '~';
            }

        }
        ;
        // to indicate that interval and hence next wakeup are unknown
        if (interval == 0) {
            interval = NaN;
        }
        sleeping.lastSleep = $filter('isTodayFromUnix')(sleepingSince);
        sleeping.nextWakeup = $filter('isTodayFromUnix')(sleepingSince + interval);
        return sleeping;
    }
});
/**
 * @overview This controller renders and handles batteries.
 * @author Martin Vach
 */

/**
 * Battery root controller
 * @class BatteryController
 *
 */
appController.controller('BatteryController', function($scope, $filter, $timeout,$interval,$http,dataService, cfg,_, myCache) {
    $scope.batteries = {
        ids: [],
        all: [],
        interval: null,
        show: false
    };
    $scope.batteryInfo = [];

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.batteries.interval);
    });

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            if(_.isEmpty($scope.batteries.all)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            $scope.batteries.show = true;
            $scope.refreshZwaveData();
        }, function(error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                var update = false;
                angular.forEach(response.data.update, function(v, k) {
                    // Get node ID from response
                    var findId = k.split('.')[1];
                    // Check if node ID is in the available devices
                    if($scope.batteries.ids.indexOf(findId) > -1){
                        update = true;
                       //console.log('Updating nodeId: ',findId);
                        return;
                    }
                });
                // Update found - updating available devices
                if(update){
                    setData(response.data.joined);
                }
            }, function(error) {});
        };
        $scope.batteries.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Update battery
     * @param {string} url
     */
    $scope.updateBattery = function(url) {
        $scope.toggleRowSpinner(url);
        dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + url);
        });
    };
    /**
     * Update all batteries
     * @param {string} id
     * @param {string} urlType
     */
    $scope.updateAllBatteries = function(id,urlType) {
        var lastItem = _.last($scope.batteries.all);
        $scope.toggleRowSpinner(id);
        angular.forEach($scope.batteries.all, function(v, k) {
            $scope.toggleRowSpinner(v[urlType]);
            dataService.runZwaveCmd(cfg.store_url + v[urlType]).then(function (response) {
                alertify.dismissAll();
            }, function (error) {
                alertify.dismissAll();
                alertify.alertError($scope._t('error_update_data') + '\n' +  v[urlType]);
            });
            if(lastItem.rowId === v.rowId){
                $timeout($scope.toggleRowSpinner, 1000);
            }
        });

    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }
            var hasBattery = 0x80 in node.instances[0].commandClasses;
            var instanceId = 0;
            var ccId = 0x80;
            if (!hasBattery) {
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            var battery_charge = parseInt(node.instances[0].commandClasses[0x80].data.last.value);
            var battery_updateTime = node.instances[0].commandClasses[0x80].data.last.updateTime;
            var battery_invalidateTime = node.instances[0].commandClasses[0x80].data.last.invalidateTime;

//            var info = loadZDD(nodeId, ZWaveAPIData);
//            console.log(info);
            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['cmd'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].data.last';
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['level'] = battery_charge;
            obj['scale'] = '%';
            obj['updateTime'] = battery_updateTime;
            obj['invalidateTime'] = battery_invalidateTime;
            obj['dateTime'] = $filter('getDateTimeObj')(obj['updateTime'] ,obj['invalidateTime']);
            obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
            obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Get()';
            obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data';
            obj['batteryCount'] = null;
            obj['batteryType'] = null;

            var zddXmlFile = null;
            if (angular.isDefined(node.data.ZDDXMLFile)) {
                zddXmlFile = node.data.ZDDXMLFile.value;
            }
            if (zddXmlFile) {
                var cachedZddXml = myCache.get(zddXmlFile);
                if (!cachedZddXml) {
                    $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                        var x2js = new X2JS();
                        var zddXml = x2js.xml_str2json(response.data);
                        myCache.put(zddXmlFile, zddXml);
                        var batteryInfo = getBatteryInfo(zddXml);
                        obj['batteryCount'] = batteryInfo.batteryCount;
                        obj['batteryType'] = batteryInfo.batteryType;

                    });
                } else {
                    var batteryInfo = getBatteryInfo(cachedZddXml);
                    obj['batteryCount'] = batteryInfo.batteryCount;
                    obj['batteryType'] = batteryInfo.batteryType;
                }
            }

            var findIndex = _.findIndex($scope.batteries.all, {rowId: obj.rowId});
            if(findIndex > -1){
                angular.extend($scope.batteries.all[findIndex],obj);

            }else{
                $scope.batteries.all.push(obj);
            }
            if($scope.batteries.ids.indexOf(nodeId) === -1){
                $scope.batteries.ids.push(nodeId);
            }
        });
    }

    /**
     * Get battery info
     * @param {object} zddXml
     * @returns {object}
     */
    function getBatteryInfo(zddXml) {
        var info = {
            'batteryCount': null,
            'batteryType': null
        };
        if (("deviceDescription" in zddXml.ZWaveDevice)) {
            var obj = zddXml.ZWaveDevice.deviceDescription;
            if (obj) {
                if (obj.batteryCount) {
                    info.batteryCount = obj.batteryCount;
                }
                if (obj.batteryType) {
                    info.batteryType = obj.batteryType;
                }
            }
        }
        return info;
    }
});
/**
 * @overview This controller renders and handles device types.
 * @author Martin Vach
 */

/**
 * Device type root controller
 * @class TypeController
 *
 */
appController.controller('TypeController', function($scope, $filter, $timeout,$interval,$q,dataService, cfg,_,deviceService) {
    $scope.devices = {
        ids: [],
        all: [],
        show: false,
        interval: null
    };

    $scope.deviceClasses = [];
    $scope.productNames = [];

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.devices.interval);
    });

    /**
     * Load all promises
     * @returns {undefined}
     */
    $scope.allSettled = function () {
        var promises = [
            dataService.xmlToJson(cfg.server_url + cfg.device_classes_url),
            dataService.loadZwaveApiData()
        ];

        $q.allSettled(promises).then(function (response) {
            // console.log(response)
            var deviceClasses = response[0];
            var zwaveData = response[1];
            $scope.loading = false;

            // deviceClasses error message
            if (deviceClasses.state === 'rejected') {
                alertify.alertError($scope._t('error_load_data') + ':' + cfg.server_url + cfg.device_classes_url);
            }

            // zwaveData error message
            if (zwaveData.state === 'rejected') {
                alertify.alertError($scope._t('error_load_data'));
                return;
            }
            // Success - deviceClasses
            if (deviceClasses.state === 'fulfilled') {
                setDeviceClasses(deviceClasses.value);
            }

            // Success - zwaveData
            if (zwaveData.state === 'fulfilled') {
                setData(zwaveData.value);
                if(_.isEmpty($scope.devices.all)){
                    $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                    return;
                }
                $scope.devices.show = true;
                $scope.refreshZwaveData();
            }

        });

    };
    $scope.allSettled();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                var update = false;
                angular.forEach(response.data.update, function(v, k) {
                    // Get node ID from response
                    var findId = k.split('.')[1];
                    // Check if node ID is in the available devices
                    if($scope.devices.ids.indexOf(findId) > -1){
                        update = true;
                        return;
                    }
                });
                // Update found - updating available devices
                if(update){
                    setData(response.data.joined);
                }
                //setData(response.data.joined);
            }, function(error) {});
        };
        $scope.devices.interval = $interval(refresh, $scope.cfg.interval);
    };

    /// --- Private functions --- ///
    /**
     * Set device classess
     * @param {object} data
     * @returns {void}
     */
    function setDeviceClasses(data) {
        angular.forEach(data.DeviceClasses.Generic, function(val) {
            var obj = {};
            obj['id'] = parseInt(val._id);
            obj['generic'] = deviceService.configGetZddxLang(val.name.lang, $scope.lang);
            obj['specific'] = val.Specific;
            $scope.deviceClasses.push(obj);
        });
    }

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
            /*if (nodeId == 255 || node.data.isVirtual.value) {
                return;
            }*/
            var node = ZWaveAPIData.devices[nodeId];
            var instanceId = 0;
            var ccIds = [32, 34, 37, 38, 43, 70, 91, 94, 96, 114, 119, 129, 134, 138, 143, 152];
            var basicType = node.data.basicType.value;
            var genericType = node.data.genericType.value;
            var specificType = node.data.specificType.value;
            var major = node.data.ZWProtocolMajor.value;
            var minor = node.data.ZWProtocolMinor.value;
            var vendorName = node.data.vendorString.value;
            var zddXmlFile = $filter('hasNode')(node, 'data.ZDDXMLFile.value');
            //var productName = null;
            var fromSdk = true;
            var sdk;
            // SDK
            if (node.data.SDK.value == '') {
                sdk = major + '.' + minor;
                fromSdk = false;
            } else {
                sdk = node.data.SDK.value;
            }
            // Version
            var appVersion = node.data.applicationMajor.value + '.' + node.data.applicationMinor.value;
            // Security and ZWavePlusInfo
            var security = false;
            angular.forEach(ccIds, function(v) {
                var cmd = node.instances[instanceId].commandClasses[v];
                if (angular.isObject(cmd) && cmd.name === 'Security') {
                    security = cmd.data.interviewDone.value;

                }
            });


            // DDR
            var ddr = false;
            if (angular.isDefined(node.data.ZDDXMLFile)) {
                ddr = node.data.ZDDXMLFile.value;
            }

            // Zwave plus
            var ZWavePlusInfo = false;
            angular.forEach(ccIds, function(v) {
                var cmd = node.instances[instanceId].commandClasses[v];
                if (angular.isObject(cmd) && cmd.name === 'ZWavePlusInfo') {
                    ZWavePlusInfo = true;

                }
            });
            // MWI and EF
            var mwief = getEXFrame(major, minor);
            if(ZWavePlusInfo){
                mwief = 1;
            }
            // Device type
            var deviceXml = $scope.deviceClasses;
            var deviceType = $scope._t('unknown_device_type') + ': ' + genericType;
            angular.forEach(deviceXml, function(v) {
                if (genericType == v.id) {
                    deviceType = v.generic;
                    angular.forEach(v.specific, function(s) {
                        if (specificType == s._id) {
                            deviceType = deviceService.configGetZddxLang(s.name.lang, $scope.lang);
                        }
                    });

                }
            });

            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['security'] = security;
            obj['mwief'] = mwief;
            obj['ddr'] = ddr;
            obj['ZWavePlusInfo'] = ZWavePlusInfo;
            obj['sdk'] = (sdk == '0.0' ? '?' : sdk);
            obj['fromSdk'] = fromSdk;
            obj['appVersion'] = appVersion;
            obj['type'] = deviceType;
            obj['deviceType'] = deviceType;
            obj['basicType'] = basicType;
            obj['genericType'] = genericType;
            obj['specificType'] = specificType;
            obj['vendorName'] = vendorName;
            //obj['productName'] = productName;

            var findIndex = _.findIndex($scope.devices.all, {rowId: obj.rowId});
            if(findIndex > -1){
                angular.extend($scope.devices.all[findIndex],obj);

            }else{
                $scope.devices.all.push(obj);
                // Product name from zddx file
                if (zddXmlFile) {
                    dataService.xmlToJson(cfg.server_url + cfg.zddx_url + zddXmlFile).then(function (response) {
                        $scope.productNames[nodeId] = response.ZWaveDevice.deviceDescription.productName;
                    });
                }

            }
            if($scope.devices.ids.indexOf(nodeId) === -1){
                $scope.devices.ids.push(nodeId);
            }
        });
    }

    /**
     * Get EXF frame
     * @param {number} $major
     * @param {number} $minor
     * @returns {number}
     */
    function getEXFrame($major, $minor) {
        if ($major == 1)
            return 0;
        if ($major == 2) {
            if ($minor >= 96)
                return 1;
            if ($minor == 74)
                return 1;
            return 0;
        }
        if ($major == 3)
            return 1;
        return 0;
    }

});
/**
 * @overview This controller renders and handles active associations.
 * @author Martin Vach
 */

/**
 * Associations root controller
 * @class AssociationsController
 *
 */
appController.controller('AssociationsController', function($scope, $filter, $timeout,$interval,$http,dataService, deviceService,cfg,_,myCache) {
    $scope.devices = {
        all: [],
        show: false,
        interval: null,
        showLifeline: false
    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.devices.interval);
    });

    /**
     * Reset devices
     */
    /*$scope.reset = function() {
        $scope.devices.all = angular.copy([]);
    };*/

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            if(_.isEmpty($scope.devices.all)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            $scope.devices.show = true;
            //$scope.refreshZwaveData(ZWaveAPIData);
        }, function(error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshZwaveData = function(ZWaveAPIData) {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                setData(response.data.joined);
            }, function(error) {});
        };
        $scope.devices.interval = $interval(refresh, $scope.cfg.interval);
    };

    // Store data on remote server
    $scope.lifeline = function(status) {
        //$scope.reset();
        $scope.devices.showLifeline = status;
        $scope.loadZwaveData();
    };
    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {obj} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        var controllerSUCNodeId = ZWaveAPIData.controller.data.SUCNodeId.value;
        // Loop throught devices
        var cnt = 1;
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
            /*if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }*/
            var zddXmlFile = $filter('hasNode')(node, 'data.ZDDXMLFile.value');
            var zdd = null;
            if (zddXmlFile) {
                dataService.xmlToJson(cfg.server_url + cfg.zddx_url + zddXmlFile).then(function (response) {
                    zdd = $filter('hasNode')(response, 'ZWaveDevice.assocGroups');
                    setAssocDevices(nodeId,node, ZWaveAPIData, zdd, controllerSUCNodeId,cnt);
                });
            }else{
                setAssocDevices(nodeId,node, ZWaveAPIData, zdd, controllerSUCNodeId,cnt);
            }
            cnt++;
        });
    }

    /**
     * Set assoc devices
     * @param nodeId
     * @param node
     * @param ZWaveAPIData
     * @param zdd
     * @param controllerSUCNodeId
     * @param cnt
     */
    function setAssocDevices(nodeId,node, ZWaveAPIData, zdd, controllerSUCNodeId,cnt){
        var assocDevices = getAssocDevices(node, ZWaveAPIData, zdd, controllerSUCNodeId);
        var obj = {
            'id': nodeId,
            'rowId': 'row_' + nodeId + '_' + cnt,
            'name': $filter('deviceName')(nodeId, node),
            'assocGroup': assocDevices
        };
        var findIndex = _.findIndex($scope.devices.all, {rowId: obj.rowId});
        if(findIndex > -1){
            angular.extend($scope.devices.all[findIndex],obj);
        }else{
            $scope.devices.all.push(obj);
        }
    }

    /**
     * Get group name
     * @param assocGroups
     * @param index
     * @param instance
     * @returns {string}
     */
    function getGroupLabel(assocGroups, index, instance) {
        // Set default assoc group name
        var label = $scope._t('association_group') + " " + (index + 1);

        // Attempt to get assoc group name from the zdd file
        var langs = $filter('hasNode')(assocGroups, 'description.lang');
        if (langs) {
            if ($.isArray(langs)) {
                angular.forEach(langs, function(lang, index) {
                    if (("__text" in lang) && (lang["_xml:lang"] == $scope.lang)) {
                        label = lang.__text;
                        return false;
                    }
                    if (("__text" in lang) && (lang["_xml:lang"] == "en")) {
                        label = lang.__text;
                    }
                });
            } else {
                if (("__text" in langs)) {
                    label = langs.__text;
                }
            }
        } else {
            // Attempt to get assoc group name from the command class
            angular.forEach(instance[0].commandClasses, function(v, k) {
                if (v.name == 'AssociationGroupInformation') {
                    label = $filter('hasNode')(v, 'data.' + (index + 1) + '.groupName.value');
                }

            });
        }

        return label;
    }
    ;
    /**
     * Get assoc devices
     * @param node
     * @param ZWaveAPIData
     * @param zdd
     * @param controllerSUCNodeId
     * @returns {Array}
     */
    function getAssocDevices(node, ZWaveAPIData, zdd, controllerSUCNodeId) {
        var assocGroups = [];
        var assocDevices = [];
        var assoc = [];
        var data;
        if (0x85 in node.instances[0].commandClasses) {
            var cc = node.instances[0].commandClasses[0x85].data;
            if (cc.groups.value >= 1) {
                for (var grp_num = 1; grp_num <= parseInt(cc.groups.value, 10); grp_num++) {
                    var groupArr = [];
                    var groupDev = [];
                    if (assocGroups.indexOf(grp_num) == -1) {
                        assocGroups.push(grp_num);
                    }

                    data = cc[grp_num];
                    for (var i = 0; i < data.nodes.value.length; i++) {
                        var targetNodeId = data.nodes.value[i];
                        var device = {'id': targetNodeId, 'name': '(#' + targetNodeId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])};
                        assocDevices.push({'group': grp_num, 'device': device});
                    }

                }
            }
        }

        if (0x8e in node.instances[0].commandClasses) {
            var cc = node.instances[0].commandClasses[0x8e].data;
            if (cc.groups.value >= 1) {
                for (var grp_num = 1; grp_num <= parseInt(cc.groups.value, 10); grp_num++) {
                    var groupDev = [];
                    if (assocGroups.indexOf(grp_num) == -1) {
                        assocGroups.push(grp_num);
                    }
                    data = cc[grp_num];

                    for (var i = 0; i < data.nodesInstances.value.length; i += 2) {
                        var targetNodeId = data.nodesInstances.value[i];
                        var targetInstanceId = data.nodesInstances.value[i + 1];
                        var instanceId = (targetInstanceId > 0 ? '.' + targetInstanceId : '')
                        var device = {'id': targetNodeId, 'name': '(#' + targetNodeId + instanceId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])};
                        assocDevices.push({'group': grp_num, 'device': device});
                    }
                }
            }
        }

        angular.forEach(assocGroups, function(v, k) {

            var dev = [];
            var name;

            if (zdd) {
                angular.forEach(zdd, function(zddval, zddkey) {
                    if (angular.isArray(zddval)) {
                        angular.forEach(zddval, function(val, key) {
                            if (val._number == v)
                                name = getGroupLabel(val, v, node.instances);
                        });
                    } else {
                        if (zddval._number == v)
                            name = getGroupLabel(zddval, v, node.instances);

                    }
                });
            } else {
                name = getGroupLabel([], v - 1, node.instances);
            }

            angular.forEach(assocDevices, function(d, key, nodeId) {
                //console.log(d)
                if (d['group'] == v) {
                    if ($scope.devices.showLifeline) {
                        dev.push(d.device.name);
                    } else {
                        if (controllerSUCNodeId != d.device.id) {
                            dev.push(d.device.name);
                        }
                    }
                }

            });

            if (dev.length > 0) {
                assoc.push({'name': name, 'devices': dev});
            }
        });

        return assoc;
    }


});
/**
 * @overview This is used to control the Z-Wave controller itself and ot manage the Z-Wave network.
 * @author Martin Vach
 */

/**
 * Control root ontroller
 * @class ControlController
 *
 */
appController.controller('ControlController', function ($scope, $interval, $timeout, $filter, cfg, dataService) {
    $scope.controlDh = {
        interval: null,
        show: false,
        alert: $scope.alert,
        controller: {},
        inclusion: {
            lastIncludedDevice: $scope.alert,
            lastExcludedDevice: $scope.alert,
            alert: $scope.alert,
            alertPrimary: $scope.alert
        },
        network: {
            include: false,
            inclusionProcess: false,
            alert: $scope.alert,
            modal: false
        },
        nodes: {
            all: [],
            failedNodes: [],
            failedBatteries: [],
            sucSis: []

        },
        input: {
            failedNodes: 0,
            replaceNodes: 0,
            failedBatteries: 0,
            sucSis: 0
        },
        removed:{
            failedNodes: [],
            replaceNodes: [],
            failedBatteries: []
        }
    };
    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.controlDh.interval);
    });

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function () {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            setControllerData(ZWaveAPIData);
            setDeviceData(ZWaveAPIData);
            $scope.controlDh.show = true;
            $scope.refreshZwaveData();
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function () {
        var refresh = function () {
            dataService.loadJoinedZwaveData().then(function (response) {
                setControllerData(response.data.joined);
                setDeviceData(response.data.joined);
                setInclusionData(response.data.joined,response.data.update)
            }, function (error) {
            });
        };
        $scope.controlDh.interval = $interval(refresh, $scope.cfg.interval);
    };


    /// --- Private functions --- ///
    /**
     * Set controller data
     * @param {object} ZWaveAPIData
     */
    function setControllerData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        var nodeId = ZWaveAPIData.controller.data.nodeId.value;
        var hasSUC = ZWaveAPIData.controller.data.SUCNodeId.value;
        var hasDevices = Object.keys(ZWaveAPIData.devices).length;
        var controllerState = ZWaveAPIData.controller.data.controllerState.value;



        // Customsettings
        $scope.controlDh.controller.hasDevices = hasDevices > 1;
        $scope.controlDh.controller.disableSUCRequest = true;
        if (hasSUC && hasSUC != controllerNodeId) {
            $scope.controlDh.controller.disableSUCRequest = false;
        }
        if ($scope.controlDh.nodes.sucSis.indexOf(nodeId) === -1) {
            $scope.controlDh.input.sucSis = $scope.controlDh.input.sucSis || ZWaveAPIData.controller.data.nodeId.value;
            $scope.controlDh.nodes.sucSis.push(nodeId);
        }

        // Default controller settings
        $scope.controlDh.controller.nodeId = nodeId;
        $scope.controlDh.controller.frequency = $filter('hasNode')(ZWaveAPIData, 'controller.data.frequency.value');
        $scope.controlDh.controller.controllerState = controllerState;
        $scope.controlDh.controller.secureInclusion = ZWaveAPIData.controller.data.secureInclusion.value;
        $scope.controlDh.controller.isPrimary = ZWaveAPIData.controller.data.isPrimary.value;
        $scope.controlDh.controller.isRealPrimary = ZWaveAPIData.controller.data.isRealPrimary.value;
        $scope.controlDh.controller.isSIS = ZWaveAPIData.controller.data.SISPresent.value;
        $scope.controlDh.controller.secureInclusion = ZWaveAPIData.controller.data.secureInclusion.value;
        $scope.controlDh.controller.homeName = ZWaveAPIData.controller.data.homeName.value || cfg.controller.homeName;
        $scope.controlDh.controller.SetPromiscuousMode = (ZWaveAPIData.controller.data.functionClassesNames.value.indexOf('SetPromiscuousMode') > -1 ? true: false);
        $scope.controlDh.controller.SUCNodeId = ZWaveAPIData.controller.data.SUCNodeId.value;

        $scope.controlDh.inclusion.alert = {
            message: $scope._t('nm_controller_state_' + controllerState),
            status: 'alert-warning',
            icon: 'fa-spinner fa-spin'
        };

        // Controller state switch
        switch(controllerState){
            case 0:
                // Device inclusion
                $scope.controlDh.inclusion.alert = {
                    message: $scope._t('nm_controller_state_' + controllerState),
                    status: 'alert-info',
                    icon: false
                };
                $scope.controlDh.inclusion.alertPrimary = $scope.alert;
                // Network inclusion
                if($scope.controlDh.network.inclusionProcess){
                    if($scope.controlDh.network.include){
                        if (!$scope.controlDh.network.modal) {
                            $scope.controlDh.network.alert = {
                                message: $scope._t('nm_controller_state_10'),
                                status: 'alert-warning',
                                icon: 'fa-spinner fa-spin'
                            };
                            $scope.controlDh.network.inclusionProcess = 'processing';
                        } else {
                            $scope.controlDh.network.alert = {message: $scope._t('success_controller_include'), status: 'alert-success', icon: 'fa-smile-o'};
                        }
                   }

                }else{
                    $scope.controlDh.network.alert = $scope.alert;
                }
                break;
            case 1:
                // Device inclusion
                if($scope.controlDh.controller.isSIS || $scope.controlDh.controller.isPrimary){
                    $scope.controlDh.inclusion.alertPrimary = {
                        message: $scope._t('nm_controller_sis_or_primary'),
                        status: 'alert-info',
                        icon: false
                    };
                }
                if(!$scope.controlDh.controller.isSIS && !$scope.controlDh.controller.isPrimary){
                    $scope.controlDh.inclusion.alertPrimary = {
                        message: $scope._t('nm_controller_not_sis_or_primary'),
                        status: 'alert-danger',
                        icon: false
                    };
                }

                break;
            case 9:
                // Network inclusion
                if($scope.controlDh.controller.isRealPrimary) {
                    $scope.controlDh.network.alert = {message: $scope._t('nm_controller_state_11'), status: 'alert-warning', icon: 'fa-spinner fa-spin'};
                    $scope.controlDh.network.inclusionProcess = 'processing';
                } else {
                    $scope.controlDh.network.alert = {message: $scope._t('nm_controller_state_9_exclude'), status: 'alert-warning', icon: 'fa-spinner fa-spin'};
                    $scope.controlDh.network.inclusionProcess = 'processing';
                }
                break;
            case 17:
                // Network inclusion
                $scope.controlDh.network.alert = {message: $scope._t('nm_controller_state_17'), status: 'alert-danger', icon: 'fa-exclamation-triangle'};
                $scope.controlDh.network.inclusionProcess = 'error';
                break;

            default:
               break;
        }
    }

    /**
     * Set device data
     * @param {object} ZWaveAPIData
     */
    function setDeviceData(ZWaveAPIData) {
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            if (nodeId == 255 || nodeId == ZWaveAPIData.controller.data.nodeId.value || node.data.isVirtual.value) {
                return;
            }
            // SUC/SIS nodes
            if (node.data.basicType.value == 2) {
                if ($scope.controlDh.nodes.sucSis.indexOf(nodeId) === -1) {
                    $scope.controlDh.nodes.sucSis.push(nodeId);
                }
            }
            // Devices
            if (!$scope.controlDh.nodes.all[nodeId]) {
                $scope.controlDh.nodes.all[nodeId] = $filter('deviceName')(nodeId, node);
            }

            // Failed and Batteries nodes
            if (ZWaveAPIData.controller.data.isPrimary.value) {
                if (node.data.isFailed.value) {
                    if ($scope.controlDh.nodes.failedNodes.indexOf(nodeId) === -1) {
                        $scope.controlDh.nodes.failedNodes.push(nodeId);
                    }
                }
                if (!node.data.isListening.value && !node.data.isFailed.value) {
                    if ($scope.controlDh.nodes.failedBatteries.indexOf(nodeId) === -1) {
                        $scope.controlDh.nodes.failedBatteries.push(nodeId);
                    }
                }
            }
            ;

        });
    }

    /**
     * Set inclusion data
     * @param {object} data
     */
    function setInclusionData(data, update) {
        var deviceIncId,deviceExcId;
        // console.log('Learn mode 2: ' + $scope.learnMode);
        if ('controller.data.lastIncludedDevice' in update) {
            deviceIncId = update['controller.data.lastIncludedDevice'].value;
        }
        if ('controller.data.lastExcludedDevice' in update) {
            deviceExcId = update['controller.data.lastExcludedDevice'].value;
        }
        if(!deviceIncId && !deviceExcId){
            //console.log('Not Exclude/Include')
            return;
        }
        /**
         * Last icluded device
         */

        if (deviceIncId) {
            var node = data.devices[deviceIncId];
            var givenName = $filter('deviceName')(deviceIncId, node);
            var updateTime = $filter('isTodayFromUnix')(data.controller.data.lastIncludedDevice.updateTime);
            //Run CMD
            /*var cmd = 'devices[' + deviceIncId + '].data.givenName.value=\'' + givenName + '\'';
            dataService.runZwaveCmd(cfg.store_url + cmd);*/
            $scope.controlDh.inclusion.lastIncludedDevice = {
                message: $scope._t('nm_last_included_device') + '  (' + updateTime + ')  <a href="#configuration/interview/' + deviceIncId + '"><strong>' + givenName + '</strong></a>',
                status: 'alert-success',
                icon: 'fa-smile-o'
            };
        }

        /**
         * Last excluded device
         */
       if (deviceExcId) {
           var updateTime = $filter('isTodayFromUnix')(data.controller.data.lastExcludedDevice.updateTime);
            if (deviceExcId != 0) {
                var txt = $scope._t('txt_device') + ' # ' + deviceExcId + ' ' + $scope._t('nm_excluded_from_network');
            } else {
                var txt = $scope._t('nm_last_excluded_device_from_foreign_network');
            }

            //$scope.controlDh.inclusion.lastExcludedDevice = txt + ' (' + updateTime + ')';
           $scope.controlDh.inclusion.lastExcludedDevice = {
               message: txt + ' (' + updateTime + ')',
               status: 'alert-success',
               icon: 'fa-smile-o'
           };
        }
    };

});

/**
 * Shall inclusion be done using Security.
 * @class SetSecureInclusionController
 *
 */
appController.controller('SetSecureInclusionController', function ($scope) {
    /**
     * Set inclusion as Secure/Unsecure.
     * state=true Set as secure.
     * state=false Set as unsecure.
     * @param {string} cmd
     */
    $scope.setSecureInclusion = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };
});

/**
 * This turns the Z-wave controller into an inclusion/exclusion mode that allows including/excluding a device.
 * @class IncludeDeviceController
 *
 */
appController.controller('IncludeExcludeDeviceController', function ($scope,$route) {
    /**
     * Start Inclusion of a new node.
     * Turns the controller into an inclusion mode that allows including a device.
     * flag=1 for starting the inclusion mode
     * flag=0 for stopping the inclusion mode
     * @param {string} cmd
     */
    $scope.addNodeToNetwork = function (cmd) {
        //$scope.controlDh.inclusion.lastIncludedDevice = false;
        $scope.runZwaveCmd(cmd);
        $route.reload();
    };

    /**
     * Stop Exclusion of a node.
     * Turns the controller into an exclusion mode that allows excluding a device.
     * flag=1 for starting the exclusion mode
     * flag=0 for stopping the exclusion mode
     * @param {string} cmd
     */
    $scope.removeNodeToNetwork = function (cmd) {
        //$scope.controlDh.inclusion.lastExcludedDevice = false;
        $scope.runZwaveCmd(cmd);
        $route.reload();
    };
});

/**
 * It will change Z-wave controller own Home ID to the Home ID of the new network
 * and it will learn all network information from the including controller of the new network.
 * All existing relationships to existing nodes will get lost
 * when the Z-Way controller joins a dierent network
 * @class IncludeDifferentNetworkController
 *
 */
appController.controller('IncludeDifferentNetworkController', function ($scope, $timeout, $window,cfg, dataService) {
    /**
     * Include to network
     * @param {string} cmd
     */
    $scope.includeToNetwork = function (cmd, modalId, $event) {
        //$scope.runZwaveCmd(cmd);
        var timeout = 30000;
        $scope.toggleRowSpinner(cmd);
        if(cmd === 'controller.SetLearnMode(1)'){
            $scope.controlDh.network.include = true;
            $scope.controlDh.network.inclusionProcess = 'processing';
        }else{
            $scope.controlDh.network.include = false;
            $scope.controlDh.network.inclusionProcess = false;
        }
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {
            $timeout(function() {
                $scope.controlDh.network.modal = true;
            }, timeout);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_load_data') + '\n' + cmd);
        });

    };

    /**
     * Exclude form network
     * @param {string} cmd
     */
    $scope.excludeFromNetwork = function (cmd, confirm) {
        console.log(cmd)
       // return;
        alertify.confirm(confirm, function () {
            $scope.controlDh.network.inclusionProcess = false;
            $scope.controlDh.network.include = false;
            $scope.runZwaveCmd(cmd);
            if(cmd === 'controller.SetLearnMode(1)') {
                $timeout(function () {
                    $window.location.reload();
                }, 5000);
            }

        });

    };

    $scope.requestNetworkUpdate = function (cmd, message, id) {
        $scope.controlDh.alert = {
            message: message,
            status: 'alert-info',
            icon: false
        };
        $scope.toggleRowSpinner(id);
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function () {
            $timeout(function() {
                $scope.controlDh.alert = false;
                $scope.toggleRowSpinner();
            }, 2000);
        }, function () {
            $scope.controlDh.alert = false;
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_load_data'));
        });
    };

    /**
     * Close network modal
     * @param {string} modal
     * @param $event
     */
    $scope.closeNetworkModal = function (modal,$event) {
       $scope.controlDh.network.inclusionProcess = false;
        $scope.controlDh.network.modal = false;
        $window.location.reload();

    };

    /// --- Private functions --- ///
});

/**
 * Restore Z-Wave controller from the backup
 * @class BackupRestoreController
 *
 */
appController.controller('BackupRestoreController', function ($scope, $upload, $window, deviceService, cfg, _) {
    $scope.restore = {
        allow: false,
        input: {
            restore_chip_info: '0'
        }
    };

    /**
     * Send request to restore from backup
     * todo: Replace $upload vith version from the SmartHome
     * @returns {void}
     */
    $scope.restoreFromBackup = function ($files) {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('restore_wait')};
        var chip = $scope.restore.input.restore_chip_info;
        var url = cfg.server_url + cfg.restore_url + '?restore_chip_info=' + chip;
        //return;
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            $upload.upload({
                url: url,
                fileFormDataName: 'config_backup',
                file: $file
            }).progress(function (evt) {
                //$scope.restoreBackupStatus = 1;
            }).success(function (data, status, headers, config) {
                //$scope.handleModal('restoreModal');
                $scope.handleModal();
                if (data && data.replace(/(<([^>]+)>)/ig, "") !== "null") {//Error
                    alertify.alertError($scope._t('restore_backup_failed'));
                    //$scope.restoreBackupStatus = 3;
                } else {// Success
                    deviceService.showNotifier({message: $scope._t('restore_done_reload_ui')});
                    $window.location.reload();
                    //$scope.restoreBackupStatus = 2;
                }
            }).error(function (data, status) {
                //$scope.handleModal('restoreModal');
                $scope.handleModal();
                alertify.alertError($scope._t('restore_backup_failed'));
                //$scope.restoreBackupStatus = 3;
            });

        }
    };
});

/**
 * This controller will perform a soft restart and a reset of the Z-Wave controller chip.
 * @class ZwaveChipRebootResetController
 *
 */
appController.controller('ZwaveChipRebootResetController', function ($scope,$window) {
    /**
     * This function will perform a soft restart of the  firmware of the Z-Wave controller chip
     * without deleting any network information or setting.
     * @param {string} cmd
     */
    $scope.serialAPISoftReset = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * This function erases all values stored in the Z-Wave chip and sent the chip back to factory defaults.
     * This means that all network information will be lost without recovery option.
     *  @param {string} cmd
     */
    $scope.setDefault = function (cmd) {
        $scope.runZwaveCmd(cmd);
       // $scope.handleModal('restoreModal');
        $window.location.reload();
    };
});

/**
 * Change Z-Wave Z-Stick 4 frequency.
 * @class ChangeFrequencyController
 *
 */
appController.controller('ChangeFrequencyController', function ($scope) {
    /**
     * Send Configuration ZMEFreqChange
     * @param {string} cmd
     */
    $scope.zmeFreqChange = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };
});

/**
 * The controller will then mark the device as 'failed'
 * but will keep it in the current network con guration.
 * @class RemoveFailedNodeController
 *
 */
appController.controller('RemoveFailedNodeController', function ($scope, $timeout) {
    /**
     * Remove failed node from network.
     * nodeId=x Node id of the device to be removed
     * @param {string} cmd
     */
    $scope.removeFailedNode = function (cmd) {
        $scope.runZwaveCmd(cmd);
        $timeout(function () {
            $scope.controlDh.removed.failedNodes.push($scope.controlDh.input.failedNodes);
            $scope.controlDh.input.failedNodes = 0;
        }, 1000);
    };
});

/**
 * The controller replaces a failed node by a new node.
 * @class ReplaceFailedNodeController
 *
 */
appController.controller('ReplaceFailedNodeController', function ($scope, $timeout) {
    /**
     * Replace failed node with a new one.
     * nodeId=x Node Id to be replaced by new one
     * @param {string} cmd
     */
    $scope.replaceFailedNode = function (cmd) {
        $scope.runZwaveCmd(cmd);
        $timeout(function () {
            $scope.controlDh.removed.replaceNodes.push($scope.controlDh.input.replaceNodes);
            $scope.controlDh.input.replaceNodes = 0;
        }, 1000);
    };
});

/**
 * Allows marking battery-powered devices as failed.
 * @class BatteryDeviceFailedController
 *
 */
appController.controller('BatteryDeviceFailedController', function ($scope, $timeout) {
    /**
     * Sets the internal 'failed' variable of the device object.
     * nodeId=x Node Id to be marked as failed.
     * @param {array} cmdArr
     */
    $scope.markFailedNode = function (cmdArr) {
        angular.forEach(cmdArr, function (v, k) {
            $scope.runZwaveCmd(v);

        });
        //$scope.controlDh.input.failedBatteries = 0;
        $timeout(function () {
            $scope.controlDh.removed.failedBatteries.push($scope.controlDh.input.failedBatteries);
            $scope.controlDh.input.failedBatteries = 0;
        }, 1000);

    };
});

/**
 * The controller change function allows to handover the primary function to a different controller in
 * the network. The function works like a normal inclusion function but will hand over the primary
 * privilege to the new controller after inclusion. Z-Way will become a secondary controller of the network.
 * @class ControllerChangeController
 *
 */
appController.controller('ControllerChangeController', function ($scope) {
    /**
     * Set new primary controller
     * Start controller shift mode if 1 (True), stop if 0 (False)
     *  @param {string} cmd
     */
    $scope.controllerChange = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };
});

/**
 * This will call the Node Information Frame (NIF) from all devices in the network.
 * @class RequestNifAllController
 *
 */
appController.controller('RequestNifAllController', function ($scope, $timeout, cfg, dataService, deviceService) {
    /**
     * Request NIF from all devices
     */
    $scope.requestNifAll = function (spin) {
        $scope.toggleRowSpinner(spin);
        var timeout = 1000;
        dataService.runZwaveCmd(cfg.call_all_nif).then(function (response) {
            deviceService.showNotifier({message: $scope._t('nif_request_complete')});
            $scope.toggleRowSpinner();
        }, function (error) {
            $scope.toggleRowSpinner();
            deviceService.showNotifier({message: $scope._t('error_nif_request'),type: 'error'});
        });
    };
});

/**
 * This will call the Node Information Frame (NIF) from the controller.
 * @class SendNodeInformationController
 *
 */
appController.controller('SendNodeInformationController', function ($scope) {
    /**
     * Send NIF of the stick
     * Parameter nodeId: Destination Node Id (NODE BROADCAST to send non-routed broadcast packet)
     * @param {string} cmd
     */
    $scope.sendNodeInformation = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };
});

/**
 * This controller allows controlling the SUC/SIS function for the Z-Wave network.
 * @class SucSisController
 *
 */
appController.controller('SucSisController', function ($scope) {
    /**
     * Get the SUC Node ID from the network.
     *  @param {string} cmd
     */
    $scope.getSUCNodeId = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * Request network topology update from SUC/SIS.
     *  @param {string} cmd
     */
    $scope.requestNetworkUpdate = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * Assign SUC function to a node in the network that is capable of running there SUC function
     * nodeId=x Node id to be assigned as SUC
     *  @param {string} cmd
     */
    $scope.setSUCNodeId = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * Assign SIS role to a device
     * nodeId=x Node id to be assigned as SIS
     * @param {string} cmd
     */
    $scope.setSISNodeId = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * Revoke SUC/SIS role from a device
     * nodeId=x Node id to be disabled as SUC
     *  @param {string} cmd
     */
    $scope.disableSUCNodeId = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };


});

/**
 * This sets Promiscuous mode to true/false.
 * @class SetPromiscuousModeController
 *
 */
appController.controller('SetPromiscuousModeController', function ($scope) {
    /**
     * Sets promiscuous mode
     * @param {string} cmd
     */
    $scope.setPromiscuousMode = function (cmd) {
        $scope.runZwaveCmd(cmd,1000,true);
    };
});
/**
 * @overview This controller renders and handles network statistics.
 * @author Martin Vach
 */

/**
 * Network statistics controller
 * @class NetworkStatisticsController
 *
 */
appController.controller('NetworkStatisticsController', function ($scope, $filter, $timeout, $interval, dataService, cfg, _, deviceService) {
    $scope.networkStatistics = {
        all: [],
        collection: [],
        show: false,
        whiteList: ['RFRxCRC16Errors', 'RFRxForeignHomeID', 'RFRxFrames', 'RFRxLRCErrors', 'RFTxFrames', 'RFTxLBTBackOffs']
    };

    $scope.netStat = {
        all: {},
        show: false
    };

    var cOptions = {
        colorSet: "statisticsColors",
        title:{
            text: "Success on Reception (% ok versus % corrupted)",
            fontFamily: "arial",
            fontSize: 20
        },
        legend: {
            verticalAlign: "bottom",
            horizontalAlign: "center",
            fontFamily: "arial",
            fontSize: 15
        },
        theme: "theme2",
        data: [
            {
                //indexLabelFontColor: "MistyRose",
                //indexLabelLineColor: "darkgrey",
                type: "pie",
                indexLabelFontFamily: "arial",
                indexLabelFontSize: 20,
                indexLabelFontWeight: "bold",
                startAngle:0,
                indexLabelPlacement: "inside",
                toolTipContent: "{name}: {y}",
                showInLegend: true,
                percentFormatString: "#0",
                indexLabel: "#percent %",
                dataPoints: [{  y: 100, name: "Not shown",color: '#f5f5f5'}]
            //{  y: 100, name: "Not shown",color: '#f5f5f5'}
            }
        ]
    };
    var cColors =  ["#80AD80","#d9534f","#f0ad4e"];

    $scope.testGraph = function(){

        CanvasJS.addColorSet("statisticsColors",cColors);
        var chart = new CanvasJS.Chart('chartContainer',cOptions);
        chart.render();
    };

    //$scope.testGraph();
    /**
     * Load network statistics
     */
    $scope.loadNetworkStatistics = function () {
        var cmd = cfg.store_url + 'controller.data.statistics';
        dataService.runZwaveCmd(cmd).then(function (response) {
            var percentCnt = function (total, num) {
                if (total === 0 && num === 0) {
                    return 0;
                }
                var out = parseInt(((num / total) * 100).toFixed());
                // Sets 1 percent if num is not 0 and out is 0
                return out === 0 && num > 0 ? 1 : out;
            }
            // Total Number of Frames Sent RFTxFrames
            var RFTxFrames = parseInt(response.data.RFTxFrames.value);
            // Frames with Frequency Backoff (in % of frames sent) RFTxLBTBackOffs
            var RFTxLBTBackOffs = parseInt(response.data.RFTxLBTBackOffs.value);
            var objRFTxLBTBackOffs = response.data.RFTxLBTBackOffs;

            objRFTxLBTBackOffs['RFTxFrames'] = RFTxFrames;
            objRFTxLBTBackOffs['frameName'] = 'RFTxFrames';
            objRFTxLBTBackOffs['frameValue'] = RFTxFrames;
            objRFTxLBTBackOffs['fail'] = percentCnt(RFTxFrames, RFTxLBTBackOffs);
            objRFTxLBTBackOffs['success'] = (RFTxFrames > 0 ?(100 - objRFTxLBTBackOffs['fail']) : 0);
            objRFTxLBTBackOffs['dateTime'] = $filter('getDateTimeObj')(response.data.RFTxLBTBackOffs.updateTime);
            $scope.netStat.all[0] = objRFTxLBTBackOffs;

            // Number of correct Frames received RFRxFrames
            var RFRxFrames = parseInt(response.data.RFRxFrames.value);
            var RFRxLRCErrors = parseInt(response.data.RFRxLRCErrors.value);
            var RFRxCRC16Errors = parseInt(response.data.RFRxCRC16Errors.value);
             var RFRxForeignHomeID = parseInt(response.data.RFRxForeignHomeID.value);

            // Number of corrupted CRC8 Frames received
            var objRFRxLRCErrors = response.data.RFRxLRCErrors;
            objRFRxLRCErrors['fail'] = percentCnt(RFRxFrames, RFRxLRCErrors);
            objRFRxLRCErrors['failCRC8'] = percentCnt(RFRxFrames, RFRxLRCErrors);
            objRFRxLRCErrors['failCRC16'] = percentCnt(RFRxFrames, RFRxCRC16Errors);
            objRFRxLRCErrors['success'] = (RFRxFrames > 0 ?(100 - (objRFRxLRCErrors['failCRC8'] + objRFRxLRCErrors['failCRC16'])) : 0);
            objRFRxLRCErrors['RFRxFrames'] = RFRxFrames;
            objRFRxLRCErrors['frameName'] = 'RFRxFrames';
            objRFRxLRCErrors['frameValue'] = RFRxFrames;
            objRFRxLRCErrors['failCRC8Name'] = 'RFRxLRCErrors';
            objRFRxLRCErrors['failCRC16Name'] = 'RFRxCRC16Errors';
            objRFRxLRCErrors['failCRC8Value'] = RFRxLRCErrors;
            objRFRxLRCErrors['failCRC16Value'] = RFRxCRC16Errors;
            objRFRxLRCErrors['dateTime'] = $filter('getDateTimeObj')(response.data.RFRxLRCErrors.updateTime);
            $scope.netStat.all[1] = objRFRxLRCErrors;
            /*console.log($scope.netStat.all[1])

            cOptions.data.dataPoints = [
                {  y: 100, name: "Not shown",color: '#f5f5f5'}
            ]
            CanvasJS.addColorSet("statisticsColors",cColors);
            var chart = new CanvasJS.Chart('chartContainer',cOptions);
            chart.render();*/

            // Number of corrupted CRC16 Frames received
            /*var objRFRxCRC16Errors = response.data.RFRxCRC16Errors;
            objRFRxCRC16Errors['fail'] = percentCnt(RFRxFrames, RFRxCRC16Errors);
            objRFRxCRC16Errors['success'] = (RFRxFrames > 0 ?(100 - objRFRxCRC16Errors['fail']) : 0);
            objRFRxCRC16Errors['RFRxFrames'] = RFRxFrames;
            objRFRxCRC16Errors['dateTime'] = $filter('getDateTimeObj')(response.data.RFRxCRC16Errors.updateTime);
            $scope.netStat.all[2] = objRFRxCRC16Errors;*/

            // RFRxForeignHomeID RFRxForeignHomeID
            var objRFRxForeignHomeID = response.data.RFRxForeignHomeID;
            objRFRxForeignHomeID['fail'] = percentCnt(RFRxFrames, RFRxForeignHomeID);
            objRFRxForeignHomeID['success'] =  (RFRxFrames > 0 ?(100 - objRFRxForeignHomeID['fail']) : 0);
            objRFRxForeignHomeID['RFRxFrames'] = RFRxFrames;
            objRFRxForeignHomeID['frameName'] = 'RFRxFrames';
            objRFRxForeignHomeID['frameValue'] = RFRxFrames;

            objRFRxForeignHomeID['dateTime'] = $filter('getDateTimeObj')(response.data.RFRxForeignHomeID.updateTime);
            $scope.netStat.all[3] = objRFRxForeignHomeID;
            //return;
            /*$scope.netStat.all['RFTxLBTBackOffs'] = response.data.RFTxLBTBackOffs;
             $scope.netStat.all['RFRxCRC16Errors'] = response.data.RFRxCRC16Errors;
             $scope.netStat.all['RFRxForeignHomeID'] = response.data.RFRxForeignHomeID;*/


            //console.log(response);
            //return;

            /* $scope.netStat.all = _.chain(response.data)
             .filter(function (v,k) {


             }).value();*/

            //Old
            $scope.networkStatistics.all = _.chain(response.data)
                .filter(function (v, k) {
                    if ($scope.networkStatistics.whiteList.indexOf(k) > -1) {
                        v.name = k;
                        v.isUpdated = (v.updateTime > v.invalidateTime ? true : false);
                        v.dateTime = $filter('getDateTimeObj')(v.updateTime);
                        return v;
                    }

                }).value();
            if (_.isEmpty($scope.networkStatistics.all)) {
                $scope.alert = {
                    message: $scope._t('device_404'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation-circle'
                };
                return;
            }
            $scope.networkStatistics.show = true;
        }, function (error) {
            alertify.alertError($scope._t('error_load_data') + '\n' + cmd);
        });
    };
    $scope.loadNetworkStatistics();

    /**
     * Update network statistics
     * @param {string} cmd
     */
    $scope.updateNetworkStatistics = function (cmd) {
        var timeout = 1000;
        $scope.runZwaveCmd(cmd, timeout);
        $timeout(function () {
            $scope.loadNetworkStatistics()
        }, timeout);
    };

});
/**
 * @overview This controller renders and handles routing table.
 * @author Martin Vach
 */

/**
 * Neighbor controller
 * @class NeighborController
 *
 */
appController.controller('NeighborController', function ($scope, $filter, $timeout, $interval, $http, dataService, deviceService,cfg, _) {
    $scope.routings = {
        all: [],
        updates: [],
        interval: null,
        show: false,
        view: 'neighbors',
        showInfo: true,
        dataSize: 'sm'//sm/md/lg
    };
    $scope.htmlNeighbors = {};

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.routings.interval);
    });
    /**
     * Chenge view neighbors/table
     * @param {string} view
     */
    $scope.changeView = function (status) {
        if (typeof status === 'boolean') {
            $scope.routings.showInfo = status;
        } else {
            $scope.routings.showInfo = !$scope.routings.showInfo;
        }
    };

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function () {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            //setNodes(ZWaveAPIData);
            setData(ZWaveAPIData);
            var size = _.size($scope.routings.all);
            if (size < 1) {
                $scope.alert = {
                    message: $scope._t('device_404'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation-circle'
                };
                return;
            }
            // Data size
            if (size > 30 && size < 50) {
                $scope.routings.dataSize = 'md'
            } else if (size > 50) {
                $scope.routings.dataSize = 'lg'
            }
            setCells($scope.routings.all);
            $scope.routings.show = true;

        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshZwaveData = function () {
        var refresh = function () {
            dataService.loadJoinedZwaveData(null).then(function (response) {
                angular.forEach(response.data.update, function(v, k) {
                    if($scope.routings.updates.indexOf(k) > -1){
                        console.log(k)
                        setData(response.data.joined);
                        setCells($scope.routings.all);
                    }
            });

                //
            }, function (error) {
            });
        };
        $scope.routings.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Update route
     * @param {string} url
     */
    $scope.updateRoute = function (url) {
        $scope.toggleRowSpinner(url);
        dataService.runZwaveCmd(cfg.store_url + url).then(function (response) {
            $scope.refreshZwaveData();
            //$scope.toggleRowSpinner();
            $timeout($scope.toggleRowSpinner, 1000);
            $timeout(function(){
                $interval.cancel($scope.routings.interval);
            }, 5000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + url);
        });
    };

    /**
     * Update all routes
     * @param {string} id
     * @param {string} urlType
     */
    $scope.updateAllRoutess = function (id, urlType) {
        var lastItem = _.last($scope.routings.all);
        $scope.toggleRowSpinner(id);
        $scope.refreshZwaveData();
        angular.forEach($scope.routings.all, function (v, k) {
            $scope.toggleRowSpinner(v[urlType]);
            dataService.runZwaveCmd(cfg.store_url + v[urlType]).then(function (response) {
                alertify.dismissAll();
            }, function (error) {
                alertify.dismissAll();
                alertify.alertError($scope._t('error_update_data') + '\n' + v[urlType]);
            });
            if (lastItem.rowId === v.rowId) {
                $timeout($scope.toggleRowSpinner, 1000);
            }
        });
        $timeout(function(){
            $interval.cancel($scope.routings.interval);
        }, 5000);

    };

    /// --- Private functions --- ///
    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {

            if (nodeId == 255 || node.data.isVirtual.value || node.data.basicType.value == 1) {
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            var name = $filter('deviceName')(nodeId, node);
            var type = deviceService.deviceType(node);

            /// New version
            var routesCount = $filter('getRoutesCount')(ZWaveAPIData, nodeId);
            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = name;
            obj['node'] = node;
            obj['routesCount'] = routesCount;

            obj['type'] = type;
            obj['icon'] = $filter('getDeviceTypeIcon')(type);
            obj['invalidateTime'] = node.data.neighbours.invalidateTime;
            obj['updateTime'] = node.data.neighbours.updateTime,
                obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
            obj['urlToStore'] = 'devices[' + nodeId + '].RequestNodeNeighbourUpdate()';

            var findIndex = _.findIndex($scope.routings.all, {rowId: obj.rowId});
            if (findIndex > -1) {
                angular.extend($scope.routings.all[findIndex], obj);

            } else {
                $scope.routings.all.push(obj);
                $scope.routings.updates.push('devices.' + nodeId + '.data.neighbours')
            }
            /*for (i = 0; i < 10; i++) {
             $scope.routings.all.push(obj);
             }*/
        });
    }

    /**
     * Set table cell state
     * @param {object} nodes
     * @returns {Array}
     */
    function setCells(nodes) {
        angular.forEach(nodes, function (node, i) {
            $scope.htmlNeighbors[node.id] = '';
            angular.forEach(nodes, function (v, k) {
                var tooltip = node.id + ': ' + node.name + ' - ' + v.id + ': ' + v.name + ' ';
                //var routesCount = v.routesCount;
                var hasAssoc = false;
                var cssClass = 'rtUnavailable';
                //Check for associations
                /*if ($filter('associationExists')(node.node, v.id)) {
                    hasAssoc = true;
                    tooltip += ' (' + $scope._t('rt_associated') + ')';
                }*/
                if (node.id == v.id) {
                    cssClass = 'rtWhite';
                } else if (v.node.data.neighbours.value.indexOf(parseInt(node.id, 10)) != -1) {
                    cssClass = 'rtDirect';
                }  else {
                    cssClass = 'rtNotLinked';
                }
                var out = '<span class="rt-cell ' + cssClass + '" title="' + tooltip + '">' + (hasAssoc ? "*" : "&nbsp") + '</span>';
                //console.log(out)
                $scope.htmlNeighbors[node.id] += out;
            });
        });

    }
});
/**
 * @overview This controller renders and handles reorganizations.
 * @author Martin Vach
 */
/**
 * Reorganization root controller
 * @class ReorganizationController
 *
 */
appController.controller('ReorganizationController', function ($scope, $filter, $timeout, $interval, $window, cfg, dataService, _) {
    $scope.reorganizations = {
        input: {
            reorgMain: true,
            reorgBattery: false
        },
        trace: 'stop',
        run: false,
        all: [],
        interval: null,
        show: false,
        lastUpdate: 0
    };


    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.reorganizations.interval);
    });

    /**
     * Set trace
     */
    $scope.setTrace = function (trace, input) {
        $interval.cancel($scope.reorganizations.interval);
        switch (trace) {
            case 'pause':
                $scope.reorganizations.trace = 'pause';
                //$interval.cancel($scope.reorganizations.interval);
                $scope.reorganizations.run = false;
                break;
            case 'run':
                /*if($scope.reorganizations.trace === 'stop'){
                    $scope.reorganizations.all = [];
                }*/
                $scope.runReorganization(input);
                $scope.reorganizations.trace = 'run';


                break;
            case 'stop':
                $scope.reorganizations.all = [];
                $scope.reorganizations.trace = 'stop';
                //$interval.cancel($scope.reorganizations.interval);
                $scope.reorganizations.run = false;
                break;
            default:
                 break;

        }
        //console.log('Set trace: ',  $scope.zniffer.trace)
    };

    /**
     * Run reorganization
     */
    $scope.runReorganization = function (input) {
        var params = '?reorgMain=' + input.reorgMain + '&reorgBattery=' + input.reorgBattery;
        $scope.reorganizations.all = [];
        $scope.reorganizations.run = false;
        dataService.getApi('reorg_run_url', params, true).then(function (response) {
            $scope.reorganizations.run = {
                message: response.data.data,
                status: 'alert-success',
                icon: 'fa-spinner fa-spin'
            };
            $scope.loadReorganizationLog(true);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    //$scope.runReorganization($scope.reorganizations.input);

    /**
     * Load reorganization log
     */
    $scope.loadReorganizationLog = function (refresh) {
        dataService.getApi('reorg_log_url', null, true).then(function (response) {
            //response.data = [];
            if(_.isEmpty(response.data)){
                $scope.reorganizations.run = {
                    message: $scope._t('reorg_empty'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation'
                };
                $scope.reorganizations.trace = 'stop';
                return;
            }

            //$scope.reorganizations.all = [];
            setData(response.data);
            if (refresh) {
                $scope.refreshReorganization();
            } else {
                $scope.reorganizations.lastUpdate = $filter('getDateTimeObj')(response.data.pop().timestamp / 1000);
            }

        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };



    /**
     * Download reorganization log
     */
    $scope.downloadReorganizationLog = function () {
        // Build a log
        var data = '';
        angular.forEach($scope.reorganizations.all, function (v, k) {
            data += v.dateTime.time + ': ' + v.message + '\n';
        });

        // Download a log
        var log = data;
        blob = new Blob([log], {type: 'text/plain'}),
            url = $window.URL || $window.webkitURL;
        $scope.fileUrl = url.createObjectURL(blob);
    };

    /**
     * Refresh zwave data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshReorganization = function () {
        var refresh = function () {
            dataService.getApi('reorg_log_url', null, true).then(function (response) {
                setData(response.data);
            }, function (error) {
            });
        };
        $scope.reorganizations.interval = $interval(refresh,cfg.reorg_interval);
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(data) {
        //$scope.reorganizations.all.push(data);
        //$scope.reorganizations.all = [];

        // Loop throught data
        angular.forEach(data, function (v, k) {

            /*var obj = {};
            obj['timestamp'] = v.timestamp;
            obj['message'] = v.message;
            obj['dateTime'] = $filter('getDateTimeObj')(v.timestamp / 1000);*/
            v. dateTime = $filter('getDateTimeObj')(v.timestamp / 1000);
            var findIndex = _.findIndex($scope.reorganizations.all, {timestamp: v.timestamp});

            if (findIndex === -1) {
                $scope.reorganizations.all.push(v);

            } else {

            }
            /*var isComplete = v.message.search("reorg complete");
            if(isComplete > -1){
                $scope.setTrace('pause');
            }*/
            //console.log(isComplete);


        });
    }

    $scope.loadReorganizationLog();
});
/**
 * OLD ReorganizationController
 * @author Martin Vach
 */
appController.controller('ReorganizationOldController', function ($scope, $filter, $interval, $timeout, dataService, cfg) {

    $scope.mainsPowered = true;
    $scope.batteryPowered = false;
    $scope.devices = [];
    $scope.nodes = {};
    $scope.ZWaveAPIData;
    $scope.processQueue = [];
    $scope.reorganizing = true;
    $scope.log = [];
    $scope.logged = "";
    $scope.appendLog = function (str, line) {
        if (line !== undefined) {
            $scope.log[line] += str;
        } else {
            $scope.log.push($filter('getTime')(new Date().getTime() / 1000) + ": " + str);
        }
        dataService.putReorgLog($scope.log.join("\n"));
        return $scope.log.length - 1;
    };
    $scope.downloadLog = function () {
        var hiddenElement = $('<a id="hiddenElement" href="' + cfg.server_url + cfg.reorg_log_url + '?at=' + (new Date()).getTime() + '" target="_blank" download="reorg.log"></a>').appendTo($('body'));
        hiddenElement.get(0).click();
        hiddenElement.detach();
    };
    var refreshLog = function () {
        // Assign to scope within callback to avoid data flickering on screen
        dataService.getReorgLog(function (log) {
            $scope.logged = log;
            // scroll to bottom
            var textarea = $("#reorg_log").get(0);
            textarea.scrollTop = textarea.scrollHeight;
        });
    };
    var promise = $interval(refreshLog, 1000);
    // Cancel interval on page changes
    $scope.$on('$destroy', function () {
        if (angular.isDefined(promise)) {
            $interval.cancel(promise);
            promise = undefined;
        }
    });
    $scope.reorgNodesNeighbours = function (current, result, doNext) {
        if (("complete" in current) && current.complete) {
            doNext();
            return;
        }
        dataService.store('devices[' + current.nodeId + '].RequestNodeNeighbourUpdate()', function (response) {
            var pollForNodeNeighbourUpdate = function (current) {
                dataService.updateZwaveDataSince(current.since, function (updateZWaveAPIData) {
                    $scope.appendLog(".", current.line);
                    try {
                        if ("devices." + current.nodeId + ".data.neighbours" in updateZWaveAPIData) {
                            var obj = updateZWaveAPIData["devices." + current.nodeId + ".data.neighbours"]
                            if (current.since < obj.updateTime && obj.invalidateTime < obj.updateTime) {
                                $scope.ZWaveAPIData.devices[current.nodeId].data.neighbours = obj;
                                $scope.nodes[current.nodeId].node = $scope.ZWaveAPIData.devices[current.nodeId];
                                // routes updated
                                var routesCount = $filter('getRoutesCount')($scope.ZWaveAPIData, current.nodeId);
                                $.each($scope.ZWaveAPIData.devices, function (nnodeId, nnode) {
                                    if (!routesCount[nnodeId]) {
                                        return;
                                    }
                                });
                                $scope.appendLog(" " + $scope._t('reorg_done'), current.line);
                                if (current.type == "battery") {
                                    if ("battery_completed" in result) {
                                        result.battery_completed++;
                                    } else {
                                        result.battery_completed = 1;
                                    }
                                } else {
                                    if ("mains_completed" in result) {
                                        result.mains_completed++;
                                    } else {
                                        result.mains_completed = 1;
                                    }
                                }
                                // mark all retries in processQueue as complete
                                for (var i = 0; i < $scope.processQueue.length; i++) {
                                    if ($scope.processQueue[i].nodeId == current.nodeId) {
                                        $scope.processQueue[i].complete = true;
                                    }
                                }
                                current.complete = true;
                                doNext();
                                return;
                            }
                        }
                    } catch (exception) {
                        $scope.appendLog(" " + e.message, current.line);
                    }
                    if (current.timeout < (new Date()).getTime()) {
                        // timeout waiting for an update-route occured, proceed
                        $scope.appendLog(" " + $scope._t('reorg_timeout'), current.line);
                        if (current.retry == 3) {
                            if (current.type == "battery") {
                                if ("battery_pending" in result) {
                                    result.battery_pending++;
                                } else {
                                    result.battery_pending = 1;
                                }
                            } else {
                                if ("mains_pending" in result) {
                                    result.mains_pending++;
                                } else {
                                    result.mains_pending = 1;
                                }
                            }
                        }
                        current.complete = true;
                        doNext();
                        return;
                    }
                    // routes not yet updated, poll again
                    window.setTimeout(pollForNodeNeighbourUpdate, cfg.interval, current);
                }, function (error) {
                    // error handler
                    $scope.appendLog(error, current.line);
                    if (current.retry == 3) {
                        if (current.type == "battery") {
                            if ("battery_pending" in result) {
                                result.battery_pending++;
                            } else {
                                result.battery_pending = 1;
                            }
                        } else {
                            if ("mains_pending" in result) {
                                result.mains_pending++;
                            } else {
                                result.mains_pending = 1;
                            }
                        }
                    }
                    current.complete = true;
                    doNext();
                });
            };
            // first polling
            pollForNodeNeighbourUpdate(current);
        }, function (error) {
            // error handler
            $scope.appendLog(error, current.line);
            if (current.type == "battery") {
                if ("battery_pending" in result) {
                    result.battery_pending++;
                } else {
                    result.battery_pending = 1;
                }
            } else {
                if ("mains_pending" in result) {
                    result.mains_pending++;
                } else {
                    result.mains_pending = 1;
                }
            }
            current.complete = true;
            doNext();
        });
    };
    $scope.processReorgNodesNeighbours = function (result, pos) {
        if ($scope.processQueue.length <= pos) {
            if ($scope.reorganizing) {
                $scope.appendLog($scope._t('reorg_completed') + ":");
                if ("mains_completed" in result)
                    $scope.appendLog(result.mains_completed + " " + $scope._t('reorg_mains_powered_done'));
                if ("battery_completed" in result)
                    $scope.appendLog(result.battery_completed + " " + $scope._t('reorg_battery_powered_done'));
                if ("mains_pending" in result)
                    $scope.appendLog(result.mains_pending + " " + $scope._t('reorg_mains_powered_pending'));
                if ("battery_pending" in result)
                    $scope.appendLog(result.battery_pending + " " + $scope._t('reorg_battery_powered_pending'));
                if ($.isEmptyObject(result))
                    $scope.appendLog($scope._t('reorg_nothing'));
                $scope.reorganizing = false;
            }
            return;
        }
        var current = $scope.processQueue[pos];
        if (!("complete" in current) || !current.complete) {
            if (!("line" in current)) {
                current.posInQueue = pos;
                current.line = $scope.appendLog($scope._t('reorg_reorg') + " " + current.nodeId + " " + (current.retry > 0 ? current.retry + ". " + $scope._t('reorg_retry') : "") + " ");
            }
            // process-states
            if (!("timeout" in current)) {
                current.timeout = (new Date()).getTime() + cfg.route_update_timeout;
            }
        }
        if (current.fork) {
            // batteries are processed in parallel, forking
            $scope.reorgNodesNeighbours(current, result, function () {
            });
            pos++;
            $scope.processReorgNodesNeighbours(result, pos);
        } else {
            // main powereds are processed sequential
            $scope.reorgNodesNeighbours(current, result, function () {
                pos++;
                $scope.processReorgNodesNeighbours(result, pos);
            });
        }
    };
    // reorgAll routes
    $scope.reorgAll = function () {
        $scope.reorganizing = true;
        $scope.log = [];
        $scope.appendLog($scope._t('reorg_started'));
        // retry each element up to 4 times
        $scope.processQueue = [];
        var logInfo = "";
        if ($scope.mainsPowered) {
            for (var retry = 0; retry < 4; retry++) {
                // first RequestNodeNeighbourUpdate for non-battery devices
                $.each($scope.devices, function (index, nodeId) {
                    if ($filter('updateable')($scope.nodes[nodeId].node, nodeId, false)) {
                        $scope.processQueue.push({
                            "nodeId": nodeId,
                            "retry": retry,
                            "type": "mains",
                            "since": $scope.ZWaveAPIData.updateTime,
                            "fork": false
                        });
                        if (retry == 0) {
                            if (logInfo != "") {
                                logInfo += ", ";
                            }
                            logInfo += nodeId;
                        }
                    }
                });
                if (retry == 0) {
                    $scope.appendLog($scope._t('reorg_all_mains') + ": " + logInfo);
                    logInfo = "";
                }
            }
        }
        if ($scope.batteryPowered) {
            for (var retry = 0; retry < 4; retry++) {
                // second RequestNodeNeighbourUpdate for battery devices
                $.each($scope.devices, function (index, nodeId) {
                    if ($filter('updateable')($scope.nodes[nodeId].node, nodeId, true)) {
                        $scope.processQueue.push({
                            "nodeId": nodeId,
                            "retry": retry,
                            "type": "battery",
                            "since": $scope.ZWaveAPIData.updateTime,
                            "fork": true
                        });
                        if (retry == 0) {
                            if (logInfo != "") {
                                logInfo += ", ";
                            }
                            logInfo += nodeId;
                        }
                    }
                });
                // use last in retry-group as sequential-blocker
                $scope.processQueue[$scope.processQueue.length - 1].fork = false;
                if (retry == 0) {
                    $scope.appendLog($scope._t('reorg_all_battery') + ": " + logInfo);
                }
            }
        }
        $scope.processReorgNodesNeighbours({}, 0);
    };
    // Load data
    $scope.load = function (lang) {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            // Prepare devices and nodes
            angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
                if (nodeId == 255 || node.data.isVirtual.value || node.data.basicType.value == 1)
                    return;
                $scope.devices.push(nodeId);
                $scope.nodes[nodeId] = {"label": $filter('deviceName')(nodeId, node), "node": node};
            });
            $scope.reorganizing = false;
        });
    };
    $scope.load($scope.lang);
});
/**
 * @overview This controller renders and handles communication history.
 * @author Martin Vach
 */

/**
 * Timing root controller
 * @class TimingController
 *
 */
appController.controller('TimingController', function($scope, $filter, $q,$timeout,$interval,dataService,deviceService, cfg,_) {
    $scope.devices = {
        ids: [],
        all: [],
        interval: null,
        show: false
    };
    $scope.timing = [];

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.devices.interval);
    });

    /**
     * Load all promises
     * @returns {undefined}
     */
    $scope.allSettled = function () {
        var promises = [
            dataService.getApi('stat_url', null, true),
            dataService.loadZwaveApiData()
        ];

        $q.allSettled(promises).then(function (response) {
            // console.log(response)
            var timing = response[0];
            var zwaveData = response[1];
            $scope.loading = false;

            // timing error message
            if (timing.state === 'rejected') {
                alertify.alertError($scope._t('error_load_data') + ':' + cfg.server_url + cfg.device_classes_url);
            }

            // zwaveData error message
            if (zwaveData.state === 'rejected') {
                alertify.alertError($scope._t('error_load_data'));
                return;
            }
            // Success - timing
            if (timing.state === 'fulfilled') {
                $scope.timing = timing.value.data;

                //setDeviceClasses(deviceClasses.value);
            }

            // Success - zwaveData
            if (zwaveData.state === 'fulfilled') {
                //console.log(zwaveData.value)
                setData(zwaveData.value);
                if(_.isEmpty($scope.devices.all)){
                    $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                    return;
                }
                $scope.devices.show = true;
                $scope.refreshZwaveData();
            }

        });

    };
    $scope.allSettled();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                var update = false;
                angular.forEach(response.data.update, function(v, k) {
                    // Get node ID from response
                    var findId = k.split('.')[1];
                    // Check if node ID is in the available devices
                    if($scope.devices.ids.indexOf(findId) > -1){
                        update = true;
                        //console.log('Updating nodeId: ',findId);
                        return;
                    }
                });
                // Update found - updating available devices
                if(update){
                    setData(response.data.joined);
                }
            }, function(error) {});
        };
        $scope.devices.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Update timing info
     * @param {text} spin
     */
    $scope.updateTimingInfo = function(spin) {
        $scope.toggleRowSpinner(spin);
        $interval.cancel($scope.devices.interval);
        $scope.allSettled();
        $timeout($scope.toggleRowSpinner, 1000);
    };

    /// --- Private functions --- ///
    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
            /*if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }*/
            var node = ZWaveAPIData.devices[nodeId];
            var type = deviceService.deviceType(node);
            var totalPackets = 0;
            var okPackets = 0;
            var lastPackets = '';
            var basicType = node.data.basicType.value;
            var genericType = node.data.genericType.value;
            var specificType = node.data.specificType.value;
            var lastCommunication = deviceService.lastCommunication(node);

            // Packets
            var timingItems =  $scope.timing[nodeId];

            if (angular.isDefined(timingItems)) {
                totalPackets = timingItems.length;
                okPackets = getOkPackets(timingItems);
                lastPackets = getLastPackets(timingItems);
            }

            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['type'] = type;
            obj['icon'] = $filter('getDeviceTypeIcon')(type);
            obj['updateTime'] = lastCommunication;
            obj['dateTime'] = $filter('getDateTimeObj')(lastCommunication);
            obj['totalPackets'] = totalPackets;
            obj['okPackets'] = okPackets;
            obj['lastPackets'] = lastPackets;
            obj['basicType'] = basicType;
            obj['genericType'] = genericType;
            obj['specificType'] = specificType;
            var findIndex = _.findIndex($scope.devices.all, {rowId: obj.rowId});
            if(findIndex > -1){
                angular.extend($scope.devices.all[findIndex],obj);

            }else{
                $scope.devices.all.push(obj);
            }
            if($scope.devices.ids.indexOf(nodeId) === -1){
                $scope.devices.ids.push(nodeId);
            }
        });
    }

    /**
     * Get percentage of delivered packets
     */
    function getOkPackets(data) {
        var isDelivered = 0;
        var notDelivered = 0;
        angular.forEach(data, function(v, k) {
            if (v.delivered == true) {
                isDelivered++;
            } else {
                notDelivered++;
            }

        });
        var calcPercent = isDelivered / data.length * 100;
        var percent = 0;
        if (!isNaN(calcPercent)) {
            percent = calcPercent.toFixed(0);
        }
        return percent;

    }

    /**
     * Get list of last packets
     */
    function getLastPackets(data) {
        var packets = '&nbsp;';
        var deliveryTime = 0;
        var color;
        angular.forEach(data.slice(-20), function(v, k) {
            deliveryTime = parseInt(v.deliveryTime);
            if (!v.delivered) {
                color = 'red';
            } else {
                color = (deliveryTime > 100 ? 'black' : 'green');
            }
            var displayTime = deliveryTime / 10;
            packets += '<span class="' + color + ' timing-packet">' + (displayTime.toFixed() < 1 ? 1 : displayTime.toFixed()) + '</span> ';
        });
        return packets;

    }
});
/**
 * @overview This controller renders and handles link status stuff.
 * @author Martin Vach
 */

/**
 * Link status controller
 * @class CLinkStatusController
 *
 */
appController.controller('LinkStatusController', function ($scope, $routeParams, $timeout, $location, $cookies, $filter, $interval, cfg, deviceService, dataService) {
    $scope.linkStatus = {
        all: [],
        interval: null,
        show: false,
        showInfo: true

    };
    $scope.htmlNeighbors = {};
    $scope.testLink = {};
    // Cancel interval on page destroy
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.linkStatus.interval);
    });

    /**
     * Chenge view info and table = true /table only = false
     * @param {string} view
     */
    $scope.changeView = function (status) {
        if (typeof status === 'boolean') {
            $scope.linkStatus.showInfo = status;
        } else {
            $scope.rlinkStatus.showInfo = !$scope.linkStatus.showInfo;
        }
    };

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function () {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            setData(ZWaveAPIData);
            if (_.isEmpty($scope.linkStatus.all)) {
                $scope.alert = {
                    message: $scope._t('device_404'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation-circle'
                };
                return;
            }
            setCells($scope.linkStatus.all);
            $scope.linkStatus.show = true;

        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function () {

        var refresh = function () {
            //var findZwaveStr = 'devices.' + 86;
            dataService.loadJoinedZwaveData().then(function (response) {
                var update = false;
               angular.forEach(response.data.update, function(v, k) {
                    var nodeId = k.split('.')[1];
                    if($scope.testLink[nodeId]){
                        update = true;
                        return;
                    }
                });
                if(update){
                    setData(response.data.joined);
                    setCells($scope.linkStatus.all);
                }
            }, function (error) {
            });
        };
        $scope.linkStatus.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Test all links
     * @param {string} id
     */
    $scope.testAllLinks = function(nodeId) {
        $interval.cancel($scope.linkStatus.interval);
        $scope.toggleRowSpinner(nodeId);
        var data = {"nodeId": nodeId};
        dataService.postApi('checklinks', data).then(function () {
            $scope.refreshZwaveData();
            $scope.toggleRowSpinner();
        }, function () {
            alertify.alertError($scope._t('error_update_data'));
            $scope.toggleRowSpinner();
        });
    };


    /**
     * todo: Whay 21 times?
     * Run NOP command
     * @param {string} cmd
     */
    $scope.runZwaveNop = function (cmd) {
        $interval.cancel($scope.linkStatus.interval);
        for (i = 0; i < 21; i++) {
            $scope.runZwaveCmd(cmd,3000,true);
        }
        $scope.refreshZwaveData();
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            if (nodeId == 255 || node.data.isVirtual.value) {
                return;
            }
            var hasPowerLevel = node.instances[0].commandClasses[115];

            // Loop throught instances
            angular.forEach(node.instances, function (instance, instanceId) {
                if (instanceId == 0 && node.instances.length > 1) {
                    return;
                }
                var lastReceive = parseInt(node.data.lastReceived.updateTime, 10) || 0;
                var lastSend = parseInt(node.data.lastSend.updateTime, 10) || 0;
                var lastCommunication = (lastSend > lastReceive) ? lastSend : lastReceive;
                var dateTime;
                var isUpdated;
                if (hasPowerLevel) {
                    isUpdated = ((hasPowerLevel.data.updateTime > hasPowerLevel.data.invalidateTime) ? true : false);
                    dateTime = $filter('getDateTimeObj')(hasPowerLevel.data.updateTime, hasPowerLevel.data.invalidateTime);
                }
                var type = deviceService.deviceType(node);
                var obj = {};
                obj['id'] = nodeId;
                obj['rowId'] = 'row_' + nodeId;
                obj['isController'] = controllerNodeId == nodeId;
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['type'] = type;
                obj['hasPowerLevel'] = hasPowerLevel;
                obj['icon'] = $filter('getDeviceTypeIcon')(type);
                obj['isFailed'] = node.data.isFailed.value;
                obj['neighbours'] = node.data.neighbours.value;
                obj['updateTime'] = lastCommunication;
                obj['dateTime'] = $filter('getDateTimeObj')(lastCommunication);
                obj['isUpdated'] = isUpdated;
                obj['cmdNop'] = 'devices[' + nodeId + '].SendNoOperation()';
                var findIndex = _.findIndex($scope.linkStatus.all, {rowId: obj.rowId});
                if (findIndex > -1) {
                    angular.extend($scope.linkStatus.all[findIndex], obj);

                } else {
                    $scope.linkStatus.all.push(obj);
                }
            });
        });
    }

    /**
     * Set table cell state
     * @param {object} nodes
     * @returns {Array}
     */
    function setCells(nodes) {
        //console.log(nodes)
        angular.forEach(nodes, function (node, i) {
            //console.log(node.id,node.neighbours)
            $scope.htmlNeighbors[node.id] = '';
            $scope.testLink[node.id] = [];
            var powerLevel = node.hasPowerLevel ? node.hasPowerLevel.data : [];
            //console.log(node.hasPowerLevel)
            angular.forEach(nodes, function (v, k) {
                var tooltip = node.id + ': ' + node.name + ' - ' + v.id + ': ' + v.name + ' ';
                //var cssClass = node.hasPowerLevel ? 'rtUnavailable' : 'rtWhite';
                var cssClass = 'rtWhite';

                if(node.hasPowerLevel){ // Cols for powerLevel
                    var nodePowerLevel = powerLevel[v.id];
                    //console.log(node.neighbours.indexOf(parseInt(v.id)))
                    if(node.neighbours.indexOf(parseInt(v.id)) > -1){
                        cssClass = 'rtUnavailable';
                        //console.log(node.id + ' | '+ v.id+' In neighbours',node.neighbours)
                    }/*else{
                        console.log(node.id + ' | '+ v.id+' NOT in neighbours',node.neighbours)
                    }*/
                   // cssClass = (node.neighbours.indexOf(parseInt(v.id)) === -1 ? 'rtOrange' : 'rtUnavailable');

                    if(nodePowerLevel){
                        $scope.testLink[node.id].push(v.id);
                        //console.log(node.id + ' | ' + v.id + ': ',powerLevel[v.id])
                        if (nodePowerLevel.acknowledgedFrames.value > -1 && nodePowerLevel.acknowledgedFrames.value < 6) {
                            cssClass = 'rtRed';
                        } else if (nodePowerLevel.acknowledgedFrames.value > 5 && nodePowerLevel.acknowledgedFrames.value < 18) {
                            cssClass = 'rtOrange';
                        } else if (nodePowerLevel.acknowledgedFrames.value > 17) {
                            cssClass = 'rtGreen';
                        }
                    }
                }else{// Without powelLevel
                    if(v.isController){
                        //console.log(node.id +' : ' + v.id,v.isFailed)
                        cssClass = node.isFailed ? 'rtUnavailable' : 'rtGreen';
                    }

                }
                if(node.id === v.id ){
                    cssClass = 'rtWhite';
                }
                var out = '<span class="rt-cell ' + cssClass + '" title="' + tooltip + '">' +  '&nbsp' + '</span>';
                $scope.htmlNeighbors[node.id] += out;
            });
        });
    }
});
/**
 * Application ControllerInfo controller
 * @author Martin Vach
 */
appController.controller('ControllerController', function($scope, $window, $filter, $interval,$timeout,cfg,dataService,deviceService) {
    $scope.funcList;
    $scope.ZWaveAPIData;
    $scope.builtInfo = '';
    $scope.info = {};
    $scope.master = {};
    $scope.runQueue = false;
    $scope.controllerInfo = {
        interval: null
    }

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.controllerInfo.interval);
    });
    /**
     * Load app built info
     */
    $scope.loadAppBuiltInfo = function() {
        dataService.getAppBuiltInfo().then(function(response) {
            $scope.builtInfo = response.data;
        }, function(error) {});
    };
    $scope.loadAppBuiltInfo();

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            $scope.refreshZwaveData();
        }, function(error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                setData(response.data.joined);
            }, function(error) {});
        };
        $scope.controllerInfo.interval = $interval(refresh, $scope.cfg.interval);
    };
    
     /**
     *
     * Set debug mode
     */
    $scope.setDebugMode = function(status,spin) {
        var input = {
            debug: status
        };
        $scope.toggleRowSpinner(spin);
        dataService.postApi('configupdate_url', input).then(function (response) {
             $timeout($scope.toggleRowSpinner, 1000);
            $scope.loadZwaveConfig(true);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data'));
            return;
        });
    };

    /// --- Private functions --- ///
    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        var nodeLimit = function(str) {
            return str === 'ff' ? $scope._t('unlimited') : str;
        };
        var caps = function(arr) {
            var cap = '';
            if (angular.isArray(arr)) {
                cap += (arr[3] & 0x01 ? 'S' : 's');
                cap += (arr[3] & 0x02 ? 'L' : 'l');
                cap += (arr[3] & 0x04 ? 'M' : 'm');
            }
            return cap;

        };
        $scope.ZWaveAPIData = ZWaveAPIData;
        $scope.master['controller.data.nodeId'] = ZWaveAPIData.controller.data.nodeId.value;
        $scope.master['controller.data.homeId'] = ZWaveAPIData.controller.data.homeId.value;
        $scope.master['controller.data.isPrimary'] = ZWaveAPIData.controller.data.isPrimary.value;
        $scope.master['controller.data.isRealPrimary'] = ZWaveAPIData.controller.data.isRealPrimary.value;
        $scope.master['controller.data.SUCNodeId'] = ZWaveAPIData.controller.data.SUCNodeId.value;
        $scope.master['controller.data.SISPresent'] = ZWaveAPIData.controller.data.SISPresent.value;
        $scope.master['controller.data.vendor'] = ZWaveAPIData.controller.data.vendor.value;
        $scope.master['controller.data.manufacturerProductType'] = ZWaveAPIData.controller.data.manufacturerProductType.value;
        $scope.master['controller.data.manufacturerProductId'] = ZWaveAPIData.controller.data.manufacturerProductId.value;
        $scope.master['controller.data.manufacturerId'] = ZWaveAPIData.controller.data.manufacturerId.value;
        $scope.master['controller.data.ZWaveChip'] = ZWaveAPIData.controller.data.ZWaveChip.value;
        $scope.master['controller.data.libType'] = ZWaveAPIData.controller.data.libType.value;
        $scope.master['controller.data.SDK'] = ZWaveAPIData.controller.data.SDK.value;
        $scope.master['controller.data.APIVersion'] = ZWaveAPIData.controller.data.APIVersion.value;
        $scope.master['controller.data.uuid'] = ZWaveAPIData.controller.data.uuid.value;
        if (ZWaveAPIData.controller.data.caps.value) {
            $scope.master['controller.data.caps.subvendor'] = '0x' + dec2hex((ZWaveAPIData.controller.data.caps.value[0] << 8) + ZWaveAPIData.controller.data.caps.value[1]);
            $scope.master['controller.data.caps.nodes'] = nodeLimit(dec2hex(ZWaveAPIData.controller.data.caps.value[2]).slice(-2));
            $scope.master['controller.data.caps.cap'] = caps(ZWaveAPIData.controller.data.caps.value);
        } else {
            $scope.master['controller.data.caps.subvendor'] = '';
            $scope.master['controller.data.caps.nodes'] = '';
            $scope.master['controller.data.caps.cap'] = '';
        }
        $scope.master['controller.data.softwareRevisionVersion'] = ZWaveAPIData.controller.data.softwareRevisionVersion.value;
        $scope.master['controller.data.softwareRevisionId'] = ZWaveAPIData.controller.data.softwareRevisionId.value;
        $scope.master['controller.data.softwareRevisionDate'] = ZWaveAPIData.controller.data.softwareRevisionDate.value;
        $scope.master['controller.data.softwareRevisionDate'] = ZWaveAPIData.controller.data.softwareRevisionDate.value;
        $scope.master['controller.data.frequency'] = ZWaveAPIData.controller.data.frequency.value;
        // Texts
        $scope.master['txtHomeId'] = '';
        $scope.master['txtSucSis'] = '';
        setText($scope.master);

        // Function list
        var funcList = '';
        var _fc = array_unique(ZWaveAPIData.controller.data.capabilities.value.concat(ZWaveAPIData.controller.data.functionClasses.value));
        _fc.sort(function(a, b) {
            return a - b
        });

        angular.forEach(_fc, function(func, index) {
            var fcIndex = ZWaveAPIData.controller.data.functionClasses.value.indexOf(func);
            var capIndex = ZWaveAPIData.controller.data.capabilities.value.indexOf(func);
            var fcName = (fcIndex != -1) ? ZWaveAPIData.controller.data.functionClassesNames.value[fcIndex] : 'Not implemented';
            funcList += '<span style="color: ' + ((capIndex != -1) ? ((fcIndex != -1) ? '' : 'gray') : 'red') + '">' + fcName + ' (0x' + ('00' + func.toString(16)).slice(-2) + ')</span>  &#8226; ';
        });
        $scope.funcList = funcList;

    }
    function dec2hex(i)
    {
        //return  ("0"+(Number(i).toString(16))).slice(-2).toUpperCase()
        var result = "0000";
        if (i >= 0 && i <= 15) {
            result = "000" + i.toString(16);
        }
        else if (i >= 16 && i <= 255) {
            result = "00" + i.toString(16);
        }
        else if (i >= 256 && i <= 4095) {
            result = "0" + i.toString(16);
        }
        else if (i >= 4096 && i <= 65535) {
            result = i.toString(16);
        }
        return result;
    }
    // Get Queue updates
    function setText(master) {
        angular.forEach(master, function(v, k) {
            var src = {};
            switch (k) {
                case 'controller.data.SUCNodeId':
                    src['txtSucSis'] = (v != 0) ? (v.toString() + ' (' + (master['controller.data.SISPresent'] ? 'SIS' : 'SUC') + ')') : $scope._t('nm_suc_not_present');
                    angular.extend($scope.master, src);
                    break;
                case 'controller.data.homeId':
                    src['txtHomeId'] = '0x' + ('00000000' + (v + (v < 0 ? 0x100000000 : 0)).toString(16)).slice(-8);
                    ;
                    angular.extend($scope.master, src);
                    break;

                default:
                    break;
            }

        });
        return;

    }
});
/**
 * QueueController
 * @author Martin Vach
 */
appController.controller('QueueController', function($scope, $interval,cfg,dataService) {
    $scope.queueData = {
        all: [],
        interval: null,
        show: false,
        length: 0
    };

    /**
     * Load Queue
     */
    $scope.loadQueueData = function() {
        // Load queue
        dataService.getApi('queue_url', null, true).then(function (response) {
            setData(response.data);
            //getQueueUpdate(response.data);
            $scope.refreshQueueData()
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
            return;
        });
    };
    $scope.loadQueueData();

    /**
     * Refresh Queue data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshQueueData = function() {
        var refresh = function() {
            dataService.getApi('queue_url', null, true).then(function (response) {
                setData(response.data);
                //getQueueUpdate(response.data);
            });
        };
        $scope.queueData.interval = $interval(refresh, $scope.cfg.queue_interval);
    };
    /**
     * todo: deprecated
     * Inspect Queue
     */
    /*$scope.inspectQueue = function() {
        // Load queue
        dataService.getQueueData(function(data) {
            getQueueUpdate(data);
        });
        // Refresh queue
        dataService.updateQueueData(function(data) {
            getQueueUpdate(data);
        });
        return;
    };*/

   //$scope.inspectQueue();

    /// --- Private functions --- ///

    /**
     * Set queue data
     * @param {object} data
     */
    function setData(data) {
        var dataLength = _.size(data);
        $scope.queueData.length = dataLength;
        if(dataLength < 1){
            // Set warning  queue is empty
            $scope.alert = {message: $scope._t('inspect_queue_empty'), status: 'text-warning', icon: 'fa-exclamation-circle'};
            // Remove queue is empty
        }else{
            $scope.alert = {message: false, status: 'is-hidden', icon: false};
        }
        // Reset queue object
        $scope.queueData.all = [];
        angular.forEach(data, function(job, jobIndex) {
            var buff = '';
            for (var b in job[5]) {
                buff += job[5][b].toString(16) + ' ';
            }
            ;
            var progress;
            if (job[4] === null) {
                progress = '';
            } else if (typeof (job[4]) == 'string') {
                progress = job[4].replace(/\n/g, '<br/>')
            } else {
                job[4].join('<br />');
            }

            var obj = {
                n: job[1][0],
                U: (job[1][11] ? "U" : " "),
                W: (job[1][1] ? "W" : " "),
                S: (job[1][2] ? "S" : " "),
                E: (job[1][3] ? "E" : " "),
                D: (job[1][4] ? "D" : " "),
                Ack: (job[1][5] ? (job[1][6] ? "+" : "-") : " "),
                Resp: (job[1][7] ? (job[1][8] ? "+" : "-") : " "),
                Cbk: (job[1][9] ? (job[1][10] ? "+" : "-") : " "),
                Timeout:  parseFloat(job[0]).toFixed(2),
                NodeId:  job[2],
                Description:  job[3],
                Progress:  progress,
                Buffer:  buff
            };
            $scope.queueData.all.push(obj);
        });
    }
    ;


    // todo: deprecated
    // Get Queue updates
    /*function getQueueUpdate(data) {
        var trs = '';
        angular.forEach(data, function(job, jobIndex) {
            var buff = '';
            for (var b in job[5]) {
                buff += job[5][b].toString(16) + ' ';
            }
            ;
            var progress;
            if (job[4] === null) {
                progress = '';
            } else if (typeof (job[4]) == 'string') {
                progress = job[4].replace(/\n/g, '<br/>')
            } else {
                job[4].join('<br />');
            }

            trs +=
                    '<tr>' +
                    '<td>' + job[1][0] + '</td>' +
                    '<td>' + (job[1][11] ? "U" : " ") + '</td>' +
                    '<td>' + (job[1][1] ? "W" : " ") + '</td>' +
                    '<td>' + (job[1][2] ? "S" : " ") + '</td>' +
                    '<td>' + (job[1][3] ? "E" : " ") + '</td>' +
                    '<td>' + (job[1][4] ? "D" : " ") + '</td>' +
                    '<td>' + (job[1][5] ? (job[1][6] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + (job[1][7] ? (job[1][8] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + (job[1][9] ? (job[1][10] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + parseFloat(job[0]).toFixed(2) + '</td>' +
                    '<td>' + job[2] + '</td>' +
                    '<td class="alignleft">' + job[3] + '</td>' +
                    '<td class="alignleft">' + progress + '</td>' +
                    '<td class="alignleft">' + buff + '</td>' +
                    '</tr>\n';
        });
        if (trs == '') {
            trs = '<tr><td colspan="12"><i>' + $scope._t('inspect_queue_empty') + '</i></td></tr>';
        }
        $('#inspect_queue_len').html($scope._t('txt_queue_length') + ': ' + data.length);
        $('#inspect_queue_table_body').html(trs);
        return trs;
    }
    ;*/
});
/**
 * InterviewCommandController
 * @author Martin Vach
 */
appController.controller('InterviewCommandController', function($scope, $filter, deviceService) {
    // Show modal dialog
    $scope.showModal = function(target, interviewCommands, ccId, type) {
        var interviewData = {};
        var updateTime;
        $(target).modal();
        if (type) {
            angular.forEach(interviewCommands, function(v, k) {
                if (v.ccId == ccId) {
                    interviewData = v[type];
                    updateTime = v.updateTime;
                    return;
                }
            });
        } else {
            interviewData = interviewCommands;
        }
// DEPRECATED
        // Formated output
//        var getCmdData = function(data, name, space) {
//            if (name == undefined) {
//                return '';
//            }
//            var html = '<div class="cc-data-element">' + space + name + ': <span class="' + ((data.updateTime > data.invalidateTime) ? 'green' : 'red') + '">' + ((typeof (data.value) !== 'undefined' && data.value != null) ? data.value.toString() : 'None') + '</span>' + ' (<span class="' + ((data.updateTime > data.invalidateTime) ? '' : 'red') + '">' + $filter('isTodayFromUnix')(data.updateTime) + '</span>)</div>';
//            angular.forEach(data, function(el, key) {
//
//                if (key != 'type' && key != 'updateTime' && key != 'invalidateTime' && key != 'value' && // these are internal values
//                        key != 'capabilitiesNames') { // these make the dialog monstrious
//                    html += getCmdData(el, key, space + '&nbsp;&nbsp;&nbsp;&nbsp;');
//                }
//            });
//            return html;
//        };
        // Get data
        //var html = getCmdData(interviewData, '/', '');
        var html = deviceService.configGetCommandClass(interviewData, '/', '');
        /*if(updateTime){
         html += '<p class="help-block"><em>' + $filter('dateFromUnix')(updateTime )+ '<em></p>';
         }*/


        // Fill modal with data
        $(target).on('shown.bs.modal', function() {
            $(target + ' .modal-body').html(html);
        });
    };
});
/**
 * LicenseController
 * @author Martin Vach
 */
appController.controller('LicenseController', function($scope, $timeout, dataService) {
    $scope.proccessVerify = {
        'message': false,
        'status': 'is-hidden'

    };
    $scope.controllerUuid = null;
     $scope.controllerIsZeroUuid = false;
    $scope.proccessUpdate = {
        'message': false,
        'status': 'is-hidden'

    };
    $scope.formData = {
        "scratch_id": null
    };
    $scope.license = {
        "scratch_id": null,
        "capability": null,
        "uid": null,
        "license_id": null,
        "base_license": null,
        "reseller_id": null,
        "revoke": null,
        "selldate": null,
        "usedate": null
    };
    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            $scope.controllerUuid = ZWaveAPIData.controller.data.uuid.value;
            $scope.controllerIsZeroUuid = parseInt("0x" + ZWaveAPIData.controller.data.uuid.value, 16) === 0;

        });
    };
    $scope.loadZwaveData();
    /**
     * Get license key
     */
    $scope.getLicense = function(formData) {
        // Clear messages
        $scope.proccessVerify.message = false;
        $scope.proccessUpdate.message = false;
        if (!formData.scratch_id) {
            return;
        }
        $scope.proccessVerify = {'message': $scope._t('verifying_licence_key'), 'status': 'fa fa-spinner fa-spin'};
        var input = {
            'uuid': $scope.controllerUuid,
            'scratch': formData.scratch_id
        };
        dataService.getLicense(input).then(function(response) {
            $scope.proccessVerify = {'message': $scope._t('success_licence_key'), 'status': 'fa fa-check text-success'};
            console.log('1. ---------- SUCCESS Verification ----------', response);

            // Update capabilities
            updateCapabilities(response);

        }, function(error) {// Error verifying key
            //debugger;
            var message = $scope._t('error_no_licence_key');
            if (error.status == 404) {
                var message = $scope._t('error_404_licence_key');
            }
            $scope.proccessVerify = {'message': message, 'status': 'fa fa-exclamation-triangle text-danger'};
            console.log('1. ---------- ERROR Verification ----------', error);

        });
        return;
    };


    /// --- Private functions --- ///

    /**
     * Update capabilities
     */
    function updateCapabilities(data) {
        $scope.proccessUpdate = {'message': $scope._t('upgrading_capabilities'), 'status': 'fa fa-spinner fa-spin'};
        dataService.zmeCapabilities(data).then(function(response) {
            $scope.proccessUpdate = {'message': $scope._t('success_capabilities'), 'status': 'fa fa-check text-success'};
            console.log('2. ---------- SUCCESS updateCapabilities ----------', response);
            //proccessCapabilities(response);
        }, function(error) {
            $scope.proccessUpdate = {'message': $scope._t('error_no_capabilities'), 'status': 'fa fa-exclamation-triangle text-danger'};
            console.log('2. ---------- ERROR updateCapabilities ----------', error);
        });
    };
});
/**
 * UzbController
 * @author Martin Vach
 */
appController.controller('UzbController', function ($scope, $timeout, $window, cfg, dataService, deviceService) {
    $scope.uzbUpgrade = [];
    $scope.uzbFromUrl = [];
    $scope.alert = {message: false, status: 'is-hidden', icon: false};
    /**
     * Load data
     *
     */
    $scope.loadZwaveData = function () {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            var vendorId = parseInt(ZWaveAPIData.controller.data.manufacturerId.value, 10);
            //0x0115 = 277, 0x0147 = 327
            var allowedVendors = [277, 327];
            if (allowedVendors.indexOf(vendorId) === -1) {
                $scope.alert = {
                    message: $scope._t('noavailable_firmware_update'),
                    status: 'alert-info',
                    icon: 'fa-info-circle'
                };
                return;
            }
            var appVersion = ZWaveAPIData.controller.data.APIVersion.value.split('.');
            var appVersionMajor = parseInt(appVersion[0], 10);
            var appVersionMinor = parseInt(appVersion[1], 10);
            var urlParams = '?vendorId=' + vendorId + '&appVersionMajor=' + appVersionMajor + '&appVersionMinor=' + appVersionMinor;
            //return;
            // Load uzb
            loadUzb(urlParams);
        });
    };
    $scope.loadZwaveData();

    // Upgrade bootloader/firmware
    $scope.upgrade = function (action, url) {
        $scope.toggleRowSpinner(action);
        var cmd = $scope.cfg.server_url + cfg[action];
        var data = {
            url: url
        };
        $scope.alert = {
            message: $scope._t('upgrade_bootloader_proccess'),
            status: 'alert-warning',
            icon: 'fa-spinner fa-spin'
        };
        dataService.updateUzb(cmd, data).then(function (response) {
            deviceService.showNotifier({message: $scope._t('reloading')});
            $scope.alert = false;
            $timeout(function () {
                $scope.toggleRowSpinner();
                $window.location.reload();
            }, 2000);
        }, function (error) {
            $scope.alert = false;
            $timeout($scope.toggleRowSpinner, 1000);
            alertify.alertError($scope._t('error_update_data') + '\n' + cmd);

        });
    };

    /**
     * Upload a firmware/bootloader file
     * @param {object} files
     * @returns {undefined}
     */
    $scope.uploadFile = function (action, files) {
        // Form data init
        var fd = new FormData();
        if (!fd) {
            return;
        }
        $scope.toggleRowSpinner(action);
        var cmd = $scope.cfg.server_url + cfg[action];

        fd.append('file', files[0]);

        $scope.alert = {
            message: $scope._t('upgrade_bootloader_proccess'),
            status: 'alert-warning',
            icon: 'fa-spinner fa-spin'
        };
        dataService.uploadApiFile(cmd, fd).then(function (response) {
            deviceService.showNotifier({message: $scope._t('reloading')});
            $scope.alert = false;
            $timeout(function () {
                $scope.toggleRowSpinner();
                $window.location.reload();
            }, 2000);
        }, function (error) {
            $scope.alert = false;
            $timeout($scope.toggleRowSpinner, 1000);
            alertify.alertError($scope._t('error_update_data') + '\n' + cmd);
        });
    };

    /// --- Private functions --- ///

    /**
     * Load uzb data
     */
    function loadUzb(urlParams) {
        //$scope.alert = {message: $scope._t('loading_data_remote'), status: 'alert-warning', icon: 'fa-spinner fa-spin'};
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin'};
        dataService.getUzb(urlParams).then(function (response) {
            if (response.length > 0) {
                $scope.uzbUpgrade = response;

            }else{
                $scope.alert = {
                    message: $scope._t('noavailable_firmware_update'),
                    status: 'alert-info',
                    icon: 'fa-info-circle'
                };
            }
            $scope.loading = false;
        }, function (error) {
            $scope.loading = false;
            alertify.alertError($scope._t('error_handling_data_remote'));
        });
    }
    ;

});


/**
 * ZnifferController
 * @author Martin Vach
 */
appController.controller('ZnifferController', function ($scope, $interval, $timeout, $cookies, $location, $http, cfg, dataService, deviceService, myCache, _) {
    $scope.zniffer = {
        run: true,
        spin: true,
        updateTime: Math.round(+new Date() / 1000),
        trace: 'stop',
        interval: null,
        all: []

    };
    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.zniffer.interval);
    });

    /**
     * Load cached zniffer
     * @returns {undefined}
     */
    $scope.loadCachedZniffer = function () {
        if (myCache.get('zniffer_inout')) {
            $scope.zniffer.all = myCache.get('zniffer_inout');
        }

    };
    $scope.loadCachedZniffer();

    /**
     * Run Zniffer
     * @returns {undefined}
     */
    $scope.runZniffer = function (updateTime) {
        var refresh = function () {
            if($scope.zniffer.trace === 'stop'){
                angular.copy([], $scope.zniffer.all);
                return;
            }
            $scope.zniffer.spin = true;
            if ($http.pendingRequests.length > 0) {
                return;
            }
            //var time = 1472729277;//(updateTime ? '/' + updateTime : '');
            var time = updateTime;//(updateTime ? '/' + updateTime : '');
            //dataService.getApi('communication_history_url', '/' + time, true).then(function (response) {
            dataService.getApi('zniffer_url',null,true).then(function (response) {
                var znifferData = deviceService.setZnifferData(response.data.data);
                $scope.zniffer.updateTime = response.data.updateTime;
                _.filter(znifferData.value(), function (v) {
                    //var exist = _.findWhere($scope.zniffer.all, {updateTime: v.updateTime, bytes: v.bytes});
                    var exist = _.findWhere($scope.zniffer.all, {id: v.id, bytes: v.bytes});
                    if (!exist) {
                        $scope.zniffer.all.push(v);
                    }
                    ;
                });
                myCache.put('zniffer_inout', $scope.zniffer.all);
                $scope.zniffer.spin = false;
                $scope.zniffer.run = true;
            }, function (error) {
                $scope.zniffer.spin = false;
                $scope.zniffer.run = false;
                $interval.cancel($scope.zniffer.interval);
            });
        };
        if ($scope.zniffer.run && $scope.zniffer.trace === 'start') {
            $scope.zniffer.interval = $interval(refresh, cfg.zniffer_interval);
        }
    };
    $scope.runZniffer($scope.zniffer.updateTime);

    /**
     * Set trace
     */
    $scope.setTrace = function (trace) {
        switch (trace) {
            case 'pause':
                 $scope.zniffer.spin = false;
                $scope.zniffer.trace = 'pause';
                $interval.cancel($scope.zniffer.interval);
                break;
            case 'stop':
                 $scope.zniffer.spin = false;
                $scope.zniffer.trace = 'stop';
                angular.copy([], $scope.zniffer.all);
                 //$scope.runZniffer($scope.zniffer.updateTime);
                $interval.cancel($scope.zniffer.interval);
                myCache.remove('zniffer_inout');
                //angular.copy([], $scope.zniffer.all);
                $timeout(function(){angular.copy([], $scope.zniffer.all);}, 3000);
                break;
            default:
                 $scope.zniffer.spin = true;
                $scope.zniffer.trace = 'start';
                $scope.runZniffer($scope.zniffer.updateTime);
                break;

        }
        //console.log('Set trace: ',  $scope.zniffer.trace)
    };

});

/**
 * ZnifferHistoryController
 * @author Martin Vach
 */
appController.controller('ZnifferHistoryController', function ($scope, $interval, $filter, $cookies, $location, cfg, dataService, deviceService, paginationService, _) {
    $scope.zniffer = {
        all: [],
        filter: {
            model: {
                src: {
                    value: '',
                    show: '1'
                },
                dest: {
                    value: '',
                    show: '1'
                },
                data: {
                    value: '',
                    show: '1'
                }
            },
            items: {
                data: ['Singlecast', 'Predicast', 'Multicast']
            },
            used: []
        }

    };
    $scope.currentPage = 1;
    $scope.pageSize = cfg.page_results_history;
    /**
     * Cancel interval on page destroy
     */
    //$scope.$on('$destroy', function () {
    //});
    
    /**
     * Load cached zniffer filter
     * @returns {undefined}
     */
    $scope.loadCachedZnifferFilter = function () {
        if ($cookies.znifferFilter) {
            angular.extend($scope.zniffer.filter.model, angular.fromJson($cookies.znifferFilter));
        }

    };
    $scope.loadCachedZnifferFilter();

    /**
     * Detect zniffer filter
     * @returns {undefined}
     */
    $scope.detectZnifferFilter = function () {
        angular.forEach($scope.zniffer.filter.model, function (v, k) {
            var index = $scope.zniffer.filter.used.indexOf(k);
            if (v['value'] !== '' && index === -1) {
                $scope.zniffer.filter.used.push(k);
            }
        });
    };
    $scope.detectZnifferFilter();

    /**
     * Load communication history
     * @returns {undefined}
     */
    $scope.loadCommunicationHistory = function () {
        var filter = '?filter=' + JSON.stringify($scope.zniffer.filter.model);
        dataService.getApi('communication_history_url', filter, true).then(function (response) {
            $scope.zniffer.all = deviceService.setZnifferData(response.data.data).value();
            //$scope.zniffer.all = zniffer.value();
            $scope.zniffer.run = true;
        }, function (error) {
            alertify.alertError($scope._t('error_load_data') + ': ' + cfg.communication_history_url);
        });
    };
    $scope.loadCommunicationHistory();
    /**
     * Reset Communication History
     * @returns {undefined}
     */
    $scope.resetCommunicationHistory = function () {
        $scope.zniffer.all = [];
        $scope.loadCommunicationHistory();
    };
    /**
     * Set zniffer filter
     * @returns {undefined}
     */
    $scope.setZnifferFilter = function (key) {
        //$cookies.znifferFilter =  JSON.stringify($scope.zniffer.filter.model);
        if (!$scope.zniffer.filter.model[key].value) {
            return false;
        }
        $cookies.znifferFilter = angular.toJson($scope.zniffer.filter.model);
        if (!_.contains($scope.zniffer.filter.used, key)) {
            $scope.zniffer.filter.used.push(key);
        }
        $scope.resetCommunicationHistory();
    };
    /**
     * Reset zniffer filter
     * @returns {undefined}
     */
    $scope.resetZnifferFilter = function (key) {
        $scope.zniffer.filter.model[key].value = '';
        $scope.zniffer.filter.model[key].show = '1';
        $scope.zniffer.filter.used = _.without($scope.zniffer.filter.used, key);
        delete $cookies['znifferFilter'];
        //$cookies.znifferFilter = angular.toJson($scope.zniffer.filter.model);
        $scope.resetCommunicationHistory();
    };
    /**
     * Reset all zniffer filters
     * @returns {undefined}
     */
    $scope.resetZnifferFilterAll = function () {
        angular.forEach($scope.zniffer.filter.model, function (v, k) {
            $scope.zniffer.filter.model[k].value = '';
            $scope.zniffer.filter.model[k].show = '1';
        });

        $scope.zniffer.filter.used = [];
        delete $cookies['znifferFilter'];
        //$cookies.znifferFilter = angular.toJson($scope.zniffer.filter.model);
        $scope.resetCommunicationHistory();
    };
    
    // Watch for pagination change
    $scope.$watch('currentPage', function (page) {
        paginationService.setCurrentPage(page);
    });

    $scope.setCurrentPage = function (val) {
        $scope.currentPage = val;
    };

});

/**
 * The controller that handles Zniffer Rssi Background.
 * @class ZnifferRSSIController
 * @author Niels Roche
 */
appController.controller('ZnifferRSSIController', function ($scope, $interval, $filter, cfg, dataService, myCache, _) {
    var cOptions = {
        title:{
            text: ""
        },
        axisX:{
            title: "Time",
            tickColor: "black",
            tickLength: 5,
            tickThickness: 2,
            valueFormatString: "HH:mm"
        },
        axisY:{
            title: "RSSI (dBm)",
            tickColor: "black",
            tickLength: 5,
            tickThickness: 2,
            includeZero: false
        },
        data: [
            {
                type: "line",
                xValueType: "dateTime",
                xValueFormatString: "HH:mm:ss",
                connectNullData: true,
                nullDataLineDashType: "solid",
                dataPoints: [],
            }
        ],
        zoomEnabled:true
    };

    $scope.rssi = {
        chartOptions1: cOptions,
        chartOptions2: cOptions,
        chartData1: [],
        chartData2: [],
        interval: null
    }

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.rssi.interval);
    });

    $scope.loadingRSSIData = function(handleError) {
        dataService.getApi('rssi_chart','', true).then(function (response) {
            var rssiData = typeof response === 'string'? JSON.parse(response) : response;
            var tInterval = (new Date()).getTime() - 86400000; //86400000 - 24h
            var chartData1 = [];
            var chartData2 = [];

            rssiData.data.data.forEach(function (entry){
                var timestamp = new Date(entry.time * 1000);

                if (timestamp) {

                    if ((entry.time * 1000) > tInterval) {

                        if (typeof parseInt(entry.channel1) === 'number') {
                            chartData1.push({x: timestamp, y: !!entry.channel1? parseInt(entry.channel1) : entry.channel1});
                        }

                        if (typeof parseInt(entry.channel2) === 'number') {
                            chartData2.push({x: timestamp, y: !!entry.channel2? parseInt(entry.channel2) : entry.channel2});
                        }
                    }
                }
            });

            $scope.rssi.chartData1 = chartData1;
            $scope.rssi.chartData2 = chartData2;

            if (!$scope.rssi['chart1']) {
                $scope.createChart('chart1',$scope.rssi.chartOptions1,$scope.rssi.chartData1, 'Channel 1');
            }

            if (!$scope.rssi['chart2']) {
                $scope.createChart('chart2',$scope.rssi.chartOptions2,$scope.rssi.chartData2, 'Channel 2');
            }


        }, function (error) {
            var message = $scope._t('error_load_data') + ': ' + cfg.rssi_chart;
            if(handleError){
                alertify.dismissAll();
                alertify.alertError(message);
            }

        });
    };
    $scope.loadingRSSIData(true);

    $scope.createChart = function (elementID,chartOptions,chartData, chartTitle) {
        chartOptions.title.text = chartTitle;
        chartOptions.data[0].dataPoints = chartData;

        $scope.rssi[elementID] = new CanvasJS.Chart(elementID,chartOptions);
        $scope.rssi[elementID].render();
    };

    $scope.updateChart = function(elementID, chartData, chartTitle){
        var length = chartData.length;
        if(length > 0) {
            $scope.rssi[elementID].options.title.text = chartTitle;
            $scope.rssi[elementID].options.data[0].dataPoints = chartData;
            $scope.rssi[elementID].render();
        }
    };

    $scope.initRefresh = function() {
        var refresh = function () {
            $scope.loadingRSSIData();

            $scope.updateChart('chart1', $scope.rssi.chartData1,'Channel 1');
            $scope.updateChart('chart2', $scope.rssi.chartData2,'Channel 2');
        }

        $scope.rssi.interval = $interval(refresh, 30000);
    };
    $scope.initRefresh();
});

/**
 * The controller that handles Zniffer Rssi Background Meter.
 * @class ZnifferRSSIMeterController
 * @author Michael Hensche
 */
appController.controller('ZnifferRSSIMeterController', function ($scope, $interval, $filter, cfg, dataService, myCache, _) {

    var cOptions = {
        id: "",
        value: 0,
        min: -120,
        max: 0,
        title: "",
        label: "RSSI (dBm)",
        pointer: true,
        customSectors: [{
            color: "#80AD80",
            lo: -120,
            hi: -75
        },{
            color: "#f0ad4e",
            lo: -75,
            hi: -45
        },{
            color: "#d9534f",
            lo: -45,
            hi: 0
        }]
    };

    $scope.rssi = {
        chartOptions1: cOptions,
        chartOptions2: cOptions,
        chartData1: 0,
        chartData2: 0,
        interval: null,
        intervaltime: 2000,
        trace: 'pause',
        run: true
    };

    $scope.loadingRSSIData = function(handleError) {

        dataService.getApi('rssi_chart','/realtime', true).then(function (response) {
            var rssiData = typeof response === 'string'? JSON.parse(response) : response,
                chartData1 = 0,
                chartData2 = 0;

            if (typeof parseInt(rssiData.data.data[0].channel1) === 'number') {
                chartData1 = _.isNull(rssiData.data.data[0].channel1)? $scope.rssi.chartData1 : parseInt(rssiData.data.data[0].channel1);
            }

            if (typeof parseInt(rssiData.data.data[0].channel2) === 'number') {
                chartData2 = _.isNull(rssiData.data.data[0].channel2) ? $scope.rssi.chartData2 : parseInt(rssiData.data.data[0].channel2);
            }

            $scope.rssi.chartData1 = chartData1;
            $scope.rssi.chartData2 = chartData2;

            if (!$scope.rssi['gauge1']) {
                $scope.createChart('gauge1',$scope.rssi.chartOptions1,$scope.rssi.chartData1, 'Channel 1');
            }

            if (!$scope.rssi['gauge2']) {
                $scope.createChart('gauge2',$scope.rssi.chartOptions2,$scope.rssi.chartData2, 'Channel 2');
            }
            $scope.rssi.run = true;

        }, function (error) {
            $scope.rssi.run = false;
            var message = $scope._t('error_load_data') + ': ' + cfg.rssi_chart;
            if(handleError){
                alertify.dismissAll();
                alertify.alertError(message);
            }
        });


    };
    $scope.loadingRSSIData(true);

    if ($scope.rssi.run && $scope.rssi.trace === 'start') {
        $scope.initRefresh();
    }

    $scope.createChart = function (elementID,chartOptions,chartData, chartTitle) {
        chartOptions.id = elementID;
        chartOptions.value = chartData;
        chartOptions.title = chartTitle;

        $scope.rssi[elementID] = new JustGage(chartOptions);
    };

    $scope.updateChart = function(elementID, chartData){

        $scope.rssi[elementID].refresh(chartData);

    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $scope.rssi["gauge1"] = [];
        $scope.rssi["gauge2"] = [];
        $interval.cancel($scope.rssi.interval);
    });


    $scope.initRefresh = function() {
        var refresh = function () {
            $scope.loadingRSSIData();

            $scope.updateChart('gauge1', $scope.rssi.chartData1);
            $scope.updateChart('gauge2', $scope.rssi.chartData2);
        }

        $scope.rssi.interval = $interval(refresh, $scope.rssi.intervaltime);
    };

    /**
     * Set trace
     */
    $scope.setTrace = function (trace) {
        switch (trace) {
            case 'pause':
                $scope.rssi.trace = 'pause';
                $interval.cancel($scope.rssi.interval);
                break;
            default:
                $scope.rssi.trace = 'start';
                $scope.initRefresh();
                break;
        }
    };

});

/**
 * SpectrumController
 * @author Martin Vach
 */
appController.controller('SpectrumController', function ($scope, $interval, $filter, cfg, dataService, myCache, _) {
    $scope.spectrum = {
        all: {}
    };

   
});
/**
 * NetworkMapController
 * @author Martin Vach
 */
appController.controller('NetworkMapController', function ($scope, $interval, $filter, cfg, dataService, myCache, _) {
    $scope.networkmap = {
        ctrlNodeId: 1,
        cytoscape: {
            container: document.getElementById('cy'),
            boxSelectionEnabled: false,
            autounselectify: true,
            style: cytoscape.stylesheet()
                    .selector('node')
                    .css({
                        'content': 'data(id)'
                    })
                    .selector('edge')
                    .css({
                        'target-arrow-shape': 'triangle',
                        'width': 4,
                        'line-color': '#ddd',
                        'target-arrow-color': '#ddd',
                        'curve-style': 'bezier'
                    })
                    .selector('.highlighted')
                    .css({
                        'background-color': '#61bffc',
                        'line-color': '#61bffc',
                        'target-arrow-color': '#61bffc',
                        'transition-property': 'background-color, line-color, target-arrow-color',
                        'transition-duration': '0.5s'
                    })
                    .selector('#1')
                    .css({
                        'background-color': '#2A6496'
                    }),
            elements: {
                nodes: [],
                edges: []
            },
            layout: {
//                 name: 'cose',
//            idealEdgeLength: 100,
//            nodeOverlap: 20,
            
                name: 'breadthfirst',
                directed: true,
                // roots: '#1',
                padding: 10
            }
        }
    };

    /**
     * Load zwave API
     */
    $scope.loadZwaveApi = function () {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.networkmap.cytoscape.elements = setCyElements(ZWaveAPIData);
            var cy = cytoscape($scope.networkmap.cytoscape);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
            return;
        });
    };
    $scope.loadZwaveApi();

    /// --- Private functions --- ///
    /**
     * Set cytoscape elements
     * @param {type} ZWaveAPIData
     * @returns {obj}
     */
    function setCyElements(ZWaveAPIData) {
        var edges = {};
        var obj = {
            nodes: [],
            edges: []
        };
        var ctrlNodeId = ZWaveAPIData.controller.data.nodeId.value;
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            var neighbours = $filter('hasNode')(node.data, 'neighbours.value');

            obj.nodes.push({data: {
                    id: nodeId,
                    name: 'Device_' + nodeId
                }});
            if (nodeId != ctrlNodeId && neighbours) {
                edges[nodeId] = neighbours;

            }

        });
        obj.edges = setCyEdges(edges);
        return obj;
    }
    /**
     * Set cytoscape edges
     * @param {type} edges
     * @returns {Array}
     */
    function setCyEdges(edges) {
        var obj = [];
        var cnt = 0;
        var blackList = [];
        angular.forEach(edges, function (node, nodeId) {
            angular.forEach(node, function (v, k) {
                blackList.push(v + nodeId);
                if (blackList.indexOf(nodeId + v) === -1) {
                    obj[cnt] ={data: {
                            id: nodeId + v,
                            source: nodeId,
                            target: v.toString()
                        }};
                      cnt++;
                }

            });

        });
        return obj;
    }
});
/**
 * Application Home controller
 * @author Martin Vach
 */

/**
 * Report controller
 */
// Home controller
appController.controller('HomeController', function ($scope, $filter, $timeout, $route, $interval, dataService, deviceService, cfg) {
    $scope.home = {
        show: false,
        interval: null,
        networkInformation: {
            mains: 0,
            battery: 0,
            flirs: 0,
            sum: 0
        }
    };
    $scope.ZWaveAPIData;
    $scope.countDevices;
    $scope.failedDevices = [];
    //$scope.batteryDevices;
    $scope.batteryWakeupDevices;
    $scope.lowBatteryDevices = [];
    //$scope.flirsDevices;
    //$scope.mainsDevices;
    $scope.localyResetDevices = [];
    $scope.notInterviewDevices = [];
    $scope.assocRemovedDevices = [];
    $scope.notConfigDevices = [];
    $scope.notes = [];
    $scope.notesData = '';
    //$scope.updateTime = $filter('getTimestamp');
    $scope.controller = {
        controllerState: 0,
        startLearnMode: false
    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.home.interval);
    });

    /*$scope.reset = function() {
     $scope.failedDevices = angular.copy([]);
     $scope.lowBatteryDevices = angular.copy([]);
     $scope.notInterviewDevices = angular.copy([]);
     $scope.localyResetDevices = angular.copy([]);
     $scope.assocRemovedDevices = angular.copy([]);
     $scope.notConfigDevices = angular.copy([]);

     };*/

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function () {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.home.show = true;
            var isRealPrimary = ZWaveAPIData.controller.data.isRealPrimary.value;
            var hasDevices = Object.keys(ZWaveAPIData.devices).length;
            $scope.ZWaveAPIData = ZWaveAPIData;
            notInterviewDevices(ZWaveAPIData);
            countDevices(ZWaveAPIData);
            assocRemovedDevices(ZWaveAPIData);
            notConfigDevices(ZWaveAPIData);
            batteryDevices(ZWaveAPIData);
            //$scope.mainsDevices = $scope.countDevices - ($scope.batteryDevices + $scope.flirsDevices);
            $scope.controller.controllerState = ZWaveAPIData.controller.data.controllerState.value;
            $scope.controller.startLearnMode = !isRealPrimary || hasDevices < 2 ? true : false;
            $scope.refreshZwaveData();
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    //$scope.loadZwaveData();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function () {
        var refresh = function () {
            dataService.loadJoinedZwaveData().then(function (response) {
                notInterviewDevices(response.data.joined);
                countDevices(response.data.joined);
                assocRemovedDevices(response.data.joined);
                //notConfigDevices(ZWaveAPIData);
                batteryDevices(response.data.joined);
                //$scope.mainsDevices = $scope.countDevices - ($scope.batteryDevices + $scope.flirsDevices);
                $scope.controller.controllerState = response.data.joined.controller.data.controllerState.value;
            }, function (error) {
            });
        };
        $scope.home.interval = $interval(refresh, $scope.cfg.interval);
    };
    if (!cfg.custom_ip) {
        //$scope.loadData();
        $scope.loadZwaveData();
    } else {
        if (cfg.server_url != '') {
            //$scope.loadData();
            $scope.loadZwaveData();
        }
    }


    /**
     * Set custom IP
     */
    $scope.setIP = function (ip) {
        if (!ip || ip == '') {
            $('.custom-ip-error').show();
            return;
        }
        $interval.cancel($scope.home.interval);
        $('.custom-ip-success,.custom-ip-true .home-page').hide();
        var setIp = 'http://' + ip + ':8083';
        cfg.server_url = setIp;
        $scope.loadHomeData = true;
        $route.reload();
    };

    // Run Zwave Command
    $scope.runZwaveCmdConfirm = function (cmd, confirm) {
        if (confirm) {
            alertify.confirm(confirm, function () {
                _runZwaveCmd(cmd);
            });
        } else {
            _runZwaveCmd(cmd);
        }
    };

    /**
     * Show modal window
     *
     * @returns {void}
     */
    $scope.showModal = function (target, id) {

        /*var obj = $filter('filter')($scope.devices, function(d) {
         return d.id == id;
         })[0];
         if (obj) {
         $scope.deviceInfo = {
         "id": obj.id,
         "name": obj.name
         };
         }*/
        $(target).modal();
        return;
    };

    /// --- Private functions --- ///

    /**
     * Run zwave cmd
     */
    function _runZwaveCmd(cmd) {
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {
        }, function (error) {
            alertify.alertError($scope._t('error_load_data') + '\n' + cmd);
        });
    }
    ;

    /**
     * Count devices
     */
    function countDevices(ZWaveAPIData) {
        var cnt = 0;
        var cntFlirs = 0;
        var networkInformation = {
            mains: 0,
            battery: 0,
            flirs: 0,
            sum: 0
        };
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {

            if (deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
           /* var isListening = node.data.isListening.value || node.data.isRouting.value;
            var isBattery =
            var isFLiRS = (node.data.sensor250.value || node.data.sensor1000.value);*/
            if((node.data.isListening.value && node.data.isRouting.value) || (node.data.isListening.value && !node.data.isRouting.value)){ // Count mains devices
                networkInformation.mains++;
            }else if(!node.data.isListening.value && (!node.data.sensor250.value && !node.data.sensor1000.value)){// Count battery devices
                networkInformation.battery++;
            }else if(node.data.sensor250.value || node.data.sensor1000.value){// Count flirs devices

                networkInformation.flirs++;
            }

            //var isFLiRS = !node.data.isListening.value && (node.data.sensor250.value || node.data.sensor1000.value);
            //var isListening = node.data.isListening.value && node.data.isRouting.value;
            //var hasWakeup = deviceService.hasCommandClass(node, 132);
            /*if(isFLiRS){ // Count flirs devices
                networkInformation.flirs++;
            }else if(isListening){// Count mains devices
                networkInformation.mains++;
            }else{// Count battery devices
                networkInformation.battery++;
            }*/
            networkInformation.sum++;
            var isLocalyReset = deviceService.isLocalyReset(node);
            var isFailed = deviceService.isFailed(node);

            var obj = {};
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['id'] = nodeId;
            // Create object with failed devices
            if (isFailed) {
                //$scope.failedDevices.push(obj);
                var findIndexF = _.findIndex($scope.failedDevices, {id: obj.id});
                if (findIndexF > -1) {
                    angular.extend($scope.failedDevices[findIndexF], obj);

                } else {
                    $scope.failedDevices.push(obj);
                }
            }
            // Create object with localy reset devices
            if (isLocalyReset) {
                //$scope.localyResetDevices.push(obj);
                var findIndexR = _.findIndex($scope.localyResetDevices, {id: obj.id});
                if (findIndexR > -1) {
                    angular.extend($scope.localyResetDevices[findIndexR], obj);

                } else {
                    $scope.localyResetDevices.push(obj);
                }
            }

            cnt++;
        });
        $scope.home.networkInformation = networkInformation;
        //$scope.flirsDevices = cntFlirs;
        //$scope.countDevices = cnt + cntFlirs;
    }
    ;

    /**
     * batteryDevices
     */
    function batteryDevices(ZWaveAPIData) {
        var controllerId = ZWaveAPIData.controller.data.nodeId.value;
        var batteryCnt = 0;
        var batteryWakeupCnt = 0;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            if (nodeId == 255 || nodeId == controllerId || node.data.isVirtual.value) {
                return;
            }
            var hasBattery = 0x80 in node.instances[0].commandClasses;
            var hasBatteryWakeup = 0x84 in node.instances[0].commandClasses;
            var instanceId = 0;
            var interviewDone = false;
            var ccId = 0x80;
            if (!hasBattery || !hasBatteryWakeup) {
                return;
            }
            // Is interview done
            for (var iId in ZWaveAPIData.devices[nodeId].instances) {
                for (var ccId in ZWaveAPIData.devices[nodeId].instances[iId].commandClasses) {
                    var isDone = ZWaveAPIData.devices[nodeId].instances[iId].commandClasses[ccId].data.interviewDone.value;
                    if (isDone != false) {
                        interviewDone = true;
                    }
                }
            }
            var node = ZWaveAPIData.devices[nodeId];
            var battery_charge = parseInt(node.instances[0].commandClasses[0x80].data.last.value);
            var obj = {};
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['id'] = nodeId;
            obj['battery_charge'] = battery_charge;
            if (battery_charge <= 20 && interviewDone) {
                //$scope.lowBatteryDevices.push(obj);
                var findIndex = _.findIndex($scope.lowBatteryDevices, {id: obj.id});
                if (findIndex > -1) {
                    angular.extend($scope.lowBatteryDevices[findIndex], obj);

                } else {
                    $scope.lowBatteryDevices.push(obj);
                }
            }
            if (hasBattery) {
                batteryCnt++;
            }
            if (hasBatteryWakeup) {
                batteryWakeupCnt++;
            }

        });
        //$scope.batteryDevices = batteryCnt;
        $scope.batteryWakeupDevices = batteryWakeupCnt;
    }
    ;

    /**
     * notInterviewDevices
     */
    function notInterviewDevices(ZWaveAPIData) {
        var controllerId = ZWaveAPIData.controller.data.nodeId.value;
        var cnt = 0;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            if (nodeId == 255 || nodeId == controllerId || node.data.isVirtual.value) {
                return;
            }
            var obj = {};
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['id'] = nodeId;
            for (var iId in ZWaveAPIData.devices[nodeId].instances) {
                for (var ccId in ZWaveAPIData.devices[nodeId].instances[iId].commandClasses) {
                    var isDone = ZWaveAPIData.devices[nodeId].instances[iId].commandClasses[ccId].data.interviewDone.value;
                    if (isDone == false) {
                        //$scope.notInterviewDevices.push(obj);
                        var findIndex = _.findIndex($scope.notInterviewDevices, {id: obj.id});
                        if (findIndex > -1) {
                            angular.extend($scope.notInterviewDevices[findIndex], obj);

                        } else {
                            $scope.notInterviewDevices.push(obj);
                        }
                        return;
                    }
                }
            }
            cnt++;
        });
        return cnt;
    }
    ;

    /**
     * notInterviewDevices
     */
    function notConfigDevices(ZWaveAPIData) {
        // Loop throught devices
        dataService.xmlToJson(cfg.server_url + '/config/Configuration.xml').then(function (response) {
            //dataService.getCfgXml(function(cfgXml) {
            angular.forEach(response.config.devices.deviceconfiguration, function (cfg, cfgId) {
                var node = ZWaveAPIData.devices[cfg['_id']];

                if (!node || !$filter('hasNode')(node, 'instances.0.commandClasses.112')) {
                    return;
                }
                var array = JSON.parse(cfg['_parameter']);
                var cfgNum = 0;
                var cfgVal;
                var devVal;
                if (array.length > 2) {
                    cfgNum = array[0];
                    cfgVal = array[1];
                    devVal = node.instances[0].commandClasses[0x70].data[cfgNum].val.value;
                    if (cfgVal != devVal) {
                        var obj = {};
                        obj['name'] = $filter('deviceName')(cfg['_id'], node);
                        obj['id'] = cfg['_id'];
                        //$scope.notConfigDevices.push(obj);
                        var findIndex = _.findIndex($scope.notConfigDevices, {id: obj.id});
                        if (findIndex > -1) {
                            angular.extend($scope.notConfigDevices[findIndex], obj);

                        } else {
                            $scope.notConfigDevices.push(obj);
                        }
                    }

                }
            });
        });
    }
    ;
    /**
     * assocRemovedDevices
     */
    function assocRemovedDevices(ZWaveAPIData) {
        var controllerId = ZWaveAPIData.controller.data.nodeId.value;
        var cnt = 0;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            if (nodeId == 255 || nodeId == controllerId || node.data.isVirtual.value) {
                return;
            }
            var removedDevices = assocGedRemovedDevices(node, ZWaveAPIData);
            if (removedDevices.length > 0) {
                var obj = {};
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['id'] = nodeId;
                obj['assoc'] = removedDevices;
                //$scope.assocRemovedDevices.push(obj);
                var findIndex = _.findIndex($scope.assocRemovedDevices, {id: obj.id});
                if (findIndex > -1) {
                    angular.extend($scope.assocRemovedDevices[findIndex], obj);

                } else {
                    $scope.assocRemovedDevices.push(obj);
                }
                cnt++;
            }
        });
        return cnt;
    }
    ;

    /**
     * assocGedRemovedDevices
     */
    function assocGedRemovedDevices(node, ZWaveAPIData) {
        var assocDevices = [];
        var data;
        if (0x85 in node.instances[0].commandClasses) {
            var cc = node.instances[0].commandClasses[0x85].data;
            if (cc.groups.value >= 1) {
                for (var grp_num = 1; grp_num <= parseInt(cc.groups.value, 10); grp_num++) {
                    data = cc[grp_num];
                    for (var i = 0; i < data.nodes.value.length; i++) {
                        var targetNodeId = data.nodes.value[i];
                        if (!(targetNodeId in ZWaveAPIData.devices)) {
                            assocDevices.push({
                                'id': targetNodeId,
                                'name': '(#' + targetNodeId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])
                            });
                        }
                    }

                }
            }
        }

        if (0x8e in node.instances[0].commandClasses) {
            var cc = node.instances[0].commandClasses[0x8e].data;
            if (cc.groups.value >= 1) {
                for (var grp_num = 1; grp_num <= parseInt(cc.groups.value, 10); grp_num++) {

                    data = cc[grp_num];

                    for (var i = 0; i < data.nodesInstances.value.length; i += 2) {
                        var targetNodeId = data.nodesInstances.value[i];
                        var targetInstanceId = data.nodesInstances.value[i + 1];
                        var instanceId = (targetInstanceId > 0 ? '.' + targetInstanceId : '');
                        if (!(targetNodeId in ZWaveAPIData.devices)) {
                            assocDevices.push({
                                'id': targetNodeId,
                                'name': '(#' + targetNodeId + instanceId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])
                            });
                        }

                    }
                }
            }
        }
        if (assocDevices.length > 0) {
            //console.log(assocDevices)
        }

        return assocDevices;
    }
    ;
});

/**
 * Configuration controller
 * @author Martin Vach
 */
// Redirect to new version of configuration
appController.controller('ConfigRedirectController', function ($routeParams, $location, $cookies, $filter) {
    var configUrl = 'configuration/interview';
    var nodeId = function () {
        var id = 1;
        if ($routeParams.nodeId == undefined) {
            id = (angular.isDefined($cookies.configuration_id) ? $cookies.configuration_id : 1);
        } else {
            id = $routeParams.nodeId;
        }
        return id;
    };
    if (nodeId() == $cookies.configuration_id) {
        if (angular.isDefined($cookies.config_url)) {
            configUrl = $cookies.config_url;
        }
    } else {
        configUrl = configUrl + '/' + nodeId();
    }
//    console.log('$routeParams.nodeId: ' +  nodeId())
//    console.log('$cookies.configuration_id: ' + $cookies.configuration_id)
//    console.log(configUrl)
//    return;
    $location.path(configUrl);
});

/**
 * Load device XML file
 * @class LoadDeviceXmlController
 *
 */
appController.controller('LoadDeviceXmlController', function($scope,$routeParams, $timeout,$window,cfg, dataService) {
    $scope.deviceXml = {
        all: [],
        find: [],
        input: {
            fileName: 0
        }
    };
    /**
     * Load devices descriptions
     * @param {int} nodeId
     */
    $scope.loadDeviceXml = function (nodeId) {
        var cmd = 'devices[' + nodeId + '].GuessXML()';
       dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {
           $scope.deviceXml.all = response.data;
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_load_data') + '\n' + cmd);
        });
    };
    $scope.loadDeviceXml($routeParams.nodeId);

    /**
     * Change device XML
     * @param {object} input
     */
    $scope.changeDeviceXml = function (input) {
        var find = _.findWhere($scope.deviceXml.all, {fileName: input.fileName});
        if(find){
            $scope.deviceXml.find = find;
        }else{
            $scope.deviceXml.find = {};
        }
    };

    /**
     * Store device XML
     * @param {object} input
     */
    $scope.storeDeviceXml = function (input,modal) {
        var timeout = 1000;
        var cmd = 'devices[' + $routeParams.nodeId + '].LoadXMLFile("' + input.fileName + '")';
        $scope.toggleRowSpinner(modal);
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {
            $timeout(function(){
                $scope.toggleRowSpinner();
                $scope.handleModal();
                //$scope.reloadData();
                $window.location.reload();
            }, timeout);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + cmd);
        });
    };
});

/**
 * @overview This controller renders and handles device interview stuff.
 * @author Martin Vach
 */

/**
 * Device interview controller
 * @class ConfigInterviewController
 *
 */
appController.controller('ConfigInterviewController', function ($scope, $routeParams, $route, $location, $cookies, $filter, $http,  $timeout,$interval,cfg,dataService, deviceService, myCache) {
    $scope.devices = [];
    $scope.deviceName = '';
    $scope.deviceId = 0;
    $scope.activeTab = 'interview';
    $scope.activeUrl = 'configuration/interview/';
    $cookies.tab_config = $scope.activeTab;
    $scope.modelSelectZddx = false;
    $scope.zwaveInterview = {
        interval: null,
        progress: 0,
        commandClassesCnt: 0,
        interviewDoneCnt: 0
    };

    // Interview data
    $scope.descriptionCont;
    $scope.deviceZddx = [];

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.zwaveInterview.interval);
    });

    // Load data
    $scope.load = function (nodeId) {
        //nodeId = parseInt(nodeId,10);
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            if(_.isEmpty($scope.devices)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            if (!node || deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.deviceName = $filter('deviceName')(nodeId, node);
            checkInterview(node);
            setData(ZWaveAPIData, nodeId);
            $scope.refreshZwaveData();
           /* dataService.loadJoinedZwaveData(ZWaveAPIData).then(function(response) {
                node = response.data.joined.devices[nodeId];
                refreshData(node, nodeId, response.data.joined);
                $scope.ZWaveAPIData = ZWaveAPIData;
            });*/
        }, function(error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.load($routeParams.nodeId);

    /**
     * Refresh zwave data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                var node = response.data.joined.devices[$routeParams.nodeId];
                refreshData(node, $routeParams.nodeId, response.data.joined);
            }, function(error) {});
        };
        $scope.zwaveInterview.interval = $interval(refresh, $scope.cfg.interval);
    };

    // Redirect to detail page
    $scope.changeDevice = function (deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    /**
     * Request NIF of a device
     * Node Id to be requested for a NIF
     * @param {string} cmd
     */
    $scope.requestNodeInformation = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * Purge all command classes and start interview based on device's NIF
     * @param {string} cmd
     */
    $scope.interviewForce = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * Purge all command classes and start interview for a device
     * @param {string} cmd
     */
    $scope.interviewForceDevice = function (cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * Show modal CommandClass dialog
     * @param target
     * @param $event
     * @param instanceId
     * @param ccId
     * @param type
     */
    $scope.handleCmdClassModal= function (target, $event,instanceId, ccId, type) {
        var node = $scope.ZWaveAPIData.devices[$routeParams.nodeId];
        var ccData;
        switch (type) {
            case 'cmdData':
                ccData = $filter('hasNode')(node, 'instances.' + instanceId + '.commandClasses.' + ccId + '.data');
                break;
            case 'cmdDataIn':
                ccData = $filter('hasNode')(node, 'instances.' + instanceId + '.data');
                break;
            default:
                ccData = $filter('hasNode')(node, 'data');
                break;
        }
        var cc = deviceService.configGetCommandClass(ccData, '/', '');

        $scope.commandClass = deviceService.configSetCommandClass(cc);
        $scope.handleModal(target, $event);
        //$(target).modal();
    };

    /**
     * Rename Device action
     */
    $scope.renameDevice = function (form,deviceName,spin) {
       if(!form.$dirty){
            return;
        }
        var timeout = 1000;
        var cmd = 'devices[' + $scope.deviceId + '].data.givenName.value="' + escape(deviceName) + '"';
        $scope.toggleRowSpinner(spin);
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {

            $timeout(function(){
                form.$setPristine();
                $scope.toggleRowSpinner();
                //$scope.form_rename.$dirty = !$scope.form_rename.$dirty;
                //$route.reload();

            }, timeout);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_load_data') + '\n' + cmd);
        });
    };

    /// --- Private functions --- ///
    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData, nodeId, refresh) {
        var node = ZWaveAPIData.devices[nodeId];
        if (!node) {
            return;
        }
        $scope.showDevices = true;
        $scope.deviceName = $filter('deviceName')(nodeId, node);
        $scope.deviceNameId = $filter('deviceName')(nodeId, node) + ' (#' + nodeId + ')';
        $scope.hasBattery = 0x80 in node.instances[0].commandClasses;
        var zddXmlFile = null;
        if (angular.isDefined(node.data.ZDDXMLFile)) {
            zddXmlFile = node.data.ZDDXMLFile.value;
            $scope.deviceZddxFile = node.data.ZDDXMLFile.value;
        }

        $scope.interviewCommands = deviceService.configGetInterviewCommands(node, ZWaveAPIData.updateTime);
        $scope.interviewCommandsDevice = node.data;
        if (zddXmlFile && zddXmlFile !== 'undefined') {
            var cachedZddXml = myCache.get(zddXmlFile);
            // Uncached file
            //if (!cachedZddXml) {
            $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function (response) {
                var x2js = new X2JS();
                var zddXml = x2js.xml_str2json(response.data);
                myCache.put(zddXmlFile, zddXml);
                $scope.descriptionCont = setCont(node, nodeId, zddXml, ZWaveAPIData, refresh);


            });
            // todo: deprecated
            //} else {
            //$scope.descriptionCont = setCont(node, nodeId, cachedZddXml, ZWaveAPIData, refresh);
            //}

        } else {

            $scope.descriptionCont = setCont(node, nodeId, null, ZWaveAPIData, refresh);
        }
    }

    /**
     * Check interview
     */
    function checkInterview(node) {
        $scope.zwaveInterview.commandClassesCnt = 0;
        $scope.zwaveInterview.interviewDoneCnt = 0;
            if (!node) {
                return;
            }
            if (!node.data.nodeInfoFrame.value) {
                return;
            }
            for (var iId in node.instances) {
                if (Object.keys(node.instances[iId].commandClasses).length < 1) {
                    return;
                }
                //angular.extend($scope.zwaveInterview, {commandClassesCnt: Object.keys(node.instances[iId].commandClasses).length});
                $scope.zwaveInterview.commandClassesCnt +=  Object.keys(node.instances[iId].commandClasses).length;
                for (var ccId in node.instances[iId].commandClasses) {
                    var cmdClass = node.instances[iId].commandClasses[ccId];
                    // Is interview done?
                    if (cmdClass.data.interviewDone.value) {

                        // If an interview is done deleting from interviewNotDone
                        // Extending an interview counter
                        angular.extend($scope.zwaveInterview,
                            {interviewDoneCnt: $scope.zwaveInterview.interviewDoneCnt + 1}
                        );
                    }
                }
            }

            var commandClassesCnt = $scope.zwaveInterview.commandClassesCnt;
            var intervewDoneCnt = $scope.zwaveInterview.interviewDoneCnt;
            var progress = ((intervewDoneCnt / commandClassesCnt) * 100).toFixed();
            /*console.log('commandClassesCnt: ', commandClassesCnt);
            console.log('intervewDoneCnt: ', intervewDoneCnt);
            console.log('Percent %: ', progress);*/
            $scope.zwaveInterview.progress = (progress >= 100 ? 100 : progress);

    }
    ;

    /**
     * Device description
     */
    function setCont(node, nodeId, zddXml, ZWaveAPIData, refresh) {

        // Set device data
        var deviceImage = 'app/images/no_device_image.png';
        var deviceDescription = '';
        var productName = '';
        var inclusionNote = '';
        var brandName = node.data.vendorString.value;
        var wakeupNote = '';
        var ZWavePlusRoles = [];
        var securityInterview = '';
        var deviceDescriptionAppVersion = parseInt(node.data.applicationMajor.value, 10);
        var deviceDescriptionAppSubVersion = parseInt(node.data.applicationMinor.value, 10);
        var hasWakeup = 0x84 in node.instances[0].commandClasses;
        if (isNaN(deviceDescriptionAppVersion))
            deviceDescriptionAppVersion = '-';
        if (isNaN(deviceDescriptionAppSubVersion))
            deviceDescriptionAppSubVersion = '-';
        var zwNodeName = '';
        if (0x77 in node.instances[0].commandClasses) {
            // NodeNaming
            zwNodeName = node.instances[0].commandClasses[0x77].data.nodename.value;
            if (zwNodeName != '') {
                zwNodeName = ' (' + zwNodeName + ')';
            }


        }
        // Security interview
        if (0x98 in node.instances[0].commandClasses) {
            securityInterview = node.instances[0].commandClasses[0x98].data.securityAbandoned.value;
        }

        var sdk;
        if (node.data.SDK.value == '') {
            sdk = '(' + node.data.ZWProtocolMajor.value + '.' + node.data.ZWProtocolMinor.value + ')';
        } else {
            sdk = node.data.SDK.value;
        }

        // Command class
        var ccNames = [];
        angular.forEach($scope.interviewCommands, function (v, k) {
            ccNames.push(v.ccName);
        });
        // Has device a zddx XML file
        if (zddXml) {
            deviceDescription = deviceService.configGetZddxLang($filter('hasNode')(zddXml, 'ZWaveDevice.deviceDescription.description.lang'), $scope.lang);
            inclusionNote = deviceService.configGetZddxLang($filter('hasNode')(zddXml, 'ZWaveDevice.deviceDescription.inclusionNote.lang'), $scope.lang);
            wakeupNote = deviceService.configGetZddxLang($filter('hasNode')(zddXml, 'ZWaveDevice.deviceDescription.wakeupNote.lang'), $scope.lang);

            if ('brandName' in zddXml.ZWaveDevice.deviceDescription) {
                brandName = zddXml.ZWaveDevice.deviceDescription.brandName;
            }

            if ('productName' in zddXml.ZWaveDevice.deviceDescription) {
                productName = zddXml.ZWaveDevice.deviceDescription.productName;
            }

            if (angular.isDefined(zddXml.ZWaveDevice.resourceLinks)) {
                deviceImage = zddXml.ZWaveDevice.resourceLinks.deviceImage._url;
            }
            /**
             * TODO: finish ZWavePlusRoles
             */
            if (angular.isDefined(zddXml.ZWaveDevice.RoleTypes)) {
                angular.forEach(zddXml.ZWaveDevice.RoleTypes, function (v, k) {
                    ZWavePlusRoles.push(v);
                });
            }
        }

        // Set device image
        $scope.deviceImage = deviceImage;
        // OBJ
        var obj = {};
        obj["a"] = {"key": "device_node_id", "val": nodeId};
        //obj["b"] = {"key": "device_node_name", "val": $filter('deviceName')(nodeId, node)};
        obj["c"] = {"key": "device_node_type", "val": ''};
        obj["d"] = {"key": "device_description_brand", "val": brandName};
        obj["e"] = {"key": "device_description_device_type", "val": node.data.deviceTypeString.value};
        obj["f"] = {"key": "device_description_product", "val": productName};
        obj["g"] = {"key": "device_description_description", "val": deviceDescription};
        obj["h"] = {"key": "device_description_inclusion_note", "val": inclusionNote};
        if(hasWakeup){
            obj["i"] = {"key": "device_description_wakeup_note", "val": wakeupNote};
        }

       // obj["j"] = {"key": "device_description_interview", "val": deviceService.configInterviewStage(ZWaveAPIData, nodeId, $scope.languages)};
        //obj["k"] = {"key": "device_interview_indicator", "val": interviewDone};
        obj["l"] = {"key": "device_sleep_state", "val": deviceService.configDeviceState(node, $scope.languages)};
        obj["m"] = {"key": "device_description_app_version", "val": deviceDescriptionAppVersion + '.' + deviceDescriptionAppSubVersion};
        obj["o"] = {"key": "device_description_sdk_version", "val": sdk};
        obj["p"] = {"key": "command_class", "val": ccNames};
        obj["q"] = {"key": "zwave_role_type", "val": ZWavePlusRoles.join(', ')};
        if (deviceService.isLocalyReset(node)) {
            obj["r"] = {"key": "device_reset_locally", "val": '<i class="' + $filter('checkedIcon')(true) + '"></i>'};
        }
        if (typeof securityInterview === 'boolean') {
            obj["s"] = {"key": "device_security_interview", "val": '<i class="' + $filter('checkedIcon')(securityInterview === true ? false : true) + '"></i>'};
        }
        return obj;
    }

    /**
     * Refresh description cont
     */
    function refreshData(node, nodeId, ZWaveAPIData) {
        checkInterview(node);
        $scope.interviewCommands = deviceService.configGetInterviewCommands(node, ZWaveAPIData.updateTime);
        // todo: deprecated
        //$('#device_sleep_state .config-interview-val').html(deviceService.configDeviceState(node, $scope.languages));
        //$('#device_description_interview .config-interview-val').html(deviceService.configInterviewStage(ZWaveAPIData, nodeId, $scope.languages));
    }
});

/**
 * @overview This controller renders and handles device configuration stuff.
 * @author Martin Vach
 */

/**
 * Device configuration configuration controller
 * @class ConfigConfigurationController
 *
 */
appController.controller('ConfigConfigurationController', function ($scope, $routeParams, $location, $cookies, $filter, $http, $timeout, $route, $interval,cfg, dataService, deviceService, myCache, _) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.activeTab = 'configuration';
    $scope.activeUrl = 'configuration/configuration/';
    $cookies.tab_config = $scope.activeTab;
    $scope.reset = function () {
        $scope.devices = angular.copy([]);
    };
    // Config vars
    $scope.hasConfigurationCc = false;
    $scope.modelSelectZddx = false;
    $scope.deviceZddx = [];
    $scope.configCont;
    $scope.switchAllCont;
    $scope.protectionCont;
    $scope.wakeupCont;

    $scope.configInterval = null;

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.configInterval);
    });

    // Redirect to detail page
    $scope.changeDevice = function (deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    // Load data
    $scope.loadZwaveData = function (nodeId) {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            if(_.isEmpty($scope.devices)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            if (!node || deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }

            $scope.getNodeDevices = function () {
                var devices = [];
                angular.forEach($scope.devices, function (v, k) {
                    if (devices_htmlSelect_filter($scope.ZWaveAPIData, 'span', v.id, 'node')) {
                        return;
                    }
                    ;
                    devices.push(v);
                });
                //console.log(devices)
                return devices;
            };

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.deviceName = $filter('deviceName')(nodeId, node);

            setData(ZWaveAPIData, nodeId);

        });
    };
    $scope.loadZwaveData($routeParams.nodeId);

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function (nodeId) {
        var refresh = function() {
            dataService.loadJoinedZwaveData(null).then(function(response) {
                var updateData = false;
                var searchStr = 'devices.' + $routeParams.nodeId + '.'
                angular.forEach(response.data.update, function(v, k) {
                    if (k.indexOf(searchStr) !== -1) {
                        updateData = true;
                        return;
                    }
                });
                if (updateData) {
                    //$scope.loadZwaveData($routeParams.nodeId, false);
                    setData(response.data.joined,nodeId);
                }
                //setData(response.data.joined,nodeId);
            }, function(error) {});
        };
        $scope.configInterval = $interval(refresh, $scope.cfg.interval);
       /* dataService.joinedZwaveData(function (data) {
            setData(data.joined, nodeId);
        });*/
    };
    $scope.refreshZwaveData($routeParams.nodeId);



    /**
     * Update from device action
     *
     * @param {string} cmd
     * @returns {undefined}
     */
    $scope.updateFromDevice = function (cmd, hasBattery, deviceId, form,spin) {
        if (hasBattery) {
            deviceService.showNotifier({message: $scope._t('conf_apply_battery'),type: 'warning'});
        }
        $scope.toggleRowSpinner(spin);
        dataService.runZwaveCmd(cfg.store_url + cmd);
        //$scope.refreshZwaveData(deviceId);

        $('#' + form + ' .cfg-control-content :input').prop('disabled', true);
        $timeout(function () {
            $scope.toggleRowSpinner();
           //$interval.cancel($scope.configInterval);
            $scope.loadZwaveData($routeParams.nodeId);
            $('#' + form + ' .cfg-control-content :input').prop('disabled', false);
        }, 3000);
        return;
    };

    /**
     * Update from device - configuration section
     */
    $scope.updateFromDeviceCfg = function (cmd, config, deviceId, form,spin) {
        var request = cfg.store_url + cmd;
        $scope.toggleRowSpinner(spin);
        angular.forEach(config, function (v, k) {
            if (v.confNum) {
                dataService.runZwaveCmd(request + '(' + v.confNum + ')');
            }
        });
        //$scope.refreshZwaveData(deviceId);
        $('#' + form + ' .cfg-control-content :input').prop('disabled', true);
        $timeout(function () {
           //$interval.cancel($scope.configInterval);
            $scope.loadZwaveData($routeParams.nodeId);
            $scope.toggleRowSpinner();
        }, 3000);
        return;
    };

    /**
     * Set all values to default
     */
    $scope.setAllToDefault = function (cmd, cfgValues, hasBattery, form,spin) {
        var dataArray = {};
        angular.forEach(cfgValues, function (v, k) {
            dataArray[v.confNum] = {
                value: $filter('setConfigValue')(v.showDefaultValue),
                name: v.name
                //cfg: v
            };
        });
        //console.log(dataArray)
        $scope.submitApplyConfigCfg(form, cmd, cfgValues, hasBattery, false, false, dataArray,spin);

    };


    /**
     * Apply Config action
     */
    $scope.submitApplyConfigCfg = function (form, cmd, cfgValues, hasBattery, confNum, setDefault, hasData,spin) {
        var xmlData = [];
        var configValues = [];
        if (hasBattery) {
            //alert($scope._t('conf_apply_battery'));
            deviceService.showNotifier({message: $scope._t('conf_apply_battery'),type: 'warning'});
        }

        var dataArray = _.isObject(hasData) ? hasData : {};
        $scope.toggleRowSpinner(spin);
        if (!_.isObject(hasData)) {
            data = $('#' + form).serializeArray();
            angular.forEach(data, function (v, k) {
                if (v.value === 'N/A') {
                    return;
                }
                var value = $filter('setConfigValue')(v.value);
                var inputConfNum = v.name.match(/\d+$/)[0];
                var inputType = v.name.split('_')[0];
                if (!inputConfNum) {
                    return;
                }
                var cfg = _.findWhere(cfgValues, {confNum: inputConfNum.toString()});
                if (cfg) {
                    if ('bitset' in cfg.type) {
                        if (inputType === 'bitrange') {
                            var bitRange = _.findWhere(cfg.type.bitset, {name: v.name});
                            value = (value === '' ? 0 : parseInt(value));
                            if (value < bitRange.type.bitrange.bit_from && value > 0) {
                                value = bitRange.type.bitrange.bit_from;
                            } else if (value > bitRange.type.bitrange.bit_to) {
                                value = bitRange.type.bitrange.bit_to;
                            }
                        } else {
                            value = Math.pow(2, value);

                        }

                    }
                    /*else if('enumof' in cfg.type){
                     var enumof = _.findWhere(cfg.type.enumof,{name: v.name});

                     }*/
                }
                if (dataArray[inputConfNum]) {
                    dataArray[inputConfNum].value += ',' + value;
                } else {
                    dataArray[inputConfNum] = {
                        value: value,
                        name: v.name
                        //cfg: cfg
                    };


                }

            });
        }
        angular.forEach(dataArray, function (n, nk) {
            var obj = {};
            var parameter;
            var lastNum = n.name.match(/\d+$/);
            if (!lastNum) {
                return;
            }

            var num = lastNum[0];
            //console.log('num', num)
            var confSize = 0;
            var value = n.value;

            if (angular.isObject(setDefault) && setDefault.confNum == num) {
                value = setDefault.showDefaultValue;
            }
            configValues.push(value)
            angular.forEach(cfgValues, function (cv, ck) {
                if (!cv) {
                    return;
                }
                if (cv.confNum == num) {
                    confSize = cv.confSize;
                }


            });
            if (num > 0) {
                parameter = num + ',' + value + ',' + confSize;
            } else {
                parameter = value;
            }

            obj['id'] = cmd['id'];
            obj['instance'] = cmd['instance'];
            obj['commandclass'] = cmd['commandclass'];
            obj['command'] = cmd['command'];
            obj['parameter'] = '[' + parameter + ']';
            obj['parameterValues'] = parameter;
            obj['confNum'] = num;

            xmlData.push(obj);


        });
        //console.log(xmlData)
        //return;

        // Send command
        var request = 'devices[' + cmd.id + '].instances[' + cmd.instance + '].commandClasses[0x' + cmd.commandclass + '].';
        switch (cmd['commandclass']) {
            case '70':// Config
                angular.forEach(xmlData, function (v, k) {

                    var configRequest = request;
                    configRequest += cmd.command + '(' + v.parameterValues + ')';
                    if (confNum) {
                        if (confNum == v.confNum) {
                            dataService.runZwaveCmd(cfg.store_url + configRequest);
                        }
                    } else {
                        dataService.runZwaveCmd(cfg.store_url + configRequest);
                    }

                });
                break;
            case '75':// Protection
                request += cmd.command + '(' + configValues.join(",") + ')';
                dataService.runZwaveCmd(cfg.store_url + request);
                break;
            case '84':// Wakeup
                request += cmd.command + '(' + configValues.join(",") + ')';
                dataService.runZwaveCmd(cfg.store_url + request);
                break;
            case '27':// Switch all
                request += cmd.command + '(' + configValues.join(",") + ')';
                dataService.runZwaveCmd(cfg.store_url + request);
                break;
            default:
                break;
        }

        dataService.getCfgXml().then(function (cfgXml) {
            var xmlFile = deviceService.buildCfgXml(xmlData, cfgXml, cmd['id'], cmd['commandclass']);
            dataService.putCfgXml(xmlFile);
        });


        //$scope.refreshZwaveData(cmd['id']);
        if (confNum) {
            $('#cfg_control_' + confNum + ' :input').prop('disabled', true);
        } else {
            $('#' + form + ' .cfg-control-content :input').prop('disabled', true);
        }
        $timeout(function () {
            $scope.loadZwaveData($routeParams.nodeId);
            $('#' + form + ' .cfg-control-content :input').prop('disabled', false);
           //$interval.cancel($scope.configInterval);
            $scope.toggleRowSpinner();
        }, 3000);
        return;
    };


    /// --- Private functions --- ///
    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData, nodeId) {
        var node = ZWaveAPIData.devices[nodeId];
        if (!node) {
            return;
        }
        $scope.showDevices = true;
        $scope.deviceName = $filter('deviceName')(nodeId, node);
        $scope.deviceNameId = $filter('deviceName')(nodeId, node) + ' (#' + nodeId + ')';
        $scope.hasBattery = 0x80 in node.instances[0].commandClasses;
        var zddXmlFile = null;
        if (angular.isDefined(node.data.ZDDXMLFile)) {
            zddXmlFile = node.data.ZDDXMLFile.value;
            $scope.deviceZddxFile = node.data.ZDDXMLFile.value;
        }

        $scope.interviewCommands = deviceService.configGetInterviewCommands(node, ZWaveAPIData.updateTime);
        $scope.interviewCommandsDevice = node.data;
        if (zddXmlFile && zddXmlFile !== 'undefined') {
            var cachedZddXml = myCache.get(zddXmlFile);
            // Uncached file
            if (!cachedZddXml) {
                $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function (response) {
                    var x2js = new X2JS();
                    var zddXml = x2js.xml_str2json(response.data);
                    myCache.put(zddXmlFile, zddXml);
                    setCont(node, nodeId, zddXml, ZWaveAPIData);


                });
            } else {
                setCont(node, nodeId, cachedZddXml, ZWaveAPIData);
            }

        } else {

            setCont(node, nodeId, null, ZWaveAPIData);
        }
    }

    /**
     * Set all conts
     */
    function setCont(node, nodeId, zddXml, ZWaveAPIData) {
        if (!zddXml) {
            $scope.noZddx = true;
            // Loop throught instances
            angular.forEach(node.instances, function (instance, instanceId) {
                if (instance.commandClasses[112]) {

                    $scope.hasConfigurationCc =  configurationCc(instance.commandClasses[112], instanceId,nodeId, ZWaveAPIData);
                    return;
                }
            });
        }
        dataService.getCfgXml().then(function (cfgXml) {
            $scope.configCont = deviceService.configConfigCont(node, nodeId, zddXml, cfgXml, $scope.lang, $scope.languages);
            $scope.wakeupCont = deviceService.configWakeupCont(node, nodeId, ZWaveAPIData, cfgXml);
            $scope.protectionCont = deviceService.configProtectionCont(node, nodeId, ZWaveAPIData, cfgXml);
            $scope.switchAllCont = deviceService.configSwitchAllCont(node, nodeId, ZWaveAPIData, cfgXml);
            if (!$scope.configCont && !$scope.wakeupCont && !$scope.protectionCont && !$scope.switchAllCont) {
                $scope.alert = {message: $scope._t('configuration_not_supported'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            /*if (cfg.app_type === 'installer') {
                if (!$scope.configCont && !$scope.wakeupCont && !$scope.protectionCont && !$scope.switchAllCont) {
                    $location.path('/configuration/commands/' + $routeParams.nodeId);
                    return;
                }
            }else{
                if (!$scope.configCont && !$scope.wakeupCont && !$scope.protectionCont && !$scope.switchAllCont) {
                    $scope.alert = {message: $scope._t('no_device_service'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                    return;
                }
            }*/

        }, function(error) {
            var cfgXml = {};
            $scope.configCont = deviceService.configConfigCont(node, nodeId, zddXml, cfgXml, $scope.lang, $scope.languages);
            $scope.wakeupCont = deviceService.configWakeupCont(node, nodeId, ZWaveAPIData, cfgXml);
            $scope.protectionCont = deviceService.configProtectionCont(node, nodeId, ZWaveAPIData, cfgXml);
            $scope.switchAllCont = deviceService.configSwitchAllCont(node, nodeId, ZWaveAPIData, cfgXml);
            if (cfg.app_type === 'installer') {
                if (!$scope.configCont && !$scope.wakeupCont && !$scope.protectionCont && !$scope.switchAllCont) {
                    $location.path('/configuration/commands/' + $routeParams.nodeId);
                    return;
                }
            }else{
                if (!$scope.configCont && !$scope.wakeupCont && !$scope.protectionCont && !$scope.switchAllCont) {
                    $scope.alert = {message: $scope._t('no_device_service'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                    return;
                }
            }
        });
    }
    function configurationCc(commandClass, instanceId,nodeId, ZWaveAPIData) {
        //console.log(node);

        var ccId = 112;
        var methods = getMethodSpec(ZWaveAPIData, nodeId, instanceId, ccId, null);
        var command = deviceService.configGetCommands(methods, ZWaveAPIData);
        var obj = {};
        obj['nodeId'] = nodeId;
        obj['rowId'] = 'row_' + nodeId + '_' + instanceId + '_' + ccId;
        obj['instanceId'] = instanceId;
        obj['ccId'] = ccId;
        obj['cmd'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
        obj['cmdData'] = ZWaveAPIData.devices[nodeId].instances[instanceId].commandClasses[ccId].data;
        obj['cmdDataIn'] = ZWaveAPIData.devices[nodeId].instances[instanceId].data;
        obj['commandClass'] = commandClass.name;
        obj['command'] = command;
        obj['updateTime'] = ZWaveAPIData.updateTime;
        return obj;
    }



});

/**
 * @overview This controller renders and handles device expert commands stuff.
 * @author Martin Vach
 */

/**
 * Device expert commands controller
 * @class ConfigCommandsController
 *
 */
appController.controller('ConfigCommandsController', function ($scope, $routeParams, $location, $cookies, $interval,$timeout, $filter, cfg,dataService, deviceService, _) {
    $scope.devices = [];
    $scope.deviceName = '';
    $scope.commands = [];
    $scope.interviewCommands;
    $scope.commandsInterval = null;

    $scope.deviceId = 0;
    $scope.activeTab = 'commands';
    $scope.activeUrl = 'configuration/commands/';

    $cookies.tab_config = $scope.activeTab;

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.commandsInterval);
    });

    // Redirect to detail page
    $scope.changeDevice = function (deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    // Load data
    $scope.loadData = function (nodeId) {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            if(_.isEmpty($scope.devices)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            if (!node || deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
            $scope.getNodeDevices = function () {
                var devices = [];
                angular.forEach($scope.devices, function (v, k) {
                    if (devices_htmlSelect_filter($scope.ZWaveAPIData, 'span', v.id, 'node')) {
                        return;
                    }
                    ;
                    var obj = {};
                    obj['id'] = v.id;
                    obj['name'] = v.name;
                    devices.push(obj);
                });
                return devices;
            };
            $scope.interviewCommands = deviceService.configGetInterviewCommands(node, ZWaveAPIData.updateTime);
            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.deviceName = $filter('deviceName')(nodeId, node);
            setData(ZWaveAPIData,node);
        });

    }
    $scope.loadData($routeParams.nodeId);

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
            }, function(error) {});
        };
        $scope.commandsInterval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Store expert commands
     */
    $scope.storeExpertCommnds = function (form, cmd) {
        $scope.toggleRowSpinner(cmd);
        var data = $('#' + form).serializeArray();
        var dataJoined = [];
        angular.forEach(data, function (v, k) {
            if (v.value === 'N/A') {
                return;
            }
            dataJoined.push($filter('setConfigValue')(v.value));

        });
        var request = cmd + '(' + dataJoined.join() + ')';
         dataService.runZwaveCmd(cfg.store_url + request).then(function (response) {
            $timeout($scope.toggleRowSpinner, 3000);
        }, function (error) {
            alertify.alertError($scope._t('error_update_data') + '\n' + cmd);
            $scope.toggleRowSpinner();
        });
    };

    /**
     * Show modal CommandClass dialog
     */
    $scope.handleCmdClassModal= function (target, $event,instanceId, index, ccId, type) {
        var node = $scope.ZWaveAPIData.devices[$routeParams.nodeId];
        var ccData = $filter('hasNode')(node, 'instances.' + instanceId + '.data');

        if (type == 'cmdData') {
            ccData = $filter('hasNode')(node, 'instances.' + instanceId + '.commandClasses.' + ccId + '.data');
        }
        var cc = deviceService.configGetCommandClass(ccData, '/', '');

        $scope.commandClass = deviceService.configSetCommandClass(cc, $scope.commands[index]['updateTime']);
        /**
         * Refresh data
         */
        dataService.loadJoinedZwaveData().then(function(response) {
            node = response.data.joined.devices[$routeParams.nodeId];
            var newCc = $filter('hasNode')(node, 'instances.' + instanceId + '.data');
            if (type == 'cmdData') {
                newCc = $filter('hasNode')(node, 'instances.' + instanceId + '.commandClasses.' + ccId + '.data');
            }

            if (newCc) {
                if (JSON.stringify(ccData) === JSON.stringify(newCc)) {
                    return;
                }
                $scope.commandClass = deviceService.configSetCommandClass(deviceService.configGetCommandClass(newCc, '/', ''), response.data.joined.updateTime);
            }
        });
        $scope.handleModal(target, $event);
    };
    /**
     * Watch for the modal closing
     */
    $scope.$watchCollection('modalArr', function (modalArr) {
        if(_.has(modalArr, 'cmdClassModal') && !modalArr['cmdClassModal']){
            $interval.cancel($scope.commandsInterval);
            //console.log(modalArr['cmdClassModal'])
        }

    });

    /// --- Private functions --- ///
    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData,node) {
        angular.forEach(node.instances, function (instance, instanceId) {
            angular.forEach(instance.commandClasses, function (commandClass, ccId) {
                var nodeId = $scope.deviceId;
                var methods = getMethodSpec(ZWaveAPIData, nodeId, instanceId, ccId, null);
                var command = deviceService.configGetCommands(methods, ZWaveAPIData);
                var obj = {};
                obj['nodeId'] = nodeId;
                obj['rowId'] = 'row_' + nodeId + '_' + instanceId + '_' + ccId;
                obj['instanceId'] = instanceId;
                obj['ccId'] = ccId;
                obj['cmd'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                //obj['cmdData'] = ZWaveAPIData.devices[nodeId].instances[instanceId].commandClasses[ccId].data;
                obj['cmdData'] = instance.commandClasses[ccId].data;
                //obj['cmdDataIn'] = ZWaveAPIData.devices[nodeId].instances[instanceId].data;
                obj['cmdDataIn'] = instance.data;
                obj['commandClass'] = commandClass.name;
                obj['command'] = command;
                obj['updateTime'] = ZWaveAPIData.updateTime;
                //console.log(obj)
                $scope.commands.push(obj);
            });
        });
    }


});

/**
 * @overview This controller renders and handles device association stuff.
 * @author Martin Vach
 */

/**
 * Device configuration Association controller
 * @class ConfigAssocController
 *
 */
appController.controller('ConfigAssocController', function($scope, $filter, $routeParams, $location, $cookies, $timeout, $window,$interval, dataService, deviceService, myCache, cfg, _) {
    $scope.devices = [];
    $scope.deviceName = '';
    $scope.deviceId = 0;
    $scope.activeTab = 'association';
    $scope.activeUrl = 'configuration/assoc/';
    $cookies.tab_config = $scope.activeTab;

    $scope.alert = {message: false, status: 'is-hidden', icon: false};
    // Assoc vars
    $scope.node = [];
    $scope.nodeCfg = {
        id: 0,
        instance: 0,
        hasMca: false,
        name: null,
        hasBattery: false,
        isAwake: false,
        notAwake: []

    };
    $scope.assocGroups = [];
    $scope.assocGroupsDevices = [];
    $scope.assocAddDevices = [];
    $scope.assocAddInstances = false;
    $scope.cfgXml = [];
    $scope.input = {
        nodeId: 0,
        goupCfg: false,
        //goupId: 0,
        toNode: false,
        toInstance: false
    };
    $scope.assocInterval = false;


    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.assocInterval);
    });

    // Redirect to detail page
    $scope.changeDevice = function(deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    // Load data
    $scope.loadZwaveData = function(nodeId, noCache) {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            if(_.isEmpty($scope.devices)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            if (!node || deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
            $scope.node = node;
            angular.extend($scope.nodeCfg, {
                id: nodeId,
                hasMca: 142 in node.instances[0].commandClasses,
                name: $filter('deviceName')(nodeId, node),
                hasBattery: 0x80 in node.instances[0].commandClasses,
            });
            $scope.input.nodeId = nodeId;

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.deviceName = $filter('deviceName')(nodeId, node);
            dataService.getCfgXml().then(function (cfgXml) {
                //console.log(node)
                setData(node, ZWaveAPIData, nodeId, cfgXml);
            }, function(error) {
                setData(node, ZWaveAPIData, nodeId, {});
            });


        }, noCache);
    };
    $scope.loadZwaveData($routeParams.nodeId);

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                var updateData = false;
                var searchStr = 'devices.' + $routeParams.nodeId + '.'
                angular.forEach(response.data.update, function(v, k) {
                    if (k.indexOf(searchStr) !== -1) {
                        updateData = true;
                        return;
                    }
                });
                if (updateData) {
                    $scope.loadZwaveData($routeParams.nodeId, false);
                }
            }, function(error) {});
        };
        $scope.assocInterval = $interval(refresh, cfg.interval);
    };

    $scope.refreshZwaveData();

    /**
     * todo: deprecated
     */
    /*$scope.refresh = function() {
        dataService.joinedZwaveData(function(data) {
            var updateData = false;
            var searchStr = 'devices.' + $routeParams.nodeId + '.'
            angular.forEach(data.update, function(v, k) {
                if (k.indexOf(searchStr) !== -1) {
                    updateData = true;
                    return;
                }
            });
            if (updateData) {
                $scope.load($routeParams.nodeId, true);
            }


        });
    };*/
    //$scope.refresh();

    // Update data from device
    $scope.updateFromDevice = function(spin) {

        var nodeId = $scope.deviceId;
        var node = $scope.node;
        $scope.toggleRowSpinner(spin);
        angular.forEach(node.instances, function(instance, index) {
            if (!("commandClasses" in instance)) {
                return;
            }
            if (0x85 in instance.commandClasses) {
                for (var group = 0; group < instance.commandClasses[0x85].data.groups.value; group++) {
                   dataService.runZwaveCmd(cfg.store_url + 'devices[' + nodeId + '].instances[' + index + '].commandClasses[0x85].Get(' + (group + 1) + ')', false, $scope._t('error_handling_data'), true);
                }
            }
            if (0x8e in instance.commandClasses) {
                for (var group = 0; group < instance.commandClasses[0x8e].data.groups.value; group++) {
                    dataService.runZwaveCmd(cfg.store_url + 'devices[' + nodeId + '].instances[' + index + '].commandClasses[0x8e].Get(' + (group + 1) + ')', false, $scope._t('error_handling_data'), true);

                }
            }
            $timeout(function() {
                $scope.toggleRowSpinner();
            }, 3000);
            return;


        });
    };

    //Show modal window with a list of the devices to assocciate
    $scope.handleAssocModal = function(modal,$event,group) {
        $scope.input.groupCfg = group;
        $scope.input.groupId = group.groupId;
        $scope.assocAddDevices = [];
        // Prepare devices and nodes
        angular.forEach($scope.ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || node.data.isVirtual.value || nodeId == $scope.deviceId) {
                return;
            }
            var obj = {};
            obj['id'] = nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['hasMca'] = 142 in node.instances[0].commandClasses;
            obj['instances'] = getNodeInstances(node, nodeId);
            if ($scope.nodeCfg.hasMca) {
                if (obj['hasMca']) {
                    $scope.assocAddDevices.push(obj);
                } else {
                    if (group.nodeIds.indexOf(parseInt(nodeId)) === -1) {
                        $scope.assocAddDevices.push(obj);
                    }
                }
            } else {
                if (group.nodeIds.indexOf(parseInt(nodeId)) === -1) {
                    $scope.assocAddDevices.push(obj);
                }
            }
        });
        $scope.handleModal(modal,$event);

    };
    //Close  assoc  modal window
    $scope.closeAssocModal = function() {
        $scope.handleModal();

        $scope.input.toNode = false;
        $scope.input.toInstance = false;
        $scope.input.groupId = 0;
        $scope.assocAddInstances = false;
        $scope.assocAddDevices = angular.copy([]);
        $timeout(function() {
            $scope.toggleRowSpinner();
            $scope.loadZwaveData($scope.nodeCfg.id);
        }, 3000);

    };
    //Show node instances (if any)
    $scope.showAssocNodeInstance = function(nodeId, hasMca) {
        if (!hasMca) {
            return;
        }
        // Prepare devices and nodes
        angular.forEach($scope.assocAddDevices, function(v, k) {
            if (v.id == nodeId) {
                $scope.assocAddInstances = Object.keys(v.instances).length > 0 ? v.instances : false;
                return;
            }
        });
    };
    
    //Store assoc device from group
    $scope.storeAssoc = function(input) {
        $scope.toggleRowSpinner('group_' + input.groupCfg.groupId);
        var addDevice = {};
        var instances = '0';
        var commandClasses = '85';
        var commandClassesH = 0x85;
        var toInstance = '';
        if (input.toInstance && input.toInstance !== 'plain') {
            commandClasses = '142';
            commandClassesH = 0x8e;
            toInstance = ',' + input.toInstance;
        }
        var cmd = 'devices[' + input.nodeId + '].instances[' + instances + '].commandClasses[' + commandClassesH + '].Set(' + input.groupId + ',' + input.toNode + toInstance + ')';
        var data = {
            'id': input.nodeId,
            'instance': instances,
            'commandclass': commandClasses,
            'command': 'Set',
            'parameter': '[' + input.groupId + ',' + input.toNode + toInstance + ']'

        };
        addDevice[input.toNode] = {
            isNew: true,
            status: 'false-true',
            elId: _.now(),
            id: input.toNode,
            instance: parseInt(input.toInstance, 10),
            name: _.findWhere($scope.assocAddDevices, {id: input.toNode}).name
        };
         angular.extend($scope.assocGroupsDevices[input.groupId], addDevice);

        dataService.getCfgXml().then(function (cfgXml) {
            dataService.runZwaveCmd(cfg.store_url + cmd).then(function(response) {
                $scope.closeAssocModal();
                var xmlFile = deviceService.buildCfgXmlAssoc(data, cfgXml);
                dataService.putCfgXml(xmlFile);
            }, function(error) {
                $window.alert($scope._t('error_handling_data') + '\n' + cmd);
                $scope.loadZwaveData($routeParams.nodeId);
            });
            $scope.input.toNode = false;
            $scope.input.toInstance = false;
            $scope.input.groupId = 0;
            $scope.assocAddInstances = false;
            return;
        });
    };

    //Delete assoc device from group
    $scope.deleteAssoc = function(d) {
        var params = d.groupId + ',' + d.id;
        if (d.node.cc === '8e') {
            params = d.groupId + ',' + d.id + (d.instance > -1 ? ',' + d.instance : '');
        }
        var cmd = 'devices[' + d.node.id + '].instances[' + d.node.instance + '].commandClasses[0x' + d.node.cc + '].Remove(' + params + ')';
        var data = {
            'id': d.node.id,
            'instance': d.node.instance,
            'commandclass': (d.node.cc === '8e' ? '142' : String(d.node.cc)),
            'command': 'Set',
            'parameter': '[' + params + ']'

        };
        dataService.getCfgXml().then(function (cfgXml) {
            dataService.runZwaveCmd(cfg.store_url + cmd).then(function(response) {
                var xmlFile = deviceService.deleteCfgXmlAssoc(data, cfgXml);
                dataService.putCfgXml(xmlFile);
                $('#' + d.elId).addClass('true-false');

            }, function(error) {
                $window.alert($scope._t('error_handling_data') + '\n' + cmd);
            });
        });
    };

    /// --- Private functions --- ///
    /**
     * Get node instances
     */
    function getNodeInstances(node) {
        var instances = [];
        if (Object.keys(node.instances).length < 2) {
            return instances;
        }
        for (var instanceId in node.instances) {
            var obj = {};
            obj['key'] = instanceId,
                    obj['val'] = instanceId
            instances.push(obj);
        }
        return instances;

    }

    /**
     * Set zwave data
     */
    function setData(node, ZWaveAPIData, nodeId, cfgXml) {
        var zddXmlFile = $filter('hasNode')(node, 'data.ZDDXMLFile.value');
        //  zddXmlFile not available
        if (!zddXmlFile || zddXmlFile === 'undefined') {
            $scope.assocGroups = getAssocGroups(node, null, nodeId, ZWaveAPIData, cfgXml);
            if ($scope.assocGroups.length < 1) {
                $scope.alert = {message: $scope._t('no_association_groups_found'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
            }
            return;
        }

        dataService.xmlToJson(cfg.server_url + cfg.zddx_url + zddXmlFile).then(function (zddXmlData) {
            var zdd = $filter('hasNode')(zddXmlData, 'ZWaveDevice.assocGroups');
            $scope.assocGroups = getAssocGroups(node, zdd, nodeId, ZWaveAPIData, cfgXml);
            if ($scope.assocGroups.length < 1) {
                $scope.alert = {message: $scope._t('no_association_groups_found'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
            }
        });

    }

    /**
     * Get assoc groups
     */
    function getAssocGroups(node, zdd, nodeId, ZWaveAPIData, cfgXml) {
        var assocGroups = [];
        var groupZdd = [];
        if (zdd) {
            angular.forEach(zdd, function(zddval, zddkey) {
                if (angular.isArray(zddval)) {
                    angular.forEach(zddval, function(val, key) {
                        groupZdd[val._number] = val;
                    });
                } else {
                    groupZdd[zddval._number] = zddval;
                }
            });
        }
        $scope.nodeCfg.notAwake = [];
        //console.log('Has assoc', node.instances)

        angular.forEach(node.instances, function(instance, index) {

            if (!("commandClasses" in instance)) {
                return;
            }

            if (0x85 in instance.commandClasses || 0x8e in instance.commandClasses) {
                var groups = 0;
                if (0x85 in instance.commandClasses) {
                    groups = instance.commandClasses[0x85].data.groups.value;

                }

                if (0x8e in instance.commandClasses) {
                    if (instance.commandClasses[0x8e].data.groups.value > groups) {
                        groups = instance.commandClasses[0x8e].data.groups.value;
                    }

                }

                for (var group = 0; group < groups; group++) {
                    var data;
                    var dataMca;
                    var assocDevices = [];
                    var cfgArray;
                    var cfgArrayMca;
                    var groupCfg = [];
                    var groupDevices = [];
                    var savedInDevice = [];
                    var nodeIds = [];
                    var instanceIds = [];
                    var persistent = [];
                    var updateTime;
                    var invalidateTime;
                    var updateTimeMca;
                    var invalidateTimeMca;
                    var groupId;
                    var label;
                    var max;
                    var timeClass = 'undef';
                    var obj = {};


                    groupId = (group + 1);
                    label = getGroupLabel(groupZdd[groupId], group, instance);
                    max = $filter('hasNode')(groupZdd[groupId], '_maxNodes');

                    $scope.assocGroupsDevices[groupId] = {};

                    if ((0x85 in instance.commandClasses) && (group < instance.commandClasses[0x85].data.groups.value)) {


                        cfgArray = deviceService.getCfgXmlAssoc(cfgXml, nodeId, '0', '85', 'Set', groupId);
                        var savedNodesInDevice = [];
                        data = instance.commandClasses[0x85].data[group + 1];
                        // Find duplicates in nodes
                        for (var i = 0; i < data.nodes.value.length; i++) {
                            if (savedNodesInDevice.indexOf(data.nodes.value[i]) === -1) {
                                savedNodesInDevice.push(data.nodes.value[i]);
                            }
                            /*if ((data.nodes.value.lastIndexOf(data.nodes.value[i]) != i) && (savedNodesInDevice.indexOf(data.nodes.value[i]) == -1)) {
                             savedNodesInDevice.push(data.nodes.value[i]);
                             }*/
                        }

                        groupDevices = data.nodes.value;
                        updateTime = data.nodes.updateTime;
                        invalidateTime = data.nodes.invalidateTime;
                        if (cfgArray[groupId] && cfgArray[groupId].nodes.length > 0) {
                            groupCfg = cfgArray[groupId].nodes;
                            $.merge(groupDevices, groupCfg);
                        }


                        for (var i = 0; i < $filter('unique')(groupDevices).length; i++) {

                            var targetNodeId = data.nodes.value[i];
                            nodeIds.push(targetNodeId);
                            var targetInstanceId = 0;
                            instanceIds.push(targetInstanceId);

                            var toCfgXml = {
                                'id': String($scope.nodeCfg.id),
                                'instance': String($scope.nodeCfg.instance),
                                'commandclass': '85',
                                'command': 'Set',
                                'parameter': '[' + groupId + ',' + targetNodeId + ']'

                            };

                            var inConfig = deviceService.isInCfgXml(toCfgXml, cfgXml);
                            var objAssoc = {};
                            objAssoc['id'] = targetNodeId;
                            objAssoc['isNew'] = false;
                            objAssoc['groupId'] = groupId;
                            objAssoc['elId'] = groupId + '_' + targetNodeId + '_' + targetInstanceId + '_' + i;
                            objAssoc['name'] = $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId]);
                            objAssoc['instance'] = targetInstanceId;
                            objAssoc['cc'] = 85;
                            objAssoc['node'] = {
                                id: nodeId,
                                instance: index,
                                cc: 85
                            };
                            // objAssoc['inDevice'] =  savedNodesInDevice.indexOf(targetNodeId) > -1 ? true : false;
                            // objAssoc['inConfig'] = inConfig;
                            objAssoc['status'] = (savedNodesInDevice.indexOf(targetNodeId) > -1 ? true : false) + '-' + inConfig;
                            assocDevices.push(objAssoc);
                            $scope.assocGroupsDevices[groupId][targetNodeId] = objAssoc;
                            //console.log($scope.assocGroupsDevices[groupId])
                        }
                    }

                    if ((0x8e in instance.commandClasses) && (group < instance.commandClasses[0x8e].data.groups.value)) {
                        cfgArrayMca = deviceService.getCfgXmlAssoc(cfgXml, nodeId, '0', '142', 'Set', groupId);
                        var savedNodesInstancesInDevice = [];
                        dataMca = instance.commandClasses[0x8e].data[group + 1];
                        for (var i = 0; i < Object.keys(dataMca.nodesInstances.value).length; i += 2) {
                            savedNodesInstancesInDevice.push(dataMca.nodesInstances.value[i] + '_' + dataMca.nodesInstances.value[i + 1]);
                        }
                        updateTimeMca = dataMca.nodesInstances.updateTime;
                        invalidateTimeMca = dataMca.nodesInstances.invalidateTime;
                        if (cfgArrayMca[groupId] && cfgArrayMca[groupId].nodeInstances.length > 0) {
                            angular.forEach(cfgArrayMca[groupId].nodeInstances, function(vMca) {
                                if (savedNodesInstancesInDevice.indexOf(vMca) === -1) {
                                    var slice = vMca.split('_');
                                    dataMca.nodesInstances.value.push(parseInt(slice[0], 10));
                                    dataMca.nodesInstances.value.push(parseInt(slice[1], 10));
                                }
                            });
                        }
                        for (var i = 0; i < Object.keys(dataMca.nodesInstances.value).length; i += 2) {
                            var targetNodeId = dataMca.nodesInstances.value[i];
                            nodeIds.push(targetNodeId);
                            var targetInstanceId = dataMca.nodesInstances.value[i + 1];
                            instanceIds.push(targetInstanceId);
                            var idNodeInstance = dataMca.nodesInstances.value[i] + '_' + dataMca.nodesInstances.value[i + 1];
                            var toCfgXml = {
                                'id': String($scope.nodeCfg.id),
                                'instance': String($scope.nodeCfg.instance),
                                'commandclass': '142',
                                'command': 'Set',
                                'parameter': '[' + groupId + ',' + targetNodeId + ',' + targetInstanceId + ']'

                            };
                            var inConfig = deviceService.isInCfgXml(toCfgXml, cfgXml);
                            var objAssoc = {};
                            objAssoc['id'] = targetNodeId;
                            objAssoc['isNew'] = false;
                            objAssoc['groupId'] = groupId;
                            objAssoc['elId'] = groupId + '_' + targetNodeId + '_' + targetInstanceId + '_' + i;
                            objAssoc['name'] = $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId]);
                            objAssoc['instance'] = targetInstanceId;
                            objAssoc['cc'] = '8e';
                            objAssoc['node'] = {
                                id: nodeId,
                                instance: index,
                                cc: '8e'
                            };
                            //objAssoc['inDevice'] = savedNodesInstancesInDevice.indexOf(idNodeInstance) > -1 ? true : false;
                            //objAssoc['inConfig'] = inConfig;
                            objAssoc['status'] = (savedNodesInstancesInDevice.indexOf(idNodeInstance) > -1 ? true : false) + '-' + inConfig;
                            assocDevices.push(objAssoc);
                            $scope.assocGroupsDevices[groupId][String(targetNodeId) + String(i)] = objAssoc;
                        }
                    }

                    if ((updateTime < invalidateTime) || (updateTimeMca < invalidateTimeMca)) {
                        timeClass = 'red';
                        $scope.nodeCfg.isAwake = true;
                        if ($scope.nodeCfg.notAwake.indexOf(groupId) === -1) {
                            $scope.nodeCfg.notAwake.push(groupId);
                        }

                    }

                    obj = {
                        label: label,
                        devices: assocDevices,
                        nodeId: nodeId,
                        //node: node,
                        instance: index,
                        groupId: groupId,
                        nodeIds: $filter('unique')(nodeIds),
                        instanceIds: instanceIds,
                        persistent: persistent,
                        max: max || data.max.value,
                        updateTime: updateTime,
                        invalidateTime: invalidateTime,
                        timeClass: timeClass,
                        remaining: (data.max.value - $filter('unique')(nodeIds).length)
                    };
                    assocGroups.push(obj);
                }
            }

        });
        return assocGroups;
    }

    /**
     * Get group name
     */
    function getGroupLabel(assocGroups, index, instance) {
        // Set default assoc group name
        var label = $scope._t('association_group') + " " + (index + 1);

        // Attempt to get assoc group name from the zdd file
        var langs = $filter('hasNode')(assocGroups, 'description.lang');
        if (langs) {
            if (angular.isArray(langs)) {
                for (var i = 0, len = langs.length; i < len; i++) {
                    if (("__text" in langs[i]) && (langs[i]["_xml:lang"] == $scope.lang)) {
                        label = langs[i].__text;
                        continue;
                        //return label;

                        //continue;
                    } else {
                        if (("__text" in langs[i]) && (langs[i]["_xml:lang"] == 'en')) {
                            label = langs[i].__text;
                            continue;
                            //return label;
                        }
                    }
                }
            } else {
                if (("__text" in langs)) {
                    label = langs.__text;
                }
            }
        } else {
            // Attempt to get assoc group name from the command class
            angular.forEach(instance.commandClasses, function(v, k) {
                if (v.name == 'AssociationGroupInformation') {
                    label = $filter('hasNode')(v, 'data.' + (index + 1) + '.groupName.value');
                }

            });
        }
        return label;
    }
    ;

});
/**
 * @overview This controller renders and handles device firmware update stuff.
 * @author Martin Vach
 */

/**
 * Device configuration firmware controller
 * @class ConfigFirmwareController
 *
 */
appController.controller('ConfigFirmwareController', function ($scope, $routeParams, $location, $cookies, $timeout, $filter, $interval, cfg, dataService, deviceService) {
    $scope.devices = [];
    $scope.deviceName = '';
    $scope.deviceId = 0;
    $scope.activeTab = 'firmware';
    $scope.activeUrl = 'configuration/firmware/';
    /*$scope.showForm = false;
     $scope.formFirmware = {};
     $scope.firmwareProgress = 0;*/

    $scope.firmware = {
        show: false,
        input: {
            url: '',
            targetId: ''
        },
        interval: null,

        update: {
            progress: 0,
            updateStatus: null,
            fragmentTransmitted: 0,
            fragmentCount: 0,
            waitTime: 0
        }

    };

    $cookies.tab_config = $scope.activeTab;

    // Load data
    $scope.load = function (nodeId) {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            if (_.isEmpty($scope.devices)) {
                $scope.alert = {
                    message: $scope._t('device_404'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation-circle'
                };
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            if (!node || deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
            // Remember device id
            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.deviceName = $filter('deviceName')(nodeId, node);

            if ('122' in node.instances[0].commandClasses) {
                //console.log(node.instances[0].commandClasses[122].data)
                $scope.firmware.show = true;
                //setFirmwareData(node);
                //$scope.refreshZwaveData(nodeId);
            }else{
                $scope.alert = {message: $scope._t('no_device_service'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }

        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.load($routeParams.nodeId);

    /**
     * todo: not needed?
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function (nodeId) {
        var refresh = function () {
            //dataService.loadJoinedZwaveData().then(function (response) {
            dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
                var node = ZWaveAPIData.devices[nodeId];
                if ('122' in node.instances[0].commandClasses) {
                    console.log(node.instances[0].commandClasses[122].data.updateStatus)
                }
                //var node = response.data.joined.devices[nodeId];
                //setFirmwareData(node);
            }, function (error) {
            });
        };
        $scope.firmware.interval = $interval(refresh, $scope.cfg.interval);
    };

    // Redirect to detail page
    $scope.changeDevice = function (deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };
    /**
     * Handles device firmware update
     * @param {object} input
     * @param {string} id
     */
    $scope.updateDeviceFirmware = function (input, id) {
        $scope.toggleRowSpinner(id);
        var cmd = cfg.server_url + cfg.fw_update_url + '/' + $scope.deviceId
        var fd = new FormData();

        fd.append('file', $scope.myFile);
        fd.append('url', input.url);
        fd.append('targetId', input.targetId || '0');
        dataService.uploadApiFile(cmd, fd).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
            deviceService.showNotifier({message: $scope._t('success_device_firmware_update')});
            /*$timeout(function () {
             alertify.dismissAll();
             $window.location.reload();
             }, 2000);*/
        }, function (error) {
            $timeout($scope.toggleRowSpinner, 1000);
            alertify.alertError($scope._t('error_device_firmware_update'));
        });
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setFirmwareData(device) {
        angular.forEach(device.instances, function (instance, instanceId) {
            if (instanceId == 0 && device.instances.length > 1) {
                return;
            }
            var fw = instance.commandClasses['122'];
            if (!fw) {
                $scope.firmware.show = false;
                return;
            }
            var fragmentTransmitted = fw.data.updateStatus.value;
            var fragmentCount = fw.data.fragmentCount.value;
            var progress = ((fragmentTransmitted / fragmentCount) * 100).toFixed();

            $scope.firmware.update.fragmentTransmitted = fragmentTransmitted;
            $scope.firmware.update.fragmentCount = fragmentCount;
            $scope.firmware.update.fragmentCount = fragmentCount;
            $scope.firmware.update. progress =  progress;

            $scope.firmware.update.updateStatus = fw.data.updateStatus.value;
            $scope.firmware.update.waitTime = fw.data.waitTime.value;

            return;

        });

    }


});
/**
 * @overview This controller renders and handles device link health stuff.
 * @author Martin Vach
 */

/**
 * Configuration link health controller
 * @class ConfigHealthController
 *
 */
appController.controller('ConfigHealthController', function ($scope, $routeParams, $timeout, $location, $cookies, $filter, $interval, cfg, deviceService, dataService) {
    $scope.apiDataInterval;
    $scope.devices = [];
    $scope.deviceName = '';
    $scope.deviceId = 0;
    $scope.activeTab = 'health';
    $scope.activeUrl = 'configuration/health/';
    $cookies.tab_config = $scope.activeTab;
    $cookies.interval = $scope.activeTab;
    $scope.health = {
        ctrlNodeId: 1,
        alert: {message: false, status: 'is-hidden', icon: false},
        device: {
            neighbours: [],
            node: {},
            find: {},
            hasPowerLevel: false,
            commandClass: false
        },
        cmd: {
            testNodeInstance: 0
        },
        neighbours: [],
        timing: {
            all: {},
            indicator: {},
            find: {
            }
        }
    };
    // Cancel interval on page destroy
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.apiDataInterval);
    });

    // Redirect to detail page
    $scope.changeDevice = function (deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };

    // Load timing data
    $scope.loadTiming = function () {
        //$scope.health.alert = {message: $scope._t('not_linked_devices'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
        dataService.getApi('stat_url', null, true).then(function (response) {
            $scope.health.timing.all = response.data;
            $scope.health.timing.indicator.color = setTimingIndicatorColor(response.data[$routeParams.nodeId]);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
            return;
        });
    };
    $scope.loadTiming();

    // Load data
    $scope.load = function () {
        //$scope.health.alert = {message: $scope._t('not_linked_devices'), status: 'alert-warning', icon: 'fa-exclamation-circle'};

        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            if(_.isEmpty($scope.devices)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            $scope.health.ctrlNodeId = ZWaveAPIData.controller.data.nodeId.value;
            var node = ZWaveAPIData.devices[$routeParams.nodeId];
            /*if (!node || deviceService.notDevice(ZWaveAPIData, node, $routeParams.nodeId)) {
                return;
            }*/
            var neighbours = $filter('hasNode')(node.data, 'neighbours.value');
            $scope.health.device.neighbours = $filter('hasNode')(node.data, 'neighbours.value');

            // Remember device id
            $cookies.configuration_id = $routeParams.nodeId;
            $cookies.config_url = $scope.activeUrl + $routeParams.nodeId;
            $scope.deviceId = $routeParams.nodeId;
            $scope.health.device.node = node;
            $scope.deviceName = $filter('deviceName')($routeParams.nodeId, node);
            setDevice(node);
            setData(ZWaveAPIData, neighbours);
            $scope.refreshData();

        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
            return;
        });
    };
    $scope.load();

    /**
     * Refresh data
     */
    $scope.refreshData = function () {
        var refresh = function () {
            dataService.loadJoinedZwaveData().then(function (response) {
                setData(response.data.joined);
            }, function (error) {
                return;
            });
        };
        $scope.apiDataInterval = $interval(refresh, $scope.cfg.interval);
    };

    // Run Zwave Command
    /*$scope.runZwaveCmd = function (cmd) {
        $scope.toggleRowSpinner(cmd);
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_load_data') + '\n' + cmd);
            //$window.alert($scope._t('error_handling_data') + '\n' + cmd);
        });
    };*/
    // Run Zwave NOP Command
    $scope.runZwaveNopCmd = function (cmd) {
        for (i = 0; i < 21; i++) {
            $scope.runZwaveCmd(cmd);
        }
    };

    // Handle power level modal window
    $scope.handlePowerLevelModal = function (name, event, device) {
        $scope.handleModal(name, event);
        $scope.health.device.find = device;
        if (!device) {
            $scope.health.device.commandClass = {};
            return;
        }
        var cc = deviceService.configGetCommandClass($scope.health.device.hasPowerLevel[device.id], '/', '');
        $scope.health.device.commandClass = deviceService.configSetCommandClass(cc);
    };

    // Handle timing modal window
    $scope.handleTimingModal = function (name, event, device) {
        $scope.handleModal(name, event);
        $scope.health.device.find = device;
        if (!device) {
            $scope.health.timing.find = {};
            return;
        }
        $scope.loadTiming();
        var timingItems = $scope.health.timing.all[$routeParams.nodeId];
        if (!timingItems || _.isEmpty(timingItems)) {
            return;
        }
        $scope.health.timing.find = {
            totalPackets: timingItems.length,
            okPackets: deviceService.getOkPackets(timingItems),
            lastPackets: deviceService.getLastPackets(timingItems)
        };
    };

    /**
     * Test all links
     * @param {string} id
     * @param {string} urlType
     */
    $scope.testAllLinks = function(id) {
        $scope.toggleRowSpinner(id);
        var data = {"nodeId": $scope.deviceId};
        dataService.postApi('checklinks', data).then(function (response) {
            deviceService.showNotifier({message: $scope._t('test_all_links_complete')});
            $scope.toggleRowSpinner();
        }, function (error) {
            deviceService.showNotifier({message: $scope._t('error_update_data'),type: 'error'});
            $scope.toggleRowSpinner();
        });
    };

    /// --- Private functions --- ///
    /**
     * Set configuration device
     * @param {object} node
     * @returns {undefined}
     */
    function setDevice(node) {
        angular.forEach(node.instances, function (instance, instanceId) {
            if (instance.commandClasses[115]) {
                $scope.health.device.hasPowerLevel = instance.commandClasses[115].data;
                $scope.health.cmd.testNodeInstance = instanceId;
            }
        });
    }

    /**
     * Set list of the linked devices
     * @param {object} ZWaveAPIData
     * @returns {undefined}
     */
    function setData(ZWaveAPIData, neighbours) {
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            if (nodeId === $routeParams.nodeId) {
                $scope.health.timing.indicator.updateTime = node.data.lastReceived.updateTime;
                $scope.health.timing.indicator.updateTimeColor = (node.data.lastReceived.updateTime > node.data.lastReceived.invalidateTime ? '' : 'red');
            }

            nodeId = parseInt(nodeId);
            if ($scope.health.device.neighbours.indexOf(nodeId) === -1) {
                return;
            }
            //console.log(node)
            var centralController = true;
            var type = deviceService.deviceType(node);
            var indicator;
            var powerLevel = $scope.health.device.hasPowerLevel[nodeId];
            if (powerLevel) {
                indicator = setPowerLevelIndicator(powerLevel);
            }
            var obj = {
                id: nodeId,
                name: $filter('deviceName')(nodeId, node),
                updateTime: node.data.updateTime,
                type: type,
                icon: $filter('getDeviceTypeIcon')(type),
                centralController: centralController,
                powerLevel: powerLevel,
                indicator: indicator,
                cmdTestNode: 'devices[' + $routeParams.nodeId + '].instances[' + $scope.health.cmd.testNodeInstance + '].commandClasses[115].TestNodeSet(' + nodeId + ',6,20)',
                cmdNop: 'devices[' + $routeParams.nodeId + '].instances[' + $scope.health.cmd.testNodeInstance + '].commandClasses[32].Get()'
            };
            var index = _.findIndex($scope.health.neighbours, {id: nodeId});
            if ($scope.health.neighbours[index]) {
                angular.extend($scope.health.neighbours[index], obj);
            } else {
                $scope.health.neighbours.push(obj);
            }

        });

        if($scope.health.neighbours.length == 0) {
            $scope.alert = {message: $scope._t('not_linked_devices'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
        }
    }
    /**
     * Set power level indicator
     * @param {object} data
     * @returns {object}
     */
    function setPowerLevelIndicator(data) {
        var indicator = {
            color: 'gray',
            updateTime: false,
            updateTimeColor: ''
        };
        var traffic = 'gray';
        if (!data || _.isEmpty(data) || data.acknowledgedFrames.value === null) {
            return indicator;
        }
        if (data.acknowledgedFrames.value > -1 && data.acknowledgedFrames.value < 6) {
            indicator.color = 'red';
        } else if (data.acknowledgedFrames.value > 5 && data.acknowledgedFrames.value < 18) {
            indicator.color = 'orange';
        } else if (data.acknowledgedFrames.value > 17) {
            indicator.color = 'green';
        }
        indicator.updateTime = data.acknowledgedFrames.updateTime;
        indicator.updateTimeColor = (data.acknowledgedFrames.updateTime > data.acknowledgedFrames.invalidateTime ? '' : 'red');
        return  indicator;
    }
    /**
     * Set power level indicator
     * @param {int} nodeId
     * @returns {object}
     */
    function setTimingIndicatorColor(data) {
        var color = 'gray';
        if (!data || _.isEmpty(data)) {
            return color;
        }
        //console.log(data)
        //return;

        var cnt = 0;
        var sum = 0;
        var avg;
        angular.forEach(data.slice(-20), function (v, k) {
            var val = 0;
            if (v.delivered) {
                val = parseInt(v.deliveryTime);
                sum += val;
            }
            cnt++;
        });
        avg = (sum / cnt).toFixed();
        if (avg > 0) {
            color = (avg > 100 ? 'black' : 'green');
        } else {
            color = 'red';
        }
        return color;
    }
});
/**
 * @overview This controller renders and handles device postfix stuff.
 * @author Martin Vach
 */

/**
 * Device configuration Postfix controller
 * @class ConfigPostfixController
 *
 */
appController.controller('ConfigPostfixController', function ($scope, $routeParams, $location, $cookies, $filter, $timeout, $window, dataService, deviceService) {
    $scope.devices = [];
    $scope.deviceId = 0;
    $scope.deviceName = '';
    $scope.activeTab = 'postfix';
    $scope.activeUrl = 'configuration/postfix/';
    $cookies.tab_config = $scope.activeTab;
    $scope.postfix = {
        find: false,
        interview: {
            preInterview: '',
            postInterview: '',
        },
        model: {
            p_id: false,
            product: '',
            preInterview: [],
            postInterview: [],
            last_update: '',
            tester: '',
            commentary: ''
        }
    };
    // Interview data
    $scope.descriptionCont;
    $scope.deviceZddx = [];
    // Redirect to detail page
    $scope.changeDevice = function (deviceId) {
        if (deviceId > 0) {
            $location.path($scope.activeUrl + deviceId);
        }
    };
    // Load data
    $scope.loadData = function (nodeId) {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.devices = deviceService.configGetNav(ZWaveAPIData);
            if(_.isEmpty($scope.devices)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            if (!node || deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }

            $cookies.configuration_id = nodeId;
            $cookies.config_url = $scope.activeUrl + nodeId;
            $scope.deviceId = nodeId;
            $scope.deviceName = $filter('deviceName')(nodeId, node);
            $scope.postfix.model.p_id = getPId(node);
            $scope.loadPostfix($scope.postfix.model.p_id);
        }, function (error) {
            $location.path('/error/' + error.status);
            return;
        });
    };
    $scope.loadData($routeParams.nodeId);

    // Load postfix
    $scope.loadPostfix = function (p_id) {
        if (!p_id) {
            return;
        }
        dataService.getApi('postfixget_url', '/' + p_id, false).then(function (response) {
            $scope.postfix.find = response.data;
            angular.extend($scope.postfix.model, _.omit(response.data, 'p_id'));
        }, function (error) {});
    };

    // Add interview
    $scope.addInterview = function (key) {
        var source = $scope.postfix.interview[key];
        if (key && source) {
            $scope.postfix.model[key].push(source);
            $scope.postfix.interview[key] = '';
        }
    };
    // Remove interview
    $scope.removeInterview = function (key, index) {
        $scope.postfix.model[key].splice(index, 1);
        return;
    };


    // Update a postfix
    $scope.updatePostfix = function () {
        $scope.postfix.model.last_update = $filter('getMysqlFromNow')('');
        dataService.postApi('postfixadd_url', $scope.postfix.model).then(function (response) {
            deviceService.showNotifier({message: $scope._t('zwave_reinstalled')});
            $timeout(function () {
                alertify.dismissAll();
                $window.location.reload();
            }, 5000);
        }, function (error) {
            alertify.alertError($scope._t('error_update_data'));
            return;
        });
    };
    // Delete postfix
    $scope.deletePostfix = function (message) {
        alertify.confirm(message, function () {
            var input = {p_id: $scope.postfix.model.p_id};
            dataService.postApi('postfixremove_url', input).then(function (response) {
                deviceService.showNotifier({message: $scope._t('delete_successful') + ' ' + $scope._t('zwave_reinstalled')});
                $scope.postfix.model = {p_id: $scope.postfix.model.p_id};
                $timeout(function () {
                    alertify.dismissAll();
                    $window.location.reload();
                }, 5000);
            }, function (error) {
                alertify.alertError($scope._t('error_delete_data'));
                return;
            });
        });


    };

    /// --- Private functions --- ///

    function getPId(node) {

        var mId = node.data.manufacturerId.value ? node.data.manufacturerId.value : null;
        var mPT = node.data.manufacturerProductType.value ? node.data.manufacturerProductType.value : null;
        var mPId = node.data.manufacturerProductId.value ? node.data.manufacturerProductId.value : null;

        var p_id = mId + "." + mPT + "." + mPId;

        return (p_id !== 'null.null.null' ? p_id : false);
    }
});

/**
 * Common app functions
 * author Martin Vach
 */

///////////////////////////////// Works /////////////////////////////////
$(function() {
     /*** Expert commands **/
    // Set/Remove disabled on next text input
    $(document).on('click', '.form_commands .commands-data-chbx,#form_config .commands-data-chbx', function() {
//        if($(this).hasClass('commands-data-chbx-hastxt')){
//             $(this).attr('disabled',true);
//        }else{
//            $(this).parent('.form-group').find('.commands-data-chbx-hastxt').attr('disabled',false);
//        }
        
       $(this).parent('.form-group').find('.commands-data-txt-chbx').attr('disabled',true);
        $(this).siblings('.commands-data-txt-chbx').attr('disabled',false);
    });
    
     /*** Spinner **/
    $(document).on('click', '.spin-true', function() {
       $(this).find('.fa-spin').show();
    });
    /*** Lock **/
    // Change status for lock buttons
    $(document).on('click', '.lock-controll .btn', function() {
        var parent = $(this).closest('tr').attr('id');
        $('#' + parent + ' .btn').removeClass('active');
        $(this).addClass('active');
    });
});