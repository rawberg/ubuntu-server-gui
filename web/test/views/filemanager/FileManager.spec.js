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

        xdescribe('onServerSelected', function() {
            var fileManagerLayout;
            var modalShowSpy, serverConnectSpy;

            beforeEach(function() {
                fileManagerLayout = new FileManagerLayout();
                modalShowSpy = sinon.stub(App, 'showModal');
                serverConnectSpy = sinon.spy(ServerConnection.prototype, 'connect');

                var fakeServer = new Server({name: 'Fake Server', ipv4: '10.0.0.1'});
                App.vent.trigger('server:selected', fakeServer);
            });

            afterEach(function() {
                modalShowSpy.restore();
                serverConnectSpy.restore();
                App.activeServer = undefined; // avoid test pollution
            });

            it('calls connect on the ServerConnection model', function() {
                (serverConnectSpy).should.have.been.called;
            });

            it('shows the server connection modal', function() {
                (modalShowSpy).should.have.been.called;
                (modalShowSpy.args[0][0]).should.be.an.instanceof(ServerConnectionModal);
            });
        });

        xdescribe('onRender', function() {
            var fileManagerLayout, fakeServer;
            var showFileManagerSpy;

            beforeEach(function() {
                fileManagerLayout = new FileManagerLayout();
                showFileManagerSpy = sinon.stub(FileManagerLayout.prototype, 'showFileManager');

                fakeServer = new Server({name: 'Fake Server', ipv4: '10.0.0.1'});
            });

            afterEach(function() {
                showFileManagerSpy.restore();
            });

            it('doesn\'t call showFileManager without an actively selected Server', function() {
                App.activeServer = undefined;
                fileManagerLayout.render();
                (showFileManagerSpy).should.not.have.been.called;
            });

            it('calls showFileManager when a Server is actively selected', function() {
                App.activeServer = fakeServer;
                fileManagerLayout.render();
                (showFileManagerSpy).should.have.been.called;
            });

        });

        describe('showFileManager', function() {
            var fileManagerLayout, fakeServer;
            var showFileManagerSpy;

            beforeEach(function() {
                fileManagerLayout = new FileManagerLayout();
                showFileManagerSpy = sinon.stub(FileManagerLayout.prototype, 'showFileManager');

                fakeServer = new Server({name: 'Fake Server', ipv4: '10.0.0.1'});
                fakeServer.sshProxy = {};
                fakeServer.sshProxy.sftp = sinon.stub().yields();
            });

            it('establishes and sftp connection', function() {
                fileManagerLayout.showFileManager(fakeServer);
                (fakeServer.sshProxy.sftp).should.have.been.called;
            });

            afterEach(function() {
                showFileManagerSpy.restore();
            });
        });
    });
});