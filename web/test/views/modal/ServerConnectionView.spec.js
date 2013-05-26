define(function (require_browser) {
    // Libs
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Backbone = require_browser('backbone'),
        Marionette = require_browser('marionette'),
        App = require_browser('App'),
    // Models
        Server = require_browser('models/Server'),
    // Views
        ServerConnectionModal = require_browser('views/modal/ServerConnectionView');

    describe('ServerConnection Modal', function() {
        describe('onRender', function() {

            var serverConnectionModal, serverConnectionModel;
            beforeEach(function() {
                var server = new Server({ipv4: '10.0.0.1', name: 'Simple Server'});
                serverConnectionModel = new Backbone.Model(_.extend({connection_status: 'connecting'}, server.toJSON()), {});
                serverConnectionModal = new ServerConnectionModal({model: serverConnectionModel});
                serverConnectionModal.render();
            });

            afterEach(function() {
                serverConnectionModal.close();
            });

            it('displays connecting status and server name in the modal', function() {
                (serverConnectionModal.$('h3').text()).should.have.string('connecting');
                (serverConnectionModal.$('.modal-body').text()).should.have.string('Simple Server');
                (serverConnectionModal.$('div.modal-body').hasClass('connecting')).should.be.true;
            });

            it('displays connection error message in the modal', function() {
                serverConnectionModel.set('connection_status', 'connection error');
                (serverConnectionModal.$('h3').text()).should.have.string('connection error');
            });

            it('displays the correct template on connect error', function() {
                serverConnectionModel.set('connection_status', 'connection error');
                (serverConnectionModal.$('div.modal-body').hasClass('connection-error')).should.be.true;
            });
        });
    });
});