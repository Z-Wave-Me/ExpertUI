/**
 * Application directives
 * @author Martin Vach
 */

angApp.directive('collection', function() {
    return {
        restrict: "E",
        replace: true,
        scope: {
            collection: '='
        },
        //template: "<ul><member ng-repeat='member in collection.devices' member='member'></member></ul>"
        template: "<p ng-repeat='(k,i) in collection.devices'>{{ k }}: {{ i.data.name }}</p>"
    };
});

angApp.directive('member_', function($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            member: '='
        },
        template: "<li></li>",
        link: function(scope, element, attrs) {
            if (angular.isArray(scope.member)) {
                element.append("<collection collection='member.data.name'></collection>");
                $compile(element.contents())(scope);
            }
            ;
        }
    };
});
// Sensor collection directive
angApp.directive('abcollection', function($log, Post) {

    // Link function
    var linkFunction = function($scope, element, attributes) {
        $scope.sensors = [];
        $scope.data = attributes['abcollection']; //Todo: read data from the attribute (not from factory)
        //    
        Post.query(function(data) {
            //$scope.devices = data.devices;
            $scope.controllerId = data.controller.data.nodeId.value;

            // Loop throght devices
            angular.forEach(data.devices, function(device, k) {
                $log.info(k);
                if (k == 255 || k == $scope.controllerId || device.data.isVirtual.value) {
                    //$log.error(node_id);
                    return false;
                }

                // Loop throght instances
                angular.forEach(device.instances, function(instance, instanceId) {
                    if (instanceId != 0) {
                        return;
                    }
                    // Loop throght commandClasses
                    var command = instance.commandClasses[0x30];
                    if (angular.isObject(command)) {
                        angular.forEach(command.data, function(key, val) {

                            var obj_data = instance.commandClasses[0x30];

                            // Not a sensor type
                            var sensor_type = parseInt(key, 10);
                            if (isNaN(sensor_type)) {
                                return;
                            }

                            // Initialize object
                            var obj = {};
                            obj['id'] = k;
                            obj['name'] = device.data.name;
                            // Push to devices
                            $scope.sensors.push(obj);
                            //$log.info(val);
//                         $log.info(obj_data.name);
//                          $log.info(key);
                            // Set variables
//                        sensor_type = parseInt(key, 10);
//                        obj = instance.commandClasses[0x30];
//                        type = obj.name;
//                        purpose = obj.data[1].sensorTypeString.value;
//                        level = (obj.data[1].level.value ? 'Triggered' : 'Idle');
//                        ivalidate_time = obj.data[1].invalidateTime;
//                        update_time = obj.data[1].updateTime;
//                        time_class = ((update_time > ivalidate_time) ? 'success' : 'danger');
//                        // Not a sensor type
//                        if (isNaN(sensor_type)) {
//                            return;
//                        }
//                        sensor = setRow(node_id, device_name, type, purpose, level, update_time, time_class);

                        });
                    }

                });
            });

        });

    };
    return {
        restrict: 'C',
        replace: false,
        link: linkFunction,
        scope: {
            abcollection: '='
        },
        //template: "<ul><member ng-repeat='member in collection.devices' member='member'></member></ul>"
        //template: "<p ng-repeat='v in sensors'>{{ v.id }}: {{ v.name }}</p>"
        template: '<tr ng-repeat="v in sensors | orderBy:predicate:reverse">' +
                '<td>{{ v.id }}</td>' +
                '<td>{{ v.name }}</td>' +
                '<td><button class="btn btn-primary">Update</button></td>' +
                '</tr>'
                //template: "<p>{{data}}</p>"
    };
});

angApp.directive('btnSpinner', function() {
    return {
        restrict: "E",
        replace: true,
        template: '<i class="fa fa-spinner fa-spin fa-lg" style="display:none;"></i>'
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

