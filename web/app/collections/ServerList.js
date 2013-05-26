define(function (require_browser) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Backbone = require_browser('backbone'),
        App = require_browser('App'),
        Server = require_browser('models/Server');

    return Backbone.Collection.extend({
        url: 'Servers',
        model: Server,

        initialize: function(options) {
            this.App = App;
            this.local = true;
            this.App.vent.on('server:new-server-added', this.addNewServer, this);
            this.on('remove', this.onRemove, this);
        },

        addNewServer: function(eventData) {
            this.add(eventData.server);
        },

        onRemove: function() {
            if(this.length === 0) {
                App.vent.trigger('noobtour:activate');
            }
        }

    });
});
