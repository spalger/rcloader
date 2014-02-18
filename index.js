module.exports = RcLoader;

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var RcFinder = require('rcfinder');

function RcLoader(name, userConfig, finderConfig) {
  if (!(this instanceof RcLoader))
    return new RcLoader(name, userConfig, finderConfig);

  if (!name)
    throw new TypeError('Specify a name for your config files');

  var config;

  if (typeof userConfig === 'string') {
    config = {
      defaultFile: userConfig,
      lookup: false
    };
  } else {
    config = _.defaults({}, userConfig || {}, {
      lookup: true
    });
  }

  if (config.defaultFile) {
    _.defaults(config, JSON.parse(fs.readFileSync(config.defaultFile)));
  }

  // setup the finder if we need it
  var finder;
  if (config.lookup) {
    finder = new RcFinder(name, finderConfig);
  }

  // these shouldn't be a part of the final config
  delete config.defaultFile;
  delete config.lookup;

  // get the config for a file
  this.for = function (filename, cb) {
    var sync = typeof cb !== 'function';

    function respond(err, configFile) {
      if (err && !sync) return cb(err);
      configFile = _.assign(configFile || {}, config);

      if (sync) return configFile;
      cb(void 0, configFile);
    }

    if (!finder) {
      if (sync) return respond();
      return process.nextTick(respond);
    }

    if (sync) return respond(null, finder.find(path.dirname(filename)));
    finder.find(path.dirname(filename), respond);
  };

}