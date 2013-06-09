define(function (require_browser, exports, module) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        App = require_browser('App'),
        Server = require_browser('models/Server'),
        serverConnectingTpl = require_browser('text!views/modal/templates/server-connection-connecting.html'),
        serverConnectErrorTpl = require_browser('text!views/modal/templates/server-connection-error.html');

    require_browser('backbone_stickit');
    require_browser('bootstrap_modal');
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
            'span.server-addr': 'ipv4'
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