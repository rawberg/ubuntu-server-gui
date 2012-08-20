define([
    'jquery'
    'underscore'
    'backbone'
    'backbone_marionette'
    'app'
    'view/modal/AddServer'
    'text!view/tpl/main-footerbar.html'
],
($, _, Backbone, BackboneMarionette, App, AddServerModal, mainFooterbarTpl) ->
    
    ###*
     * @class MainFooterBar
     * Application toolbar displayed at the top of the app.
     * @extends BackboneMarionette.ItemView
     ###
    class MainFooterBar extends BackboneMarionette.ItemView

        ###*
         * @constructor
         * Creates a new MainFooterBar instance.
         * @param {Object} [options] config options for BackboneMarionette.Layout.
         ###
        constructor: (options={}) ->
            @template = _.template(mainFooterbarTpl)
        
            @tagName = 'footer'
            @id = 'main_footerbar'
            
            @events =
                'click li#lsfb_btn_add_server': 'onAddServerClick'

            super
            return

        onAddServerClick: (eventObj) ->
            eventObj.stopPropagation()
            eventObj.preventDefault()

            App.vent.trigger('server:add-via-modal')
            return


)