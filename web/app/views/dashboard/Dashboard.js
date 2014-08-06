define(['jquery',
        'underscore',
        'marionette',
        'App',
        'collections/NetServices',
        'models/PlatformInfo',
        'models/ServerConnection',
        'models/ServerOverview',
        'views/dashboard/PlatformStats',
        'views/dashboard/RunningServices',
        'views/dashboard/UtilizationStats',
        'views/modal/ServerConnectionView',
        'text!views/dashboard/templates/layout.html'], function (
        $,
        _,
        Marionette,
        App,
        // Models & Collections
        NetServices,
        PlatformInfo,
        ServerConnection,
        // Views
        ServerOverview,
        PlatformStatsView,
        RunningServicesView,
        UtilizationStatsView,
        ServerConnectionModal,
        dashboardLayoutTpl) {

    return Marionette.LayoutView.extend({
        template: _.template(dashboardLayoutTpl),
        id: 'dashboard_layout',

        regions: {
            performanceRegion: '#dash_performance',
            platformRegion: '#dash_platform'
        },

        initialize: function(options) {
            App.vent.on('active-server:changed', this.onActiveServerChange, this);
            App.vent.on('server:connected', this.transitionToShowMonitoring, this);
        },

        close: function() {
            App.vent.off('server:selected', this.onServerSelected);
            App.vent.off('server:connected', this.transitionToShowMonitoring);
        },

        onRender: function() {
            var activeServer = App.reqres.request('active-server:get');
            if(activeServer.get('ipv4') !== null) {
                this.showMonitoring(activeServer);
            }
        },

        onActiveServerChange: function(server) {
            // TODO: make sure previously connected server is disconnected
            var serverConnection = new ServerConnection({}, {server: server});
            App.showModal(new ServerConnectionModal({model: serverConnection}));
            serverConnection.connect();
        },

        showMonitoring: function(serverModel) {
            var platformStatsView = new PlatformStatsView({
                model: new PlatformInfo({}, {server: serverModel})
            });

            var utilizationView = new UtilizationStatsView({
                model: new ServerOverview({}, {server: serverModel})
            });

            this.platformRegion.show(platformStatsView);
            this.performanceRegion.show(utilizationView);
        },

        transitionToShowMonitoring: function(server) {
            this.showMonitoring(server);
            _.delay(_.bind(App.closeModal, App), 1200);
        }
    });
});
