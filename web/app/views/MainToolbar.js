define(['jquery',
        'underscore',
        'marionette',
        'App',
        'models/Server',
        'collections/ServerList',
        'views/modal/AddEditServer',
        'text!views/templates/main-toolbar.html'], function (
        $,
        _,
        Marionette,
        App,
        Server,
        ServerList,
        AddEditServerModal,
        mainToolbarTpl) {

    return Marionette.ItemView.extend({
        template: _.template(mainToolbarTpl),
        tagName: 'header',
        id: 'main-toolbar',

        bindings: {
            'select.server-select-toggle': {
                observe: 'server_id',
                updateModel: function(val, event, options) {
                    if(val === null) {
                        App.vent.trigger('server:disconnect');
                    } else {
                        var server = this.options.servers.get(val);
                        App.reqres.request('server:set', server);
                    }
                    return true;
                },
//                afterUpdate: function($el, val, options) {
//                    var active_server = this.options.servers.findWhere({id: val});
//                    if(active_server && this.model.id === active_server.id) {
//                        App.vent.trigger('server:reconnect', active_server);
//                    }
//                },
                selectOptions: {
                    collection: 'this.options.servers',
                    labelPath: 'name',
                    valuePath: 'id',
                    defaultOption: {
                        label: 'Select Server',
                        value: null
                    }
                }
            }
        },

        events: {
            'click .toolbar-nav li': 'onClickIcon'
        },

        ui: {
            navItems: 'a.nav'
        },

        triggers: {
            'click .toolbar-server_rack a': 'server:click'
        },

        initialize: function(options) {
            this.model = new Backbone.Model({'server_id': null});
            App.vent.on('server:disconnected', this.onActiveServerDisconnect, this);
            App.vent.on('server:changed', this.onActiveServerChange, this);
//            this.listenTo(this.options.servers, 'add', )
        },

        toggleToolbarItems: function(enabled) {
            if(enabled) {
                this.ui.navItems.removeClass('disabled');
            } else {
                this.ui.navItems.addClass('disabled');
            }
        },

        onClickIcon: function(e) {
            // consider making these buttons instead of links
            if($(e.target).hasClass('disabled')) {
                e.preventDefault();
                e.stopPropagation();
            }
        },

        onRender: function() {
            this.stickit();
        },

        onServerClick: function() {
            var id = this.model.get('server_id');
            var server = (id === null) ? new Server() : this.options.servers.get(id);
            App.execute('modal:show', new AddEditServerModal({
                operationLabel: server.isNew() ? 'Add' : 'Edit',
                model: server,
                serverList: this.options.servers,
                toolbarModel: this.model,
            }));
        },

        onServerAdd: function() {

            this.$('.server-select-toggle').prop('selectedIndex', 0);
        },

        onActiveServerChange: function(server) {
            this.toggleToolbarItems(true);
        },

        onActiveServerDisconnect: function(server) {
            this.$('.server-select-toggle').prop('selectedIndex', 0);
            this.toggleToolbarItems(false);
        },
    });
});
