define(function (require, exports, module) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        App = require('App'),
        Server = require('models/Server'),
        serverConnectionTpl = require('text!views/modal/templates/server-connection.html');

    require('backbone_stickit');
    require('bootstrap_modal');
    /**
     * @params {model: Server}
     */
    return Marionette.ItemView.extend({
        template: _.template(serverConnectionTpl),
        className: 'modal hide fade',
        id: 'server-connection-modal',

        bindings: {
            'h3': 'connection_status',
            'span.server-name': 'name',
            'span.server-port': 'port',
            'span.server-ipv4': 'ipv4'
        },

        initialize: function(options) {
            this.App = options && options.App ? options.App : App;
            this.model.on('change:connection_status', _.bind(function(model, value, options) {
                if(value === 'connecting') {
                    this.showConnectingState();
                } else {
                    this.showErrorState();
                }
            }, this));
        },

        onRender: function() {
            this.stickit();
            // a bit redundant but avoids flicker when waiting for model to change
            if(this.model.get('connection_status') == 'connecting') {
                this.showConnectingState();
            } else {
                this.showErrorState();
            }
        },

        showErrorState: function() {
            this.$('.modal-body').hide();
            this.$('.modal-body.connection-error').show();
        },

        showConnectingState: function() {
            this.$('.modal-body').hide();
            this.$('.modal-body.connecting').show();
        }
    });
});