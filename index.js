var ejs  = require('ejs');
var ext  = require('object-assign');
var fs   = require('fs');
var path = require('path');
var $    = require('cheerio');
var jade = require('jade');

module.exports = function (themeopts) {
	// set theme options object
	themeopts = Object(themeopts);

	// set theme logo
	themeopts.logo = themeopts.logo || 'mdcss-logo.png';

	// set theme title
	themeopts.title = themeopts.title || 'Style Guide';

	// set theme css
	themeopts.css = themeopts.css || ['style.css'];

	// set theme css
	themeopts.js = themeopts.js || [];

	// set example conf
	themeopts.examples = ext({
		base:    '',
		target:  '_self',
		css:     ['style.css'],
		js:      [],
		bodyjs:  [],
		htmlcss: 'background:none;border:0;clip:auto;display:block;height:auto;margin:0;padding:0;position:static;width:auto;overflow:hidden',
		bodycss: 'background:none;border:0;clip:auto;display:block;height:auto;margin:0;padding:16px;position:static;width:auto;overflow:hidden'
	}, themeopts.examples);


	// return theme
	return function (docs) {
		// set assets directory and template
		docs.assets   = path.join(__dirname, 'assets');
		docs.template = path.join(__dirname, 'template.ejs');

		// set theme options
		docs.themeopts = themeopts;

		// return promise
		return new Promise(function (resolve, reject) {
			// read template
			fs.readFile(docs.template, 'utf8', function (error, contents) {
				// throw if template could not be read
				if (error) reject(error);
				else {
					// set examples options
					docs.opts = ext({}, docs.opts, docs.themeopts);

					docs.list.forEach(function (obj) {

						if (obj.children) {

							obj.children.forEach(function (child) {

								var $content = $('<div id="_wrapper_">' + child.content + '</div>');

								$content.find("pre").each(function () {
									$('<div class="codecollapse">···</div>').insertAfter($(this))
								})

								var content = $content.find("code[class='lang-example:jade']").each(function (i, code) {
									var $code = $(code);
									var jadestring = $.parseHTML($code.text())[0].data;
									var template = jade.compile($code.text(), {pretty: '  '});
									$code.text(template().trim());
									$code.attr('class', 'lang-example:html');
								});

								if ($content.length) {
									child.content = $content.html();
								}

							});

						}
					});

					// set compiled template
					docs.template = ejs.compile(contents)(docs);

					// resolve docs
					resolve(docs);
				}
			});
		});
	};
};

module.exports.type = 'mdcss-theme';
