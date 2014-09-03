/**
 * Application factories
 * @author Martin Vach
 */

/*** Factories ***/
var appFactory = angular.module('appFactory', ['ngResource']);

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
        getZwaveDataQuietly: getZwaveDataQuietly,
        updateZwaveData: updateZwaveData,
        updateZwaveDataSince: updateZwaveDataSince,
        joinedZwaveData: joinedZwaveData,
        cancelZwaveDataInterval: cancelZwaveDataInterval,
        runCmd: runCmd,
        store: store,
        getDeviceClasses: getDeviceClasses,
        getSelectZDDX:  getSelectZDDX,
        getTiming:  getTiming,
        getQueueData: getQueueData,
        updateQueueData: updateQueueData,
        cancelQueueDataInterval: cancelQueueDataInterval,
        runJs: runJs,
        getNotes: getNotes,
        putNotes: putNotes,
        getReorgLog: getReorgLog,
        putReorgLog: putReorgLog,
        purgeCache: purgeCache
    });

    /**
     * Gets all of the data in the remote collection.
     */
    function getZwaveData(callback) {
        var time = Math.round(+new Date() / 1000);
        if (apiData) {
            console.log('CACHED');
            return callback(apiData);
        }
        else {
            
            pageLoader();
            console.log('NOOOOT CACHED');
            var request = $http({
                method: "POST",
                url: cfg.server_url +  cfg.update_url + "0"
                //url: 'storage/all_cp.json'
            });
            request.success(function(data) {
                $('#update_time_tick').html($filter('getCurrentTime')(time));
                apiData = data;
                pageLoader(true);
                return callback(data);
            }).error(function() {
                pageLoader(true);
                handleError(false,true,false);
               

            });
        }
    }

    /**
     * Gets all of the data in the remote collection without a "Loading data..." notification.
     */
    function getZwaveDataQuietly(callback) {
        var time = Math.round(+new Date() / 1000);
        if (apiData) {
            console.log('CACHED');
            return callback(apiData);
        }
        else {
            
            console.log('NOOOOT CACHED');
            var request = $http({
                method: "POST",
                url: cfg.server_url +  cfg.update_url + "0"
            });
            request.success(function(data) {
                $('#update_time_tick').html($filter('getCurrentTime')(time));
                apiData = data;
                return callback(data);
            }).error(function() {
                handleError(false,true,true);

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
        request.success(function(data) {
            time = data.updateTime;
            $('#update_time_tick').html($filter('getCurrentTime')(time));
            return callback(data);
        }).error(function(error) {
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
        var refresh = function() {
            //console.log(apiData);
            var request = $http({
                method: "POST",
                //url: "storage/updated.json"
                url: cfg.server_url + cfg.update_url + time
            });
            request.success(function(data) {
                $('#update_time_tick').html($filter('getCurrentTime')(time));
                if (apiData === undefined)
                    return;
                time = data.updateTime;
                angular.forEach(data, function(obj, path) {
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
            $('button .fa-spin,a .fa-spin').fadeOut(1000);
            handleSuccess(data);
        }).error(function() {
            $('button .fa-spin,a .fa-spin').fadeOut(1000);
            console.log('Response error');
           //handleCmdError();

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
        request.success(function(data) {
            handleSuccess(data);
            if (success)
                success();
        }).error(function(err) {
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
     * Get zddx device selection
     */
    function getSelectZDDX(nodeId,callback) {
        if (deviceClasses) {
            return callback(deviceClasses);
        }
        else {
            var request = $http({
                method: "POST",
                url: cfg.server_url + '/ZWaveAPI/Run/devices[' + nodeId + '].GuessXML()'
            });
            request.success(function(data) {
                 return callback(data);
            }).error(function() {
                console.log('Error: getSelectZDDX');
               // handleError();

            });
        }
    }
    
     /**
     * Get timing (statistics) data
     */
    function  getTiming(callback) {
        var request = $http({
                method: "POST",
                //url: 'storage/timing.json'
                url: cfg.server_url + '/JS/Run/communicationStatistics.get()'
            });
            request.success(function(data) {
                 return callback(data);
            }).error(function() {
                console.log('Error: communicationStatistics');
               handleError(false,true);

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
        request.success(function(data) {
            handleSuccess(data);
        }).error(function(error) {
            handleError();

        });
    }


    /**
     * Gets reorg log from remote text file
     */
    function getReorgLog(callback) {
        return $http({method: 'GET', url: cfg.server_url + cfg.reorg_log_url + '?at=' + (new Date()).getTime()}).success(function(data, status, headers, config) {
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
     * 
     * Handle errors
     */
    function handleError(message,showResponse,hideContent) {
        var msg = (message ? message : 'Error handling data from server');
        if(showResponse){
            $('#respone_container').show();
        $('#respone_container_inner').html('<div class="alert alert-danger alert-dismissable response-message"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> <i class="icon-ban-circle"></i> ' + msg +'</div>');
        } 
        
        if(hideContent){
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
        $('#respone_container_inner').html('<div class="alert alert-danger alert-dismissable response-message"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> <i class="icon-ban-circle"></i> ' + msg +'</div>');
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
        if (hide) {
            $('#respone_container').hide();
            $('#main_content').show();
            return;
        }
        //$('#main_content').hide();
        $('#respone_container').show();
        $('#respone_container_inner').html('<div class="alert alert-warning page-load-spinner"><i class="fa fa-spinner fa-lg fa-spin"></i><br /> Loading data....</div>');
        return;

    }
});

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


