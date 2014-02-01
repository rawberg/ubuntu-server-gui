var gulp = require('gulp'),
    gulp_util = require('gulp-util'),
    exec = require('child_process').exec,
    fs = require('fs');

gulp.task('_vagrant-distro-check', function(cb) {
    if(gulp_util.env.distro === '' || typeof gulp_util.env.distro === 'undefined') {
        cb('--distro flag required');
    } else {
        // TODO: add more checking
        console.log('distro: ', gulp_util.env.distro);
        cb();
    }
})

gulp.task('vagrant-up', ['_vagrant-distro-check'], function(cb) {
    var vagrant_process = exec('vagrant up', {cwd: '../vagrant/'+gulp_util.env.distro.trim()+''});
    vagrant_process.stdout.pipe(process.stdout);

    vagrant_process.on('exit', function(code) {
        if(code === 0) {
            cb();
        } else {
            cb('^^ vagrant up failed see above ^^');
        }
    });

});

gulp.task('vagrant-ssh-config', ['vagrant-up'], function(cb) {
    gulp_util.env.hosts = [];
    var vagrant_process = exec('vagrant ssh-config', {cwd: '../vagrant/'+gulp_util.env.distro.trim()+''}, function(error, stdout, stderr) {
        var output = stdout.split('\n');
        var host = output[1].trim().split(' ')[1];
        var user = output[2].trim().split(' ')[1];
        var port = output[3].trim().split(' ')[1];
        var sshkey = output[7].trim().split(' ')[1];

        gulp_util.env.hosts.push({name: 'Test Server', ipv4: host, username: user, port: port, sshkey: sshkey});
        cb();
    });
});

gulp.task('vagrant-destroy', ['_vagrant-distro-check'], function(cb) {
    var vagrant_process = exec('vagrant destroy -f', {cwd: '../vagrant/'+gulp_util.env.distro.trim()+''});
    vagrant_process.stdout.pipe(process.stdout);
    cb();
});

gulp.task('app-node', ['vagrant-ssh-config'], function() {
    if(gulp_util.env.hosts.length > 0) {
        fs.writeFileSync('tests/app-node/dynamic_fixtures.json', JSON.stringify(gulp_util.env.hosts));
    }

    var unittests = exec('../desktop/osx/node-webkit.app/Contents/MacOS/node-webkit tests/app-node/');
    unittests.stdout.on('data', function (data) {
        process.stdout.write(data);
        if(/seconds\n$/.test(data)) {
            unittests.kill();
        }
    });
});

gulp.task('app-unit', function() {
    var nodetests = exec('../desktop/osx/node-webkit.app/Contents/MacOS/node-webkit tests/app-unit/');

    nodetests.stdout.on('data', function (data) {
        process.stdout.write(data);
        if(/seconds\n$/.test(data)) {
            nodetests.kill();
        }
    });
});


