/**
 * @overview This controller renders and handles device expert commands stuff.
 * @author Martin Vach
 */

/**
 * Device expert commands controller
 * @class ConfigCommandsController
 *
 */
appController.controller('ConfigCommandsController', function ($scope, $routeParams, $location, $cookies, $interval, $timeout, $filter, cfg, dataService, deviceService, _, configurationCommandsService, $element, dataHolderService) {
    $scope.expanded = {};
    $scope.dataHolder = {};
    $scope.deviceId = $routeParams.nodeId;
    $scope.devices = [];
    $scope.selfExcludedStore = [];
    $scope.activeUrl = 'configuration/commands/';
    $scope.errorOnLoad = false;
    /**
     * Cancel interval on page destroy
     */
    $scope.locationOptions = {
        get commandStyle() {
            return $cookies.expertCommandStyle ?? 'HTTP'
        }
    }
    $scope.$on('$destroy', function () {
        configurationCommandsService.destroy();
        $scope.cancelOn();
    });
    $scope.cancelOn = $scope.$on('configuration-commands:cc-table:update', function (event, ccTable) {
        $scope.dataHolder.ccTable = ccTable;
    })
    // Redirect to device
    $scope.redirectToDevice = function (deviceId) {
        if (deviceId) {
            $location.path($scope.activeUrl + deviceId);
        }
    };
    $scope.collapse = function () {
        $element.find('.collapse').removeClass('in');
        Object.keys($scope.expanded).map(key => $scope.expanded[key] = false)
    }
    function onInit() {
        configurationCommandsService.init($routeParams.nodeId).then(function (commands) {
            $scope.commandsUpdated = commands;
            $scope.node = configurationCommandsService.node();
            const configCommands = commands.find(({instance, ccId}) =>  ccId === 112 && instance === 0);
            if (configCommands.version >= 3) $scope.configCommands = configurationCommandsService.getConfigCommands($routeParams.nodeId);
            else $scope.configCommands = configCommands;
        }).catch(() => {
            $scope.alert = {
                message: $scope._t('device_404'),
                status: 'alert-warning',
                icon: 'fa-exclamation-circle'
            };
            $scope.errorOnLoad = true;
        }).finally(() => {
            const deviceList = dataHolderService.deviceList();
            $scope.selfExcludedStore = deviceList.filter(({id}) => id !== +$scope.deviceId);
        });
    }
    onInit();

    /**
     * Show modal CommandClass dialog
     */
    $scope.handleCmdClassModal = function (target, $event, instanceId, ccId, type) {
        if (type === 'instance') {
            $scope.commandClass = deviceService.configGetCommandClass(
              dataHolderService.getRealNodeById($routeParams.nodeId).instances[instanceId].data, '/', '');
        }
        if (type === 'commandClass') {
            $scope.commandClass = deviceService.configGetCommandClass(
              dataHolderService.getRealNodeById($routeParams.nodeId).instances[instanceId].commandClasses[ccId].data, '/', '');
        }
        $scope.handleModal(target, $event);
    };
});
