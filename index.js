'use strict'

var ext  = require('object-assign')
var fs   = require('fs')
var path = require('path')
var parsePug = require('./parse-pug')
var pug = require('pug')

module.exports = function (themeopts) {
  // set theme options object
  themeopts = Object(themeopts)

  // set theme logo
  themeopts.logo = themeopts.logo || 'images/mdcss-logo.png'

  // set theme title
  themeopts.title = themeopts.title || 'Style Guide'

  // set theme css
  themeopts.css = themeopts.css || ['style.css']

  // set theme css
  themeopts.js = themeopts.js || []

  // set example conf
  themeopts.examples = ext({
    base: '',
    target: '_self',
    css: ['style.css'],
    js: [],
    bodyjs: [],
    htmlcss: 'background:none;border:0;clip:auto;display:block;height:auto;margin:0;' +
      'padding:0;position:static;width:auto;overflow:hidden',
    bodycss: 'background:none;border:0;clip:auto;display:block;height:auto;margin:0;' +
      'padding:16px;position:static;width:auto;overflow:hidden'
  }, themeopts.examples)

  // return theme
  return function (docs) {
    // set assets directory and template
    docs.assets   = path.join(__dirname, 'assets')
    docs.template = path.join(__dirname, 'template.pug')

    // set theme options
    docs.themeopts = themeopts

    // return promise
    return new Promise(function (resolve, reject) {
      // read template
      fs.readFile(docs.template, 'utf8', function (error, contents) {
        // throw if template could not be read
        if (error) {
          reject(error)
        } else {
          // set examples options
          docs.opts = ext({}, docs.opts, docs.themeopts)

          docs.list.forEach(parsePug)

          // set compiled template
          docs.template = pug.compile(contents, {})(docs)

          // resolve docs
          resolve(docs)
        }
      })
    })
  }
}

module.exports.type = 'mdcss-theme'
