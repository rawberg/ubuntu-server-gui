define(function (require_browser, exports, module) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        App = require_browser('App'),
        Server = require_browser('models/Server'),
        serverConnectingTpl = require_browser('text!views/modal/templates/server-connection-connecting.html'),
        serverConnectErrorTpl = require_browser('text!views/modal/templates/server-connection-error.html');

    require_browser('backbone_stickit');
    /**
     * @params {model: Server}
     */
    return Marionette.ItemView.extend({
        className: 'modal hide fade',
        id: 'server-connection-modal',

        connection_bindings: {
            'h3': 'connection_status',
            'span.connection-status': 'connection_status'
        },

        server_bindings: {
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

        templateHelpers: function() {
            var location = '';
            if(App.isDesktop()) {
                location = 'your local network';
            } else {
                location = 'api.ubuntuservergui.com';
            }
            return {
                access_location: location
            }
        },

        onRender: function() {
            this.stickit(this.model, this.connection_bindings);
            this.stickit(this.model.options.server, this.server_bindings);
        },

        onStatusChange: function(server, connection_status, changes) {
            if(connection_status === 'connection error') {
                this.render();
            }
        }
    });
});