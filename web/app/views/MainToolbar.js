define(['jquery',
        'underscore',
        'backbone',
        'marionette',
        'text!views/templates/main-toolbar.html'], function (
        $,
        _,
        Backbone,
        Marionette,
        mainToolbarTpl) {

    return Marionette.ItemView.extend({
        template: _.template(mainToolbarTpl),
        tagName: 'header',
        id: 'main-toolbar',

        bindings: {
            'select.server-select-toggle': {
                observe: 'cid',
                updateModel: function(val, event, options) {
                    this.App.setActiveServer(this.App.servers.get(val));
                    return false;
                },
                selectOptions: {
                    collection: 'this.App.servers',
                    labelPath: 'name',
                    valuePath: 'id',
                    defaultOption: {name: 'Select/Add Server', label: 'Select/Add Server', value: null}
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
            this.App = options.App;
            this.model = this.App.getActiveServer();
            this.App.vent.on('server:disconnected', this.onActiveServerDisconnect, this);
            this.App.vent.on('active-server:changed', this.onActiveServerChange, this);
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
            this.App.servers.on('sync', this.reStickit, this);
            this.App.servers.on('add', this.reStickit, this);
        },

        onClose: function() {
            this.App.servers.off('sync', this.reStickit);
            this.App.servers.off('add', this.reStickit);
        },

        onActiveServerChange: function(server) {
            this.model = this.App.getActiveServer();
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
