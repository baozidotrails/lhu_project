jQuery ->
  new AvatarCropper()

class AvatarCropper
  constructor: ->
    $('#cropbox').Jcrop

      onSelect: @update
      onChange: @update

  update: (coords) =>
    $('#space_crop_x').val(coords.x)
    $('#space_crop_y').val(coords.y)
    $('#space_crop_w').val(coords.w)
    $('#space_crop_h').val(coords.h)
