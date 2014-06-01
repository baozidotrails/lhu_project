// block info in the detailize
$(function() {
  $('.block_info').click(function() {
    var id = $(this).closest('.block-show').attr('id').split('-')[1];



    $('.sidebar_grandpa_name').css({ 'color': '#bfbfbf' });
    $('#block_ul-' + id).css({ 'color': '#f68590' });

    $('.blocks_display').remove();
    $('.show_sidebar').after('<div class="blocks_display tmp_display"></div>');

    $('.tmp_display').load('/blocks/' + id + '/blockinfo');
  });
});