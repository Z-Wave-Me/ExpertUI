/**
 * Common app functions
 * author Martin Vach
 */

///////////////////////////////// Works /////////////////////////////////
$(function() {
     /*** Expert commands **/
    // Set/Remove disabled on next text input
    $(document).on('click', '.form_commands .commands-data-chbx,#form_config .commands-data-chbx', function() {
//        if($(this).hasClass('commands-data-chbx-hastxt')){
//             $(this).attr('disabled',true);
//        }else{
//            $(this).parent('.form-group').find('.commands-data-chbx-hastxt').attr('disabled',false);
//        }
        
       $(this).parent('.form-group').find('.commands-data-txt-chbx').attr('disabled',true);
        $(this).siblings('.commands-data-txt-chbx').attr('disabled',false);
    });
    
     /*** Spinner **/
    $(document).on('click', '.spin-true', function() {
       $(this).find('.fa-spin').show();
    });
    /*** Lock **/
    // Change status for lock buttons
    $(document).on('click', '.lock-controll .btn', function() {
        var parent = $(this).closest('tr').attr('id');
        $('#' + parent + ' .btn').removeClass('active');
        $(this).addClass('active');
    });
});