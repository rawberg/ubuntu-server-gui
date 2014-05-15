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
                connectionStatusSpy = sinon.spy();
                appVentConnectSpy = sinon.spy();
                appVentDisconnectSpy = sinon.spy();
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
                jasmine.getEnv().expect(appVentConnectSpy.called).toBeFalsy();
                jasmine.getEnv().expect(connectionStatusSpy.called).toBeFalsy();
                serverConnection.initiateLocalProxy(function() {
                    try {
                        jasmine.getEnv().expect(appVentConnectSpy.calledOnce).toBeTruthy();
                        // work-around for sinon calledWith being flakey
                        jasmine.getEnv().expect(connectionStatusSpy.args[0][1]).toBe('connected');
                        done();
                    } catch(e) {
                        console.log('catch error: ', e);
                    }
                });
            });

            it('connects via ssh username/password', function(done) {
                var attributes = _.clone(serverConnection.attributes);
                serverConnection.server.attributes['keyPath'] = null;
                serverConnection.attributes['ssh_password'] = 'vagrant';

                jasmine.getEnv().expect(appVentConnectSpy.called).toBeFalsy();
                jasmine.getEnv().expect(connectionStatusSpy.called).toBeFalsy();
                serverConnection.connect(function() {
                    try {
                        jasmine.getEnv().expect(appVentConnectSpy.calledOnce).toBeTruthy();
                        // work-around for sinon calledWith being flakey
                        jasmine.getEnv().expect(connectionStatusSpy.args[1][1]).toBe('connected');
                        done();
                    } catch(e) {
                        console.log('catch error: ', e);
                    }
                });
            });

            it("sets connection_status to 'password required' when there's no key and password is empty", function(done) {
                serverConnection.server.attributes['keyPath'] = null;

                jasmine.getEnv().expect(appVentConnectSpy.called).toBeFalsy();
                jasmine.getEnv().expect(connectionStatusSpy.called).toBeFalsy();
                serverConnection.connect(function() {
                    try {
                        jasmine.getEnv().expect(connectionStatusSpy.args[1][1]).toBe('password required');
                        jasmine.getEnv().expect(appVentConnectSpy.calledOnce).toBeFalsy();
                        done();
                    } catch(e) {
                        console.log('catch error: ', e);
                    }
                });
            });

            it("sets connection_status to 'ssh key error' when ssh key path is invalid", function(done) {
                jasmine.getEnv().expect(appVentConnectSpy.called).toBeFalsy();
                jasmine.getEnv().expect(connectionStatusSpy.called).toBeFalsy();

                serverConnection.server.attributes['keyPath'] = '/some/wrong/path';
                serverConnection.initiateLocalProxy(function() {
                    try {
                        jasmine.getEnv().expect(connectionStatusSpy.args[0][1]).toBe('ssh key error');
                        done();
                    } catch(e) {
                        console.log('catch error: ', e);
                    }
                });
            });

            it("sets connection_status to 'connect error' when connection fails", function(done) {
                jasmine.getEnv().expect(appVentConnectSpy.called).toBeFalsy();
                jasmine.getEnv().expect(connectionStatusSpy.called).toBeFalsy();

                fs.writeFileSync('/tmp/bogus.key', ' ');
                serverConnection.server.attributes['keyPath'] = '/tmp/bogus.key';
                serverConnection.initiateLocalProxy(function() {
                    try {
                        jasmine.getEnv().expect(connectionStatusSpy.args[0][1]).toBe('connection error');
                        fs.unlinkSync('/tmp/bogus.key');
                        done();
                    } catch(e) {
                       fs.unlinkSync('/tmp/bogus.key');
                    }
                });
            });

            it('triggers server:disconnected App event when ssh connection is disconnected', function(done) {
                jasmine.getEnv().expect(appVentConnectSpy.called).toBeFalsy('appVentConnectSpy should not have been called')
                serverConnection.initiateLocalProxy(function() {
                    serverConnection.sshProxy.on('end', function() {
                        jasmine.getEnv().expect(appVentDisconnectSpy.calledOnce).toBeTruthy();
                        done();
                    });
                    serverConnection.disconnect();
                });
            });

        });

    });

    describe('ServerConnection - sftpConnection', function() {

        describe('readStream', function() {
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
                jasmine.getEnv().expect(server.connection).toBeDefined();
                server.connection.readStream('/etc/hostname', function(err, fileContents) {
                    jasmine.getEnv().expect(err).toBeUndefined();
                    jasmine.getEnv().expect(fileContents).toEqual('lucid64\n');
                    done();
                });
            });

            it('displays an error modal when the file doesn\'t exist', function(done) {
                server.connection.readStream('/etc/doesnotexist', function(err, fileContents) {
                    jasmine.getEnv().expect(err).toBeDefined();
                    sinon.assert.calledOnce(showModalSpy);
                    expect(showModalSpy.args[0][0].options).to.have.keys(['errorMsg', 'filePath']);
                    done();
                });
            });

            it('displays an error modal when user has insufficient file permissions', function(done) {
                server.connection.readStream('/etc/sudoers', function(err, fileContents) {
                    jasmine.getEnv().expect(err).toBeDefined();
                    sinon.assert.calledOnce(showModalSpy);
                    expect(showModalSpy.args[0][0].options).to.have.keys(['errorMsg', 'filePath']);
                    done();
                });
            });
        });


        describe('writeStream', function() {
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
                        jasmine.getEnv().expect(err).toBeUndefined();
                        jasmine.getEnv().expect(stats.size).toBe(10);
                        server.sftpProxy.unlink(testFilePath, function() {
                            done();
                        })
                    });
                });
            });

            it('displays an error modal when the user has insufficient write permissions', function(done) {
                var testFilePath = '/tmp/test_unwriteable_file.txt';

                server.connection.writeStream(testFilePath, 'unwritable', {flags: 'w'}, function(err) {
                    jasmine.getEnv().expect(err).toBeUndefined();
                    sinon.assert.notCalled(showModalSpy);

                    server.sftpProxy.chmod(testFilePath, 0444, function(err) {
                        jasmine.getEnv().expect(err).toBeUndefined();
                        server.connection.writeStream(testFilePath, 'new content', {}, function(err) {
                            sinon.assert.calledOnce(showModalSpy);
                            expect(showModalSpy.args[0][0].options).to.have.keys(['errorMsg', 'filePath']);
                            server.sftpProxy.unlink(testFilePath, function(err) {
                                jasmine.getEnv().expect(err).toBeUndefined();
                                done();
                            });
                        });
                    });
                });
            });

            it('updates the contents of an existing file', function(done) {
                var testFilePath = '/tmp/test_file_to_update.txt';

                server.connection.writeStream(testFilePath, 're-write my contents', function(err) {
                    jasmine.getEnv().expect(err).toBeUndefined();
                    server.sftpProxy.stat(testFilePath, function(err, stats) {
                        jasmine.getEnv().expect(err).toBeUndefined();
                        server.connection.writeStream(testFilePath, 'new stuff', function(err) {
                            jasmine.getEnv().expect(err).toBeUndefined();
                            server.connection.readStream(testFilePath, function(err, fileContents) {
                                jasmine.getEnv().expect(err).toBeUndefined();
                                jasmine.getEnv().expect(fileContents).toEqual('new stuff');
                                server.sftpProxy.unlink(testFilePath, function (err) {
                                    jasmine.getEnv().expect(err).toBeUndefined();
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