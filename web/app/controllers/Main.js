define(function (require_browser) {
    var _ = require_browser('underscore'),
        App = require_browser('App'),
        Backbone = require_browser('backbone'),
        BaseController = require_browser('controllers/Base'),

        DashboardLayout = require_browser('views/dashboard/Dashboard').DashboardLayout,
        MainFooterbar = require_browser('views/MainFooterbar'),
        MainToolbar = require_browser('views/MainToolbar'),

        LeftSidebarView = require_browser('views/dashboard/LeftSidebar'),
        NetServicesCollection = require_browser('collections/NetServices'),

        RunningServicesView = require_browser('views/dashboard/RunningServices'),
        ServerListCollection = require_browser('collections/ServerList'),
        UtilizationStatsView = require_browser('views/dashboard/UtilizationStats');

    return BaseController.extend({
        initialize: function() {
            this.App = App;
            BaseController.prototype.initialize.apply(this, arguments);
        },

        dashboard: function() {
            var serverList = new ServerListCollection();

            var toolbarView = new MainToolbar(),
                footerbarView = new MainFooterbar(),
                leftsidebarView = new LeftSidebarView({collection: serverList});

            var dashboardLayout = this.dashboardLayout = new DashboardLayout();

            this.App.mainToolbar.show(toolbarView);
            this.App.mainFooterbar.show(footerbarView);
            this.App.mainViewport.show(dashboardLayout);

            dashboardLayout.sidebarLeftRegion.show(leftsidebarView);

            serverList.fetch({success: _.bind(function() {
                if(serverList.length === 0) {
                    this.App.vent.trigger('noobtour:activate');
                }
            }, this)});
        }
    });

});
