/**
 * @overview This controller renders and handles zniffer, zniffer history, zniffer rssi backgound, zniffer rssi backgound meter.
 * @author Martin Vach
 */

/**
 * The controller that runs, pauses and stops zniffer.
 * @class ZnifferController
 * @author Martin Vach
 */
appController.controller('ZnifferController', function ($scope, $interval, $timeout, $cookies, $location, $http, $filter, cfg, dataService, deviceService, myCache, _) {
    $scope.zniffer = {
        run: true,
        updateTime: Math.round(+new Date() / 1000),
        trace: 'start',
        interval: null,
        all: [],
        filter: {
            model: {
                src: {
                    value: '',
                    show: '1'
                },
                dest: {
                    value: '',
                    show: '1'
                }
            },
            items: {
                data: ['Singlecast', 'Predicast', 'Multicast']
            },
            used: []
        }

    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.zniffer.interval);
    });

    /**
     * Update zniffer object after setting the filter
     */
    $scope.updateAfterFilter = function () {
        angular.copy([], $scope.zniffer.all);
        $interval.cancel($scope.zniffer.interval);
        $scope.runZniffer($scope.zniffer.updateTime);
    };
    /**
     * Load cached zniffer filter
     * @returns {undefined}
     */
    $scope.loadCachedZnifferFilter = function () {
        if ($cookies.znifferFilter) {
            angular.extend($scope.zniffer.filter.model, angular.fromJson($cookies.znifferFilter));
        }

    };
    $scope.loadCachedZnifferFilter();

    /**
     * Detect zniffer filter
     * @returns {undefined}
     */
    $scope.detectZnifferFilter = function () {
        angular.forEach($scope.zniffer.filter.model, function (v, k) {
            var index = $scope.zniffer.filter.used.indexOf(k);
            if (v['value'] !== '' && index === -1) {
                $scope.zniffer.filter.used.push(k);
            }
        });
    };
    $scope.detectZnifferFilter();

    /**
     * Load cached zniffer
     * @returns {undefined}
     */
    $scope.loadCachedZniffer = function () {
        if (myCache.get('zniffer_inout')) {
            $scope.zniffer.all = myCache.get('zniffer_inout');
        }

    };
    $scope.loadCachedZniffer();

    /**
     * Run Zniffer
     * @returns {undefined}
     */
    $scope.runZniffer = function (updateTime) {
        var filterBySrc = false;
        var filterByDest = false;
        // Is filter by src set?
        if($scope.zniffer.filter.used.indexOf('src') > -1){
            filterBySrc = $scope.zniffer.filter.model['src'];
        }
        // Is filter by destc set?
        if($scope.zniffer.filter.used.indexOf('dest') > -1){
            filterByDest = $scope.zniffer.filter.model['dest'];
        }
        var refresh = function () {
            if($scope.zniffer.trace === 'stop'){
                angular.copy([], $scope.zniffer.all);
                return;
            }
            if ($http.pendingRequests.length > 0) {
                return;
            }
            //var time = 1472729277;//(updateTime ? '/' + updateTime : '');
            //var time = updateTime;//(updateTime ? '/' + updateTime : '');

            dataService.refreshApi('zniffer_url',null,true).then(function (response) {
                $scope.zniffer.updateTime = response.data.updateTime;
                //var znifferData = deviceService.setZnifferData(response.data.data);
                var znifferData = response.data.data;
                // Filter by SRC
                if(filterBySrc){
                    var srcs =  filterBySrc.value.split(',');
                    if(filterBySrc.show === '1'){
                        //console.log('SRC - Show only: ',srcs)
                        znifferData = _.filter(znifferData, function (v) {
                            return srcs.indexOf(v.src.toString()) > -1;
                        });
                    }else{
                        //console.log('SRC - HIDE: ',srcs)
                        znifferData = _.filter(znifferData, function (v) {
                            return srcs.indexOf(v.src.toString()) === -1;
                        });
                    }

                }
                // Filter by DEST
                if(filterByDest){
                    var dests =  filterByDest.value.split(',');
                    if(filterByDest.show === '1'){
                        //console.log('SRC - Show only: ',dests)
                        znifferData = _.filter(znifferData, function (v) {
                            return dests.indexOf(v.dest.toString()) > -1;
                        });
                    }else{
                        c//onsole.log('SRC - HIDE: ',dests)
                        znifferData = _.filter(znifferData, function (v) {
                            return dests.indexOf(v.dest.toString()) === -1;
                        });
                    }
                }

                _.filter(znifferData, function (v) {
                    v.dateTime = $filter('getDateTimeObj')(v.updateTime);
                    v.bytes = (_.isArray(v.value) ? v.value.toString() : v.value);
                    v.rssi = (_.isArray(v.rssi) ? v.rssi.toString() : v.rssi);
                    v.hops = (_.isArray(v.hops) ? v.hops.toString() : v.hops);

                    //var exist = _.findWhere($scope.zniffer.all, {updateTime: v.updateTime, bytes: v.bytes});
                    var exist = _.findWhere($scope.zniffer.all, {id: v.id, bytes: v.bytes});
                    if (!exist) {
                        $scope.zniffer.all.push(v);
                    }
                    ;
                });
                myCache.put('zniffer_inout', $scope.zniffer.all);
                $scope.zniffer.run = true;
            }, function (error) {
                $scope.zniffer.run = false;
                $interval.cancel($scope.zniffer.interval);
            });
        };
        if ($scope.zniffer.run && $scope.zniffer.trace === 'start') {
            $scope.zniffer.interval = $interval(refresh, cfg.zniffer_interval);
        }
    };
    $scope.runZniffer($scope.zniffer.updateTime);

    /**
     * Set trace
     */
    $scope.setTrace = function (trace) {
        switch (trace) {
            case 'pause':
                 $scope.zniffer.trace = 'pause';
                $interval.cancel($scope.zniffer.interval);
                break;
            case 'stop':
                $scope.zniffer.trace = 'stop';
                angular.copy([], $scope.zniffer.all);
                 $interval.cancel($scope.zniffer.interval);
                myCache.remove('zniffer_inout');
                $timeout(function(){angular.copy([], $scope.zniffer.all);}, 3000);
                break;
            default:
                $scope.zniffer.trace = 'start';
                $scope.runZniffer($scope.zniffer.updateTime);
                break;

        }
        //console.log('Set trace: ',  $scope.zniffer.trace)
    };

    /**
     * Reset zniffer filter
     * @returns {undefined}
     */
    $scope.resetZnifferFilter = function (key) {
        $scope.zniffer.filter.model[key].value = '';
        $scope.zniffer.filter.model[key].show = '1';
        $scope.zniffer.filter.used = _.without($scope.zniffer.filter.used, key);
        delete $cookies['znifferFilter'];
        $scope.updateAfterFilter();

    };

    /**
     * Set zniffer filter
     * @returns {undefined}
     */
    $scope.setZnifferFilter = function (key) {
        //$cookies.znifferFilter =  JSON.stringify($scope.zniffer.filter.model);
        if (!$scope.zniffer.filter.model[key].value) {
            return false;
        }
        $cookies.znifferFilter = angular.toJson($scope.zniffer.filter.model);
        if (!_.contains($scope.zniffer.filter.used, key)) {
            $scope.zniffer.filter.used.push(key);
        }
        $scope.updateAfterFilter();
    };

    /**
     * Reset all zniffer filters
     * @returns {undefined}
     */
    $scope.resetZnifferFilterAll = function () {
        angular.forEach($scope.zniffer.filter.model, function (v, k) {
            $scope.zniffer.filter.model[k].value = '';
            $scope.zniffer.filter.model[k].show = '1';
        });

        $scope.zniffer.filter.used = [];
        delete $cookies['znifferFilter'];
        $scope.updateAfterFilter();
    };

});

