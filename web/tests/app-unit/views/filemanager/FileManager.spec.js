define(function (requirejs) {
    // Libs
    var $ = requirejs('jquery'),
        _ = requirejs('underscore'),
        Marionette = requirejs('marionette'),
        App = requirejs('App'),
    // Models & Collections
        Server = requirejs('models/Server'),
        ServerConnection = requirejs('models/ServerConnection'),
    // Views
        FileManagerLayout = requirejs('views/filemanager/FileManager'),
        ServerConnectionModal = requirejs('views/modal/ServerConnectionView');

    describe('FileManager', function() {

        describe('initialize', function() {
            var fileManagerLayout, fakeServer;
            var showFileManagerSpy;

            beforeEach(function() {
            });

            afterEach(function() {
            });

            it('trhows an exception if options.controllerTriggers is not defined', function() {
                var exceptSpy = spyOn(FileManagerLayout.prototype, 'initialize');
                try {
                    directoryBreadcrumbs = new FileManagerLayout();
                } catch(e) {
                    expect(exceptSpy).toHaveBeenCalled();
                }
                expect(exceptSpy).toHaveBeenCalled();
            });

        });

        describe('onServerSelected', function() {
            var fileManagerLayout, posStub, activateToolbarItemsStub;
            var modalShowSpy, serverConnectSpy;

            beforeEach(function() {
                posStub = spyOn($.prototype, 'offset').and.returnValue({top: 500, bottom: 540});

                modalShowSpy = spyOn(App, 'showModal');
                serverConnectSpy = spyOn(ServerConnection.prototype, 'connect');

                App._initCallbacks.run(undefined, App);
                fileManagerLayout = new FileManagerLayout({controllerTriggers: jasmine.createSpy()});

                var fakeServer = new Server({name: 'Fake Server', ipv4: '10.0.0.1'});
                App.vent.trigger('server:selected', fakeServer);
            });

            afterEach(function() {
                App.activeServer = undefined; // avoid test pollution
            });

            it('calls connect on the ServerConnection model', function() {
                expect(serverConnectSpy).toHaveBeenCalled();
            });

            it('shows the server connection modal', function() {
                expect(modalShowSpy).toHaveBeenCalled();
                (modalShowSpy.calls.argsFor(0)[0]).should.be.an.instanceof(ServerConnectionModal);
            });
        });

        describe('onRender', function() {
            var fileManagerLayout, fakeServer;
            var getActiveServerSpy, showFileManagerSpy;

            beforeEach(function() {
                fileManagerLayout = new FileManagerLayout({controllerTriggers: jasmine.createSpy()});
                showFileManagerSpy = spyOn(FileManagerLayout.prototype, 'showFileManager');

                fakeServer = new Server({name: 'Fake Server', ipv4: '10.0.0.1'});
            });

            it('doesn\'t call showFileManager without an actively selected Server', function() {
                getActiveServerSpy = spyOn(App, 'getActiveServer').and.returnValue(undefined);
                fileManagerLayout.render();
                expect(showFileManagerSpy).not.toHaveBeenCalled();
            });

        });
    });
});