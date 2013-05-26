define(function (require_browser) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        Server = require_browser('models/Server'),
        removeServerTpl = require_browser('text!views/modal/templates/remove-server.html');

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