/**
 * The controller that displays zniffer history data.
 * @class ZnifferHistoryController
 * @author Martin Vach
 */
appController.controller('ZnifferHistoryController', function ($scope, $interval, $filter, $cookies, $location, cfg, dataService, deviceService, paginationService, _) {
    $scope.zniffer = {
        all: [],
        filter: {
            model: {
                src: {
                    value: '',
                    show: '1'
                },
                dest: {
                    value: '',
                    show: '1'
                },
                data: {
                    value: '',
                    show: '1'
                }
            },
            items: {
                data: ['Singlecast', 'Predicast', 'Multicast']
            },
            used: []
        }

    };
    $scope.currentPage = 1;
    $scope.pageSize = cfg.page_results_history;
    /**
     * Cancel interval on page destroy
     */
    //$scope.$on('$destroy', function () {
    //});
    
    /**
     * Load cached zniffer filter
     * @returns {undefined}
     */
    $scope.loadCachedZnifferFilter = function () {
        if ($cookies.znifferFilter) {
            angular.extend($scope.zniffer.filter.model, angular.fromJson($cookies.znifferFilter));
        }

    };
    $scope.loadCachedZnifferFilter();

    /**
     * Detect zniffer filter
     * @returns {undefined}
     */
    $scope.detectZnifferFilter = function () {
        angular.forEach($scope.zniffer.filter.model, function (v, k) {
            var index = $scope.zniffer.filter.used.indexOf(k);
            if (v['value'] !== '' && index === -1) {
                $scope.zniffer.filter.used.push(k);
            }
        });
    };
    $scope.detectZnifferFilter();

    /**
     * Load communication history
     * @returns {undefined}
     */
    $scope.loadCommunicationHistory = function () {
        var filter = '?filter=' + JSON.stringify($scope.zniffer.filter.model);
        dataService.getApi('communication_history_url', filter, true).then(function (response) {
            $scope.zniffer.all = deviceService.setZnifferData(response.data.data).value();
            //$scope.zniffer.all = zniffer.value();
            $scope.zniffer.run = true;
        }, function (error) {
            alertify.alertError($scope._t('error_load_data') + ': ' + cfg.communication_history_url);
        });
    };
    $scope.loadCommunicationHistory();
    /**
     * Reset Communication History
     * @returns {undefined}
     */
    $scope.resetCommunicationHistory = function () {
        $scope.zniffer.all = [];
        $scope.loadCommunicationHistory();
    };
    /**
     * Set zniffer filter
     * @returns {undefined}
     */
    $scope.setZnifferFilter = function (key) {
        //$cookies.znifferFilter =  JSON.stringify($scope.zniffer.filter.model);
        if (!$scope.zniffer.filter.model[key].value) {
            return false;
        }
        $cookies.znifferFilter = angular.toJson($scope.zniffer.filter.model);
        if (!_.contains($scope.zniffer.filter.used, key)) {
            $scope.zniffer.filter.used.push(key);
        }
        $scope.resetCommunicationHistory();
    };
    /**
     * Reset zniffer filter
     * @returns {undefined}
     */
    $scope.resetZnifferFilter = function (key) {
        $scope.zniffer.filter.model[key].value = '';
        $scope.zniffer.filter.model[key].show = '1';
        $scope.zniffer.filter.used = _.without($scope.zniffer.filter.used, key);
        delete $cookies['znifferFilter'];
        //$cookies.znifferFilter = angular.toJson($scope.zniffer.filter.model);
        $scope.resetCommunicationHistory();
    };
    /**
     * Reset all zniffer filters
     * @returns {undefined}
     */
    $scope.resetZnifferFilterAll = function () {
        angular.forEach($scope.zniffer.filter.model, function (v, k) {
            $scope.zniffer.filter.model[k].value = '';
            $scope.zniffer.filter.model[k].show = '1';
        });

        $scope.zniffer.filter.used = [];
        delete $cookies['znifferFilter'];
        //$cookies.znifferFilter = angular.toJson($scope.zniffer.filter.model);
        $scope.resetCommunicationHistory();
    };
    
    // Watch for pagination change
    $scope.$watch('currentPage', function (page) {
        paginationService.setCurrentPage(page);
    });

    $scope.setCurrentPage = function (val) {
        $scope.currentPage = val;
    };

});

