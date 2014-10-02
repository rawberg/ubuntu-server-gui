define(['jquery',
        'underscore',
        'marionette',
        'views/BaseForm',
        'text!views/modal/templates/server-connection-connecting.html',
        'text!views/modal/templates/server-connection-password.html',
        'text!views/modal/templates/server-connection-error.html',
        'backbone_stickit'], function (
        $,
        _,
        Marionette,
        BaseForm,
        serverConnectingTpl,
        serverConnectPasswordPromptTpl,
        serverConnectErrorTpl) {

    /**
     * @params {model: Server}
     */
    return BaseForm.extend({
        tagName: 'div',
        className: 'modal-dialog modal-connection-server',

        connection_bindings: {
            'h4.modal-title': 'connection_status',
            'span.connection-status': 'connection_status',
            'input[name="ssh_password"]': 'ssh_password'
        },

        server_bindings: {
            '.server-name': 'name',
            '.server-username': 'username',
            '.server-port': 'port',
            '.server-addr': 'ipv4'
        },

        modelEvents: {
            "change:connection_status": "onStatusChange"
        },

        events: {
            'click button[name="connect"]': 'onClickConnect',
            'keyup input': 'onInputKeyup',
        },

        triggers: {
            'click button[name="cancel"]': 'cancel',
        },

        getTemplate: function() {
            if(this.model.get('connection_status') === 'connecting' || this.model.get('connection_status') === 'connected') {
                return _.template(serverConnectingTpl);
            } else if(this.model.get('connection_status') === 'password required') {
                return _.template(serverConnectPasswordPromptTpl);
            } else {
                return _.template(serverConnectErrorTpl);
            }
        },

        onInputKeyup: function(eventObj) {
            eventObj.stopPropagation();
            eventObj.preventDefault();
            eventObj.returnValue = false;
            if (eventObj.keyCode === 13) {
                this.onClickConnect(eventObj);
            }
            return false;
        },

        onClickConnect: function(eventObj) {
            eventObj.stopPropagation();
            eventObj.preventDefault();
            eventObj.returnValue = false;

            this.hideError();
            this.disableForm();
            this.model.connect();
        },

        onRender: function() {
            this.clearForm();
            this.enableForm();
            this.stickit(this.model, this.connection_bindings);
            this.stickit(this.model.server, this.server_bindings);
        },

        onStatusChange: function(server, connection_status, changes) {
            this.render();
        }
    });
});