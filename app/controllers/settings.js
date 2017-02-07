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
     * Send and save report
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
        console.log(input)
        //return;
        dataService.postReport(input).then(function (response) {
            $scope.loading = false;
            deviceService.showNotifier({message: $scope._t('success_send_report') + ' ' + input.email});
            $route.reload();
        }, function (error) {
            alertify.alertError($scope._t('error_send_report'));
            $scope.loading = false;
        });
    };
});