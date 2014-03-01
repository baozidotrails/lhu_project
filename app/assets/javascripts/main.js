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

  boxer($('.editor'));






  // --------------------------------------------------

  function boxer(obj) {
    var beginX, beginY, endX, endY, width, height;

    $(obj).selectable({

      start: function(e) {
        var posX = $(this).position().left, posY = $(this).position().top;

        beginX = e.pageX - posX;
        beginY = e.pageY - posY;

      },

      stop: function(e) {
        var posX = $(this).offset().left, posY = $(this).offset().top;

        endX = e.pageX - posX;
        endY = e.pageY - posY;

        if(beginX > endX) { var tmp = beginX; beginX = endX; endX = tmp; }
        if(beginY > endY) { var tmp = beginY; beginY = endY; endY = tmp; }

        width = endX - beginX;
        height = endY - beginY;



        // generate block object when finish drawing
        var block = {
          'name': 'block',
          'width': width,
          'height': height,
          'left': beginX,
          'top': beginY,
          'space_id': $('#space_number').val()
        };

        console.log('begin ' + beginX + ',' + beginY);
        console.log('end ' + endX + ',' + endY);
        console.log(block);



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
        };

        $.ajax({
          type: 'PUT',
          url: '/blocks/' + $this.attr('id').split('-')[1],
          data: JSON.stringify(block),
          dataType: 'json',
          contentType: 'application/json'
        });
      }
    }).draggable({

      opacity: 0.35,
      stop: function(event, ui) {

        var $this = $(this);

        var block = {
          'left': ui.position.left,
          'top' : ui.position.top
        };

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

  // for space show action
  function applyNextStepToBlock() {
    // when click the edit icon
    $('.block_edit').click(function() {

      // fetch current status
      var id = $(this).parent().attr('id').split('-')[1];
      var name = $('#block_name-' + id).text();

      // in order to hide the logic button
      sessionStorage.setItem('block_type', $(this).parent().data('blocktype'));

        // in order to bind the sidebar
      sessionStorage.setItem('parent_id', id);

      // in order to chain name into new element
      sessionStorage.setItem('parent_name', name);

      // hight light the sidebar li
      $('#block_ul-' + id).css({ 'color': 'red' });
      $('.sidebar_father_name').css({ 'color': 'black' });

      // menu controller
      if($('#block_ul-' + id).parent().siblings('ul').hasClass('open')) {
        $('#block_ul-' + id).parent().siblings('ul').addClass('closed').removeClass('open');
        $('#block_ul-' + id).parent().siblings('ul').find('.father_holder').slideUp('fast');
      }

      $('#block_ul-' + id).parent().addClass('open')
                      .removeClass('closed')
                      .find('.father_holder').slideDown('fast');




      if($('#block_ul-' + id).closest('ul').find('ul').length > 0) {

        $('.selection_panel').remove();
        $('.tmp_reader').remove();
        $('.editor').remove();
        $('.newdiv').remove();


        if ($('.editor').length == 0) {
          $('.sidebar').after('<div class="editor"></div>');
        }

        $('.editor').load('/blocks/' + id + '/edit', function() {

          // 體育館例子
          if (sessionStorage.getItem('is_drawing')) {
            dragAndResizeBlock($('.newdiv'));
            $(this).boxer({
              stop: function(event, ui) {
                var block = {
                  'name': 'block',
                  'width': ui.box.width(),
                  'height': ui.box.height(),
                  'left': ui.box.offset().left,
                  'top': ui.box.offset().top,
                  'parent_id': sessionStorage.getItem('parent_id')
                };

                // storage to database
                $.ajax({
                  type: 'POST',
                  url: '/blocks',
                  data: JSON.stringify(block),
                  dataType: 'json',
                  contentType: 'application/json',
                  success: function(data) {


                    sessionStorage.setItem('redirectPage', sessionStorage.getItem('parent_id'));
                    sessionStorage.setItem('is_drawing', true);
                    location.reload();
                  }
                });
              }
            });
          };
        });



      } else {
        // decision

        // storage it in order to get parent_id
        sessionStorage.setItem('parent_id', id);
        sessionStorage.setItem('parent_name', name);

        // decisions
        $('.selection_panel').remove();
        $('.tmp_reader').remove();
        $('.editor').remove();
        $('.newdiv').remove();

        if ($('.selection_panel').length == 0) {
          $('.sidebar').after('<div class="selection_panel"></div>');
        };

        $('.selection_panel').load('/pages/decision');
      }


    });
  } // applyNextStepToBlock

  function bindSideBarBlockLink() {

    // hide father and child
    $('ul.closed').find('.father_holder, .sidebar_child_name').hide();

    $('.sidebar').find('.sidebar_grandpa_name').click(function() {


      // menu controler
      if($(this).parent().siblings('ul').hasClass('open')) {
        $(this).parent().siblings('ul').addClass('closed').removeClass('open');
        $(this).parent().siblings('ul').find('.father_holder').slideUp('fast');
      }



      $(this).closest('ul').addClass('open')
                      .removeClass('closed')
                      .find('.father_holder').slideDown('fast');


      // remove other readers
      $('.selection_panel').remove();
      $('.tmp_reader').remove();
      $('.editor').remove();
      $('.newdiv').remove();

      // fetch current status
      var id = $(this).attr('id').split('-')[1];
      var name = $(this).text();

      // storage
      sessionStorage.setItem('parent_id', id);
      sessionStorage.setItem('parent_name', name)


      if($('.newdiv').length > 0) {
        sessionStorage.setItem('is_drawing', true);
      } else {
        sessionStorage.removeItem('is_drawing');
      }

      // if no father reader
      if ($('.editor').length == 0) {
        $('.sidebar').after('<div class="editor"></div>');
      };

      // load father
      $('.editor').load('/blocks/' + id + '/edit', function() {
        if (sessionStorage.getItem('is_drawing')) {
          dragAndResizeBlock($('.newdiv'));
          $(this).boxer({
            stop: function(event, ui) {
              var block = {
                'name': 'block',
                'width': ui.box.width(),
                'height': ui.box.height(),
                'left': ui.box.offset().left,
                'top': ui.box.offset().top,
                'parent_id': sessionStorage.getItem('parent_id')
              };

              // storage to database
              $.ajax({
                type: 'POST',
                url: '/blocks',
                data: JSON.stringify(block),
                dataType: 'json',
                contentType: 'application/json',
                success: function(data) {

                  sessionStorage.setItem('redirectPage', sessionStorage.getItem('parent_id'));
                  sessionStorage.setItem('is_drawing', true);
                  location.reload();
                }
              });
            }
          });
        };
      });

      // hightlight
      $('.sidebar_grandpa_name').css({ 'color': 'black' });
      $('.sidebar_father_name').css({ 'color': 'black' });
      $(this).css({ 'color': 'red' });
    });


    // ex: click floor
    $('.sidebar').find('.sidebar_father_name').click(function() {

      // menu controller
      if($(this).closest('ul').siblings('ul').hasClass('open')) {
        $(this).closest('ul').siblings('ul').addClass('closed').removeClass('open');
        $(this).closest('ul').siblings('ul').find('.sidebar_child_name').slideUp('fast');
      }

      $(this).closest('ul').addClass('open')
                           .removeClass('closed')
                           .find('.sidebar_child_name').slideDown('fast');

      // remove other readers
      $('.selection_panel').remove();
      $('.tmp_reader').remove();
      $('.editor').remove();
      $('.newdiv').remove();

      // fetch current status
      var id = $(this).attr('id').split('-')[1];
      var name = $(this).text();

      // storage
      sessionStorage.setItem('parent_id', id);
      sessionStorage.setItem('parent_name', name)

      if($('.newdiv').length > 0) {
        sessionStorage.setItem('is_drawing', true);
      } else {
        sessionStorage.removeItem('is_drawing');
      }


      // if no editor then put one
      if ($('.editor').length == 0) {
        $('.sidebar').after('<div class="editor"></div>');
      };

      // then load the block show page
      $('.editor').load('/blocks/' + id + '/edit', function() {
        if (sessionStorage.getItem('is_drawing')) {
          dragAndResizeBlock($('.newdiv'));
          $(this).boxer({
            stop: function(event, ui) {
              var block = {
                'name': 'block',
                'width': ui.box.width(),
                'height': ui.box.height(),
                'left': ui.box.offset().left,
                'top': ui.box.offset().top,
                'parent_id': sessionStorage.getItem('parent_id')
              };

              // storage to database
              $.ajax({
                type: 'POST',
                url: '/blocks',
                data: JSON.stringify(block),
                dataType: 'json',
                contentType: 'application/json',
                success: function(data) {


                  sessionStorage.setItem('redirectPage', sessionStorage.getItem('parent_id'));
                  sessionStorage.setItem('is_drawing', true);
                  location.reload();
                }
              });
            }
          });
        };
      });

      // hightlight
      $('.sidebar_father_name').css({ 'color': 'black' });

      $(this).css({ 'color': 'blue' });
    });
  } // bindSideBarBlockLink



  function loadPageFirst() {
    var redirectPage = sessionStorage.getItem('redirectPage');

    if(redirectPage) {

      $('.selection_panel').remove();
      $('.tmp_reader').remove();
      $('.editor').remove();
      $('.newdiv').remove();



      // highlight sidebar
      $('#block_ul-' + redirectPage).closest('ul')
                                                  .removeClass('closed')
                                                  .addClass('open')
                                                  .end()
                                                  .css({ 'color': 'red' });

      // grandpa highlight
      $('#block_fa-' + redirectPage).closest('.father_holder').siblings('.sidebar_grandpa_name').css({ 'color': 'red' }).closest('ul').removeClass('closed').addClass('open');

      // father highlight
      $('#block_fa-' + redirectPage).closest('.father_holder').removeClass('closed').addClass('open');
      $('#block_fa-' + redirectPage).css({ 'color': 'blue' });


      if(sessionStorage.getItem('is_drawing')) {

        if($('.editor').length == 0) {
          $('.sidebar').after('<div class="editor"></div>');
        }

        $('.editor').load('/blocks/' + redirectPage + '/edit', function() {


          dragAndResizeBlock($('.editor').find('.newdiv'));
          $(this).boxer({
            stop: function(event, ui) {
              var block = {
                'name': 'block',
                'width': ui.box.width(),
                'height': ui.box.height(),
                'left': ui.box.offset().left,
                'top': ui.box.offset().top,
                'parent_id': sessionStorage.getItem('parent_id')
              };

              // storage to database
              $.ajax({
                type: 'POST',
                url: '/blocks',
                data: JSON.stringify(block),
                dataType: 'json',
                contentType: 'application/json',
                success: function(data) {


                  sessionStorage.setItem('redirectPage', sessionStorage.getItem('parent_id'));
                  sessionStorage.setItem('is_drawing', true);
                  location.reload();
                }
              });
            }
          });
        });
      } else {
        if($('.tmp_reader').length == 0) {
          $('.sidebar').after('<div class="tmp_reader"></div>');
          $('.tmp_reader').load('/blocks/' + redirectPage + '/edit');
        }
      }



      // $('.sidebar_father_name').css({ 'color': 'black' });
      sessionStorage.removeItem('redirectPage');
    }

  }

}); // document ready