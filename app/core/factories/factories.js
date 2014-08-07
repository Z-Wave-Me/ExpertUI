/**
 * Application factories
 * @author Martin Vach
 */

/*** Factories ***/
var appFactory = angular.module('appFactory', ['ngResource']);

appFactory.config(function($httpProvider) {
    //$httpProvider.defaults.withCredentials = true;
// $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = 'accept, origin, content-type, cookie'; 
//    $httpProvider.defaults.headers.common['Access-Control-Allow-Credential'] = 'true'; 
//    $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = 'accept, origin, content-type, cookie'; 
    //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = 'accept, origin, content-type, cookie'; 
    //$httpProvider.defaults.headers.common['X-Requested-With'] = ''; 
    //$httpProvider.defaults.headers.common['Cookie'] = 'ZBW_IFLANG=eng; ZBW_SESSID=ced27083bfaff559438d79a72949c1064262d312'; 

    $httpProvider.responseInterceptors.push('myHttpInterceptor');

    var spinnerFunction = function spinnerFunction(data, headersGetter) {
        $(".main_spinner__").show();
        return data;
    };
    $httpProvider.defaults.transformRequest.push(spinnerFunction);
});
appFactory.factory('myHttpInterceptor', function($q, $window) {
    return function(promise) {
        return promise.then(function(response) {
            $('#respone_container').hide();
            return response;
        }, function(response) {
            //$('#respone_container').html('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> <i class="icon-ban-circle"></i> <strong>ERROR!</strong> Response error</div>').show();
            return $q.reject(response);
        });
    };
});

/**
 * Caching the river...
 */
appFactory.factory('myCache', function($cacheFactory) {
    return $cacheFactory('myData');
});
/**
 * Data service
 * @todo: Replace all data handler with this service
 * @todo: Complete error handling
 */
