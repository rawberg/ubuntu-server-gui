define(function (require) {
        // Libs
    var Marionette = require('marionette'),
        MainController = require('controllers/Main'),

        // Models
        Server = require('models/Server'),

        // Collections
        NetServicesCollection = require('collections/NetServices'),
        ServerListCollection = require('collections/ServerList'),

        // Views
        DashboardLayout = require('views/dashboard/Dashboard'),
        LeftSidebarView = require('views/dashboard/LeftSidebar'),
        PlatformStatsView = require('views/dashboard/PlatformStats'),
        RunningServicesView = require('views/dashboard/RunningServices'),
        UtilizationStatsView = require('views/dashboard/UtilizationStats');

    describe('Main - Controller', function() {

        describe('dashboard', function() {
            var mainController, dashboardLayoutSpy, leftsidebarSpy;
            var dashboardLayout, leftSidebar, runningServices, footerPosStub;

            beforeEach(function() {
                footerPosStub = sinon.stub($.prototype, 'position');
                footerPosStub.returns({top: 666});
                leftsidebarSpy = sinon.spy(LeftSidebarView.prototype, 'render');
                dashboardLayoutSpy = sinon.spy(DashboardLayout.prototype, 'render');

                mainController = new MainController();

                sinon.spy(NetServicesCollection.prototype, 'fetch');
                sinon.spy(ServerListCollection.prototype, 'fetch');
                sinon.spy(mainController.App.mainViewport, 'show');
                sinon.spy(mainController.App.mainToolbar, 'show');
                sinon.spy(mainController.App.mainFooterbar, 'show');

                mainController.dashboard();
                dashboardLayout = mainController.App.mainViewport.currentView;
                leftSidebar = dashboardLayout.sidebarLeftRegion.currentView;
                runningServices = dashboardLayout.servicesRegion.currentView;
            });

            afterEach(function() {
                footerPosStub.restore();
                leftsidebarSpy.restore();
                dashboardLayoutSpy.restore();

                NetServicesCollection.prototype.fetch.restore();
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