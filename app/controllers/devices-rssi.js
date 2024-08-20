/**
 * @overview This controller renders devices rssi
 * @class DevicesRSSIController
 * @author Serguei Poltorak
 */

appController.controller('DevicesRSSIController', function ($scope, $interval, $filter, cfg, dataService, myCache, _) {
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
            includeZero: false,
            stripLines:[{
                value: -80, // dBm
                color:"#800000",
                lineDashType: "dash"
            }]
        },
        _data:{
                type: "line",
                xValueType: "dateTime",
                xValueFormatString: "HH:mm:ss",
                connectNullData: true,
                nullDataLineDashType: "solid",
                showInLegend: true,
                dataPoints: []
        },
        zoomEnabled:true
    };

    $scope.rssi = {
        chartOptions: cOptions,
        chartData: [],
        interval: null
    }

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.rssi.interval);
    });

    $scope.loadingRSSIData = function(handleError) {
        dataService.getApi('packet_log','', true).then(function (response) {
            var rssiData = typeof response === 'string'? JSON.parse(response) : response;
            var tInterval = (new Date()).getTime() - 86400000; //86400000 - 24h
            var chartData = [];

            rssiData.data.data.forEach(function (entry){
                var timestamp = new Date(entry.updateTime * 1000);

                if (timestamp > tInterval) {
                    var rssi;
                    
                    if (entry.returnRSSI) {
                        rssi = entry.returnRSSI[0];
                    } else {
                        rssi = entry.RSSI;
                    }
                    
                    if (rssi === 125 || rssi === 126 || rssi === 127) return; // skip non-physical values
                    
                    var nodeId;
                    if (entry.hops.length === 0) {
                        nodeId = entry.nodeId;
                    } else {
                        nodeId = entry.hops[0];
                    }
                    
                    if (!chartData[nodeId]) {
                        chartData[nodeId] = [];
                    }
                    
                    chartData[nodeId].push({x: timestamp, y: rssi});
                }
            });

            $scope.rssi.chartData = chartData;

            if (!$scope.rssi['chart']) {
                $scope.createChart('chart', $scope.rssi.chartOptions, $scope.rssi.chartData, 'Devices RSSI');
            }

            var data = rssiData.data.data;
            $scope.stats = {};
            $scope.stats.packetsNum = data.length;
            $scope.stats.gatheringPeriod = $scope.stats.packetsNum ? ((data.at(-1).updateTime - data.at(0).updateTime) / 60 / 60).toFixed(0) : 0;
        }, function (error) {
            var message = $scope._t('error_load_data') + ': ' + cfg.rssi_chart;
            if(handleError){
                alertify.dismissAll();
                alertify.alertError(message);
            }

        });
    };
    $scope.loadingRSSIData(true);

    $scope.createChart = function (elementID, chartOptions, chartData, chartTitle) {
        chartOptions.title.text = chartTitle;
        $scope.rssi[elementID] = new CanvasJS.Chart(elementID, chartOptions);
        $scope.updateChart(elementID, chartData, chartTitle);
    };

    $scope.updateChart = function(elementID, chartData, chartTitle){
        if (chartData.length === 0) return;
        
        $scope.rssi[elementID].options.data = [];
        chartData.forEach(function(dataPoints, nodeId) {
            var _data = _.clone($scope.rssi[elementID].options._data);
            _data.dataPoints = dataPoints;
            _data.name = "" + nodeId;
            $scope.rssi[elementID].options.data.push(_data);
        });
        
        $scope.rssi[elementID].render();
    };

    $scope.initRefresh = function() {
        var refresh = function () {
            $scope.loadingRSSIData();

            $scope.updateChart('chart', $scope.rssi.chartData, 'Devices RSSI');
        }

        $scope.rssi.interval = $interval(refresh, 5000);
    };
    $scope.initRefresh();
});
