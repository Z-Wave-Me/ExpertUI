/**
 * @overview This controller renders and handles network statistics.
 * @author Martin Vach
 */

/**
 * Network statistics controller
 * @class NetworkStatisticsController
 *
 */
appController.controller('NetworkStatisticsController', function ($scope, $filter, $timeout, $interval, $window, dataService, cfg, _, deviceService) {

  $scope.netStat = {
    dataRate: {},
    successReception: {},
    foreignNetwork: {}
  };
  /**
   * Load network statistics
   */
  $scope.loadNetworkStatistics = function () {
    var timeout = 1000;
    $scope.toggleRowSpinner('loadNetStatistics');

    dataService.getApi('get_network_statistics', null, true).then(function (response) {
      $scope.prepareNetworkStats(response);
      $timeout($scope.toggleRowSpinner, timeout);

    }, function (error) {
      $scope.toggleRowSpinner();
    });
  };
  $scope.loadNetworkStatistics();

  /**
   * Update network statistics
   */
  $scope.updateNetworkStatistics = function () {
    //$window.location.reload();
    $scope.loadNetworkStatistics();
  };

  /**
   * Reset network statistics
   * @param {string} cmd
   */
  $scope.resetNetworkStatistics = function () {
    var timeout = 1000;
    $scope.toggleRowSpinner('resetNetStatistics');

    dataService.getApi('reset_network_statistics', null, true).then(function (response) {
        $scope.prepareNetworkStats(response);
        $timeout($scope.toggleRowSpinner, timeout);
    }, function (error) {
      $scope.toggleRowSpinner();
    });
  };

  $scope.prepareNetworkStats = function (response) {
    var percentFormat = function (num) {
      if (num === 0) {
        return 0;
      }
      var out = parseFloat((num * 100).toFixed(2));
      // Sets 1 percent if num is not 0 and out is 0
      return out === 0 && num > 0 ? 1 : out;
    }

    var RFTxFrames = response.data.RFTxFrames.value;
    // Frames with Frequency Backoff (in % of frames sent) RFTxLBTBackOffs
    var RFTxLBTBackOffs = response.data.RFTxLBTBackOffs.value;

    var RFRxFrames = response.data.RFRxFrames.value;
    var RFRxCRC16Errors = response.data.RFRxCRC16Errors.value;
    var RFRxLRCErrors = response.data.RFRxLRCErrors.value;
    var RFRxForeignHomeID = response.data.RFRxForeignHomeID.value;

    var statisticsObj = {};

    // busy rate
    //Ether busy rate: [free: RFTxFrames / (RFTxFrames + RFTxLBTBackOffs)][busy: RFTxLBTBackOffs / (RFTxFrames + RFTxLBTBackOffs)]
    statisticsObj.tx_total = RFTxFrames + RFTxLBTBackOffs;
    statisticsObj.tx_free = statisticsObj.tx_total > 0 ? RFTxFrames / statisticsObj.tx_total : 0;
    statisticsObj.tx_fail = statisticsObj.tx_total > 0 ? RFTxLBTBackOffs / statisticsObj.tx_total : 0;

    var objBusyRate = {};
    objBusyRate['sendValue'] = RFTxFrames;
    objBusyRate['backOffValue'] = RFTxLBTBackOffs;
    objBusyRate['fail'] = percentFormat(statisticsObj.tx_fail);
    objBusyRate['success'] = percentFormat(statisticsObj.tx_free);
    objBusyRate['dateTime'] = $filter('getDateTimeObj')(response.data.RFTxLBTBackOffs.updateTime);
    $scope.netStat.dataRate = objBusyRate;

    // Rx failures
    // RX failures: [ok: RFRxFrames/(RFRxFrames + RFRxCRC16Errors + RFRxLRCErrors)][CRC16 error: RFRxCRC16Errors/(RFRxFrames + RFRxCRC16Errors + RFRxLRCErrors)][CRC error: RFRxLRCErrors/(RFRxFrames + RFRxCRC16Errors + RFRxLRCErrors)]
    statisticsObj.rx_total = RFRxFrames + RFRxCRC16Errors + RFRxLRCErrors;
    statisticsObj.rx_ok = statisticsObj.rx_total > 0 ? RFRxFrames / statisticsObj.rx_total : 0;
    statisticsObj.rx_crc_error = statisticsObj.rx_total > 0 ? RFRxLRCErrors / statisticsObj.rx_total : 0;
    statisticsObj.rx_crc16_error = statisticsObj.rx_total > 0 ? RFRxCRC16Errors / statisticsObj.rx_total : 0;

    var objRxFailures = {};
    objRxFailures['failCRC'] = percentFormat(statisticsObj.rx_crc_error);
    objRxFailures['failCRCRound'] =  Math.round10(objRxFailures['failCRC'],-2);
    objRxFailures['success'] = percentFormat(statisticsObj.rx_ok);
    objRxFailures['successRound'] =  Math.round10(objRxFailures['success'],-2);
    objRxFailures['failCRC16'] = percentFormat(statisticsObj.rx_crc16_error);
    objRxFailures['failCRC16Round'] = Math.round10((objRxFailures['failCRCRound']  +  objRxFailures['successRound']) == 0 ? 0 : 100 - (objRxFailures['failCRCRound']  +  objRxFailures['successRound']),-2);
    objRxFailures['okValue'] = RFRxFrames;
    objRxFailures['failCRCValue'] = RFRxLRCErrors;
    objRxFailures['failCRC16Value'] = RFRxCRC16Errors;
    objRxFailures['dateTime'] = $filter('getDateTimeObj')(response.data.RFRxLRCErrors.updateTime);
    $scope.netStat.successReception = objRxFailures;

    // foreign network inpact
    // Foreign Network Impact: [own: RFRxFrames / (RFRxFrames + RFRxForeignHomeID)][foreign: RFRxForeignHomeID / (RFRxFrames + RFRxForeignHomeID)]
    // same as now, just check your formulas not to have >100 %
    statisticsObj.network_impact_total = RFRxFrames + RFRxForeignHomeID;
    statisticsObj.network_impact_own = statisticsObj.network_impact_total > 0 ? RFRxFrames / statisticsObj.network_impact_total : 0;
    statisticsObj.network_impact_foreign = statisticsObj.network_impact_total > 0 ? RFRxForeignHomeID / statisticsObj.network_impact_total : 0;

    // Foreign Network Impact
    var objForeignNetworkImpact = {};
    objForeignNetworkImpact['success'] = percentFormat(statisticsObj.network_impact_own);
    objForeignNetworkImpact['successRound'] = Math.round10(objForeignNetworkImpact['success'],-2);
    objForeignNetworkImpact['fail'] = percentFormat(statisticsObj.network_impact_foreign);
    objForeignNetworkImpact['failRound'] = 100 - objForeignNetworkImpact['successRound'];
    objForeignNetworkImpact['foreign_value'] = RFRxForeignHomeID;
    objForeignNetworkImpact['own_value'] = RFRxFrames;

    objForeignNetworkImpact['dateTime'] = $filter('getDateTimeObj')(response.data.RFRxForeignHomeID.updateTime);
    $scope.netStat.foreignNetwork = objForeignNetworkImpact;
  };

  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (value === null || isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
});