var grunt = require('grunt'),
    fs = require('fs'),
    path = require('path');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['coffee'] = {
  setUp: function(done) {
    // setup here
    path.exists('tmp/coffee', function(exists) {
      if (exists) {
        fs.rmdir('tmp/coffee', done);
      } else {
        done();
      }
    });
  },
  'helper': function(test) {
    test.expect(2);
    var files = [
      'test/fixtures/hello_world.coffee'
    ];
    var dest = 'tmp/js';
    // tests here
    grunt.helper('coffee', files, dest);
    test.equal(grunt.file.read(dest + '/hello_world.js'),
               '\nconsole.log("Hello CoffeeScript!");\n',
               'it should compile the coffee');

    grunt.helper('coffee', files, dest, { bare:false });
    test.equal(grunt.file.read(dest + '/hello_world.js'),
               '(function() {\n\n  console.log("Hello CoffeeScript!");\n\n}).call(this);\n',
               'it should compile the coffee');

    test.done();
  }
};
