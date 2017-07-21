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
        input: {
            reorgMain: true,
            reorgBattery: false
        },
        trace: 'stop',
        run: false,
        all: [],
        interval: null,
        show: false,
        lastUpdate: 0,
        lastUpdateMS: 0
    };


    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.reorganizations.interval);
    });

    /**
     * Set trace
     */
    $scope.setTrace = function (trace, input) {
        $interval.cancel($scope.reorganizations.interval);
        switch (trace) {
            case 'pause':
                $scope.reorganizations.trace = 'pause';
                $scope.reorganizations.run = false;
                break;
            case 'run':
                $scope.runReorganization(input);
                $scope.reorganizations.trace = 'run';
                break;
            case 'stop':
                $scope.reorganizations.all = [];
                $scope.reorganizations.trace = 'stop';
                $scope.reorganizations.run = false;
                break;
            default:
                 break;

        }
    };

    /**
     * Run reorganization
     */
    $scope.runReorganization = function (input) {
        var params = '?reorgMain=' + input.reorgMain + '&reorgBattery=' + input.reorgBattery;
        $scope.reorganizations.all = [];
        $scope.reorganizations.run = false;
        dataService.getApi('reorg_run_url', params, true).then(function (response) {
            $scope.reorganizations.run = {
                message: response.data.data,
                status: 'alert-success',
                icon: 'fa-spinner fa-spin'
            };
            $scope.loadReorganizationLog(true);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };

    /**
     * Load reorganization log
     */
    $scope.loadReorganizationLog = function (refresh) {
        dataService.getApi('reorg_log_url', null, true).then(function (response) {
            //response.data = [];
            if(_.isEmpty(response.data)){
                $scope.reorganizations.run = {
                    message: $scope._t('reorg_empty'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation'
                };
                $scope.reorganizations.trace = 'stop';
                return;
            }

            var last = response.data[response.data.length - 1];

            $scope.reorganizations.lastUpdateMS = last.timestamp;

            setData(response.data);

            if (refresh) {
                $scope.refreshReorganization();
            } else {
                $scope.reorganizations.lastUpdate = $filter('getDateTimeObj')(last.timestamp / 1000);
            }

        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };



    /**
     * Download reorganization log
     */
    $scope.downloadReorganizationLog = function () {
        // Build a log
        var data = '';
        angular.forEach($scope.reorganizations.all, function (v, k) {
            data += v.dateTime.time + ': ' + v.message + '\n';
        });

        // Download a log
        var log = data;
        blob = new Blob([log], {type: 'text/plain'}),
            url = $window.URL || $window.webkitURL;
        $scope.fileUrl = url.createObjectURL(blob);
    };

    /**
     * Refresh zwave data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshReorganization = function () {
        var refresh = function () {
            dataService.getApi('reorg_log_url', null, true).then(function (response) {
                setData(response.data);
            }, function (error) {
            });
        };
        $scope.reorganizations.interval = $interval(refresh,cfg.reorg_interval);
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(data) {
        // Loop throught data
        angular.forEach(data, function (v, k) {
            v. dateTime = $filter('getDateTimeObj')(v.timestamp / 1000);
            var findIndex = _.findIndex($scope.reorganizations.all, {timestamp: v.timestamp});

            if (findIndex === -1 && v.message !== 'finished') {
                $scope.reorganizations.all.push(v);
            } else if (v.message === 'finished' && $scope.reorganizations.lastUpdateMS < v.timestamp){
                $scope.reorganizations.run = false;
            }
        });
    }

    $scope.loadReorganizationLog();
});
