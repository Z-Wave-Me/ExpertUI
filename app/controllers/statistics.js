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
    $scope.networkStatistics = {
        all: [],
        show: false,
        whiteList: ['RFRxCRC16Errors', 'RFRxForeignHomeID', 'RFRxFrames', 'RFRxLRCErrors', 'RFTxFrames', 'RFTxLBTBackOffs']
    };

    $scope.netStat = {
        all: {},
        show: false
    };


    /**
     * Load network statistics
     */
    $scope.loadNetworkStatistics = function () {
        var cmd = cfg.store_url + 'controller.data.statistics';
        dataService.runZwaveCmd(cmd).then(function (response) {
            var RFTxFrames = parseInt(response.data.RFTxFrames);
            var RFRxFrames = parseInt(response.data.RFRxFrames);
            $scope.netStat.all['RFTxLBTBackOffs'] = response.data.RFTxLBTBackOffs;
            $scope.netStat.all['RFRxLRCErrors'] = response.data.RFRxLRCErrors;
            $scope.netStat.all['RFRxCRC16Errors'] = response.data.RFRxCRC16Errors;
            console.log(response.data.RFTxFrames)
           /* $scope.netStat.all = _.chain(response.data)
                .filter(function (v,k) {


                }).value();*/

           //Old
            $scope.networkStatistics.all = _.chain(response.data)
                .filter(function (v,k) {
                    if($scope.networkStatistics.whiteList.indexOf(k) > -1){
                        v.name = k;
                        v.isUpdated = (v.updateTime > v.invalidateTime ? true : false);
                        v.dateTime = $filter('getDateTimeObj')(v.updateTime);
                        return v;
                    }

                }).value();
            if(_.isEmpty($scope.networkStatistics.all)){
                $scope.alert = {message: $scope._t('device_404'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                return;
            }
            $scope.networkStatistics.show = true;
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