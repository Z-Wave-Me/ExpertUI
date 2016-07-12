/**
 * ZnifferController
 * @author Martin Vach
 */
appController.controller('ZnifferController', function ($scope, dataService, _) {
    $scope.zniffer = {
        all: []
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

});