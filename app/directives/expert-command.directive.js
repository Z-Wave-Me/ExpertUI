angApp.directive('zWaveExpertCommand', function (dataService, _, $filter) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: `
      <div class="panel panel-default">
        <div class="panel-heading"><span class="panel-title">
        <ol class="breadcrumb command">
          <li>{{options.parent}}</li>
          <li>{{options.action}}</li>
            </ol> 
        </span>
        </div>
        <expert-command-input-alt ng-repeat="field in data track by $index" class="panel-body"
                            data="field"
                            index="$index"
                            store="options.store">
                    </expert-command-input-alt>
        <div class="panel-footer">
            <div class="btn-group">
              <button type="button" class="btn btn-primary" ng-disable="status === 'loading'" ng-click="store()">
                      <z-wave-execute-button status="status"></z-wave-execute-button> {{options.action}}
              </button>
            </div>
            <div class="btn-group">
            <button type="button" class="btn btn-default" ng-click="copyAndShow()">
            <i class="far fa-copy" style="margin-right: 0.5rem;"></i>{{localOptions.commandStyle}}</button>
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
              <span class="caret"></span>
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <ul class="dropdown-menu" role="menu">
              <li><a href="#" ng-click="setCopyMethod($event, 'HTTP')">HTTP</a></li>
              <li><a href="#" ng-click="setCopyMethod($event, 'JS')">JS</a></li>
            </ul>
            
          </div>
          <z-wave-commands-clipboard set-fn="setDirectiveFn(theDirFn)" ng-show="dirty">{{localOptions.url}}</z-wave-commands-clipboard>
        </div>
      </div>`,
    scope: {
      data: '=',
      options: '=',
    },
    controller: ['$scope', '$cookies', function zWaveExpertCommandController($scope, $cookies) {
      $scope.localOptions = {
        get commandStyle() {
          return $cookies.expertCommandStyle ?? 'HTTP'
        },
        set commandStyle(value) {
          $cookies.expertCommandStyle = value;
        },
        get url() {
          if (this.commandStyle === 'JS') {
            return $filter('expertJSCommand')($scope.model.store, $scope.options);
          }
          if (this.commandStyle === 'HTTP') {
            return location.origin + $filter('expertHTTPCommand')($scope.model.store, $scope.options);
          }
        }
      }

      $scope.setDirectiveFn = function (directiveFn) {
        $scope.directiveFn = directiveFn;
      };

      $scope.copyAndShow = function () {
        $scope.dirty = true;
        setTimeout($scope.directiveFn, 0);
      }
      $scope.setCopyMethod = function ($event, method) {
        $event.preventDefault();
        $scope.localOptions.commandStyle = method;
        $scope.copyAndShow();
      }
      $scope.status = 'ready';
      var store = Array.from({length: $scope.data.length})
      $scope.model = {
        store
      }
      $scope.store = function () {
        if ($scope.status === 'ready') {
          $scope.status = 'loading';
          const request = $filter('expertHTTPCommand')(store, $scope.options)
          dataService.runZwaveCmd(request).then(function () {
            $scope.status = 'success';
          }, function (error) {
            $scope.status = 'error';
            var message = (_.isString(error.data) ? error.data : $scope.$parent._t('error_update_data')) + '\n' + request;
            alertify.alertError(message);
          }).finally(setTimeout(function () {
            $scope.status = 'ready';
          }, 1500))
        }
      }
      const destroy = $scope.$on('expertCommandInput', function (_, {index, value}) {
          store[index] = value;
      })
      $scope.$on('$destroy', function() {
        destroy();
      });
    }]
  }
}).directive('configurationConfig', function ($filter, dataService) {
  return {
    restrict: 'E',
    replace: true,
    template: `
      <div class="cfg-control-content">
        <div><strong>{{index}} {{data.title}}</strong></div> 
        <z-wave-input style="flex-wrap: wrap;" type="data.type" value="data.value" index="0"></z-wave-input>
        <div class="cfg-info"><span ng-class="{'is-updated-false': !isDataActual}">Updated: {{data.updateTime * 1000 | date: 'dd.MM'}} </span> | Set value: <strong>{{data.value}}</strong> | Default value: {{data.default}}</div>
        <bb-help-text trans="data.description"></bb-help-text>
        <button class="btn btn-default" type="button" ng-click="save()" ng-disabled="status !== 'ready'">
            <bb-row-spinner
              spinner="status === 'save@loading'"
              label="_t('apply_config_into_device')"
              icon="'fa-save text-success'">
            </bb-row-spinner>
        </button>
        <button class="btn btn-default" type="button" ng-click="update()" ng-disabled="status !== 'ready'">
            <bb-row-spinner 
              spinner="status === 'update@loading'" 
              label="_t('update_from_device')" 
              icon="'fa-download text-success'">
            </bb-row-spinner>
        </button>
        <button class="btn btn-default" type="button" ng-click="setDefault()" ng-disabled="status !== 'ready'">
            <bb-row-spinner 
              spinner="status === 'setDefault@loading'" 
              label="_t('set_to_default')" 
              icon="'fa-undo text-success'">
            </bb-row-spinner>
        </button>
      </div>`,
    scope: {
      data: '=',
      options: '=',
      index: '='
    },
    link: function (scope, element, attrs) {
      let store;
      scope._t = scope.$parent._t;
      const destroyInit = scope.$on('zWaveInput', function (_, {data}) {
        store = data;
      })
      const destroyUpdate = scope.$on('configuration-commands:cc-table:update', function (_, ccTable) {
        const value = ccTable['Configuration@0'].data[scope.index].val;
        if (value.updateTime > scope.data.updateTime) {
          scope.data.value = value.value;
          scope.isDataActual = true;
          scope.status = 'ready';
        }
      })
      scope.$on('$destroy', function() {
        destroyInit();
        destroyUpdate();
      });
      scope.status = 'ready';
      scope.isDataActual = true;
      scope.store = function (request, buttonName) {
        if (scope.status === 'ready') {
          scope.status = buttonName + '@loading';
          scope.isDataActual = false;
          dataService.runZwaveCmd(request)
            .then(function () {}, function (error) {
            alertify.alertError((_.isString(error.data) ? error.data : scope.$parent._t('error_update_data')) + '\n' + request);
          }).finally(setTimeout(function () {
            scope.status = 'ready';
          }, 1500));
        }
      }
      scope.save = function () {
        scope.store($filter('expertHTTPCommand')([scope.index, store, 0], {
          path: scope.data.path,
          isMethod: true,
          action: 'Set',
        }), 'save');
      }
      scope.setDefault = function () {
        scope.store($filter('expertHTTPCommand')([scope.index, scope.data.default, 0], {
          path: scope.data.path,
          isMethod: true,
          action: 'Set',
        }), 'setDefault')
      }
      scope.update = function () {
        scope.store($filter('expertHTTPCommand')([scope.index], {
          path: scope.data.path,
          isMethod: true,
          action: 'Get',
        }), 'update')
      }
    }
  }
})
  .directive('expertCommandInputAlt', function () {
  return {
    restrict: "E",
    replace: true,
    templateUrl: './app/views/configuration/expert-command-input.html',
    scope: {
      data: '=',
      index: '=',
      store: '='
    },
    link: function (scope, element, attr, ctrl) {
      scope.label = scope.data.label;
      scope.value = scope.data.value ?? scope.data.defaultValue;
      scope.type = Object.keys(scope.data.type)[0];
      scope.model = {
        selected: 0
      };
      scope.updateIndex = function () {
        scope.$emit('expertCommandInput', {index: scope.index, value: store[scope.model.selected]})
      }
      const length = Array.isArray(scope.data.type[scope.type]) ? scope.data.type[scope.type].length : 1;
      const store = Array.from({length})
      const off = scope.$on('zWaveInput', function (event, {index, data}) {
        store[index] = data;
        scope.updateIndex();
      })

      scope.$on("$destroy", function() {
        off();
      })
    },
  };
}).directive('zWaveInput', function () {
  return {
    restrict: 'E',
    replace: true,
    template: `
      <div style="display: flex; flex: 1 1 auto;gap: 1rem; align-items: center" 
        class="input-group" 
        ng-class="{'has-error': invalid(local.data)}">
        <span class="commands-label" ng-if="_type ==='fix'">({{'' + type.fix.value}}) {{label}}</span>
        <span ng-if="_type === 'range'" class="commands-label">
         {{label}} (max: {{type.range.min}}, min: {{type.range.max}})</span>
        <input
          class="commands-body form-control"
          ng-if="_type === 'range'"
          type="text" max='{{type.range.max}}' min='{{type.range.min}}'
          ng-disabled="!!disabled"
          ng-model="local.data"
          >
        <input ng-if="_type === 'string'" ng-model="local.data" ng-disabled="!!disabled" class="commands-body form-control">
        <select ng-if="_type === 'node'" 
            ng-options="item as item.name for item in store track by item.id" 
            ng-model="local.data" 
            class="commands-body form-control">
        </select>
      </div>
`,
    scope: {
      type: '=',
      disabled: '=',
      value: '=',
      label: '=',
      index: '=',
      store: '='
    },
    link: function (scope, element, attr) {
      scope.index = scope.index ?? 0;
      function converter(type, data) {
        if (type === 'string')
          return JSON.stringify(data);
        if (type === 'range')
          return (scope.type.range.shift ?? 0) + +data;
        if (type === 'node')
          return data.id;
        return data;
      }

      scope.invalid = function (value) {
        if (scope.type.range) return scope.type.range.max < value && scope.type.range.min < value;
        return false
      }
      scope._type = Object.keys(scope.type)[0]
      if (scope.value === undefined) {
        if (scope._type === 'fix') {
          scope.value = scope.type.fix.value;
        }
        if (scope._type === 'range' && (scope.value === undefined || scope.value < scope.type.range.min)) {
          scope.value = scope.type.range.min;
        }
        if (scope._type === 'node') {
          scope.value = scope.store[0];
        }
      }
      scope.local = {
        data: scope.value
      };

      const zWaveInput = scope.$watch('local.data', function () {
        scope.$emit('zWaveInput', {index: scope.index, data: converter(scope._type, scope.local.data)});
      });
      scope.$on('destroy', function () {
        zWaveInput();
      })
    }
  }
}).filter('expertHTTPCommand', function (cfg) {
  return function (values, options) {
    const index = options.index === undefined ? '' : `[${options.index}]`
    if (options.isMethod)
      return `${cfg.store_url}${options.path}.${options.action}(${values.join(',')})`
    return `${cfg.store_url}${options.path}.data${index}.${options.action}.value=${values[0]}`
  }
}).filter('expertJSCommand', function (cfg) {
  return function (values, options) {
    const index = options.index === undefined ? '' : `[${options.index}]`
    if (options.isMethod)
      return `${cfg.dongle}.${options.path}.${options.action}(${values.join(',')})`
    return `${cfg.dongle}.${options.path}.data${index}.${options.action}.value=${values[0]}`
  }
})

