define(function (require_browser) {
    var App = require_browser('App'),
        Server = require_browser('models/Server'),
        ServerConnection = require_browser('models/ServerConnection');

    describe('ServerConnection - Model', function() {

        describe('initiateLocalProxy', function() {
            var server, serverConnection;
            var connectionStatusSpy, appVentConnectSpy, appVentClosedSpy;

            beforeEach(function() {
                // TODO: make this dynamic from vagrant server output
                connectionStatusSpy = sinon.spy();
                appVentConnectSpy = sinon.spy();
                appVentClosedSpy = sinon.spy();
                App.vent.on('server:connected', appVentConnectSpy);
                App.vent.on('server:closed', appVentClosedSpy);

                server = new Server({name: 'test server', ipv4: '10.10.1.5'});
                serverConnection = new ServerConnection({}, {server: server});
                serverConnection.on('change:connection_status', connectionStatusSpy);
            });

            afterEach(function() {
                serverConnection.destroy();
                server.destroy();
            });

            it('changes connection_status attribute and triggers server:connected App event after succesful ssh connection', function(done) {
                sinon.assert.notCalled(appVentConnectSpy);
                sinon.assert.notCalled(connectionStatusSpy);
                serverConnection.initiateLocalProxy(function() {
                    sinon.assert.calledOnce(appVentConnectSpy);
                    sinon.assert.calledOnce(connectionStatusSpy);
                    done();
                });
            });
            
            xit('triggers server:disconnected App event when ssh connection is disconnected', function(done) {
                sinon.assert.notCalled(appVentClosedSpy);
                serverConnection.initiateLocalProxy(function() {
                    serverConnection.sshProxy.end();
                    sinon.assert.calledOnce(appVentClosedSpy);
                });
            });

        });

    });

});