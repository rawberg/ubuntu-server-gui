define(function (require_browser) {
        // Libs
    var Marionette = require_browser('marionette'),
        MainController = require_browser('controllers/Main'),

        // Models
        Server = require_browser('models/Server'),

        // Collections
        NetServicesCollection = require_browser('collections/NetServices'),
        ServerListCollection = require_browser('collections/ServerList'),

        // Views
        DashboardLayout = require_browser('views/dashboard/Dashboard').DashboardLayout,
        LeftSidebarView = require_browser('views/dashboard/LeftSidebar').LeftSidebar,
        PlatformStatsView = require_browser('views/dashboard/PlatformStats'),
        RunningServicesView = require_browser('views/dashboard/RunningServices'),
        UtilizationStatsView = require_browser('views/dashboard/UtilizationStats');

    describe('Main - Controller', function() {

        describe('dashboard', function() {
            var mainController, dashboardLayoutSpy, leftsidebarSpy;
            var dashboardLayout, leftSidebar, runningServices, footerPosStub;

            beforeEach(function() {
                footerPosStub = sinon.stub($.prototype, 'position');
                footerPosStub.returns({top: 666});
                leftsidebarSpy = sinon.stub(LeftSidebarView.prototype, 'render');
                dashboardLayoutSpy = sinon.stub(DashboardLayout.prototype, 'render');

                mainController = new MainController();

                sinon.spy(ServerListCollection.prototype, 'fetch');
                sinon.spy(mainController.App.mainViewport, 'show');
                sinon.spy(mainController.App.mainToolbar, 'show');
                sinon.spy(mainController.App.mainFooterbar, 'show');

                mainController.dashboard();
                dashboardLayout = mainController.App.mainViewport.currentView;
                leftSidebar = dashboardLayout.sidebarLeftRegion.currentView;
            });

            afterEach(function() {
                footerPosStub.restore();
                leftsidebarSpy.restore();
                dashboardLayoutSpy.restore();

                ServerListCollection.prototype.fetch.restore();

                mainController.App.mainViewport.show.restore();
                mainController.App.mainToolbar.show.restore();
                mainController.App.mainFooterbar.show.restore();
            });

            it('should show mainToolbar', function() {
                (mainController.App.mainToolbar.show).should.have.been.called;
            });

            it('should show mainFooterbar', function() {
                (mainController.App.mainFooterbar.show).should.have.been.called;
            });

            it('should show mainViewport', function() {
                (mainController.App.mainViewport.show).should.have.been.called;
            });

            it('should show leftSidebar', function() {
                (leftsidebarSpy).should.have.been.called;
                (leftSidebar.collection.fetch).should.have.been.called;
            });

            it("should show the dashboard layout", function() {
                (dashboardLayoutSpy).should.have.been.called;
            });
        });

    });
});