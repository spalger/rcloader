var RcLoader = require('../');
var fs = require('fs');
var _ = require('lodash');
require('should');

var fixtures = {
  root: __dirname + '/fixtures/foo/foo/foo/foo/',
  json: __dirname + '/fixtures/foo/bar.json',
  text: __dirname + '/fixtures/foo/foo/.baz',
  jshintrc: JSON.parse(fs.readFileSync(__dirname + '/.jshintrc')),
  barJson: {
    baz: 'bog'
  }
};

describe('RcLoader', function () {
  it('loads a config file relative to another file', function () {
    var loader = new RcLoader('bar.json');
    loader.for(fixtures.root).should.eql(fixtures.barJson);
  });

  it('passes the constructors third arg to RcFinder', function () {
    var count = 0;
    var loader = new RcLoader('bar.json', null, {
      loader: function (path) {
        count ++;
        return JSON.parse(fs.readFileSync(path));
      }
    });
    loader.for(fixtures.root);
    count.should.eql(1);
  });

  it('merges in specified default values', function () {
    var loader = new RcLoader('.baz', { from: 'defaults' });
    loader.for(fixtures.root).should.eql({
      baz: 'poop',
      from: 'defaults'
    });
  });

  it('accepts a string which disables lookup and always responds with it\'s contents', function () {
    var loader = new RcLoader('.jshintrc', fixtures.json);
    loader.for(__filename).should.eql(fixtures.barJson);
  });

  it('does not lookup files when { lookup: false }', function (done) {
    var loader = new RcLoader('bar.json', { lookup: false }, {
      loader: function () {
        throw new Error('should not have been called');
      }
    });
    loader.for(fixtures.root, function (err, opts) {
      opts.should.eql({});
      done();
    });
  });

  it('accepts a path at { defaultFile: "..." }', function (done) {
    var loader = new RcLoader('bar.json', { defaultFile: __dirname + '/.jshintrc' });
    var count = 0;
    loader.for(fixtures.root, function (err, opts) {
      count.should.eql(1);
      opts.should.eql(_.merge({}, fixtures.jshintrc, fixtures.barJson));
      done();
    });
    count ++;
  });
});