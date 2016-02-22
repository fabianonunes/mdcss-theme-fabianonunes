// jshint browser:true

'use strict'

var $ = require('jquery')
var Draggabilly = require('draggabilly')

module.exports = function () {

  $('.codecollapse').on('click', function () {
    $(this).prev('pre').toggle()
  })

  $('.responsive-bar').on('click', 'img', function () {
    var $this = $(this)
    $this.closest('.iframe-wrapper').width($this.data('width'))
  })

  var $masks = $('.drag-mask')

  $('.drag-handler').each(function () {

    var $dragHandler = $(this)

    var draggie = new Draggabilly(this, {
      axis: 'x'
    })

    draggie.on('pointerDown', function () {
      var $container = $dragHandler.closest('.iframe-wrapper')
      var containerWidth = $container.width()

      // show all masks to prevent mouse losing focus on passing over other iframes
      $masks.show()

      $container.addClass('is-dragging')
      $dragHandler
        .css({ left: containerWidth })
        .data('container', $container)
        .data('container-width', containerWidth)
    })
    .on('dragMove', function (evt, pointer, vector) {
      $dragHandler.data('container').width(
        $dragHandler.data('container-width') + vector.x
      )
    })
    .on('dragEnd', function () {
      $masks.hide()
      $dragHandler.removeAttr('style')
      $dragHandler.data('container').removeClass('is-dragging')
    })
    .on('staticClick', function () {
      this.emitEvent('dragEnd')
    })

  })

}
