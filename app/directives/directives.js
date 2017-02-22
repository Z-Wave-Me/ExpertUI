/**
 * Application directives
 * @author Martin Vach
 */

/**
 * Window history back
 * @class bbGoBack
 */
angApp.directive('bbGoBack', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                $window.history.back();
            });
        }
    };
}]);

/**
 * Displays an alert message within the div
 * @class bbAlert
 */
angApp.directive('bbAlert', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {alert: '='},
        template: '<div class="alert" ng-if="alert.message" ng-class="alert.status" ng-cloak>'
                + '<i class="fa fa-lg" ng-class="alert.icon"></i> <span ng-bind-html="alert.message|toTrusted"></span>'
                + '</div>'
    };
});

/**
 * Displays an alert message within the span
 * @class bbAlertText
 */
angApp.directive('bbAlertText', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {alert: '='},
        template: '<span class="alert-text" ng-if="alert.message" ng-class="alert.status">'
        + '<i class="fa" ng-class="alert.icon"></i> <span ng-bind-html="alert.message|toTrusted"></span>'
        + '</span>'
    };
});

angApp.directive('sortBy', function () {
    return {
        restrict: "E",
        replace: true,
        template: '<span ng-show="predicate == {{coll_name}}"><i ng-show="!reverse" class="fa fa-sort-asc"></i><i ng-show="reverse" class="fa fa-sort-desc"></i></span>',
        link: function (scope, element, attr) {
            // this is link function
            var col_name = scope.$eval(attr.col_name);
        }
    };
});
/**
 * Displays a help text
 * @class bbHelpText
 */
angApp.directive('bbHelpText', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            trans: '=',
            display: '=',
            icon: '='
        },
        template: '<span class="help-text" ng-class="display"><i class="fa text-info" ng-class="icon ? icon : \' fa-info-circle\'"></i> {{trans}}</span>'
    };
});

/**
 * Displays a page loader
 * @class bbLoader
 */
angApp.directive('bbLoader', function () {
    return {
        restrict: "E",
        replace: true,
        template: '<div id="loading" ng-show="loading" ng-class="loading.status"><div class="loading-in">'
                + '<i class="fa fa-lg" ng-class="loading.icon"></i> <span ng-bind-html="loading.message|toTrusted"></span>'
                + '</div></div>'
    };
});

/**
 * Displays a dta/time in the table row
 * @class bbRowSpinner
 */
angApp.directive('bbDateTime', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            obj: '=',
            updated: '='
        },
        template: '<span class="is-updated-{{updated}}" title="Update: {{obj.date}} {{obj.time}}, invalid: {{obj.invalidateTime}}">' +
        '{{obj.today}}' +
        '</span>'
    };
});

/**
 * Displays a spinner in the table row
 * @class bbRowSpinner
 */
angApp.directive('bbRowSpinner', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            label: '=',
            spinner: '=',
            icon: '='
        },
        template: '<span title="{{label}}">' +
        '<i class="fa " ng-class="spinner ? \'fa-spinner fa-spin\':icon"></i>' +
        '&nbsp;<span class="btn-label">' +
        '{{label}}' +
        '</span></span>'
    };
});

angApp.directive('btnSpinner', function () {
    return {
        restrict: "E",
        replace: true,
        template: '<i class="fa fa-spinner fa-spin fa-lg" style="display:none;"></i>'
    };
});

angApp.directive('tooltip', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).hover(function () {
                // on mouseenter
                $(element).tooltip('show');
            }, function () {
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});
/**
 * Hide collapsed navi after click on mobile devices
 */
angApp.directive('collapseNavbar', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).click(function () {
                $("#nav_collapse").removeClass("in").addClass("collapse");
            });
        }
    };
});

/**
 * Displays a validation error
 * @class bbValidator
 */
angApp.directive('bbValidator', function ($window) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            inputName: '=',
            trans: '=',
            hasBlur: '='
        },
        template: '<div class="valid-error text-danger" ng-if="inputName && !inputName.$pristine && hasBlur">*{{trans}}</div>'
    };
});