/**
 * The controller that handles Zniffer Rssi Background.
 * @class ZnifferRSSIController
 * @author Niels Roche
 */
appController.controller('ZnifferRSSIController', function ($scope, $interval, $filter, cfg, dataService, myCache, _) {
    var cOptions = {
        title:{
            text: ""
        },
        axisX:{
            title: "Time",
            tickColor: "black",
            tickLength: 5,
            tickThickness: 2,
            valueFormatString: "HH:mm"
        },
        axisY:{
            title: "RSSI (dBm)",
            tickColor: "black",
            tickLength: 5,
            tickThickness: 2,
            includeZero: false
        },
        data: [
            {
                type: "line",
                xValueType: "dateTime",
                xValueFormatString: "HH:mm:ss",
                connectNullData: true,
                nullDataLineDashType: "solid",
                dataPoints: [],
            }
        ],
        zoomEnabled:true
    };

    $scope.rssi = {
        chartOptions1: cOptions,
        chartOptions2: cOptions,
        chartData1: [],
        chartData2: [],
        interval: null
    }

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.rssi.interval);
    });

    $scope.loadingRSSIData = function(handleError) {
        dataService.getApi('rssi_chart','', true).then(function (response) {
            var rssiData = typeof response === 'string'? JSON.parse(response) : response;
            var tInterval = (new Date()).getTime() - 86400000; //86400000 - 24h
            var chartData1 = [];
            var chartData2 = [];

            rssiData.data.data.forEach(function (entry){
                var timestamp = new Date(entry.time * 1000);

                if (timestamp) {

                    if ((entry.time * 1000) > tInterval) {

                        if (typeof parseInt(entry.channel1) === 'number') {
                            chartData1.push({x: timestamp, y: !!entry.channel1? parseInt(entry.channel1) : entry.channel1});
                        }

                        if (typeof parseInt(entry.channel2) === 'number') {
                            chartData2.push({x: timestamp, y: !!entry.channel2? parseInt(entry.channel2) : entry.channel2});
                        }
                    }
                }
            });

            $scope.rssi.chartData1 = chartData1;
            $scope.rssi.chartData2 = chartData2;

            if (!$scope.rssi['chart1']) {
                $scope.createChart('chart1',$scope.rssi.chartOptions1,$scope.rssi.chartData1, 'Channel 1');
            }

            if (!$scope.rssi['chart2']) {
                $scope.createChart('chart2',$scope.rssi.chartOptions2,$scope.rssi.chartData2, 'Channel 2');
            }


        }, function (error) {
            var message = $scope._t('error_load_data') + ': ' + cfg.rssi_chart;
            if(handleError){
                alertify.dismissAll();
                alertify.alertError(message);
            }

        });
    };
    $scope.loadingRSSIData(true);

    $scope.createChart = function (elementID,chartOptions,chartData, chartTitle) {
        chartOptions.title.text = chartTitle;
        chartOptions.data[0].dataPoints = chartData;

        $scope.rssi[elementID] = new CanvasJS.Chart(elementID,chartOptions);
        $scope.rssi[elementID].render();
    };

    $scope.updateChart = function(elementID, chartData, chartTitle){
        var length = chartData.length;
        if(length > 0) {
            $scope.rssi[elementID].options.title.text = chartTitle;
            $scope.rssi[elementID].options.data[0].dataPoints = chartData;
            $scope.rssi[elementID].render();
        }
    };

    $scope.initRefresh = function() {
        var refresh = function () {
            $scope.loadingRSSIData();

            $scope.updateChart('chart1', $scope.rssi.chartData1,'Channel 1');
            $scope.updateChart('chart2', $scope.rssi.chartData2,'Channel 2');
        }

        $scope.rssi.interval = $interval(refresh, 30000);
    };
    $scope.initRefresh();
});

