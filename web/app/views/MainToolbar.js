define(function (require_browser) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        mainToolbarTpl = require_browser('text!views/templates/main-toolbar.html');

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
