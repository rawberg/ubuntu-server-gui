define([
    'jquery'
    'underscore'
    'backbone'
    'backbone_marionette'
    'app'
    'model/Server'
    'text!view/dashboard/tpl/sidebar-left-item.html'

], ($, _, Backbone, BackboneMarionette, App, Server, leftSidebarItemTpl) ->
    
    ###*
     * @class LeftSidebarItem
     * Display individual server items in Leftsidebar.
     * @extends BackboneMarionette.ItemView
     ###
    class LeftSidebarItem extends BackboneMarionette.ItemView
        
        ###*
         * @constructor
         * Creates a new LeftSidebarItem instance.
         ###
        constructor: (options={}) ->
            @App = App

            @template = _.template(leftSidebarItemTpl)
            @id = 'server_id_' + options.model.id
            
            @tagName = 'li'
            @className ='vm-small'
            
            super
            return

)