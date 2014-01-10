define(function (require_browser) {
        // Libs
    var Marionette = require_browser('marionette'),
        MainController = require_browser('controllers/Main'),

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

        describe('dashboard', function() {
            var mainController, dashboardLayoutSpy;
            var dashboardLayout, runningServices, footerPosStub;

            beforeEach(function() {
                footerPosStub = sinon.stub($.prototype, 'offset');
                footerPosStub.returns({top: 666});
                dashboardLayoutSpy = sinon.stub(DashboardLayout.prototype, 'render');

                mainController = new MainController();
                sinon.spy(mainController.App.mainViewport, 'show');

                mainController.dashboard();
                dashboardLayout = mainController.App.mainViewport.currentView;
            });

            afterEach(function() {
                footerPosStub.restore();
                dashboardLayoutSpy.restore();
                mainController.App.mainViewport.show.restore();
            });

            it('should show mainViewport', function() {
                (mainController.App.mainViewport.show).should.have.been.called;
            });

            it("should show the dashboard layout", function() {
                (dashboardLayoutSpy).should.have.been.called;
            });
        });

    });
});