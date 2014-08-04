define(['jquery',
        'underscore',
        'marionette',
        'App',
        'collections/ServerList',
        'views/modal/AddEditServer',
        'text!views/templates/main-toolbar.html'], function (
        $,
        _,
        Marionette,
        App,
        ServerList,
        AddEditServerModal,
        mainToolbarTpl) {

    return Marionette.ItemView.extend({
        template: _.template(mainToolbarTpl),
        tagName: 'header',
        id: 'main-toolbar',

        bindings: {
            'select.server-select-toggle': {
                updateModel: function(val, event, options) {
                    App.reqres.request('active-server:set', this.options.servers.get(val));
                    return false;
                },
                observe: 'cid',
                selectOptions: {
                    collection: 'this.options.servers',
                    labelPath: 'name',
                    valuePath: 'id',
                    defaultOption: {name: 'Select Server', label: 'Select Server', value: null}
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
            'click .toolbar-server_rack a': 'server:add:click'
        },

        initialize: function(options) {
            App.vent.on('server:disconnected', this.onActiveServerDisconnect, this);
            App.vent.on('active-server:changed', this.onActiveServerChange, this);
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

        onServerAddClick: function() {
            App.execute('modal:show', new AddEditServerModal({operationLabel:'Add'}));
        },

        onActiveServerChange: function(server) {
            this.model = App.reqres.request('active-server:get');
            this.toggleToolbarItems(true);
        },

        onActiveServerDisconnect: function(server) {
            this.$('.server-select-toggle').prop('selectedIndex', 0);
            this.toggleToolbarItems(false);
        },
    });
});
