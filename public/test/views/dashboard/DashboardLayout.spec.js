define(function (require) {
    // Libs
    var Marionette = require('marionette'),

    // Models
        Server = require('models/Server'),

    // Views
        DashboardLayout = require('views/dashboard/Dashboard'),
        LeftSidebarView = require('views/dashboard/LeftSidebar'),
        PlatformStatsView = require('views/dashboard/PlatformStats'),
        RunningServicesView = require('views/dashboard/RunningServices'),
        UtilizationStatsView = require('views/dashboard/UtilizationStats');

    describe('Dashboard', function() {

        describe('showMonitoring', function() {
            var dashboardLayout;
            var utilizationStatsSpy, runningServicesSpy, platformStatsSpy;

            beforeEach(function() {
                dashboardLayout = new DashboardLayout();
                utilizationStatsSpy = sinon.spy(UtilizationStatsView.prototype, 'render');
                runningServicesSpy = sinon.spy(RunningServicesView.prototype, 'render');
                platformStatsSpy = sinon.spy(PlatformStatsView.prototype, 'render');

                var fakeServer = new Server({ipv4: '10.0.0.1'});
                dashboardLayout.showMonitoring(null, fakeServer);
            });

            afterEach(function() {
                utilizationStatsSpy.restore();
                runningServicesSpy.restore();
                platformStatsSpy.restore();
            });


        //            it('should show utilization stats in the dashboard layout', function() {
        //                (utilizationStatsSpy).should.have.been.called;
        //            });
        //
        //            it('should show running services in the dashboard layout', function() {
        //                (runningServicesSpy).should.have.been.called;
        //                (runningServices.collection.fetch).should.have.been.called;
        //            });

            it('should show platform stats in the dashboard layout', function() {
                (platformStatsSpy).should.have.been.called;
            });
        });
    });
});
