/**
 * @overview This controller renders and handles route map nodes.
 * @author Martin Vach
 */
/**
 * RouteMapController
 * @author Martin Vach
 */
appController.controller('RouteMapController', function ($scope, $q,$interval, $filter, $window,$timeout,cfg, dataService,deviceService, myCache, _) {
    var zrp;

    $scope.routeMap = {
        ///ZAutomation/api/v1/load/image/DSC01425.jpg
        bcgImage: 'app/images/transparent.png',
        showAnnotations: false,
        moveNodes: false,
        startMove: function() {
            zrp.allowMoveNodes(true);
        },
        finishMoveNodes: function() {
            zrp.allowMoveNodes(false);
            $scope.saveNodesPositions(zrp.getNodesPositions());
        },
        resetMoveNodes: function() {
            zrp.allowMoveNodes(false);
            $scope.saveNodesPositions([]);
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
                // Is routemap image in the zwave config?
                if(cfg.zwavecfg.routemap_img){
                    $scope.routeMap.bcgImage = cfg.server_url + cfg.load_image + cfg.zwavecfg.routemap_img;
                }/*else{
                    $scope.routeMap.bcgImage = cfg.server_url + cfg.load_image + 'floorplan.jpg';
                }*/
                // Set positions
                var positions = cfg.zwavecfg.node_positions;
                var packets = packetApi.value.data.data;
                if (_.size(packets)) {
                    zrp = new ZWaveRoutesPlotLib(new ZWaveNetworkAnalyticsLib(ZWaveAPIData.value, packets, positions));
                }
            }

        });

    };
    $scope.allSettled();

    /**
     * Upload floor image
     * @param {object} input
     * @param {string} id
     */
    $scope.uploadFloorImage = function (files,info,spinner) {
        // Check allowed file formats
        if (info.extension.indexOf($filter('fileExtension')(files[0].name)) === -1) {
            alertify.alertError(
                $scope._t('upload_format_unsupported', {'__extension__': $filter('fileExtension')(files[0].name)}) + ' ' +
                $scope._t('upload_allowed_formats', {'__extensions__': info.extension.toString()})
            );
            return;

        }
        // Check allowed file size
        if (files[0].size > info.size) {
            alertify.alertError(
                $scope._t('upload_allowed_size', {'__size__': $filter('fileSizeString')(info.size)}) + ' ' +
                $scope._t('upload_size_is', {'__size__': $filter('fileSizeString')(files[0].size)})
            );
            return;

        }
        $scope.toggleRowSpinner(spinner);
        var cmd = cfg.server_url + cfg.upload_file;
        var fd = new FormData();
        // Set form data
         fd.append('file', files[0]);
        console.log(files[0])
        dataService.uploadApiFile(cmd, fd).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
            deviceService.showNotifier({message: $scope._t('reloading')});
            $scope.updateZwaveConfig({routemap_img: files[0].name});
            $timeout(function () {
             alertify.dismissAll();
             $window.location.reload();
             }, 2000);
        }, function (error) {
            $timeout($scope.toggleRowSpinner, 1000);
            alertify.alertError($scope._t('upload_image_failed'));
        });
    };
    /**
     * Save node positions
     * @param {object} nodes
     */
    $scope.saveNodesPositions = function(nodes){
        var input = {node_positions: nodes};
        $scope.updateZwaveConfig(input);
    }

    /**
     * Save node positions
     * @param {object} nodes
     */
    $scope.updateZwaveConfig = function(input){
        dataService.postApi('configupdate_url', input).then(function (response) {
           $window.location.reload();
        }, function (error) {
            alertify.alertError($scope._t('error_update_data'));
        });
    }
});