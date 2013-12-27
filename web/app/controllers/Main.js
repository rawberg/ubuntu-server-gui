define(function (require_browser) {
    var _ = require_browser('underscore'),
        App = require_browser('App'),
        BaseController = require_browser('controllers/Base'),

        DashboardLayout = require_browser('views/dashboard/Dashboard').DashboardLayout,
        FileManagerLayout = require_browser('views/filemanager/FileManager').FileManagerLayout,

        LeftSidebarView = require_browser('views/dashboard/LeftSidebar').LeftSidebar,
        ServerListCollection = require_browser('collections/ServerList');

    return BaseController.extend({
        initialize: function() {
            this.App = App;
            BaseController.prototype.initialize.apply(this, arguments);
        },

        _sidebarLeft: function(sidebarRegion) {
            var serverList = new ServerListCollection(),
                leftsidebarView = new LeftSidebarView({collection: serverList});

            sidebarRegion.show(leftsidebarView);

            serverList.fetch({success: _.bind(function() {
                if(serverList.length === 0) {
                    this.App.vent.trigger('noobtour:activate');
                }
            }, this)});
        },

        dashboard: function() {
            var dashboardLayout = this.dashboardLayout = new DashboardLayout();
            this.App.mainViewport.show(dashboardLayout);
        },

        filemanager: function() {
            var fileManagerLayout = this.fileManagerLayout = new FileManagerLayout();
            this.App.mainViewport.show(fileManagerLayout);
        }
    });

});
