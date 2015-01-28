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

    /**
     * Get xml config param
     */
    this.getCfgXmlParam = function(cfgXml, nodeId, instance, commandClass, command) {
        return getCfgXmlParam(cfgXml, nodeId, instance, commandClass, command);
    };

    /**
     *Build config XML file
     */
    this.buildCfgXml = function(data, cfgXml, id, commandclass) {
        return buildCfgXml(data, cfgXml, id, commandclass);
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

    /**
     * Get xml config param
     */
    function getCfgXmlParam(cfgXml, nodeId, instance, commandClass, command) {
        var cfg = $filter('hasNode')(cfgXml, 'config.devices.deviceconfiguration');
        if (!cfg) {
            return [];
        }
        // Get data for given device by id
        var collection = [];
        angular.forEach(cfg, function(v, k) {
            //if (v['_id'] == nodeId && v['_instance'] == instance && v['_commandClass'] == commandClass && v['_command'] == command) {
            if (v['_id'] == nodeId && v['_instance'] == instance && v['_commandclass'] == commandClass && v['_command'] == command) {
//                if(!angular.isArray(v['_parameter'])){
//                    return;
//                }
                var array = JSON.parse(v['_parameter']);
                if (array.length > 2) {
                    collection[array[0]] = array[1];
                }
                else if (array.length == 2){
                 collection = array;
                 
                 }
                else {
                    collection[0] = array[0];
                    return;
                }
            }

        });
        //console.log(collection)
        return collection;

    }

    /**
     *Build config XML file
     */
    function buildCfgXml(data, cfgXml, id, commandclass) {
        var hasCfgXml = false;
       var formData = [];
        if(commandclass == '84'){
            var par1 = JSON.parse(data[0]['parameter']);
            var par2 = JSON.parse(data[1]['parameter']);
            var wakeData = {
                'id':id,
                'instance':data[0]['instance'],
                'commandclass':commandclass,
                'command':data[0]['command'],
                'parameter':'[' + par1 + ',' + par2  + ']'
             };
              formData.push(wakeData);
        }else{
            formData = data;  
        }
        var xmlData = formData; 
        if (angular.isObject(cfgXml) && $filter('hasNode')(cfgXml, 'config.devices.deviceconfiguration')) {
            hasCfgXml = cfgXml.config.devices.deviceconfiguration;
            angular.forEach(hasCfgXml, function(v, k) {
                var obj = {};
                if (v['_id'] == id && v['_commandclass'] == commandclass) {
                    return;
                 }
                    obj['id'] = v['_id'];
                    obj['instance'] = v['_instance'];
                    obj['commandclass'] = v['_commandclass'];
                    obj['command'] = v['_command'];
                    obj['parameter'] = v['_parameter'];
                    xmlData.push(obj);
              
            });
        }
        
        var xml = '<config><devices>' + "\n";
        angular.forEach(xmlData, function(v, k) {
           xml += '<deviceconfiguration id="' + v.id + '" instance="' + v.instance + '" commandclass="' + v.commandclass + '" command="' + v.command + '" parameter="' + v.parameter + '"/>' + "\n";
        });
        xml += '</devices></config>' + "\n";
        return xml;

    }
});
