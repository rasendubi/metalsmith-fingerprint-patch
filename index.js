var debug = require('debug')('metalsmith-fingerprint-patch');
var cheerio = require('cheerio');
var srcset = require('srcset');

var knownAttrs = [
  'href',
  'src',
];

module.exports = (options) => {

  return (files, metalsmith, done) => {
    var fingerprints = metalsmith.metadata().fingerprint;
    if (!fingerprints) {
      return done(new Error('fingerprint-patch: no fingerprinted files found. Have you used this plugin after metalsmith-fingerprint?'));
    }

    debug(fingerprints);

    const patchUrl = (url) => {
      const candidate = fingerprints[url.substring(1)];
      return candidate ? '/' + candidate : url;
    };

    for (let path in files) {
      // parse only builded html files
      if (!path.endsWith('.html')) {
        continue;
      }

      debug('processing', path);

      let $ = cheerio.load(files[path].contents.toString());

      // patch known attrs
      for (var fingerprint in fingerprints) {
        for (var attr in knownAttrs) {
          $(`[${knownAttrs[attr]}="/${fingerprint}"]`)
            .attr(knownAttrs[attr], `/${fingerprints[fingerprint]}`);
        }
      }

      // patch srcset
      $('img').each(function(i, elem) {
        const srcs = $(this).attr('srcset');
        if (srcs) {
          debug('-> patching srcset', srcs);
          const newSrcs = srcset.stringify(srcset.parse(srcs).map((item) => {
            return {
              ...item,
              url: patchUrl(item.url),
            };
          }));
          debug('-> result srcset', newSrcs);
          $(this).attr('srcset', newSrcs);
        }
      });

      files[path].contents = $.html();
    }

    setImmediate(done);
  };
};
