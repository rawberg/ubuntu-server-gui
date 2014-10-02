define(["jquery",
        "underscore",
        "marionette",
        "App",
        "moment",
        "filesize",
        "collections/DirectoryBreadcrumbs",
        "collections/DirectoryContents",
        "models/DirectoryExplorer",
        "models/Server",
        "models/ServerConnection",
        "views/modal/ServerConnectionView",
        "views/filemanager/DirectoryExplorerView",
        "views/filemanager/DirectoryBreadcrumbView",
        "text!views/filemanager/templates/filemanager-layout.html"], function (
        $,
        _,
        Marionette,
        App,
        moment,
        filesize,
        DirectoryBreadcrumbs,
        DirectoryContents,
        DirectoryExplorer,
        Server,
        ServerConnection,
        ServerConnectionModal,
        DirectoryExplorerView,
        DirectoryBreadcrumbView,
        fileManagerLayoutTpl) {

    return Marionette.LayoutView.extend({
        template: _.template(fileManagerLayoutTpl),
        id: "file-manager-layout",

        regions: {
            breadcrumbRegion: "#file-manager-breadcrumbs",
            explorerRegion: "#file-manager-explorer"
        },

        initialize: function(options) {
            if(typeof options.server === "undefined") {
                throw "options.server required";
            }
            options.path = options.path ? options.path : "/";
            App.serverChannel.vent.on("connected", this.onActiveServerChange, this);
        },

        onBeforeDestroy: function() {
            App.serverChannel.vent.off("connected", this.onActiveServerChange);
        },

        onFileClick: function(fileModel, path) {
            var filePath = path + fileModel.get("filename");
            App.execute("app:navigate", "editor", {
                file: fileModel.get("filename"),
                path: path
            });
        },

        onRender: function() {
            this.onActiveServerChange(this.options.server);
        },

        onActiveServerChange: function(server) {
            if(server.isConnected()) {
                this.showFileManager(server);
            }
            this.options.server = server;
        },

        showFileManager: function(server) {
            var directoryExplorer = new DirectoryExplorer({path: this.options.path});
            var directoryContents = new DirectoryContents([], {
                directoryExplorer: directoryExplorer,
                server: server});

            var directoryBreadcrumbs = new DirectoryBreadcrumbs([], {
                directoryExplorer: directoryExplorer
            });

            var directoryExplorerView = new DirectoryExplorerView({
                model: directoryExplorer,
                collection: directoryContents
            });
            this.listenTo(directoryExplorerView, "filemanager:file:click", this.onFileClick);

            var directoryBreadcrumbView = new DirectoryBreadcrumbView({
                collection: directoryBreadcrumbs,
                directoryExplorer: directoryExplorer
            });

            this.explorerRegion.show(directoryExplorerView);
            this.breadcrumbRegion.show(directoryBreadcrumbView);
            directoryContents.fetch();
            directoryBreadcrumbs.fetch();
        },
    });
});
