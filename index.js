var debug = require('debug')('metalsmith-fingerpint-patch');
var cheerio = require('cheerio');

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

    for (let file in files) {
      // parse only builded html files
      if (!file.endsWith('.html')) {
        continue;
      }

      debug('processing', file);

      let $ = cheerio.load(files[file].contents.toString());
      for (var fingerprint in fingerprints) {
        for (var attr in knownAttrs) {
          $(`[${knownAttrs[attr]}="/${fingerprint}"]`)
            .attr(knownAttrs[attr], `/${fingerprints[fingerprint]}`);
        }
      }

      files[file].contents = $.html();
    }

    setImmediate(done);
  };
};
