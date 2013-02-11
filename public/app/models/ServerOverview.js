define([
    'underscore',
    'backbone',
    'socket_io',
    'App'],
    function(_, Backbone, io, App) {
        return Backbone.Model.extend({

            url: 'http://10.0.1.13:3030/dash',
            defaults: {
                'cpu': 0,
                'memory': 0
            },

            initialize: function() {
                this.parse = _.bind(this.parse, this);
                this.remote = true;
                this.ws = io.connect(this.url, App.ioConfig);
                this.ws.on('cpumem', this.parse);
                this.fetch();
                setInterval(_.bind(function() {
                    this.fetch();
                }, this), 5000);
            },

            fetch: function(options) {
                this.ws.emit('cpumem');
            },

            parse: function(stats) {
                var totalCpulUtilization, totalMemUtilization;
                totalCpulUtilization = 0;
                stats.cpus.forEach(function(item, index, allItems) {
                    return totalCpulUtilization += item.utilization;
                });

                if (totalCpulUtilization > 1) {
                    totalCpulUtilization = Math.round(totalCpulUtilization);
                } else {
                    totalCpulUtilization = String(totalCpulUtilization).slice(1);
                }
                totalMemUtilization = 0;

                if (stats.mem.utilization > 1) {
                    totalMemUtilization = Math.round(stats.mem.utilization);
                } else {
                    totalMemUtilization = String(totalMemUtilization).slice(1);
                }

                return this.set({cpu: totalCpulUtilization, memory: totalMemUtilization});
            }
        });
    }
);
