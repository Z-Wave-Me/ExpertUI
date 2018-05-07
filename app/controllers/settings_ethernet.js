/**
 * This controller renders and handles ethernet settings.
 * @class SettingsEthernetController
 *
 */
appController.controller('SettingsEthernetController', function ($scope, $timeout, $window, $cookies, dataService, deviceService) {
  $scope.ethernet = {
    input: {
      ip: {},
      netmask: {},
      gateway: {}
    }
  };
  /**
   * Load sttings data
   */
  $scope.loadSettings = function () {
    /* $scope.ethernet.input = {
      ip: _.map('127.0.0.1'.split('.'), function (v) {
        return parseInt(v, 10);;
      }),
      netmask:  _.map('185.142.0.1'.split('.'), function (v) {
        return parseInt(v, 10);
      }),
      gateway: _.map('192.168.10.214'.split('.'), function (v) {
        return parseInt(v, 10);;
      })
    } */
    dataService.getApi('cit_wifi').then(function (response) {
      $scope.ethernet.input = {
        ip: _.map(response.data.data.ip.split('.'), function (v) {
          return parseInt(v, 10);;
        }),
        netmask:  _.map(response.data.data.netmask.split('.'), function (v) {
          return parseInt(v, 10);
        }),
        gateway: _.map(response.data.data.gateway.split('.'), function (v) {
          return parseInt(v, 10);;
        })
      }
    });
  };
  $scope.loadSettings();
  /**
   * Store data
   */
  $scope.storeSettings = function (data) {
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