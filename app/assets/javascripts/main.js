$(function() {

  for(var i = 0; i < sessionStorage.length; i++) {
    var key = sessionStorage.key(i);
    var value = sessionStorage.getItem(key);
    var block = JSON.parse(value);
    $('body').append('<div class="newdiv" style="width: ' + block.width + 'px; height: ' + block.height + 'px; left: ' + block.left + 'px; top: ' + block.top + 'px">' + block.name + '</div>');
  }

  $('.editor').boxer({
    // when stop drawing
    stop: function(event, ui) {


      // add a class in order to count
      ui.box.addClass('newdiv');

      // count newdiv
      var count = $('.newdiv').length;

      // add css
      ui.box.css({ 'border': '1px solid #3f3f3f', 'background': '#f2f2f2' });

      // identify
      ui.box.attr('id', 'block-' + count);

      // nameing
      ui.box.append('block-' + count);

      // block object
      var block = {
        'name': ui.box.text(),
        'width': ui.box.width(),
        'height': ui.box.height(),
        'left': ui.box.offset().left,
        'top': ui.box.offset().top
      }

      // storage
      sessionStorage.setItem(ui.box.attr('id'), JSON.stringify(block));


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
        }
      });
    }
  });

  function initBlock(block) {
    block.append('test');
  }

  $('#view').click(function() {
    console.log(sessionStorage);
  });

  $('#next').click(function() {
    $.ajax({
      type: 'POST',
      url: '/blocks/',
      data: JSON.stringify(sessionStorage),
      contentType: 'application/json',
      dataType: 'json',

      error: function() {
        alert('fuck');
      }
    });
  });

  $('#clear').click(function() {
    $('.editor').find('div').remove();
    sessionStorage.clear();
  });
});