appFactory.factory('dataService', function($http, $q, $interval, $filter, myCache, cfg) {
    var apiData;
    var apiDataInterval;
    var deviceClasses;
    var queueDataInterval;
    /**
     * Public functions
     */
    return({
        getZwaveData: getZwaveData,
        updateZwaveData: updateZwaveData,
        cancelZwaveDataInterval: cancelZwaveDataInterval,
        runCmd: runCmd,
        getDeviceClasses: getDeviceClasses,
        getQueueData: getQueueData,
        updateQueueData: updateQueueData,
        cancelQueueDataInterval: cancelQueueDataInterval,
        runJs: runJs,
        getNotes: getNotes,
        putNotes: putNotes
    });

    /**
     * Gets all of the data in the remote collection.
     */
    function getZwaveData(callback) {
        if (apiData) {
            console.log('CACHED');
            return callback(apiData);
        }
        else {
            console.log('NOOOOT CACHED');
            var request = $http({
                method: "POST",
                url: cfg.server_url + cfg.update_url + "0"
            });
            request.success(function(data) {
                apiData = data;
                return callback(data);
            }).error(function() {
                handleError();

            });
        }
    }

    /**
     * Gets updated data in the remote collection.
     */
    function  updateZwaveData(callback) {
        var time = Math.round(+new Date() / 1000);
        var refresh = function() {
            var request = $http({
                method: "POST",
                //url: "storage/updated.json"
                url: cfg.server_url + cfg.update_url + time
            });
            request.success(function(data) {
                time = data.updateTime;
                $('#update_time_tick').html($filter('getCurrentTime')(time));
                return callback(data);
            }).error(function() {
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
    function runCmd(param, request) {
        var url = (request ? cfg.server_url + request : cfg.server_url + cfg.store_url + param);
        var request = $http({
            method: 'POST',
            url: url
        });
        request.success(function(data) {
            handleSuccess(data);
        }).error(function() {
            handleError();

        });

    }
    /**
     * Get device classes from XML file
     */
    function getDeviceClasses(callback) {
        if (deviceClasses) {
            return callback(deviceClasses);
        }
        else {
            var request = $http({
                method: "get",
                url: cfg.server_url + cfg.device_classes_url
            });
            request.success(function(data) {
                var x2js = new X2JS();
                var json = x2js.xml_str2json(data);
                deviceClasses = json;
                return callback(deviceClasses);
            }).error(function() {
                handleError();

            });
        }
    }

    /**
     * Load Queue data
     */
    function getQueueData(callback) {
        if (typeof (callback) != 'function') {
            return;
        };
        var request = $http({
            method: "POST",
            url: cfg.server_url + cfg.queue_url
        });
        request.success(function(data) {
            return callback(data);
        }).error(function() {
            handleError();

        });
    }

    /**
     * Load and update Queue data
     */
    function updateQueueData(callback) {
        var refresh = function() {
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
        request.success(function(data) {
            handleSuccess(data);
        }).error(function() {
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
        request.success(function(data) {
            return callback(data);
        }).error(function() {
            handleError();

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
        request.success(function(data) {
            handleSuccess(data);
        }).error(function(error) {
            handleError();

        });
    }

    /**
     * 
     * Handle errors
     */
    function handleError(error) {
        console.log('Error');
        //$('html').html('');
        return;
        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        if (!angular.isObject(response.data) || !response.data.message) {
            return($q.reject("An unknown error occurred."));

        }
        // Otherwise, use expected error message.
        return($q.reject(response.data.message));

    }

    /**
     * Handle success response
     */
    function handleSuccess(response) {
        console.log('Success');
        return;

    }
});

// Get a complete or updated JSON
appFactory.factory('DataFactory', function($resource, $http, cfg) {
    return {
        all: function(param) {
            return $resource(cfg.server_url + cfg.update_url + param, {}, {query: {
                    method: 'POST',
                    //params: {user_field: cfg.user_field, pass_field: cfg.pass_field,ZBW_SESSID:  'ced27083bfaff559438d79a72949c1064262d312'},
                    isArray: false
                }});
        },
        queue: function() {
            return $resource(cfg.server_url + cfg.queue_url, {}, {query: {
                    method: 'POST',
                    isArray: true
                }});
        },
        store: function(param) {
            return $resource(cfg.server_url + cfg.store_url + param, {}, {query: {
                    method: 'POST', params: {}
                }});
        },
        putConfig: function(param) {
            return $resource(cfg.server_url + cfg.config_url + param, {}, {query: {
                    method: 'PUT', headers_: {'': ''}, params: {}
                }});
        },
        putReorgLog: function(log) {
            return $.ajax({
                type: "PUT",
                dataType: "text",
                url: cfg.server_url + cfg.reorg_log_url,
                contentType: "text/plain",
                data: log
            });
        },
        getReorgLog: function(callback) {
            return $http({method: 'GET', url: cfg.server_url + cfg.reorg_log_url + '?at=' + (new Date()).getTime()}).success(function(data, status, headers, config) {
                callback(data);
            });
        },
        runCmd: function(param) {
            var cmd = cfg.server_url + param;
            return $resource(cmd, {}, {query: {
                    method: 'POST', params: {}
                }});
        },
        putNotes: function(notes) {
            return $.ajax({
                type: "PUT",
                dataType: "text",
                url: cfg.server_url + cfg.notes_url,
                contentType: "text/plain",
                data: notes
            });
        },
        getNotes: function(callback) {
            return $http({
                method: 'GET',
                url: cfg.server_url + cfg.notes_url
                        //url: 'storage/notes.log'
            }).success(function(data, status, headers, config) {
                callback(data);
            });
        },
        updateFirmware: function(url) {
            return $.ajax({
                type: "GET",
                dataType: "text",
                url: url,
                contentType: "application/octet-stream"
            });
        },
        debug: function(param) {
            var cmd = cfg.server_url + cfg.zwave_api_run_url + param;
            console.log(cmd);
            return;
        }

    };
});

// Get a complete JSON
appFactory.factory('DataTestFactory', function($resource, cfg) {
    return {
        all: function(param) {
            return $resource('storage/demo/' + param, {}, {query: {method: 'GET', params: {}, isArray: false}});
        }
    };
});

// Get a complete JSON
appFactory.factory('DataUpdateFactory', function($resource, cfg) {
    return {
        all: function(param) {
            return $resource(cfg.server_url + cfg.store_url + param, {}, {query: {method: 'POST', params: {}}});
        }
    };
});

// Get a devices JSON
appFactory.factory('FirmwareFactory', function($resource) {
    return {
        all: $resource('storage/demo/devices.json', {}, {
            query: {method: 'GET', params: {}, isArray: true}
        })
    };
});
// JSON from XML
appFactory.factory('XmlFactory', ['$http', function($http) {
        return {
            get: function(callback, xmlSource) {
                $http.get(xmlSource, {transformResponse: function(data) {
                        // convert the data to JSON and provide
                        // it to the success function below
                        var x2js = new X2JS();
                        var json = x2js.xml_str2json(data);
                        return json;
                    }
                }
                ).
                        success(function(data, status) {
                            // send the converted data back
                            // to the callback function
                            callback(data);
                        });
            }
        };
    }]);

// Get language dataas object
appFactory.factory('langFactory', function($resource, cfg) {
    return {
        get: function(lang) {
            return $resource(cfg.lang_dir + 'language.' + lang + '.json', {}, {query: {
                    method: 'GET',
                    params: {},
                    isArray: false
                }});
        }
    };
});

// Translation factory - get language line by key
appFactory.factory('langTransFactory', function() {
    return {
        get: function(key, languages) {
            if (angular.isObject(languages)) {
                if (angular.isDefined(languages[key])) {
                    return languages[key] !== '' ? languages[key] : key;
                }
            }
            return key;
        }
    };
});

// Get language dataas object
appFactory.factory('deviceConfigFactory', function($resource, cfg) {
    return {
        get: function() {
            return $resource('storage/devices.json', {}, {query: {
                    method: 'GET',
                    params: {},
                    isArray: true
                }});
        }
    };
});


