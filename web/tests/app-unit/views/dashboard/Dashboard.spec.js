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
        ServerList = requirejs('collections/ServerList'),
    // Views
        DashboardLayout = requirejs('views/dashboard/Dashboard'),
        ServerConnectionModal = requirejs('views/modal/ServerConnectionView'),
        LeftSidebarView = requirejs('views/dashboard/LeftSidebar'),
        PlatformStatsView = requirejs('views/dashboard/PlatformStats'),
        RunningServicesView = requirejs('views/dashboard/RunningServices'),
        UtilizationStatsView = requirejs('views/dashboard/UtilizationStats');



    describe('Dashboard', function() {
        var dashboardLayout, fakeServerOne, fakeServerTwo;
        var showMonitoringSpy;

        beforeEach(function() {
            App._initCallbacks.run(undefined, App);

            fakeServerOne = new Server({
                id: "1111",
                name: "Server One",
            });
            fakeServerTwo = new Server({
                id: "2222",
                name: "Server Two",
            });

            showMonitoringSpy = spyOn(DashboardLayout.prototype, 'showMonitoring');
            spyOn(PlatformInfo.prototype, 'fetch');
            spyOn(ServerOverview.prototype, 'fetch');
        });

        afterEach(function() {
            App._initCallbacks.reset();
        });

        describe('onRender', function() {
            it("doesn't call showMonitoring without an actively connected Server", function() {
                fakeServerTwo.isConnected = jasmine.createSpy('isConnected').and.returnValue(false);
                dashboardLayout = new DashboardLayout({server: fakeServerTwo});
                dashboardLayout.render();
                expect(showMonitoringSpy).not.toHaveBeenCalled();
            });

            it('calls showMonitoring when a Server is actively connected', function() {
                fakeServerOne.isConnected = jasmine.createSpy('isConnected').and.returnValue(true);
                dashboardLayout = new DashboardLayout({server: fakeServerOne});
                dashboardLayout.render();
                expect(showMonitoringSpy).toHaveBeenCalled();
            });
        });

        describe('showMonitoring', function() {
            it('call showMonitoring when server connected channel event fires', function() {
                fakeServerOne.isConnected = jasmine.createSpy('isConnected').and.returnValue(true);
                dashboardLayout = new DashboardLayout({server: fakeServerTwo});
                dashboardLayout.render();
                expect(showMonitoringSpy).not.toHaveBeenCalled();
                App.serverChannel.vent.trigger('connected', fakeServerOne);
                expect(showMonitoringSpy).toHaveBeenCalled();
            });
        });
    });
});
