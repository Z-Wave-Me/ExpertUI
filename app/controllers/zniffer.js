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
      var searchResult = _.indexBy(deviceService.autocomplete(data, $scope.autocomplete), 'id');
      return _.filter(data, function (v) {
        return (searchResult[v.id] ? v : false);
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
    $scope.autocomplete.results = _.uniq(deviceService.autocomplete($scope.zniffer.all, $scope.autocomplete), function (v) {
      return v.application;
    });
    console.log($scope.autocomplete.results);
    return;
    // Expand/Collapse the list
    if (!_.isEmpty($scope.autocomplete.results)) {
      $scope.expandAutocomplete('searchProducts');
    } else {
      $scope.expandAutocomplete();
    }
    // Reset filter q if is input empty
    if ($scope.zwaveVendors.filter.q && $scope.autocomplete.term.length < 1) {
      $scope.setFilter();
    }
  };


  /**
   * Cancel interval on page destroy
   */
  $scope.$on('$destroy', function () {
    $interval.cancel($scope.zniffer.interval);
  });

  /**
   * Reset Communication History
   * @returns {undefined}
   */
  $scope.resetCommunicationHistory = function () {
    $scope.zniffer.all = [];
    $scope.loadCommunicationHistory();
  };

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

    dataService.getApi('communication_history_url', false, true).then(function (response) {
      var znifferData = deviceService.setZnifferData(response.data.data).value();
      //$scope.zniffer.all = deviceService.setZnifferData(response.data.data).value();
      angular.forEach($scope.zniffer.filter, function (v, k) {
        if ($scope.filterBy[k] && v.value) {
          znifferData = $scope.filterBy[k](znifferData, v);
        }
      });
      //znifferData = $scope.filter['type'](response.data.data,$scope.zniffer.filter['type']);
      //console.log(znifferData)
      $scope.zniffer.all = znifferData;
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
        /* if ($scope.zniffer.filter.used.indexOf('src') > -1) {
          filterBySrc = $scope.zniffer.filter.model['src'];
        } */
        // Is filter by destc set?
        /*  if ($scope.zniffer.filter.used.indexOf('dest') > -1) {
           filterByDest = $scope.zniffer.filter.model['dest'];
         } */
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

  /**
   * Set zniffer filter
   * @returns {undefined}
   */
  $scope.setZnifferFilter = function (key) {
    //$cookies.znifferFilter =  JSON.stringify($scope.zniffer.filter.model);
    if (!$scope.zniffer.filter[key].value) {
      return false;
    }
    //$cookies.znifferFilter = angular.toJson($scope.zniffer.filter);
    $cookies.znifferFilter = JSON.stringify($scope.zniffer.filter);
    /*  if (!_.contains($scope.zniffer.filter.used, key)) {
       $scope.zniffer.filter.used.push(key);
     } */
    $scope.resetCommunicationHistory();
    //$scope.runZniffer($scope.zniffer.updateTime);
  };

  /**
   * Delete zniffer filter
   * @returns {undefined}
   */
  $scope.deleteZnifferFilter = function (key) {
    $scope.zniffer.filter = _.omit($scope.zniffer.filter, key);
    $cookies.znifferFilter = angular.toJson($scope.zniffer.filter);
    //delete $cookies['znifferFilter'];
    //$cookies.znifferFilter = angular.toJson($scope.zniffer.filter.model);
    $scope.resetCommunicationHistory();
    //$scope.runZniffer($scope.zniffer.updateTime);
  };
  /**
   * Reset zniffer filter to empty object
   * @returns {undefined}
   */
  $scope.resetZnifferFilter = function (key) {
    $scope.zniffer.filter = {};
    delete $cookies['znifferFilter'];
    $scope.resetCommunicationHistory();
    /*
    $scope.runZniffer($scope.zniffer.updateTime); */
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
    $scope.autocomplete.term = '';
    $scope.resetCommunicationHistory();
    //$scope.runZniffer($scope.zniffer.updateTime);
  };

});