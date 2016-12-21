/**
 * QueueController
 * @author Martin Vach
 */
appController.controller('QueueController', function($scope, $interval,cfg,dataService) {
    $scope.queueData = {
        all: [],
        interval: null,
        show: false
    };

    /**
     * Load Queue
     */
    $scope.loadQueueData = function() {
        // Load queue
        dataService.getApi('queue_url', null, true).then(function (response) {
            getQueueUpdate(response.data);
            $scope.refreshQueueData()
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
            return;
        });
    };
    $scope.loadQueueData();

    /**
     * Refresh Queue data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshQueueData = function() {
        var refresh = function() {
            dataService.getApi('queue_url', null, true).then(function (response) {
                getQueueUpdate(response.data);
            });
        };
        $scope.queueData.interval = $interval(refresh, $scope.cfg.queue_interval);
    };
    /**
     * Inspect Queue
     */
    $scope.inspectQueue = function() {
        // Load queue
        dataService.getQueueData(function(data) {
            getQueueUpdate(data);
        });
        // Refresh queue
        dataService.updateQueueData(function(data) {
            getQueueUpdate(data);
        });
        return;
    };

   // $scope.inspectQueue();

    /// --- Private functions --- ///


    // Get Queue updates
    function getQueueUpdate(data) {
        console.log(data)
        var trs = '';
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

            trs +=
                    '<tr>' +
                    '<td>' + job[1][0] + '</td>' +
                    '<td>' + (job[1][11] ? "U" : " ") + '</td>' +
                    '<td>' + (job[1][1] ? "W" : " ") + '</td>' +
                    '<td>' + (job[1][2] ? "S" : " ") + '</td>' +
                    '<td>' + (job[1][3] ? "E" : " ") + '</td>' +
                    '<td>' + (job[1][4] ? "D" : " ") + '</td>' +
                    '<td>' + (job[1][5] ? (job[1][6] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + (job[1][7] ? (job[1][8] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + (job[1][9] ? (job[1][10] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + parseFloat(job[0]).toFixed(2) + '</td>' +
                    '<td>' + job[2] + '</td>' +
                    '<td class="alignleft">' + job[3] + '</td>' +
                    '<td class="alignleft">' + progress + '</td>' +
                    '<td class="alignleft">' + buff + '</td>' +
                    '</tr>\n';
        });
        if (trs == '') {
            trs = '<tr><td colspan="12"><i>' + $scope._t('inspect_queue_empty') + '</i></td></tr>';
        }
        $('#inspect_queue_len').html($scope._t('txt_queue_length') + ': ' + data.length);
        $('#inspect_queue_table_body').html(trs);
        return trs;
    }
    ;
});