/*
 * grunt-coffee
 * https://github.com/avalade/grunt-coffee
 *
 * Copyright (c) 2012 Aaron D. Valade
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  var path = require('path');

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('coffee', 'Compile CoffeeScript files', function() {
    var dest = this.file.dest,
        options = this.data.options,
        extension = this.data.extension;

    grunt.file.expandFiles(this.file.src).forEach(function(filepath) {
      grunt.helper('coffee', filepath, dest, grunt.utils._.clone(options), extension);
    });

    if (grunt.task.current.errorCount) {
      return false;
    } else {
      return true;
    }
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('coffee', function(src, destPath, options, extension) {
    var coffee = require('coffee-script'),
        js = '';

    options = options || {};
    extension = extension ? extension : '.js';

    if( destPath && options.preserve_dirs ){
      var dirname = path.dirname(src);
      if ( options.base_path ) {
        dirname = dirname.replace(new RegExp('^'+options.base_path), '');
      }
      destPath = path.join(destPath, dirname);
    } else if( !destPath ){
      destPath = path.dirname(src);
    }

    var dest = path.join(destPath, path.basename(src, '.coffee') + extension);
    
    if( options.bare !== false ) {
      options.bare = true;
    }

    try {
      js = coffee.compile(grunt.file.read(src), options);
      grunt.file.write(dest, js);
      return true;
    } catch (e) {
      grunt.log.error("Error in " + src + ":\n" + e);
      return false;
    }
  });

};
