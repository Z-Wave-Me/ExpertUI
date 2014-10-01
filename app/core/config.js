/**
 * App configuration
 * @author Martin Vach
 * @author Martin Hartnagel
 */

var config_module = angular.module('appConfig', []);
var config_data = {
    'cfg': {
        'app_name': 'Z-Wave',
        'app_version': '0.1',
        'custom_ip': false,
        'user_field': 'USERXXXX',
        'pass_field': 'PSWDXXXX',
        'interval': 3000, // Set interval in miliseconds to refresh data
        'queue_interval': 3000, // Set interval in miliseconds to refresh queue data
        'route_update_timeout': 15000, // Maximum time in miliseconds to wait for an update-route
        'server_url': '', // Remote JSON
        'update_url': '/ZWaveAPI/Data/', // Url for update (refresh data)
        'store_url': '/ZWaveAPI/Run/', // Url for store data
        'restore_url': '/ZWaveAPI/Restore', // Url to restore backup
        'queue_url': '/ZWaveAPI/InspectQueue', // Url for inspect queue/JS/Run/
        'runjs_url': '/JS/Run/', // Url for running JS
        'device_classes_url': '/translations/DeviceClasses.xml', // Url to Device Classes
        'config_url': '/config/', // Url for store config data
        'reorg_log_url': '/config/reorg.log', // Url for store reorg log data
        'zddx_url': '/ZDDX/', // Url for zddx xml files
        'zddx_create_url': '/ZAutomation/CreateZDDX/', // Create zddx file
        'notes_url': '/config/notes.log', // Url for store notes data
        'lang_dir': 'app/core/lang/', // Language directory
        'lang': 'en', // Default language
        'lang_list': ["en", "de", "fr", "es", "ru"], // List of languages
        'thermostat_range': {// Min and max thermostat range
            "min": "0",
            "max": "40"
        }

    }
};
angular.forEach(config_data, function(key, value) {
    config_module.constant(value, key);
});