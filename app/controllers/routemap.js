/**
 * @overview This controller renders and handles route map nodes.
 * @author Martin Vach
 */
/**
 * RouteMapController
 * @author Martin Vach
 */
appController.controller('RouteMapController', function ($scope, $interval, $filter, cfg, dataService, myCache, _) {
    $scope.routeMap = {
        showAnnotations: true,
        moveNodes: false
    };
    var zna = new ZWaveNetworkAnalyticsLib(zway, comHist, nodesPositions);
    var zrp = new ZWaveRoutesPlotLib(zna);
});