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
      reboot_tz: false,
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
      });

      $scope.settings.input = cfg.zwavecfg;
      $scope.settings.input.cit_identifier = cfg.system_info.cit_identifier;
      $scope.settings.lastCITIdentifier = cfg.system_info.cit_identifier;
      $scope.settings.lastTZ = cfg.zwavecfg.time_zone.replace(/_/g, ' ');

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

      if (input.time_zone !== $scope.settings.lastTZ.replace(/ /g,'_')) {
          var data = {
              "time_zone": input.time_zone.replace(/ /g, '_')
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

      if ($scope.settings.reboot && !$scope.settings.reboot_tz) {
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
          });
      }
  };
});