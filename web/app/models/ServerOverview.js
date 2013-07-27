define([
    'underscore',
    'backbone',
    'App'],
    function(_, Backbone, App) {
        return Backbone.Model.extend({
            defaults: {
                'memory': 0,
                'tcp_connections': 0
            },

            initialize: function(attributes, options) {
                this.remote = true;
                this.server = (options && options.server) ? options.server : null;
                this.fetch();
                setInterval(_.bind(function() {
                    this.fetch();
                }, this), 300000);
            },

            fetch: function() {
                this.server.sshProxy.exec("free | grep Mem | awk '{print $3/$2 * 100.0}'", {}, _.bind(function(err, stream) {
                    stream.on('data', _.bind(function(data, extended) {
                        data = data.toString();
                        this.set('memory', Number(parseFloat(data).toFixed(1)));
                    }, this));
                }, this));

                this.server.sshProxy.exec("netstat -t | sed -n '/^tcp\ /p' |  awk 'END { print NR }'", {}, _.bind(function(err, stream) {
                    stream.on('data', _.bind(function(data, extended) {
                        data = data.toString();
                        this.set('tcp_connections', parseInt(data));
                    }, this));
                }, this));
            }
        });
    }
);
