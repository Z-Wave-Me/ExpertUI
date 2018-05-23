/**
 * @overview This controller renders and handles dsk list.
 * @author Martin Vach
 */

/**
 * DSK list controller
 * @class DskListController
 *
 */
appController.controller('DskListController', function($scope, $filter, $timeout,$interval,dataService, cfg,_) {
  $scope.dsk = {
       all: [],
       devices:{}
  };

  /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
      dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
          $scope.dsk.devices[nodeId] = {
            id: nodeId,
            name: $filter('deviceName')(nodeId, node)
          };
        });
      });
  };
 

  /**
   * Load DSK list
   */
  var loadDskList = function () {
    $scope.loadZwaveData();
   dataService.getApi('get_dsk', null, true).then(function (response) {
    //dataService.getApiLocal('dsk-collection.json').then(function (response) {
      var data = response.data;
      if (_.isEmpty(data)) {
        $scope.alert = {message: $scope._t('empty_dsk_list'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
        return;
      }
      $scope.dsk.all = _.filter(data, function (v) {
        var typeId = $filter('decToHex')(parseInt(v.ZW_QR_TLVVAL_PRODUCTID_ZWPRODUCTTYPE), 2, '0x');
        var pIdArray = v.p_id.split('.');
        var pId = parseInt(pIdArray[0]) + '.' + parseInt(pIdArray[1]) + '.' + parseInt(pIdArray[2]);

       // Extending an object
        v.added = {
          pId: pId,
          typeId: typeId,
          dskArray: v.ZW_QR_DSK.split('-'),
          timeformat:  $filter('getDateTimeObj')(v.timestamp/1000)
        }

        return v;
      });;

    }, function (error) {
      alertify.alertError($scope._t('error_load_data'));
    });
  };
  $timeout(loadDskList);

   /**
   * Remove a DSK item
   * @param {object} input
   * @param {string} message
   * @returns {undefined}
   */
  $scope.removeDsk = function (input, message) {
    /* if (!input.isSmartStart) {
      alertify.alertError($scope._t('delete_no_smartstart_warning'));
      return;
    } */

    alertify.confirm(message, function () {
      dataService.getApi('remove_dsk', input.id, true).then(function (response) {
        var index = _.findIndex($scope.dsk.all, {
          id: input.id
        });
        if (index > -1) {
          $scope.dsk.all.splice(index, 1);
        }
      }, function (error) {
        alertify.alertError($scope._t('error_delete_data'));
      });
    });
  };

});