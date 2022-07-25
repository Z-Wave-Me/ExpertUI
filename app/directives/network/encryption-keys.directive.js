angApp.directive('zWaveEncryptionKeys', function (cfg) {
  return {
    restrict: 'E',
    transclude: true,
    template: `<a class="btn btn-primary" href="{{cfg.encryptionKeys}}" download>{{_t('encryptionKeys')}}</a>`
  }
});