angApp.directive('zWaveExecuteButton', function () {
  return {
    restrict: 'E',
    scope: {
      status: '='
    },
    template: `<i ng-if="status === 'ready'" class="fas fa-play"></i>
        <i ng-if="status === 'loading'" class="fa fa-spinner fa-spin"></i>
        <i ng-if="status === 'success'" class="fa fa-check fa-lg text-success"></i>
        <i ng-if="status === 'error'" class="fa fa-times fa-lg text-danger"></i>`,
    link: function (scope, element, attr) {
      element.css('display', 'inline');
    }
  }
})

angApp.directive('zWaveCommandDataViewer', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      options: '='
    },
    template: `
    <div class="commands-table-info">
      <table class="table table-striped table-condensed" ng-repeat="(key, value) in data">
          <thead>
            <tr>
                <th>&nbsp;</th>
                <th>#</th>
                <th>{{key}}</th>
                <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr ng-repeat="v in value">
                <td><z-wave-clipboard-mini text="v.cmd | configCommandTableData: options.style"></z-wave-clipboard-mini></td>
                <td style="white-space: nowrap;">
                    <span ng-if="key !== v.key">{{v.key}}</span>&nbsp
                </td>
                <td style="white-space: nowrap;">
                    <span>{{v.data}}</span>
                </td>
                <td style="white-space: nowrap;">
                    <span ng-class="v.isUpdated ? 'green':'red'">{{v.updateTime | isTodayFromUnix}} </span>
                </td>
            </tr>
          </tbody>
      </table>
    </div>`,
    link: function (scope, element, attr) {
    }
  }
}).filter('configCommandTableData', function (cfg) {
  return function (cmd, type) {
    if (type === 'JS')
      return cfg.dongle + '.' + cmd;
    if (type === 'HTTP')
      return location.origin + cfg.store_url + cmd;
  }
})

angApp.directive('zWaveKeyboardControl', function ($document) {
  return {
    restrict: 'A',
    link: function (scope) {
      if (scope.devices) {
        const index = scope.devices.findIndex(({id}) => id === scope.deviceId);
        const prev = scope.devices.at(index - 1)?.id;
        const next = scope.devices.at((index + 1) % scope.devices.length)?.id;
        $document.on("keydown", function (e) {
          if (e.ctrlKey && e.key === "ArrowDown" && !Number.isNaN(next)) {
            scope.redirectToDevice(next);
          }
          if (e.ctrlKey && e.key === 'ArrowUp' && !Number.isNaN(prev)) {
            scope.redirectToDevice(prev);
          }
        });
      }
      scope.$on('$destroy', function() {
        $document.off('keydown');
      });
    }
  }
})

