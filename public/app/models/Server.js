define(function (require) {
    var _ = require('underscore'),
        Backbone = require('backbone');
        require('backbone_dualstorage');

    return Backbone.Model.extend({
        url: 'Servers',
        local: true,
        defaults: {
            name: null,
            ipv4: null,
            port: 8809
        },

        parse: function(serverInfo, jqXHR) {
            return serverInfo;
        }
    });
});
