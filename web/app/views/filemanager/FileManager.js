define(function (require_browser, exports, module) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        App = require_browser('App'),
        moment = require_browser('moment'),
        filesize = require_browser('filesize'),

    // Models & Collections
        DirectoryExplorer = require_browser('models/DirectoryExplorer'),
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
        tagName: 'tr',

        triggers: {
            'click .filename': 'filename:click'
        },

        bindings: {
            '.filename': 'filename',
            '.timestamp': {
                observe: 'mtime',
                onGet: function(val, options) {
                    return moment.unix(val).format('llll');
                }
            },
            '.size': {
                observe: 'size',
                onGet: function(val, options) {
                    return val ? filesize(val, true) : '';
                }
            },
            'i': {
                attributes: [{
                    name: 'class',
                    observe: 'mode',
                    onGet: function(val, options) {
                        return 'icon-mode-' + val;
                    }
                }]
            }
        },

        onRender: function() {
            this.stickit();
        }
    });

    var DirectoryExplorerView = module.exports.DirectoryExplorerView = Marionette.CompositeView.extend({
        template: _.template(directoryExplorerTpl),
        tagName: 'table',
        className: 'directory-explorer table-striped',
        itemView: DirectoryItemView,
        itemViewContainer: 'tbody',

        events: {
            'click th.column-filename': 'onSortByName',
            'click th.column-mtime': 'onSortByModified',
            'click th.column-size': 'onSortBySize'
        },

        collectionEvents: {
            'sort': 'render toggleSortCaret'
        },

        initialize: function(options) {
            this.on('itemview:filename:click', _.bind(this.onFilenameClick, this));
        },

        close: function() {
            this.off('itemview:filename:click');
        },

        onFilenameClick: function(itemView) {
            var dirObject = itemView.model;
            console.log('dirObj clicked - mode: ', dirObject.get('mode'));
            if(dirObject.get('mode') === 16877) {
                this.model.appendPath(dirObject.get('filename'));
            }
        },

        onSortByModified: function() {
            this.collection.sort({sortProperty: 'mtime'});
        },

        onSortByName: function() {
            this.collection.sort({sortProperty: 'filename'});
        },

        onSortBySize: function() {
            this.collection.sort({sortProperty: 'size'});
        },

        toggleSortCaret: function() {
            var direction = (this.collection.sortDirection === 'ASC') ? 'up' : 'down';
            this.$('th.column-' + this.collection.sortProperty + ' i').hide();
            this.$('th.column-' + this.collection.sortProperty + ' i').attr('class', 'icon-caret-' + direction).show();
        }

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
            var directoryExplorer = new DirectoryExplorer();
            var directoryContents = new DirectoryContents([], {directoryExplorer: directoryExplorer, server: server});
            var directoryExplorerView = new DirectoryExplorerView({model: directoryExplorer, collection: directoryContents});
            this.fileManagerExplorerRegion.show(directoryExplorerView);
            directoryContents.fetch();
        },

        transitionToShowFileManager: function(server) {
            this.showFileManager(server);
            _.delay(_.bind(App.closeModal, App), 1200);
        }
    });
});
