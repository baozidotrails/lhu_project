$(function() {

  // apply exised block
  dragAndResizeBlock($('.newdiv'));

  // block
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

          // set ID to current finished div
          ui.box.attr('id', 'block-' + data.id);

          // block tools
          initBlock(ui.box, ui.box.attr('id').split('-')[1]);

          // resizable and draggable at beginning
          dragAndResizeBlock(ui.box);

          // add li
          $('.space_children').append('<li>' + data.name + '</li>');


        }
      });

    }
  }); // boxer

  function initBlock(block, id) {
    // add class
    block.addClass('newdiv');

    // css
    block.css({ 'border': '1px solid #3f3f3f', 'background': '#f2f2f2' });

    // naming
    block.append('block' + ($('.newdiv').length - 1));

    // delete block
    block.append('<a class="block_close" data-confirm="確定要刪除？" data-method="delete" href="/blocks/' + id + '" rel="nofollow">×</a>');

    // edit block
    block.append('<i class="fa fa-pencil-square-o block_edit"></i>');



  } // initBlock

  function dragAndResizeBlock(block) {

    // edit block ajax
    $('.block_edit').click(function() {
      var id = $(this).parent().attr('id').split('-')[1];
      sessionStorage.setItem('parent_id', id);
      $('.block_selection').load('/blocks/' + id);
    });

    block.resizable({
      containment: 'parent',
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
  } // dran and resize block
}); // document ready