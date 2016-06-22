/**
 * LocksController
 * @author Martin Vach
 */
appController.controller('LocksController', function($scope, $filter, dataService) {
    $scope.locks = [];
    $scope.reset = function() {
        $scope.locks = angular.copy([]);
    };
    // Load data
    $scope.load = function(lang) {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
                refreshData(data);
            });
        });
    };
    // Load data
    $scope.load($scope.lang);

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });
    // Store data on remote server
    $scope.store = function(btn) {
        var url = $(btn).attr('data-store-url');
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
        return;
    };
    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        var doorLockCCId = 0x62;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }

            // Loop throught instances
            var cnt = 1;
            angular.forEach(node.instances, function(instance, instanceId) {
                // we don't want devices without DoorLock CC
                if (!(doorLockCCId in instance.commandClasses)) {
                    return;
                }

                // CC gui
                var mode = instance.commandClasses[doorLockCCId].data.mode.value;
                if (mode === '' || mode === null) {
                    mode = 0;
                }

                var ccId = 98;
                // Set object
                var obj = {};
                //var level = $scope.updateLevel(instance.commandClasses[ccId].data.level, ccId);

                obj['id'] = nodeId;
                obj['cmd'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.mode';
                obj['ccId'] = doorLockCCId;
                obj['rowId'] = 'row_' + nodeId + '_' + cnt;
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['level'] = mode;
                obj['updateTime'] = instance.commandClasses[ccId].data.mode.updateTime;
                obj['invalidateTime'] = instance.commandClasses[ccId].data.mode.invalidateTime;
                obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.mode';
                $scope.locks.push(obj);
                cnt++;
            });
        });
    }

    /**
     * Refresh zwave data
     */
    function refreshData(data) {
        angular.forEach($scope.locks, function(v, k) {

            if (v.cmdToUpdate in data.update) {
                var obj = data.update[v.cmdToUpdate];
                var active = obj.value;
                var level = $filter('lockStatus')(obj.value);
                var updateTime = $filter('isTodayFromUnix')(obj.updateTime);
                $('#' + v.rowId + ' .row-time').html(updateTime).removeClass('is-updated-false');
                $('#' + v.rowId + ' .row-level').html(level);
                $('#' + v.rowId + ' .btn-group-lock button').removeClass('active');
                if (active == '255') {
                    $('#' + v.rowId + ' .btn-lock').addClass('active');
                } else {
                    $('#' + v.rowId + ' .btn-unlock').addClass('active');
                }
            }
        });
    }
});