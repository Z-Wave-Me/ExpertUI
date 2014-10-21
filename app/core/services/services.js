/**
 * Application services
 * @author Martin Vach
 */
var appService = angular.module('appService', []);

/**
 * Device service
 */
appService.service('deviceService', function($filter) {
    /// --- Public functions --- ///

    /**
     * Check if is not device
     */
    this.notDevice = function(ZWaveAPIData,node, nodeId) {
        if (nodeId == 255 || nodeId ==  ZWaveAPIData.controller.data.nodeId.value || node.data.isVirtual.value) {
            return true;
        }
        return false;
    };

    /**
     * Check if device isFailed
     */
    this.isFailed = function(node) {
        return node.data.isFailed.value;
    };

    /**
     * Check if device isListening
     */
    this.isListening = function(node) {
        return node.data.isListening.value;
    };

    /**
     * Check if device isFLiRS
     */
    this.isFLiRS = function(node) {
        return !node.data.isListening.value && (node.data.sensor250.value || node.data.sensor1000.value);
    };

    /**
     * Check if device is reset locally
     */
    this.isLocalyReset = function(node) {
        return isLocalyReset(node);
    };


    /// --- Private functions --- ///
    /**
     * isLocalyReset
     */
    function isLocalyReset(node) {
        var isLocalyReset = false;
        for (var iId in node.instances) {
            if (node.instances[iId].commandClasses[90]) {
                isLocalyReset = node.instances[iId].commandClasses[90].data.reset.value;
            }
        }
        return isLocalyReset;
    }
});
