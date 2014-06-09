define(function (require_browser) {
    var _ = require_browser('underscore'),
        App = require_browser('App'),
        Server = require_browser('models/Server'),
        ServerList = require_browser('collections/ServerList'),
        ServerConnection = require_browser('models/ServerConnection');

    var fs = require('fs'),
        StringDecoder = require('string_decoder').StringDecoder;


    describe('ServerConnection - Model', function() {

        describe('initiateLocalProxy', function() {
            var server, serversCollection, serverConnection;
            var connectionStatusSpy, appVentConnectSpy, appVentDisconnectSpy;

            beforeEach(function(done) {
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
                if(serverConnection.sshProxy && serverConnection.sshProxy._state !== 'closed') {
                    serverConnection.sshProxy.on('end', function() {
                       done();
                    });
                    try {
                        serverConnection.sshProxy.end();
                    } catch(e) {
                        done();
                    }
                } else {
                    done();
                }
            });

            it('connects via ssh key', function(done) {
                expect(appVentConnectSpy).not.toHaveBeenCalled();
                expect(connectionStatusSpy).not.toHaveBeenCalled();
                serverConnection.initiateLocalProxy(function() {
                    try {
                        expect(appVentConnectSpy.calls.count()).toBe(1);
                        expect(connectionStatusSpy.calls.argsFor(0)[1]).toBe('connected');
                        done();
                    } catch(e) {
                        console.log('catch error: ', e);
                    }
                });
            });

            xit('connects via ssh username/password', function(done) {
                var attributes = _.clone(serverConnection.attributes);
                serverConnection.server.attributes['keyPath'] = null;
                serverConnection.attributes['ssh_password'] = "vagrant";

                expect(appVentConnectSpy).not.toHaveBeenCalled();
                expect(connectionStatusSpy).not.toHaveBeenCalled();
                serverConnection.connect(function() {
                    try {
                        expect(appVentConnectSpy.calls.count()).toBe(1);
                        expect(connectionStatusSpy.calls.argsFor(0)[1]).toBe('connected');
                        done();
                    } catch(e) {
                        console.log('catch error: ', e);
                    }
                });
            });

            xit("sets connection_status to 'password required' when there's no key and password is empty", function(done) {
                serverConnection.server.attributes['keyPath'] = null;

                expect(appVentConnectSpy).not.toHaveBeenCalled();
                expect(connectionStatusSpy).not.toHaveBeenCalled();
                serverConnection.connect(function() {
                    try {
                        expect(connectionStatusSpy.calls.argsFor(0)[1]).toBe('password required');
                        expect(appVentConnectSpy).not.toHaveBeenCalled();
                        done();
                    } catch(e) {
                        console.log('catch error: ', e);
                    }
                });
            });

            it("sets connection_status to 'ssh key error' when ssh key path is invalid", function(done) {
                expect(appVentConnectSpy).not.toHaveBeenCalled();
                expect(connectionStatusSpy).not.toHaveBeenCalled();

                serverConnection.server.attributes['keyPath'] = '/some/wrong/path';
                serverConnection.initiateLocalProxy(function() {
                    try {
                        expect(connectionStatusSpy.calls.argsFor(0)[1]).toBe('ssh key error');
                        done();
                    } catch(e) {
                        console.log('catch error: ', e);
                    }
                });
            });

            xit("sets connection_status to 'connect error' when connection fails", function(done) {
                expect(appVentConnectSpy).not.toHaveBeenCalled();
                expect(connectionStatusSpy).not.toHaveBeenCalled();

                fs.writeFileSync('/tmp/bogus.key', ' ');
                serverConnection.server.attributes['keyPath'] = '/tmp/bogus.key';
                serverConnection.initiateLocalProxy(function() {
                    try {
                        expect(connectionStatusSpy.calls.argsFor(0)[1]).toBe('connection error');
                        fs.unlinkSync('/tmp/bogus.key');
                        done();
                    } catch(e) {
                       fs.unlinkSync('/tmp/bogus.key');
                    }
                });
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

    });

    xdescribe('ServerConnection - sftpConnection', function() {

        describe('readStream', function() {
            var server, serversCollection, serverConnection;
            var showModalSpy;

            beforeEach(function(done) {
                showModalSpy = jasmine.createSpy();
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
                serverConnection.disconnect();
                if(serverConnection.sshProxy && serverConnection.sshProxy._state !== 'closed') {
                    serverConnection.sshProxy.on('end', function() {
                       done();
                    });
                    try {
                        serverConnection.sshProxy.end();
                        done();
                    } catch(e) {
                        console.log(e);
                        done();
                    }
                } else {
                    done();
                }
            });

            it('reads a remote file', function(done) {
                expect(server.connection).toBeDefined();
                server.connection.readStream('/etc/hostname', function(err, fileContents) {
                    expect(err).toBeUndefined();
                    expect(fileContents).toEqual('lucid64\n');
                    done();
                });
            });

            it('displays an error modal when the file doesn\'t exist', function(done) {
                server.connection.readStream('/etc/doesnotexist', function(err, fileContents) {
                    expect(err).toBeDefined();
                    expect(showModalSpy).toHaveBeenCalled();
                    expect(showModalSpy.callCount).toBe(1);
                    expect(showModalSpy.calls.argsFor(0)[0].options).to.have.keys(['errorMsg', 'filePath']);
                    done();
                });
            });

            it('displays an error modal when user has insufficient file permissions', function(done) {
                server.connection.readStream('/etc/sudoers', function(err, fileContents) {
                    expect(err).toBeDefined();
                    expect(showModalSpy).toHaveBeenCalled();
                    expect(showModalSpy.callCount).toBe(1);
                    expect(showModalSpy.calls.argsFor(0)[0].options).to.have.keys(['errorMsg', 'filePath']);
                    done();
                });
            });
        });


        xdescribe('writeStream', function() {
            var server, serversCollection, serverConnection;
            var showModalSpy;

            beforeEach(function(done) {
                showModalSpy = sinon.spy();
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
                    sinon.assert.notCalled(showModalSpy);

                    server.sftpProxy.chmod(testFilePath, 0444, function(err) {
                        expect(err).toBeUndefined();
                        server.connection.writeStream(testFilePath, 'new content', {}, function(err) {
                            sinon.assert.calledOnce(showModalSpy);
                            expect(showModalSpy.args[0][0].options).to.have.keys(['errorMsg', 'filePath']);
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