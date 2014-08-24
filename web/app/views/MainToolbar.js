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
                observe: 'id',
                updateModel: function(val, event, options) {
                    var server = new Server();
                    if(val === null) {
                        App.vent.trigger('server:disconnect');
                        this.onActiveServerDisconnect();
                    } else {
                        server = this.options.servers.get(val);
                    }
                    App.reqres.request('server:set', server);
                    return false;
                },
                afterUpdate: function($el, val, options) {
//                    var active_server = this.options.servers.findWhere({id: val});
//                    if(active_server && this.model.id === active_server.id) {
//                        App.vent.trigger('server:reconnect', active_server);
//                    }
                },
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
            App.vent.on('server:disconnected', this.onActiveServerDisconnect, this);
            App.vent.on('server:changed', this.onActiveServerChange, this);
            App.vent.on('server:add', function(server) {
                App.vent.trigger('server:reconnect', server);
            }, this);
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
            App.execute('modal:show', new AddEditServerModal({
                operationLabel: this.model.isNew() ? 'Add' : 'Edit',
                model: this.model
            }));
        },

        onActiveServerChange: function(server) {
            this.unstickit(this.model);
            this.model.off();

            this.model = App.reqres.request('server:get');
            this.stickit();
            this.listenTo(this.model, 'change:name', this.updateServerSelectionList);
            this.toggleToolbarItems(true);
        },

        onActiveServerDisconnect: function(server) {
            this.$('.server-select-toggle').prop('selectedIndex', 0);
            this.toggleToolbarItems(false);
        },

        updateServerSelectionList: function() {
            // workaround for stickit not exposing refreshSelectOptions
            // serverSelectList is updated and current server remains selected
            this.model.trigger('change:id', this.model, this.model.id);
        }
    });
});
