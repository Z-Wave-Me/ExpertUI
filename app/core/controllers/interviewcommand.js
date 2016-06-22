/**
 * InterviewCommandController
 * @author Martin Vach
 */
appController.controller('InterviewCommandController', function($scope, $filter, deviceService) {
    // Show modal dialog
    $scope.showModal = function(target, interviewCommands, ccId, type) {
        var interviewData = {};
        var updateTime;
        $(target).modal();
        if (type) {
            angular.forEach(interviewCommands, function(v, k) {
                if (v.ccId == ccId) {
                    interviewData = v[type];
                    updateTime = v.updateTime;
                    return;
                }
            });
        } else {
            interviewData = interviewCommands;
        }
// DEPRECATED
        // Formated output
//        var getCmdData = function(data, name, space) {
//            if (name == undefined) {
//                return '';
//            }
//            var html = '<div class="cc-data-element">' + space + name + ': <span class="' + ((data.updateTime > data.invalidateTime) ? 'green' : 'red') + '">' + ((typeof (data.value) !== 'undefined' && data.value != null) ? data.value.toString() : 'None') + '</span>' + ' (<span class="' + ((data.updateTime > data.invalidateTime) ? '' : 'red') + '">' + $filter('isTodayFromUnix')(data.updateTime) + '</span>)</div>';
//            angular.forEach(data, function(el, key) {
//
//                if (key != 'type' && key != 'updateTime' && key != 'invalidateTime' && key != 'value' && // these are internal values
//                        key != 'capabilitiesNames') { // these make the dialog monstrious
//                    html += getCmdData(el, key, space + '&nbsp;&nbsp;&nbsp;&nbsp;');
//                }
//            });
//            return html;
//        };
        // Get data
        //var html = getCmdData(interviewData, '/', '');
        var html = deviceService.configGetCommandClass(interviewData, '/', '');
        /*if(updateTime){
         html += '<p class="help-block"><em>' + $filter('dateFromUnix')(updateTime )+ '<em></p>';
         }*/


        // Fill modal with data
        $(target).on('shown.bs.modal', function() {
            $(target + ' .modal-body').html(html);
        });
    };
});