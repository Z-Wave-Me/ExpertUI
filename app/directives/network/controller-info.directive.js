angApp.directive('zWaveMoreOptions', function (dataService, _, $http) {
  return {
    restrict: 'E',
    transclude: true,
    template: `
      <a ng-href="https://z-wave.me/hardware-capabilities/?uuid={{zWaveMoreOptionsUUID}}" target="_blank">{{_t('getMoreOptions')}} </a>
      <div ng-if="updatable">
        <span class="help-text" ><i class="fa text-info fa-info-circle"></i> Local: '{{currentLicense}}' vs Remote: '{{remoteLicense}}'</span>
        <button class="btn btn-primary" ng-click="getLicense({scratch:remoteLicense})">{{_t('btn_licence_verify')}}</button>
      </div>
    `,
    link: function ($scope, element, attrs) {
      $scope.zWaveMoreOptionsUUID = $scope.master['controller.data.uuid'].replace(/^0+/, '');
      $scope.currentLicense = $scope.master['controller.data.firmware.caps.crc.value'];
      $scope.updatable = !$scope.currentLicense;
      $scope.getLicense = dataService.getLicense
      $http({
        method: 'get',
        url:  'https://service.z-wave.me/hardware/capabilities/?uuid=' + $scope.zWaveMoreOptionsUUID
      }).then(
        function (data) {
          if (data) {
            if (data.data.crc === '0') {
              $scope.updatable = false;
            }
            $scope.remoteLicense = data.data.license;
          }
        }
      ).catch(console.error)
    }
  }
})
