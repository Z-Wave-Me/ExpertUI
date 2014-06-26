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
                case 17:
                    
                    icon = 'fa-lightbulb-o';
                    break;

                case 16:
                    icon = 'fa-power-off';
                    break;
                    
                case 9:
                    icon = 'fa-bullseye fa-lg';
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
                        src = 'app/images/icons/no_img.png';
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
angApp.directive('jsholderFix', function() {
    return {
        link: function(scope, element, attrs) {
            Holder.run({images: element[0], nocss: true});
        }
    };
});

