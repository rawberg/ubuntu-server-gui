var gulp = require('gulp'),
    exec = require('child_process').exec;

gulp.task('app-unit', function() {
    var unittests = exec('../desktop/osx/node-webkit.app/Contents/MacOS/node-webkit tests/app-unit/', function(error, stdout, stderr) {

    });

    unittests.stdout.on('data', function (data) {
        process.stdout.write(data);
        if(/seconds\n$/.test(data)) {
            unittests.kill();
        }
    });
});

gulp.task('app-node', function() {
    var nodetests = exec('../desktop/osx/node-webkit.app/Contents/MacOS/node-webkit tests/app-node/', function(error, stdout, stderr) {

    });

    nodetests.stdout.on('data', function (data) {
        process.stdout.write(data);
        if(/seconds\n$/.test(data)) {
            nodetests.kill();
        }
    });
});


