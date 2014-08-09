define(['underscore',
        'App',
        'controllers/Base',
        'views/MainFooterbar',
        'views/MainToolbar',
        'views/dashboard/Dashboard',
        'views/editor/Editor',
        'views/filemanager/FileManager',
        'collections/ServerList'], function (
        _,
        App,
        BaseController,
        MainFooterbar,
        MainToolbar,
        DashboardLayout,
        EditorLayout,
        FileManagerLayout,
        ServerList) {

    return BaseController.extend({
        _toolbars: function() {
            this.serverList = new ServerList();

            this.mainToolbar = this.mainToolbar ? this.mainToolbar : new MainToolbar({
                model: App.getActiveServer(),
                servers: this.serverList
            });
            this.serverList.fetch();

            this.mainFooterbar = this.mainFooterbar ? this.mainFooterbar : new MainFooterbar();

            App.mainToolbar.show(this.mainToolbar);
            App.mainFooterbar.show(this.mainFooterbar);
        },

        dashboard: function() {
            this._toolbars();
            this.dashboardLayout = new DashboardLayout();
            App.mainViewport.show(this.dashboardLayout);
        },

        editor: function(options) {
            this._toolbars();
            var server = App.getActiveServer();
            var filePath = options.path + options.file;

            server.connection.readStream(filePath, _.bind(function(err, fileContents) {
                if(typeof err === 'undefined') {
                    var editorLayout = new EditorLayout({
                        server: App.getActiveServer(),
                        fileName: options.file,
                        fileContents: fileContents,
                        dirPath: options.path
                    });
                    Backbone.history.navigate("#editor", {trigger: false, replace: true});
                    App.mainViewport.show(editorLayout);
                }
            }, this));
        },

        filemanager: function(dirPath) {
            this._toolbars();
            dirPath = dirPath ? dirPath: '/';

            this.fileManagerLayout = new FileManagerLayout({path: dirPath});
            // TODO don't force show, just make sure events get re-bound
            App.mainViewport.show(this.fileManagerLayout, {forceShow: true});
        }
    });

});
