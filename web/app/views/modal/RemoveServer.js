define(['jquery',
        'underscore',
        'marionette',
        'App',
        'models/Server',
        'text!views/modal/templates/remove-server.html'], function (
        $,
        _,
        Marionette,
        App,
        Server,
        removeServerTpl) {

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
