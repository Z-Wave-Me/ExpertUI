/**
 * @overview Used to report alarm events from binary sensors.
 * @author Martin Vach
 */

/**
 * Notificationr root controller
 * @class NotificationController
 *
 */
appController.controller('NotificationController', function ($scope, $filter, $timeout, $interval, dataService, cfg, deviceService,_) {
    $scope.notifications = {
        all: [],
        interval: null,
        show: false
    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.notifications.interval);
    });
    /**
     * Load Alarms.xml
     */
    $scope.loadXmlData = function () {
        dataService.xmlToJson(cfg.server_url + cfg.alarms_url).then(function (response) {
            $scope.loadZwaveData(response.Alarms.Alarm);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadXmlData();

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function (alarms) {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            setData(ZWaveAPIData,alarms);
            if (_.isEmpty($scope.notifications.all)) {
                $scope.alert = {
                    message: $scope._t('device_404'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation-circle'
                };
                return;
            }
            $scope.notifications.show = true;
            //$scope.refreshZwaveData(ZWaveAPIData,alarms);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };


    /**
     * Refresh zwave data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshZwaveData = function (ZWaveAPIData,alarms) {
        var refresh = function () {
            dataService.loadJoinedZwaveData(ZWaveAPIData).then(function (response) {
                setData(response.data.joined,alarms);
            }, function (error) {
            });
        };
        $scope.notifications.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Update notification
     * @param {string} url
     */
    $scope.updateNotification = function (url) {
        $scope.runZwaveCmd(url);
    };

    /**
     * Update all notifications
     * @param {string} id
     * @param {string} urlType
     */
    $scope.updateAllNotifications = function (id, urlType) {
        var lastItem = _.last($scope.notifications.all);
        $scope.toggleRowSpinner(id);
        angular.forEach($scope.notifications.all, function (v, k) {
            $scope.toggleRowSpinner(v[urlType]);
            dataService.runZwaveCmd(cfg.store_url + v[urlType]).then(function (response) {
                alertify.dismissAll();
            }, function (error) {
                alertify.dismissAll();
                alertify.alertError($scope._t('error_update_data') + '\n' + v[urlType]);
            });
            if (lastItem.rowId === v.rowId) {
                $timeout($scope.toggleRowSpinner, 1000);
            }
        });

    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData,alarms) {
        $scope.controllerId = ZWaveAPIData.controller.data.nodeId.value;

        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function (device, k) {
            if (k == 255 || k == $scope.controllerId || device.data.isVirtual.value) {
                return false;
            }
            // Loop throught instances
            angular.forEach(device.instances, function (instance, instanceId) {
                if (instanceId == 0 && device.instances.length > 1) {
                    return;
                }

                // Look for Notifications - Loop throught 0x71/113 commandClasses
                var hasNotification = instance.commandClasses[0x71];
                if (!angular.isObject(hasNotification)) {
                    return;
                }
                var version = hasNotification.data.version.value;
                var notification = {};
                if(version === 2){
                    notification = notificationV2(hasNotification.data);
                }else{
                    notification[0] = {
                        typeString: hasNotification.data.V1event.alarmType.value,
                        eventString: hasNotification.data.V1event.level.value,
                        status: null
                    };
                }
                /*var type = '-';
                var status = '-';
                var alarmCfg = {
                    type: hasNotification.data.V1event.alarmType.value,
                    typeHex: $filter('decToHex')(hasNotification.data.V1event.alarmType.value, 2, '0x'),
                    status: hasNotification.data.V1event.level.value,
                    statusHex:$filter('decToHex')(hasNotification.data.V1event.level.value, 2, '0x')
                }

                var alarm = _.findWhere(alarms,{_id:  alarmCfg.typeHex});
                if(alarm){
                    type = deviceService.configGetZddxLang(alarm.name.lang, $scope.lang);
                    var event = _.findWhere(alarm.Event,{_id:  alarmCfg.statusHex});
                    if(event){
                        status = deviceService.configGetZddxLang(event.name.lang, $scope.lang);
                    }
                }*/

                var obj = {};
                obj['id'] = k;
                obj['rowId'] = k + instanceId;
                obj['name'] = $filter('deviceName')(k, device);
                obj['version'] = version;
                //obj['alarmCfg'] =alarmCfg;
                //obj['type'] = type;
                //obj['status'] = status;
                obj['notification'] = notification;
                obj['invalidateTime'] = hasNotification.data.V1event.alarmType.invalidateTime;
                obj['updateTime'] = hasNotification.data.V1event.alarmType.updateTime;
                obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                obj['dateTime'] = $filter('getDateTimeObj')(hasNotification.updateTime);
                obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[113].Get(1,1)';
                var findIndex = _.findIndex($scope.notifications.all, {rowId: obj.rowId});
                if (findIndex > -1) {
                    angular.extend($scope.notifications.all[findIndex], obj);

                } else {
                    $scope.notifications.all.push(obj);
                }


            });
        });
    }
});


/**
 * Set notifications version 2
 * @param {object} data
 */
function notificationV2(data) {
    // Only for testing
    /*angular.extend(data, {
        0: {typeString: 'General Purpose',eventString: 'EVENT General',status: 'enabled'},
        1: {typeString: 'Smoke Alarm',eventString: 'Smoke detected',status: 'enabled'},
        2: {typeString: 'CO Alarm',eventString: 'Carbon monoxide detected',status: 'enabled'}
    })*/
    //console.log(data)
    var notification = {};
    angular.forEach(data, function(v, k) {
        var typeId = parseInt(k, 10);
        if (isNaN(typeId)) {
            return;
        }
        notification[typeId] = v;
    });
    return notification;
}