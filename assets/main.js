// jshint browser:true

'use strict'

var $ = require('jquery')
var Prism = require('prismjs')
var examples = require('./examples')
var Draggabilly = require('draggabilly')

document.addEventListener('DOMContentLoaded', function () {

  $('pre code[class^="lang"]').each(function () {
    var $this = $(this)
    var $pre = $this.closest('pre')
    var $wrap = $('figure').insertBefore($pre)
    var conf = {}
    var text = $this.text()

    $this.attr('class').replace(/^lang-(\w+)(?::(\w+))?/, function ($0, $1, $2) {
      if ($2) {
        return 'example:' + $2 + ',lang:' + $2
      }

      if ($1 === 'example') {
        return 'example:html'
      }

      return 'lang:' + $1
    }).split(/\s*,\s*/).forEach(function (opt) {
      opt = opt.split(':')
      conf[opt.shift().trim()] = opt.join(':').trim()
    })

    $this.removeAttr('class')
    $wrap.append($pre)

    if (conf.lang in Prism.languages) {
      $this.html(Prism.highlight(text, Prism.languages[conf.lang]))
    }

    // conditionally create code examples
    if (conf.example in examples.lang) {
      examples.lang[conf.example]($pre, text, conf)

      if (!(conf.lang in Prism.languages)) {
        $pre.remove()
      }
    }

  })

  $('.codecollapse').on('click', function () {
    $(this).prev('figure').find('pre').toggle()
  })

  $('.responsive-bar').on('click', 'img', function () {
    var $this = $(this)
    $this.closest('.iframe-wrapper').width($this.data('width'))
  })

  $('.drag-handler').each(function () {

    var $dragHandler = $(this)

    var draggie = new Draggabilly(this, {
      axis: 'x'
    })

    draggie.on('pointerDown', function () {
      var $container = $dragHandler.closest('.iframe-wrapper')
      var $mask = $container.find('.drag-mask')
      var containerWidth = $container.width()

      $mask.show()
      $container.addClass('is-dragging')
      $dragHandler
        .css({ left: containerWidth - $dragHandler.outerWidth() })
        .data('container', $container)
        .data('mask', $mask)
        .data('container-width', containerWidth)
    })
    .on('dragMove', function (evt, pointer, vector) {
      $dragHandler.data('container').width(
        $dragHandler.data('container-width') + vector.x
      )
    })
    .on('dragEnd', function () {
      $dragHandler.data('container').removeClass('is-dragging')
      $dragHandler.removeAttr('style').data('mask').hide()
    })

  })

})
