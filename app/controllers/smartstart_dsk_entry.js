/**
 * @overview Handles Z-Wave SmartStart process.
 * @author Martin Vach
 */


/**
 * The controller that include device with DSK.
 * @class SmartStartDskController
 */
appController.controller('SmartStartDskEntryController', function ($scope, $timeout, cfg, dataService, deviceService, _) {
  $scope.dsk = {
      alert: {},
      input: {
          dsk_1: '',
          dsk_2: '',
          dsk_3: '',
          dsk_4: '',
          dsk_5: '',
          dsk_6: '',
          dsk_7: '',
          dsk_8: ''
      },
      state: null,
      list: [],
      response: ''
  };
  // Copy original input values
  $scope.origInput = angular.copy($scope.dsk.input);
   /**
   * Split string into 8 substrings and then fill DSK inputs
   */
  $scope.fillInput = function (e) {
    var txt = e.originalEvent.clipboardData.getData('text/plain');
    if(txt){
      angular.forEach(txt.split('-'),function(v,k){
        $scope.dsk.input['dsk_' + (k+1)] = v.substring(0, 5);
      });
    }
   
  }
  /**
   * Check if SDK version match
   */
  //console.log(deviceService.compareVersion(cfg.SDKVersion, cfg.smart_start.required_min_sdk, '>='))
  $scope.checkSdkVersion = function () {
      if(!deviceService.compareVersion(cfg.SDKVersion, cfg.smart_start.required_min_sdk, '>=')){
          $scope.dsk.alert = {message: $scope._t('Your device does not support SmartStart. Please upgrade your firmware'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
      }
  }
  //$scope.checkSdkVersion();

  /**
   * Add DSK 
   * @returns {undefined}
   */
  $scope.addDskProvisioningList = function () {
      var dsk = _.map($scope.dsk.input, function (v) {
          return v;
      }).join('-');
     
      $scope.dsk.state = 'registering';
      $scope.toggleRowSpinner(cfg.add_dsk);
      dataService.getApi('add_dsk_provisioning_list', dsk, true).then(function (response) {

          $timeout(function () {
              // Set state
              $scope.dsk.state = 'success-register';
              // Reset model
              $scope.dsk.input = angular.copy($scope.origInput);
              // Set response
              $scope.dsk.response = response.data[0];

          }, 1000);

      }, function (error) {
          $scope.dsk.state = null;
          alertify.alertError($scope._t('error_update_data'));
      }).finally(function () {
          $timeout($scope.toggleRowSpinner, 1000);
      });
  };


});