define(['jquery', 'underscore', 'backbone', 'models/Server'], function ($, _, Backbone, Server) {

    return Backbone.Collection.extend({
        url: 'Servers',
        model: Server,

        initialize: function(options) {
            this.local = true;
        },

        addNewServer: function(eventData) {
            this.add(eventData.server);
        },
    });
});
