define(function (require_browser) {
    var Backbone = require_browser('backbone'),
        App = require_browser('App');

    require_browser('backbone_dualstorage');

    return Backbone.Model.extend({
        url: 'Servers',
        local: true,
        sshProxy: undefined,
        defaults: {
            name: null,
            ipv4: null,
            port: 22
        },

        parse: function(serverInfo, jqXHR) {
            return serverInfo;
        },

        getUrl: function() {
            return 'http://' + this.get('ipv4') + ':' + this.get('port');
        }
    });
});
