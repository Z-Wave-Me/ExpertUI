/**
 * @overview This controller renders and handles route map nodes.
 * @author Martin Vach
 */
/**
 * RouteMapController
 * @author Martin Vach
 */
appController.controller('RouteMapController', function ($scope, $q,$interval, $filter, $window,cfg, dataService, myCache, _) {
    var zrp;

    $scope.routeMap = {
        showAnnotations: true,
        moveNodes: false,
        startMove: function() {
            zrp.allowMoveNodes(true);
        },
        finishMoveNodes: function() {
            zrp.allowMoveNodes(false);
            $scope.saveNodesPositions(zrp.getNodesPositions());
            //console.log(zrp.getNodesPositions());
        },
        cancelMoveNodes: function() {
            // TODO !!! refresh the page ?? or just revert nodes back?
            $window.location.reload();
        }
    };

    /**
     * Load all promises
     * @returns {undefined}
     */
    $scope.allSettled = function () {
        var promises = [
            dataService.loadZwaveApiData(),
            dataService.getApi('packet_log')

        ];

        $q.allSettled(promises).then(function (response) {
            var ZWaveAPIData = response[0];
            var packetApi = response[1];

            // zwaveData and packet error message
            if (ZWaveAPIData.state === 'rejected' || packetApi.state === 'rejected') {
                alertify.alertError($scope._t('error_load_data'));
                return;
            }

            // Success - zwaveData
            if (ZWaveAPIData.state === 'fulfilled' && packetApi.state === 'fulfilled') {
                //console.log(cfg.zwavecfg.node_positions)
                /*var positions = [{"id":1,"x":16.42722511291504,"y":6.361807823181152},{"id":3,"x":176.64948018391928,"y":80.43401336669922},{"id":5,"x":116.66666666666667,"y":78.86751345948129},{"id":10,"x":110.54681905110678,"y":65.01923159912972},{"id":12,"x":24.799763361612946,"y":71.57755661010742},{"id":15,"x":76.08714040120441,"y":88.44158383055778},{"id":16,"x":116.66666666666664,"y":21.1324865405187}];*/
                var positions = cfg.zwavecfg.node_positions;
                var packets = packetApi.value.data.data.incoming;
                console.log(packets)
                if (_.size(packets)) {
                    zrp = new ZWaveRoutesPlotLib(new ZWaveNetworkAnalyticsLib(ZWaveAPIData.value, packets,  positions ));
                }
            }

        });

    };
    $scope.allSettled();

   /* dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
        dataService.getApi('packet_log').then(function (response) {
            var packets = response.data.data.incoming;
            if (_.size(packets)) {
                zrp = new ZWaveRoutesPlotLib(new ZWaveNetworkAnalyticsLib(ZWaveAPIData, packets, undefined));
            }
            /!*if (packets.length) {
                zrp = new ZWaveRoutesPlotLib(new ZWaveNetworkAnalyticsLib(ZWaveAPIData, packets, undefined));
            }*!/
        }, function (error) {
            // TODO !!!
        });
    }, function(error) {
        // TODO !!!
    });*/

    /**
     * Upload floor image
     * @param {object} input
     * @param {string} id
     */
    $scope.uploadFloorImage = function (files, id) {
        $scope.toggleRowSpinner(id);
        var cmd = cfg.server_url + cfg.fw_update_url
        var fd = new FormData();
        console.log(fd)
        return;

        fd.append('file', $scope.myFile);
        fd.append('url', input.url);
        fd.append('targetId', input.targetId || '0');
        dataService.uploadApiFile(cmd, fd).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
            deviceService.showNotifier({message: $scope._t('success_device_firmware_update')});
            /*$timeout(function () {
             alertify.dismissAll();
             $window.location.reload();
             }, 2000);*/
        }, function (error) {
            $timeout($scope.toggleRowSpinner, 1000);
            alertify.alertError($scope._t('error_device_firmware_update'));
        });
    };

    $scope.saveNodesPositions = function(nodes){
        console.log(nodes);
        var input = {node_positions: nodes};
        console.log(input);
        dataService.postApi('configupdate_url', input).then(function (response) {
           // $window.location.reload();
            /*$timeout( function() {
                $window.location.reload();
            }, 1000);*/

        }, function (error) {
            alertify.alertError($scope._t('error_update_data'));
        });
    }
});