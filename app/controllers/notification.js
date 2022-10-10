/**
 * @overview Used to report alarm events from binary sensors.
 * @author Martin Vach
 */

/**
 * Notificationr root controller
 * @class NotificationController
 *
 */
appController.controller('NotificationController', function ($scope, $filter, $timeout, $interval, dataService, cfg, deviceService, $cookies, $route, _) {
    $scope.notifications = {
        all: [],
        interval: null,
        show: false
    };
    $scope.notificationsExpand = $cookies.notificationsExpand !== 'collapsed';
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
            setData(ZWaveAPIData, alarms);
            if (_.isEmpty($scope.notifications.all)) {
                $scope.alert = {
                    message: $scope._t('device_404'),
                    status: 'alert-warning',
                    icon: 'fa-exclamation-circle'
                };
                return;
            }
            $scope.notifications.show = true;
            $scope.refreshZwaveData(alarms);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    // $scope.loadZwaveData();


    /**
     * Refresh zwave data
     * @param {object}  alarms
     */
    $scope.refreshZwaveData = function (alarms) {
        var refresh = function () {
            dataService.loadJoinedZwaveData().then(function (response) {
                setData(response.data.joined, alarms);
            });
        };
        $scope.notifications.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Set status
     * @param {string} url
     */
    $scope.setStatus = function (url) {
        $scope.runZwaveCmd(url);
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
     * @param alarms
     */
    function setData(ZWaveAPIData, alarms) {
        $scope.controllerId = ZWaveAPIData.controller.data.nodeId.value;
        // console.log(ZWaveAPIData, alarms);
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            if (nodeId == 255 || nodeId == $scope.controllerId || node.data.isVirtual.value) {
                return false;
            }
            var allInterviewsDone = deviceService.allInterviewsDone(node.instances);
            if(!allInterviewsDone){
                return;
            }
            //console.log(allInterviewsDone)
            // Loop throught instances
            angular.forEach(node.instances, function (instance, instanceId) {
                if (instanceId == 0 && node.instances.length > 1) {
                    return;
                }

                // Look for Notifications - Loop throught 0x71/113 commandClasses
                var hasNotification = instance.commandClasses[0x71];
                if (!angular.isObject(hasNotification)) {
                    return;
                }
                var version = parseInt(hasNotification.data.version.value, 10);

                var obj = {};
                obj['id'] = parseInt(nodeId, 10);
                obj['rowId'] = hasNotification.name + '_' + nodeId + '_' + instanceId + '_' + '113' + '_';
                obj['instanceId'] = instanceId;
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['version'] = version;
                // if (version > 1) {
                    notificationV2(obj, hasNotification.data);
                // } else {
                //     notificationV1(obj, hasNotification.data);
                // }
            });
        });
    }

    /**
     * Set notifications version 1
     * @param node
     * @param {object} data
     */
    function notificationV1(node, data) {
        var typeId = parseInt(data.V1event.alarmType.value, 10);
        if (isNaN(typeId)) {
            return;
        }
        var obj = {};
        obj['id'] = node.id;
        obj['idSort'] = $filter('zeroFill')(node.id);
        obj['rowId'] = node.rowId + typeId;
        obj['instanceId'] = node.instanceId;
        obj['name'] = node.name;
        obj['version'] = node.version;
        obj['typeId'] = typeId;
        obj['typeString'] = typeId;
        obj['event'] = data.V1event.level.value;
        obj['eventString'] = data.V1event.level.value;
        obj['status'] = 0;
        obj['statusString'] = '-';
        obj['invalidateTime'] = data.V1event.alarmType.invalidateTime;
        obj['updateTime'] = data.V1event.alarmType.updateTime;
        obj['isUpdated'] = obj['updateTime'] > obj['invalidateTime'];
        obj['dateTime'] = $filter('getDateTimeObj')(data.V1event.alarmType.updateTime,obj['updateTime']);
        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + obj['instanceId'] + '].commandClasses[113].Get(' + typeId + ')';
        //console.log(obj)
        var findIndex = _.findIndex($scope.notifications.all, {rowId: obj.rowId});
        if (findIndex > -1) {
            angular.extend($scope.notifications.all[findIndex], obj);

        } else {
            $scope.notifications.all.push(obj);
        }
    }


    function notificationV2Converter({
                                         typeId,
                                         typeString,
                                         enableAlarms,
                                         children,
                                         isUpdated,
      dateTime
                                     }, node) {
        const obj = {
            id: node.id,
            idSort: $filter('zeroFill')(node.id),
            rowId: node.rowId + typeId,
            instanceId: node.instanceId,
            name: node.name,
            version: node.version,
            typeId,
            children,
            isUpdated,
            dateTime,
            lastTriggeredEvent: children.filter(({status}) => status).reduce((prev, curr) => prev.updateTime > curr.updateTime ? prev : curr, {}),
            typeString,
            status: enableAlarms,
            urlToOn: 'devices[' + node.id + '].instances[' + node.instanceId + '].commandClasses[113].Set(' + typeId + ',255)',
            urlToOff: 'devices[' + node.id + '].instances[' + node.instanceId + '].commandClasses[113].Set(' + typeId + ',0)',
            urlToStore: 'devices[' + node.id + '].instances[' + node.instanceId + '].commandClasses[113].Get(' + typeId + ')'
        };
        const findIndex = _.findIndex($scope.notifications.all, {rowId: obj.rowId});
        if (findIndex > -1) {
            angular.extend($scope.notifications.all[findIndex], obj);

        } else {
            $scope.notifications.all.push(obj);
        }
    }

    /**
     * Set notifications version 2
     * @param node
     * @param {object} data
     * @param alarms
     */
    function notificationV2(node, data) {
        Object.entries(data).filter(([key]) => !isNaN(+key)).map(([typeId, value]) => {
            const {typeString: {value: typeString}, status: {value: enableAlarms}, updateTime, invalidateTime} = value;
            // TODO no more needed 26.09.2022
            // const typeHex = $filter('decToHex')(typeId, 2, '0x');
            // const eventHex = $filter('decToHex')(eventId, 2, '0x');
            // const alarm = _.findWhere(alarms, {_id: typeHex});
            // if (alarm) {
            //     typeString = deviceService.configGetZddxLang(alarm.name.lang, $scope.lang);
            //     const event = _.findWhere(alarm.Event, {_id: eventHex});
            //     if (event) {
            //         eventString = deviceService.configGetZddxLang(event.name.lang, $scope.lang);
            //     }
            // }
            // console.log(typeId, eventId, status);
            return {
                typeId,
                typeString,
                enableAlarms,
                isUpdated: updateTime > invalidateTime,
                dateTime: $filter('getDateTimeObj')(updateTime, invalidateTime),
                children: Object.entries(value).filter(([key]) => !isNaN(+key))
                  .map(([eventId, {
                      eventString: {value: eventString},
                      status: {updateTime, invalidateTime, value: status},
                      isState: {value: isState}
                  }]) => ({
                      eventId,
                      eventString,
                      status,
                      updateTime,
                      isState,
                      isUpdated: updateTime > invalidateTime,
                      dateTime: $filter('getDateTimeObj')(updateTime, invalidateTime),
                  })),
            }
        })
          .map((data) => notificationV2Converter(data, node));
    }
    $scope.toggleDefault = function () {
        $cookies.notificationsExpand = $cookies.notificationsExpand === 'expanded' ? 'collapsed' : 'expanded';
        $route.reload();
    }
});
