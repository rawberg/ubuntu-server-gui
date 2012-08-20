define([
    'jquery'
    'underscore'
    'backbone'
    'backbone_marionette'
    'text!view/tpl/main-toolbar.html'
],
($, _, Backbone, BackboneMarionette, mainToolbarTpl) ->
    
    ###*
     * @class MainToolbar
     * Application toolbar displayed at the top of the app.
     * @extends BackboneMarionette.ItemView
     ###
    class MainToolbar extends BackboneMarionette.ItemView

        ###*
         * @constructor
         * Creates a new MainToolbar instance.
         * @param {Object} [options] config options for BackboneMarionette.Layout.
         * @return {Object} MainToolbar instance.
         ###
        constructor: (options={}) ->
            @template = _.template(mainToolbarTpl)
        
            @tagName = 'header'
            @id = 'main_toolbar'
            return super(options)

        ###*
         * @method @private
         * Highlights the icon corresponding to the current view being displayed.
         * @param {String} iconId DOM element id for the icon to highlight
         ###        
        highlightIcon: (iconId) ->
            @$('#'+icon Id).addClass('active')
            return

)