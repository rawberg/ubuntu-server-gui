define(function (requirejs) {
    var _ = requirejs('underscore'),
    // Models
        Server = requirejs('models/Server'),
        ServerConnection = requirejs('models/ServerConnection'),
    // Views
        ServerConnectionView = requirejs('views/modal/ServerConnectionView'),
    // Templates
        serverConnectingTpl = requirejs('text!views/modal/templates/server-connection-connecting.html'),
        serverConnectPasswordPromptTpl = requirejs('text!views/modal/templates/server-connection-password.html'),
        serverConnectErrorTpl = requirejs('text!views/modal/templates/server-connection-error.html');

    describe('ServerConnectionView', function() {
        // TODO: convert these to integration tests
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
                templateSpy = spyOn(_, 'template').and.callThrough();
                server = new Server({ipv4: '10.0.0.1', name: 'Simple Server'});
                serverConnection = new ServerConnection({connection_status: 'connecting'}, {server: server});
                serverConnectionView = new ServerConnectionView({model: serverConnection});
            });

            afterEach(function() {
                serverConnectionView.close();
            });

            it('retrieves the correct tempate on "connecting" status', function() {
                serverConnectionView.render();
                expect(templateSpy).toHaveBeenCalledWith(serverConnectingTpl);
            });

            it('retrieves the correct tempate on "connected" status', function() {
                serverConnection.set('connection_status', 'connected');
                serverConnectionView.render();
                expect(templateSpy).toHaveBeenCalledWith(serverConnectingTpl);
            });

            it('retrieves the correct tempate on "password_required" status', function() {
                serverConnection.set('connection_status', 'password required');
                serverConnectionView.render();
                expect(templateSpy).toHaveBeenCalledWith(serverConnectPasswordPromptTpl);
            });

            it('retrieves the correct tempate on "error" status', function() {
                serverConnection.set('connection_status', 'error');
                serverConnectionView.render();
                expect(templateSpy).toHaveBeenCalledWith(serverConnectErrorTpl);
            });
        });
    });
});