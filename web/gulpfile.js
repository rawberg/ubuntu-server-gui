var gulp = require('gulp'),
    gulp_util = require('gulp-util'),
    exec = require('child_process').exec,
    fs = require('fs');

function _vagrant_destroy(cb) {
    var vagrant_process = exec('vagrant destroy -f', {cwd: '../vagrant/'+gulp_util.env.distro.trim()+''});
    vagrant_process.stdout.pipe(process.stdout);
    cb();
}

gulp.task('_vagrant-distro-check', function(cb) {
    if(gulp_util.env.distro === '' || typeof gulp_util.env.distro === 'undefined') {
        cb('distro flag required (--distro lucid)');
    } else {
        console.log('distro selected: ', gulp_util.env.distro);
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
        var output = stdout.split('\n'),
            host = output[1].trim().split(' ')[1],
            user = output[2].trim().split(' ')[1],
            port = output[3].trim().split(' ')[1],
            sshkey = output[7].trim().split(' ')[1];

        gulp_util.env.hosts.push({name: 'Test Server', ipv4: host, username: user, port: port, keyPath: sshkey});
        cb();
    });
});

gulp.task('vagrant-destroy', ['_vagrant-distro-check'], function(cb) {
    _vagrant_destroy(cb);
});

gulp.task('integration-vagrant-destroy', ['_integration-runner'], function(cb) {
    _vagrant_destroy(cb);
});

gulp.task('node-vagrant-destroy', ['_node-runner'], function(cb) {
    _vagrant_destroy(cb);
});

gulp.task('_integration-runner', ['vagrant-ssh-config'], function(cb) {
    if(gulp_util.env.hosts.length > 0) {
        fs.writeFileSync('tests/app-integration/dynamic_fixtures.json', JSON.stringify(gulp_util.env.hosts));
    }

    // rename __package.json file to bring it into play - TODO: find a better solution
    fs.renameSync('../desktop/osx/__package.json', '../desktop/osx/package.json')

    var selenium_server = exec('selenium-server -Dwebdriver.chrome.driver=../desktop/osx/chromedriver2_server');

    selenium_server.stdout.on('data', function (data) {
        process.stdout.write(data);

        if(/SocketListener/.test(data)) {
            var integration_tests = exec('node_modules/mocha/bin/mocha -t 15000 -R spec tests/app-integration/.');
            var timer = setTimeout(function() {
                integration_tests.kill();
                selenium_server.kill();
                fs.renameSync('../desktop/osx/package.json', '../desktop/osx/__package.json')
                cb();
            }, 90000);

            integration_tests.stdout.on('data', function (data) {
                process.stdout.write(data);
                if(/passing/.test(data)) {
                    clearTimeout(timer);
                    integration_tests.kill();
                    selenium_server.kill();
                    fs.renameSync('../desktop/osx/package.json', '../desktop/osx/__package.json')
                    cb();
                }
            });
        }
    });
});

gulp.task('_node-runner', ['vagrant-ssh-config'], function(cb) {
    if(gulp_util.env.hosts.length > 0) {
        fs.writeFileSync('tests/app-node/dynamic_fixtures.json', JSON.stringify(gulp_util.env.hosts));
    }

    var nodetests = exec('../desktop/osx/node-webkit.app/Contents/MacOS/node-webkit tests/app-node/');
    var timer = setTimeout(function() {
        nodetests.kill();
        cb();
    }, 90000);

    nodetests.stdout.on('data', function (data) {
        process.stdout.write(data);

        if(/seconds\n$/.test(data)) {
            clearTimeout(timer);
            nodetests.kill();
            cb();
        }
    });
});

gulp.task('_unit-runner', function() {
    var unittests = exec('../desktop/osx/node-webkit.app/Contents/MacOS/node-webkit tests/app-unit/');
    var timer = setTimeout(function() {
        unittests.kill();
    }, 90000);

    unittests.stdout.on('data', function (data) {
        process.stdout.write(data);

        if(/seconds/g.test(data)) {
            clearTimeout(timer);
            unittests.kill();
        }
    });
});


gulp.task('app-unit', ['_unit-runner']);
gulp.task('app-node', ['_node-runner', 'node-vagrant-destroy']);
gulp.task('app-integration', ['_integration-runner', 'integration-vagrant-destroy']);