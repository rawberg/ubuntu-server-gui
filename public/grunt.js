module.exports = function(grunt) {
    var nodeExec = require('child_process').exec;
    

    // Project configuration.
    grunt.initConfig({
        // Project metadata, used by some directives, helpers and tasks.
        meta: {},
        // Compass config.
        compass: {
          dev: {
            src: 'css/sass',
            dest: 'css/stylesheets',
            images: 'css/images',
            outputstyle: 'expanded',
            linecomments: true,
            relativeassets: true
          },
          prod: {
            src: 'css/sass',
            dest: 'css/stylesheets',
            images: 'css/images',
            outputstyle: 'compressed',
            linecomments: false,
            forcecompile: true,
            relativeassets: true
          }
        },
        // Lists of files to be concatenated, used by the "concat" task.
        concat: {},
        // Lists of files to be linted with JSHint, used by the "lint" task.
        lint: {},
        // Lists of files to be minified with UglifyJS, used by the "min" task.
        min: {
          boot: {
            src: 'js/boot.min.js',
            dest: 'js/boot.min.js'
          }
        },
        shell: {
          coffee_app: {
            command: 'coffee -cbl app/.'
          },
          coffee_spec: {
            command: 'coffee -cb spec/.'
          },
          jasmine_tests: {
            command: 'spec/phantom-jasmine/lib/run_jasmine_test.coffee https://app.ubuntuservergui.dev:8443/spec/SpecRunner.html'
          },
          _options: {
            stdout: true,
            stderr: true,
            timeout: 10
          }
        },
        // Configuration options for the "watch" task.
        watch: {
          compass: {
            files: ['css/sass/*.scss'],
            tasks: ['compass:dev']
          },
          jasmine: {
            files: ['spec/unit/*.js', 'spec/int/*.js'],
            tasks: ['shell:jasmine_tests']
          }
        },
        // Global configuration options for JSHint.
        jshint: {},
        // Global configuration options for UglifyJS.
        uglify: {}
    });

    grunt.registerTask('app-compass', 'Prepare production ready css files from scss sources.', 'compass:prod');
    grunt.registerTask('app-jasmine', 'Run Jasmine tests.', 'shell:jasmine_tests');

    // plugin tasks
    grunt.loadNpmTasks('grunt-compass');
    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-shell');

};
