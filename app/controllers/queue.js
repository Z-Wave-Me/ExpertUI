/**
 * QueueController
 * @author Martin Vach
 */
appController.controller('QueueController', function($scope, $interval,cfg,dataService) {
    $scope.queueData = {
        all: [],
        interval: null,
        show: false,
        length: 0
    };

    /**
     * todo: deprecated
     * Load Queue
     */
    /*$scope.loadQueueData = function() {
        // Load queue
        dataService.getApi('queue_url', null, true).then(function (response) {
            setData(response.data);
            //getQueueUpdate(response.data);
            $scope.refreshQueueData()
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
            return;
        });
    };*/
   // $scope.loadQueueData();

    /**
     * Refresh Queue data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshQueueData = function() {
        var refresh = function() {
            dataService.refreshApi('queue_url').then(function (response) {
                if(response){
                    setData(response.data);
                }
            });
        };
        $scope.queueData.interval = $interval(refresh, $scope.cfg.queue_interval);
    };
    $scope.refreshQueueData();
    /// --- Private functions --- ///

    /**
     * Set queue data
     * @param {object} data
     */
    function setData(data) {
        var dataLength = _.size(data);
        $scope.queueData.length = dataLength;
        if(dataLength < 1){
            // Set warning  queue is empty
            $scope.alert = {message: $scope._t('inspect_queue_empty'), status: 'text-warning', icon: 'fa-exclamation-circle'};
            // Remove queue is empty
        }else{
            $scope.alert = {message: false, status: 'is-hidden', icon: false};
        }
        // Reset queue object
        $scope.queueData.all = [];
        angular.forEach(data, function(job, jobIndex) {
            var buff = '';
            for (var b in job[5]) {
                buff += job[5][b].toString(16) + ' ';
            }
            ;
            var progress;
            if (job[4] === null) {
                progress = '';
            } else if (typeof (job[4]) == 'string') {
                progress = job[4].replace(/\n/g, '<br/>')
            } else {
                job[4].join('<br />');
            }

            var obj = {
                n: job[1][0],
                U: (job[1][11] ? "U" : " "),
                W: (job[1][1] ? "W" : " "),
                S: (job[1][2] ? "S" : " "),
                E: (job[1][3] ? "E" : " "),
                D: (job[1][4] ? "D" : " "),
                Ack: (job[1][5] ? (job[1][6] ? "+" : "-") : " "),
                Resp: (job[1][7] ? (job[1][8] ? "+" : "-") : " "),
                Cbk: (job[1][9] ? (job[1][10] ? "+" : "-") : " "),
                Repl: (job[1][12] ? (job[1][13] ? "+" : "-") : " "),
                Timeout:  parseFloat(job[0]).toFixed(2),
                NodeId:  job[2],
                Description:  job[3],
                Progress:  progress,
                Buffer:  buff
            };
            $scope.queueData.all.push(obj);
        });
    }
});