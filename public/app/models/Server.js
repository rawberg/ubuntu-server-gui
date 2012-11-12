define([
    'underscore',
    'backbone',
    'backbone_dualstorage'],
    function(_, Backbone) {
        return Backbone.Model.extend({
            url: 'Servers',
            local: true,
            defaults: {
                name: null,
                ipv4: null
            },

            parse: function(serverInfo, jqXHR) {
                return serverInfo;
            }
        });
    }
);
