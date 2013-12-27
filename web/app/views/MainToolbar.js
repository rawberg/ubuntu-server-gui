define(function (require_browser) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Backbone = require_browser('backbone'),
        Marionette = require_browser('marionette'),
        mainToolbarTpl = require_browser('text!views/templates/main-toolbar.html');

    return Marionette.ItemView.extend({
        template: _.template(mainToolbarTpl),
        tagName: 'header',
        id: 'main-toolbar',

        bindings: {
            'select.server-select-toggle': {
                observe: 'activeServer',
                selectOptions: {
                    collection: 'this.servers',
                    labelPath: 'name',
                    defaultOption: {name: 'Select/Add Server', label: 'Select/Add Server', value: null}
                }
            }
        },

        events: {
            'click #toolbar_nav li': 'onClickIcon'
        },

        triggers: {
            'click .toolbar-server_rack a': 'server:add:click'
        },

        initialize: function(options) {
            this.model = options.model = new Backbone.Model({activeServer:null});
            this.servers = options.servers;
            this.servers.fetch();
        },

        highlightIcon: function(iconClass) {
            this.$('#toolbar_nav li').removeClass('active');
            this.$('li.' + iconClass).addClass('active');
        },

        onClickIcon: function(e) {
            this.highlightIcon(e.target.className);
        },

        onRender: function() {
            this.stickit();
//            this.model.set('activeServer', 0);
        }
    });
});
