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
appController.controller('SettingsAppController', function ($scope, $timeout, $window, $interval, $location, $q, $filter,cfg,dataService,deviceService) {
    $scope.settings = {
        input: {},
        wait: false,
        lastTZ: "",
        lastSsid: "",
        lastCITIdentifier: "",
        updateCITIdentifier: false,
        modalCancel: false,
        countdown: 60,
        ntp: {
            status: {},
            synchronized: false,
            active: false
        },
        show_tz: false,
        reboot: false,
        ntp_switch: '',
        wifi_pwd_changed: false,
        show_update_successful: false,
        update_message: false
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
            alertify.alertError($scope._t('err_get_wifi'));
        });

        $scope.settings.input = cfg.zwavecfg;
        $scope.settings.input.cit_identifier = cfg.system_info.cit_identifier;
        $scope.settings.lastCITIdentifier = cfg.system_info.cit_identifier;
        $scope.settings.lastTZ = cfg.zwavecfg.time_zone;

        // add logged in user login input by default
        $scope.settings.input.user = $scope.user && $scope.user.login? $scope.user.login : '';

        //// get system info settings
        /*dataService.getApi('cit_forward_login').then(function (response) {
            if (response.data.data && response.data.data.forwardCITAuth) {
                $scope.settings.input.forward_login = response.data.data.forwardCITAuth;
            } else {
                $scope.settings.input.forward_login = false
            }
        }, function (error) {
            $scope.settings.input.forward_login = false
            $scope.loading = false;
            alertify.alertError($scope._t('err_cit_get_forward_login'));
        });*/
    };

    $scope.loadSettings();

    /**
     * Store settings
     * @param {object} input
     */
    $scope.storeSettings = function(input,$event) {

        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('updating')};

        $scope.$watch('settings.show_update_successful', function(show_new) {
            if (show_new) {
                deviceService.showNotifier({message: $scope._t('update_successful')});
            }
        });

        if($scope.settings.lastCITIdentifier !== $scope.settings.input.cit_identifier) {

            var data = {
                "user": input.user,
                "pass": input.pass,
                "cit_identifier": input.cit_identifier
            };

            dataService.postApi('identifier_update', data).then(function (response) {
                if (!response.data.data.result) {
                    $scope.settings.show_update_successful = false;
                    alertify.alertError($scope._t('err_cit_update_identifier') + ' ' + response.data.data.result_message);
                } else {
                    $scope.settings.show_update_successful = true;
                    $scope.settings.lastCITIdentifier = $scope.settings.input.cit_identifier;
                }
                $scope.settings.updateCITIdentifier = false;
            }, function (error) {
                $scope.settings.show_update_successful = false;

                $scope.settings.input.cit_identifier = $scope.settings.lastCITIdentifier;
                alertify.alertError($scope._t('err_cit_update_identifier'));

                $scope.settings.updateCITIdentifier = false;
            });
        }

        /*if ($scope.settings.input.forward_login !== $scope.settings.forward_login_old) {

            dataService.postApi('cit_forward_login', {forwardCITAuth: $scope.settings.input.forward_login}).then(function (response) {
                $scope.settings.show_update_successful = true;
            }, function (error) {
                $scope.settings.show_update_successful = false;
                alertify.alertError($scope._t('err_cit_set_forward_login'));
            });
        }*/


        if (($scope.settings.wifi_pwd_changed && input.wifi_password !== '') || input.ssid_name !== $scope.settings.lastSsid) {

            var data = {
                "password": input.wifi_password,
                "ssid": input.ssid_name === $scope.settings.lastSsid ? "" : input.ssid_name
            };

            dataService.postApi('wifi_settings', data, null).then(function (response) {
                $scope.settings.show_update_successful = true;
                $timeout(function () {
                    $window.location.reload();
                }, 1000);
                $scope.loading = false;
            }, function (error) {
                $scope.input.ssid_name = $scope.settings.lastSsid;
                $scope.settings.show_update_successful = false;
                alertify.alertError($scope._t('err_update_wifi'));
            });
        }

        // do not all store in expertConfig
        var newInput = _.pick(input,
            'debug',
            'network_name',
            'date_format',
            'time_format',
            'time_zone',
            'notes',
            'ssid_name',
            'currentDateTime',
            'cit_identifier');


        dataService.postApi('configupdate_url', newInput).then(function (response) {
            $scope.settings.show_update_successful = true;
            $scope.loading = false;
        }, function (error) {
            $scope.loading = false;
            $scope.settings.show_update_successful = false;
            alertify.alertError($scope._t('err_update_config_data'));
        });

        if (input.time_zone !== 'automatic' && input.time_zone !== $scope.settings.lastTZ) {
            var data = {
                "time_zone": input.time_zone
            };

            dataService.postApi('time_zone', data, null).then(function (response) {
                $scope.settings.show_update_successful = true;
                $scope.loading = false;
                $scope.handleModal('timezoneModal', $event);
                var myint = $interval(function () {
                    $scope.settings.countdown--;
                    if ($scope.settings.countdown === 0) {
                        $interval.cancel(myint);
                        $location.path('/');
                    }
                }, 1000);
            }, function (error) {
                $scope.settings.show_update_successful = false;
                alertify.alertError($scope._t('err_set_timezone'));
            });
        }

        if ($scope.settings.reboot) {
            dataService.getApi('box_reboot').then(function (response) {
                $scope.settings.show_update_successful = true;
                $scope.loading = false;
                $scope.handleModal('timezoneModal', $event);
                var myint = $interval(function () {
                    $scope.settings.countdown--;
                    if ($scope.settings.countdown === 0) {
                        $interval.cancel(myint);
                        $location.path('/');
                    }
                }, 1000);
            }, function (error) {
                $scope.settings.show_update_successful = false;
                alertify.alertError($scope._t('err_reboot'));
            });
        }
    };

    var objects = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: $scope.settings.lastTZ
    };
    var now = new Date();
    var cDT = now.toLocaleString(objects);
    cDT= cDT.replace(/\.|\, |\:/g,'-').substring(0,15).split('-');

    $scope.settings.input.currentDateTime = cDT[2]+'-'+(cDT[1].length < 2? '0'+cDT[1] : cDT[1])+'-'+(cDT[0].length < 2? '0'+cDT[0] : cDT[0])+'T'+cDT[3]+':'+cDT[4]+':00'; // transform to valid ISO-8601 local datetime format (yyyy-MM-ddTHH:mm:ss)

    /**
     * Load ntp status
     */
    $scope.loadNTPStatus = function() {

        dataService.getApi('ntpdate_service','status', true).then(function (response) {
            $scope.settings.ntp.status = response.data.data;
            $scope.settings.ntp.active = response.data.data.ntp_enabled && response.data.data.ntp_enabled == 'yes'? true : false;
            $scope.settings.ntp.synchronized = response.data.data.ntp_synchronized && response.data.data.ntp_synchronized == 'yes'? true : false;

            var ts = now.getTime();
            var split_local_st = $scope.settings.ntp.status.local_time.split(' ')
            var server_ts = (new Date(split_local_st[1] + ' ' + split_local_st[2])).getTime();
            $scope.settings.show_tz = $scope.settings.ntp.active; //((ts - server_ts) > 1800*1000 && $scope.settings.ntp.active) || !$scope.settings.ntp.active;

        }, function (error) {
            $scope.loading = false;
            alertify.alertError($scope._t('err_ntp_load_status'));
        });
    };

    $scope.loadNTPStatus();

    $scope.synchronizeNTP = function (){
        dataService.getApi('ntpdate_service','reconfigure').then(function (response) {
            if (response) {
                $scope.loadNTPStatus();
                //deviceService.showNotifier({message: $scope._t('update_successful')});
                $scope.settings.reboot = true;
            }
            $scope.loading = false;
        }, function (error) {
            $scope.loading = false;
            alertify.alertError($scope._t('err_ntp_synchronize'));
        });
    }

    $scope.setNTPMode = function (cmd){
        $scope.toggleRowSpinner(cmd);

        dataService.getApi('ntpdate_service', cmd).then(function (response) {
            if (response.data) {
                $scope.loadNTPStatus();
                //deviceService.showNotifier({message: $scope._t('update_successful')});
                $scope.settings.reboot = true;
                $scope.settings.ntp_switch = cmd;
            }
            $scope.loading = false;
            $scope.toggleRowSpinner();
        }, function (error) {
            $scope.loading = false;
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('err_ntp_set_mode'));
        });
    }

    $scope.setDateTime = function(currentDateTime) {
        if(currentDateTime) {

            var cDT = currentDateTime.replace('T',' ').substring(0,16); // transform date time string

            dataService.getApi('ntpdate_service','setDateTime?dateTime=' + cDT).then(function(response) {
                //deviceService.showNotifier({message: $scope._t('update_successful')});
                $scope.loadNTPStatus();
                $scope.loading = false;
                $scope.settings.reboot = true;
            }, function(error) {
                $scope.loading = false;
                alertify.alertError($scope._t('err_set_date_time'));
            });
        }
    };
});

