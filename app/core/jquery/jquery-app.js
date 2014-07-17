/**
 * Common app functions
 * author Martin Vach
 */

///////////////////////////////// Works /////////////////////////////////
$(function() {
     /*** Expert commands **/
    // Set/Remove disabled on next text input
    $(document).on('click', '.commands-data-chbx', function() {
        $('.commands-data-txt-chbx').attr('disabled',true);
       $(this).next('input.commands-data-txt-chbx').attr('disabled',false);
       //$(this).attr('checked') ? alert('Checked') : alert('Unchecked');
        return;
    });
    /*** Lock **/
    // Change status for lock buttons
    $(document).on('click', '.lock-controll .btn', function() {
        var parent = $(this).closest('tr').attr('id');
        $('#' + parent + ' .btn').removeClass('active');
        $(this).addClass('active');
    });

    /*** Network management **/
    // Change status for lock buttons
//    $(document).on('click', '.btn-exincl', function() {
//        $('.btn-exincl i').remove();
//        var txt = $(this).html();
//        $(this).children().html('<i class="fa fa-spinner fa-spin fa-lg"></i>');
//        setTimeout(function() {
//            $('.btn-exincl i').remove();
//            $('.message-container').html('<div class="alert alert-danger">' + txt + ': The text message</div>');
//
//        }, 3000);
//    });
});