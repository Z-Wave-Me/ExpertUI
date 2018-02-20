/**
 * @overview This controller renders and handles zniffer.
 * @author Martin Vach
 */

/**
 * The controller that runs and pauses zniffer.
 * @class ZnifferController
 * @author Martin Vach
 */
appController.controller('ZnifferController', function ($scope, $interval, $timeout, $cookies, $location, $http, $filter, cfg, dataService, deviceService, myCache, paginationService, _) {
  $scope.zniffer = {
    run: true,
    updateTime: Math.round(+new Date() / 1000),
    trace: 'start',
    interval: null,
    all: [],
    filter: {
      model: {
        src: {
          value: '',
          show: '1'
        },
        dest: {
          value: '',
          show: '1'
        },
        data: {
          value: '',
          show: '1'
        }
      },
      used: []
    }

  };
  $scope.currentPage = 1;
  $scope.pageSize = cfg.page_results_history;
  $scope.setCurrentPage = function (val) {
    $scope.currentPage = val;
  };

 /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
      $interval.cancel($scope.zniffer.interval);
  });

  /**
   * Detect zniffer filter
   * @returns {undefined}
   */
  $scope.detectZnifferFilter = function () {
    angular.forEach($scope.zniffer.filter.model, function (v, k) {
      var index = $scope.zniffer.filter.used.indexOf(k);
      if (v['value'] !== '' && index === -1) {
        $scope.zniffer.filter.used.push(k);
      }
    });
  };
  $scope.detectZnifferFilter();


  /**
   * Reset Communication History
   * @returns {undefined}
   */
  $scope.resetCommunicationHistory = function () {
    $scope.zniffer.all = [];
    $scope.loadCommunicationHistory();
  };
  /**
   * Set zniffer filter
   * @returns {undefined}
   */
  $scope.setZnifferFilter = function (key) {
    //$cookies.znifferFilter =  JSON.stringify($scope.zniffer.filter.model);
    if (!$scope.zniffer.filter.model[key].value) {
      return false;
    }
    $cookies.znifferFilter = angular.toJson($scope.zniffer.filter.model);
    if (!_.contains($scope.zniffer.filter.used, key)) {
      $scope.zniffer.filter.used.push(key);
    }
    $scope.resetCommunicationHistory();
    $scope.runZniffer($scope.zniffer.updateTime);
  };
  /**
   * Reset zniffer filter
   * @returns {undefined}
   */
  $scope.resetZnifferFilter = function (key) {
    $scope.zniffer.filter.model[key].value = '';
    $scope.zniffer.filter.model[key].show = '1';
    $scope.zniffer.filter.used = _.without($scope.zniffer.filter.used, key);
    delete $cookies['znifferFilter'];
    //$cookies.znifferFilter = angular.toJson($scope.zniffer.filter.model);
    $scope.resetCommunicationHistory();
    $scope.runZniffer($scope.zniffer.updateTime);
  };
  /**
   * Reset all zniffer filters
   * @returns {undefined}
   */
  $scope.resetZnifferFilterAll = function () {
    angular.forEach($scope.zniffer.filter.model, function (v, k) {
      $scope.zniffer.filter.model[k].value = '';
      $scope.zniffer.filter.model[k].show = '1';
    });

    $scope.zniffer.filter.used = [];
    delete $cookies['znifferFilter'];
    //$cookies.znifferFilter = angular.toJson($scope.zniffer.filter.model);
    $scope.resetCommunicationHistory();
    $scope.runZniffer($scope.zniffer.updateTime);
  };

  // Watch for pagination change
  $scope.$watch('currentPage', function (page) {
    paginationService.setCurrentPage(page);
  });

  $scope.setCurrentPage = function (val) {
    $scope.currentPage = val;
  };

  /**
   * Load communication history
   * @returns {undefined}
   */
  $scope.loadCommunicationHistory = function () {
    var filter = '?filter=' + JSON.stringify($scope.zniffer.filter.model);
    dataService.getApi('communication_history_url', filter, true).then(function (response) {

      $scope.zniffer.all = deviceService.setZnifferData(response.data.data).value();
      $scope.zniffer.run = true;
    });
  };
  $scope.loadCommunicationHistory();

  /**
   * Run Zniffer
   * @returns {undefined}
   */
  $scope.runZniffer = function (updateTime) {

    var refresh = function () {
      if ($scope.zniffer.trace === 'pause') {
        return;
      }
      if ($http.pendingRequests.length > 0) {
        return;
      }
      dataService.refreshApi('zniffer_url', null, true).then(function (response) {
        var filterBySrc = false;
        var filterByDest = false;
        // Is filter by src set?
        if ($scope.zniffer.filter.used.indexOf('src') > -1) {
          filterBySrc = $scope.zniffer.filter.model['src'];
        }
        // Is filter by destc set?
        if ($scope.zniffer.filter.used.indexOf('dest') > -1) {
          filterByDest = $scope.zniffer.filter.model['dest'];
        }
        $scope.zniffer.updateTime = response.data.updateTime;
        var znifferData = deviceService.setZnifferData(response.data.data).value();
        if (!_.size(znifferData)) {
          console.log('No live zniffer data')
          return;
        }

        // Filter by SRC
        if (filterBySrc) {
          var srcs = filterBySrc.value.split(',');
          if (filterBySrc.show === '1') {
            //console.log('SRC - Show only: ', srcs)
            znifferData = _.filter(znifferData, function (v) {
              return srcs.indexOf(v.src.toString()) > -1;
            });
          } else {
            //console.log('SRC - HIDE: ', srcs)
            znifferData = _.filter(znifferData, function (v) {
              return srcs.indexOf(v.src.toString()) === -1;
            });
          }

        }

        // Filter by DEST
        if (filterByDest) {
          var dests = filterByDest.value.split(',');
          if (filterByDest.show === '1') {
            //console.log('DEST- Show only: ', dests)
            znifferData = _.filter(znifferData, function (v) {
              return dests.indexOf(v.dest.toString()) > -1;
            });
          } else {
            //console.log('DEST - HIDE: ', dests)
            znifferData = _.filter(znifferData, function (v) {
              return dests.indexOf(v.dest.toString()) === -1;
            });
          }
        }
        // Push to scope
        _.filter(znifferData, function (v) {
          var exists = _.findWhere($scope.zniffer.all, {
            id: v.id,
            bytes: v.bytes
          });
          if (!exists) {
            v.isNew = true;
            $scope.zniffer.all.push(v);
          };
        });
       
      });
    }
    if ($scope.zniffer.trace === 'start') {
      $scope.zniffer.interval = $interval(refresh, cfg.zniffer_interval);
    }
  };
  $scope.runZniffer($scope.zniffer.updateTime);

  /**
   * Set trace
   */
  $scope.setTrace = function (trace) {
    switch (trace) {
      case 'pause':
        $scope.zniffer.trace = 'pause';
        $interval.cancel($scope.zniffer.interval);
        $scope.loadCommunicationHistory();
        break;
      default:
        $scope.zniffer.trace = 'start';
        $scope.loadCommunicationHistory();
        $scope.runZniffer($scope.zniffer.updateTime);
        break;

    }
  };

});