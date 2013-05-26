define(function (require_browser) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        Server = require_browser('models/Server'),
        leftSidebarItemTpl = require_browser('text!views/dashboard/templates/sidebar-left-item.html')

    return Marionette.ItemView.extend({
        tagName: 'li',
        className: 'vm-small',
        template: _.template(leftSidebarItemTpl),

        events: {
            'click': 'onServerClick'
        },

        onRender: function() {
            this.el.id = 'server_id_' + this.model.get('id');
        },

        onServerClick: function() {
            this.trigger('onServerClick', this.model);
        }
    });
});
