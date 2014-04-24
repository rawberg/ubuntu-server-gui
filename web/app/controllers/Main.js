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
            this.controllerTriggers = new Backbone.Wreqr.Commands();
            this.controllerTriggers.setHandler('filemanager:file:click', this._editor, this);
        },

        dashboard: function() {
            var dashboardLayout = this.dashboardLayout = new DashboardLayout();
            this.App.mainViewport.show(dashboardLayout);
        },

        _editor: function(filePath) {
            var editorLayout = new EditorLayout();
            this.App.mainViewport.show(editorLayout);
        },

        filemanager: function() {
            var fileManagerLayout = this.fileManagerLayout = new FileManagerLayout({controllerTriggers: this.controllerTriggers});
            this.App.mainViewport.show(fileManagerLayout);
        }
    });

});
