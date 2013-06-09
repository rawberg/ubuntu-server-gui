define([
    'underscore',
    'backbone',
    'App'],
    function(_, Backbone, App) {
        return Backbone.Model.extend({
            defaults: {
                'cpu': 0,
                'memory': 0
            },

            initialize: function(attributes, options) {
                this.remote = true;
                this.server = (options && options.server) ? options.server : null;
                this.fetch();
//                setInterval(_.bind(function() {
//                    this.fetch();
//                }, this), 5000);
            },

            fetch: function() {
                this.server.sshProxy.exec("free | grep Mem | awk '{print $3/$2 * 100.0}'", {}, _.bind(function(data) {
                    this.set('memory', Number(parseFloat(data).toFixed(1)));
                }, this));
            }
        });
    }
);
