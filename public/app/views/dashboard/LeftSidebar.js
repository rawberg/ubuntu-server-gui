define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        AddEditServerModal = require('views/modal/AddEditServer'),
        App = require('App'),
        ContextMenu = require('contextmenu'),
        LeftSidebarItem = require('views/dashboard/LeftSidebarItem'),
        UsgCollectionView = require('views/UsgCollectionView'),
        RemoveServerModal = require('views/modal/RemoveServer');

    /**
     * @params {collection: ServerList}
     */
    return Marionette.CollectionView.extend({
        itemView: LeftSidebarItem,
        tagName: 'ul',
        id: 'left_sidebar_serverlist',

        events: {
            'contextmenu li': 'onServerRightClick'
        },

        initialize: function(options) {
            this.parentRegion = options.parentRegion;
            this.App = App;

            this.onRemoveServerClick = _.bind(this.onRemoveServerClick, this);
            this.onEditServerClick = _.bind(this.onEditServerClick, this);

            this.contextMenu = new ContextMenu([
                {
                    label: "Edit Server",
                    onclick: this.onEditServerClick
                }, {
                    label: "Remove Server",
                    onclick: this.onRemoveServerClick
                }
            ]);
            this.contextMenu.className = 'server-list-contextmenu';
        },

        onClose: function() {
            // remove any context menu items we may have created
            $('.server-list-contextmenu menuitem').off();
            $('.server-list-contextmenu').off().remove();
        },

        onServerRightClick: function(eventObj) {
            eventObj.preventDefault();
            eventObj.stopPropagation();
            this.contextMenu.sourceEvent = eventObj;
            ContextMenu.show(this.contextMenu, eventObj.clientX, eventObj.clientY);
        },

        onEditServerClick: function(eventObj) {
            var server;
            server = this.collection.get(this.contextMenu.sourceEvent.currentTarget.id.slice(10));
            this.App.showModal(new AddEditServerModal({
                model: server,
                operationLabel: 'Edit'
            }));
        },

        onRemoveServerClick: function(eventObj) {
            var server;
            server = this.collection.get(this.contextMenu.sourceEvent.currentTarget.id.slice(10));
            this.App.showModal(new RemoveServerModal({model: server}));
        }
    });
});
