define(function (require_browser, exports, module) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Backbone = require_browser('backbone'),
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

    require_browser('bootstrap_modal');
    require_browser('bootstrap_tooltip');
    require_browser('bootstrap_popover');

    module.exports.DashboardLayout = Marionette.Layout.extend({
        template: _.template(dashboardLayoutTpl),
        id: 'dashboard_layout',

        regions: {
            sidebarLeftRegion: '#sidebar_left',
            performanceRegion: '#dash_performance',
            platformRegion: '#dash_platform'
            //            servicesRegion: '#dash_services',
        },

        initialize: function(options) {
            App.vent.on('server:connected', _.bind(function(server) {
                this.showMonitoring(server);
                _.delay(_.bind(App.closeModal, App), 1200);
            }, this));

            this.sidebarLeftRegion.on('show', _.bind(function(view) {
                view.on('itemview:onServerClick', _.bind(this.onServerClick, this));
            }, this));
        },

        onServerClick: function(itemView, server) {
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

//            var runningServicesView = new RunningServicesView({
//                collection: new NetServices([], {server: serverModel})
//            });

            this.platformRegion.show(platformStatsView);
            this.performanceRegion.show(utilizationView);
//            this.servicesRegion.show(runningServicesView);
        }
    });
});
