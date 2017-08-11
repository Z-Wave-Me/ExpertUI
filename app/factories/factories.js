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
 */
appFactory.factory('dataService', function ($http, $q, $interval, $filter, $location, $window, deviceService, myCache, cfg) {
    var updatedTime = Math.round(+new Date() / 1000);
    var apiData;
    /**
     * Public functions
     */
    return({
        // With promises
        pingNet: pingNet,
        getCfgXml: getCfgXml,
        putCfgXml: putCfgXml,
        getUzb: getUzb,
        updateUzb: updateUzb,
        getLicense: getLicense,
        zmeCapabilities: zmeCapabilities,
        getLanguageFile: getLanguageFile,
        logInApi:  logInApi,
        getApiLocal: getApiLocal,
        loadZwaveApiData: loadZwaveApiData,
        loadJoinedZwaveData: loadJoinedZwaveData,
        runZwaveCmd: runZwaveCmd,
        getApi: getApi,
        refreshApi: refreshApi,
        postApi: postApi,
        postToRemote: postToRemote,
        getRemoteData: getRemoteData,
        sessionApi: sessionApi,
        xmlToJson: xmlToJson,
        getTextFile: getTextFile,
        storeTextToFile: storeTextToFile,
        uploadApiFile: uploadApiFile,
        postReport: postReport,
        getAppBuiltInfo: getAppBuiltInfo
    });
    /**
     * Check if given url is on-line
     * @param {string} url
     */
    function pingNet(url) {
        return $http({
            method: 'HEAD',
            url: url,
            timeout: 20000
        }).then(function (response) {
            return response;
        }, function (response) {
            return $q.reject(response);
        });

    }
    /**
     * todo: deprecated
     * Get IP
     */
    /*function getAppIp() {
        if (cfg.custom_ip) {
            var ip = cfg.server_url;
            if (!ip || ip == '') {
                $location.path('/');
            }
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
     * Get a file with language keys values from the app/lang directory
     * @param {string} lang
     * @returns {unresolved}
     */
    function getLanguageFile(lang) {
        var langFile = 'language.' + lang + '.json';
        var cached = myCache.get(langFile);

        if (cached) {
            var deferred = $q.defer();
            deferred.resolve(cached);
            return deferred.promise;
        }
        return $http({
            method: 'get',
            url: cfg.lang_dir + langFile
        }).then(function (response) {
            if (typeof response.data === 'object') {
                myCache.put(langFile, response);
                return response;
            } else {
                return $q.reject(response);
            }
        }, function (response) {// something went wrong
            return $q.reject(response);
        });
    }





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
    function  loadJoinedZwaveData() {
        var cacheName = 'zwaveapidata';
        if(_.findWhere($http.pendingRequests,{failWait: cacheName})){
            return $q.reject('Pending');
        }
        var apiData = myCache.get(cacheName);// || ZWaveAPIData;
        var result = {
            joined: apiData,
            update: {}
        };
        return $http({
            method: 'post',
            url: cfg.server_url + cfg.update_url + updatedTime,
            failWait:cacheName
        }).then(function (response) {
            if (_.size(response.data)> 1 && apiData) {
                //console.log('Response > 1')
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
                result.update = response.data;
                response.data = result;
                updatedTime = ($filter('hasNode')(response, 'data.update.updateTime') || Math.round(+new Date() / 1000));
                myCache.put(cacheName, apiData);
                return response;
            } else {
                response.data = result;
                return response;
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
            if (angular.isDefined(response.data)) {
                return response;
            }
            // invalid response
            return $q.reject(response);

        }, function (response) {// something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Get data from the ZAutomation api all x seconds
     * @param {string} api
     * @param {string} params
     * @returns {unresolved}
     */
    function refreshApi(api, params) {
        if(_.findWhere($http.pendingRequests,{failWait: api})){
            return $q.reject('Pending');
        }
        return $http({
            method: 'get',
            url: cfg.server_url + cfg[api] + (params ? params : ''),
            failWait:api
        }).then(function (response) {
            if (angular.isDefined(response.data)) {
                return response;
            }
            // invalid response
            return $q.reject(response);
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
     * Get Z-Wave session
     * @returns {unresolved}
     */
    function sessionApi() {
        return $http({
            method: "get",
            url: cfg.server_url + cfg['session']
        }).then(function (response) {
            return response;
        }, function (response) {// something went wrong
            //return response;
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

    /**
     * Post a bug report on the remote server
     * @param {object} data
     * @returns {unresolved}
     */
    function postReport(data) {
        return $http({
            method: "POST",
            url: cfg.post_report_url,
            data: $.param(data),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {
            return response;
        }, function (response) {// something went wrong
            return $q.reject(response);
        });
    }

    /**
     * Get app built info
     * @param {string} file
     * @returns {unresolved}
     */
    function getAppBuiltInfo() {
        return $http({
            method: 'get',
            url: cfg.app_built_info
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
});