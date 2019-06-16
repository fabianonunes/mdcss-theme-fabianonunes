/* global examples */

'use strict'

var $ = require('jquery')
var colorsUtils = require('./colors-utils')

var templates = {
  wrapper: require('./templates/wrapper.pug'),
  iframe: require('./templates/iframe.pug')
}

var uniqueId = (function () {
  var stash = {}
  return function (preffix) {
    if (!(preffix in stash)) {
      stash[preffix] = []
    }

    return preffix +  '_' + stash[preffix].push(1)
  }
})()

module.exports.lang = {

  color: function ($pre, value) {
    var $colors = $('<div/>').insertBefore($pre)
    var lines = value.trim().split(/\n+/)

    $colors.addClass('colors')

    lines
      .map(colorsUtils.parseLine)
      .map(colorsUtils.parseColor)
      .forEach(function ($color) {
        $colors.append($color)
      })
  },

  html: function ($pre, value, conf, sectionId) {

    conf.iframeId = uniqueId(sectionId)

    var $wrap = $(templates.wrapper(conf)).insertBefore($pre)

    var $iframe = $wrap.find('iframe')
    var iwin = $iframe[0].contentWindow
    var idoc = iwin.document

    iwin._containerIframe = $iframe

    idoc.open()
    idoc.write(templates.iframe({
      examples: examples,
      value: value
    }))
    idoc.close()

  }
}
