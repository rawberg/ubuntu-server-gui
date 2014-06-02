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

        describe('initialize', function() {
            var fileManagerLayout, fakeServer;
            var showFileManagerSpy;

            beforeEach(function() {
            });

            afterEach(function() {
            });

            it('trhows an exception if options.controllerTriggers is not defined', function() {
                var exceptSpy = sinon.spy(FileManagerLayout.prototype, 'initialize');
                try {
                    directoryBreadcrumbs = new FileManagerLayout();
                } catch(e) {
                    sinon.assert.threw(exceptSpy);
                }
                sinon.assert.threw(exceptSpy);
            });

        });

        describe('onServerSelected', function() {
            var fileManagerLayout, posStub, activateToolbarItemsStub;
            var modalShowSpy, serverConnectSpy;

            beforeEach(function() {
                posStub = sinon.stub($.prototype, 'offset');
                posStub.returns({top: 500, bottom: 540});

                modalShowSpy = sinon.stub(App, 'showModal');
                serverConnectSpy = sinon.stub(ServerConnection.prototype, 'connect');

                App._initCallbacks.run(undefined, App);
                fileManagerLayout = new FileManagerLayout({controllerTriggers: sinon.stub()});

                var fakeServer = new Server({name: 'Fake Server', ipv4: '10.0.0.1'});
                App.vent.trigger('server:selected', fakeServer);
            });

            afterEach(function() {
                modalShowSpy.restore();
                serverConnectSpy.restore();
                posStub.restore();
                App.activeServer = undefined; // avoid test pollution
            });

            it('calls connect on the ServerConnection model', function() {
                sinon.assert.called(serverConnectSpy);
            });

            it('shows the server connection modal', function() {
                sinon.assert.called(modalShowSpy);
                expect(modalShowSpy.args[0][0]).to.be.an.instanceof(ServerConnectionModal);
            });
        });

        describe('onRender', function() {
            var fileManagerLayout, fakeServer;
            var getActiveServerSpy, showFileManagerSpy;

            beforeEach(function() {
                fileManagerLayout = new FileManagerLayout({controllerTriggers: sinon.stub()});
                showFileManagerSpy = sinon.stub(FileManagerLayout.prototype, 'showFileManager');

                fakeServer = new Server({name: 'Fake Server', ipv4: '10.0.0.1'});
            });

            afterEach(function() {
                getActiveServerSpy.restore();
                showFileManagerSpy.restore();
            });

            it('doesn\'t call showFileManager without an actively selected Server', function() {
                getActiveServerSpy = sinon.stub(App, 'getActiveServer').returns(undefined);
                fileManagerLayout.render();
                (showFileManagerSpy).should.not.have.been.called;
            });

        });
    });
});