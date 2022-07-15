angApp.directive('zWaveEncryptionKeys', function (dataService, cfg) {
  return {
    restrict: 'E',
    transclude: true,
    template: `<button class="btn btn-primary" ng-click="download()">{{_t('encryptionKeys')}}</button>`,
    link: function ($scope) {
      $scope.download = function () {
        dataService.getApi('encryptionKeys').then((response) => {
          if (response.data.data) {
            const element = document.createElement("a");
            element.download = response.data.data.id ?? 'encryptionKeys' + '.txt';
            element.href = URL.createObjectURL(new Blob([response.data.data.keys.map((key, index) => {
              return (index ? '9F' : '98') + ';' + (key ?? new Array(16).fill(0))
                .map(e => (+e).toString(16).padStart(2, '0').toUpperCase()).join('') + ';1';
            }).join('\n\r')], {type: "text/plain;charset=utf-8"}))
            element.click();
            element.remove();
          }
        }).catch(console.error);
      }
    }
  }
});
