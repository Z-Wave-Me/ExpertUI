/**
 * Application directives
 * @author Martin Vach
 */

angApp.directive('sortBy', function() {
    return {
        restrict: "E",
        replace: true,
        template: '<span ng-show="predicate == {{coll_name}}"><i ng-show="!reverse" class="fa fa-sort-asc"></i><i ng-show="reverse" class="fa fa-sort-desc"></i></span>',
        link: function(scope, element, attr) {
            // this is link function
            var col_name = scope.$eval(attr.col_name);
        }
    };
});

angApp.directive('btnSpinner', function() {
    return {
        restrict: "E",
        replace: true,
        template: '<i class="fa fa-spinner fa-spin fa-lg" style="display:none;"></i>'
    };
});

/**
 *  Switches directives
 *  @todo: move to filters
 */

// Switch type
angApp.directive('switchTypeIcon', function() {
    return {
        restrict: "E",
        replace: true,
        template: ' <i class="fa {{icon}} fa-lg"></i> ',
        link: function(scope, elem, attr) {
            var icon;
            scope.generic = attr.generic;
            scope.specific = attr.specific;
            switch (parseInt(attr.generic, 10)) {
                case 1:
                    icon = 'fa-eye';
                    break;
                case 17:
                    icon = 'fa-lightbulb-o';
                    break;

                case 16:
                    icon = 'fa-power-off';
                    break;

                case 8:
                    icon = 'fa-sort-amount-desc';
                    break;

                case 9:
                    icon = 'fa-bullseye fa-lg';
                    break;
                case 32:
                    icon = 'fa-eye';
                    break;

                case 64:
                    icon = 'fa-lock fa-lg';
                    break;



                default:
                    icon = '';
                    break;
            }

            scope.icon = icon;
        }
    };
});

// Switch all icons
//@todo: move to filters
angApp.directive('switchAllIcon', function() {
    return {
        restrict: "E",
        replace: true,
        template: '<img src="{{src}}" />',
        link: function(scope, elem, attr) {
            var src;
            if (attr.hasall !== null) {
                switch (parseInt(attr.hasall, 10)) {
                    case 0:
                        src = 'app/images/icons/switch_all_xx_xxx.png';
                        break;

                    case 1:
                        src = 'app/images/icons/switch_all_xx_off.png';
                        break;

                    case 2:
                        src = 'app/images/icons/switch_all_on_xxx.png';
                        break;

                    case 255:
                        src = 'app/images/icons/switch_all_on_off.png';
                        break;

                    default:
                        src = 'app/images/icons/1x1.png';
                        break;
                }
            }
            ;
            scope.src = src;
        }
    };
});

/*** Fixes ***/
// js holder fix
angApp.directive('expertCommandInput', function() {
    // Get text input
    function getText(label, value, min, max,name) {
        var input = '';
         var inName = (name ? name : label);
        input += '<label>' + label + '</label> ';
        input += '<input class="form-control" name="' + inName + '" type="text" class="form-control" value="' + value + '" title=" min: ' + min + ', max: ' + max + '" />';
        return input;
    }
    // Get node
    function getNode(label, devices, selected,name) {
        var input = '';
        var inName = (name ? name : label);
        input += '<label>' + label + '</label> ';
        input += '<select name="select_' + inName + '" class="form-control">';
        input += '<option value="1">RaZberry</option>';
        angular.forEach(devices, function(v, k) {
            input += '<option value="' + v.id + '">' + v.name + '</option>';
        });

        input += '</select>';

        return input;
    }

    // Get enumerators
    function getEnum(label, enums, defaultValue,name) {
        
        var input = '';
        if(!enums){
            return;
        }
        var inName = (name ? name : label);
        input += '<label>' + label + '</label><br />';
        var cnt = 1;
        angular.forEach(enums.enumof, function(v, k) {
            var title = v.label;
            var type = v.type;
           
            var checked = (cnt == 1 ? ' checked="checked"' : '');
            if ('fix' in type) {
                if (defaultValue && type.fix.value) {
                    var checked = (type.fix.value == defaultValue ? ' checked="checked"' : '');
                }
                input += '<input name="radio_' + inName + '" class="commands-data-chbx" type="radio" value="' + type.fix.value + '"' + checked + ' /> ' + title + '<br />';
            } else if ('range' in type) {
                var min = type.range.min;
                var max = type.range.max;
                 var disabled = ' disabled="true"';
                if (defaultValue && min) {
                    var checked = (min == defaultValue ? ' checked="checked"' : '');
                    disabled = '';
                }
                input += '<input name="radio_' + inName + '" class="commands-data-chbx" type="radio" value=""' + checked + ' /> ' + title + ' <input type="text" name="radio_' + inName + '_txt" class="form-control commands-data-txt-chbx" value="' + min + '" title=" min: ' + min + ', max: ' + max + '"'+ disabled + ' /><br />';
            } else {
                input = '';
            }
            cnt++;

        });
        return input;
    }

    // Get dropdown list
    function getDropdown(label, enums, defaultValue,name) {
        var input = '';
         var inName = (name ? name : label);
        input += '<label>' + label + '</label><br />';
        input += '<select name="select_' + inName + '" class="form-control">';
        var cnt = 1;
        angular.forEach(enums.enumof, function(v, k) {
             var title = v.label;
            var type = v.type;
            var value;
            if ('fix' in type) {
                value = type.fix.value;
            } else if ('range' in type) {
                value = type.range.min;
            }

            if (defaultValue) {
                var selected = (type.fix.value == defaultValue ? ' selected' : '');
            }
            input += '<option value="' + value + '"' + selected + '> ' + title + '</option>';
            cnt++;

        });
        input += '</select">';
        return input;
    }
    
     // Get constant 
    function getConstant(label) {
        var input = '';
        input += '<label>' + label + '</label><br />';
        input += '<em>Constant type</em>';
        return input;
    }
    return {
        restrict: "E",
        replace: true,
        template: '<div class="form-group" id="form_group_" ng-bind-html="input | toTrusted"></div>',
        scope: {
            collection: '=',
            devices: '=',
            getNodeDevices: '=',
            values: '=',
            isDropdown: '=',
            defaultValue: '=',
            divId: '='
        },
        link: function(scope, element, attrs) {

            var input = '';
            if(!scope.collection){
                return;
            }
            var label = scope.collection.label;
            var type = scope.collection.type;
            var name = scope.collection.name;
            if (scope.isDropdown) {
                input = getDropdown(label, type, scope.defaultValue);
                scope.input = input;
                return;
            }
            //if (label && type) {
            if (type) {
                if ('range' in type) {
                    input = getText(label, scope.values, type.range.min, type.range.max,name);
                } else if ('node' in type) {
                    input = getNode(label, scope.getNodeDevices(), 'null',name);
                } else if ('enumof' in type) {
                    input = getEnum(label, type, scope.defaultValue,name);
                } else if ('constant' in type) {
                    input = getConstant(label);
                }else {
                    input = '';
                }
                scope.input = input;
                return;
            }

        }

    };
});

/*** Fixes ***/
// js holder fix
angApp.directive('jsholderFix', function() {
    return {
        link: function(scope, element, attrs) {
            Holder.run({images: element[0], nocss: true});
        }
    };
});

