define(['jquery',
        'underscore',
        'marionette',
        'App',
        'views/modal/AddEditServer',
        'text!views/templates/main-toolbar.html'], function (
        $,
        _,
        Marionette,
        App,
        AddEditServerModal,
        mainToolbarTpl) {

    return Marionette.ItemView.extend({
        template: _.template(mainToolbarTpl),
        tagName: 'header',
        id: 'main-toolbar',

        bindings: {
            'select.server-select-toggle': {
                observe: 'cid',
                updateModel: function(val, event, options) {
                    App.setActiveServer(App.servers.get(val));
                    return false;
                },
                selectOptions: {
                    collection: 'App.servers',
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
            this.model = App.getActiveServer();
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
            App.servers.on('sync', this.reStickit, this);
            App.servers.on('add', this.reStickit, this);
        },

        onServerAddClick: function() {
            App.execute('modal:show', new AddEditServerModal({operationLabel:'Add'}));
        },

        onClose: function() {
            App.servers.off('sync', this.reStickit);
            App.servers.off('add', this.reStickit);
        },

        onActiveServerChange: function(server) {
            this.model = App.getActiveServer();
            this.toggleToolbarItems(true);
        },

        onActiveServerDisconnect: function(server) {
            this.$('.server-select-toggle').prop('selectedIndex', 0);
            this.toggleToolbarItems(false);
        },

        reStickit: function() {
            this.stickit();
        }
    });
});
