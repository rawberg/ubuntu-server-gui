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

        hideModal: function() {
            $('#modal_remove_server').modal('hide');
        },

        onConfirmation: function(eventObj) {
            eventObj.stopPropagation();
            eventObj.preventDefault();
            eventObj.returnValue = false;
            this.model.destroy();
            this.hideModal();
        },

        onRender: function() {
            $('#modal_remove_server').modal({show: true})
                .on('hidden', _.bind(function() {
                    this.close();
                }, this))
                .on('shown', function() {});
        }
    });
});
