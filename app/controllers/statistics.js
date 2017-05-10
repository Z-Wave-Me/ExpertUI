/**
 * @overview This controller renders and handles network statistics.
 * @author Martin Vach
 */

/**
 * Network statistics controller
 * @class NetworkStatisticsController
 *
 */
appController.controller('NetworkStatisticsController', function ($scope, $filter, $timeout, $interval, dataService, cfg, _, deviceService) {

    $scope.netStat = {
        dataRate: {},
        successReception: {},
        foreignNetwork: {}
    };
    /**
     * Load network statistics
     */
    $scope.loadNetworkStatistics = function () {
        var cmd = cfg.store_url + 'controller.data.statistics';
        dataService.runZwaveCmd(cmd).then(function (response) {
            var percentCnt = function (total, num) {
                if (total === 0 && num === 0) {
                    return 0;
                }
                var out = parseInt(((num / total) * 100).toFixed());
                // Sets 1 percent if num is not 0 and out is 0
                return out === 0 && num > 0 ? 1 : out;
            }
            // Data Rate on Send
            var RFTxFrames = parseInt(response.data.RFTxFrames.value);
            // Frames with Frequency Backoff (in % of frames sent) RFTxLBTBackOffs
            var RFTxLBTBackOffs = parseInt(response.data.RFTxLBTBackOffs.value);
            var objRFTxLBTBackOffs = response.data.RFTxLBTBackOffs;

            objRFTxLBTBackOffs['RFTxFrames'] = RFTxFrames;
            objRFTxLBTBackOffs['frameName'] = 'RFTxFrames';
            objRFTxLBTBackOffs['frameValue'] = RFTxFrames;
            objRFTxLBTBackOffs['fail'] = percentCnt(RFTxFrames, RFTxLBTBackOffs);
            objRFTxLBTBackOffs['success'] = (RFTxFrames > 0 ?(100 - objRFTxLBTBackOffs['fail']) : 0);
            objRFTxLBTBackOffs['dateTime'] = $filter('getDateTimeObj')(response.data.RFTxLBTBackOffs.updateTime);
            $scope.netStat.dataRate = objRFTxLBTBackOffs;

            // Success on Reception (% ok versus % corrupted)
            var RFRxFrames = parseInt(response.data.RFRxFrames.value);
            var RFRxLRCErrors = parseInt(response.data.RFRxLRCErrors.value);
            var RFRxCRC16Errors = parseInt(response.data.RFRxCRC16Errors.value);
            var RFRxForeignHomeID = parseInt(response.data.RFRxForeignHomeID.value);

            // Number of corrupted CRC8 Frames received
            var objRFRxLRCErrors = response.data.RFRxLRCErrors;
            objRFRxLRCErrors['fail'] = percentCnt(RFRxFrames, RFRxLRCErrors);
            objRFRxLRCErrors['failCRC8'] = percentCnt(RFRxFrames, RFRxLRCErrors);
            objRFRxLRCErrors['failCRC16'] = percentCnt(RFRxFrames, RFRxCRC16Errors);
            objRFRxLRCErrors['success'] = (RFRxFrames > 0 ?(100 - (objRFRxLRCErrors['failCRC8'] + objRFRxLRCErrors['failCRC16'])) : 0);
            objRFRxLRCErrors['RFRxFrames'] = RFRxFrames;
            objRFRxLRCErrors['frameName'] = 'RFRxFrames';
            objRFRxLRCErrors['frameValue'] = RFRxFrames;
            objRFRxLRCErrors['failCRC8Name'] = 'RFRxLRCErrors';
            objRFRxLRCErrors['failCRC16Name'] = 'RFRxCRC16Errors';
            objRFRxLRCErrors['failCRC8Value'] = RFRxLRCErrors;
            objRFRxLRCErrors['failCRC16Value'] = RFRxCRC16Errors;
            objRFRxLRCErrors['dateTime'] = $filter('getDateTimeObj')(response.data.RFRxLRCErrors.updateTime);
            $scope.netStat.successReception = objRFRxLRCErrors;

            // Foreign Network Impact
            var objRFRxForeignHomeID = response.data.RFRxForeignHomeID;
            objRFRxForeignHomeID['fail'] = percentCnt(RFRxFrames, RFRxForeignHomeID);
            objRFRxForeignHomeID['success'] =  (RFRxFrames > 0 ?(100 - objRFRxForeignHomeID['fail']) : 0);
            objRFRxForeignHomeID['RFRxFrames'] = RFRxFrames;
            objRFRxForeignHomeID['frameName'] = 'RFRxFrames';
            objRFRxForeignHomeID['frameValue'] = RFRxFrames;

            objRFRxForeignHomeID['dateTime'] = $filter('getDateTimeObj')(response.data.RFRxForeignHomeID.updateTime);
            $scope.netStat.foreignNetwork = objRFRxForeignHomeID;
        }, function (error) {
            alertify.alertError($scope._t('error_load_data') + '\n' + cmd);
        });
    };
    $scope.loadNetworkStatistics();

    /**
     * Update network statistics
     * @param {string} cmd
     */
    $scope.updateNetworkStatistics = function (cmd) {
        var timeout = 1000;
        $scope.runZwaveCmd(cmd, timeout);
        $timeout(function () {
            $scope.loadNetworkStatistics()
        }, timeout);
    };

});