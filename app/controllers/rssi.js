/**
 * @overview This controller renders and handles zniffer, zniffer history, zniffer rssi backgound, zniffer rssi backgound meter.
 * @author Martin Vach
 */

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
                //$scope.createChart('chart1',$scope.rssi.chartOptions1,$scope.rssi.chartData1, 'Channel 1');
                $scope.createChart('chart1',$scope.rssi.chartOptions1,$scope.rssi.chartData1, '9.6K/40K Channel');
            }

            if (!$scope.rssi['chart2']) {
                //$scope.createChart('chart2',$scope.rssi.chartOptions2,$scope.rssi.chartData2, 'Channel 2');
                $scope.createChart('chart2',$scope.rssi.chartOptions2,$scope.rssi.chartData2, '100K Channel');
            }


        }, function (error) {
            if(handleError){
                alertify.dismissAll();
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

            $scope.updateChart('chart1', $scope.rssi.chartData1,'9.6K/40K Channel');
            //$scope.updateChart('chart1', $scope.rssi.chartData1,'Channel 1');
            $scope.updateChart('chart2', $scope.rssi.chartData2,'100K Channel');
            //$scope.updateChart('chart2', $scope.rssi.chartData2,'Channel 2');
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
                $scope.createChart('gauge1',$scope.rssi.chartOptions1,$scope.rssi.chartData1, '9.6K/40K Channel');
                //$scope.createChart('gauge1',$scope.rssi.chartOptions1,$scope.rssi.chartData1, 'Channel 1');
            }

            if (!$scope.rssi['gauge2']) {
                $scope.createChart('gauge2',$scope.rssi.chartOptions2,$scope.rssi.chartData2, '100K Channel');
                //$scope.createChart('gauge2',$scope.rssi.chartOptions2,$scope.rssi.chartData2, 'Channel 2');
            }
            $scope.rssi.run = true;

        }, function (error) {
            $scope.rssi.run = false;
             if(handleError){
                alertify.dismissAll();
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
