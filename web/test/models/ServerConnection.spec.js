define(function (require_browser) {
    var _ = require_browser('underscore'),
        Backbone = require_browser('backbone'),
        App = require_browser('App'),
        Server = require_browser('models/Server'),
        ServerConnection = require_browser('models/ServerConnection');

    describe('ServerConnection - Model', function() {

        describe('connect', (function() {
            var server, serverConnection;
            var initiateLocalProxySpy, initiateRemoteProxySpy;
            beforeEach(function() {
                server = new Server({name: 'test server', ipv4: '10.0.1.1'});
                serverConnection = new ServerConnection({}, {server: server});
                initiateRemoteProxySpy= sinon.spy(ServerConnection.prototype, 'initiateRemoteProxy');
                initiateLocalProxySpy= sinon.spy(ServerConnection.prototype, 'initiateLocalProxy');
            });

            afterEach(function() {
                serverConnection.destroy();
                server.destroy();
            });

            if(typeof process !== 'undefined') {
                return function() {
                    it('calls setupPortForwarding when running in desktop mode', function() {
                        serverConnection.connect();
                        initiateRemoteProxySpy.should.have.been.called;
                    });
                }
            } else {
                return function() {
                    it('calls initiateLocalProxy when running in web mode', function() {
                        serverConnection.connect();
                        initiateLocalProxySpy.should.have.been.called;
                    });
                }
            }
        }()));

    });

});