define([
    'jquery',
    'underscore',
    'backbone',
    'backbone_marionette',
    'text!view/dashboard/tpl/running-services.html'

], ($, _, Backbone, BackboneMarionette, runningServicesTpl) ->
    
    ###*
     * @class RunningServices
     * Displays running network services in a multi-column list.
     * @extends BackboneMarionette.ItemView
     ###
    class RunningServices extends BackboneMarionette.ItemView
        
        ###*
         * @constructor
         * Creates a new RunningServices instance.
         * @return {Object} RunningServices instance
         ###        
        constructor: (options = {}) ->
            @template = _.template(runningServicesTpl)
            @tagName = 'div'
            @className = 'services'
            return super(options)
)