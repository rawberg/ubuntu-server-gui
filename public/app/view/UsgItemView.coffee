define([
    'jquery'
    'underscore'
    'backbone_marionette'
    
], ($, _, BackboneMarionette) ->
    
    ###*
     * @class UsgItemView
     * Encapsulates Ubuntu Server GUI specific item view functionality.
     * @extends BackboneMarionette.ItemView
     ###
    class UsgItemView extends BackboneMarionette.ItemView

        ###*
         * @constructor
         * Creates a new CwItemView instance.
         *
         * @param {Object} [options] config options for BackboneMarionette.CwItemView.
         ###        
        constructor: (options={}) ->
            super
            return


        initialEvents: () ->
            if(@collection and @parentRegion)
                @bindTo(@collection, "reset", @showInsideParentRegion, @)
            else if(@collection)
                @bindTo(@collection, "reset", @render, @)                
            return

            #@bindTo(@collection, "add", this.addChildView, @);

        ###*
         * @method
         * Allows us to smoothly delegate rendering to the parentRegion. 
         *
         ###
        showInsideParentRegion: () ->
            @parentRegion.show(@)
            return   

)