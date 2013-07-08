define(function (require_browser) {
    var _ = require_browser('underscore'),
        App = require_browser('App'),
        BaseController = require_browser('controllers/Base'),

        DashboardLayout = require_browser('views/dashboard/Dashboard').DashboardLayout,
        FileManagerLayout = require_browser('views/filemanager/FileManager').FileManagerLayout,
        MainFooterbar = require_browser('views/MainFooterbar'),
        MainToolbar = require_browser('views/MainToolbar'),

        LeftSidebarView = require_browser('views/dashboard/LeftSidebar').LeftSidebar,
        ServerListCollection = require_browser('collections/ServerList');

    return BaseController.extend({
        initialize: function() {
            this.App = App;
            BaseController.prototype.initialize.apply(this, arguments);
        },

        _commonToolbars: function() {
            var toolbarView = new MainToolbar(),
                footerbarView = new MainFooterbar();

            this.App.mainToolbar.show(toolbarView);
            this.App.mainFooterbar.show(footerbarView);
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
            this._commonToolbars();

            this.App.mainViewport.show(dashboardLayout);
            this._sidebarLeft(dashboardLayout.sidebarLeftRegion);
        },

        filemanager: function() {
            var fileManagerLayout = this.fileManagerLayout = new FileManagerLayout();
            this._commonToolbars();

            this.App.mainViewport.show(fileManagerLayout);
            this._sidebarLeft(fileManagerLayout.sidebarLeftRegion);
        }
    });

});
