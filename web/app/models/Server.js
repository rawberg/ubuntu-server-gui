define(function (require_browser) {
    var _ = require_browser('underscore'),
        Backbone = require_browser('backbone');

    require_browser('backbone_dualstorage');

    return Backbone.Model.extend({
        url: 'Servers',
        local: true,
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
