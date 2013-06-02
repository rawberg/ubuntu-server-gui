define(function (require_browser) {
    // Libs
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        App = require_browser('App'),
    // Models & Collections
        Server = require_browser('models/Server'),
        ServerConnection = require_browser('models/ServerConnection'),
    // Views
        FileManagerLayout = require_browser('views/filemanager/FileManager').FileManagerLayout,
        ServerConnectionModal = require_browser('views/modal/ServerConnectionView');

    describe('FileManager', function() {

        describe('onServerClick', function() {

            var fileManagerLayout, modalShowSpy, serverConnectSpy;
            beforeEach(function() {
                fileManagerLayout = new FileManagerLayout();
                modalShowSpy = sinon.spy(App, 'showModal');
                serverConnectSpy = sinon.spy(ServerConnection.prototype, 'connect');
                var fakeServer = new Server({name: 'Fake Server', ipv4: '10.0.0.1'});
                fileManagerLayout.onServerClick(null, fakeServer);
            });

            afterEach(function() {
                modalShowSpy.restore();
                serverConnectSpy.restore();
                App.closeModal();
            });

            it('calls connect on the server model', function() {
                (serverConnectSpy).should.have.been.called;
            });

            it('shows the server connection modal', function() {
                (modalShowSpy).should.have.been.called;
                (modalShowSpy.args[0][0]).should.be.an.instanceof(ServerConnectionModal);
            });
        });
    });
});