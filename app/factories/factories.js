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
appFactory.factory('dataService', function ($http, $q, $interval, $filter, $location, $window, deviceService, myCache, cfg) {
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
        updateZwaveDataSince: updateZwaveDataSince,
        joinedZwaveData: joinedZwaveData,
        cancelZwaveDataInterval: cancelZwaveDataInterval,
        store: store,
        getCfgXml: getCfgXml,
        putCfgXml: putCfgXml,
        getQueueData: getQueueData,
        updateQueueData: updateQueueData,
        cancelQueueDataInterval: cancelQueueDataInterval,
        runJs: runJs,
        fwUpdate: fwUpdate,
        getReorgLog: getReorgLog,
        putReorgLog: putReorgLog,
        purgeCache: purgeCache,
        getUzb: getUzb,
        updateUzb: updateUzb,
        getLicense: getLicense,
        zmeCapabilities: zmeCapabilities,
        getLanguageFile: getLanguageFile,
        //Test New functions
        logInApi:  logInApi,
        getApiLocal: getApiLocal,
        loadZwaveApiData: loadZwaveApiData,
        loadJoinedZwaveData: loadJoinedZwaveData,
        runZwaveCmd: runZwaveCmd,
        getApi: getApi,
        postApi: postApi,
        postToRemote: postToRemote,
        getRemoteData: getRemoteData,
        xmlToJson: xmlToJson,
        getTextFile: getTextFile,
        storeTextToFile: storeTextToFile,
        updateDeviceFirmware: updateDeviceFirmware,
        uploadApiFile: uploadApiFile
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
     * todo: deprecated
     * Run api cmd
     */
    /*function runCmd(param, request, error, noFade) {
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

    }*/

    /**
     * todo: Deprecated (used only in ReorganizationController)
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
     * todo: deprecated
     * Get zddx device selection
     */
    /*function getSelectZDDX(nodeId, callback, alert) {
        var request = $http({
            method: "POST",
            url: cfg.server_url + cfg.store_url + 'devices[' + nodeId + '].GuessXML()'
        });
        request.success(function (data) {
            return callback(data);
        }).error(function () {
            $(alert).removeClass('allert-hidden');

        });
    }*/

    /**
     * todo: deprecated
     * Get ZddXml file
     */
    /*function getZddXml(file, callback) {
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
    }*/

    /**
     * Get config XML file
     */
    function getCfgXml() {
        // NOT Cached data
        return $http({
            method: 'get',
            url: cfg.server_url + '/config/Configuration.xml'
        }).then(function (response) {
            var x2js = new X2JS();
            var json = x2js.xml_str2json(response.data);
            if (json) {
                return json;
            } else {// invalid response
                return $q.reject(response);
            }
        }, function (response) {// something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Put config XML file
     */
    function putCfgXml(data) {
        return $http({
            method: "POST",
            //dataType: "text",
            url: cfg.server_url + '/config/Configuration.xml',
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {
            return response;
        }, function (error) {// something went wrong

            return $q.reject(error);
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
     * Handles login process
     * @param {object} data
     * @returns {unresolved}
     */
    function logInApi(data) {
        return $http({
            method: "post",
            data: data,
            url: cfg.server_url + cfg['login']
        }).then(function (response) {
            return response;
        }, function (response) {// something went wrong
            //return response;
            return $q.reject(response);
        });
    }
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
            url: cfg.server_url + cmd
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
            if(response.status == 401 && cfg.app_type == "installer") {
                var auth = cfg.auth;

                logInApi(auth).then(function (response) {
                    var user = response.data.data;
                    deviceService.setZWAYSession(user.sid);
                    deviceService.setUser(user);

                    postApi(api,data,params);

                }, function (error) {
                    var message = $scope._t('error_load_data');
                    if (error.status == 401) {
                        message = $scope._t('error_load_user');
                    }
                    alertify.alertError(message);
                });

            } else {
                return $q.reject(response);
            }
        });
    }

    /**
     * Get data from the remote resource
     * @param {string} url
     * @param {boolean} noCache
     * @returns {unresolved}
     */
    function getRemoteData(url, noCache) {
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
            /*headers: {
             'Accept-Language': lang
             }*/
        }).then(function (response) {
            return response;
        }, function (error) {// something went wrong

            return $q.reject(error);
        });
    }

    /**
     * Post on the remote server
     * @param {string} url
     * @param {object} data
     * @returns {unresolved}
     */
    function postToRemote(url, data, headers) {

        return $http({
            method: 'POST',
            url: url,
            data: data,
            headers: headers
        }).then(function (response) {
            return response;
        }, function (error) {// something went wrong

            return $q.reject(error);
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

    /**
     * Get data from given text file
     * @param url
     * @returns {*}
     */
    function getTextFile(url) {
        return $http({
            method: 'get',
            url: url
        }).then(function (response) {
            return response;
        }, function (response) {// something went wrong
            return $q.reject(response);
        });

    }

    /**
     * Store text data to a given file url
     * @param {string} file
     * @param {string} data
     * @returns {*}
     */
    function storeTextToFile(url,data) {
        return $http({
            method: "POST",
            dataType: "text",
            url: url,
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            return response;
        }, function (response) {// something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Run Firmware Update
     */
    function updateDeviceFirmware(nodeId, data) {
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
     * Upload a file to ZAutomation
     * @param {type} cmd
     * @param {type} data
     * @returns {unresolved}
     */
    function uploadApiFile(cmd, data) {
        var uploadUrl = cfg.server_url + cmd;
        return  $http.post(uploadUrl, data, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            return response;
        }, function (response) {// something went wrong
            return $q.reject(response);
        });

    }
});


