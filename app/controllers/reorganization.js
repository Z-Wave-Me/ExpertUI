/**
 * @overview This controller renders and handles reorganizations.
 * @author Martin Vach
 */
/**
 * Reorganization root controller
 * @class ReorganizationController
 *
 */
appController.controller('ReorganizationController', function ($scope, $filter, $timeout, $interval, $window, cfg, dataService, _) {
    $scope.reorganizations = {
        all: [],
        interval: null,
        show: false,
        devicesNames: {}
    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.reorganizations.interval);
    });

    $scope.prepareLog = function () {
        if ($scope.reorganizations.all.length == 0) {
            $scope.reorganizations.all.push({
                dateTime: "",
                message: $scope._t('reorg_empty'),
                nodeId: ""
            });
        }
        
        // show newest on top
        $scope.reorganizations.all.reverse();
    };

    /**
     * Run reorganization
     */
    $scope.runReorganization = function () {
        dataService.getApi('reorg_run_url', null, true).then(function (response) {
            $scope.reorganizations.all = [];
            $scope.prepareLog();
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };

    /**
     * Load reorganization log
     */
    $scope.pollReorganizationLog = function () {
        var refresh = function () {
            dataService.refreshApi('reorg_log_url').then(function (response) {
                // Loop throught data
                $scope.reorganizations.all = [];
                if (response.data.data && response.data.data.length) {
                    angular.forEach(response.data.data, function (v, k) {
                        v.dateTime = $filter('getDateTimeObj')(v.updatetime / 1000);
                        v.nodeName = $scope.reorganizations.devicesNames[v.nodeId];
                        if (!v.nodeId) v.nodeId = "";
                        $scope.reorganizations.all.push(v);
                    });
                }
                $scope.prepareLog();
            }, function (error) {
            });
        };
        $scope.reorganizations.interval = $interval(refresh,cfg.reorg_interval);
    };

    $scope.loadZwaveData = function (token) {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            for (var id in ZWaveAPIData.devices) {
                $scope.reorganizations.devicesNames[id] = ZWaveAPIData.devices[id].data.givenName.value;
            }
        });
    };
    $scope.loadZwaveData();

    $scope.pollReorganizationLog();
    
    $scope.prepareLog();
});
