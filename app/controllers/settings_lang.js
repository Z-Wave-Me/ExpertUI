/**
 * This controller renders and handles language settings.
 * @class SettingsLangController
 *
 */
appController.controller('SettingsLangController', function ($scope, $timeout,$window,$cookies,dataService,deviceService) {
  /**
    * Set app language
    * @param {string} lang
    */
   $scope.setLang = function (lang) {
       //$window.alert($scope._t('language_select_reload_interface'));

       alertify.confirm($scope._t('change_date_time_format'))
           .setting('labels', {'ok': $scope._t('yes'),'cancel': $scope._t('no')})
           .set('onok', function (closeEvent) {//after clicking OK
               var input = $scope.cfg.lang_date_time_format[lang]
               dataService.postApi('configupdate_url', input).then(function (response) {
                   deviceService.showNotifier({message: $scope._t('reloading')});
                   deviceService.showNotifier({message: $scope._t('update_successful')});
                   $cookies.lang = lang;
                   $scope.lang = lang;
                   $timeout( function() {
                       $window.location.reload();
                   }, 1000);

               }, function (error) {
                   alertify.alertError($scope._t('error_update_data'));
               });
           })
           .set('oncancel', function (closeEvent) {
               deviceService.showNotifier({message: $scope._t('reloading')});
               $cookies.lang = lang;
               $scope.lang = lang;
               $timeout( function() {
                   $window.location.reload();
               }, 1000);
           });


   };
});