/**
 * The controller that handles Zniffer Rssi Background Meter.
 * @class ZnifferRSSIMeterController
 * @author Michael Hensche
 */
appController.controller('ZnifferRSSIMeterController', function ($scope, $interval, $filter, cfg, dataService, myCache, _) {

    var cOptions = {
        id: "",
        value: 0,
        min: -120,
        max: 0,
        title: "",
        label: "RSSI (dBm)",
        pointer: true,
        customSectors: [{
            color: "#80AD80",
            lo: -120,
            hi: -75
        },{
            color: "#f0ad4e",
            lo: -75,
            hi: -45
        },{
            color: "#d9534f",
            lo: -45,
            hi: 0
        }]
    };

    $scope.rssi = {
        chartOptions1: cOptions,
        chartOptions2: cOptions,
        chartData1: 0,
        chartData2: 0,
        interval: null,
        intervaltime: 2000,
        trace: 'pause',
        run: true
    };

    $scope.loadingRSSIData = function(handleError) {

        dataService.getApi('rssi_chart','/realtime', true).then(function (response) {
            var rssiData = typeof response === 'string'? JSON.parse(response) : response,
                chartData1 = 0,
                chartData2 = 0;

            if (typeof parseInt(rssiData.data.data.channel1) === 'number') {
                chartData1 = _.isNull(rssiData.data.data.channel1)? $scope.rssi.chartData1 : parseInt(rssiData.data.data.channel1);
            }

            if (typeof parseInt(rssiData.data.data.channel2) === 'number') {
                chartData2 = _.isNull(rssiData.data.data.channel2) ? $scope.rssi.chartData2 : parseInt(rssiData.data.data.channel2);
            }

            $scope.rssi.chartData1 = chartData1;
            $scope.rssi.chartData2 = chartData2;

            if (!$scope.rssi['gauge1']) {
                $scope.createChart('gauge1',$scope.rssi.chartOptions1,$scope.rssi.chartData1, 'Channel 1');
            }

            if (!$scope.rssi['gauge2']) {
                $scope.createChart('gauge2',$scope.rssi.chartOptions2,$scope.rssi.chartData2, 'Channel 2');
            }
            $scope.rssi.run = true;

        }, function (error) {
            $scope.rssi.run = false;
            var message = $scope._t('error_load_data') + ': ' + cfg.rssi_chart;
            if(handleError){
                alertify.dismissAll();
                alertify.alertError(message);
            }
        });


    };
    $scope.loadingRSSIData(true);

    if ($scope.rssi.run && $scope.rssi.trace === 'start') {
        $scope.initRefresh();
    }

    $scope.createChart = function (elementID,chartOptions,chartData, chartTitle) {
        chartOptions.id = elementID;
        chartOptions.value = chartData;
        chartOptions.title = chartTitle;

        $scope.rssi[elementID] = new JustGage(chartOptions);
    };

    $scope.updateChart = function(elementID, chartData){

        $scope.rssi[elementID].refresh(chartData);

    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $scope.rssi["gauge1"] = [];
        $scope.rssi["gauge2"] = [];
        $interval.cancel($scope.rssi.interval);
    });


    $scope.initRefresh = function() {
        var refresh = function () {
            $scope.loadingRSSIData();

            $scope.updateChart('gauge1', $scope.rssi.chartData1);
            $scope.updateChart('gauge2', $scope.rssi.chartData2);
        }

        $scope.rssi.interval = $interval(refresh, $scope.rssi.intervaltime);
    };

    /**
     * Set trace
     */
    $scope.setTrace = function (trace) {
        switch (trace) {
            case 'pause':
                $scope.rssi.trace = 'pause';
                $interval.cancel($scope.rssi.interval);
                break;
            default:
                $scope.rssi.trace = 'start';
                $scope.initRefresh();
                break;
        }
    };

});
