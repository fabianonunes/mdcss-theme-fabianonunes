'use strict'

var $    = require('cheerio')

var parsers = {
  jade: function (template) {
    var pug = require('pug')
    return pug.compile(template, { pretty: '  ' })().trim()
  }
}

module.exports = function parsePug(obj) {

  if (obj.children) {

    obj.children.forEach(function (child) {

      var $content = $('<div>' + child.content + '</div>')

      $content.find('pre').each(function () {
        $('<div class="codecollapse">···</div>').insertAfter($(this))
      })

      $content.find('code[class^="lang-example:"]').each(function () {
        var $code = $(this)
        var lang = $code.attr('class').split(':')[1]
        if (lang in parsers) {
          $code.text(parsers[lang]($code.text()))
          $code.attr('class', 'lang-example:html')
        }
      })

      if ($content.length) {
        child.content = $content.html()
      }

      if (child.children) {
        parsePug(child)
      }

    })

  }

}
