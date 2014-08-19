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

angApp.directive('tooltip', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).hover(function() {
                // on mouseenter
                $(element).tooltip('show');
            }, function() {
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});

angApp.directive('draggable', ['$document', function($document) {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                var startX, startY, initialMouseX, initialMouseY;
                elm.css({position: 'absolute'});

                elm.bind('mousedown', function($event) {
                    startX = elm.prop('offsetLeft');
                    startY = elm.prop('offsetTop');
                    initialMouseX = $event.clientX;
                    initialMouseY = $event.clientY;
                    $document.bind('mousemove', mousemove);
                    $document.bind('mouseup', mouseup);
                    return false;
                });

                function mousemove($event) {
                    var dx = $event.clientX - initialMouseX;
                    var dy = $event.clientY - initialMouseY;
                    elm.css({
                        top: startY + dy + 'px',
                        left: startX + dx + 'px'
                    });
                    return false;
                }

                function mouseup() {
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }
            }
        };
    }]);

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


// Switch all icons
//@todo: move to filters
angApp.directive('routingTypeIcon', function() {
    return {
        restrict: "E",
        replace: true,
        template: '<img src="{{src}}" title="{{title}}" />',
        link: function($scope, elem, attr) {
            var src;
            var title;
            if (attr.nodeId !== null && $scope.ZWaveAPIData) {
                var node = $scope.ZWaveAPIData.devices[attr.nodeId];

                var isListening = node.data.isListening.value;
                var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
                var hasWakeup = 0x84 in node.instances[0].commandClasses;
                var hasBattery = 0x80 in node.instances[0].commandClasses;
                var isPortableRemoteControl = (node.data.deviceTypeString.value == "Portable Remote Controller");

                if (isListening) { // mains powered
                    src = 'app/images/icons/type_Mains-Powered.png';
                    title = $scope._t('conf_apply_mains');
                } else if (hasWakeup) {
                    src = 'app/images/icons/type_Battery-Wakeup.png';
                    title = $scope._t('battery_powered_device');
                } else if (isFLiRS) {
                    src = 'app/images/icons/type_FLIRS2.png';
                    title = $scope._t('FLiRS_device');
                } else if (isPortableRemoteControl) {
                    src = 'app/images/icons/type_Remote-Control.png';
                    title = $scope._t('battery_operated_remote_control');
                } else {
                    src = 'app/images/icons/1x1.png';
                    title = "";
                }
            }
            $scope.src = src;
            $scope.title = title;
        }
    };
});

/*** Fixes ***/
// js holder fix
angApp.directive('expertCommandInput', function() {
    // Get text input
    function getText(label, value, min, max, name) {
        var input = '';
        var inName = (name ? name : label);
        input += '<label>' + label + '</label> ';
        input += '<input class="form-control" name="' + inName + '" type="text" class="form-control" value="' + value + '" title=" min: ' + min + ', max: ' + max + '" />';
        return input;
    }
    // Get node
    function getNode(label, devices, selected, name) {
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
    function getEnum(label, enums, defaultValue, name, hideRadio) {
        var input = '';
        if (!enums) {
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
                if (defaultValue) {
                    if (isNaN(parseInt(defaultValue, 10))) {
                        checked = (v.label == defaultValue ? ' checked="checked"' : '');
                    } else {
                        checked = '';
                    }
                }
                input += '<input name="radio_' + inName + '" class="commands-data-chbx" type="radio" value="' + type.fix.value + '"' + checked + ' /> ' + title + '<br />';
            } else if ('range' in type) {
                var min = type.range.min;
                var max = type.range.max;
                var disabled = ' disabled="true"';
                var setVal = (defaultValue ? defaultValue : min);
                if (defaultValue) {
                    if (defaultValue >= min && defaultValue <= max) {
                        checked = ' checked="checked"';
                        disabled = '';
                    }

                }else{
                    checked = '';
                }
                if (hideRadio) {
                    disabled = '';
                }
              
//                input += '<input name="radio_' + inName + '" class="commands-data-chbx" type="radio" value=""' + checked + ' /> ' + title + ' <input type="text" name="radio_' + inName + '_txt" class="form-control commands-data-txt-chbx" value="' + min + '" title=" min: ' + min + ', max: ' + max + '"'+ disabled + ' /><br />'; 
                if (!hideRadio) {
                    input += '<input name="radio_' + inName + '" class="commands-data-chbx" type="radio" value=""' + checked + ' /> ' + title + ' <input type="text" name="radio_txt_' + inName + '" class="form-control commands-data-txt-chbx" value="' + setVal + '" title=" min: ' + min + ', max: ' + max + '"' + disabled + ' /><br />';
                } else {
                    input += '<input type="text" name="radio_txt_' + inName + '" class="form-control" value="' + setVal + '" title=" min: ' + min + ', max: ' + max + '" /><br />';
                }


            } else {
                input = '';
            }
            cnt++;

        });
        return input;
    }

    // Get dropdown list
    function getDropdown(label, enums, defaultValue, name) {
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
    function getConstant(label, type, defaultValue, name) {
        var input = '';
        var inName = (name ? name : label);
        input += '<label>' + label + '</label><br />';
        if (type.constant.length > 0) {
            input += '<select name="select_' + inName + '" class="form-control">';
            angular.forEach(type.constant, function(v, k) {

                input += '<option value="' + v.type.constant.value + '"> ' + v.label + '</option>';
            });
           

            input += '</select">';
        }
         //console.log(type,defaultValue);
        input += '<em>Constant type</em>';
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
            if (!scope.collection) {
                return;
            }
            var label = scope.collection.label;
            var type = scope.collection.type;
            var name = scope.collection.name;
            var hideRadio = scope.collection.hideRadio;
            if (scope.isDropdown) {
                input = getDropdown(label, type, scope.defaultValue);
                scope.input = input;
                return;
            }
            //if (label && type) {
            if (type) {
                if ('range' in type) {
                    input = getText(label, scope.values, type.range.min, type.range.max, name);
                } else if ('node' in type) {
                    input = getNode(label, scope.getNodeDevices(), 'null', name);
                } else if ('enumof' in type) {
                    input = getEnum(label, type, scope.defaultValue, name, hideRadio);
                } else if ('constant' in type) {
                    input = getConstant(label, type, scope.defaultValue, name);
                } else {
                    input = getDefault(label);
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

