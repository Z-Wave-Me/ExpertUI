/**
 * App configuration
 * @author Martin Vach
 */

var config_module = angular.module('appConfig', []);
var config_data = {
  'cfg': {
    'app_name': 'Z-Wave',
    'app_version': '0.1',
    'user_field': 'USERXXXX',
    'pass_field': 'PSWDXXXX',
    'interval': 3000, // Set interval in miliseconds to refresh data
    'server_url': 'http://next.de', // Remote JSON
    'update_url': '/ZWaveAPI/Data/', // Url for update (refresh data)
    'store_url': '/ZWaveAPI/Run/', // Url for store data
    'lang': 'en', // Default language
    'lang_dir': 'app/core/lang/', // Language directory
    'lang_list': ["en","de","fr","es","ru"], // List of languages
    'thermostat_range': {// Min and max thermostat range
        "min":"0", 
        "max":"40"
    } 
    
  }
};
angular.forEach(config_data,function(key,value) {
  config_module.constant(value,key);
});
