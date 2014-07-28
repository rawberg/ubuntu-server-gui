define(['jquery',
        'underscore',
        'marionette',
        'App',
        'models/ServerOverview',
        'formatters',
        'text!views/dashboard/templates/utilization-stats.html',
        'gauge',
        'backbone_stickit'], function(
        $,
        _,
        Marionette,
        App,
        ServerOverview,
        Formatters,
        utilizationStatsTpl) {

    return Marionette.ItemView.extend({
        template: _.template(utilizationStatsTpl),
        tagName: 'div',
        className: 'performance',

        bindings: {
            '[name=memory]': {
                observe: 'memory',
                onGet: 'formatMemory',
                updateMethod: 'html'
            },
            '[name=tcp_connections]': 'tcp_connections'
        },

        initialize: function() {

        },

        cpuGaugeConverter: function(direction, value) {
            return Formatters.zeroPad(value, 1);
        },

        formatMemory: function(val) {
            return val + '<i>%</i>';
        },

        onRender: function() {
            this.stickit();

            var memoryGaugeTarget = this.$('#dashboard_memory_donut')[0];
            this.memoryGauge = new Donut(memoryGaugeTarget);
            this.memoryGauge.setOptions({
                lines: 12,
                angle: 0.35,
                lineWidth: 0.10,
                colorStart: '#B7A6FF',
                colorStop: '#9C8DD9',
                shadowColor: '#d5d5d5',
                strokeColor: '#e0e0e0',
                generateGradient: true
            });

            this.memoryGauge.maxValue = 100;
            this.memoryGauge.set(this.model.get('memory'));

            this.model.on("change:memory", _.bind(function(model, val) {
                this.memoryGauge.set(val);
            }, this));
        }
    });
});
