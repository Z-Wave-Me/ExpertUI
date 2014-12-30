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
     * Get language line by key
     */
    this.getLangLine = function(key, languages) {
        if (angular.isObject(languages)) {
            if (angular.isDefined(languages[key])) {
                return languages[key] !== '' ? languages[key] : key;
            }
        }
        return key;
    };

    /**
     * Check if is not device
     */
    this.notDevice = function(ZWaveAPIData, node, nodeId) {
        if (nodeId == 255 || nodeId == ZWaveAPIData.controller.data.nodeId.value || node.data.isVirtual.value) {
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

    /**
     * Get language from zddx
     */
    this.configGetZddxLang = function(node, lang) {
        return configGetZddxLang(node, lang);
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

    /**
     *  Get language from zddx
     */
    function configGetZddxLang(langs, currLang) {
       var label = null;
       if (!langs) {
            return label;
        }
        
       if (angular.isArray(langs)) {
            angular.forEach(langs, function(lang, index) {
                if (("__text" in lang) && (lang["_xml:lang"] == currLang)) {
                    label = lang.__text;
                    return false;
                }
                if (("__text" in lang) && (lang["_xml:lang"] == "en")) {
                    label = lang.__text;
                }
            });
        } else {
            if (("__text" in langs)) {
                label = langs.__text;
            }
        }
        return label;
    }
});
