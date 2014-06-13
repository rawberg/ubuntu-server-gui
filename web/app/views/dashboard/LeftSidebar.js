define(['jquery',
        'underscore',
        'marionette',
        'views/modal/AddEditServer',
        'contextmenu',
        'views/modal/RemoveServer',
        'text!views/dashboard/templates/sidebar-left-item.html'], function (
        $,
        _,
        Marionette,
        AddEditServerModal,
        ContextMenu,
        RemoveServerModal,
        leftSidebarItemTpl) {

    var LeftSidebarItem = Marionette.ItemView.extend({
        tagName: 'li',
        className: 'vm-small',
        template: _.template(leftSidebarItemTpl),

        triggers: {
            'click': 'onServerClick'
        },

        onRender: function() {
            this.el.id = 'server_id_' + this.model.get('id');
        }
    });


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
            this.on('itemview:onServerClick', this.onServerClick, this);

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

        onServerClick: function(eventObj) {
            App.vent.trigger('server:selected', eventObj.model);
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
