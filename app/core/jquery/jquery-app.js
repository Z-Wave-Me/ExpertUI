/**
 * Common app functions
 * author Martin Vach
 */

if (typeof Object.create !== 'function') {
    Object.create = function(obj) {
        function F() {
        }
        ;
        F.prototype = obj;
        return new F();
    };
}

///////////////////////////////// Plugin begin /////////////////////////////////
;
(function($, window, document, undefined) {

    /**
     * Increase/decrease a value in the container from the spinner selector
     *
     * @param {array} options
     * @returns {void}
     */
    $.fn.appRangeSpinner = function(options) {
        // Options.
        var opt = $.extend({}, $.fn.appRangeSpinner.defaults, options);
        $(document).on('click', opt.selector, function(e) {
            var obj = $(this);
            // Values from data attributes
            var direction = obj.attr('data-spinner-direction');
            var max = parseInt(obj.attr('data-spinner-max'));
            var min = parseInt(obj.attr('data-spinner-min'));
            var scale = parseInt(obj.attr('data-spinner-scale'));

            // Value target
            var target = opt.target;

            //Get parent
            var parent = obj.closest(opt.parent);
            var target_value = parseInt(parent.find(target).text());

            // Count value
            var result = (direction === '+' ? target_value + scale : target_value - scale);
            if (result <= min || result >= max) {
                result = target_value;
            }
            parent.find(target).text(result);
        });


    };

    // Public appRangeSpinner defaults
    $.fn.appRangeSpinner.defaults = {
        selector: '.spinner-selector',
        parent: 'tr',
        target: '.spinner-target'
    };

    /**
     * Display spinner on button
     * 
     * @todo Remove it - functionality is in Angular
     *
     * @param {array} options
     * @returns {void}
     */
    $.fn.appButtonSpinner = function(options) {
        // Options.
        var opt = $.extend({}, $.fn.appButtonSpinner.defaults, options);
//        $(document).on('click', opt.selector, function(e) {
//            var obj = $(this);
//            obj.attr('disabled',true);
//            var target = obj.next(opt.target);
//            $(target).show();
//            setTimeout(function() {
//                $(target).fadeOut();
//                 obj.removeAttr('disabled');
//            }, 3000);
//        });


    };

    // Public appButtonSpinner defaults
    $.fn.appButtonSpinner.defaults = {
        selector: '.btn-spinner',
        target: '.fa-spinner'
    };

})(jQuery, window, document);

///////////////////////////////// Works /////////////////////////////////
$(function() {
    /*** Lock **/
    // Change status for lock buttons
    $(document).on('click', '.lock-controll .btn', function() {
        var parent = $(this).closest('tr').attr('id');
        $('#' + parent + ' .btn').removeClass('active');
        $(this).addClass('active');
    });

    $('.body').appRangeSpinner();
    //$('.body').appButtonSpinner();

    /*** Network management **/
    // Change status for lock buttons
    $(document).on('click', '.btn-exincl', function() {
        $('.btn-exincl i').remove();
        var txt = $(this).html();
        $(this).children().html('<i class="fa fa-spinner fa-spin fa-lg"></i>');
        setTimeout(function() {
            $('.btn-exincl i').remove();
            $('.message-container').html('<div class="alert alert-danger">' + txt + ': The text message</div>');

        }, 3000);
    });
});