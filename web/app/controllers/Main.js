define(function (require_browser) {
    var _ = require_browser('underscore'),
        App = require_browser('App'),
        BaseController = require_browser('controllers/Base'),
        DashboardLayout = require_browser('views/dashboard/Dashboard').DashboardLayout,
        EditorLayout = require_browser('views/editor/Editor').EditorLayout,
        FileManagerLayout = require_browser('views/filemanager/FileManager').FileManagerLayout,
        ServerListCollection = require_browser('collections/ServerList');

    return BaseController.extend({
        initialize: function() {
            this.App = App;
            BaseController.prototype.initialize.apply(this, arguments);
        },

        dashboard: function() {
            var dashboardLayout = this.dashboardLayout = new DashboardLayout();
            this.App.mainViewport.show(dashboardLayout);
        },

        editor: function(options) {
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
                    this.App.mainViewport.show(editorLayout);
                }
            }, this));
        },

        filemanager: function(dirPath) {
            var fileManagerLayout = this.fileManagerLayout = new FileManagerLayout({
                controllerTriggers: this.controllerTriggers,
                path: dirPath
            });
            this.App.mainViewport.show(fileManagerLayout);
        }
    });

});