angApp.directive('draggable', ['$document', function ($document) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                var startX, startY, initialMouseX, initialMouseY;
                elm.css({position: 'absolute'});

                elm.bind('mousedown', function ($event) {
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

// Switch all icons
//@todo: move to filters
angApp.directive('switchAllIcon', function () {
    return {
        restrict: "E",
        replace: true,
        template: '<img src="{{src}}" />',
        link: function (scope, elem, attr) {
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


// Routyng icons
//@todo: move to filters
angApp.directive('routingTypeIcon', function () {
    return {
        restrict: "E",
        replace: true,
        template: '<i class="fa {{cls}} fa-lg" title="{{title}}"></i>',
        link: function ($scope, elem, attr) {
            var src;
            var title;
            var cls;
            if (attr.nodeId !== null && $scope.ZWaveAPIData) {
                var node = $scope.ZWaveAPIData.devices[attr.nodeId];

                var isListening = node.data.isListening.value;
                var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
                var hasWakeup = 0x84 in node.instances[0].commandClasses;
                var hasBattery = 0x80 in node.instances[0].commandClasses;
                var isPortableRemoteControl = (node.data.deviceTypeString.value == "Portable Remote Controller");

                if (isListening) { // mains powered
                    cls = 'fa-bolt text-warning';
                     title = $scope._t('conf_apply_mains');
                } else if (hasWakeup) {
                    cls = 'fa-battery-full text-success';
                    title = $scope._t('battery_powered_device');
                } else if (isFLiRS) {
                    cls = 'fa-fire text-info';
                    title = $scope._t('FLiRS_device');
                } else if (isPortableRemoteControl) {
                    cls = 'fa-feed text-primary';
                    title = $scope._t('battery_operated_remote_control');
                } else {
                    cls = '';
                    title = "";
                }
            }
            $scope.src = src;
            $scope.title = title;
            $scope.cls = cls;
        }
    };
});

angApp.directive('expertCommandInput', function (cfg,$filter) {
    // Get text input
    function getText(label, value, min, max, name) {
        var input = '';
        var inName = $filter('stringToSlug')(name ? name : label);
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
        input += '<option value="1">' + (cfg.app_type === 'installer' ? 'CIT' : 'Z-Way')+ '</option>';
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
            //var inName =  $filter('stringToSlug')(name ? v.name : label);
            var inName = (name ? name : v.name) + '_' +label;
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
        input += '<input class="form-control" name="' + inName + '" type="text" class="form-control" value="' + value + '" />';
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
        template: '<div class="form-group" ng-bind-html="input | toTrusted"></div>',
        scope: {
            collection: '=',
            devices: '=',
            getNodeDevices: '=',
            values: '=',
            isDropdown: '=',
            defaultValue: '=',
            showDefaultValue: '=',
            currValue: '=',
            currNodeValue: '=',
            name: '=',
            divId: '='
        },
        link: function (scope, element, attrs) {
            var input = '';
            if (!scope.collection) {
                return;
            }
            var label = scope.collection.label;
            var type = scope.collection.type;
            //var name = (scope.collection.name || scope.name);
            var name = scope.name;
            var hideRadio = scope.collection.hideRadio;
            if (scope.isDropdown) {
                input = getDropdown(label, type, scope.defaultValue, name, scope.currValue);
                scope.input = input;
                return;
            }
            //if (label && type) {
            if (type) {
                if ('range' in type) {
                    input = getText(label, scope.values, type.range.min, type.range.max, name);
                } else if ('node' in type) {
                    input = getNode(label, scope.getNodeDevices(), scope.currNodeValue, name);
                } else if ('enumof' in type) {
                    input = getEnum(label, type, scope.defaultValue, name, hideRadio, scope.currValue);
                } else if ('bitset' in type) {
                    input = getBitset(label, type, scope.currValue, name);
                } else if ('constant' in type) {
                    input = getConstant(label, type, scope.defaultValue, name, scope.currValue);
                } else if ('string' in type) {
                    input = getString(label, scope.values, name, scope.currValue);
                } else {
                    input = getDefault(label);
                }
                scope.input = input;
                return;
            }

        }

    };
});

angApp.directive('configDefaultValue', function () {
    return {
        restrict: "E",
        replace: true,
        template: '<span class="default-value-format"> {{input}}</span>',
        scope: {
            collection: '=',
            defaultValue: '=',
            showDefaultValue: '='
        },
        link: function (scope, element, attrs) {
            scope.input = scope.showDefaultValue;
            var input = '';
            if (!scope.collection) {
                return;
            }
            var label = scope.collection.label;
            var type = scope.collection.type;
            var name = scope.collection.name;
            var hideRadio = scope.collection.hideRadio;
            if (type) {
                if ('range' in type) {
                    //input = getText(label, scope.values, type.range.min, type.range.max, name);
                } else if ('node' in type) {
                    //input = getNode(label, scope.getNodeDevices(), 'null', name);
                } else if ('enumof' in type) {
                    input = getEnum(type, scope.defaultValue, scope.showDefaultValue);

                } else if ('constant' in type) {
                    //input = getConstant(label, type, scope.defaultValue, name);
                } else if ('string' in type) {
                    //input = getString(label, scope.values, name);
                } else if ('bitset' in type) {
                    input = scope.defaultValue;
                } else {
                    input = scope.showDefaultValue;
                }
                scope.input = input;

                return;
            }


        }

    };

    // Get enumerators
    function getEnum(enums, defaultValue, showDefaultValue) {
        //console.log(enums)
        var input = showDefaultValue;
        if (!enums) {
            return;
        }
        angular.forEach(enums.enumof, function (v, k) {

            var title = v.label ? v.label : showDefaultValue;
            var type = v.type;
            // debugger; 
            if ('fix' in type) {
                if (type.fix.value == showDefaultValue) {
                    input = title;
                    return;
                }

            } else if ('range' in type) {
                var min = type.range.min;
                var max = type.range.max;
                var setVal = (defaultValue ? defaultValue : min);
                if (setVal == showDefaultValue) {
                    input = showDefaultValue;
                    return;
                }
            }

        });

        return input;
    }

    // Get bitset
    function getBitset(enums, defaultValue, showDefaultValue) {
        //console.log(enums)
        var input = showDefaultValue;
        if (!enums) {
            return;
        }
        angular.forEach(enums.enumof, function (v, k) {

            var title = v.label ? v.label : showDefaultValue;
            var type = v.type;
            // debugger; 
            if ('fix' in type) {
                if (type.fix.value == showDefaultValue) {
                    input = title;
                    return;
                }

            } else if ('range' in type) {
                var min = type.range.min;
                var max = type.range.max;
                var setVal = (defaultValue ? defaultValue : min);
                if (setVal == showDefaultValue) {
                    input = showDefaultValue;
                    return;
                }
            }

        });

        return input;
    }
});

angApp.directive('configValueTitle', function () {
    return {
        restrict: "A",
        //replace: true,
        template: '<span title="{{showValue}}">{{input}}</span>',
        scope: {
            collection: '=',
            showValue: '='
        },
        link: function (scope, element, attrs) {
            scope.input = scope.showValue;
            var input = '';
            if (!scope.collection) {
                return;
            }
            var type = scope.collection.type;

            if (type) {
                if ('range' in type) {
                    //input = getText(label, scope.values, type.range.min, type.range.max, name);
                } else if ('node' in type) {
                    //input = getNode(label, scope.getNodeDevices(), 'null', name);
                } else if ('enumof' in type) {
                    input = getEnum(type, scope.showValue);

                } else if ('constant' in type) {
                    //input = getConstant(label, type, scope.defaultValue, name);
                } else if ('string' in type) {
                    //input = getString(label, scope.values, name);
                } else {
                    input = scope.showValue;
                }
                scope.input = input;

                return;
            }


        }

    };

    // Get enumerators
    function getEnum(enums, showValue) {
        //console.log(enums)
        var input = showValue;
        if (!enums) {
            return;
        }
        angular.forEach(enums.enumof, function (v, k) {

            var title = v.label ? v.label : showValue;
            var type = v.type;
            // debugger; 
            if ('fix' in type) {
                if (type.fix.value == showValue) {
                    input = title;
                    return;
                }

            } else if ('range' in type) {
                var min = type.range.min;
                var max = type.range.max;
                var setVal = (showValue ? showValue : min);
                if (setVal == showValue) {
                    input = showValue;
                    return;
                }
            }

        });

        return input;
    }
});

angApp.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

/**
 * Catch a key event
 * @class bbKeyEvent
 */
angApp.directive('bbKeyEvent', function () {
    return function (scope, element, attrs) {
        element.bind("keyup", function (event) {
            if (event.which !== 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.bbKeyEvent);
                });

                event.preventDefault();
            }
        });
    };
});

/*** Fixes ***/
// js holder fix
angApp.directive('jsholderFix', function () {
    return {
        link: function (scope, element, attrs) {
            Holder.run({images: element[0], nocss: true});
        }
    };
});

