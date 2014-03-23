define(function (require_browser) {
    var _ = require_browser('underscore'),
        App = require_browser('App'),
        Server = require_browser('models/Server'),
        ServerList = require_browser('collections/ServerList'),
        ServerConnection = require_browser('models/ServerConnection');

    var fs = require('fs');

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

            afterEach(function() {
                serverConnection.destroy();
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
                        console.log(e);
                    }
                });
            });

            it('connects via ssh username/password', function(done) {
                var attributes = _.clone(serverConnection.attributes);
                serverConnection.server.attributes['keyPath'] = null;

                jasmine.getEnv().expect(appVentConnectSpy.called).toBeFalsy();
                jasmine.getEnv().expect(connectionStatusSpy.called).toBeFalsy();
                serverConnection.connect({password: 'vagrant'}, function() {
                    try {
                        jasmine.getEnv().expect(appVentConnectSpy.calledOnce).toBeTruthy();
                        // work-around for sinon calledWith being flakey
                        jasmine.getEnv().expect(connectionStatusSpy.args[0][1]).toBe('connected');
                        done();
                    } catch(e) {
                        console.log(e);
                    }
                });
            });

            it("sets connection_status to 'password_required' when there's no key and password is empty", function(done) {
                serverConnection.server.attributes['keyPath'] = null;

                jasmine.getEnv().expect(appVentConnectSpy.called).toBeFalsy();
                jasmine.getEnv().expect(connectionStatusSpy.called).toBeFalsy();
                serverConnection.connect({}, function() {
                    try {
                        jasmine.getEnv().expect(connectionStatusSpy.args[0][1]).toBe('password_required');
                        jasmine.getEnv().expect(appVentConnectSpy.calledOnce).toBeFalsy();
                        done();
                    } catch(e) {
                        console.log(e);
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
                        console.log(e);
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
                       console.log(e);
                    }
                });
            });
            
            it('triggers server:disconnected App event when ssh connection is disconnected', function(done) {
                jasmine.getEnv().expect(appVentConnectSpy.called).toBeFalsy()
                serverConnection.initiateLocalProxy(function() {
                    serverConnection.sshProxy.on('end', function() {
                        jasmine.getEnv().expect(appVentDisconnectSpy.calledOnce).toBeTruthy();
                        done();
                    });
                    serverConnection.sshProxy.end();

                });
            });

        });

    });

});