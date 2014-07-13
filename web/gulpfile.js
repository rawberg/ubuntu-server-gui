var gulp = require('gulp'),
    gulp_util = require('gulp-util'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    less = require('less'),
    path = require('path'),
    fs = require('fs'),
    app_meta = require('./package.json');

function _vagrant_destroy(cb) {
    var vagrant_process = exec('vagrant destroy -f', {cwd: '../vagrant/'+gulp_util.env.distro.trim()+''});
    vagrant_process.stdout.pipe(process.stdout);
    cb();
}

gulp.task('less-dev', function () {
    var less_process = exec('lessc main.less ../stylesheets/main.css', {cwd: process.cwd() + '/css/less'});
    less_process.stdout.pipe(process.stdout);
    less_process.stderr.pipe(process.stderr);
});

gulp.task('_vagrant-distro-check', function(cb) {
    if(gulp_util.env.distro === '' || typeof gulp_util.env.distro === 'undefined') {
        cb('distro flag required (--distro [lucid, precise, quantal, raring, saucy, trusty])');
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

gulp.task('vagrant-fixture-data', ['vagrant-up'], function(cb) {
    var vbox_id_filepath = '../vagrant/'+gulp_util.env.distro.trim()+'/.vagrant/machines/default/virtualbox/id';
    gulp_util.env.fixtures = {servers: [], active_vm: {}};
    gulp_util.env.fixtures.active_vm['vbox_id'] = fs.readFileSync(vbox_id_filepath, {encoding: 'utf8'}).trim();

    var vbox_ipfetcher = 'VBoxManage guestproperty get ' + gulp_util.env.fixtures.active_vm['vbox_id'] + ' "/VirtualBox/GuestInfo/Net/1/V4/IP"';

    exec('vagrant ssh-config', {cwd: '../vagrant/'+gulp_util.env.distro.trim()+''}, function(error, stdout, stderr) {
        var output = stdout.split('\n'),
            host = output[1].trim().split(' ')[1],
            user = output[2].trim().split(' ')[1],
            port = output[3].trim().split(' ')[1],
            sshkey = output[7].trim().split(' ')[1];

        gulp_util.env.fixtures.servers.push({name: 'Test Server', ipv4: host, username: user, port: port, keyPath: sshkey});

        // need to wait a few seconds for eth1 to be assigned a public ip
        setTimeout(function() {
            exec(vbox_ipfetcher, {cwd: '../vagrant/'+gulp_util.env.distro.trim()+''}, function(error, stdout, stderr) {
                if(stdout != 'No value set!\n') {
                    gulp_util.env.fixtures.active_vm['public_ip'] = stdout.split('\n')[0].split(':', 2)[1].trim();
                    cb();
                } else {
                    cb('<-- could not retrieve vm public ip address -->');
                }
            });
        }, 4000);
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

gulp.task('_integration-runner', ['vagrant-fixture-data'], function(cb) {
    if(gulp_util.env.fixtures) {
        fs.writeFileSync('tests/fixtures/dynamic_fixtures.json', JSON.stringify(gulp_util.env.fixtures));
    }

    // rename __package.json file to bring it into play - TODO: find a better solution
    try {
        fs.renameSync('../desktop/osx/__package.json', '../desktop/osx/package.json')
    } catch(e) {
        console.log('could not rename __package.json - continuing anywway');
    }

        var integration_tests = exec('node_modules/nightwatch/bin/nightwatch --env default --config tests/app-integration/settings.json');
        var timer = setTimeout(function() {
            integration_tests.kill();
            console.log('integration tests timed out, forcing shutdown..');
            try {
                fs.renameSync('../desktop/osx/package.json', '../desktop/osx/__package.json')
            } catch(e) {
                console.log('could not rename __pakage.json: ', e);
            }
            cb();
        }, 120000);

        integration_tests.stdout.on('data', function (data) {
            process.stdout.write(data);
            if(/^TEST|total assertions/.test(data)) {
                clearTimeout(timer);
                console.log('integration tests complete!');
                try {
                    fs.renameSync('../desktop/osx/package.json', '../desktop/osx/__package.json')
                } catch(e) {
                    console.log('could not rename __pakage.json: ', e);
                }
                cb();
            }
        });
});

gulp.task('_node-runner', ['vagrant-ssh-config'], function(cb) {
    if(gulp_util.env.hosts.length > 0) {
        fs.writeFileSync('tests/fixtures/dynamic_fixtures.json', JSON.stringify(gulp_util.env.hosts));
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

gulp.task('_prepare-osx', function() {
    var releases_dir = '../../releases_osx/';

    // copy over node-webkit.app directory
    gulp.src(releases_dir + 'usg-node-webkit/node-webkit.app/**')
        .pipe(gulp.dest(releases_dir + app_meta.version + '/USG.app'));

    var dist_glob = [
            'app/**',
            'css/**',
            'libs/**',
            'node_modules/**',
            'package.json',
            'index.html',
            'favicon.ico',
            'USG.icns'
    ];

    // remove dev dependencies
    for(dep in app_meta.devDependencies) {
        dist_glob.push('!node_modules/' + dep, '!node_modules/' + dep + '/**');
    }

    return gulp.src(dist_glob, {base: './'})
        .pipe(gulp.dest('../../releases_osx/' + app_meta.version + '/USG.app/Contents/Resources/app.nw'));
});

gulp.task('_compress-osx', ['_prepare-osx'], function() {
    var zip_runner = exec('zip -r ' + app_meta.version + '.nw ' + app_meta.version, {cwd: '../../releases_osx/'});
    zip_runner.stdout.pipe(process.stdout);
    zip_runner.stderr.pipe(process.stderr);
});

gulp.task('watch', function() {
    gulp.watch('css/less/**/*.less', ['less-dev']);
});


gulp.task('app-unit', ['_unit-runner']);
gulp.task('app-node', ['_node-runner', 'node-vagrant-destroy']);
gulp.task('app-integration', ['_integration-runner', 'integration-vagrant-destroy']);

gulp.task('package-osx', ['_prepare-osx']);