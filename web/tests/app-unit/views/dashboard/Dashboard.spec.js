define(function (requirejs) {
    // Libs
    var $ = requirejs('jquery'),
        _ = requirejs('underscore'),
        Marionette = requirejs('marionette'),
        App = requirejs('App'),
    // Models
        Server = requirejs('models/Server'),
        PlatformInfo = requirejs('models/PlatformInfo'),
        ServerOverview = requirejs('models/ServerOverview'),
        ServerConnection = requirejs('models/ServerConnection'),
    // Collections
        NetServicesCollection = requirejs('collections/NetServices'),
    // Views
        DashboardLayout = requirejs('views/dashboard/Dashboard').DashboardLayout,
        ServerConnectionModal = requirejs('views/modal/ServerConnectionView'),
        LeftSidebarView = requirejs('views/dashboard/LeftSidebar'),
        PlatformStatsView = requirejs('views/dashboard/PlatformStats'),
        RunningServicesView = requirejs('views/dashboard/RunningServices'),
        UtilizationStatsView = requirejs('views/dashboard/UtilizationStats');



    xdescribe('Dashboard', function() {

        describe('showMonitoring', function() {
            var dashboardLayout;
            var utilizationStatsSpy, platformStatsSpy;

            beforeEach(function() {
                sinon.stub(PlatformInfo.prototype, 'fetch');
                sinon.stub(ServerOverview.prototype, 'fetch');
                sinon.spy(NetServicesCollection.prototype, 'fetch');

                dashboardLayout = new DashboardLayout();
                utilizationStatsSpy = sinon.spy(UtilizationStatsView.prototype, 'render');
                platformStatsSpy = sinon.spy(PlatformStatsView.prototype, 'render');

                var fakeServer = new Server({ipv4: '10.0.0.1'});
                dashboardLayout.showMonitoring(fakeServer);
            });

            afterEach(function() {
                PlatformInfo.prototype.fetch.restore();
                ServerOverview.prototype.fetch.restore();
                NetServicesCollection.prototype.fetch.restore();

                utilizationStatsSpy.restore();
                platformStatsSpy.restore();
            });

            it('should show utilization stats in the dashboard layout', function() {
                (utilizationStatsSpy).should.have.been.called;
            });

            it('should show platform stats in the dashboard layout', function() {
                (platformStatsSpy).should.have.been.called;
            });

        });

        describe('onServerSelected', function() {
            var dashboardLayout;
            var modalShowStub, serverModelSpy, serverConnectSpy;

            beforeEach(function() {
                dashboardLayout = new DashboardLayout();
                modalShowStub = sinon.stub(App, 'showModal');
                serverConnectSpy = sinon.spy(ServerConnection.prototype, 'connect');

                var fakeServer = new Server({name: 'Fake Server', ipv4: '10.0.0.1'});
                App.vent.trigger('server:selected', fakeServer);
            });

            afterEach(function() {
                modalShowStub.restore();
                serverConnectSpy.restore();
                App.activeServer = undefined; // avoid test pollution
            });

            it('calls connect on the ServerConnection model', function() {
                (serverConnectSpy).should.have.been.called;
            });

            it('shows the server connection modal', function() {
                (modalShowStub).should.have.been.called;
                (modalShowStub.args[0][0]).should.be.an.instanceof(ServerConnectionModal);
            });
        });

        describe('onRender', function() {
            var dashboardLayout, fakeServer;
            var showMonitoringSpy;

            beforeEach(function() {
                dashboardLayout = new DashboardLayout();
                showMonitoringSpy = sinon.spy(DashboardLayout.prototype, 'showMonitoring');

                sinon.stub(PlatformInfo.prototype, 'fetch');
                sinon.stub(ServerOverview.prototype, 'fetch');

                fakeServer = new Server({name: 'Fake Server', ipv4: '10.0.0.1'});
            });

            afterEach(function() {
                showMonitoringSpy.restore();
                PlatformInfo.prototype.fetch.restore();
                ServerOverview.prototype.fetch.restore();
            });

            it('doesn\'t call showMonitoring without an actively selected Server', function() {
                App.activeServer = undefined;
                dashboardLayout.render();
                (showMonitoringSpy).should.not.have.been.called;
            });

            it('calls showMonitoring when a Server is actively selected', function() {
                App.activeServer = fakeServer;
                dashboardLayout.render();
                (showMonitoringSpy).should.have.been.called;
            });

        });
    });
});
