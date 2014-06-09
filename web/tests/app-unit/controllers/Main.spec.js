define(function (require_browser) {
        // Libs
    var $ = require_browser('jquery'),
        Marionette = require_browser('marionette'),
        MainController = require_browser('controllers/Main'),
        App = require_browser('App'),

        // Models
        Server = require_browser('models/Server'),

        // Collections
        NetServicesCollection = require_browser('collections/NetServices'),

        // Views
        DashboardLayout = require_browser('views/dashboard/Dashboard').DashboardLayout,
        PlatformStatsView = require_browser('views/dashboard/PlatformStats'),
        RunningServicesView = require_browser('views/dashboard/RunningServices'),
        UtilizationStatsView = require_browser('views/dashboard/UtilizationStats');

    describe('Main - Controller', function() {

        xdescribe('dashboard', function() {
            var mainController, dashboardLayoutSpy;
            var dashboardLayout, runningServices, footerPosStub;

            beforeEach(function(done) {
                footerPosStub = spyOn($.prototype, 'offset').and.returnValue({top: 666});
                dashboardLayoutSpy = spyOn(DashboardLayout.prototype, 'render');

                mainController = new MainController();
                spyOn(mainController.App.mainViewport, 'show').and.callThrough();

                mainController.dashboard();
                done();
            });

            it('should show mainViewport', function() {
                expect(mainController.App.mainViewport.show).toHaveBeenCalled();
            });

            it("should show the dashboard layout", function() {
                expect(dashboardLayoutSpy).toHaveBeenCalled();
            });
        });


        describe('editor', function() {
            var posStub, fakeServer, readStreamMock, historyStub;
            var mainController;

            beforeEach(function(done) {
                historyStub = spyOn(Backbone.history, 'navigate').and.callThrough();
                posStub = spyOn($.prototype, 'offset').and.returnValue({top: 500, bottom: 540});

                App._initCallbacks.run(undefined, App);
                var fakeServer = new Server({name: 'Fake Server', ipv4: '10.0.0.1'});
                fakeServer.connection = {readStream: jasmine.createSpy().and.callFake(function(path, callback) {
                    callback(undefined, 'valid contents');
                })};
                spyOn(App, 'getActiveServer').and.returnValue(fakeServer);

                mainController = new MainController();
                spyOn(mainController.App.mainViewport, 'show').and.callThrough;
                done();
            });

            it('should show the file editor when the server returns file contents', function(done) {
                mainController.editor({path: '/valid/path/', file: 'valid.txt'});
                expect(mainController.App.mainViewport.show).toHaveBeenCalled();
                expect(mainController.App.mainViewport.show.calls.argsFor(0)[0].options.fileContents).toBe('valid contents');
                expect(mainController.App.mainViewport.show.calls.argsFor(0)[0].options.dirPath).toBe('/valid/path/');
                done();
            });
        });

    });
});