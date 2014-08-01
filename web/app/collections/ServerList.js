define(['backbone',
        'App',
        'models/Server'], function (
        Backbone,
        App,
        Server) {

    return Backbone.Collection.extend({
        url: 'Servers',
        model: Server,

        initialize: function(options) {
            this.local = true;
            this.on('remove', this._checkEmpty);
            this.on('sync', this._checkEmpty);
            App.vent.on('add:server', this.onAddServer, this);
        },

        _checkEmpty: function() {
            if(this.length === 0) {
                App.execute('noobtour:activate');
            }
        },

        onAddServer: function(server) {
            this.add(server);
        }
    });
});
