/**
 * @overview This is used to control the Z-Wave controller itself and ot manage the Z-Wave network.
 * @author Martin Vach
 */

/**
 * Control root ontroller
 * @class ControlController
 *
 */
appController.controller('ControlController', function($scope, dataService) {

});

/**
 * This turns the Z-wave controller into an inclusion mode that allows including a device.
 * @class IncludeDeviceController
 *
 */
appController.controller('IncludeDeviceController', function($scope) {
    /**
     * Start/stop Inclusion of a new node.
     * Turns the controller into an inclusion mode that allows including a device.
     * flag=1 for starting the inclusion mode
     * flag=0 for stopping the inclusion mode
     * @param {int} flag
     */
    $scope.addNodeToNetwork = function(flag) {
    };
});

/**
 * This turns the Z-wave controller into an exclusion mode that allows excluding a device.
 * @class ExcludeDeviceController
 *
 */
appController.controller('ExcludeDeviceController', function($scope) {
    /**
     * Start/stop Exclusion of a node.
     * Turns the controller into an exclusion mode that allows excluding a device.
     * flag=1 for starting the exclusion mode
     * flag=0 for stopping the exclusion mode
     * @param {int} flag
     */
    $scope.removeNodeToNetwork = function(flag) {
    };
});

/**
 * It will change Z-wave controller own Home ID to the Home ID of the new network
 * and it will learn all network information from the including controller of the new network.
 * All existing relationships to existing nodes will get lost
 * when the Z-Way controller joins a dierent network
 * @class IncludeNetworkController
 *
 */
appController.controller('IncludeNetworkController', function($scope) {
    /**
     * Set/stop Learn mode.
     * flag=1 for starting the learn mode
     * flag=0 for stopping the learn mode
     * @param {int} flag
     */
    $scope.setLearnMode = function(flag) {
    };
});

/**
 * Restore Z-Wave controller from the backup
 * @class BackupRestoreController
 *
 */
appController.controller('BackupRestoreController', function($scope) {
    $scope.restoreFromBackup = function() {
    };
});

/**
 * This controller will perform a soft restart of the firmware of the Z-Wave controller chip
 * without deleting any network information or setting.
 * @class ZwaveChipRebootController
 *
 */
appController.controller('ZwaveChipRebootController', function($scope) {
    /**
     * The reboot function - restarts Z-Wave chip
     */
    $scope.serialAPISoftReset = function() {
    };
});

/**
 * Erases all values stored in the Z-Wave chip and sent the chip back to factory defaults.
 * This means that all network information will be lost without recovery option.
 * @class ZwaveChipResetController
 *
 */
appController.controller('ZwaveChipResetController', function($scope) {
    /**
     * Send Configuration SetDefault
     */
    $scope.setDefault = function() {
    };
});

/**
 * Change Z-Wave Z-Stick 4 frequency.
 * @class ChangeFrequencyController
 *
 */
appController.controller('ChangeFrequencyController', function($scope) {
    /**
     * Send Configuration ZMEFreqChange
     * @param {int} freq
     */
    $scope.zmeFreqChange = function(freq) {
    };
});

/**
 * The controller will then mark the device as 'failed'
 * but will keep it in the current network conguration.
 * @class RemoveFailedNodeController
 *
 */
appController.controller('RemoveFailedNodeController', function($scope) {
    /**
     * Remove failed node from network.
     * nodeId=x Node id of the device to be removed
     * @param {int} nodeId
     */
    $scope.removeFailedNode = function(nodeId) {
    };
});

/**
 * The controller replaces a failed node by a new node.
 * @class ReplaceFailedNodeController
 *
 */
appController.controller('ReplaceFailedNodeController', function($scope) {
    /**
     * Replace failed node with a new one.
     * nodeId=x Node Id to be replaced by new one
     * @param {int} nodeId
     */
    $scope.replaceFailedNode = function(nodeId) {
    };
});

/**
 * Allows marking battery-powered devices as failed.
 * @class BatteryDeviceFailedController
 *
 */
appController.controller('BatteryDeviceFailedController', function($scope) {
    $scope._n = function() {
    };
});

/**
 * The controller change function allows to handover the primary function to a different controller in
 * the network. The function works like a normal inclusion function but will hand over the primary
 * privilege to the new controller after inclusion. Z-Way will become a secondary controller of the network.
 * @class ControllerChangeController
 *
 */
appController.controller('ControllerChangeController', function($scope) {
    /**
     * Set new primary controller
     * Start controller shift mode if 1 (True), stop if 0 (False)
     * @param {int} mode
     */
    $scope.controllerChange = function(mode) {
    };
});

/**
 * This will call the Node Information Frame from all devices in the network.
 * @class RequestNifAllController
 *
 */
appController.controller('RequestNifAllController', function($scope) {
    /**
     * Request Node Information Frame (NIF) of a device
     * nodeId=x Node Id to be requested for a NIF
     * @param {int} nodeId
     */
    $scope.requestNodeInformation = function(nodeId) {
    };
});

/**
 * ???
 * @class ???
 *
 */
appController.controller('???Controller', function($scope) {
    $scope._n = function() {
    };
});

/**
 * ???
 * @class ???
 *
 */
appController.controller('???Controller', function($scope) {

});

/**
 * ???
 * @class ???
 *
 */
appController.controller('???Controller', function($scope) {

});

/**
 * ???
 * @class ???
 *
 */
appController.controller('???Controller', function($scope) {

});

/**
 * ???
 * @class ???
 *
 */
appController.controller('???Controller', function($scope) {

});