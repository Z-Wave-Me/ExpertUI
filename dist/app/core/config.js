/**
 * App configuration
 * @author Martin Vach
 * @author Martin Hartnagel
 */
var config_data = {
    'cfg': {
        'app_name': 'Expert UI',
        'app_version': '1.1.0',
        'custom_ip': false,
        'user_field': 'USERXXXX',
        'pass_field': 'PSWDXXXX',
        'interval': 3000, // Set interval in miliseconds to refresh data 
        'zniffer_interval': 3000, // Set interval in milisecondsfor zniffer
        'queue_interval': 1000, // Set interval in miliseconds to refresh queue data 
        'route_update_timeout': 15000, // Maximum time in miliseconds to wait for an update-route
        //'server_url': 'http://zwave.dyndns.org:8083/', // Remote JSON
        'local_data_url':'app/data/',
        'server_url': '', // Remote JSON
        'dongle': 'zway', // Default dongle
        'zwave_list': '/ZWaveAPI/list', // Zwave list of dongles
        'update_url': '/ZWaveAPI/Data/', // Url for update (refresh data)
        'store_url': '/ZWaveAPI/Run/', // Url for store data
        'restore_url': '/ZWaveAPI/Restore', // Url to restore backup
        'queue_url': '/ZWaveAPI/InspectQueue', // Url for inspect queue
        'fw_update_url': '/ZWaveAPI/FirmwareUpdate', // Url for Firmware Update
        'license_load_url': '/ZWaveAPI/ZMELicense', // Url to load new license
        'stat_url': '/ZWaveAPI/CommunicationStatistics', // Url to statistics
        'postfixget_url': '/ZWaveAPI/PostfixGet', // Postfix GET
        'postfixadd_url': '/ZWaveAPI/PostfixAdd', // Postfix Add
        'postfixremove_url': '/ZWaveAPI/PostfixRemove', // Postfix Remove
        //'incoming_packet_url': '/ZWaveAPI/Run/controller.data.incomingPacket', // Url to incoming packet
        //'outgoing_packet_url': '/ZWaveAPI/Run/controller.data.outgoingPacket', // Url to outgoing packet
        'zniffer_url': '/ZWaveAPI/Zniffer', // Zniffer
        'communication_history_url': '/ZWaveAPI/CommunicationHistory', // Communication History
        'rssi_chart': '/ZWaveAPI/RSSIGet', // chart of rssi channels 1 and 2
        'configget_url': '/ZWaveAPI/ExpertConfigGet', // Config get
        'configupdate_url': '/ZWaveAPI/ExpertConfigUpdate', // Config update
        'runjs_url': '/JS/Run/', // Url for running JS
        'device_classes_url': '/translations/DeviceClasses.xml', // Url to Device Classes
        'zwave_classes_url': 'storage/data/ZWave_cmd_classes.xml', // Url to Zwave Classes
        'config_url': '/config/', // Url for store config data
        'reorg_log_url': '/config/reorg.log', // Url for store reorg log data
        'zddx_url': '/ZDDX/', // Url for zddx xml files
        'zddx_create_url': '/ZWaveAPI/CreateZDDX/', // Create zddx file
        'notes_url': '/config/notes.log', // Url for store notes data
        'uzb_url': 'https://www.zwave.eu/api/expertui/uzb/', // Url for uzb data
        'license_url': 'https://store.zwaveeurope.com/license/utility_uzb.php', // Url for license key
        'buy_licence_key': 'https://www.z-wave.me/index.php?id=41', // Buy licence key url
        'smarthome_login': '/smarthome/#/?fromexpert', // Smarthome login page 
         'smarthome_logout': '/smarthome/#/logout', // Smarthome login page 
        'lang_dir': 'app/core/lang/', // Language directory
        'lang': 'en', // Default language
        'lang_list': ['en','de','fr','es','ru','cz','sk','sv','cn'], // List of languages
        'page_results_history': 20, // List of languages
        'frequency': {
            0: 'EU',
           1:' RU',
            2:'IN',
            6: 'CN',
            10: 'MY',
            4: 'ANZ_BR',
            5: 'HK',
            8: 'KR',
            7: 'JP',
            3: 'US',
            9: 'IL'
        }, // List of frequencies
        'thermostat_range': {// Min and max thermostat range
            "min": "0",
            "max": "40" 
        },
        // Image path
        'img': {
            'batteries':'app/images/batteries/'
        },
        // Zwave config
        'zwavecfg': {
            // Debug mode
            'debug': false
        },
        // ---------------------------------- Custom config for specifics app_type ---------------------------------- //
        // Application type : default/installer
        'app_type': 'installer',
         'custom_cfg': {
             'default':{
                 'logo': 'app/images/zplus.jpg',
                  'footer_text': '&COPY; 2014 by Z-Wave.Me'
             },
              'installer':{
                  'logo': 'app/images/z-wave-aliance-logo.png',
                   'footer_text': '&COPY; 2016 Z-Wave Alliance'
              }
         }

    }
};
