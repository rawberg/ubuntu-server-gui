define(function (require, exports, module) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        App = require('App'),
        Server = require('models/Server'),
        serverConnectingTpl = require('text!views/modal/templates/server-connection-connecting.html'),
        serverConnectErrorTpl = require('text!views/modal/templates/server-connection-error.html');

    require('backbone_stickit');
    require('bootstrap_modal');
    /**
     * @params {model: Server}
     */
    return Marionette.ItemView.extend({
        className: 'modal hide fade',
        id: 'server-connection-modal',

        bindings: {
            'h3': 'connection_status',
            'span.connection-status': 'connection_status',
            'span.server-name': 'name',
            'span.server-port': 'port',
            'span.server-ipv4': 'ipv4'
        },

        modelEvents: {
            "change:connection_status": "onStatusChange"
        },

        getTemplate: function() {
            if(this.model.get('connection_status') === 'connecting') {
                return _.template(serverConnectingTpl);
            } else {
                return _.template(serverConnectErrorTpl);
            }
        },

        initialize: function(options) {
            this.App = options && options.App ? options.App : App;

        },

        onRender: function() {
            this.stickit();
        },

        onStatusChange: function(server, connection_status, changes) {
            if(connection_status === 'connection error') {
                this.render();
            }
        }
    });
});