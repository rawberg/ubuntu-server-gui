define(function (require_browser, exports, module) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        App = require_browser('App'),
        Server = require_browser('models/Server'),
        serverConnectingTpl = require_browser('text!views/modal/templates/server-connection-connecting.html'),
        serverConnectPasswordPromptTpl = require_browser('text!views/modal/templates/server-connection-password.html'),
        serverConnectErrorTpl = require_browser('text!views/modal/templates/server-connection-error.html');

    require_browser('backbone_stickit');
    /**
     * @params {model: Server}
     */
    return Marionette.ItemView.extend({
        tagName: 'div',
        className: 'modal-dialog modal-connection-server',

        connection_bindings: {
            'h4.modal-title': 'connection_status',
            'span.connection-status': 'connection_status'
        },

        server_bindings: {
            'span.server-name': 'name',
            'span.server-username': 'username',
            'span.server-port': 'port',
            'span.server-addr': 'ipv4'
        },

        modelEvents: {
            "change:connection_status": "onStatusChange"
        },

        events: {
            'click button[name="cancel"]': 'onCancel'
        },

        getTemplate: function() {
            if(this.model.get('connection_status') === 'connecting') {
                return _.template(serverConnectingTpl);
            } else if(this.model.get('connection_status') === 'password_required') {
                return _.template(serverConnectPasswordPromptTpl);
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

        onCancel: function(eventObj) {
            App.execute('modal:close');
        },

        onRender: function() {
            this.stickit(this.model, this.connection_bindings);
            this.stickit(this.model.server, this.server_bindings);
        },

        onStatusChange: function(server, connection_status, changes) {
            if(connection_status === 'connection error') {
                this.render();
            }
        }
    });
});