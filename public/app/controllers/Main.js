define(function (require) {
    var _ = require('underscore'),
        App = require('App'),
        Backbone = require('backbone'),
        BaseController = require('controllers/Base'),

        DashboardLayout = require('views/dashboard/Dashboard'),
        MainFooterbar = require('views/MainFooterbar'),
        MainToolbar = require('views/MainToolbar'),

        LeftSidebarView = require('views/dashboard/LeftSidebar'),
        NetServicesCollection = require('collections/NetServices'),
        PlatformInfoModel = require('models/PlatformInfo'),
        PlatformStatsView = require('views/dashboard/PlatformStats'),

        RunningServicesView = require('views/dashboard/RunningServices'),
        ServerListCollection = require('collections/ServerList'),
        UtilizationStatsView = require('views/dashboard/UtilizationStats');

    return BaseController.extend({
        initialize: function() {
            this.App = App;
            BaseController.prototype.initialize.apply(this, arguments);
        },

        dashboard: function() {
            var serverList = new ServerListCollection(),
                netServices = new NetServicesCollection(),
                platformInfo = new PlatformInfoModel();

            var toolbarView = new MainToolbar(),
                footerbarView = new MainFooterbar(),
                leftsidebarView = new LeftSidebarView({collection: serverList}),
                platformStatsView = new PlatformStatsView({model: platformInfo}),
                runningServicesView = new RunningServicesView({collection: netServices}),
                utilizationView = new UtilizationStatsView(),
                dashboardLayout = new DashboardLayout();

            this.App.mainToolbar.show(toolbarView);
            this.App.mainFooterbar.show(footerbarView);
            this.App.mainViewport.show(dashboardLayout);

            dashboardLayout.sidebarLeftRegion.show(leftsidebarView);
            dashboardLayout.platformRegion.show(platformStatsView);
            dashboardLayout.servicesRegion.show(runningServicesView);
            dashboardLayout.performanceRegion.show(utilizationView);

            netServices.fetch();
            serverList.fetch();
        }
    });

});
