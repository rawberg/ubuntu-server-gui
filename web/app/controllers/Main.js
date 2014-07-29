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
        ServerListCollection) {

    return BaseController.extend({
        initialize: function() {
            BaseController.prototype.initialize.apply(this, arguments);
        },

        _toolbars: function() {
            App.mainToolbar.show(new MainToolbar());
            App.mainFooterbar.show(new MainFooterbar());
        },

        dashboard: function() {
            this._toolbars();
            var dashboardLayout = this.dashboardLayout = new DashboardLayout();
            App.mainViewport.show(dashboardLayout);
        },

        editor: function(options) {
            this._toolbars();
            var server = App.getActiveServer();
            var filePath = options.path + options.file;

            server.connection.readStream(filePath, _.bind(function(err, fileContents) {
                if(typeof err === 'undefined') {
                    var editorLayout = new EditorLayout({
                        controllerTriggers: this.controllerTriggers,
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
            var fileManagerLayout = this.fileManagerLayout = new FileManagerLayout({
                controllerTriggers: this.controllerTriggers,
                path: dirPath
            });
            App.mainViewport.show(fileManagerLayout);
        }
    });

});
