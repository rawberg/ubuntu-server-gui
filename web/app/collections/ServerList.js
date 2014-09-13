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
            this.activeServer = undefined;
            this.on('remove', this._checkEmpty);
            this.on('sync', this._checkEmpty);
            App.vent.on('server:add', this.onAddServer, this);
        },

        _checkEmpty: function() {
            if(this.length === 0) {
                App.execute('noobtour:activate');
            }
        },

        getActive: function() {
            return this.activeServer;
        },

        setActive: function(serverId, options) {
            var server = this.get(serverId);
            options = _.defaults({}, options, {connect: false});
            if(this.activeServer && server.cid !== this.activeServer.cid || typeof this.activeServer === 'undefined' && typeof server !== 'undefined') {
                this.activeServer = server;
                App.serverChannel.vent.trigger('changed', server);
            }
            if(options.connect) {
                this.activeServer.connect();
            }
            return this.activeServer;
        },

        onAddServer: function(server) {
            this.add(server);
        }
    });
});
