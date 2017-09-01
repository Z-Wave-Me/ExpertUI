/**
 * App configuration
 * @author Martin Vach
 * @author Martin Hartnagel
 */
var config_data = {
    'cfg': {
        'environment': 'live',
        'dev_host': [],
        'app_name': 'Z-Wave Expert S2',
        'app_version': '1.3.1-RC-8',
        'app_built': '01-09-2017 21:34:52',
        'app_id': 'ExpertUI',
        'custom_ip': false,
        'user_field': 'USERXXXX',
        'pass_field': 'PSWDXXXX',
        'interval': 1000, // Set interval in miliseconds to refresh data
        'zniffer_interval': 3000, // Set interval in milisecondsfor zniffer
        'queue_interval': 1000, // Set interval in miliseconds to refresh queue data
        'reorg_interval': 3000, // Set interval in miliseconds to refresh reorganizations
        'route_update_timeout': 15000, // Maximum time in miliseconds to wait for an update-route
        //'server_url': 'http://zwave.dyndns.org:8083/', // Remote JSON
        'local_data_url': 'app/data/',
        'server_url': '', // Remote JSON
        'dongle': 'zway', // Default dongle
        'dongle_list': [],// Dongle list

        // APIs with dongle
        'update_url': '/ZWaveAPI/Data/', // Url for update (refresh data)
        'store_url': '/ZWaveAPI/Run/', // Url for store data
        'restore_url': '/ZWaveAPI/Restore', // Url to restore backup
        'queue_url': '/ZWaveAPI/InspectQueue', // Url for inspect queue
        'fw_update_url': '/ZWaveAPI/FirmwareUpdate', // Url for Firmware Update
        'zme_bootloader_upgrade': '/ZWaveAPI/ZMEBootloaderUpgrade', // ZME Bootloader upgrade url
        'zme_firmware_upgrade': '/ZWaveAPI/ZMEFirmwareUpgrade', // ZME Firmware upgrade url
        'upload_bootloader': '/ZWaveAPI/ZMEBootloaderUpgrade', // Bootloader upload api
        'upload_firmware': '/ZWaveAPI/ZMEFirmwareUpgrade', // Firmware upload api
        'license_load_url': '/ZWaveAPI/ZMELicense', // Url to load new license
        'stat_url': '/ZWaveAPI/CommunicationStatistics', // Url to statistics
        'postfixget_url': '/ZWaveAPI/PostfixGet', // Postfix GET
        'postfixadd_url': '/ZWaveAPI/PostfixAdd', // Postfix Add
        'postfixremove_url': '/ZWaveAPI/PostfixRemove', // Postfix Remove
        'checklinks': '/ZWaveAPI/CheckAllLinks', // check link health
        'zniffer_url': '/ZWaveAPI/Zniffer', // Zniffer
        'communication_history_url': '/ZWaveAPI/CommunicationHistory', // Communication History
        'rssi_chart': '/ZWaveAPI/RSSIGet', // chart of rssi channels 1 and 2
        'configget_url': '/ZWaveAPI/ExpertConfigGet', // Config get
        'configupdate_url': '/ZWaveAPI/ExpertConfigUpdate', // Config update
        'call_all_nif': '/ZWaveAPI/CallForAllNIF', // Call niff for all devices
        'test_node': '/ZWaveAPI/TestNode/', // Test node command
        'network_statistics': '/ZWaveAPI/Run/', // Set time zone
        'post_report_api': '/ZWaveAPI/sendZWayReport', // Post report url
        'reorg_run_url': '/ZWaveAPI/NetworkReorganization', // Url to start reorganization
        'reorg_log_url': '/ZWaveAPI/GetReorganizationLog', // Url to load log
        'zddx_create_url': '/ZWaveAPI/CreateZDDX/', // Create zddx file
        'get_network_statistics': '/ZWaveAPI/GetStatisticsData', // get network statistics

        // Other APIs
        'packet_log': '/ZWaveAPI/PacketLog', // Get Packet log
        'session': '/ZAutomation/api/v1/session',
        'zwave_list': '/ZWave/list', // Zwave list of dongles
        'firmwareupdate': '/ZAutomation/api/v1/system/webif-access',
        'time': '/ZAutomation/api/v1/system/time/get',// Get time
        'time_zone': '/ZAutomation/api/v1/system/timezone', // Set time zone
        'wifi_settings': '/ZAutomation/api/v1/system/wifi/settings', // Set wifi settings ssid and password
        'login': '/ZAutomation/api/v1/login',// Get time
        'instances': '/ZAutomation/api/v1/instances',
        'upload_file': '/ZAutomation/api/v1/upload/file', // upload a file
        'load_image': '/ZAutomation/api/v1/load/image/', // load image from automation storage
        'app_built_info': 'app/info.json',// App build info
        'post_report_url': 'https://service.z-wave.me/report/', // Post report url
        'runjs_url': '/JS/Run/', // Url for running JS
        'device_classes_url': '/translations/DeviceClasses.xml', // Url to Device Classes
        'alarms_url': '/translations/Alarms.xml', // Url to Alarms
        'zwave_classes_url': 'storage/data/ZWave_cmd_classes.xml', // Url to Zwave Classes
        'config_url': '/config/', // Url for store config data
        'logout_url': '/ZAutomation/api/v1/logout',// Url for logout
        'ntpdate_service': '/ZAutomation/api/v1/system/time/ntp/', // Url to check and control ntp date service
        'box_reboot': '/ZAutomation/api/v1/system/reboot', // reboot box
        'system_info_url': '/ZAutomation/api/v1/system/info', // Sytem info
        'installer_auth': '/ZAutomation/api/v1/system/certfxAuth', // Installer initialization
        'identifier_update': '/ZAutomation/api/v1/system/certfxUpdateIdentifier', // Identifier update
        'cit_forward_login':'/ZAutomation/api/v1/system/certfxAuthForwarding', // forward cit login
        'cit_unregister':'/ZAutomation/api/v1/system/certfxUnregister', // unregister cit
        //'reorg_log_url': '/config/reorg.log', // Url for store reorg log data
        'zddx_url': '/ZDDX/', // Url for zddx xml files
        'notes_url': '/config/notes.log', // Url for store notes data
        'uzb_url': 'https://service.z-wave.me/expertui/uzb/', // Url for uzb data
        'license_url': 'https://service.z-wave.me/licence/upgrade.php', // Url for license key
        'buy_licence_key': 'https://www.z-wave.me/index.php?id=41', // Buy licence key url
        'smarthome_login': '/smarthome/#/?fromexpert', // Smarthome login page
        'lang_dir': 'app/lang/', // Language directory
        'lang': 'en', // Default language
        'lang_list': ['en', 'de', 'fr', 'es', 'ru', 'cz', 'sk', 'sv', 'cn'], // List of languages
        'page_results_history': 20, // List of languages
        'frequency': {
            0: 'EU',
            1: 'RU',
            2: 'IN',
            6: 'CN',
            10: 'MY',
            4: 'ANZ',
            5: 'HK',
            8: 'KR',
            7: 'JP',
            3: 'US',
            9: 'IL'
        }, // List of frequencies

        // Thermostat settings
        'thermostat': {
            'c': {// °C Min and max range and step
                "step": 0.5,//Value between steps in snapping on the scale
                "min": 0,
                "max": 40
            },
            'f': {// °F Min and max range
                "step": 1,
                "min": 41,
                "max": 104
            }
        },
        // Image path
        'img': {
            'batteries': 'app/images/batteries/'
        },
        // Zwave config
        'zwavecfg': {
            // Debug mode
            'debug': false,
            //Network name
            'network_name': 'My network',
            //Date format
            'date_format': 'yyyy-mm-dd',
            //Time format
            'time_format': '12',
            //Timezone
            'time_zone': '',
            //Notes
            'notes': '',
            //wifi password
            'wifi_password': '',
            //ssid name
            'ssid_name': ''
        },
        'lang_date_time_format': {
            'en': {
                'date_format': 'yyyy-mm-dd',
                'time_format': '12'
            },
            'de': {
                'date_format': 'dd.mm.yyyy',
                'time_format': '24'
            },
            'fr': {
                'date_format': 'dd/mm/yyyy',
                'time_format': '24'
            },
            'es': {
                'date_format': 'dd/mm/yyyy',
                'time_format': '24'
            },
            'ru': {
                'date_format': 'dd.mm.yyyy',
                'time_format': '24'
            },
            'cz': {
                'date_format': 'dd.mm.yyyy',
                'time_format': '24'
            },
            'sk': {
                'date_format': 'dd.mm.yyyy',
                'time_format': '24'
            },
            'sv': {
                'date_format': 'yyyy-mm-dd',
                'time_format': '24'
            },
            'cn': {
                'date_format': 'yyyy-mm-dd',
                'time_format': '24'
            }
        },
        // busy_indicator
        'busy_indicator': {
            queueLength: 0,
            busyLength: 0,
            result: 0,
            arrCnt: {}
        },
        // Auth
        'auth': {
            'login': 'admin',
            'password': 'admin1'
        },
        // Pages without authorization
        'no_auth_pages':['','init'],
        // Date format list
        'date_format_list': ['dd.mm.yyyy', 'dd-mm-yyyy', 'yyyy-mm-dd', 'yyyy/mm/dd', 'mm/dd/yyyy', 'dd/mm/yyyy'],
        // Time format list
        'time_format_list': ['24', '12'],
        // Timezone
        'time_zone_list': ["UTC", "Etc/UTC", "Africa/Abidjan", "Africa/Accra", "Africa/Addis Ababa", "Africa/Algiers", "Africa/Asmara", "Africa/Bamako", "Africa/Bangui", "Africa/Banjul", "Africa/Bissau", "Africa/Blantyre", "Africa/Brazzaville", "Africa/Bujumbura", "Africa/Casablanca", "Africa/Ceuta", "Africa/Conakry", "Africa/Dakar", "Africa/Dar es Salaam", "Africa/Djibouti", "Africa/Douala", "Africa/El Aaiun", "Africa/Freetown", "Africa/Gaborone", "Africa/Harare", "Africa/Johannesburg", "Africa/Kampala", "Africa/Khartoum", "Africa/Kigali", "Africa/Kinshasa", "Africa/Lagos", "Africa/Libreville", "Africa/Lome", "Africa/Luanda", "Africa/Lubumbashi", "Africa/Lusaka", "Africa/Malabo", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane", "Africa/Mogadishu", "Africa/Monrovia", "Africa/Nairobi", "Africa/Ndjamena", "Africa/Niamey", "Africa/Nouakchott", "Africa/Ouagadougou", "Africa/Porto-Novo", "Africa/Sao Tome", "Africa/Tripoli", "Africa/Tunis", "Africa/Windhoek", "America/Adak", "America/Anchorage", "America/Anguilla", "America/Antigua", "America/Araguaina", "America/Argentina/Buenos Aires", "America/Argentina/Catamarca", "America/Argentina/Cordoba", "America/Argentina/Jujuy", "America/Argentina/La Rioja", "America/Argentina/Mendoza", "America/Argentina/Rio Gallegos", "America/Argentina/Salta", "America/Argentina/San Juan", "America/Argentina/Tucuman", "America/Argentina/Ushuaia", "America/Aruba", "America/Asuncion", "America/Atikokan", "America/Bahia", "America/Barbados", "America/Belem", "America/Belize", "America/Blanc-Sablon", "America/Boa Vista", "America/Bogota", "America/Boise", "America/Cambridge Bay", "America/Campo Grande", "America/Cancun", "America/Caracas", "America/Cayenne", "America/Cayman", "America/Chicago", "America/Chihuahua", "America/Costa Rica", "America/Cuiaba", "America/Curacao", "America/Danmarkshavn", "America/Dawson", "America/Dawson Creek", "America/Denver", "America/Detroit", "America/Dominica", "America/Edmonton", "America/Eirunepe", "America/El Salvador", "America/Fortaleza", "America/Glace Bay", "America/Goose Bay", "America/Grand Turk", "America/Grenada", "America/Guadeloupe", "America/Guatemala", "America/Guayaquil", "America/Guyana", "America/Halifax", "America/Havana", "America/Hermosillo", "America/Indiana/Indianapolis", "America/Indiana/Knox", "America/Indiana/Marengo", "America/Indiana/Petersburg", "America/Indiana/Tell City", "America/Indiana/Vevay", "America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Inuvik", "America/Iqaluit", "America/Jamaica", "America/Juneau", "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/La Paz", "America/Lima", "America/Los Angeles", "America/Maceio", "America/Managua", "America/Manaus", "America/Marigot", "America/Martinique", "America/Matamoros", "America/Mazatlan", "America/Menominee", "America/Merida", "America/Mexico City", "America/Miquelon", "America/Moncton", "America/Monterrey", "America/Montevideo", "America/Montreal", "America/Montserrat", "America/Nassau", "America/New York", "America/Nipigon", "America/Nome", "America/Noronha", "America/North Dakota/Center", "America/North Dakota/New Salem", "America/Ojinaga", "America/Panama", "America/Pangnirtung", "America/Paramaribo", "America/Phoenix", "America/Port of Spain", "America/Port-au-Prince", "America/Porto Velho", "America/Puerto Rico", "America/Rainy River", "America/Rankin Inlet", "America/Recife", "America/Regina", "America/Rio Branco", "America/Santa Isabel", "America/Santarem", "America/Santo Domingo", "America/Sao Paulo", "America/Scoresbysund", "America/Shiprock", "America/St Barthelemy", "America/St Johns", "America/St Kitts", "America/St Lucia", "America/St Thomas", "America/St Vincent", "America/Swift Current", "America/Tegucigalpa", "America/Thule", "America/Thunder Bay", "America/Tijuana", "America/Toronto", "America/Tortola", "America/Vancouver", "America/Whitehorse", "America/Winnipeg", "America/Yakutat", "America/Yellowknife", "Antarctica/Casey", "Antarctica/Davis", "Antarctica/DumontDUrville", "Antarctica/Macquarie", "Antarctica/Mawson", "Antarctica/McMurdo", "Antarctica/Rothera", "Antarctica/South Pole", "Antarctica/Syowa", "Antarctica/Vostok", "Arctic/Longyearbyen", "Asia/Aden", "Asia/Almaty", "Asia/Anadyr", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Baghdad", "Asia/Bahrain", "Asia/Baku", "Asia/Bangkok", "Asia/Beirut", "Asia/Bishkek", "Asia/Brunei", "Asia/Choibalsan", "Asia/Chongqing", "Asia/Colombo", "Asia/Damascus", "Asia/Dhaka", "Asia/Dili", "Asia/Dubai", "Asia/Dushanbe", "Asia/Gaza", "Asia/Harbin", "Asia/Ho Chi Minh", "Asia/Hong Kong", "Asia/Hovd", "Asia/Irkutsk", "Asia/Jakarta", "Asia/Jayapura", "Asia/Kabul", "Asia/Kamchatka", "Asia/Karachi", "Asia/Kashgar", "Asia/Kathmandu", "Asia/Kolkata", "Asia/Krasnoyarsk", "Asia/Kuala Lumpur", "Asia/Kuching", "Asia/Kuwait", "Asia/Macau", "Asia/Magadan", "Asia/Makassar", "Asia/Manila", "Asia/Muscat", "Asia/Nicosia", "Asia/Novokuznetsk", "Asia/Novosibirsk", "Asia/Omsk", "Asia/Oral", "Asia/Phnom Penh", "Asia/Pontianak", "Asia/Pyongyang", "Asia/Qatar", "Asia/Qyzylorda", "Asia/Rangoon", "Asia/Riyadh", "Asia/Sakhalin", "Asia/Samarkand", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Taipei", "Asia/Tashkent", "Asia/Tbilisi", "Asia/Tehran", "Asia/Thimphu", "Asia/Tokyo", "Asia/Ulaanbaatar", "Asia/Urumqi", "Asia/Vientiane", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yekaterinburg", "Asia/Yerevan", "Atlantic/Azores", "Atlantic/Bermuda", "Atlantic/Canary", "Atlantic/Cape Verde", "Atlantic/Faroe", "Atlantic/Madeira", "Atlantic/Reykjavik", "Atlantic/South Georgia", "Atlantic/St Helena", "Atlantic/Stanley", "Australia/Adelaide", "Australia/Brisbane", "Australia/Broken Hill", "Australia/Currie", "Australia/Darwin", "Australia/Eucla", "Australia/Hobart", "Australia/Lindeman", "Australia/Lord Howe", "Australia/Melbourne", "Australia/Perth", "Australia/Sydney", "Europe/Amsterdam", "Europe/Andorra", "Europe/Athens", "Europe/Belgrade", "Europe/Berlin", "Europe/Bratislava", "Europe/Brussels", "Europe/Bucharest", "Europe/Budapest", "Europe/Chisinau", "Europe/Copenhagen", "Europe/Dublin", "Europe/Gibraltar", "Europe/Guernsey", "Europe/Helsinki", "Europe/Isle of Man", "Europe/Istanbul", "Europe/Jersey", "Europe/Kaliningrad", "Europe/Kiev", "Europe/Lisbon", "Europe/Ljubljana", "Europe/London", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Mariehamn", "Europe/Minsk", "Europe/Monaco", "Europe/Moscow", "Europe/Oslo", "Europe/Paris", "Europe/Podgorica", "Europe/Prague", "Europe/Riga", "Europe/Rome", "Europe/Samara", "Europe/San Marino", "Europe/Sarajevo", "Europe/Simferopol", "Europe/Skopje", "Europe/Sofia", "Europe/Stockholm", "Europe/Tallinn", "Europe/Tirane", "Europe/Uzhgorod", "Europe/Vaduz", "Europe/Vatican", "Europe/Vienna", "Europe/Vilnius", "Europe/Volgograd", "Europe/Warsaw", "Europe/Zagreb", "Europe/Zaporozhye", "Europe/Zurich", "Indian/Antananarivo", "Indian/Chagos", "Indian/Christmas", "Indian/Cocos", "Indian/Comoro", "Indian/Kerguelen", "Indian/Mahe", "Indian/Maldives", "Indian/Mauritius", "Indian/Mayotte", "Indian/Reunion", "Pacific/Apia", "Pacific/Auckland", "Pacific/Chatham", "Pacific/Efate", "Pacific/Enderbury", "Pacific/Fakaofo", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Galapagos", "Pacific/Gambier", "Pacific/Guadalcanal", "Pacific/Guam", "Pacific/Honolulu", "Pacific/Johnston", "Pacific/Kiritimati", "Pacific/Kosrae", "Pacific/Kwajalein", "Pacific/Majuro", "Pacific/Marquesas", "Pacific/Midway", "Pacific/Nauru", "Pacific/Niue", "Pacific/Norfolk", "Pacific/Noumea", "Pacific/Pago Pago", "Pacific/Palau", "Pacific/Pitcairn", "Pacific/Ponape", "Pacific/Port Moresby", "Pacific/Rarotonga", "Pacific/Saipan", "Pacific/Tahiti", "Pacific/Tarawa", "Pacific/Tongatapu", "Pacific/Truk", "Pacific/Wake", "Pacific/Wallis"],
        // Route - will be extended
        route: {
            // Time zone
            time: {
                string: false,
                timestamp: false,
                offset: false
            },
            // Host name
            host: ''
        },
        // Controller
        controller: {
            homeName: 'MY NETWORK',
            isRealPrimary: false,
            homeId: 1,
            homeIdHex: '#',
            hasDevices: false,
            zwayNodeId: 1,
            APIVersion: ''
        },

        // System info
        system_info: {},
        // Required version for analytics
        analytics: {
            show: false
        },
        // Firmware target
        firmware_target: ['zwave_chip','additional_chip'],
        // Expert commands table with values
        expert_cmd: {
            Configuration:{
                valArray: true,
                ccName: 'Configuration',
                th: ['val']
            },
            Association: {
                valArray: true,
                ccName: 'Association',
                th: ['nodes']
            },
            SensorBinary: {
                valArray: true,
                ccName: 'SensorBinary',
                th: ['level']
            },
            ThermostatSetPoint: {
                valArray: true,
                ccName: 'ThermostatSetPoint',
                th: ['val']
            },
            Basic: {
                valArray: false,
                ccName: 'Basic',
                th: ['level']
            },
            SwitchBinary: {
                valArray: false,
                ccName: 'SwitchBinary',
                th: ['level']
            },
            SwitchAll: {
                valArray: false,
                ccName: 'SwitchAll',
                th: ['mode']
            },
            Wakeup: {
                valArray: false,
                ccName: 'Wakeup',
                th: ['interval','nodeId']
            },
            PowerLevel: {
                valArray: false,
                ccName: 'PowerLevel',
                th: ['level','timeout']
            }
        },
        // Upload settings
        'upload': {
            'fw_or_bootloader': {
                extension: ['bin', 'hex','ota']
            },
            'restore_from_backup': {
                extension: ['zbk']
            },
            'routemap': {
                size: 512000, //Bytes
                type: ['image/jpeg'],
                extension: ['jpg'],
                dimension: '200 x 200'//px
            }
        },
        // List of the find hosts
        'find_hosts': [
            'find.z-wave.me',
            'find.popp.eu',
            'findcit.z-wavealliance.org'
        ],
        // Find cit host name
        'find_cit': {
            //'hostname':'find.zwave.me',
            'hostname':'findcit.z-wavealliance.org'
        },
        // Redirect to the url after logout
        'logout_redirect': {
            //'findcit.z-wavealliance.org': 'https://find.zwave.me/zboxweb',
            'findcit.z-wavealliance.org': 'https://findcit.z-wavealliance.org/zboxweb'
        },
        // Url to check if is on-line
        'ping': {
            'findcit': 'https://findcit.z-wavealliance.org'
        },
        // ---------------------------------- Custom config for specifics app_type ---------------------------------- //
        // Application type : default/installer/wd/popp/jb
        'app_type': 'default',
        'custom_cfg': {
            'default': {
                'logo': 'app/images/zplus.jpg',
                'footer_text': '&COPY; 2017 by Z-Wave.Me',
                'logout': '/smarthome/#/logout',
                'version_type': '',
                'title': 'Z-Wave Expert UI',
                'controller_name': 'Z-Way',
                'hardware_vendor': 'RaZberry by Z-Wave.Me',
                'latest_version_url': 'https://razberry.z-wave.me/z-way/razberry/latest/VERSION'
            },
            'installer': {
                'logo': 'app/images/z-wave-aliance-logo.png',
                'footer_text': '&COPY; 2017 Z-Wave Alliance',
                'logout': '#/logout',
                'version_type': '',
                'title': 'Z-Wave CIT',
                'controller_name': 'CIT',
                'hardware_vendor': 'Z-Wave Alliance',
                'latest_version_url': 'https://razberry.z-wave.me/z-way/cit/latest/VERSION'
                },
            'wd': {
                'logo': 'app/images/zplus.jpg',
                'footer_text': '&COPY; 2017 by Z-Wave.Me',
                'logout': '/smarthome/#/logout',
                'version_type': '',
                'title': 'Z-Wave Expert UI',
                'controller_name': 'Z-Way',
                'hardware_vendor': 'RaZberry by Z-Wave.Me'
            },
            'popp': {
                'logo': 'app/images/zplus.jpg',
                'footer_text': '&COPY; 2017 by Z-Wave.Me',
                'logout': '/smarthome/#/logout',
                'version_type': '',
                'title': 'Z-Wave Expert UI',
                'controller_name': 'Z-Way',
                'hardware_vendor': 'RaZberry by Z-Wave.Me',
                'latest_version_url': 'https://razberry.z-wave.me/z-way/popp_rpi/latest/VERSION'

            },
            'jb': {
                'logo': 'app/images/zplus.jpg',
                'footer_text': '&COPY; 2017 by Z-Wave.Me',
                'logout': '/smarthome/#/logout',
                'version_type': '',
                'title': 'Z-Wave Expert UI',
                'controller_name': 'Z-Way',
                'hardware_vendor': 'RaZberry by Z-Wave.Me',
                'latest_version_url': 'https://razberry.z-wave.me/z-way/poppbox/latest/VERSION'
            }
        }

    }
};
