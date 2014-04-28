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
            var editorLayout = new EditorLayout({
                controllerTriggers: this.controllerTriggers,
                file: options.file,
                path: options.path
            });
            this.App.mainViewport.show(editorLayout);
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
