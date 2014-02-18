# rcloader

[![Travis CI](https://travis-ci.org/spenceralger/rcloader.png)](https://travis-ci.org/spenceralger/rcloader)

A helper module for build system plugins that need to fetch .{{app}}rc files themselves.

## Features
  - Find the closest config file (like .jshintrc) relative to the file you are linting
  - User can specify overrides.
  - User can simply disable config file lookup.
  - Allow users to specifiy the file to use explicitely.

## install
```
npm install rcloader
```

## Use
I imagine most people will use this for gulp/grunt plugins.

### within a gulp plugin
```
var RcLoader = require('rcloader');
var map = require('map-stream');

module.exports = function MyGulpPlugin(userOptions) {
  var rcLoader = new RcFinder('.mypluginrc', userOptions);

  return map(function (file, cb) {
    // get the options for this file specifically
    var fileOpts = rcLoader.for(file.path);
    // do something cool
    cb();
  });
};
```

To get the options asynchronously just supply a callback as the second parameter.
```
rcLoader.for(file.path, function (err, fileOpts) {
  // use fileOpts
});
```