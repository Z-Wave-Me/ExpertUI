
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