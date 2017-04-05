/**
 * Application services
 * @author Martin Vach
 */
var appService = angular.module('appService', []);

/**
 * Device service
 */
appService.service('deviceService', function($filter, $log, $cookies,$window,cfg,_) {
    /// --- Public functions --- ///

    /**
     * Mobile device detect
     */
    this.isMobile = function(a) {
        return isMobile(a);
    };
    /**
     * Get language line by key
     */
    this.getLangLine = function(key, languages,replacement) {
        return getLangLine(key, languages,replacement);
    };
    
    /**
     * Render alertify notifier
     * @param {object} notifier
     * @returns {undefined}
     */
    this.showNotifier = function (notifier) {
        var param = _.defaults(notifier, {position: 'top-right', message: false, type: 'success', wait: 5});
        if (notifier.message) {
            alertify.set('notifier', 'position', param.position);
            alertify.notify(param.message, param.type, param.wait);
        }
    };

    /**
     * Show connection error
     */
    this.showConnectionError = function(error) {
        $('#update_time_tick').html('<i class="fa fa-minus-circle fa-lg text-danger"></i>');
        return this.logError(error, 'Unable to recieve HTTP data');
    };

    /**
     * Log error
     */
    this.logError = function(error, message) {
        message = message || 'ERROR:';
        $log.error('---------- ' + message + ' ----------', error);
    };

    /**
     * Get user data from cookies
     * @returns {Array|Boolean}
     */
    this.getUser = function () {
        var user = ($cookies.user && !!$cookies.user && $cookies.user !== 'undefined' ? angular.fromJson($cookies.user) : false);
        return user;
    };

    /**
     * Set user data
     * @param {object} data
     * @returns {Boolean|Object}
     */
    this.setUser = function (data) {
        if (data && !!data) {
            $cookies.user = angular.toJson(data);
        } else {
            delete $cookies['user'];
            return false;
        }
        return data;
    };

    /**
     * Unset user data - delete user cookies
     * @returns {undefined}
     */
    this.unsetUser = function () {
        this.setUser(null);
        this.setZWAYSession(null);
    };

    /**
     * Get ZWAY session
     * @returns {string}
     */
    this.getZWAYSession = function () {
        return $cookies.ZWAYSession;
    };
    /**
     * Set ZWAY session
     * @param {string} sid
     * @returns {Boolean|Object}
     */
    this.setZWAYSession = function (sid) {
        if (sid && !!sid) {
            $cookies.ZWAYSession = sid;
        } else {
            delete $cookies['ZWAYSession'];
            return false;
        }
    };

    /**
     * Logout from the system
     * @returns {undefined}
     */
    this.logOut = function () {
        this.setUser(null);
        this.setZWAYSession(null);
        $window.location.href = '#/';
        $window.location.reload();
    };

    /**
     * Check if is not device
     */
    this.notDevice = function(ZWaveAPIData, node, nodeId) {
        /*if (nodeId == 255 || nodeId == ZWaveAPIData.controller.data.nodeId.value || node.data.isVirtual.value) {
            return true;
        }*/
        if (nodeId == 255 || node.data.isVirtual.value) {
            return true;
        }
        return false;
    };

    /**
     * Get device type
     */
    this.deviceType = function(node) {
        var type;
        var isListening = node.data.isListening.value;
        var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
        var hasWakeup = 0x84 in node.instances[0].commandClasses;

        if (node.data.genericType.value === 1) {
            type = 'portable';
        } else if (node.data.genericType.value === 2) {
            type = 'static';
        } else if (isFLiRS) {
            type = 'flirs';
        } else if (hasWakeup) {
            type = 'battery';
        } else if (isListening) {
            type = 'mains';
        } else {
            type = 'unknown';
        }
        return type;
    };

    /**
     * Get last communication
     */
    this.lastCommunication = function(node) {
        var lastReceive = parseInt(node.data.lastReceived.updateTime, 10) || 0;
        var lastSend = parseInt(node.data.lastSend.updateTime, 10) || 0;
        return (lastSend > lastReceive) ? lastSend : lastReceive;
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
        return  (node.data.sensor250.value || node.data.sensor1000.value);
       // return !node.data.isListening.value && (node.data.sensor250.value || node.data.sensor1000.value);
    };

    /**
     * Check if device is reset locally
     */
    this.isLocalyReset = function(node) {
        return isLocalyReset(node);
    };

    /**
     * Check if device has a given command class
     */
    this.hasCommandClass = function(node,ccId) {
        var hasCc = false;
        angular.forEach(node.instances, function(instance, instanceId) {
        if(instance.commandClasses[ccId]){
            hasCc = instance.commandClasses[ccId];
            return;
           }
        });
        return hasCc;
    };

    /**
     * Check if all device interviews are done
     */
    this.allInterviewsDone = function(instances) {
        var  interviewDone = true;
        for (var iId in instances) {
            for (var ccId in instances[iId].commandClasses) {
                var isDone = instances[iId].commandClasses[ccId].data.interviewDone.value;
                if (isDone === false) {
                   return false
                }
            }
        }
        return interviewDone;
    };

    /**
     * Get a value from custom config
     * @param {string} key
     * @returns {string}
     */
    this.getCustomCfgVal = function (key) {
        if (cfg.custom_cfg[cfg.app_type]) {
            return cfg.custom_cfg[cfg.app_type][key] || '';
        }
        return '';
    };
    
    /**
     * Get percentage of delivered packets
     */
    this.getOkPackets = function(data) {
        var isDelivered = 0;
        var notDelivered = 0;
        angular.forEach(data, function(v, k) {
            if (v.delivered == true) {
                isDelivered++;
            } else {
                notDelivered++;
            }

        });
        var calcPercent = isDelivered / data.length * 100;
        var percent = 0;
        if (!isNaN(calcPercent)) {
            percent = calcPercent.toFixed(0);
        }
        return percent;
    };
    
     /**
     * Get list of last packets
     */
    this.getLastPackets = function(data) {
        var packets = '&nbsp;';
        var deliveryTime = 0;
        var color;
        angular.forEach(data.slice(-20), function(v, k) {
            deliveryTime = parseInt(v.deliveryTime);
            if (!v.delivered) {
                color = 'red';
            } else {
                color = (deliveryTime > 100 ? 'black' : 'green');
            }
            var displayTime = deliveryTime / 10;
            packets += '<span class="' + color + ' timing-packet">' + (displayTime.toFixed() < 1 ? 1 : displayTime.toFixed()) + '</span> ';
        });
        return packets;

    };
    
     /**
     * Set Zniffer data
     */
    this.setZnifferData = function(data) {
        return _.chain(data)
                .flatten()
                .filter(function (v) {
                    v.dateTime = $filter('getDateTimeObj')(v.updateTime);
                    v.bytes = (_.isArray(v.value) ? v.value.toString() : v.value);
                    v.rssi = (_.isArray(v.rssi) ? v.rssi.toString() : v.rssi);
                    v.hops = (_.isArray(v.hops) ? v.hops.toString() : v.hops);
                    return v;
                });

    };

    /**
     * Get language from zddx
     */
    this.configGetZddxLang = function(node, lang) {
        return configGetZddxLang(node, lang);
    };

    /**
     * Get config navigation devices
     */
    this.configGetNav = function(ZWaveAPIData) {
        return configGetNav(ZWaveAPIData);
    };
    
    /**
     *  Get expert commands
     */
    this.configGetCommands = function(methods, ZWaveAPIData) {
        return configGetCommands(methods, ZWaveAPIData);
    };

    /**
     *  Get interview ommands
     */
    this.configGetInterviewCommands = function(node, updateTime) {
        return configGetInterviewCommands(node, updateTime);
    };

    /**
     *  Get CommandClass
     */
    this.configGetCommandClass = function(data, name, space) {
        return configGetCommandClass(data, name, space);
    };

    /**
     *  Set CommandClass
     */
    this.configSetCommandClass = function(data, updateTime) {
        return configSetCommandClass(data, updateTime);
    };


    /**
     *  Get interview stage
     */
    this.configInterviewStage = function(ZWaveAPIData, id, languages) {
        return configInterviewStage(ZWaveAPIData, id, languages);
    };

    /**
     *  Set device state
     */
    this.configDeviceState = function(node, languages) {
        return configDeviceState(node, languages);
    };


    /**
     * Config cont
     */
    this.configConfigCont = function(node, nodeId, zddXml, cfgXml, lang, languages) {
        return configConfigCont(node, nodeId, zddXml, cfgXml, lang, languages);
    };

    /**
     *  Switch all cont
     */
    this.configSwitchAllCont = function(node, nodeId, ZWaveAPIData, cfgXml) {
        return configSwitchAllCont(node, nodeId, ZWaveAPIData, cfgXml);
    };

    /**
     * Protection cont
     */
    this.configProtectionCont = function(node, nodeId, ZWaveAPIData, cfgXml) {
        return configProtectionCont(node, nodeId, ZWaveAPIData, cfgXml);
    };

    /**
     * Wakeup cont
     */
    this.configWakeupCont = function(node, nodeId, ZWaveAPIData, cfgXml) {
        return configWakeupCont(node, nodeId, ZWaveAPIData, cfgXml);
    };

    /**
     * Get xml config param
     */
    this.getCfgXmlParam = function(cfgXml, nodeId, instance, commandClass, command) {
        return getCfgXmlParam(cfgXml, nodeId, instance, commandClass, command);
    };

    /**
     * Check if device is in config
     */
    this.isInCfgXml = function(data, cfgXml) {
        return isInCfgXml(data, cfgXml);
    };

    /**
     * Get assoc xml config param
     */
    this.getCfgXmlAssoc = function(cfgXml, nodeId, instance, commandClass, command, groupId) {
        return getCfgXmlAssoc(cfgXml, nodeId, instance, commandClass, command, groupId);
    };


    /**
     *Build config XML file
     */
    this.buildCfgXml = function(data, cfgXml, id, commandclass) {
        return buildCfgXml(data, cfgXml, id, commandclass);
    };

    /**
     *Build assoc config XML file
     */
    this.buildCfgXmlAssoc = function(data, cfgXml) {
        return buildCfgXmlAssoc(data, cfgXml);
    };
    /**
     *Delete from CFG XML - asoc
     */
    this.deleteCfgXmlAssoc = function(data, cfgXml) {
        return deleteCfgXmlAssoc(data, cfgXml);
    };

    /// --- Private functions --- ///

    /**
     * Mobile device detect
     */
    function isMobile(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * Get language line by key
     */
    function getLangLine(key, languages,replacement) {
        var line = key;
        if (angular.isObject(languages)) {
            if (angular.isDefined(languages[key])) {
                line = (languages[key] !== '' ? languages[key] : key);
            }
        }
        return setLangLine(line, replacement,key);
    }
    ;

    /**
     * Set lang line params
     */
    function setLangLine(line, replacement,key) {
        for (var val in replacement) {
            line = line.split(val).join(replacement[val]);
        }
        return line;
    }

    /**
     * isLocalyReset
     */
    function isLocalyReset(node) {
        var isLocalyReset = false;
        for (var iId in node.instances) {
            if (node.instances[iId].commandClasses[90] && node.instances[iId].commandClasses[90].data.reset.value) {
                isLocalyReset = true;
            }
        }
        return isLocalyReset;
    }

    /**
     *  Get language from zddx
     */
    function configGetZddxLang(langs, currLang) {
        if (!langs) {
            return null;
        }
        if (!angular.isArray(langs)) {
            if (("__text" in langs)) {
                return langs.__text;
            }
            return null;
        }
        var lang = _.findWhere(langs, {'_xml:lang': currLang});
        if (lang) {
            return lang.__text;
        }
        var defaultLang = _.findWhere(langs, {'_xml:lang': 'en'});
        if (defaultLang) {
            return defaultLang.__text;
        }
        return null;
    }


    /**
     *  Get config navigation devices
     */
    function configGetNav(ZWaveAPIData) {
        var devices = [];
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || node.data.isVirtual.value) {
                return;
            }
            /*if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }*/
            var node = ZWaveAPIData.devices[nodeId];
            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['isController'] = (controllerNodeId == nodeId);
            for (i = 0; i < 5; i++) {
                devices.push(obj);
            }

            //for(i)
        });
        return devices;
    }

    /**
     *  Get expert commands
     */
    function configGetCommands(methods, ZWaveAPIData) {
        var methodsArr = [];
        angular.forEach(methods, function(params, method) {
            //str.split(',');
            var cmd = {};
            var values = repr_array(method_defaultValues(ZWaveAPIData, methods[method]));
            cmd['data'] = {
                'method': method,
                'params': methods[method],
                'values': method_defaultValues(ZWaveAPIData, methods[method])
            };
            cmd['method'] = method;
            cmd['params'] = methods[method];
            cmd['values'] = repr_array(method_defaultValues(ZWaveAPIData, methods[method]));
            methodsArr.push(cmd);
        });
        return methodsArr;
    }

    /**
     *  Get interview Commands
     */
    function configGetInterviewCommands(node, updateTime) {
        var interviews = [];
        for (var iId in node.instances) {
            var cnt = 0;
            for (var ccId in node.instances[iId].commandClasses) {
                var obj = {};
                obj['iId'] = iId;
                obj['ccId'] = ccId;
                obj['ccName'] = node.instances[iId].commandClasses[ccId].name;
                obj['interviewDone'] = node.instances[iId].commandClasses[ccId].data.interviewDone.value;
                obj['cmdData'] = node.instances[iId].commandClasses[ccId].data;
                obj['cmdDataIn'] = node.instances[iId].data;
                obj['updateTime'] = updateTime;
                interviews.push(obj);
                cnt++;
            }
            ;
        }
        ;
        return interviews;
    }

    /**
     *  Get CommandClass Commands
     */
    function configGetCommandClass(data, name, space) {
        // Formated output
        //var getCmdData = function(data, name, space) {
        if (name == undefined) {
            return '';
        }
        var html = '<div class="cc-data-element">' + space + name + ': <span class="' + ((data.updateTime > data.invalidateTime) ? 'green' : 'red') + '">' + ((typeof (data.value) !== 'undefined' && data.value != null) ? data.value.toString() : 'None') + '</span>' + ' (<span class="' + ((data.updateTime > data.invalidateTime) ? '' : 'red') + '">' + $filter('isTodayFromUnix')(data.updateTime) + '</span>)</div>';
        angular.forEach(data, function(el, key) {

            if (key != 'type' && key != 'updateTime' && key != 'invalidateTime' && key != 'value' && // these are internal values
                    key != 'capabilitiesNames') { // these make the dialog monstrious
                html += configGetCommandClass(el, key, space + '&nbsp;&nbsp;&nbsp;&nbsp;');
            }
        });
        return html;
        //};
    }

    /**
     *  Set CommandClass Commands
     */
    function configSetCommandClass(data, updateTime) {
        var html = data;
        /*if(updateTime){
         html += '<p class="help-block"><em>' + $filter('dateFromUnix')(updateTime )+ '<em></p>'; 
         }*/
        return html;
    }

    /**
     *  Get interview stage
     */
    function configInterviewStage(ZWaveAPIData, id, languages) {
        var istages = [];
        istages.push((ZWaveAPIData.devices[id].data.nodeInfoFrame.value && ZWaveAPIData.devices[id].data.nodeInfoFrame.value.length) ? '+' : '-');
        istages.push('&nbsp;');
        istages.push((0x86 in ZWaveAPIData.devices[id].instances[0].commandClasses) ? (ZWaveAPIData.devices[id].instances[0].commandClasses[0x86].data.interviewDone.value ? '+' : (ZWaveAPIData.devices[id].instances[0].commandClasses[0x86].data.interviewCounter.value > 0 ? '.' : '&oslash;')) : '+'); // Version
        istages.push((0x72 in ZWaveAPIData.devices[id].instances[0].commandClasses) ? (ZWaveAPIData.devices[id].instances[0].commandClasses[0x72].data.interviewDone.value ? '+' : (ZWaveAPIData.devices[id].instances[0].commandClasses[0x72].data.interviewCounter.value > 0 ? '.' : '&oslash;')) : '+'); // ManufacturerSpecific
        istages.push((0x60 in ZWaveAPIData.devices[id].instances[0].commandClasses) ? (ZWaveAPIData.devices[id].instances[0].commandClasses[0x60].data.interviewDone.value ? '+' : (ZWaveAPIData.devices[id].instances[0].commandClasses[0x60].data.interviewCounter.value > 0 ? '.' : '&oslash;')) : '+'); // MultiChannel
        var moreCCs = false;
        for (var i in ZWaveAPIData.devices[id].instances) {
            istages.push('&nbsp;');
            var instance = ZWaveAPIData.devices[id].instances[i];
            for (var cc in instance.commandClasses) {
                moreCCs = true;
                if ((cc == 0x60 && i != 0) || ((cc == 0x86 || cc == 0x72 || cc == 0x60) && i == 0))
                    continue; // skip MultiChannel announced inside a MultiChannel and previously handled CCs.
                istages.push(instance.commandClasses[cc].data.interviewDone.value ? '+' : (instance.commandClasses[cc].data.interviewCounter.value > 0 ? '.' : '&oslash;'));
            }
        }
        ;
        if (!moreCCs) {
            istages.push('.');
        }

        var descr;
        if (istages.indexOf('&oslash;') == -1) {
            if (istages.indexOf('.') == -1 && istages.indexOf('-') == -1)
                descr = getLangLine('device_interview_stage_done', languages);
            else
                descr = getLangLine('device_interview_stage_not_complete', languages);
        } else
            descr = getLangLine('device_interview_stage_failed', languages);
        return descr + '<br />' + istages.join('');
    }

    /**
     *  Set device state
     */
    function configDeviceState(node, languages) {
        var out = '';
        if (!node.data.isListening.value && !node.data.sensor250.value && !node.data.sensor1000.value) {
            out = (node.data.isAwake.value ? '<i class="fa fa-certificate fa-lg text-orange""></i> ' + getLangLine('device_is_active', languages) : '<i class="fa fa-moon-o fa-lg text-primary"></i> ' + getLangLine('device_is_sleeping', languages));
        } else {
            out = (node.data.isFailed.value ? '<i class="fa fa-ban fa-lg text-danger"></i> ' + getLangLine('device_is_dead', languages) : '<i class="fa fa-check fa-lg text-success"></i> ' + getLangLine('device_is_operating', languages));
        }
        return out;
    }

    /**
     * Config cont
     */
    function configConfigCont(node, nodeId, zddXml, cfgXml, lang, languages) {
        if (!0x70 in node.instances[0].commandClasses) {
            return null;
        }
        if (!zddXml) {
            return null;
        }

        if (!zddXml.ZWaveDevice.hasOwnProperty("configParams")) {
            return null;
        }
        var config_cont = [];
        var params = zddXml.ZWaveDevice.configParams['configParam'];

        // Loop throught params
        var parCnt = 0;
        var cfgFile = getCfgXmlParam(cfgXml, nodeId, '0', '70', 'Set');
        angular.forEach(params, function(conf_html, i) {
            //console.log(zddXml);
            if (!angular.isObject(conf_html)) {
                return;
            }

            have_conf_params = true;
            var conf = conf_html;
            var conf_num = conf['_number'];
            //console.log(cfgFile[conf_num])
            var conf_size = conf['_size'];
            var conf_name = configGetZddxLang($filter('hasNode')(conf, 'name.lang'), lang) || getLangLine('configuration_parameter', languages) + ' ' + conf_num;
            var conf_description = configGetZddxLang($filter('hasNode')(conf, 'description.lang'), lang);
            var conf_size = conf['_size'];
            var conf_default_value = null;
            var conf_type = conf['_type'];
            var showDefaultValue = null;
            var config_config_value;

            // get value from the Z-Wave data
            var config_zwave_value = null;

            if (angular.isDefined(node.instances[0].commandClasses[0x70])) {
                if (node.instances[0].commandClasses[0x70].data[conf_num] != null && node.instances[0].commandClasses[0x70].data[conf_num].val.value !== "") {
                    config_zwave_value = node.instances[0].commandClasses[0x70].data[conf_num].val.value;
                    conf_default = config_zwave_value;

                }

            }

            // get default value
            var conf_default = null;
            if (conf['_default'] !== undefined) {
                conf_default = parseInt(conf['_default'], 16);
                showDefaultValue = conf_default;
            }

            // get default value from the config XML
            if (cfgFile[conf_num] !== undefined) {
                config_config_value = cfgFile[conf_num];
            } else {
               if (config_zwave_value !== null) {
                    config_config_value = config_zwave_value;
                } else {
                    config_config_value = conf_default;
                }
            }

            var isUpdated = true;
            var updateTime = '';
            if (angular.isDefined(node.instances[0].commandClasses[0x70])
                    && angular.isDefined(node.instances[0].commandClasses[0x70].data[conf_num])) {
                var uTime = node.instances[0].commandClasses[0x70].data[conf_num].updateTime;
                var iTime = node.instances[0].commandClasses[0x70].data[conf_num].invalidateTime;
                var updateTime = $filter('isTodayFromUnix')(uTime);
                var isUpdated = (uTime > iTime ? true : false);
            }

            // Switch
            var conf_method_descr;
            //console.log(conf_name + ' --- ' + conf_type)
            switch (conf_type) {
                case 'constant':
                case 'rangemapped':
                    var param_struct_arr = [];
                    var conf_param_options = '';

                    angular.forEach(conf['value'], function(value_html, i) {
                        var value = value_html;
                        var value_from = parseInt(value['_from'], 16);
                        var value_to = parseInt(value['_to'], 16);
                        var value_description = null;
                        if (angular.isDefined(value.description)) {
                            value_description = configGetZddxLang($filter('hasNode')(value, 'description.lang'), lang);
                        }
                        if (angular.isDefined(value.lang)) {
                            value_description = configGetZddxLang($filter('hasNode')(value, 'lang'), lang);

                        }
                        var value_repr = value_from; // representative value for the range
                        if (conf_default !== null)
                            if (value_from <= conf_default && conf_default <= value_to) {
                                conf_default_value = value_description;
                                value_repr = conf_default;
                            }
                        param_struct_arr.push({
                            label: value_description,
                             name:  'constant_input_' + nodeId + '_' + conf_num,
                            type: {
                                fix: {
                                    value: value_repr
                                }
                            }
                        });
                    });
                    conf_method_descr = {
                        nodeId: nodeId,
                        label: 'Nº ' + conf_num + ' - ' + conf_name,
                        type: {
                            enumof: param_struct_arr
                        },
                        name: 'constant_input_' + nodeId + '_' + conf_num,
                        description: conf_description,
                        updateTime: updateTime,
                        isUpdated: isUpdated,
                        defaultValue: conf_default_value,
                        showDefaultValue: showDefaultValue,
                        configCconfigValue: config_config_value,
                        configZwaveValue: config_zwave_value,
                        confNum: conf_num,
                        confSize: conf_size
                    };
                    break;
                case 'range':

                    var param_struct_arr = [];
                    var rangeParam = conf['value'];
                    //console.log(rangeParam, conf_num);
                    var rangeParamCnt = 0;
                    if (!rangeParam) {
                        conf_method_descr = {
                            nodeId: nodeId,
                            label: 'Nº ' + conf_num + ' - ' + conf_name,
                            type: {
                                noval: null
                            },
                            name: 'range_input_' + nodeId + '_' + conf_num,
                            description: conf_description,
                            updateTime: updateTime,
                            isUpdated: isUpdated,
                            defaultValue: null,
                            showDefaultValue: showDefaultValue,
                            configCconfigValue: config_config_value,
                            configZwaveValue: config_zwave_value,
                            confNum: conf_num,
                            confSize: conf_size
                        };
                        break;
                    }
                    angular.forEach(rangeParam, function(value_html, ri) {
                        //console.log(ri);
                        var value = value_html;

                        if (ri == 'description') {
                            //console.log(ri);
                            var value_from = parseInt(rangeParam['_from'], 16);
                            var value_to = parseInt(rangeParam['_to'], 16);

                        } else {
                            var value_from = parseInt(value['_from'], 16);
                            var value_to = parseInt(value['_to'], 16);
                        }
                        var value_description = '';
                        if (angular.isDefined(value.description)) {
                            value_description = configGetZddxLang($filter('hasNode')(value, 'description.lang'), lang);
                        }
                        if (angular.isDefined(value.lang)) {
                            value_description = configGetZddxLang($filter('hasNode')(value, 'lang'), lang);
                        }
                        //var value_description = deviceService.configGetZddxLang($filter('hasNode')(value, 'lang'), $scope.lang);

                        if (conf_default !== null)
                            conf_default_value = conf_default;


                        if (value_from != value_to) {
                            if (value_description != '') {
                                var rangeVal = {
                                    label: value_description,
                                    name: 'range_input_' + nodeId + '_' + conf_num,
                                    textName: 'range_input_text_' + rangeParamCnt +'_' + nodeId + '_' + conf_num,
                                    type: {
                                        range: {
                                            min: value_from,
                                            max: value_to
                                        }
                                    }
                                };
                                param_struct_arr.push(rangeVal);
                            }
                        }
                        else // this is a fix value
                        if (value_description != '') {
                            param_struct_arr.push({
                                label: value_description,
                                name: 'range_input_' + nodeId + '_' + conf_num,
                                type: {
                                    fix: {
                                        value: value_from
                                    }
                                }
                            });
                        }
                    rangeParamCnt++;
                    });

                    if (param_struct_arr.length > 1)
                        conf_method_descr = {
                            nodeId: nodeId,
                            label: 'Nº ' + conf_num + ' - ' + conf_name,
                            type: {
                                enumof: param_struct_arr
                            },
                            hideRadio: false,
                            name: 'range_input_' + nodeId + '_' + conf_num,
                            description: conf_description,
                            updateTime: updateTime,
                            isUpdated: isUpdated,
                            defaultValue: conf_default_value,
                            showDefaultValue: showDefaultValue,
                            configCconfigValue: config_config_value,
                            configZwaveValue: config_zwave_value,
                            confNum: conf_num,
                            confSize: conf_size
                        };
                    else if (param_struct_arr.length == 1) {

                        conf_method_descr = {
                            nodeId: nodeId,
                            label: 'Nº ' + conf_num + ' - ' + conf_name,
                            type: {
                                enumof: param_struct_arr
                            },
                            name: 'range_input_' + nodeId + '_' + conf_num,
                            hideRadio: true,
                            description: conf_description,
                            updateTime: updateTime,
                            isUpdated: isUpdated,
                            defaultValue: conf_default_value,
                            showDefaultValue: showDefaultValue,
                            configCconfigValue: config_config_value,
                            configZwaveValue: config_zwave_value,
                            confNum: conf_num,
                            confSize: conf_size
                        };
                    }
                    break;
                case 'bitset':
                    // Remove when a bitset view completed
                    //return;
                    var param_struct_arr = [];
                    var conf_param_options = '';
                    var conf_default_value_arr = new Object;
                    if (conf_default !== null) {
                        var bit = 0;
                        do {
                            if ((1 << bit) & conf_default)
                                conf_default_value_arr[bit] = 'Bit ' + bit + ' set';
                        } while ((1 << (bit++)) < conf_default);
                    }
                    ;
                    angular.forEach(conf['value'], function(value_html, i) {
                        var value = value_html;
                        var value_from = parseInt(value['_from'], 16);
                        var value_to = parseInt(value['_to'], 16);
                        var value_description = '';
                        if (angular.isDefined(value.description)) {
                            value_description = configGetZddxLang($filter('hasNode')(value, 'description.lang'), lang);
                        }
                        if (angular.isDefined(value.lang)) {
                            value_description = configGetZddxLang($filter('hasNode')(value, 'lang'), lang);

                        }
                        //console.log(value_description)
                        if (conf_default !== null) {
                            if (value_from == value_to) {
                                if ((1 << value_from) & conf_default)
                                    conf_default_value_arr[value_from] = value_description;
                            } else {
                                conf_default_value_arr[value_from] = (conf_default >> value_from) & ((1 << (value_to - value_from + 1)) - 1)
                                for (var bit = value_from + 1; bit <= value_to; bit++)
                                    delete conf_default_value_arr[bit];
                            }
                        }
                        ;
                        if (value_from == value_to)
                            param_struct_arr.push({
                                label: value_description,
                                name: 'bitcheck_input_' + nodeId + '_' + conf_num,
                                type: {
                                    bitcheck: {
                                        bit: value_from
                                    }
                                }
                            });
                        else
                            param_struct_arr.push({
                                label: value_description,
                                name: 'bitrange_input_' + nodeId + '_' + conf_num,
                                type: {
                                    bitrange: {
                                        bit_from: value_from,
                                        bit_to: value_to
                                    }
                                }
                            });
                    });

                    if (conf_default !== null) {
                        conf_default_value = conf_default;
                        //conf_default_value = '';
                        for (var ii in conf_default_value_arr){
                            conf_default_value += conf_default_value_arr[ii] + ', ';
                        }
                        if (conf_default_value.length){
                            conf_default_value = conf_default_value.substr(0, conf_default_value.length - 2);
                        }

                    }
                    conf_method_descr = {
                        nodeId: nodeId,
                        label: 'Nº ' + conf_num + ' - ' + conf_name,
                        type: {
                            bitset: param_struct_arr
                        },
                        name: 'bitset_input_' + nodeId + '_' + conf_num,
                        description: conf_description,
                        updateTime: updateTime,
                        isUpdated: isUpdated,
                        defaultValue: conf_default_value,
                        showDefaultValue: showDefaultValue,
                        configCconfigValue: config_config_value,
                        configZwaveValue: config_zwave_value,
                        confNum: conf_num,
                        confSize: conf_size
                    };
                   break;
                default:
                    return;
                    //conf_cont.append('<span>' + $.translate('unhandled_type_parameter') + ': ' + conf_type + '</span>');
            }
            ;

            config_cont.push(conf_method_descr);
            parCnt++;
        });
        return config_cont;
    }

    /**
     * Switch all cont
     */
    function configSwitchAllCont(node, nodeId, ZWaveAPIData, cfgXml) {
        var switchall_cont = false;
        if (0x27 in node.instances[0].commandClasses) {
            var cfgFile = getCfgXmlParam(cfgXml, nodeId, '0', '27', 'Set');
            var uTime = node.instances[0].commandClasses[0x27].data.mode.updateTime;
            var iTime = node.instances[0].commandClasses[0x27].data.mode.invalidateTime;
            var updateTime = $filter('isTodayFromUnix')(uTime);
            var isUpdated = (uTime > iTime ? true : false);
            var gui_descr = getMethodSpec(ZWaveAPIData, nodeId, 0, 0x27, 'Set');
            var conf_default_value = 0;
            var switchall_conf_value;
            if (cfgFile !== undefined) {
                switchall_conf_value = cfgFile[0];
            } else {
                switchall_conf_value = 1;// by default switch all off group only
            }
            switchall_cont = {
                'params': gui_descr,
                'values': {0: switchall_conf_value},
                name: 'switchall_' + nodeId + '_' + 0,
                updateTime: updateTime,
                isUpdated: isUpdated,
                defaultValue: conf_default_value,
                showDefaultValue: conf_default_value,
                configCconfigValue: switchall_conf_value,
                confNum: 0,
                confSize: 0,
                cmd: 'devices[' + nodeId + '].instances[0].commandClasses[0x27]'
            };

        }
        ;
        return switchall_cont;
    }

    /**
     * Protection cont
     */
    function configProtectionCont(node, nodeId, ZWaveAPIData, cfgXml) {
        var protection_cont = false;
        if (0x75 in node.instances[0].commandClasses) {
            var cfgFile = getCfgXmlParam(cfgXml, nodeId, '0', '75', 'Set');
            var uTime = node.instances[0].commandClasses[0x75].data.state.updateTime;
            var iTime = node.instances[0].commandClasses[0x75].data.state.invalidateTime;
            var updateTime = $filter('isTodayFromUnix')(uTime);
            var isUpdated = (uTime > iTime ? true : false);
            var gui_descr = getMethodSpec(ZWaveAPIData, nodeId, 0, 0x75, 'Set');
            var conf_default_value = 0;
            var protection_conf_value;
            //var protection_conf_rf_value;
            // get default value from the config XML
            if (cfgFile !== undefined) {
                protection_conf_value = cfgFile[0];
            } else {
                protection_conf_value = 0;// by default switch all off group only
            }

            protection_cont = {
                'params': gui_descr,
                'values': {0: protection_conf_value},
                name: 'protection_' + nodeId + '_' + 0,
                updateTime: updateTime,
                isUpdated: isUpdated,
                defaultValue: conf_default_value,
                showDefaultValue: conf_default_value,
                configCconfigValue: protection_conf_value,
                confNum: 0,
                confSize: 0,
                cmd: 'devices[' + nodeId + '].instances[0].commandClasses[0x75]'
            };
        }
        ;
        return protection_cont;
    }

    /**
     * Wakeup cont
     */
    function configWakeupCont(node, nodeId, ZWaveAPIData, cfgXml) {
        var wakeup_cont = false;
        if (0x84 in node.instances[0].commandClasses) {
            var cfgFile = getCfgXmlParam(cfgXml, nodeId, '0', '84', 'Set');
            var wakeup_zwave_min = (node.instances[0].commandClasses[0x84].data.version.value == 1) ? 0 : node.instances[0].commandClasses[0x84].data.min.value;
            var wakeup_zwave_max = (node.instances[0].commandClasses[0x84].data.version.value == 1) ? 0xFFFFFF : node.instances[0].commandClasses[0x84].data.max.value;
            var wakeup_zwave_value = node.instances[0].commandClasses[0x84].data.interval.value;
            var wakeup_zwave_default_value = (node.instances[0].commandClasses[0x84].data.version.value == 1) ? 86400 : node.instances[0].commandClasses[0x84].data['default'].value; // default is a special keyword in JavaScript
            var wakeup_zwave_nodeId = node.instances[0].commandClasses[0x84].data.nodeId.value;
            var uTime = node.instances[0].commandClasses[0x84].data.updateTime;
            var iTime = node.instances[0].commandClasses[0x84].data.invalidateTime;
            var updateTime = $filter('isTodayFromUnix')(uTime);
            var isUpdated = (uTime > iTime ? true : false);
            if (wakeup_zwave_min !== '' && wakeup_zwave_max !== '') {
                var gui_descr = getMethodSpec(ZWaveAPIData, nodeId, 0, 0x84, 'Set');
                gui_descr[0].type.range.min = parseInt(wakeup_zwave_min, 10);
                gui_descr[0].type.range.max = parseInt(wakeup_zwave_max, 10);
                var wakeup_conf_value;
                var wakeup_conf_node_value = 0;
                if (angular.isArray(cfgFile) && cfgFile.length > 0) {
                    wakeup_conf_value = cfgFile[0] || 0;
                    wakeup_conf_node_value = cfgFile[1] || 0;
                } else {
                    if (wakeup_zwave_value != "" && wakeup_zwave_value != 0 && wakeup_zwave_nodeId != "") {
                        // not defined in config: adopt devices values
                        wakeup_conf_value = parseInt(wakeup_zwave_value, 10);
                    } else {
                        // values in device are missing. Use defaults
                        wakeup_conf_value = parseInt(wakeup_zwave_default_value, 10);
                    }
                    ;
                }
                ;
                wakeup_cont = {
                    'params': gui_descr,
                    'values': {"0": wakeup_conf_value},
                    type: 'wakeup',
                    name: 'wakeup_' + nodeId + '_' + 0,
                    updateTime: updateTime,
                    isUpdated: isUpdated,
                    defaultValue: wakeup_zwave_default_value,
                    showDefaultValue: wakeup_zwave_default_value,
                    configCconfigValue: wakeup_conf_value,
                    configCconfigNodeValue: wakeup_conf_node_value,
                    confNum: 0,
                    confSize: 0,
                    cmd: 'devices[' + nodeId + '].instances[0].commandClasses[0x84]'
                };
            } else {
                //$('#wakeup_cont .cfg-block-content').append('<span>' + $scope._t('config_ui_wakeup_no_min_max') + '</span>');
            }
        }
        ;
        return wakeup_cont;
    }
    /**
     * Get xml config param
     */
    function getCfgXmlParam(cfgXml, nodeId, instance, commandClass, command) {
        //console.log(cfgXml)
        var collection = [];
        var cfg = $filter('hasNode')(cfgXml, 'config.devices.deviceconfiguration');
        var parseParam = function(v,nodeId, instance, commandClass, command){
            if (v['_id'] == nodeId && v['_instance'] == instance && v['_commandclass'] == commandClass && v['_command'] == command) {

                var array = JSON.parse(v['_parameter']);
                if (array.length > 2) {
                    collection[array[0]] = array[1];
                }
                else if (array.length == 2) {
                    collection = array;

                }
                else {
                    collection[0] = array[0];
                    return;
                }
            }
        }
        if (!cfg) {
            return [];
        }
        // Get data for given device by id
        if(_.isArray(cfg) ){
            angular.forEach(cfg, function(v, k) {
                parseParam(v,nodeId, instance, commandClass, command);

            });
        }else{
           parseParam(cfg,nodeId, instance, commandClass, command);
        }

        return collection;

    }

    /**
     * Check if device is in config
     */
    function isInCfgXml(data, cfgXml) {
        var inConfig = false;
        var hasCfgXml = false;
        if (angular.isObject(cfgXml) && $filter('hasNode')(cfgXml, 'config.devices.deviceconfiguration')) {
            hasCfgXml = cfgXml.config.devices.deviceconfiguration;
            if (!_.isArray(hasCfgXml)) {
                var obj = {};
                obj['id'] = hasCfgXml['_id'];
                obj['instance'] = hasCfgXml['_instance'];
                obj['commandclass'] = hasCfgXml['_commandclass'];
                obj['command'] = hasCfgXml['_command'];
                obj['parameter'] = hasCfgXml['_parameter'];
                if (JSON.stringify(obj) === JSON.stringify(data)) {
                    return true;
                }
                return false;
            }
            angular.forEach(hasCfgXml, function(v, k) {

                var obj = {};
                obj['id'] = v['_id'];
                obj['instance'] = v['_instance'];
                obj['commandclass'] = v['_commandclass'];
                obj['command'] = v['_command'];
                obj['parameter'] = v['_parameter'];

                /*console.log('XML:',JSON.stringify(obj))
                 console.log('DATA:',JSON.stringify(data))*/
                if (JSON.stringify(obj) === JSON.stringify(data)) {
                    inConfig = true;
                    return;
                }
            });
        }
        return inConfig;
    }
    /**
     * Get assoc xml config param
     */
    function getCfgXmlAssoc(cfgXml, nodeId, instance, commandClass, command, groupId) {
        var cfg = $filter('hasNode')(cfgXml, 'config.devices.deviceconfiguration');
        if (!cfg) {
            return [];
        }
        // Get data for given device by id
        var collection = [];
        collection[groupId] = {
            nodes: [],
             nodeInstances: []
        };
        if (!(_.isArray(cfg))) {
            if (cfg['_id'] == nodeId && cfg['_instance'] == instance && cfg['_commandclass'] == commandClass && cfg['_command'] == command) {

                var obj = {};
                var array = JSON.parse(cfg['_parameter']);

                if (array.length == 2) {
                    obj['groupId'] = array[0];
                    obj['deviceId'] = array[1];
                    if (array[0] == groupId && array[1] > 1) {
                        collection[groupId].nodes.push(array[1]);
                    }


                }
                if (array.length > 2) {
                        obj['groupId'] = array[0];
                        obj['deviceId'] = array[1];
                        obj['instanceId'] = array[2];
                        if (array[0] == groupId && array[1] > 0) {
                            collection[groupId].nodeInstances.push(array[1] + '_' + array[2]);
                        }
                    }
                }
        } else {
            angular.forEach(cfg, function(v, k) {
                if (v['_id'] == nodeId && v['_instance'] == instance && v['_commandclass'] == commandClass && v['_command'] == command) {
                    var obj = {};
                    var array = JSON.parse(v['_parameter']);
                    if (array.length == 2) {
                        obj['groupId'] = array[0];
                        obj['deviceId'] = array[1];
                        if (array[0] == groupId && array[1] > 0) {
                             collection[groupId].nodes.push(array[1]);
                        }
                    }
                    if (array.length > 2) {
                        obj['groupId'] = array[0]; 
                        obj['deviceId'] = array[1];
                        obj['instanceId'] = array[2];
                        if (array[0] == groupId && array[1] > 0) {
                            collection[groupId].nodeInstances.push(array[1] + '_' + array[2]);
                        }
                    }
                }

            }); 
        }
        return collection;

    }

    /**
     *Build config XML file
     */
    function buildCfgXml(data, cfgXml, id, commandclass) {
        var hasCfgXml = false;
        var assocCc = [133, 142];
       /* var formData = [];
        if (commandclass == '84') {
            var par1 = JSON.parse(data[0]['parameter']);
            var par2 = JSON.parse(data[1]['parameter']);
            var wakeData = {
                'id': id,
                'instance': data[0]['instance'],
                'commandclass': commandclass,
                'command': data[0]['command'],
                'parameter': '[' + par1 + ',' + par2 + ']'
            };
            formData.push(wakeData);
        } else {
            formData = data;
        }
        var xmlData = formData;*/
        var xmlData = data;
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
                obj['group'] = v['_group'];
                xmlData.push(obj);

            });
        }
        var ret = buildCfgXmlFile(xmlData);
        return ret;

    }

    /**
     *Build config assoc XML file
     */
    function buildCfgXmlAssoc(data, cfgXml) {
        var hasCfgXml = false;
        var xmlData = [];
        if (angular.isObject(cfgXml) && $filter('hasNode')(cfgXml, 'config.devices.deviceconfiguration')) {
            hasCfgXml = cfgXml.config.devices.deviceconfiguration;
            if (_.isArray(hasCfgXml)) {
                angular.forEach(hasCfgXml, function(v, k) {
                    var obj = {};
                    obj['id'] = v['_id'];
                    obj['instance'] = v['_instance'];
                    obj['commandclass'] = v['_commandclass'];
                    obj['command'] = v['_command'];
                    obj['parameter'] = v['_parameter'];
                    if (JSON.stringify(obj) !== JSON.stringify(data)) {
                        xmlData.push(obj);
                    }
                });

            } else {
                var obj = {};
                obj['id'] = hasCfgXml['_id'];
                obj['instance'] = hasCfgXml['_instance'];
                obj['commandclass'] = hasCfgXml['_commandclass'];
                obj['command'] = hasCfgXml['_command'];
                obj['parameter'] = hasCfgXml['_parameter'];
                if (JSON.stringify(obj) !== JSON.stringify(data)) {
                    xmlData.push(obj);
                }
            }
        }
        xmlData.push(data);
        var ret = buildCfgXmlFile(xmlData);
        return ret;

    }

    /**
     *Delete from cfg xml file - assoc
     */
    function deleteCfgXmlAssoc(data, cfgXml) {
        
        var xmlData = [];
        var hasCfgXml = $filter('hasNode')(cfgXml, 'config.devices.deviceconfiguration');
        if (hasCfgXml) {
            if (_.isArray(hasCfgXml)) {
                angular.forEach(hasCfgXml, function(v, k) {
                    var obj = {};
                    obj['id'] = v['_id'];
                    obj['instance'] = v['_instance'];
                    obj['commandclass'] = v['_commandclass'];
                    obj['command'] = v['_command'];
                    obj['parameter'] = v['_parameter'];
                    if (JSON.stringify(obj) !== JSON.stringify(data)) {
                        xmlData.push(obj);
                        /* 
                         console.log('XML:',JSON.stringify(obj))
                         console.log('DATA:',JSON.stringify(data))*/
                    }

                });
            } else {
                var obj = {};
                obj['id'] = hasCfgXml['_id'];
                obj['instance'] = hasCfgXml['_instance'];
                obj['commandclass'] = hasCfgXml['_commandclass'];
                obj['command'] = hasCfgXml['_command'];
                obj['parameter'] = hasCfgXml['_parameter'];
               
                if (JSON.stringify(obj) !== JSON.stringify(data)) {
                    xmlData.push(obj);
                }
            }

        }
        return buildCfgXmlFile(xmlData);
    }

    /**
     * Build cfg XML file
     */
    function buildCfgXmlFile(xmlData) {
        var xml = '<config><devices>' + "\n";
        angular.forEach(xmlData, function(v, k) {
            if (_.isNumber(parseInt(v.id, 10))) {
                xml += '<deviceconfiguration id="' + v.id + '" instance="' + v.instance + '" commandclass="' + v.commandclass + '" command="' + v.command + '" parameter="' + v.parameter + '"/>' + "\n";
            }
        });
        xml += '</devices></config>' + "\n";
        return xml;

    }
});
