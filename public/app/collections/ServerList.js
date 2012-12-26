define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        App = require('App'),
        Server = require('models/Server');

    return Backbone.Collection.extend({
        url: 'Servers',

        initialize: function(options) {
            if (options === null) {
                options = {};
            }

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
