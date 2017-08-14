/**
 * Application ControllerInfo controller
 * @author Martin Vach
 */
appController.controller('ControllerController', function($scope, $window, $filter, $interval,$timeout,cfg,dataService,deviceService) {
    $scope.funcList;
    $scope.ZWaveAPIData;
    $scope.builtInfo = '';
    $scope.info = {};
    $scope.master = {};
    $scope.runQueue = false;
    $scope.controllerInfo = {
        interval: null
    }

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function() {
        $interval.cancel($scope.controllerInfo.interval);
    });
    /**
     * Load app built info
     */
    $scope.loadAppBuiltInfo = function() {
        dataService.getAppBuiltInfo().then(function(response) {
            $scope.builtInfo = response.data;
        }, function(error) {});
    };
    $scope.loadAppBuiltInfo();

    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            $scope.refreshZwaveData();
        }, function(error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     */
    $scope.refreshZwaveData = function() {
        var refresh = function() {
            dataService.loadJoinedZwaveData().then(function(response) {
                setData(response.data.joined);
            });
        };
        $scope.controllerInfo.interval = $interval(refresh, $scope.cfg.interval);
    };
    
     /**
     *
     * Set debug mode
     */
    $scope.setDebugMode = function(status,spin) {
        var input = {
            debug: status
        };
        $scope.toggleRowSpinner(spin);
        dataService.postApi('configupdate_url', input).then(function (response) {
             $timeout($scope.toggleRowSpinner, 1000);
            $scope.loadZwaveConfig(true);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_update_data'));
            return;
        });
    };

    /// --- Private functions --- ///
    /**
     * Set zwave data
     * @param {object} ZWaveAPIData
     */
    function setData(ZWaveAPIData) {
        var nodeLimit = function(str) {
            return str === 'ff' ? $scope._t('unlimited') : str;
        };
        var caps = function(arr) {
            var cap = '';
            if (angular.isArray(arr)) {
                cap += (arr[3] & 0x01 ? 'S' : 's');
                cap += (arr[3] & 0x02 ? 'L' : 'l');
                cap += (arr[3] & 0x04 ? 'M' : 'm');
            }
            return cap;

        };
        $scope.ZWaveAPIData = ZWaveAPIData;
        $scope.master['controller.data.nodeId'] = ZWaveAPIData.controller.data.nodeId.value;
        $scope.master['controller.data.homeId'] = ZWaveAPIData.controller.data.homeId.value;
        $scope.master['controller.data.isPrimary'] = ZWaveAPIData.controller.data.isPrimary.value;
        $scope.master['controller.data.isRealPrimary'] = ZWaveAPIData.controller.data.isRealPrimary.value;
        $scope.master['controller.data.SUCNodeId'] = ZWaveAPIData.controller.data.SUCNodeId.value;
        $scope.master['controller.data.SISPresent'] = ZWaveAPIData.controller.data.SISPresent.value;
        $scope.master['controller.data.vendor'] = ZWaveAPIData.controller.data.vendor.value;
        $scope.master['controller.data.manufacturerProductType'] = ZWaveAPIData.controller.data.manufacturerProductType.value;
        $scope.master['controller.data.manufacturerProductId'] = ZWaveAPIData.controller.data.manufacturerProductId.value;
        $scope.master['controller.data.manufacturerId'] = ZWaveAPIData.controller.data.manufacturerId.value;
        $scope.master['controller.data.ZWaveChip'] = ZWaveAPIData.controller.data.ZWaveChip.value;
        $scope.master['controller.data.libType'] = ZWaveAPIData.controller.data.libType.value;
        $scope.master['controller.data.SDK'] = ZWaveAPIData.controller.data.SDK.value;
        $scope.master['controller.data.APIVersion'] = ZWaveAPIData.controller.data.APIVersion.value;
        $scope.master['controller.data.uuid'] = ZWaveAPIData.controller.data.uuid.value;
        if (ZWaveAPIData.controller.data.caps.value) {
            $scope.master['controller.data.caps.subvendor'] = '0x' + dec2hex((ZWaveAPIData.controller.data.caps.value[0] << 8) + ZWaveAPIData.controller.data.caps.value[1]);
            $scope.master['controller.data.caps.nodes'] = nodeLimit(dec2hex(ZWaveAPIData.controller.data.caps.value[2]).slice(-2));
            $scope.master['controller.data.caps.cap'] = caps(ZWaveAPIData.controller.data.caps.value);
        } else {
            $scope.master['controller.data.caps.subvendor'] = '';
            $scope.master['controller.data.caps.nodes'] = '';
            $scope.master['controller.data.caps.cap'] = '';
        }
        $scope.master['controller.data.softwareRevisionVersion'] = ZWaveAPIData.controller.data.softwareRevisionVersion.value;
        $scope.master['controller.data.softwareRevisionId'] = ZWaveAPIData.controller.data.softwareRevisionId.value;
        $scope.master['controller.data.softwareRevisionDate'] = ZWaveAPIData.controller.data.softwareRevisionDate.value;
        $scope.master['controller.data.softwareRevisionDate'] = ZWaveAPIData.controller.data.softwareRevisionDate.value;
        $scope.master['controller.data.frequency'] = ZWaveAPIData.controller.data.frequency.value;
        // Texts
        $scope.master['txtHomeId'] = '';
        $scope.master['txtSucSis'] = '';
        setText($scope.master);

        // Function list
        var funcList = '';
        var _fc = array_unique(ZWaveAPIData.controller.data.capabilities.value.concat(ZWaveAPIData.controller.data.functionClasses.value));
        _fc.sort(function(a, b) {
            return a - b
        });

        angular.forEach(_fc, function(func, index) {
            var fcIndex = ZWaveAPIData.controller.data.functionClasses.value.indexOf(func);
            var capIndex = ZWaveAPIData.controller.data.capabilities.value.indexOf(func);
            var fcName = (fcIndex != -1) ? ZWaveAPIData.controller.data.functionClassesNames.value[fcIndex] : 'Not implemented';
            funcList += '<span style="color: ' + ((capIndex != -1) ? ((fcIndex != -1) ? '' : 'gray') : 'red') + '">' + fcName + ' (0x' + ('00' + func.toString(16)).slice(-2) + ')</span>  &#8226; ';
        });
        $scope.funcList = funcList;

    }
    function dec2hex(i)
    {
        //return  ("0"+(Number(i).toString(16))).slice(-2).toUpperCase()
        var result = "0000";
        if (i >= 0 && i <= 15) {
            result = "000" + i.toString(16);
        }
        else if (i >= 16 && i <= 255) {
            result = "00" + i.toString(16);
        }
        else if (i >= 256 && i <= 4095) {
            result = "0" + i.toString(16);
        }
        else if (i >= 4096 && i <= 65535) {
            result = i.toString(16);
        }
        return result;
    }
    // Get Queue updates
    function setText(master) {
        angular.forEach(master, function(v, k) {
            var src = {};
            switch (k) {
                case 'controller.data.SUCNodeId':
                    src['txtSucSis'] = (v != 0) ? (v.toString() + ' (' + (master['controller.data.SISPresent'] ? 'SIS' : 'SUC') + ')') : $scope._t('nm_suc_not_present');
                    angular.extend($scope.master, src);
                    break;
                case 'controller.data.homeId':
                    src['txtHomeId'] = '0x' + ('00000000' + (v + (v < 0 ? 0x100000000 : 0)).toString(16)).slice(-8);
                    ;
                    angular.extend($scope.master, src);
                    break;

                default:
                    break;
            }

        });
        return;

    }
});