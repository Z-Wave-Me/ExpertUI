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
            console.log(col_name);
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
    function getText(label, value, min, max) {
        var input = '';
        input += '<label>' + label + '</label> ';
        input += '<input class="form-control" name="' + label + '" type="text" class="form-control" value="' + value + '" title=" min: ' + min + ', max: ' + max +'" />';
        return input;
    }
    // Get node
    function getNode(label, devices, selected) {
        var input = '';
        input += '<label>' + label + '</label> ';
        input += '<select name="select_'+ label +'" class="form-control">';
        input += '<option value="1">RaZberry</option>';
        angular.forEach(devices, function(v, k) {
            input += '<option value="' + v.id + '">' + v.name + '</option>';
        });

        input += '</select>';

        return input;
    }

    // Get enumerators
    function getEnum(label, enums, checked) {
        var input = '';
        input += '<label>' + label + '</label><br />';
        var cnt = 1;
        angular.forEach(enums.enumof, function(v, k) {
            var title = v.label;
            var type = v.type;
            var checked = (cnt == 1 ? ' checked="checked"' : '');

            if ('fix' in type) {
                input += '<input name="radio_'+ label + '" class="commands-data-chbx" type="radio" value="' + type.fix.value + '"' +  checked +' /> ' + title + '<br />';
            } else if ('range' in type) {
                var min = type.range.min;
                var max = type.range.max;
                input += '<input name="radio_'+ label + '" class="commands-data-chbx" type="radio" value=""' +  checked +' /> ' + title + ' <input type="text" name="radio_'+ label + '_txt" class="form-control commands-data-txt-chbx" value="' + min + '" title=" min: ' + min + ', max: ' + max +'" disabled="true" /><br />';
            } else {
                input = '';
            }
            cnt++;

        });
        return input;
    }
    return {
        restrict: "E",
        replace: true,
        template: '<div class="form-group" ng-bind-html="input | toTrusted"></div>',
        scope: {
            collection: '=',
            devices: '=',
            getNodeDevices: '='
        },
        link: function(scope, element, attrs) {
             
            var input = '';
            var label = scope.collection.label;
            var type = scope.collection.type;
            //if (label && type) {
            if (type) {
                if ('range' in type) {
                    input = getText(label, attrs.value, type.range.min, type.range.max);
                } else if ('node' in type) {
                    input = getNode(label, scope.getNodeDevices(), 'null');
                } else if ('enumof' in type) {
                    input = getEnum(label, type, 'checked');
                } else {
                    input = 'NO';
                }
            }
            scope.input = input;
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

