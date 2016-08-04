/**
 * Application factories
 * @author Martin Vach
 */

/*** Factories ***/
var appFactory = angular.module('appFactory', ['ngResource']);

/**
 * Caching the river...
 */
appFactory.factory('myCache', function ($cacheFactory) {
    return $cacheFactory('myData');
});

/**
 * Underscore
 */
appFactory.factory('_', function () {
    return window._; // assumes underscore has already been loaded on the page
});
/**
 * Data service
 * @todo: Replace all data handler with this service
 * @todo: Complete error handling
 */
appFactory.factory('dataService', function ($http, $q, $interval, $filter, $location, $window, myCache, cfg) {
    var updatedTime = Math.round(+new Date() / 1000);
    var apiData;
    var apiDataInterval;
    var deviceClasses;
    var queueDataInterval;
    /**
     * Public functions
     */
    return({
        getZwaveData: getZwaveData,
        getZwaveDataQuietly: getZwaveDataQuietly,
        updateZwaveData: updateZwaveData,
        updateZwaveDataSince: updateZwaveDataSince,
        joinedZwaveData: joinedZwaveData,
        cancelZwaveDataInterval: cancelZwaveDataInterval,
        runCmd: runCmd,
        store: store,
        getDeviceClasses: getDeviceClasses,
        getSelectZDDX: getSelectZDDX,
        getZddXml: getZddXml,
        getCfgXml: getCfgXml,
        putCfgXml: putCfgXml,
        getTiming: getTiming,
        getQueueData: getQueueData,
        updateQueueData: updateQueueData,
        cancelQueueDataInterval: cancelQueueDataInterval,
        runJs: runJs,
        fwUpdate: fwUpdate,
        getNotes: getNotes,
        putNotes: putNotes,
        getReorgLog: getReorgLog,
        putReorgLog: putReorgLog,
        purgeCache: purgeCache,
        getUzb: getUzb,
        updateUzb: updateUzb,
        getLicense: getLicense,
        zmeCapabilities: zmeCapabilities,
        getLanguageFile: getLanguageFile,
        //Test New functions
        getApiLocal: getApiLocal,
        getZwaveList: getZwaveList,
        loadZwaveApiData: loadZwaveApiData,
        loadJoinedZwaveData: loadJoinedZwaveData,
        runZwaveCmd: runZwaveCmd,
        getApi: getApi,
        postApi: postApi,
        xmlToJson: xmlToJson
    });
    /**
     * Get IP
     */
    function getAppIp() {
        if (cfg.custom_ip) {
            var ip = cfg.server_url;
            if (!ip || ip == '') {
                $location.path('/');
            }
        }

    }

    /**
     * Gets all of the data in the remote collection.
     */
    function getZwaveData(callback, noCache) {
        getAppIp();
        var time = Math.round(+new Date() / 1000);
        if (apiData && !noCache) {
            return callback(apiData);
        } else {

            //pageLoader();
            var request = $http({
                method: "POST",
                url: cfg.server_url + cfg.update_url + "0"
                        //url: 'storage/all_cp.json'
            });
            request.success(function (data) {
                $('#update_time_tick').html($filter('getCurrentTime')(time));
                apiData = data;
                pageLoader(true);
                return callback(data);
            }).error(function () {
                pageLoader(true);
                handleError(false, true, false);


            });
        }
    }

    /**
     * Gets all of the data in the remote collection without a "Loading data..." notification.
     */
    function getZwaveDataQuietly(callback) {
        var time = Math.round(+new Date() / 1000);
        if (apiData) {
            return callback(apiData);
        } else {

            var request = $http({
                method: "POST",
                url: cfg.server_url + cfg.update_url + "0"
            });
            request.success(function (data) {
                $('#update_time_tick').html($filter('getCurrentTime')(time));
                apiData = data;
                return callback(data);
            }).error(function () {
                handleError(false, true, true);

            });
        }
    }

    /**
     * Gets updated data in the remote collection.
     */
    function  updateZwaveData(callback) {
        var time = Math.round(+new Date() / 1000);
        var refresh = function () {
            var request = $http({
                method: "POST",
                url: cfg.server_url + cfg.update_url + time
            });
            request.success(function (data) {
                time = data.updateTime;
                $('#update_time_tick').html($filter('getCurrentTime')(time));
                return callback(data);
            }).error(function () {
                handleError();

            });
        };
        apiDataInterval = $interval(refresh, cfg.interval);
    }

    /**
     * Gets one update of data in the remote collection since a specific time.
     * @param since the time (in seconds) to update from.
     * @param callback called in case of successful data reception.
     * @param errorCallback called in case of error.
     */
    function updateZwaveDataSince(since, callback, errorCallback) {
        var time = since;
        var request = $http({
            method: "POST",
            url: cfg.server_url + cfg.update_url + time
        });
        request.success(function (data) {
            time = data.updateTime;
            $('#update_time_tick').html($filter('getCurrentTime')(time));
            return callback(data);
        }).error(function (error) {
            handleError();
            if (errorCallback !== undefined)
                errorCallback(error);
        });
    }

    /**
     * Get updated data and join with ZwaveData
     */
    function  joinedZwaveData(callback) {
        var time = Math.round(+new Date() / 1000);

        var result = {};
        var refresh = function () {
            //console.log(apiData);
            var request = $http({
                method: "POST",
                //url: "storage/updated.json"
                url: cfg.server_url + cfg.update_url + time
            });
            request.success(function (data) {
                $('#update_time_tick').html($filter('getCurrentTime')(time));
                if (!apiData || !data)
                    return;
                time = data.updateTime;
                angular.forEach(data, function (obj, path) {
                    if (!angular.isString(path)) {
                        return;
                    }
                    var pobj = apiData;
                    var pe_arr = path.split('.');
                    for (var pe in pe_arr.slice(0, -1)) {
                        pobj = pobj[pe_arr[pe]];
                    }
                    pobj[pe_arr.slice(-1)] = obj;
                });
                result = {
                    "joined": apiData,
                    "update": data
                };
                return callback(result);
            }).error(function () {
                handleError();

            });
        };
        apiDataInterval = $interval(refresh, cfg.interval);
    }


    /**
     * Cancel data interval
     */
    function cancelZwaveDataInterval() {
        if (angular.isDefined(apiDataInterval)) {
            $interval.cancel(apiDataInterval);
            apiDataInterval = undefined;
        }
        return;
    }

    /**
     * Run api cmd
     */
    function runCmd(param, request, error, noFade) {
        var url = (request ? cfg.server_url + request : cfg.server_url + cfg.store_url + param);
        var request = $http({
            method: 'POST',
            url: url
        });
        request.success(function (data) {
            if (!noFade) {
                $('button .fa-spin,a .fa-spin').fadeOut(1000);
            }

            handleSuccess(data);
        }).error(function () {
            if (!noFade) {
                $('button .fa-spin,a .fa-spin').fadeOut(1000);
            }
            if (error) {
                $window.alert(error + '\n' + url);
            }

        });

    }

    /**
     * Run store api cmd
     */
    function store(param, success, error) {
        var url = cfg.server_url + cfg.store_url + param;
        var request = $http({
            method: 'POST',
            url: url
        });
        request.success(function (data) {
            handleSuccess(data);
            if (success)
                success();
        }).error(function (err) {
            handleError();
            if (error)
                error(err);
        });

    }

    /**
     * Get device classes from XML file
     */
    function getDeviceClasses(callback) {
        if (deviceClasses) {
            return callback(deviceClasses);
        } else {
            var request = $http({
                method: "get",
                url: cfg.server_url + cfg.device_classes_url
            });
            request.success(function (data) {
                var x2js = new X2JS();
                var json = x2js.xml_str2json(data);
                deviceClasses = json;
                return callback(deviceClasses);
            }).error(function () {
                handleError();

            });
        }
    }

    /**
     * Get zddx device selection
     */
    function getSelectZDDX(nodeId, callback, alert) {
        var request = $http({
            method: "POST",
            url: cfg.server_url + cfg.store_url + 'devices[' + nodeId + '].GuessXML()'
        });
        request.success(function (data) {
            return callback(data);
        }).error(function () {
            $(alert).removeClass('allert-hidden');

        });
    }

    /**
     * Get ZddXml file
     */
    function getZddXml(file, callback) {
        var cachedZddXml = myCache.get(file);
        if (cachedZddXml) {
            return callback(cachedZddXml);
        } else {
            var request = $http({
                method: "get",
                url: cfg.server_url + cfg.zddx_url + file
            });
            request.success(function (data) {
                var x2js = new X2JS();
                var json = x2js.xml_str2json(data);
                myCache.put(file, json);
                return callback(json);
            }).error(function () {
                handleError();

            });
        }
    }

    /**
     * Get config XML file
     */
    function getCfgXml(callback) {
        var request = $http({
            method: "get",
            url: cfg.server_url + '/config/Configuration.xml'
        });
        request.success(function (data) {
            var x2js = new X2JS();
            var json = x2js.xml_str2json(data);
            return callback(json);
        }).error(function () {
            return callback(null);

        });
    }

    /**
     * Put config XML file
     */
    function putCfgXml(data) {
        var request = $http({
            method: "PUT",
            //dataType: "text", 
            url: cfg.server_url + '/config/Configuration.xml',
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        request.success(function (data) {
            handleSuccess(data);
        }).error(function (error) {
            $('button .fa-spin,a .fa-spin').fadeOut(1000);
            handleError();

        });
    }


    /**
     * Get timing (statistics) data
     */
    function  getTiming(callback) {
        getAppIp();
        var request = $http({
            method: "POST",
            //url: 'storage/timing.json'
            url: cfg.server_url + cfg.stat_url
        });
        request.success(function (data) {
            return callback(data);
        }).error(function () {
            console.log('Error: CommunicationStatistics');
            handleError(false, true);

        });
    }



    /**
     * Load Queue data
     */
    function getQueueData(callback) {
        if (typeof (callback) != 'function') {
            return;
        }
        ;
        var request = $http({
            method: "POST",
            url: cfg.server_url + cfg.queue_url
        });
        request.success(function (data) {
            return callback(data);
        }).error(function () {
            handleError();

        });
    }

    /**
     * Load and update Queue data
     */
    function updateQueueData(callback) {
        var refresh = function () {
            getQueueData(callback);
        };
        queueDataInterval = $interval(refresh, cfg.queue_interval);
    }
    /**
     * Cancel Queue interval
     */
    function cancelQueueDataInterval() {
        if (angular.isDefined(queueDataInterval)) {
            $interval.cancel(queueDataInterval);
            queueDataInterval = undefined;
        }
        return;
    }

    /**
     * Run JavaScript cmd
     */
    function runJs(param) {
        var request = $http({
            method: 'POST',
            dataType: "json",
            url: cfg.server_url + cfg.runjs_url + param
        });
        request.success(function (data) {
            handleSuccess(data);
        }).error(function () {
            handleError();

        });

    }

    /**
     * Run Firmware Update
     */
    function fwUpdate(nodeId, data) {
        var uploadUrl = cfg.server_url + cfg.fw_update_url + '/' + nodeId;
        var fd = new FormData();
        fd.append('file', data.file);
        fd.append('url', data.url);
        fd.append('targetId', data.targetId);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function () {
            handleSuccess(data);
        }).error(function () {
            handleError();
        });

    }

    /**
     * Gets notes from remote text file
     */
    function getNotes(callback) {
        var request = $http({
            method: 'GET',
            url: cfg.server_url + cfg.notes_url
        });
        request.success(function (data) {
            return callback(data);
        }).error(function () {
            //handleError();
            console.log('Notes error');

        });

    }

    /**
     * Put notes in remote text file
     */
    function putNotes(notes) {
        var request = $http({
            method: "PUT",
            dataType: "text",
            url: cfg.server_url + cfg.notes_url,
            data: notes,
            headers: {
                "Content-Type": "application/json"
            }
        });
        request.success(function (data) {
            handleSuccess(data);
        }).error(function (error) {
            handleError();

        });
    }
    /**
     * Update Uzb
     */
    function getUzb(params) {
        return $http({
            method: 'get',
            url: cfg.uzb_url + params
        }).then(function (response) {
            if (typeof response.data.data === 'object') {
                return response.data.data;
            } else {
                // invalid response
                return $q.reject(response);
            }
        }, function (response) {
            // something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Update Uzb
     */
    function updateUzb(url, data) {
        //alert('Run HTTP request: ' + url);
        return $http({
            method: 'POST',
            url: url,
            data: $.param(data),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {
            return response;
        }, function (response) {
            // something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Get license key
     */
    function getLicense(data) {
        return $http({
            method: 'post',
            url: cfg.license_url,
            data: $.param(data),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {
            if (response.data.license.length > 1) {
                return response.data.license;
            } else {
                // invalid response
                return $q.reject(response);
            }
        }, function (response) {
            //debugger;
            // something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Set ZME Capabilities
     */
    function zmeCapabilities(data) {
//        return $q.reject(data); // Test error response
//        var deferred = $q.defer();
//        deferred.resolve(data);
//        return deferred.promise;// Test success response

        return $http({
            method: 'POST',
            url: cfg.server_url + cfg.license_load_url,
            data: $.param({license: data.toString()}),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {
            return response;
        }, function (response) {
            // something went wrong
            return $q.reject(response);
        });

    }


    /**
     * Gets reorg log from remote text file
     */
    function getReorgLog(callback) {
        return $http({method: 'GET', url: cfg.server_url + cfg.reorg_log_url + '?at=' + (new Date()).getTime()}).success(function (data, status, headers, config) {
            callback(data);
        });
    }

    /**
     * Put reorg log in remote text file
     */
    function putReorgLog(log) {
        return $.ajax({
            type: "PUT",
            dataType: "text",
            url: cfg.server_url + cfg.reorg_log_url,
            contentType: "text/plain",
            data: log
        });
    }

    /**
     * Clear the cached ZWaveData.
     */
    function purgeCache() {
        apiData = undefined;
    }

    /**
     * Load language file
     */
    function getLanguageFile(callback, lang) {
        var langFile = 'language.' + lang + '.json';
        var cached = myCache.get(langFile);
        if (cached) {
            return callback(cached);
        }
        var request = {
            method: "get",
            url: cfg.lang_dir + langFile
        };
        return $http(request).success(function (data) {
            myCache.put(langFile, data);
            return callback(data);
        }).error(function () {
            handleError(false, true);

        });
    }

    /**
     * 
     * Handle errors
     */
    function handleError(message, showResponse, hideContent) {
        // Custom IP show/hide
        $('.custom-ip-error').show();
        $('.custom-ip-success').hide();

        var msg = (message ? message : 'Error handling data from server');
        if (showResponse) {
            $('#respone_container').show();
            $('#respone_container_inner').html('<div class="alert alert-danger alert-dismissable response-message"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> <i class="icon-ban-circle"></i> ' + msg + '</div>');
        }
        $('.error-hide').hide();

        if (hideContent) {
            $('#main_content').hide();
        }

        console.log('Error');

    }

    /**
     * 
     * Handle cmd errors
     */
    function handleCmdError(message) {
        var msg = (message ? message : 'Error handling data from server');
        $('#respone_container').show();
        $('#respone_container_inner').html('<div class="alert alert-danger alert-dismissable response-message"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> <i class="icon-ban-circle"></i> ' + msg + '</div>');
        console.log('Error');

    }

    /**
     * Handle success response
     */
    function handleSuccess(response) {
        console.log('Success');
        return;

    }

    /**
     * Show / Hide page loader
     */
    function pageLoader(hide) {
        // Custom IP show/hide
        $('.custom-ip-error').hide();
        $('.custom-ip-success').show();

        if (hide) {
            $('#respone_container').hide();
            $('#main_content').show();
            $('.error-hide').show();
            return;
        }
        //$('#main_content').hide();
        $('#respone_container').show();
        $('#respone_container_inner').html('<div class="alert alert-warning page-load-spinner"><i class="fa fa-spinner fa-lg fa-spin"></i><br /> Loading data....</div>');
        return;

    }

    ///////////////////////////////////////////////////////////// Test - new functions /////////////////////////////////////////////////////////////////////
    /**
     * Get local data from the storage directory
     * @param {string} file
     * @returns {unresolved}
     */
    function getApiLocal(file) {
        return $http({
            method: 'get',
            url: cfg.local_data_url + file
        }).then(function (response) {
            if (typeof response.data === 'object') {
                return response;
            } else {// invalid response
                return $q.reject(response);
            }
        }, function (response) {// something went wrong
            return $q.reject(response);
        });

    }
    /**
     * Get zwave list
     */
    function getZwaveList(noCache) {
        // Cached data
        var cacheName = 'zwavelist';
        /*var cached = myCache.get(cacheName);
         if (!noCache && cached) {
         var deferred = $q.defer();
         deferred.resolve(cached);
         return deferred.promise; 
         }*/
        return $http({
            method: 'post',
            url: cfg.server_url + cfg.zwave_list
        }).then(function (response) {
            if (typeof response.data === 'object') {
                myCache.put(cacheName, response.data);
                return response.data;
            } else {
                // invalid response
                return $q.reject(response);
            }
        }, function (response) {
            // something went wrong
            return $q.reject(response);
        });
    }
    /**
     * Load ZwaveApiData 
     */
    function loadZwaveApiData(noCache) {
        // Cached data
        var cacheName = 'zwaveapidata';
        var cached = myCache.get(cacheName);
        if (!noCache && cached) {
            var deferred = $q.defer();
            deferred.resolve(cached);
            return deferred.promise;
        }
        return $http({
            method: 'post',
            url: cfg.server_url + cfg.update_url + "0"
        }).then(function (response) {
            if (typeof response.data === 'object') {
                myCache.put(cacheName, response.data);
                return response.data;
            } else {
                // invalid response
                return $q.reject(response);
            }
        }, function (response) {
            // something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Get updated data and join with ZwaveData
     */
    function  loadJoinedZwaveData(ZWaveAPIData) {
        var time = Math.round(+new Date() / 1000);
        var cacheName = 'zwaveapidata';
        var apiData = myCache.get(cacheName);// || ZWaveAPIData;
        //console.log(apiData)
        var result = {};
        return $http({
            method: 'post',
            url: cfg.server_url + cfg.update_url + updatedTime
        }).then(function (response) {
            if (typeof response.data === 'object' && apiData) {
                //time = response.data.updateTime;
                angular.forEach(response.data, function (obj, path) {
                    if (!angular.isString(path)) {
                        return;
                    }
                    var pobj = apiData;
                    var pe_arr = path.split('.');
                    for (var pe in pe_arr.slice(0, -1)) {
                        pobj = pobj[pe_arr[pe]];
                    }
                    pobj[pe_arr.slice(-1)] = obj;
                });
                result = {
                    "joined": apiData,
                    "update": response.data
                };
                response.data = result;
                updatedTime = ($filter('hasNode')(response, 'data.update.updateTime') || Math.round(+new Date() / 1000));
                myCache.put(cacheName, apiData);
                return response;
            } else {
                // invalid response
                return $q.reject(response);
            }
        }, function (response) {
            // something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Run zwave command
     */
    function runZwaveCmd(cmd) {
        return $http({
            method: 'post',
            url: cfg.server_url + cfg.store_url + cmd
        }).then(function (response) {
            return response;
        }, function (response) {// something went wrong
            return $q.reject(response);
        });
    }
    /**
     * Get ZAutomation api data
     * @param {string} api
     * @param {string} params
     * @param {boolean} noCache
     * @returns {unresolved}
     */
    function getApi(api, params, noCache) {
        // Cached data
        var cacheName = api + (params || '');
        var cached = myCache.get(cacheName);

        if (!noCache && cached) {
            var deferred = $q.defer();
            deferred.resolve(cached);
            return deferred.promise;
        }
        return $http({
            method: 'get',
            url: cfg.server_url + cfg[api] + (params ? params : '')
        }).then(function (response) {
            if (!angular.isDefined(response.data)) {
                return $q.reject(response);
            }
            if (typeof response.data === 'object') {
                myCache.put(cacheName, response);
                return response;
            } else {// invalid response
                return $q.reject(response);
            }

        }, function (response) {// something went wrong
            return $q.reject(response);
        });
    }


    /**
     * Post ZAutomation api data
     * @param {string} api
     * @param {object} data
     * @param {string} params
     * @returns {unresolved}
     */
    function postApi(api, data, params) {
        return $http({
            method: "post",
            data: data,
            url: cfg.server_url + cfg[api] + (params ? params : '')
        }).then(function (response) {
            return response;
        }, function (response) {// something went wrong
            return $q.reject(response);
        });
    }
    
    /**
     * Get XML from url and convert it to JSON
     * @param {string} url
     * @param {boolean} noCache
     * @returns {unresolved}
     */
    function xmlToJson(url, noCache) {
        // Cached data
        var cacheName = 'cache_' + url;
        var cached = myCache.get(cacheName);

        if (!noCache && cached) {
            var deferred = $q.defer();
            deferred.resolve(cached);
            return deferred.promise;
        }
        // NOT Cached data
        return $http({
            method: 'get',
            url: url
        }).then(function (response) {
            var x2js = new X2JS();
            var json = x2js.xml_str2json(response.data);
            if (json) {
                myCache.put(cacheName, json);
                return json;
            } else {// invalid response
                return $q.reject(response);
            }
        }, function (response) {// something went wrong
            return $q.reject(response);
        });
    }
});


