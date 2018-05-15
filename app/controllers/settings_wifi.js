/**
 * This controller renders and handles wifi settings.
 * @class SettingsWifiController
 *
 */
appController.controller('SettingsWifiController', function ($scope, $timeout, $window, $cookies, dataService, deviceService) {
  $scope.wifi = {
    pwdChanged: false,
    input: {}
  };
  $scope.orig = {};
  /**
   * Load sttings data
   */
  $scope.loadSettings = function () {
    dataService.getApi('wifi_settings').then(function (response) {
      $scope.wifi.input.ssid = response.data.data.ssid;
      $scope.orig.ssid = response.data.data.ssid;
    });
  };
  $scope.loadSettings();

  /**
   * Store data
   */
  $scope.storeSettings = function (input) {
    var data = {};
    if (input.ssid !== $scope.orig.ssid) {
      data['ssid'] = input.ssid;
    }
    if (($scope.wifi.pwdChanged && input.password !== '')) {
      data['password'] = input.password;

    }

    if(!_.size(data)){
      return;
    }

    dataService.postApi('wifi_settings', data, null).then(function (response) {
      deviceService.showNotifier({
        message: $scope._t('update_successful')
      });
    }, function (error) {
      alertify.alertError($scope._t('err_update_wifi'));
    });
  };
});