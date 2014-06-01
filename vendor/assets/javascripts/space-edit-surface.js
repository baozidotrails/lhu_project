$(function() {


  $('.delete_block').click(function() {
    sessionStorage.clear();
  });



  loadPageFirst();
  sessionStorage.clear();



  // console.log('-------main.js-------');

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
  // 給新建、最外層、體育館專用
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


        if(!(width == 0) || !(height == 0)) {
          var block = {
            'name': '區塊 ' + ($('.newdiv').length + 1),
            'width': width,
            'height': height,
            'left': beginX,
            'top': beginY,
            'parent_id': $('.editor').data('iam'),
            'space_id': $('.editor').data('spaceid')
          };


          // storage to database
          $.ajax({
            type: 'POST',
            url: '/blocks',
            data: JSON.stringify(block),
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {

              $('<div id="block-'+ data.id +'" class="newdiv" data-blocktype="'+ data.block_type +'" style="position: absolute; width: '+ data.width +'px; height: '+ data.height +'px; left: '+ data.left +'px; top: '+ data.top +'px;"> <span class="namename"><span class="best_in_place ui-selectee" id="best_in_place_block_'+ data.id +'_name" data-url="/blocks/'+ data.id +'" data-object="block" data-attribute="name" data-type="input">'+data.name+'</span></span> <a class="block_close" data-method="delete" href="/blocks/' + data.id + '" rel="nofollow">×</a> <i class="fa fa-cog block_edit"></i> <div style="position: absolute; bottom: 1%; left: 1%;"><select name="colorpicker" data-block="'+data.id+'"><option value="'+data.color+'"></option><option value="#7bd148">Green</option><option value="#5484ed">Bold blue</option><option value="#a4bdfc">Blue</option><option value="#46d6db">Turquoise</option><option value="#7ae7bf">Light green</option><option value="#fbd75b">Yellow</option><option value="#ffb878">Orange</option><option value="#ff887c">Red</option><option value="#dbadff">Purple</option><option value="#efefef">Gray</option></select></div> </div>').draggable({
                  snap: true,
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

              $('select[name="colorpicker"]').simplecolorpicker({
                picker: true
              }).on('change', function() {
                var thisblock = $(this).data('block');
                var color = $(this).val();
                $('#block-' + thisblock).css('background-color', color);
                $.ajax({
                  type: 'PUT',
                  url: '/blocks/' + thisblock,
                  data: JSON.stringify( { 'color': color } ),
                  dataType: 'json',
                  contentType: 'application/json'
                });
              });

              // 側邊選單加入
              if($('.editor').data('blocktype') == 2) {

                // alert("樓層" + data.parent_id);

                $('.fa-cog').remove();


                if($('#block_fa-' + data.parent_id).siblings('.sidebar_child_name').length > 0) {
                  $('<li class="sidebar_child_name" id="block_ch-' + data.id + '" data-blocktype="0" style="display: list-item; color: #000;">'+ data.name +'</li>').insertAfter($('#block_fa-' + data.parent_id).siblings('.sidebar_child_name').last());

                  $('#block_fa-' + data.parent_id).find('li').last().after('<li class="sidebar_child_name" id="block_ch-' + data.id + '" data-blocktype="0" style="display: list-item; color: rgb(0, 0, 0);">'+ data.name +'</li>');
                } else {
                  $('#block_fa-' + data.parent_id).after('<li class="sidebar_child_name" id="block_ch-' + data.id + '" data-blocktype="0" style="display: list-item;">'+ data.name +'</li>');
                }



                $('#block_fa-' + data.parent_id).siblings('.block_qty').text($('#block_fa-' + data.parent_id).siblings('.sidebar_child_name').length);

                // console.log('成功');


                $('.best_in_place').bind("ajax:success", function(event) {
                  var whichBlock = event.currentTarget.id.split('_')[4];
                  var newName = event.currentTarget.innerText;

                  // 側邊選單名稱變更
                  $('#block_ch-' + whichBlock).text(newName);


                });
              } else if($('.editor').data('blocktype') == 3) {

                // alert("體育館");
                $('.fa-cog').remove();

                // $('#block_ul-' + data.parent_id).closest('ul').find('.father_holder, .closed').last().after('<ul class="father_holder closed" style="display: block;"><span class="sidebar_father_name" id="block_fa-' + data.id + '" data-blocktype="0" style="color: black;">block</ul>');


                if($('#block_ul-' + data.parent_id).siblings('.father_holder').length > 0) {
                  $('#block_ul-' + data.parent_id).closest('ul').find('.father_holder, .closed').last().after('<ul class="father_holder closed" style="display: block;"><span class="sidebar_father_name" id="block_fa-' + data.id + '" data-blocktype="0" style="color: black;">'+ data.name +'</ul>');
                } else {
                  $('#block_ul-' + data.parent_id).after('<ul class="father_holder closed" style="display: block;"><span class="sidebar_father_name" id="block_fa-' + data.id + '" data-blocktype="0" style="color: black;">'+ data.name +'</ul>');
                }


                // 移除變動
                $('.block_close').click(function() {
                  var main_block = $('#block-' + data.id);
                  var id = main_block.attr('id').split('-')[1];
                  var parentid = main_block.data('parentid');

                  $.ajax({
                    type: 'DELETE',
                    url: '/blocks/' + id,
                    dataType: 'json',
                    contentType: 'application/json',
                    error: function() {
                      main_block.remove();

                      if(sessionStorage.getItem('parent_type') == 3) {
                        $('#block_fa-' + id).closest('.father_holder').remove();
                        $('#block_fa-' + id).remove();
                        $('#block_ul-' + parentid).siblings('.block_qty').text($('#block_ul-' + parentid).closest('ul').find('ul').length);
                      }


                    }
                  });
                });


                // 新增變動
                $('#block_ul-' + data.parent_id).siblings('.block_qty').text($('#block_ul-' + data.parent_id).closest('ul').find('ul').length);




                  $('.best_in_place').bind("ajax:success", function(event) {

                    var whichBlock = event.currentTarget.id.split('_')[4];
                    var newName = event.currentTarget.innerText;

                    // 側邊選單名稱變更
                    $('#block_fa-' + whichBlock).text(newName);
                });


              } else {

                // alert("主要場地");
                $('<ul class="closed"><span class="sidebar_grandpa_name" id="block_ul-'+ data.id +'" data-blocktype="0" data-spaceid="<%= @space.id %>" >'+ data.name +'</span> </ul>').appendTo('.sidebar');

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
          }); // ajax
        } // 如果寬高是 0
      } // stop
    }); // selectable
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
      snap: true,
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


      // sessionStorage.setItem('pre_page', id);


      // in order to hide the logic button
      sessionStorage.setItem('parent_type', $(this).parent().data('blocktype'));

      sessionStorage.setItem('space_id', $(this).parent().data('spaceid'));

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



      // If target has something and then move to drawing
      if($('#block_ul-' + id).closest('ul').find('ul').length > 0) {

        $('.selection_panel').remove();
        $('.tmp_reader').remove();
        $('.editor').remove();
        $('.newdiv').remove();


        if ($('.editor').length == 0) {
          $('.sidebar').after('<div class="editor" data-iam="' + sessionStorage.getItem('parent_id') + '" data-blocktype="' + sessionStorage.getItem('parent_type') + '"></div>');
          $('.editor').css({ 'height': '72vh' });
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
          $('.selection_panel').css({ 'height': '72vh' });
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
      sessionStorage.setItem('prePage', $(this).data('blocktype'));
      sessionStorage.setItem('space_id', $(this).data('spaceid'));

      sessionStorage.removeItem('is_floor');

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


      if($(this).closest('ul').find('ul').length > 0) {
        // if no father reader
        if ($('.editor').length == 0) {
          $('.sidebar').after('<div class="editor" data-iam="' + sessionStorage.getItem('parent_id') + '" data-blocktype="' + sessionStorage.getItem('parent_type') + '" data-blockid="' + $(this).attr('id') + '"></div>');
        };



        // load father
        $('.editor').load('/blocks/' + id + '/edit', function() {
          if (sessionStorage.getItem('is_drawing')) {
            dragAndResizeBlock($('.newdiv'));
            sessionStorage.setItem('now_block_count', $('#' + $(this).data('blockid')).find('.b_count').text());
            boxer($(this));
          };
        });
      } else {
        if ($('.selection_panel').length == 0) {
          $('.sidebar').after('<div class="selection_panel"></div>');

        };

        $('.selection_panel').load('/pages/decision');
      }



      // hightlight
      $('.sidebar_grandpa_name').css({ 'color': 'black' });
      $('.sidebar_father_name').css({ 'color': 'black' });
      $(this).css({ 'color': 'red' });
    });


    // ex: click floor
    $('.sidebar').find('.sidebar_father_name').click(function() {

      sessionStorage.setItem('parent_type', $(this).data('blocktype'));
      sessionStorage.setItem('is_floor', $(this).data('isfloor'));

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


      // then load the block show page

      if($(this).closest('ul').find('li').length > 0) {

        $('.selection_panel').remove();
        $('.tmp_reader').remove();
        $('.editor').remove();
        $('.newdiv').remove();

        if ($('.editor').length == 0) {
          $('.sidebar').after('<div class="editor" data-iam="' + sessionStorage.getItem('parent_id') + '" data-blocktype="' + sessionStorage.getItem('parent_type') + '" data-blockid="' + $(this).attr('id') + '"></div>');
        };

        $('.editor').load('/blocks/' + id + '/edit', function() {

          if(sessionStorage.getItem('is_drawing')){
            dragAndResizeBlock($(this).find('.newdiv'));
            sessionStorage.setItem('now_block_count', $('#' + $(this).data('blockid')).find('.b_count').text());
            boxer($(this));
          }
        });
      } else {
        $('.selection_panel').remove();
        $('.tmp_reader').remove();
        $('.editor').remove();
        $('.newdiv').remove();

        if ($('.selection_panel').length == 0) {
          $('.sidebar').after('<div class="selection_panel"></div>');
          $('.selection_panel').css({ 'height': '72vh' });
        };

        $('.selection_panel').load('/pages/decision');
      }




      // hightlight
      $('.sidebar_father_name').css({ 'color': 'black' });

      $(this).css({ 'color': 'blue' });
    });
  } // bindSideBarBlockLink



  function loadPageFirst() {
    var prePage = sessionStorage.getItem('pre_page');

    if(prePage) {

      // highlight sidebar
      $('#block_ul-' + prePage).closest('ul')
                                                  .removeClass('closed')
                                                  .addClass('open')
                                                  .end()
                                                  .css({ 'color': 'red' });

      // grandpa highlight
      $('#block_fa-' + prePage).closest('.father_holder').siblings('.sidebar_grandpa_name').css({ 'color': 'red' }).closest('ul').removeClass('closed').addClass('open');

      // father highlight
      $('#block_fa-' + prePage).closest('.father_holder').removeClass('closed').addClass('open');
      $('#block_fa-' + prePage).css({ 'color': 'blue' });



      $('.editor').remove();

      if(sessionStorage.getItem('parent_type') == 1) {
        $('.sidebar').after('<div class="tmp_reader"><div/>');
        $('.tmp_reader').css({ 'height': '72vh' });
        $('.tmp_reader').load('/blocks/' + sessionStorage.getItem('parent_id') + '/edit');
      } else {
         $('.sidebar').after('<div class="editor" data-iam="' + sessionStorage.getItem('parent_id') + '" data-blocktype="' + sessionStorage.getItem('parent_type') + '"><div/>');
        $('.editor').load('/blocks/' + sessionStorage.getItem('parent_id') + '/edit');
      }

    }
  }

}); // document ready