define(function (require_browser) {
    // Libs
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        App = require_browser('App'),
    // Models
        Server = require_browser('models/Server'),
    // Collections
        NetServicesCollection = require_browser('collections/NetServices'),
    // Views
        DashboardLayout = require_browser('views/dashboard/Dashboard').DashboardLayout,
        ServerConnectionModal = require_browser('views/modal/ServerConnectionView'),
        LeftSidebarView = require_browser('views/dashboard/LeftSidebar'),
        PlatformStatsView = require_browser('views/dashboard/PlatformStats'),
        RunningServicesView = require_browser('views/dashboard/RunningServices'),
        UtilizationStatsView = require_browser('views/dashboard/UtilizationStats');



    xdescribe('Dashboard', function() {

        describe('showMonitoring', function() {
            var dashboardLayout;
            var utilizationStatsSpy, runningServicesSpy, platformStatsSpy;

            beforeEach(function() {
                dashboardLayout = new DashboardLayout();
//                sinon.stub(Socket.prototype, 'setHeartbeatTimeout');
//                sinon.spy(NetServicesCollection.prototype, 'fetch');
                utilizationStatsSpy = sinon.spy(UtilizationStatsView.prototype, 'render');
                runningServicesSpy = sinon.spy(RunningServicesView.prototype, 'render');
                platformStatsSpy = sinon.spy(PlatformStatsView.prototype, 'render');

//                var fakeServer = new Server({ipv4: '10.0.0.1'});
//                fakeServer.ws = io.connect();
//                dashboardLayout.showMonitoring(fakeServer);
            });

            afterEach(function() {
                NetServicesCollection.prototype.fetch.restore();
//                Socket.prototype.setHeartbeatTimeout.restore();
                utilizationStatsSpy.restore();
                runningServicesSpy.restore();
                platformStatsSpy.restore();
            });

            it('should show utilization stats in the dashboard layout', function() {
                (utilizationStatsSpy).should.have.been.called;
            });

            it('should show running services in the dashboard layout', function() {
                (runningServicesSpy).should.have.been.called;
                var runningServices = dashboardLayout.servicesRegion.currentView;
                (runningServices.collection.fetch).should.have.been.called;
            });

            it('should show platform stats in the dashboard layout', function() {
                (platformStatsSpy).should.have.been.called;
            });
        });

        xdescribe('onServerClick', function() {

            var dashboardLayout, modalShowSpy, serverModelSpy;
            beforeEach(function() {
                dashboardLayout = new DashboardLayout();
                modalShowSpy = sinon.spy(App, 'showModal');
                serverModelSpy = sinon.spy(Server.prototype, 'wsConnect');
                var fakeServer = new Server({name: 'Fake Server', ipv4: '10.0.0.1'});
                dashboardLayout.onServerClick(null, fakeServer);
            });

            afterEach(function() {
                modalShowSpy.restore();
                serverModelSpy.restore();
                App.closeModal();
            });

            it('calls wsConnect on the server model', function() {
                (serverModelSpy).should.have.been.called;
            });

            it('shows the server connection modal', function() {
                (modalShowSpy).should.have.been.called;
                (modalShowSpy.args[0][0]).should.be.an.instanceof(ServerConnectionModal);
            });
        });
    });
});
