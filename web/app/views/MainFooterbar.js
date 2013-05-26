define(function (require_browser) {
    var _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        App = require_browser('App'),
        AddEditServerModal = require_browser('views/modal/AddEditServer'),
        mainFooterbarTpl = require_browser('text!views/templates/main-footerbar.html');

    return Marionette.ItemView.extend({
        template: _.template(mainFooterbarTpl),
        tagName: 'footer',

        events: {
            'click #lsfb_btn_add_server': 'onAddServerClick'
        },

        initialize: function(options) {
            this.App = App;
        },

        onAddServerClick: function(eventObj) {
            App.vent.trigger('noobtour:deactivate');
            eventObj.stopPropagation();
            eventObj.preventDefault();
            this.App.showModal(new AddEditServerModal({
                operationLabel: 'Add'
            }));
        }
    });
});
