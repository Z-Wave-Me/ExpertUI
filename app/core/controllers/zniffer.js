/**
 * ZnifferController
 * @author Martin Vach
 */
appController.controller('ZnifferController', function ($scope, $interval, $filter, cfg, dataService, myCache, _) {
    $scope.zniffer = {
        all: {},
        frequency: 0,
        uzb: {
            current: 0,
            all: ['COM 1', 'COM 2', 'COM 3', 'COM 4']
        },
        filter: {
            model: false,
            items: ['homeid', 'src', 'dest', 'rssi', 'speed', 'data'],
            data: [],
            search: '',
            suggestions: []
        }
    };

    $scope.packet = {
        interval: null,
        trace: 'start',
        cmdClass: [],
        all: []
       
    };
    $scope.outgoingPacket = {
        all: []
    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        //$interval.cancel($scope.packet.interval);
    });

    /**
     * Get cached packets
     */


    /**
     * Load zwave command classes
     * @returns {undefined}
     */
    $scope.loadCmdClass = function () {
        dataService.xmlToJson(cfg.zwave_classes_url).then(function (response) {
            $scope.packet.cmdClass = response.zw_classes.cmd_class;
        }, function (error) {
            alertify.alertError($scope._t('error_xml_load'));
        });

    };
    $scope.loadCmdClass();

    /**
     * Load cached packet
     * @returns {undefined}
     */
    $scope.loadCachedPackets = function () {
        if (myCache.get('inout_packet')) {
            $scope.packet.all = myCache.get('inout_packet');
        }

    };
    $scope.loadCachedPackets();

    /**
     * Load packet data
     * @returns {undefined}
     */
    $scope.loadIncomingPacket = function () {
        dataService.getApi('incoming_packet_url', null, true).then(function (response) {
            var exist = _.find($scope.packet.all, {updateTime: response.data.updateTime});
            if (exist) {
                return;
            }
            console.log('response.data.value[2] ', response.data.value[2],':',typeof response.data.value[2])
            $scope.packet.all.push(
                    {
                        type: 'incoming',
                        updateTime: response.data.updateTime,
                        value: response.data.value,
                        dateTime: $filter('getDateTimeObj')(response.data.updateTime),
                        src: response.data.value[3],
                        dest: response.data.value[6],
                        data: setZnifferDataType(response.data.value[2]),
                        application: packetApplication(response.data.value)
                    }
            );
            myCache.put('inout_packet', $scope.packet.all);
            //console.log(exist)
        }, function (error) {});
    };
    //$scope.loadIncomingPacket();
    /**
     * Load packet data
     * @returns {undefined}
     */
    $scope.loadOutgoingPacket = function () {
        dataService.getApi('outgoing_packet_url', null, true).then(function (response) {
            var exist = _.find($scope.packet.all, {updateTime: response.data.updateTime});
            if (exist) {
                return;
            }
            $scope.packet.all.push(
                    {
                       type: 'outgoing',
                        updateTime: response.data.updateTime,
                        value: response.data.value,
                        dateTime: $filter('getDateTimeObj')(response.data.updateTime),
                        src: response.data.value[6],
                        dest: response.data.value[3],
                        data: setZnifferDataType(response.data.value[2]),
                        application: packetApplication(response.data.value)
                    }
            );
            myCache.put('inout_packet', $scope.packet.all);
            //console.log(exist)
        }, function (error) {});
    };
    //$scope.loadOutgoingPacket();

    /**
     * Refresh packet
     */
    $scope.refreshPacket = function () {
        var refresh = function () {
            $scope.loadIncomingPacket();
            $scope.loadOutgoingPacket();
        };
        if ($scope.packet.trace === 'start') {
            $scope.packet.interval = $interval(refresh, $scope.cfg.interval);
        }

    };

    $scope.refreshPacket();
    /**
     * Set trace
     */
    $scope.setTrace = function (trace) {
        switch (trace) {
            case 'pause':
                $scope.packet.trace = 'pause';
                $interval.cancel($scope.packet.interval);
                break;
            case 'stop':
                $scope.packet.trace = 'stop';
                $interval.cancel($scope.packet.interval);
                myCache.remove('incoming_packet');
                angular.copy([], $scope.packet.all);
                break;
            default:
                $scope.packet.trace = 'start';
                $scope.loadCachedPackets();
                $scope.refreshPacket();
                break;

        }
        //console.log('Set trace: ', $scope.packet.trace)
    };



    /**
     * Load zniffer data
     * @returns {undefined}
     */
    $scope.loadZniffer = function () {
        dataService.getApiLocal('zniffer.json').then(function (response) {
            setZniffer(response.data);
        }, function (error) {
            alert('Unable to load data');
        });
    };
    $scope.loadZniffer();

    /**
     * Set zniffer filter
     * @returns {undefined}
     */
    $scope.setZnifferFilter = function (filter) {
        $scope.zniffer.filter.search = '';
        $scope.zniffer.filter.model = filter;
        //$scope.loadZniffer();
    };

    /**
     * Reset zniffer filter
     * @returns {undefined}
     */
    $scope.resetZnifferFilter = function () {
        $scope.zniffer.filter.search = '';
        $scope.zniffer.filter.model = false;
        $scope.loadZniffer();
    };

    /**
     * Apply zniffer filter
     * @param {type} value
     * @returns {undefined}
     */
    $scope.applyZnifferFilter = function (value) {
        $scope.zniffer.filter.suggestions = [];
        $scope.zniffer.filter.search = value;
        $scope.loadZniffer();
    };

    /**
     * Set zniffer frequency
     * @returns {undefined}
     */
    $scope.setZnifferFrequency = function (frq) {
        $scope.zniffer.frequency = frq;
        $scope.loadZniffer();
    };

    /**
     * Set zniffer uzb
     * @returns {undefined}
     */
    $scope.setZnifferUzb = function (uzb) {
        $scope.zniffer.uzb.current = uzb;
        $scope.loadZniffer();
    };

    /**
     * Search in the zniffer by filter
     */
    $scope.searchZniffer = function () {
        $scope.zniffer.filter.suggestions = [];
        if ($scope.zniffer.filter.search.length >= 2) {
            var searchArr = _.keys($scope.zniffer.filter.data[$scope.zniffer.filter.model]);
            var search = $scope.zniffer.filter.search;
            findText(searchArr, search);
        }
    };

    /// --- Private functions --- ///
    /**
     * Set an application col
     * @param {array} packet
     * @returns {undefined}
     */
    function packetApplication(packet) {
        // Get a command class from position 5
        var cmdClassKey = $filter('decToHex')(packet[5], 2, '0x');
        //key = '0x20'; // cc with cmd array
        var cmdKey = $filter('decToHex')(packet[6], 2, '0x');
        //keyCmd = '0x03';
        //console.log('cmdClassKey: ', cmdClassKey)

        var cmdClassVersion = '1';
        var ret = {};
        //var cc = _.findWhere($scope.packet.cmdClass, {_key: cmdClassKey, _version: cmdClassVersion });

        if (_.isEmpty($scope.packet.cmdClass)) {
            return;
        }
        var findCmdClass = _.where($scope.packet.cmdClass, {_key: cmdClassKey});
        if (!findCmdClass) {
            return ret;
        }
        var cmdClass = findCmdClass.pop();
        if (_.isArray(cmdClass.cmd)) {
            ret = _.findWhere(cmdClass.cmd, {_key: cmdKey});
        } else {
            ret = cmdClass.cmd;
        }
        return ret;
    }

    function setZniffer(data) {
        var zeroPad = function (num, places) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        };
        var filter = {};
        var dataTxt = ['Singlecast', 'Explorer Normal', 'Ack', 'CRC_ERROR'];

        var zniffer = _.chain(data)
                .flatten()
                .filter(function (v) {
                    v.src = zeroPad(v.src, 3);
                    v.dest = zeroPad(v.dest, 3);
                    v.dataInt = v.data;
                    v.data = dataTxt[v.data];

                    v.rssi = v.rssi.toString();
                    v.speed = v.speed.toString();
                    return v;
                });
        // Set filter data
        angular.forEach($scope.zniffer.filter.items, function (item) {
            $scope.zniffer.filter.data[item] = _.countBy(zniffer.value(), function (v) {
                return v[item];
            });
        });
        if ($scope.zniffer.filter.model && $scope.zniffer.filter.search) {
            filter[$scope.zniffer.filter.model] = $scope.zniffer.filter.search;
        }
        $scope.zniffer.all = zniffer.where(filter).value();
    }
    
    function setZnifferDataType(data) {
        switch(data){
            case 0:
                return 'Singlecast';
             case 255:
                return 'Predicast'; 
            default:
                return 'Multicast';
        }
    }

    /**
     * Find text
     */
    function findText(n, search, exclude) {
        var gotText = false;
        for (var i in n) {
            var re = new RegExp(search, "ig");
            var s = re.test(n[i]);
            if (s && (!_.isArray(exclude) || exclude.indexOf(n[i]) === -1)) {
                $scope.zniffer.filter.suggestions.push(n[i]);
                gotText = true;
            }
        }
        return gotText;
    }
    ;

});