define([
    'jquery'
    'underscore'
    'backbone_marionette'
    
], ($, _, BackboneMarionette) ->
    
    ###*
     * @class UsgCollectionView
     * Encapsulates Ubuntu Server GUI specific collection view functionality.
     * @extends BackboneMarionette.CollectionView
     ###
    class UsgCollectionView extends BackboneMarionette.CollectionView

        ###*
         * @constructor
         * Creates a new CwCollectionView instance.
         *
         * @param {Object} [options] config options for BackboneMarionette.CollectionView.
         * @return {Object} MainToolbar instance
         ###        
        constructor: (options={}) ->
            super
            return

        ###*
         * @method
         * Renders HTML template for collection view if one exists.
         * Regular Marionette CollectionView does not render a template for
         * the collection view itself just for itemView.
         *
         ###
        beforeRender: () ->
            if(@template?)
                template = @getTemplate()
                if(@data == undefined)
                    data = {}
                html = BackboneMarionette.Renderer.render(template, data)
                @.$el.html(html)                
                return
            return
        
        ###*
         * @method
         * Overriding initialEvents with this implementation allows us to
         * hook the collection reset event into the show method of the 
         * parentRegion (if one is supplied). The parentRegion will then 
         * call render on this view and insert the result into the region. 
         *
         ###
        initialEvents: () ->
            if(@collection)
                @bindTo(@collection, "add", @addChildView, @)
                @bindTo(@collection, "remove", @removeItemView, @)
                @bindTo(@collection, "change", @render, @)
                if(@parentRegion)
                    @bindTo(@collection, "reset", @showInsideParentRegion, @)
                else
                    @bindTo(@collection, "reset", @render, @)

            return
        
        ###*
         * @method
         * Allows us to smoothly delegate rendering to the parentRegion. 
         *
         ###
        showInsideParentRegion: () ->
            @parentRegion.show(@)
            return


)