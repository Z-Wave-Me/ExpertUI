appController.controller('ResetStatistic', function ($scope, dataService) {
    $scope.rowSpinner = {}
    $scope.resetNetworkStatistics = function () {
        console.log('reseted')
        $scope.rowSpinner['clearNetworkStatistics'] = true;
        dataService.getApi('clearPacketLog', '', true).finally(() => window.location.reload())
    }
})
