define(function (require_browser) {
    var _ = require_browser('underscore'),
        App = require_browser('App'),
        Server = require_browser('models/Server'),
        ServerList = require_browser('collections/ServerList'),
        ServerConnection = require_browser('models/ServerConnection');

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
                appVentConnectSpy.should.not.have.been.called;
                connectionStatusSpy.should.not.have.been.called;
                serverConnection.initiateLocalProxy(function() {
                    try {
                        appVentConnectSpy.should.have.been.calledOnce;
                        connectionStatusSpy.should.have.been.calledOnce;
                    } catch(e) {
                        console.log(e.message);
                    }
                    done();
                });
            });

            it('connects via ssh username/password', function(done) {
                var attributes = _.clone(serverConnection.attributes);
                serverConnection.attributes['keyPath'] = null;

                appVentConnectSpy.should.not.have.been.called;
                connectionStatusSpy.should.not.have.been.called;
                serverConnection.initiateLocalProxy(function() {
                    try {
                        appVentConnectSpy.should.have.been.calledOnce;
                        connectionStatusSpy.should.have.been.calledOnce;
                    } catch(e) {
                        console.log(e.message);
                    }
                    serverConnection.attributes['keyPath'] = attributes['keyPath'];
                    done();
                });
            });
            
            it('triggers server:disconnected App event when ssh connection is disconnected', function(done) {
                appVentDisconnectSpy.should.not.have.been.called;
                serverConnection.initiateLocalProxy(function() {
                    serverConnection.sshProxy.on('end', function() {
                        sinon.assert.calledOnce(appVentDisconnectSpy);
                        done();
                    });
                    serverConnection.sshProxy.end();

                });
            });

        });

    });

});