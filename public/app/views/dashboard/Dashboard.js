define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        // Models & Collections
        PlatformInfo = require('models/PlatformInfo'),
        ServerOverview = require('models/ServerOverview'),
        NetServices = require('collections/NetServices'),
        // Views
        PlatformStatsView = require('views/dashboard/PlatformStats'),
        RunningServicesView = require('views/dashboard/RunningServices'),
        UtilizationStatsView = require('views/dashboard/UtilizationStats'),

        dashboardLayoutTpl = require('text!views/dashboard/templates/layout.html');

    require('bootstrap_modal');
    require('bootstrap_tooltip');
    require('bootstrap_popover');

    return Marionette.Layout.extend({
        template: _.template(dashboardLayoutTpl),
        id: 'dashboard_layout',

        regions: {
            sidebarLeftRegion: '#sidebar_left',
            performanceRegion: '#dash_performance',
            servicesRegion: '#dash_services',
            platformRegion: '#dash_platform'
        },

        showMonitoring: function(itemView, serverModel) {
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
