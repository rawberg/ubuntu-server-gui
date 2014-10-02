define(['underscore',
        'backbone',
        'App',
        'models/ServerConnection',
        'backbone_dualstorage'], function (
        _,
        Backbone,
        App,
        ServerConnection) {

    return Backbone.Model.extend({
        url: 'Servers',
        local: true,
        connection: undefined,
        sftpProxy: undefined,
        defaults: {
            id: null,
            name: null,
            ipv4: null,
            port: 22,
            username: null,
            keyPath: ''
        },

        parse: function(serverInfo, jqXHR) {
            return serverInfo;
        },

        getUrl: function() {
            return 'http://' + this.get('ipv4') + ':' + this.get('port');
        },

        connect: function() {
            if(typeof this.connection === 'undefined') {
                this.connection = new ServerConnection({}, {server: this});
            }
            this.connection.set('connection_status', 'connecting');
            App.connectionModal(this);
            this.connection.connect();
        },

        disconnect: function() {

        },

        isConnected: function() {
            if(typeof this.connection === "undefined") {
                return false;
            } else if(this.connection.get('connection_status') !== 'connected') {
                return false;
            } else if(this.connection.sshProxy._state !== 'closed') {
                return true;
            }
        },

        setDefaultKeyPath: function() {
            this.set('keyPath', '~/.ssh/id_rsa'); // TODO: make this platform specific
        }
    });
});
