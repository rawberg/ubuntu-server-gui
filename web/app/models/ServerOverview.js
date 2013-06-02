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
                this.parse = _.bind(this.parse, this);
                this.remote = true;
                this.server = (options && options.server) ? options.server : null;
                this.server.ws.on('cpumem', this.parse);
                this.fetch();
                setInterval(_.bind(function() {
                    this.fetch();
                }, this), 5000);
            },

            fetch: function(options) {
                this.server.ws.emit('cpumem');
            },

            parse: function(stats) {
                var totalCpulUtilization, totalMemUtilization;
                totalCpulUtilization = 0;
                stats.cpus.forEach(function(item, index, allItems) {
                    return totalCpulUtilization += Number(item.utilization);
                });

                totalMemUtilization = 0;
                if (stats.mem.utilization > 1) {
                    totalMemUtilization = Math.round(stats.mem.utilization);
                } else {
                    totalMemUtilization = String(totalMemUtilization).slice(1);
                }

                return this.set({cpu: totalCpulUtilization.toFixed(2), memory: totalMemUtilization});
            },

            url: function() {
                return 'https://' + this.server.get('ipv4') + ':' + this.server.get('port') + '/dash/cpumem';
            }
        });
    }
);
