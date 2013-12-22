define(function (require_browser) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        App = require_browser('App'),
        AddEditServerModal = require_browser('views/modal/AddEditServer'),
        mainToolbarTpl = require_browser('text!views/templates/main-toolbar.html');

    return Marionette.ItemView.extend({
        template: _.template(mainToolbarTpl),
        tagName: 'header',
        id: 'main-toolbar',

        events: {
            'click #toolbar_nav li': 'onClickIcon',
            'click .toolbar-server_rack a': 'onAddServerClick'
        },

        highlightIcon: function(iconClass) {
            this.$('#toolbar_nav li').removeClass('active');
            this.$('li.' + iconClass).addClass('active');
        },

        onAddServerClick: function(eventObj) {
            eventObj.stopPropagation();
            eventObj.preventDefault();
            App.showModal(new AddEditServerModal({operationLabel: 'Add'}));
        },

        onClickIcon: function(e) {
            this.highlightIcon(e.target.className);
        }
    });
});