/**
 * This controller renders and handles app settings for default version.
 * @class SettingsAppController
 *
 */
appController.controller('SettingsAppFormatController', function ($scope, $timeout, $window, $interval, $location, $q, cfg,dataService,deviceService) {
    $scope.settings = {
        input: cfg.zwavecfg || {},
        lastTZ: cfg.zwavecfg.time_zone,
        countdown: 60
    };

    /**
     * Store settings
     * @param {object} input
     */
    $scope.storeSettings = function(input,$event) {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('updating')};

        if(input.time_zone !== $scope.settings.lastTZ) {
            var data = {
                "time_zone": input.time_zone
            };

            dataService.postApi('time_zone', data, null).then(function (response) {
                $scope.loading = false;
                $interval.cancel($scope.jobQueueInterval);
                $scope.handleModal('timezoneModal', $event);
                var myint = $interval(function(){
                    $scope.settings.countdown--;
                    if($scope.settings.countdown === 0){
                        $interval.cancel(myint);
                        window.location.href = '/smarthome';
                    }
                }, 1000);

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
 * The controller that handles firmware update process.
 * @class SettingsFirmwareController
 *
 */
appController.controller('SettingsFirmwareController', function ($scope, $sce, $timeout, $location, $interval, cfg,dataService) {
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
        isUpToDate: false,
        remoteConnection: $scope.cfg.find_hosts.indexOf($location.host()) > -1,
        alert: false
    };

    if ($scope.firmwareUpdate.remoteConnection) {
        $scope.firmwareUpdate.alert = {message: $scope._t('firmware_update_remote'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
    }

    if (!$scope.isOnline) {
        $scope.firmwareUpdate.alert = {message: $scope._t('findcit_no_connection',{__server__: cfg.ping.findcit}), status: 'alert-warning', icon: 'fa-exclamation-circle'};
    }

    /**
     * Load latest version
     */
    $scope.loadRazLatest = function () {
        dataService.getRemoteData($scope.getCustomCfgVal('latest_version_url')).then(function (response) {
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

appController.controller('SettingsUnregisterCITController', function ($scope, $timeout, $window, $interval, $location, $q, $filter,cfg,dataService,deviceService) {
    $scope.unregisterCit = {
        input: {
            user: $scope.user && $scope.user.login? $scope.user.login : '',
            pass: ''
        }
    };

    if (!$scope.isOnline) {
        $scope.unregisterCit.alert = {message: $scope._t('findcit_no_connection',{__server__: cfg.ping.findcit}), status: 'alert-warning', icon: 'fa-exclamation-circle'};
    }

    $scope.cancel = function($event) {
        $scope.unregisterCit.input.pass = "";
        $scope.handleModal('citUnregisterModal', $event);
    };

    $scope.confirmUnregistration = function($event) {
        $scope.unregisterCIT($scope.unregisterCit.input);

        $scope.handleModal('citidentifierModal', $event);
    };

    /**
     * Store settings
     * @param {object} input
     */
    $scope.unregisterCIT = function(input,$event) {

        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('updating')};

        if ($scope.unregisterCit.input.user && $scope.unregisterCit.input.user !== '' &&
            $scope.unregisterCit.input.pass && $scope.unregisterCit.input.pass !== '') {
            dataService.postApi('cit_unregister', $scope.unregisterCit.input).then(function (response) {
                if (!response.data.data.result) {
                    alertify.alertError($scope._t('err_cit_unregister') + ' ' + response.data.data.result_message);
                } else {
                    deviceService.showNotifier({message: $scope._t('update_successful')});
                }
                $scope.loading = false;
                $scope.unregisterCit.input.pass = "";
            }, function (error) {
                alertify.alertError($scope._t('err_cit_unregister'));
                $scope.loading = false;
                $scope.unregisterCit.input.pass = "";
            });
        } else {
            alertify.alertError($scope._t('err_cit_unregister'));
            $scope.loading = false;
            $scope.unregisterCit.input.pass = "";
        }
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