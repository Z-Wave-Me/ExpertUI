/**
 * @overview This controller renders and handles route map nodes.
 * @author Martin Vach
 */
/**
 * RouteMapController
 * @author Martin Vach
 */
appController.controller('RouteMapController', function ($scope, $interval, $filter, cfg, dataService, myCache, _) {
    var zrp;

    $scope.routeMap = {
        showAnnotations: true,
        moveNodes: false,
        startMove: function() {
            zrp.allowMoveNodes(true);
        },
        finishMoveNodes: function() {
            zrp.allowMoveNodes(false);
            console.log(zrp.getNodesPositions());
        },
        cancelMoveNodes: function() {
            // TODO !!! refresh the page ?? or just revert nodes back?
        }
    };

    dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
        dataService.getApi('packet_log').then(function (response) {
            var packets = response.data.data;
            if (packets.length) {
                zrp = new ZWaveRoutesPlotLib(new ZWaveNetworkAnalyticsLib(ZWaveAPIData, packets, undefined));
            }
        }, function (error) {
            // TODO !!!
        });
    }, function(error) {
        // TODO !!!
    });
});