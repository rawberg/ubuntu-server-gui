define(function (require) {
    var _ = require('underscore'),
        Marionette = require('marionette'),
        App = require('App'),
        AddEditServerModal = require('views/modal/AddEditServer'),
        mainFooterbarTpl = require('text!views/templates/main-footerbar.html');

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
            this.App.modal.show(new AddEditServerModal({
                operationLabel: 'Add'
            }));
        }
    });
});
