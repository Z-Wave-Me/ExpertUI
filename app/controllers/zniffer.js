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
    updateTime: Math.round(+new Date() / 1000),
    trace: 'start',
    interval: null,
    all: [],
    devices: {},
    filter: {},
    cfg: {
      type: ['incoming', 'outgoing'],
      speed: ['9.6', '40', '100', '200'],
      encaps: ['I', 'Su', 'M', 'S', 'S2', 'C'],
      hops: ['0', '1', '2', '3']
    }

  };
  $scope.currentPage = 1;
  $scope.pageSize = cfg.page_results_history;
  $scope.setCurrentPage = function (val) {
    $scope.currentPage = val;
  };

  $scope.autocomplete = {
    source: [],
    term: '',
    searchInKeys: 'application',
    returnKeys: 'id,application',
    strLength: 2,
    resultLength: 10
  };

  /**
   * Filter by
   */
  $scope.filterBy = {
    // Type
    type: function (data, filter) {
      return _.where(data, {
        type: filter.value
      });
    },
    // Date
    date: function (data, filter) {
      var from = Date.parse(filter.value) / 1000;
      return _.filter(data, function (v) {
        if (filter.to) {
          var to = Date.parse(filter.to) / 1000;
          return (v.updateTime >= from) && (v.updateTime <= to);
        }
        return v.updateTime >= from;
      });
    },
    // Src
    src: function (data, filter) {
      var values = filter.value.split(',');
      if (filter.hide) {
        return _.filter(data, function (v) {
          return values.indexOf(v.src.toString()) === -1;
        });
      }
      return _.filter(data, function (v) {
        return values.indexOf(v.src.toString()) > -1;
      });
    },
    // Dest
    dest: function (data, filter) {
      var values = filter.value.split(',');
      if (filter.hide) {
        return _.filter(data, function (v) {
          return values.indexOf(v.dest.toString()) === -1;
        });
      }
      return _.filter(data, function (v) {
        return values.indexOf(v.dest.toString()) > -1;
      });
    },
    // Speed
    speed: function (data, filter) {
      if (filter.hide) {
        return _.reject(data, function (v) {
          return v.speed === parseInt(filter.value);
        });
      }
      return _.where(data, {
        speed: parseInt(filter.value)
      });

    },
    // Hops
    hops: function (data, filter) {
      return data;
    },
    // Encaps
    encaps: function (data, filter) {
      if (filter.hide) {
        return _.reject(data, function (v) {
          return v.encaps === filter.value;
        });
      }
      return _.where(data, {
        encaps: filter.value
      });
    },
    // Application
    application: function (data, filter) {
      return _.filter(data, function (v) {
        var re = new RegExp(filter.value, "ig");
        return re.test(v.application) ? v : false;
      });
    },
  };

  /**
   * Renders search result in the list
   */
  $scope.searchMe = function () {
    if (!$scope.zniffer.filter.application) {
      $scope.zniffer.filter.application = {
        value: ''
      }
    }
    $scope.zniffer.filter.application.value = $scope.autocomplete.term;
    $scope.autocomplete.results = _.uniq(deviceService.autocomplete($scope.autocomplete.source, $scope.autocomplete), function (v) {
      return v.application;
    });
    if(_.size($scope.autocomplete.results) ||  $scope.autocomplete.term === ''){
     //$scope.loadCommunicationHistory();
     $scope.setZnifferFilter('application');
    }
    return;
  };

  /**
   * Cancel interval on page destroy
   */
  $scope.$on('$destroy', function () {
    $interval.cancel($scope.zniffer.interval);
  });

  /**
   * Get zniffer filter from cookie
   * @returns {undefined}
   */
  $scope.getCookieZnifferFilter = function () {
    var filter = angular.fromJson($cookies.znifferFilter);
    if (_.size(filter)) {
      $scope.zniffer.filter = filter;
      $scope.autocomplete.term = $filter('hasNode')(filter, 'application.value');
    }
  };


  // Watch for pagination change
  $scope.$watch('currentPage', function (page) {
    paginationService.setCurrentPage(page);
  });

  $scope.setCurrentPage = function (val) {
    $scope.currentPage = val;
  };

  /**
   * Load zwave data
   */
  $scope.loadZwaveData = function () {
    dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
      angular.forEach(ZWaveAPIData.devices, function (v, k) {
        $scope.zniffer.devices[k] = {
          givenName: $filter('deviceName')(k, v)
        };
      });
    });
  };
  $scope.loadZwaveData();

  /**
   * Load communication history
   * @returns {undefined}
   */
  $scope.loadCommunicationHistory = function () {
    $scope.getCookieZnifferFilter();
    //$scope.autocomplete.results = [];
    dataService.getApi('communication_history_url', false, true).then(function (response) {
      var znifferData = deviceService.setZnifferData(response.data.data).value();
      // Create source for autocomplete
      $scope.autocomplete.source = _.map(znifferData, function (v) {
        return {
          id: v.id,
          application: v.application
        }
      });
       // The filter is set
      angular.forEach($scope.zniffer.filter, function (v, k) {
        if ($scope.filterBy[k] && v.value) {
          znifferData = $scope.filterBy[k](znifferData, v);
        }
      });
       // Addto scope
      $scope.zniffer.all = znifferData;
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
        $scope.zniffer.updateTime = response.data.updateTime;
        var znifferData = deviceService.setZnifferData(response.data.data).value();
        /* if (!_.size(znifferData)) {
          console.log('No live zniffer data')
          return;
        } */
        // The filter is set
        angular.forEach($scope.zniffer.filter, function (v, k) {
          if ($scope.filterBy[k] && v.value) {
            znifferData = $scope.filterBy[k](znifferData, v);
          }
        });

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
        return;

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

  /**
   * Set zniffer filter
   * @returns {undefined}
   */
  $scope.setZnifferFilter = function (key) {
    // Removing filter if value is empty or not exists
    if (!$scope.zniffer.filter[key].value) {
      $scope.zniffer.filter = _.omit($scope.zniffer.filter, key);
    }
    // Set filter
    $cookies.znifferFilter = JSON.stringify($scope.zniffer.filter);
    $scope.loadCommunicationHistory();
    //$scope.runZniffer($scope.zniffer.updateTime);
  };

  /**
   * Delete zniffer filter
   * @returns {undefined}
   */
  $scope.deleteZnifferFilter = function (key) {
    if(key === 'application'){
      $scope.autocomplete.term = '';
    }
    $scope.zniffer.filter = _.omit($scope.zniffer.filter, key);
    $cookies.znifferFilter = angular.toJson($scope.zniffer.filter);
    $scope.loadCommunicationHistory();
    //$scope.runZniffer($scope.zniffer.updateTime);
   
  };
  /**
   * Reset zniffer filter to empty object
   * @returns {undefined}
   */
  $scope.resetZnifferFilter = function (key) {
    $scope.zniffer.filter = {};
    delete $cookies['znifferFilter'];
    $scope.autocomplete.term = '';
    $scope.loadCommunicationHistory();
    //$scope.runZniffer($scope.zniffer.updateTime);
  };

  /**
   * Loads zniffer data whan filter is changed
   * @returns {undefined}
   */
  $scope.onChangeZnifferFilter = function (key) {
    $scope.setZnifferFilter(key);
  };

});