/**
 * Configuration controller
 * @author Martin Vach
 */
// Redirect to new version of configuration
appController.controller('ConfigRedirectController', function ($routeParams, $location, $cookies, $filter) {
    var configUrl = 'configuration/interview';
    var nodeId = function () {
        var id = 1;
        if ($routeParams.nodeId == undefined) {
            id = (angular.isDefined($cookies.configuration_id) ? $cookies.configuration_id : 1);
        } else {
            id = $routeParams.nodeId;
        }
        return id;
    };
    if (nodeId() == $cookies.configuration_id) {
        if (angular.isDefined($cookies.config_url)) {
            configUrl = $cookies.config_url;
        }
    } else {
        configUrl = configUrl + '/' + nodeId();
    }
//    console.log('$routeParams.nodeId: ' +  nodeId())
//    console.log('$cookies.configuration_id: ' + $cookies.configuration_id)
//    console.log(configUrl)
//    return;
    $location.path(configUrl);
});

/**
 * Load device XML file
 * @class LoadDeviceXmlController
 *
 */
appController.controller('LoadDeviceXmlController', function($scope,$routeParams, $timeout,$window,cfg, dataService) {
    $scope.deviceXml = {
        all: [],
        find: [],
        input: {
            fileName: 0
        }
    };
    /**
     * Load devices descriptions
     * @param {int} nodeId
     */
    $scope.loadDeviceXml = function (nodeId) {
        var cmd = 'devices[' + nodeId + '].GuessXML()';
       dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {
           $scope.deviceXml.all = response.data;
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_load_data') + '\n' + cmd);
        });
    };
    $scope.loadDeviceXml($routeParams.nodeId);

    /**
     * Change device XML
     * @param {object} input
     */
    $scope.changeDeviceXml = function (input) {
        var find = _.findWhere($scope.deviceXml.all, {fileName: input.fileName});
        if(find){
            $scope.deviceXml.find = find;
        }else{
            $scope.deviceXml.find = {};
        }
    };

    /**
     * Store device XML
     * @param {object} input
     */
    $scope.storeDeviceXml = function (input,modal) {
        var timeout = 1000;
        var cmd = 'devices[' + $routeParams.nodeId + '].LoadXMLFile("' + input.fileName + '")';
        $scope.toggleRowSpinner(modal);
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {
            $timeout(function(){
                $scope.toggleRowSpinner();
                $scope.handleModal();
                //$scope.reloadData();
                $window.location.reload();
            }, timeout);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data') + '\n' + cmd);
        });
    };
});
