/**
 * ZnifferController
 * @author Martin Vach
 */
appController.controller('ZnifferController', function ($scope, dataService, _) {
    $scope.zniffer = {
        all: [],
        frequency: 0,
        uzb: {
            current: 0,
            all: ['COM 1','COM 2','COM 3','COM 4']
        },
        filter: {
            model: false,
            items: ['homeid', 'src', 'dest','rssi','speed','data'],
            data: [],
            search: '',
            suggestions: []
        }
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
            var searchArr= _.keys($scope.zniffer.filter.data[$scope.zniffer.filter.model]);
             var search= $scope.zniffer.filter.search;
            findText(searchArr, search);
        }
    };

    /// --- Private functions --- ///
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