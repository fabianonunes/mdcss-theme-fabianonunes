'use strict'

var $    = require('cheerio')
var jade = require('jade')

module.exports = function parseJade(obj) {

  if (obj.children) {

    obj.children.forEach(function (child) {

      var $content = $('<div>' + child.content + '</div>')

      $content.find('pre').each(function () {
        $('<div class="codecollapse">···</div>').insertAfter($(this))
      })

      $content.find('code[class="lang-example:jade"]').each(function (i, code) {
        var $code = $(code)
        var template = jade.compile($code.text(), { pretty: '  ' })
        $code.text(template().trim())
        $code.attr('class', 'lang-example:html')
      })

      if ($content.length) {
        child.content = $content.html()
      }

      if (child.children) {
        parseJade(child)
      }

    })

  }

}
