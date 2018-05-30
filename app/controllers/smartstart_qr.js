/**
 * The controller that include device by scanning QR code.
 * @class SmartStartQrController
 */
appController.controller('SmartStartQrController', function ($scope, $timeout) {
  $scope.qrcode = {
      input: {
          qrcode: ''
      },
      state: 'start'
  };

  /**
   * Reset state to start
   */
  $scope.resetState = function () {
      $scope.qrcode.state = 'start';
      $scope.reloadData();
  };
  /**
   * Scan QR code
   */
  $scope.scan = function (error) {
      $scope.qrcode.state = 'scanning';
      $timeout(function () {
          $scope.qrcode.state = (error ? 'error' : 'success-scan');
      }, 4000);
  };

  /**
   * Discover the device
   */
  $scope.discover = function () {
      $scope.qrcode.state = 'discovering';
      $timeout(function () {
          $scope.qrcode.state = 'success-discover';
      }, 2000);
  };

});