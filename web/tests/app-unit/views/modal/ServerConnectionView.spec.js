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
            var server, serverConnectionView;

            beforeEach(function() {
                server = new Server({ipv4: '10.0.0.1', name: 'Simple Server'});
                server.connection = new ServerConnection({connection_status: 'connecting'}, {server: server});
                serverConnectionView = new ServerConnectionView({model: server.connection});
                serverConnectionView.render();
            });

            afterEach(function() {
                serverConnectionView.destroy();
            });

            it('displays connecting status and server name in the modal', function() {
                expect(serverConnectionView.$('h4').text()).toMatch('connecting');
                expect(serverConnectionView.$('.modal-body').text()).toMatch('Simple Server');
                expect(serverConnectionView.$('div.modal-body').hasClass('connecting')).toBeTruthy();
            });

            it('displays connection error message in the modal', function() {
                server.connection.set('connection_status', 'connection error');
                expect(serverConnectionView.$('h4').text()).toMatch('connection error');
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
                serverConnectionView.destroy();
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