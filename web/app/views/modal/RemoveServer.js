define(function (require_browser) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        App = require_browser('App'),
        Server = require_browser('models/Server'),
        removeServerTpl = require_browser('text!views/modal/templates/remove-server.html');

    return Marionette.ItemView.extend({
        tagName: 'div',
        template: _.template(removeServerTpl),
        className: 'modal-dialog modal-remove-server',

        events: {
            'click button.remove-server': 'onConfirmation'
        },

        onConfirmation: function(eventObj) {
            eventObj.stopPropagation();
            eventObj.preventDefault();
            eventObj.returnValue = false;
            App.vent.trigger('modal:close');
            this.model.destroy();
        }
    });
});
