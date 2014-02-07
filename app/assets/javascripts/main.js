$(function() {


  // load page if it exists
  loadPageFirst();

  // in place editing
  $('.block_name').editable({
    success: function(response, newValue) {
      var id = $(this).attr('id').split('-')[1];
      $.ajax({
        type: 'PUT',
        url: '/blocks/' + id,
        data: JSON.stringify({ 'name': newValue }),
        dataType: 'json',
        contentType: 'application/json',
        success: function() {
          location.reload();
        }
      });
    }
  });

  // apply exised block
  dragAndResizeBlock($('.newdiv'));

  // next step to block
  applyNextStepToBlock();

  // bind block
  bindSideBarBlockLink();

  // block
  block_editor();

  function block_editor() {
    $('.editor').boxer({
      // when stop drawing
      stop: function(event, ui) {

        // generate block object when finish drawing
        var block = {
          'name': 'block' + $('.newdiv').length,
          'width': ui.box.width(),
          'height': ui.box.height(),
          'left': ui.box.offset().left,
          'top': ui.box.offset().top,
          'space_id': $('#space_number').val()
        }

        // storage to database
        $.ajax({
          type: 'POST',
          url: '/blocks',
          data: JSON.stringify(block),
          dataType: 'json',
          contentType: 'application/json',
          success: function(data) {
            location.reload();
          }
        });
      }
    });
  }

  function dragAndResizeBlock(block) {

    block.resizable({

      stop: function(event, ui) {

        var $this = $(this);

        var block = {
          'width': ui.size.width,
          'height' : ui.size.height
        }

        $.ajax({
          type: 'PUT',
          url: '/blocks/' + $this.attr('id').split('-')[1],
          data: JSON.stringify(block),
          dataType: 'json',
          contentType: 'application/json'
        });
      }
    }).draggable({
      containment: 'parent',
      scroll: true,
      stop: function(event, ui) {

        var $this = $(this);

        var block = {
          'left': ui.position.left,
          'top' : ui.position.top
        }

        $.ajax({
          type: 'PUT',
          url: '/blocks/' + $this.attr('id').split('-')[1],
          data: JSON.stringify(block),
          dataType: 'json',
          contentType: 'application/json'
        });
      }
    });
  } // drag and resize block

  function applyNextStepToBlock() {
    // edit block ajax
    $('.block_edit').click(function() {

      // fetch the parent id
      var id = $(this).parent().attr('id').split('-')[1];
      var name = $('#block_name-' + id).text();

      // and the block type
      sessionStorage.setItem('block_type', $(this).parent().data('blocktype'));

      // hight light the sidebar li
      $('#block_ul-' + id).css({ 'color': 'red' });
      $('.father_ul').css({ 'color': 'black' });
      if($('#block_ul-' + id).siblings().hasClass('open')) {
        $('#block_ul-' + id).siblings().removeClass('open');
        $('#block_ul-' + id).siblings().addClass('closed');
        $('#block_ul-' + id).siblings().children().slideUp('fast');
      }

      $('#block_ul-' + id).removeClass('closed');
      $('#block_ul-' + id).addClass('open');
      $('#block_ul-' + id).children().slideDown('fast');


      // if it has something
      if($('#block_ul-' + id).find('ul').length > 0) {

        $('.selection_panel').remove();
        $('.editor').remove();
        $('.newdiv').remove();


        if ($('.father_reader').length == 0) {
          $('.sidebar').after('<div class="father_reader"></div>');
        };

        $('.father_reader').load('/blocks/' + id);



      } else {

        // storage it in order to get parent_id
        sessionStorage.setItem('parent_id', id);
        sessionStorage.setItem('parent_name', name);

        // decisions
        $('.selection_panel').remove();
        $('.editor').remove();
        $('.newdiv').remove();

        if ($('.selection_panel').length == 0) {
          $('.sidebar').after('<div class="selection_panel"></div>');
        };

        $('.selection_panel').load('/pages/decision');

        $('.grandpa_ul').click(function() {

          var id = $(this).attr('id').split('-')[1];
          $('.selection_panel').remove();

          if ($('.father_reader').length == 0) {
            $('.sidebar').after('<div class="father_reader"></div>');
          };

          $('.father_reader').load('/blocks/' + id);

        });
      }


    });
  } // applyNextStepToBlock

  function bindSideBarBlockLink() {



    $('.sidebar').find('.grandpa_ul').click(function() {

      if($(this).siblings().hasClass('open')) {
        $(this).siblings().removeClass('open');
        $(this).siblings().addClass('closed');
        $(this).siblings().children().slideUp('fast');
      }

      $(this).removeClass('closed');
      $(this).addClass('open');
      $(this).children().slideDown('fast');




      $('.grandpa_ul').css({ 'color': 'black' });


      $('.selection_panel').remove();
      $('.father_reader').remove();
      $('.editor').remove();
      $('.newdiv').remove();

      var id = $(this).attr('id').split('-')[1];





      if ($('.father_reader').length == 0) {
        $('.sidebar').after('<div class="father_reader"></div>');
      };

      $('.father_reader').load('/blocks/' + id);

      $('#block_ul-' + id).css({ 'color': 'red' });
      $('.father_ul').css({ 'color': 'black' });





    });

    $('.sidebar').find('.father_ul').click(function() {
      $('.selection_panel').remove();
      $('.father_reader').remove();
      $('.editor').remove();
      $('.newdiv').remove();

      // $('.grandpa').unbind();

      var father_id = $(this).attr('id').split('-')[1];
      console.log(father_id);



      if ($('.father_reader').length == 0) {
        $('.sidebar').after('<div class="father_reader"></div>');
      };

      $('.father_reader').load('/blocks/' + father_id);
    });



  } // bindSideBarBlockLink

  function loadPageFirst() {
    var redirectPage = sessionStorage.getItem('redirectPage');

    if(redirectPage) {

      $('.selection_panel').remove();
      $('.father_reader').remove();
      $('.editor').remove();
      $('.newdiv').remove();

      if($('.father_reader').length == 0) {
        $('.sidebar').after('<div class="father_reader"></div>');
      };
      $('.father_reader').load('/blocks/' + redirectPage);

      // high light
      $('#block_ul-' + redirectPage).removeClass('closed');
      $('#block_ul-' + redirectPage).addClass('open');
      $('#block_ul-' + redirectPage).css({ 'color': 'red' });
      $('.father_ul').css({ 'color': 'black' });
      sessionStorage.clear();
    }

  }

}); // document ready