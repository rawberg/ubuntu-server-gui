define(function (require) {
    // Libs
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        Marionette = require('marionette'),
        App = require('App'),
    // Models
        Server = require('models/Server'),
    // Views
        ServerConnectionModal = require('views/modal/ServerConnection');

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
            });

            it('displays connection error message in the modal', function() {
                serverConnectionModel.set('connection_status', 'connection error');
                (serverConnectionModal.$('h3').text()).should.have.string('connection error');
            });
        });
    });
});