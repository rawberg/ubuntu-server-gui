define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        mainToolbarTpl = require('text!views/templates/main-toolbar.html');

    return Marionette.ItemView.extend({
        template: _.template(mainToolbarTpl),
        tagName: 'header',
        id: 'main_toolbar',

        events: {
            'click #toolbar_nav li': 'onClickIcon'
        },

        highlightIcon: function(iconClass) {
            this.$('#toolbar_nav li').removeClass('active');
            this.$('li.' + iconClass).addClass('active');
        },

        onClickIcon: function(e) {
            this.highlightIcon(e.target.className);
        }
    });
});
