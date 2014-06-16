define(['underscore',
        'App',
        'models/Server',
        'collections/ServerList',
        'models/ServerConnection'], function (
        _,
        App,
        Server,
        ServerList,
        ServerConnection) {

    var fs = require('fs'),
        StringDecoder = require('string_decoder').StringDecoder;


    describe('ServerConnection - sshProxy', function() {
        var server, serversCollection, serverConnection;
        var connectionStatusSpy, appVentConnectSpy, appVentDisconnectSpy;

        beforeEach(function(done) {
//            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            connectionStatusSpy = jasmine.createSpy();
            appVentConnectSpy = jasmine.createSpy();
            appVentDisconnectSpy = jasmine.createSpy();
            App.vent.on('server:connected', appVentConnectSpy);
            App.vent.on('server:disconnected', appVentDisconnectSpy);

            serversCollection = new ServerList();
            serversCollection.fetch({success: function() {
                server = serversCollection.at(0);
                serverConnection = new ServerConnection({}, {server: server});
                serverConnection.on('change:connection_status', connectionStatusSpy);
                done();
            }});
        });

        afterEach(function(done) {
            if(serverConnection.sftpProxy) {
                serverConnection.sftpProxy.end();
            }
            if(serverConnection.sshProxy && serverConnection.sshProxy._state !== 'closed') {
                serverConnection.sshProxy.end();
            }
            done();
        });

        it('connects via ssh key', function(done) {
            expect(appVentConnectSpy).not.toHaveBeenCalled();
            expect(connectionStatusSpy).not.toHaveBeenCalled();
            serverConnection.initiateLocalProxy(function() {
                expect(appVentConnectSpy.calls.count()).toBe(1);
                expect(connectionStatusSpy.calls.argsFor(0)[1]).toBe('connected');
                done();
            });
        });

        it('connects via ssh username/password', function(done) {
            var attributes = _.clone(serverConnection.attributes);
            serverConnection.server.attributes['keyPath'] = null;
            serverConnection.attributes['ssh_password'] = "vagrant";

            expect(appVentConnectSpy).not.toHaveBeenCalled();
            expect(connectionStatusSpy).not.toHaveBeenCalled();
            serverConnection.connect(function() {
                try {
                    expect(appVentConnectSpy.calls.count()).toBe(1);
                    expect(connectionStatusSpy.calls.argsFor(1)[1]).toBe('connected');
                    done();
                } catch(e) {
                    done();
                }
            });
        });

        it("sets connection_status to 'password required' when there's no key and password is empty", function(done) {
            serverConnection.server.attributes['keyPath'] = null;

            expect(appVentConnectSpy).not.toHaveBeenCalled();
            expect(connectionStatusSpy).not.toHaveBeenCalled();
            serverConnection.connect(function() {
                try {
                    expect(connectionStatusSpy.calls.argsFor(1)[1]).toBe('password required');
                    expect(appVentConnectSpy).not.toHaveBeenCalled();
                    done();
                } catch(e) {
                    done();
                }
            });
        });

        it("sets connection_status to 'ssh key error' when ssh key path is invalid", function(done) {
            expect(appVentConnectSpy).not.toHaveBeenCalled();
            expect(connectionStatusSpy).not.toHaveBeenCalled();

            serverConnection.server.attributes['keyPath'] = '/some/wrong/path';
            serverConnection.initiateLocalProxy(function() {
                expect(connectionStatusSpy.calls.argsFor(0)[1]).toBe('ssh key error');
                done();
            });
        });

        it("sets connection_status to 'connect error' when connection fails", function(done) {
            expect(appVentConnectSpy).not.toHaveBeenCalled();
            expect(connectionStatusSpy).not.toHaveBeenCalled();

            fs.writeFileSync('/tmp/bogus.key', '');
            serverConnection.server.attributes['keyPath'] = '/tmp/bogus.key';
            serverConnection.initiateLocalProxy(function() {
                expect(connectionStatusSpy.calls.argsFor(0)[1]).toBe('connection error');
            });
            try {
                fs.unlinkSync('/tmp/bogus.key');
                done();
            } catch(e) {
                done();
            }
        });

        it('triggers server:disconnected App event when ssh connection is disconnected', function(done) {
            expect(connectionStatusSpy).not.toHaveBeenCalled();
            serverConnection.initiateLocalProxy(function() {
                serverConnection.sshProxy.on('end', function() {
                    expect(appVentDisconnectSpy).toHaveBeenCalled();
                    done();
                });
                serverConnection.disconnect();
            });
        });

    });

    describe('ServerConnection - sftpConnection', function() {

        describe('opendir', function() {
            var server, serverConnection;

            beforeEach(function(done) {
                var serversCollection = new ServerList();
                serversCollection.fetch({success: function() {
                    server = serversCollection.at(0);
                    serverConnection = new ServerConnection({}, {server: server});
                    serverConnection.initiateLocalProxy(function() {
                        done();
                    });
                }});
            });

            it('reads the contents of a directory', function(done) {
                server.sftpProxy.opendir("/", function(err, buffer) {
                    expect(err).toBeUndefined();
                    server.sftpProxy.readdir(buffer, function(err, list) {
                        expect(list.length).toBeGreaterThan(0);
                        done();
                    });
               });
            });
        });


        describe('readStream', function() {
            var server, serversCollection, serverConnection;
            var showModalSpy;

            beforeEach(function(done) {
                showModalSpy = jasmine.createSpy('showModalSpy');
                App.commands.setHandler('modal:show', showModalSpy);

                serversCollection = new ServerList();
                serversCollection.fetch({success: function() {
                    server = serversCollection.at(0);
                    serverConnection = new ServerConnection({}, {server: server});
                    serverConnection.initiateLocalProxy(function() {
                        done();
                    });
                }});
            });

            afterEach(function(done) {
                App.commands.removeHandler(showModalSpy);
                done();
            });

            it('reads a remote file', function(done) {
                expect(server.connection).toBeDefined();
                server.connection.readStream('/etc/hostname', function(err, fileContents) {
                    expect(err).toBeUndefined();
                    expect(fileContents).toMatch(/lucid|trusy|precise/);
                    done();
                });
            });

            it('displays an error modal when the file doesn\'t exist', function(done) {
                server.connection.readStream('/etc/doesnotexist', function(err, fileContents) {
                    expect(err).toBeDefined();
                    expect(showModalSpy).toHaveBeenCalled();
                    expect(showModalSpy.calls.count()).toBe(1);
                    (showModalSpy.calls.argsFor(0)[0].options).should.have.keys(['errorMsg', 'filePath']);
                    done();
                });
            });

            it('displays an error modal when user has insufficient file permissions', function(done) {
                server.connection.readStream('/etc/sudoers', function(err, fileContents) {
                    expect(err).toBeDefined();
                    expect(showModalSpy).toHaveBeenCalled();
                    expect(showModalSpy.calls.count()).toBe(1);
                    (showModalSpy.calls.argsFor(0)[0].options).should.have.keys(['errorMsg', 'filePath']);
                    done();
                });
            });
        });


        describe('writeStream', function() {
            var server, serversCollection, serverConnection;
            var showModalSpy;

            beforeEach(function(done) {
                showModalSpy = jasmine.createSpy('showModalSpy');
                App.commands.setHandler('modal:show', showModalSpy);

                serversCollection = new ServerList();
                serversCollection.fetch({success: function() {
                    server = serversCollection.at(0);
                    serverConnection = new ServerConnection({}, {server: server});
                    serverConnection.initiateLocalProxy(function() {
                        done();
                    });
                }});
            });

            afterEach(function() {
                App.commands.removeHandler(showModalSpy);
            });

            it('writes a new remote file', function(done) {
                var testFilePath = '/tmp/test_write_new_file.txt';

                server.connection.writeStream(testFilePath, 'hello file', {flags: 'w'}, function() {
                    server.sftpProxy.stat(testFilePath, function(err, stats) {
                        expect(err).toBeUndefined();
                        expect(stats.size).toBe(10);
                        server.sftpProxy.unlink(testFilePath, function() {
                            done();
                        })
                    });
                });
            });

            it('displays an error modal when the user has insufficient write permissions', function(done) {
                var testFilePath = '/tmp/test_unwriteable_file.txt';

                server.connection.writeStream(testFilePath, 'unwritable', {flags: 'w'}, function(err) {
                    expect(err).toBeUndefined();
                    expect(showModalSpy).not.toHaveBeenCalled();

                    server.sftpProxy.chmod(testFilePath, 0444, function(err) {
                        expect(err).toBeUndefined();
                        server.connection.writeStream(testFilePath, 'new content', {}, function(err) {
                            expect(showModalSpy).toHaveBeenCalled();
                            (showModalSpy.calls.argsFor(0)[0].options).should.have.keys(['errorMsg', 'filePath']);
                            server.sftpProxy.unlink(testFilePath, function(err) {
                                expect(err).toBeUndefined();
                                done();
                            });
                        });
                    });
                });
            });

            it('updates the contents of an existing file', function(done) {
                var testFilePath = '/tmp/test_file_to_update.txt';

                server.connection.writeStream(testFilePath, 're-write my contents', function(err) {
                    expect(err).toBeUndefined();
                    server.sftpProxy.stat(testFilePath, function(err, stats) {
                        expect(err).toBeUndefined();

                        server.connection.writeStream(testFilePath, 'new stuff', function(err) {
                            expect(err).toBeUndefined();

                            server.connection.readStream(testFilePath, function(err, fileContents) {
                                expect(err).toBeUndefined();
                                expect(fileContents).toEqual('new stuff');

                                server.sftpProxy.unlink(testFilePath, function (err) {
                                    expect(err).toBeUndefined();
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });

    });

});