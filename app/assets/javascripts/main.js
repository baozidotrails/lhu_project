$(function() {

  $('#ground_selecton').click(function() {
    sessionStorage.setItem('now_status', 0);
  });

  $('#floor_selecton').click(function() {
    sessionStorage.setItem('now_status', 1);
  });

  $('#next_step').click(function() {
    $('.editor').fadeIn();
    alert(block_last_id);
  });


  // block
  $('.editor').boxer({
    // when stop drawing
    stop: function(event, ui) {

      // add a class
      ui.box.addClass('newdiv');


      // add css
      ui.box.css({ 'border': '1px solid #3f3f3f', 'background': '#f2f2f2' });

      // nameing
      ui.box.append('block' + $('.newdiv').length);

      // block tools
      initBlock(ui.box);

      // block object
      var block = {
        'name': 'block' + $('.newdiv').length,
        'width': ui.box.width(),
        'height': ui.box.height(),
        'left': ui.box.offset().left,
        'top': ui.box.offset().top
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
          sessionStorage.setItem('block-' + data.id, JSON.stringify(block));

        },
        error: function() {
          alert('oh no.');
        }
      });


      // resizable and draggable
      ui.box.resizable({
        stop: function(event, ui) {
          // get new width
          var width = ui.size.width;

          // get new height
          var height = ui.size.height;

          // get block id
          var id = $(this).attr('id');

          // get block datas and name to newData
          var newData = JSON.parse(sessionStorage.getItem(id));

          // set width
          newData.width = width;

          // set height
          newData.height = height;

          // update the block
          sessionStorage.setItem(id, JSON.stringify(newData));

          $.ajax({
            type: 'PUT',
            url: '/blocks/' + $(this).attr('id').split('-')[1],
            data: sessionStorage.getItem(id),
            dataType: 'json',
            contentType: 'application/json',
          });



        }
      }).draggable({
        stop: function(event, ui) {
          // get new width
          var left = ui.position.left;

          // get new height
          var top = ui.position.top;

          // get block id
          var id = $(this).attr('id');

          // get block datas and name to newData
          var newData = JSON.parse(sessionStorage.getItem(id));

          // set width
          newData.left = left;

          // set height
          newData.top = top;

          // update the block
          sessionStorage.setItem(id, JSON.stringify(newData));

          $.ajax({
            type: 'PUT',
            url: '/blocks/' + $(this).attr('id').split('-')[1],
            data: sessionStorage.getItem(id),
            dataType: 'json',
            contentType: 'application/json',
          });

        }
      });
    }
  });

  function initBlock(block) {
    block.append('<span class="block_close">&times;</span>');
    block.append('<i class="fa fa-pencil-square-o block_edit"></i>');
    block.find('.block_close').click(function() {
      var target = $(this).parent().attr('id').split('-')[1];
      if(confirm('確定要刪除？')) {
        $.ajax({
          type: 'DELETE',
          url: '/blocks/' + target,

          success: function() {
            $('#block-' + target).remove();
          }
        });
      }
    });

  }

  $('#view').click(function() {
    console.log(sessionStorage);
  });

  $('#next').click(function() {
    $.ajax({
      type: 'POST',
      url: '/blocks/',
      data: JSON.stringify(),
      contentType: 'application/json',
      dataType: 'json',

      error: function() {
        alert('plz..');
      }
    });
  });

  $('#clear').click(function() {
    $('.editor').find('div').remove();
    sessionStorage.clear();
  });
});