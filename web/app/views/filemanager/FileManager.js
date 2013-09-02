define(function (require_browser, exports, module) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        App = require_browser('App'),
    // Models & Collections
        DirectoryContents = require_browser('collections/DirectoryContents').DirectoryContents,
        Server = require_browser('models/Server'),
        ServerConnection = require_browser('models/ServerConnection'),
    // Views
        ServerConnectionModal = require_browser('views/modal/ServerConnectionView'),
    // Templates
        fileManagerLayoutTpl = require_browser('text!views/filemanager/templates/filemanager-layout.html'),
        directoryExplorerTpl = require_browser('text!views/filemanager/templates/directory-explorer.html'),
        directoryItemTpl = require_browser('text!views/filemanager/templates/directory-item.html');

    var DirectoryItemView = module.exports.DirectoryItemView = Marionette.ItemView.extend({
        template: _.template(directoryItemTpl),
        tagName: 'tr'
    });

    var DirectoryExplorerView = module.exports.DirectoryExplorerView = Marionette.CompositeView.extend({
        template: _.template(directoryExplorerTpl),
        tagName: 'table',
        className: 'directory-explorer table-striped',
        itemView: DirectoryItemView,
        itemViewContainer: 'tbody'
    });

    module.exports.FileManagerLayout = Marionette.Layout.extend({
        template: _.template(fileManagerLayoutTpl),
        id: 'file-manager-layout',

        regions: {
            sidebarLeftRegion: '#sidebar_left',
            fileManagerHeaderRegion: '#file-manager-header',
            fileManagerExplorerRegion: '#file-manager-explorer'
        },

        initialize: function(options) {
            App.vent.on('server:selected', this.onServerSelected, this);
            App.vent.on('server:connected', this.transitionToShowFileManager, this);
        },

        close: function() {
            App.vent.off('server:selected', this.onServerSelected);
            App.vent.off('server:connected', this.transitionToShowFileManager);
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

        showFileManager: function(server) {
            var directoryContents = new DirectoryContents([], {server: server});
            var directoryExplorer = new DirectoryExplorerView({collection: directoryContents});
            this.fileManagerExplorerRegion.show(directoryExplorer);
            directoryContents.fetch();
        },

        transitionToShowFileManager: function(server) {
            this.showFileManager(server);
            _.delay(_.bind(App.closeModal, App), 1200);
        }
    });
});
