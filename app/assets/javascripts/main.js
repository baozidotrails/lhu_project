$(function() {

  loadPageFirst();
  sessionStorage.clear();


  $('.best_in_place').best_in_place();

  $('.best_in_place').bind("ajax:success", function(event) {
    var whichBlock = event.currentTarget.id.split('_')[4];
    var newName = event.currentTarget.innerText;

    // 側邊選單名稱變更
    $('#block_ul-' + whichBlock).text(newName);

  });

  // 綁定現有的 block
  dragAndResizeBlock($('.newdiv'));


  applyNextStepToBlock();


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

        if(sessionStorage.getItem('parent_id')) {
          block['parent_id'] = sessionStorage.getItem('parent_id');
          delete block['space_id'];
          console.log(block);
        }

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

            // block 畫出來, 移動 and 調整
            $('<div id="block-'+ data.id +'" class="newdiv" data-blocktype="'+ data.block_type +'" style="position: absolute; width: '+ data.width +'px; height: '+ data.height +'px; left: '+ data.left +'px; top: '+ data.top +'px;"><span class="best_in_place ui-selectee" id="best_in_place_block_'+ data.id +'_name" data-url="/blocks/'+ data.id +'" data-object="block" data-attribute="name" data-type="input">block</span><a class="block_close ui-selectee" data-confirm="確定要刪除？" data-method="delete" href="/blocks/'+ data.id +'" rel="nofollow">×</a> <i class="fa fa-pencil-square-o block_edit"></i> </div>').draggable({
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
              }).resizable({
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
              }).appendTo(obj);

              $('.best_in_place').best_in_place();

            // 側邊選單加入
            if(sessionStorage.getItem('parent_id') && sessionStorage.getItem('parent_type') == 2) {

              // alert("樓層");



              $('<li class="sidebar_child_name" id="block_ch-' + data.id + '" data-blocktype="0" style="display: list-item; color: #000;">block</li>').insertAfter($('#block_fa-' + data.parent_id).siblings('.sidebar_child_name').last());


              $('.best_in_place').bind("ajax:success", function(event) {
                var whichBlock = event.currentTarget.id.split('_')[4];
                var newName = event.currentTarget.innerText;

                // 側邊選單名稱變更
                $('#block_ch-' + whichBlock).text(newName);

              });
            } else if(sessionStorage.getItem('parent_id') && sessionStorage.getItem('parent_type') == 0) {

              // alert("體育館");
              $('<ul class="father_holder closed" style="display: block;"><span class="sidebar_father_name" id="block_fa-' + data.id + '" data-blocktype="0">block</span></ul>').appendTo('.open');

                $('.best_in_place').bind("ajax:success", function(event) {

                  var whichBlock = event.currentTarget.id.split('_')[4];
                  var newName = event.currentTarget.innerText;

                  // 側邊選單名稱變更
                  $('#block_fa-' + whichBlock).text(newName);
              });


            } else {

              // alert("主要場地");
              $('<ul class="closed"><span class="sidebar_grandpa_name" id="block_ul-'+ data.id +'">block</span></ul>').appendTo('.sidebar');

              $('.best_in_place').bind("ajax:success", function(event) {

                var whichBlock = event.currentTarget.id.split('_')[4];
                var newName = event.currentTarget.innerText;

                // 側邊選單名稱變更
                $('#block_ul-' + whichBlock).text(newName);
              });
            }

            // 綁定側邊選單
            bindSideBarBlockLink();

            // 綁定修改
            applyNextStepToBlock();

          }
        });

      }
    });
  } // boxer


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

  // 最外層 block_edit
  function applyNextStepToBlock() {
    // when click the edit icon
    $('.block_edit').click(function() {

      // fetch current status
      var id = $(this).parent().attr('id').split('-')[1];
      var name = $('#block_name-' + id).text();

      // in order to hide the logic button
      sessionStorage.setItem('parent_type', $(this).parent().data('blocktype'));

        // in order to bind the sidebar
      sessionStorage.setItem('parent_id', id);

      // in order to chain name into new element
      // sessionStorage.setItem('parent_name', name);

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



      //
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
            boxer($(this));
          };
        });



      } else {
        // decision

        // storage it in order to get parent_id
        sessionStorage.setItem('parent_id', id);
        // sessionStorage.setItem('parent_name', name);

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

      // 設定 global
      sessionStorage.setItem('parent_type', $(this).data('blocktype'));

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
      // sessionStorage.setItem('parent_name', name)


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
          boxer($(this));
        };
      });

      // hightlight
      $('.sidebar_grandpa_name').css({ 'color': 'black' });
      $('.sidebar_father_name').css({ 'color': 'black' });
      $(this).css({ 'color': 'red' });
    });


    // ex: click floor
    $('.sidebar').find('.sidebar_father_name').click(function() {

      sessionStorage.setItem('parent_type', 2);

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
      // sessionStorage.setItem('parent_name', name)

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
          boxer($(this));
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

          if(sessionStorage.getItem('is_drawing')) {
            dragAndResizeBlock($('.editor').find('.newdiv'));
            boxer($(this));
          }

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