define(['jquery',
        'underscore',
        'marionette',
        'App',
        'moment',
        'filesize',
        'collections/DirectoryBreadcrumbs',
        'collections/DirectoryContents',
        'models/DirectoryExplorer',
        'models/Server',
        'models/ServerConnection',
        'views/modal/ServerConnectionView',
        'views/filemanager/DirectoryExplorerView',
        'views/filemanager/DirectoryBreadcrumbView',
        'text!views/filemanager/templates/filemanager-layout.html'], function (
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

    return Marionette.Layout.extend({
        template: _.template(fileManagerLayoutTpl),
        id: 'file-manager-layout',

        regions: {
            breadcrumbRegion: '#file-manager-breadcrumbs',
            explorerRegion: '#file-manager-explorer'
        },

        initialize: function(options) {
            if(typeof options.controllerTriggers === 'undefined') {
                throw 'controllerTriggers is a required option';
            }
            options.path = options.path ? options.path : '/';
            App.vent.on('server:selected', this.onServerSelected, this);
            App.vent.on('server:connected', this.transitionToShowFileManager, this);
        },

        close: function() {
            App.vent.off('server:selected', this.onServerSelected);
            App.vent.off('server:connected', this.transitionToShowFileManager);
        },

        onFileClick: function(fileModel, path) {
            var filePath = path + fileModel.get('filename');
            this.options.controllerTriggers.execute('navigate', 'editor', {
                file: fileModel.get('filename'),
                path: path
            });
        },

        onRender: function() {
            var activeServer = App.getActiveServer();
            if(activeServer) {
                this.showFileManager(activeServer);
            }
        },

        onServerSelected: function(server) {
            var serverConnection = new ServerConnection({}, {server: server});
            App.showModal(new ServerConnectionModal({model: serverConnection}));
            serverConnection.connect();
        },

        onShow: function() {
          this.showFileManager(App.getActiveServer());
        },

        showFileManager: function(server) {
            var directoryExplorer = new DirectoryExplorer({path: this.options.path});
            var directoryContents = new DirectoryContents([], {directoryExplorer: directoryExplorer, server: server});
            var directoryBreadcrumbs = new DirectoryBreadcrumbs([], {directoryExplorer: directoryExplorer});

            var directoryExplorerView = new DirectoryExplorerView({model: directoryExplorer, collection: directoryContents});
            this.listenTo(directoryExplorerView, 'filemanager:file:click', this.onFileClick);

            var directoryBreadcrumbView = new DirectoryBreadcrumbView({collection: directoryBreadcrumbs, directoryExplorer: directoryExplorer});

            this.explorerRegion.show(directoryExplorerView);
            this.breadcrumbRegion.show(directoryBreadcrumbView);
            directoryContents.fetch();
            directoryBreadcrumbs.fetch();
        },

        transitionToShowFileManager: function(server) {
            this.showFileManager(server);
            _.delay(_.bind(App.closeModal, App), 1200);
        }
    });
});
