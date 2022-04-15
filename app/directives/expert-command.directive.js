angApp.directive('zWaveExpertCommand', function (dataService, _, $filter, cfg) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: `<div class="panel panel-default">
      <div class="panel-heading"><span class="panel-title">{{action}}</span></div>
      <expert-command-input-alt ng-repeat="field in data track by $index" class="panel-body"
                          data="field"
                          index="$index">
                  </expert-command-input-alt>
      <div style="display: flex; align-content: center; gap: .5rem" class="panel-footer">
        <z-wave-execute-button status="status" ng-click="store()"></z-wave-execute-button>
        <z-wave-clipboard>{{host}}{{model.store | expertCommand:options}}</z-wave-clipboard>
      </div>
    </div>`,
    scope: {
      action: '=',
      data: '=',
      options: '=',
    },
    controller: ['$scope', function zWaveExpertCommandController($scope) {
      $scope.status = 'ready';
      $scope.host = location.origin;
      var store = Array.from({length: $scope.data.length})
      $scope.model = {
        store
      }
      this.updateIndex = function (index, value) {
        store[index] = value;
      }
      $scope.store = function () {
        if ($scope.status === 'ready') {
          $scope.status = 'loading';
          var request = $filter('expertCommand')(store, $scope.options)
          dataService.runZwaveCmd(request).then(function (response) {
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
    }]
  }
}).directive('expertCommandInputAlt', function (cfg, $filter) {
  // Get text input
  function getText(label, value, min, max, name) {
    var input = '';
    var inName = $filter('stringToSlug')(name ? name : label, '_');
    input += '<label>' + label + '</label> ';
    input += '<input class="form-control" name="' + inName + '" type="text" class="form-control" value="' + value + '" title=" min: ' + min + ', max: ' + max + '" />';
    return input;
  }

  // Get node
  function getNode(label, devices, currValue, name) {
    var input = '';
    var inName = $filter('stringToSlug')(name ? name : label);

    input += '<label>' + label + '</label> ';
    input += '<select name="select_' + inName + '" class="form-control">';
    angular.forEach(devices, function (v, k) {
      var selected = (v.id == currValue ? ' selected' : '');
      input += '<option value="' + v.id + '"' + selected + '>' + v.name + '</option>';
    });

    input += '</select>';

    return input;
  }

  // Get enumerators
  function getEnum(label, enums, defaultValue, name, hideRadio, currValue) {

    var input = '';
    if (!enums) {
      return;
    }

    //var inName = $filter('stringToSlug')(name ? name : label);
    input += '<label>' + label + '</label><br />';
    var cnt = 1;
    var value = (currValue !== undefined ? currValue : defaultValue);
    angular.forEach(enums.enumof, function (v, k) {
      // var inName =  $filter('stringToSlug')(name ? v.name : label);
      var inName = (name ? name + '_' + label : v.name);// + '_' +label;
      /* var inName = v.name;
       if(name){
       inName = name  + '_' +label;
       }*/
      //console.log(inName);
      var title = v.label || '';
      var type = v.type;
      var enumVal = $filter('hasNode')(v, 'type.fix.value');
      var checked = (cnt == 1 ? ' checked="checked"' : '');
      var isCurrent = (cnt == 1 ? ' commads-is-current' : '');

      if ('fix' in type) {
        if (defaultValue) {
          if (isNaN(parseInt(defaultValue, 10))) {
            isCurrent = (v.label == defaultValue ? ' commads-is-current' : '');
          } else {
            isCurrent = '';
          }
        }

        if (!isNaN(parseInt(value, 10))) {
          checked = (enumVal == value ? ' checked="checked"' : '');
        }
        input += '<input name="' + inName + '" class="commands-data-chbx" type="radio" value="' + type.fix.value + '"' + checked + ' /> (' + type.fix.value + ') <span class="commands-label' + isCurrent + '">' + title + '</span><br />';
      } else if ('range' in type) {
        //var textName =  $filter('stringToSlug')(name ? v.textName : label);
        var textName = v.textName || inName;
        var min = type.range.min;
        var max = type.range.max;
        var disabled = ' disabled="true"';
        var setVal = (value ? value : min);
        if (defaultValue) {
          if (defaultValue >= min && defaultValue <= max) {
            disabled = '';
            isCurrent = ' commads-is-current';
          }

        } else {
          isCurrent = '';
        }
        if (value) {
          if (value >= min && value <= max) {
            checked = ' checked="checked"';
            disabled = '';
          }

        } else {
          checked = '';
        }

        if (hideRadio) {
          disabled = '';
        }

//                input += '<input name="radio_' + inName + '" class="commands-data-chbx" type="radio" value=""' + checked + ' /> ' + title + ' <input type="text" name="radio_' + inName + '_txt" class="form-control commands-data-txt-chbx" value="' + min + '" title=" min: ' + min + ', max: ' + max + '"'+ disabled + ' /><br />';
        if (!hideRadio) {
          input += '<div><input name="' + inName + '" class="commands-data-chbx commands-data-chbx-hastxt" type="radio" value="N/A"' + checked + ' /> <span class="commands-label' + isCurrent + '">' + title + '</span> <input type="text" name="' + textName + '" class="form-control commands-data-txt-chbx" value="' + setVal + '" title=" min: ' + min + ', max: ' + max + '"' + disabled + ' /> (min: ' + min + ', max: ' + max + ')</div>';
        } else {
          input += (title !== '' ? '<span class="commands-title-block">' + title + ' </span>' : '') + '<input type="text" name="' + textName + '" class="form-control" value="' + setVal + '" title=" min: ' + min + ', max: ' + max + '" /> (min: ' + min + ', max: ' + max + ')<br />';
        }


      } else {
        input = '';
      }
      cnt++;

    });
    return input;
  }

  // Get dropdown list
  function getDropdown(label, enums, defaultValue, name, currValue) {
    var input = '';
    var cValue = (currValue !== undefined ? currValue : defaultValue);
    var inName = $filter('stringToSlug')(name ? name : label);
    input += '<label>' + label + '</label><br />';
    input += '<select name="select_' + inName + '" class="form-control">';
    var cnt = 1;
    angular.forEach(enums.enumof, function (v, k) {
      var title = v.label;
      var type = v.type;
      var value;
      if ('fix' in type) {
        value = type.fix.value;
      } else if ('range' in type) {
        value = type.range.min;
      }

      if (value) {
        var selected = (type.fix.value == cValue ? ' selected' : '');
      }
      input += '<option value="' + value + '"' + selected + '> ' + title + '</option>';
      cnt++;

    });
    input += '</select">';
    return input;
  }

  // Get constant
  function getConstant(label, type, defaultValue, name, currValue) {
    var input = '';
    var inName = $filter('stringToSlug')(name ? name : label);
    input += '<label>' + label + '</label><br />';
    if (type.constant.length > 0) {
      input += '<select name="select_' + inName + '" class="form-control">';
      angular.forEach(type.constant, function (v, k) {

        input += '<option value="' + v.type.constant.value + '"> ' + v.label + '</option>';
      });


      input += '</select">';
    }
    //console.log(type,defaultValue);
    input += '<em>Constant type</em>';
    return input;
  }

  // Get string
  function getString(label, value, name) {
    var input = '';
    var inName = $filter('stringToSlug')(name ? name : label);
    input += '<label>' + label + '</label> ';
    input += '<input class="form-control" name="' + inName + '_string" type="text" class="form-control" value="' + value + '" />';
    return input;
  }

  // Get bitset
  function getBitset(label, enums, currValue, name) {
    if (!enums) {
      return;
    }
    var input = '';
    var bitArray = $filter('getBitArray')(currValue, 32);
    input += '<label>' + label + '</label><br />';
    var setVal = 0;//(currValue !== undefined ? currValue : 0);
    angular.forEach(enums.bitset, function (v, k) {
      // var inName =  $filter('stringToSlug')(name ? v.name : label);
      var inName = name ? name : v.name;
      var title = v.label || '---';
      var type = v.type;
      var inBitArray = bitArray[k];
      var checked = (inBitArray ? ' checked="checked"' : '');
      if ('bitrange' in type) {
        var min = type.bitrange.bit_from;
        var max = type.bitrange.bit_to;
        input += '<div><input type="text" name="' + inName + '" class="form-control commands-data-txt-chbx_" value="' + setVal + '" title=" min: ' + min + ', max: ' + max + '" /> (min: ' + min + ', max: ' + max + ')</div>';
      } else if ('bitcheck' in type) {
        input += '<input name="' + inName + '" class="commands-data-chbx" type="checkbox" value="' + type.bitcheck.bit + '"' + checked + ' /> (' + type.bitcheck.bit + ')'
          + '<span class="commands-label"> ' + title + '</span><br />';
      } else {
        input += '';
      }
    });
    return input;
  }

  // Get default
  function getDefault(label) {

    var input = '';
    input += '<label>' + label + '</label><br />';
    return input;
  }

  return {
    restrict: "E",
    replace: true,
    require: '^^zWaveExpertCommand',
    templateUrl: './app/views/configuration/expert-command-input.html',
    scope: {
      data: '=',
      index: '='
    },
    link: function (scope, element, attr, ctrl) {
      scope.label = scope.data.label;
      scope.value = scope.data.value ?? scope.data.defaultValue;
      scope.type = Object.keys(scope.data.type)[0];
      scope.model = {
        selected: 0
      };
      var length = Array.isArray(scope.data.type[scope.type]) ? scope.data.type[scope.type].length : 1;
      var store = Array.from({length})

      scope.updateIndex = function () {
        ctrl.updateIndex(scope.index, store[scope.model.selected])
      }
      scope.$on('zWaveInput', function (event, {index, data}) {
        store[index] = data;
        scope.updateIndex()
      })
    },
  };
}).directive('zWaveInput', function () {
  return {
    restrict: 'E',
    replace: true,
    template: `
            <div style="display: flex;
    flex: 1 1 auto;gap: 1rem">
          <span class="commands-label" ng-if="_type ==='fix'">({{'' + type.fix.value}}) {{label}}</span>
          <span ng-if="_type === 'range'" class="commands-label">({{local.data}}) {{label}} (max: {{type.range.min}}, min: {{type.range.max}})</span>
          <input
            class="commands-body"
            ng-if="_type === 'range'"
            type="range" max='{{type.range.max}}' min='{{type.range.min}}'
            ng-disabled="!!disabled"
            ng-model="local.data"
            >
          <input ng-if="_type === 'string'" ng-model="local.data" ng-disabled="!!disabled">
          </div>
`,
    scope: {
      type: '=',
      disabled: '=',
      value: '=',
      label: '=',
      index: '='
    },
    link: function (scope, element, attr) {
      function converter(type, data) {
        if (type === 'string')
          return JSON.stringify(data);
        if (type === 'range')
          return (scope.type.range.shift ?? 0) + +data;
        return data;
      }

      scope._type = Object.keys(scope.type)[0]

      if (scope._type === 'fix') {
        scope.value = scope.type.fix.value;
      }
      if (scope._type === 'range' && (scope.value === undefined || scope.value < scope.type.range.min)) {
        scope.value = scope.type.range.min;
      }
      scope.local = {
        data: scope.value
      };

      scope.$watch('local.data', function () {
        scope.$emit('zWaveInput', {index: scope.index, data: converter(scope._type, scope.local.data)});
      });
    }
  }
}).filter('expertCommand', function (cfg) {
  return function (values, options) {
    if ('method' in options)
      return `${cfg.store_url}${options.cmd}.${options.method}(${values.join(',')})`
    if ('param' in options) {
      return `${cfg.store_url}${options.cmd}.data.${options.param}.value=${values[0]}`
    }
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
      element.css('display', 'flex');
      element.css('align-items', 'center');
    }
  }
})
