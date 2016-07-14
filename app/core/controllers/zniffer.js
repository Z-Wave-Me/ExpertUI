/**
 * ZnifferController
 * @author Martin Vach
 */
appController.controller('ZnifferController', function ($scope, dataService, _) {
    $scope.zniffer = {
        all: [],
        filter: {
            model: false,
            items: ['homeid','src','dest'],
            search: '',
            suggestions:[]
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
    $scope.setZnifferFilter = function () {
        $scope.zniffer.filter.search = '';
        console.log($scope.zniffer)
    };
    $scope.loadZniffer();
    
    /**
     * Search in the zniffer by filter
     */
    $scope.searchZniffer = function () {
        $scope.zniffer.filter.suggestions = [];
        if ($scope.zniffer.filter.search.length >= 2) {
            console.log($scope.zniffer.filter.search)
            findText(['Net_001','Net_002','Net_003'], $scope.zniffer.filter.search,[1,2,3]);
            console.log($scope.zniffer.filter.suggestions)
        }
    };
    
     /**
     * Apply search result
     */
    $scope.searchResulzZniffer = function (txt) {
//        txt = txt || $scope.zniffer.filter.search;
//         $scope.zniffer.filter.search
//        $scope.zniffer.filter.suggestions = [];
        if (!txt) {
            return;
        }
         $scope.zniffer.filter.search = txt;
        $scope.zniffer.filter.suggestions = [];
        console.log('Now filtering by: ', $scope.zniffer.filter)
        //$scope.zniffer.filter.search = '';
        return;
    };

    /// --- Private functions --- ///
    function setZniffer(data) {
        var zeroPad = function (num, places) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        };
        var dataTxt = ['Singlecast','Explorer Normal','Ack','CRC_ERROR'];

        var zniffer = _.chain(data)
                .flatten()
                .filter(function (v) {
                    v.src = zeroPad(v.src,3);
             v.dest = zeroPad(v.dest,3);
               v.data_txt = dataTxt[v.data];
                    return v;
                });
        $scope.zniffer.all = zniffer.value();
    }
    
    /**
     * Find text
     */
    function findText(n, search, exclude) {
        var gotText = false;
        for (var i in n) {
            var re = new RegExp(search, "ig");
            var s = re.test(n[i]);
            if (s && (! _.isArray(exclude) || exclude.indexOf(n[i]) === -1)) {
                $scope.zniffer.filter.suggestions.push(n[i]);
                gotText = true;
            }
        }
        return gotText;
    }
    ;

});