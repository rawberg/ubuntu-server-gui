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

        RunningServicesView = require('views/dashboard/RunningServices'),
        ServerListCollection = require('collections/ServerList'),
        UtilizationStatsView = require('views/dashboard/UtilizationStats');

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
            dashboardLayout.sidebarLeftRegion.currentView.on(
                'itemview:onServerClick',
                _.bind(dashboardLayout.showMonitoring, dashboardLayout)
            );

            serverList.fetch({success: _.bind(function() {
                if(serverList.length == 0) {
                    this.App.vent.trigger('noobtour:activate');
                }
            }, this)});
        }
    });

});
