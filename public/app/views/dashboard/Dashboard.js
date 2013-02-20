define(function (require, exports, module) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        Marionette = require('marionette'),
        App = require('App'),
    // Models & Collections
        PlatformInfo = require('models/PlatformInfo'),
        ServerOverview = require('models/ServerOverview'),
        NetServices = require('collections/NetServices'),
    // Views
        PlatformStatsView = require('views/dashboard/PlatformStats'),
        RunningServicesView = require('views/dashboard/RunningServices'),
        UtilizationStatsView = require('views/dashboard/UtilizationStats'),
        ServerConnectionModal = require('views/modal/ServerConnection'),

        dashboardLayoutTpl = require('text!views/dashboard/templates/layout.html');

    require('bootstrap_modal');
    require('bootstrap_tooltip');
    require('bootstrap_popover');

    module.exports.DashboardLayout = Marionette.Layout.extend({
        template: _.template(dashboardLayoutTpl),
        id: 'dashboard_layout',

        regions: {
            sidebarLeftRegion: '#sidebar_left',
            performanceRegion: '#dash_performance',
            servicesRegion: '#dash_services',
            platformRegion: '#dash_platform'
        },

        initialize: function(options) {
            this.App = App;
            this.App.vent.on('server:connected', _.bind(function(server) {
                App.closeModal();
                this.showMonitoring(server)
            }, this));
        },

        onServerClick: function(itemView, server) {
            var serverConnection = new Backbone.Model(_.extend({connection_status: 'connecting'}, server.toJSON()), {});
            App.showModal(new ServerConnectionModal({model: serverConnection}));
            server.wsConnect(serverConnection);
        },

        showMonitoring: function(serverModel) {
            var platformStatsView = new PlatformStatsView({
                model: new PlatformInfo({}, {server: serverModel})
            });
            var utilizationView = new UtilizationStatsView({
                model: new ServerOverview({}, {server: serverModel})
            });
            var runningServicesView = new RunningServicesView({
                collection: new NetServices([], {server: serverModel})
            });

            this.platformRegion.show(platformStatsView);
            this.servicesRegion.show(runningServicesView);
            this.performanceRegion.show(utilizationView);
        }
    });
});
