define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        PlatformInfoModel = require('models/PlatformInfo'),
        PlatformStatsView = require('views/dashboard/PlatformStats'),
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
//            var netServices = new NetServicesCollection(),
            var platformInfo = new PlatformInfoModel({}, {server: serverModel});
            var platformStatsView = new PlatformStatsView({model: platformInfo});

//                runningServicesView = new RunningServicesView({collection: netServices}),
//                utilizationView = new UtilizationStatsView();
//
            this.platformRegion.show(platformStatsView);
//            this.dashboardLayout.servicesRegion.show(runningServicesView);
//            this.dashboardLayout.performanceRegion.show(utilizationView);
        }
    });
});
