define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        Server = require('models/Server'),
        removeServerTpl = require('text!views/modal/templates/remove-server.html');

    return Marionette.ItemView.extend({
        tagName: 'div',
        template: _.template(removeServerTpl),
        id: 'modal_remove_server',
        className: 'modal hide fade',

        events: {
            'click #remove_server_btn': 'onConfirmation'
        },

        onConfirmation: function(eventObj) {
            eventObj.stopPropagation();
            eventObj.preventDefault();
            eventObj.returnValue = false;
            this.$el.modal('hide');
            this.model.destroy();
        }
    });
});
