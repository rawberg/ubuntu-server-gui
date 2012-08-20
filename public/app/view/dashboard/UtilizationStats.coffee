define([
    'jquery'
    'underscore'
    'backbone'
    'backbone_marionette'
    'backbone_modelbinder'
    'app'
    'model/ServerOverview'
    'gauge'
    'text!view/dashboard/tpl/utilization-stats.html'

], ($, _, Backbone, BackboneMarionette, BackboneModelBinder, App, ServerOverview, Gauge, utilizationStatsTpl) ->
    
    ###*
     * @class UtilizationStatus
     * Displays guages for cpu and memory utilization.
     * @extends BackboneMarionette.ItemView
     ###
    class UtilizationStats extends BackboneMarionette.ItemView
        
        ###*
         * @constructor
         * Creates a new UtilizationStats instance.
         * @return {Object} UtilizationStats instance.
         ###
        constructor: (options={}) ->
            @App = App

            @template = _.template(utilizationStatsTpl)
            @tagName = 'div'
            @className ='performance'
            
            @model = options.model ? new ServerOverview()
            @_modelBinder = new BackboneModelBinder()
            @modelBindings = {cpu: {
                selector: '[name=cpu]',
                converter: @cpuGaugeConverter
            }, memory: {
                selector: '[name=memory]'
            }}
   
            super
            return

        cpuGaugeConverter: (direction, value) =>
            return @App.formatters.zeroPad(value, 1)

        ###*
         * @method @private
         * Sets up automatic model data bindings via ModelBinder.
         * @return {Object} UtilizationStats instance.
         ###
        onRender: ->
            @_modelBinder.bind(@model, @el, @modelBindings)

            cpuGaugeTarget = @$('#dashboard_cpu_donut')[0]
            @cpuGauge = new Donut(cpuGaugeTarget)
            @cpuGauge.setOptions({
                lines: 12
                angle: 0.50
                lineWidth: 0.10
                colorStart: '#A6B2FF'
                colorStop: '#929DE0'
                strokeColor: '#e0e0e0'
                generateGradient: true
            })
            @cpuGauge.maxValue = 100
            @cpuGauge.set(@model.get('cpu'))
            @model.on("change:cpu", (model, val) ->
                @cpuGauge.set(val)
            ,@)

            memoryGaugeTarget = @$('#dashboard_memory_donut')[0]
            @memoryGauge = new Donut(memoryGaugeTarget)
            @memoryGauge.setOptions({
                lines: 12
                angle: 0.35
                lineWidth: 0.10
                colorStart: '#B7A6FF'
                colorStop: '#9C8DD9'
                shadowColor: '#d5d5d5'
                strokeColor: '#e0e0e0'
                generateGradient: true
            })
            @memoryGauge.maxValue = 100
            @memoryGauge.set(@model.get('memory'))
            @model.on("change:memory", (model, val) ->
                @memoryGauge.set(val)
            ,@)            
            return

)
