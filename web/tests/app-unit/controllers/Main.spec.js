define(function (requirejs) {
        // Libs
    var $ = requirejs('jquery'),
        Marionette = requirejs('marionette'),
        MainController = requirejs('controllers/Main'),
        App = requirejs('App'),
        // Models
        Server = requirejs('models/Server'),
        // Collections
        NetServicesCollection = requirejs('collections/NetServices'),
        ServerList = requirejs('collections/ServerList'),
        // Views
        DashboardLayout = requirejs('views/dashboard/Dashboard');


    describe('Main - Controller', function() {

        describe('dashboard', function() {
            var mainController, viewportShowSpy, toolbarsSpy;

            beforeEach(function(done) {
                App._initCallbacks.run(undefined, App);
                toolbarsSpy = spyOn(MainController.prototype, '_toolbars');
                viewportShowSpy = spyOn(App.mainViewport, 'show');

                spyOn(ServerList.prototype, '_checkEmpty');
                spyOn(ServerList.prototype, 'getActive').and.returnValue(
                    new Server({
                    id: "1111",
                    name: "Server",
                }));

                mainController = new MainController();
                mainController.serverList = new ServerList();
                done();
            });

            afterEach(function() {
                App._initCallbacks.reset();
            });

            it("should show the dashboard layout in mainViewport", function() {
                mainController.dashboard();
                expect(toolbarsSpy).toHaveBeenCalled();
                expect(viewportShowSpy).toHaveBeenCalled();
            });
        });


        xdescribe('editor', function() {
            var posStub, fakeServer, viewportShowSpy, historyStub, toolbarsSpy;
            var mainController;

            beforeEach(function(done) {
                historyStub = spyOn(Backbone.history, 'navigate').and.callThrough();
                posStub = spyOn($.prototype, 'offset').and.returnValue({top: 500, bottom: 540});

                fakeServer.connection = {readStream: jasmine.createSpy().and.callFake(function(path, callback) {
                    callback(undefined, 'valid contents');
                })};

                toolbarsSpy = spyOn(MainController.prototype, '_toolbars');
                viewportShowSpy = spyOn(App.mainViewport, 'show');

                mainController = new MainController();
                done();
            });

            it('should show the file editor when the server returns file contents', function(done) {
                mainController.editor({path: '/valid/path/', file: 'valid.txt'});
                expect(App.mainViewport.show).toHaveBeenCalled();
                expect(App.mainViewport.show.calls.argsFor(0)[0].options.fileContents).toBe('valid contents');
                expect(App.mainViewport.show.calls.argsFor(0)[0].options.dirPath).toBe('/valid/path/');
                done();
            });
        });

    });
});