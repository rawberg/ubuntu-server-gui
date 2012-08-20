define([
    'jquery',
    'underscore',
    'backbone',
    'backbone_marionette',
    'backbone_modelbinder',
    'text!view/dashboard/tpl/platform-stats.html'

], ($, _, Backbone, BackboneMarionette, BackboneModelBinder, platformStatsTpl) ->
    
    ###*
     * @class PlatformStats
     * Displays information about the server OS like version and kernel.
     * @extends BackboneMarionette.ItemView
     ###
    class PlatformStats extends BackboneMarionette.ItemView
        
        ###*
         * @constructor
         * Creates a new PlatformStats instance.
         * @param {Object} [options] config options for BackboneMarionette.ItemView.         
         * @return {Object} PlatformStats instance.
         ###
        constructor: (options) ->
            @template = _.template(platformStatsTpl)
            @tagName = 'div'
            @className = 'software'

            @_modelBinder = new BackboneModelBinder()
            return super(options)

        ###*
         * @method @private
         * Sets up automatic model data bindings via ModelBinder.
         * @return {Object} PlatformStats instance.
         ###
        onRender: =>
            @_modelBinder.bind(@model, @el)
            return @
)