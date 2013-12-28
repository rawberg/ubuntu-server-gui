define(function (require_browser, exports, module) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        App = require_browser('App'),
    // Models & Collections
        NetServices = require_browser('collections/NetServices'),
        PlatformInfo = require_browser('models/PlatformInfo'),
        ServerConnection = require_browser('models/ServerConnection'),
        ServerOverview = require_browser('models/ServerOverview'),
    // Views
        PlatformStatsView = require_browser('views/dashboard/PlatformStats'),
        RunningServicesView = require_browser('views/dashboard/RunningServices'),
        UtilizationStatsView = require_browser('views/dashboard/UtilizationStats'),
        ServerConnectionModal = require_browser('views/modal/ServerConnectionView'),

        dashboardLayoutTpl = require_browser('text!views/dashboard/templates/layout.html');

    module.exports.DashboardLayout = Marionette.Layout.extend({
        template: _.template(dashboardLayoutTpl),
        id: 'dashboard_layout',

        regions: {
            sidebarLeftRegion: '#sidebar_left',
            performanceRegion: '#dash_performance',
            platformRegion: '#dash_platform'
        },

        initialize: function(options) {
            App.vent.on('server:selected', this.onServerSelected, this);
            App.vent.on('server:connected', this.transitionToShowMonitoring, this);
        },

        close: function() {
            App.vent.off('server:selected', this.onServerSelected);
            App.vent.off('server:connected', this.transitionToShowMonitoring);
        },

        onRender: function() {
            var activeServer = App.getActiveServer();
            if(activeServer.get('ipv4') !== null) {
                this.showMonitoring(activeServer);
            }
        },

        onServerSelected: function(server) {
            var serverConnection = new ServerConnection(_.extend({connection_status: 'connecting'}, server.toJSON()), {server: server});
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
