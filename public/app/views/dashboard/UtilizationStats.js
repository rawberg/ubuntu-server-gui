define(function(require, exports, module) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        ModelBinder = require('backbone_modelbinder'),
        App = require('App'),
        ServerOverview = require('models/ServerOverview'),
        utilizationStatsTpl = require('text!views/dashboard/templates/utilization-stats.html');

        require('gauge');

    return Marionette.ItemView.extend({
        template: _.template(utilizationStatsTpl),
        tagName: 'div',
        className: 'performance',

        initialize: function() {
            this.cpuGaugeConverter = _.bind(this.cpuGaugeConverter, this);
            this.App = App;
            this._modelBinder = new ModelBinder();
            this.modelBindings = {
                cpu: {
                    selector: '[name=cpu]',
                    converter: this.cpuGaugeConverter
                },
                memory: {
                    selector: '[name=memory]'
                }
            };
        },

        cpuGaugeConverter: function(direction, value) {
            return this.App.formatters.zeroPad(value, 1);
        },

        onRender: function() {
            var cpuGaugeTarget, memoryGaugeTarget;

            this._modelBinder.bind(this.model, this.el, this.modelBindings);
            cpuGaugeTarget = this.$('#dashboard_cpu_donut')[0];
            this.cpuGauge = new Donut(cpuGaugeTarget);
            this.cpuGauge.setOptions({
                lines: 12,
                angle: 0.50,
                lineWidth: 0.10,
                colorStart: '#A6B2FF',
                colorStop: '#929DE0',
                strokeColor: '#e0e0e0',
                generateGradient: true
            });
            this.cpuGauge.maxValue = 100;
            this.cpuGauge.set(this.model.get('cpu'));
            this.model.on("change:cpu", function(model, val) {
                return this.cpuGauge.set(val);
            }, this);
            memoryGaugeTarget = this.$('#dashboard_memory_donut')[0];
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
            this.model.on("change:memory", function(model, val) {
                return this.memoryGauge.set(val);
            }, this);
        }
    });
});
