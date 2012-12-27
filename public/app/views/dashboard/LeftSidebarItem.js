define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        Server = require('models/Server'),
        leftSidebarItemTpl = require('text!views/dashboard/templates/sidebar-left-item.html')

    return Marionette.ItemView.extend({
        tagName: 'li',
        className: 'vm-small',
        template: _.template(leftSidebarItemTpl),

        onRender: function() {
            this.el.id = 'server_id_' + this.model.get('id');
        }
    });
});
