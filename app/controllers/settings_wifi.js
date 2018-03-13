/**
 * This controller renders and handles wifi settings.
 * @class SettingsWifiController
 *
 */
appController.controller('SettingsWifiController', function ($scope, $timeout, $window, $cookies, dataService, deviceService) {
  $scope.settingsWifi = {
    input: {
      ip: {},
      netmask: {},
      gateway: {}
    }
  };
  /**
   * Load wifi data
   */
  $scope.loadWifi = function () {
    $scope.settingsWifi.input = {
      ip: _.map('127.0.0.1'.split('.'), function (v) {
        return parseInt(v, 10);;
      }),
      netmask:  _.map('185.142.0.1'.split('.'), function (v) {
        return parseInt(v, 10);;
      }),
      gateway: _.map('192.168.10.214'.split('.'), function (v) {
        return parseInt(v, 10);;
      })
    }
    dataService.getApi('cit_wifi').then(function (response) {
      
    });
  };
  $scope.loadWifi();
  /**
   * Store wifi data
   */
  $scope.storeWifi = function (data) {
    console.log(data)
    var input = {
      ip: _.map(data.ip, function (v) {
        return v;
      }).join('.'),
      netmask: _.map(data.netmask, function (v) {
        return v;
      }).join('.'),
      gateway: _.map(data.gateway, function (v) {
        return v;
      }).join('.')
    }

   dataService.postApi('cit_wifi', input).then(function (response) {
      deviceService.showNotifier({message: $scope._t('update_successful')});
    }, function (error) {
      alertify.alertError($scope._t('error_update_data'));
    });
  };
});