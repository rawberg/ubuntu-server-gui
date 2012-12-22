define(function (require) {
    var DashboardLayout = require('views/dashboard/Dashboard'),
        LeftSidebarView = require('views/dashboard/LeftSidebar'),

        Marionette = require('marionette'),
        MainController = require('controllers/Main'),
        NetServicesCollection = require('collections/NetServices'),

        PlatformStatsView = require('views/dashboard/PlatformStats'),
        RunningServicesView = require('views/dashboard/RunningServices'),
        ServerListCollection = require('collections/ServerList'),
        UtilizationStatsView = require('views/dashboard/UtilizationStats');

    describe('Main - Controller', function() {

        describe('dashboard', function() {
            var mainController, dashboardLayoutSpy, leftsidebarSpy,
                utilizationStatsSpy, runningServicesSpy, platformStatsSpy;
            var dashboardLayout, leftSidebar, runningServices;

            beforeEach(function() {
                leftsidebarSpy = sinon.spy(LeftSidebarView.prototype, 'render');
                dashboardLayoutSpy = sinon.spy(DashboardLayout.prototype, 'render');
                utilizationStatsSpy = sinon.spy(UtilizationStatsView.prototype, 'render');
                runningServicesSpy = sinon.spy(RunningServicesView.prototype, 'render');
                platformStatsSpy = sinon.spy(PlatformStatsView.prototype, 'render');
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
                leftsidebarSpy.restore();
                dashboardLayoutSpy.restore();
                utilizationStatsSpy.restore();
                runningServicesSpy.restore();
                platformStatsSpy.restore();

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

            it('should show utilization stats in the dashboard layout', function() {
                (utilizationStatsSpy).should.have.been.called;
            });

            it('should show running services in the dashboard layout', function() {
                (runningServicesSpy).should.have.been.called;
                (runningServices.collection.fetch).should.have.been.called;
            });

            it('should show platform stats in the dashboard layout', function() {
                (platformStatsSpy).should.have.been.called;
            });
        });
    });
});