define(function (require_browser) {
    // Models
    var Server = require_browser('models/Server'),
        ServerConnection = require_browser('models/ServerConnection'),
    // Views
        ServerConnectionView = require_browser('views/modal/ServerConnectionView');

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

            it('displays the correct template on connect error', function() {
                serverConnection.set('connection_status', 'connection error');
                (serverConnectionView.$('div.modal-body').hasClass('connection-error')).should.be.true;
            });
        });
    });
});