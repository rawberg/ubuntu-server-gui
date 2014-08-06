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
        // Views
        DashboardLayout = requirejs('views/dashboard/Dashboard');


    describe('Main - Controller', function() {

        describe('dashboard', function() {
            var mainController, dashboardLayoutSpy, viewportShowSpy;
            var dashboardLayout, runningServices, footerPosStub, toolbarsStub;

            beforeEach(function(done) {
                footerPosStub = spyOn($.prototype, 'offset').and.returnValue({top: 666});
                viewportShowSpy = spyOn(App.mainViewport, 'show');

                mainController = new MainController();
                toolbarsStub = spyOn(mainController, '_toolbars');

                mainController.dashboard();
                done();
            });

            it("should show the dashboard layout in mainViewport", function() {
                expect(viewportShowSpy).toHaveBeenCalled();
            });
        });


        describe('editor', function() {
            var posStub, fakeServer, readStreamMock, historyStub, toolbarsStub;
            var mainController;

            beforeEach(function(done) {
                historyStub = spyOn(Backbone.history, 'navigate').and.callThrough();
                posStub = spyOn($.prototype, 'offset').and.returnValue({top: 500, bottom: 540});

                var fakeServer = new Server({name: 'Fake Server', ipv4: '10.0.0.1'});
                fakeServer.connection = {readStream: jasmine.createSpy().and.callFake(function(path, callback) {
                    callback(undefined, 'valid contents');
                })};
                spyOn(App, 'getActiveServer').and.returnValue(fakeServer);
                spyOn(App.mainViewport, 'show');

                mainController = new MainController();
                toolbarsStub = spyOn(mainController, '_toolbars');
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