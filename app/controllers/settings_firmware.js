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