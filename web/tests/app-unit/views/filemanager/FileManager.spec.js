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
            it('throws an exception if options.server is not defined', function() {
                var exceptSpy = spyOn(FileManagerLayout.prototype, 'initialize');
                try {
                    directoryBreadcrumbs = new FileManagerLayout();
                } catch(e) {
                    expect(exceptSpy).toHaveBeenCalled();
                }
                expect(exceptSpy).toHaveBeenCalled();
            });
        });

        describe('onRender', function() {
            var fileManagerLayout, fakeServer;
            var showFileManagerSpy;

            beforeEach(function() {
                App._initCallbacks.run(undefined, App);
                fakeServer = new Server({name: 'Fake Server', ipv4: '10.0.0.1'});

                showFileManagerSpy = spyOn(FileManagerLayout.prototype, 'showFileManager');
                fileManagerLayout = new FileManagerLayout({server: fakeServer});
            });

            afterEach(function() {
                App._initCallbacks.reset();
            });

            it("doesn't call showFileManager without an actively selected Server", function(done) {
                fakeServer.isConnected = jasmine.createSpy('isConnected').and.returnValue(false);
                fileManagerLayout.render();
                expect(showFileManagerSpy).not.toHaveBeenCalled();
                done();
            });

            it("calls showFileManager with an actively selected Server", function(done) {
                fakeServer.isConnected = jasmine.createSpy('isConnected').and.returnValue(true);
                fileManagerLayout.render();
                expect(showFileManagerSpy).toHaveBeenCalled();
                done();
            });
        });
    });
});