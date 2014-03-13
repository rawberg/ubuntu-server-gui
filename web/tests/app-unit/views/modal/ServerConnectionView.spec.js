define(function (require_browser) {
    var _ = require_browser('underscore'),
    // Models
        Server = require_browser('models/Server'),
        ServerConnection = require_browser('models/ServerConnection'),
    // Views
        ServerConnectionView = require_browser('views/modal/ServerConnectionView'),
    // Templates
        serverConnectingTpl = require_browser('text!views/modal/templates/server-connection-connecting.html'),
        serverConnectPasswordPromptTpl = require_browser('text!views/modal/templates/server-connection-password.html'),
        serverConnectErrorTpl = require_browser('text!views/modal/templates/server-connection-error.html');

    describe('ServerConnectionView', function() {
        describe('onRender', function() {
            var server, serverConnection;
            var serverConnectionView;

            beforeEach(function() {
                server = new Server({ipv4: '10.0.0.1', name: 'Simple Server'});
                serverConnection = new ServerConnection({connection_status: 'connecting'}, {server: server});
                serverConnectionView = new ServerConnectionView({model: serverConnection});
                serverConnectionView.render();
            });

            afterEach(function() {
                serverConnectionView.close();
            });

            it('displays connecting status and server name in the modal', function() {
                (serverConnectionView.$('h4').text()).should.have.string('connecting');
                (serverConnectionView.$('.modal-body').text()).should.have.string('Simple Server');
                (serverConnectionView.$('div.modal-body').hasClass('connecting')).should.be.true;
            });

            it('displays connection error message in the modal', function() {
                serverConnection.set('connection_status', 'connection error');
                (serverConnectionView.$('h4').text()).should.have.string('connection error');
            });
        });

        describe('getTemplate', function() {
            var server, serverConnection;
            var serverConnectionView, templateSpy;

            beforeEach(function() {
                templateSpy = sinon.spy(_, 'template');
                server = new Server({ipv4: '10.0.0.1', name: 'Simple Server'});
                serverConnection = new ServerConnection({connection_status: 'connecting'}, {server: server});
                serverConnectionView = new ServerConnectionView({model: serverConnection});
            });

            afterEach(function() {
                templateSpy.restore();
                serverConnectionView.close();
            });

            it('retrieves the correct tempate on "connecting" status', function() {
                serverConnectionView.render();
                sinon.assert.calledOnce(templateSpy);
                sinon.assert.calledWith(templateSpy, serverConnectingTpl);
            });

            it('retrieves the correct tempate on "connected" status', function() {
                serverConnection.set('connection_status', 'connected');
                serverConnectionView.render();
                sinon.assert.calledWith(templateSpy, serverConnectingTpl);
            });

            it('retrieves the correct tempate on "password_required" status', function() {
                serverConnection.set('connection_status', 'password_required');
                serverConnectionView.render();
                sinon.assert.calledWith(templateSpy, serverConnectPasswordPromptTpl);
            });

            it('retrieves the correct tempate on "error" status', function() {
                serverConnection.set('connection_status', 'error');
                serverConnectionView.render();
                sinon.assert.calledWith(templateSpy, serverConnectErrorTpl);
            });
        });
    });
});