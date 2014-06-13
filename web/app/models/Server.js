define(['underscore',
        'backbone',
        'backbone_dualstorage'], function (
        _,
        Backbone) {

    return Backbone.Model.extend({
        url: 'Servers',
        local: true,
        connection: undefined,
        sshProxy: undefined,
        sftpProxy: undefined,
        defaults: {
            name: null,
            ipv4: null,
            port: 22,
            username: null,
            keyPath: null
        },

        parse: function(serverInfo, jqXHR) {
            return serverInfo;
        },

        getUrl: function() {
            return 'http://' + this.get('ipv4') + ':' + this.get('port');
        },

        setDefaultKeyPath: function() {
            this.set('keyPath', '~/.ssh/id_rsa'); // TODO: make this platform specific
        }
    });
});
