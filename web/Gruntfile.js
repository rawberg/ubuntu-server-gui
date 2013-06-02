module.exports = function(grunt) {
    var nodeExec = require('child_process').exec;


    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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

        // Requirejs r.js Opimizer
        requirejs: {
            options: {
                baseUrl: "./app",
                mainConfigFile: "app/Boot.js",
                name: "Boot",
                out: "deployable/app/Boot.js"
            }
        },

        // Shell commands
        shell: {
            deployable: {
                command: [
                    'rm -R -f deployable',
                    'mkdir deployable',
                    'mkdir deployable/app'
                ].join(' && ')
            },
            _options: {
                stdout: true,
                stderr: true,
                timeout: 10,
                failOnError: true
            }
        },

        // Copy commands
        copy: {
            deployable: {
                files: {
                    "deployable/css/stylesheets/": "css/stylesheets/**",
                    "deployable/css/images/": "css/images/**",
                    "deployable/index.html": "index.html",
                    "deployable/css/flatstrap/assets/css/bootstrap.css": "css/flatstrap/assets/css/bootstrap.css",
                    "deployable/css/font-awesome/font/": "css/font-awesome/font/**",
                    "deployable/libs/require/require.min.js": "libs/require/require.min.js"
                }
            }
        },

        // Configuration options for the "watch" task.
        watch: {
            compass: {
                files: ['css/sass/*.scss'],
                tasks: ['compass:dev']
            }
        },
        // Global configuration options for UglifyJS.
        uglify: {}
    });

    grunt.registerTask('build', 'Building optimized application files for production/deployment and output to "deployable" folder', [
        'shell',
        'compass:prod',
        'copy:deployable',
        'requirejs'
    ]);
    grunt.registerTask('app-compass', 'Prepare production ready css files from scss sources.', 'compass:prod');


    // plugin tasks
    grunt.loadNpmTasks('grunt-compass');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

};
