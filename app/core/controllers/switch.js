/**
 * SwitchController
 * @author Martin Vach
 */
appController.controller('SwitchController', function($scope, $filter, dataService, cfg) {
    $scope.switches = [];
    $scope.rangeSlider = [];
    $scope.updateTime = $filter('getTimestamp');
    $scope.reset = function() {
        $scope.switches = angular.copy([]);
    };

    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
                refreshData(data);
            });
        });
    };


    // Load data
    $scope.load();

    // Refresh data
    $scope.refresh = function() {
        dataService.joinedZwaveData(function(data) {
            $scope.reset();
            setData(data.joined);
        });
    };
    //$scope.refresh();

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    // Store data from on remote server
    $scope.store = function(btn) {
        var url = $(btn).attr('data-store-url');
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };

    // Store all data on remote server
    $scope.storeAll = function(id) {
        angular.forEach($scope.switches, function(v, k) {
            dataService.runCmd(v.urlToStore);
        });
    };

    // Store data with switch all
    $scope.storeSwitchAll = function(btn) {
        var action_url = $(btn).attr('data-store-url');
        angular.forEach($scope.switches, function(v, k) {
            var url = 'devices[' + v['id'] + '].instances[0].commandClasses[0x27].' + action_url;
            if (v.hasSwitchAll) {
                dataService.runCmd(url);
            }
        });
        ;
    };

    $scope.sliderChange = function(cmd, index) {
        var val = $scope.rangeSlider[index];
        var url = cmd + '.Set(' + val + ')';
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }

            // Loop throught instances
            var cnt = 1;
            angular.forEach(node.instances, function(instance, instanceId) {
                angular.forEach([0x25, 0x26], function(ccId) {
                    if (!(ccId in instance.commandClasses)) return;
                    var switchAllValue = null;
                    var hasSwitchAll = (0x27 in instance.commandClasses) && (instanceId == 0);
                    if (hasSwitchAll) {
                        switchAllValue = instance.commandClasses[0x27].data.mode.value;
                    }

                    var deviceType = ccId == 0x25 ? 'binary' : 'multilevel';
                    
                    var genericType = ZWaveAPIData.devices[nodeId].data.genericType.value;
                    var specificType = ZWaveAPIData.devices[nodeId].data.specificType.value;
                    var genspecType = genericType + '/' + specificType;

                    // Set object
                    var obj = {};

                    // Motor devices
                    var btnOn = $scope._t('switched_on');
                    var btnOff = $scope._t('switched_off');
                    var btnFull = $scope._t('btn_full');
                    var hasMotor = false;
                    var motorDevices = ['17/3', '17/5', '17/6', '17/7', '9/0', ' 9/1'];
                    if (motorDevices.indexOf(genspecType) !== -1) {
                        btnOn = $scope._t('btn_switched_up');
                        btnOff = $scope._t('btn_switched_down');
                        hasMotor = true;
                    }
                    //console.log(nodeId + '.' + instanceId + ': ' + genspecType + ' motor: ' + hasMotor);
                    var multiChannel = false;
                    if (0x60 in instance.commandClasses) {
                        multiChannel = true;
                    }
                    var level = updateLevel(instance.commandClasses[ccId].data.level, ccId, btnOn, btnOff);

                    obj['id'] = nodeId;
                    obj['cmd'] = instance.commandClasses[ccId].data.name + '.level';
                    obj['iId'] = instanceId;
                    obj['ccId'] = ccId;
                    obj['hasMotor'] = hasMotor;
                    obj['multiChannel'] = multiChannel;
                    obj['deviceType'] = deviceType;
                    obj['genericType'] = genericType;
                    obj['specificType'] = specificType;
                    obj['hasSwitchAll'] = hasSwitchAll;
                    obj['switchAllValue'] = switchAllValue;
                    obj['rowId'] = 'switch_' + nodeId + '_' + cnt;
                    obj['name'] = $filter('deviceName')(nodeId, node);
                    obj['updateTime'] = instance.commandClasses[ccId].data.level.updateTime;
                    obj['invalidateTime'] = instance.commandClasses[ccId].data.level.invalidateTime;
                    obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Get()';
                    obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                    //obj['level'] = ZWaveAPIData.devices[nodeId].instances[instanceId].commandClasses[ccId].data.level;
                    obj['level'] = level.level_cont;
                    obj['levelColor'] = level.level_color;
                    obj['levelStatus'] = level.level_status;
                    obj['levelMax'] = level.level_max;
                    obj['levelVal'] = level.level_val;
                    obj['urlToOff'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Set(0)';
                    obj['urlToOn'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Set(255)';
                    obj['urlToFull'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Set(99)';
                    obj['urlToSlide'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                    obj['btnOn'] = btnOn;
                    obj['btnOff'] = btnOff;
                    obj['btnFull'] = btnFull;
                    obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.level';


                    $scope.switches.push(obj);
                    $scope.rangeSlider.push(obj['range_' + nodeId] = level.level_val);
                    cnt++;
                });
            });
        });
    }
    ;

    /**
     * Refresh zwave data
     */
    function refreshData(data) {
        angular.forEach($scope.switches, function(v, k) {
            //console.log(v.cmdToUpdate);
            //return;
            var obj = data.update[v.cmdToUpdate];
            if (v.cmdToUpdate in data.update) {
                var level = updateLevel(obj, v.ccId, v.btnOn, v.btnOff);
                var updateTime = obj.updateTime;
                var invalidateTime = obj.invalidateTime;
                var formatTime = $filter('isTodayFromUnix')(updateTime);
                $('#' + v.rowId + ' .row-level').html(level.level_cont).css({color: level.level_color});
                $('#' + v.rowId + ' .row-time').html(formatTime);
                if (updateTime > invalidateTime) {
                    $('#' + v.rowId + ' .row-time').removeClass('is-updated-false');
                }
                $("#the_item_id").css({backgroundColor: "#333", color: "#FFF"});
                //console.log('Updating:' + v.rowId + ' | At: ' + updateTime + ' | with: ' + level);//REM
            }
        });
    }

    // Update level
    function updateLevel(obj, ccId, btnOn, btnOff) {

        var level_cont;
        var level_color;
        var level_status = 'off';
        var level_val = 0;
        var level_max = 99;

        //var level = obj.value;
        var level = (angular.isDefined(obj.value) ? obj.value : null);

        if (level === '' || level === null) {
            level_cont = '?';
            level_color = 'gray';
        } else {
            if (level === false)
                level = 0;
            if (level === true)
                level = 255;
            level = parseInt(level, 10);
            if (level === 0) {
                level_cont = btnOff;
                level_color = '#a94442';
            } else if (level === 255 || level === 99) {
                level_status = 'on';
                level_cont = btnOn;
                level_color = '#3c763d';
//                if(level > 99){
//                    level_max = 255;
//                }
                //level_val = level;
                level_val = (level < 100 ? level : 99);
            } else {
                level_cont = level.toString() + ((ccId == 0x26) ? '%' : '');
                var lvlc_r = ('00' + parseInt(0x9F + 0x60 * level / 99).toString(16)).slice(-2);
                var lvlc_g = ('00' + parseInt(0x7F + 0x50 * level / 99).toString(16)).slice(-2);
                level_color = '#' + lvlc_r + lvlc_g + '00';
                level_status = 'on';
                // level_val = level;
                level_val = (level < 100 ? level : 99);
            }
        }
        ;
        return {"level_cont": level_cont, "level_color": level_color, "level_status": level_status, "level_val": level_val, "level_max": level_max};
    }
    ;
});