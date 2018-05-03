
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