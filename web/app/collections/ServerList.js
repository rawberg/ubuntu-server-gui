define(function (require_browser) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Backbone = require_browser('backbone'),
        Server = require_browser('models/Server');

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
