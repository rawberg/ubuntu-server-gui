define([
    'jquery'
    'underscore'
    'collection/ServerList'    
    'view/UsgItemView'
    'view/modal/AddServer'    
    'text!view/dashboard/tpl/sidebar-left.html'
    
], ($, _, ServerList, UsgItemView, AddServerModal, leftSidebarTpl) ->
    
    ###*
     * @class LeftSidebar
     * Displays list of servers associated with the 
     * user's account in the left sidebar of the Dashboard. 
     * @extends UsgItemView
     ###    
    class LeftSidebar extends UsgItemView
        
        ###*
         * @constructor
         * Creates a new LeftSidebar instance.
         * @param {Object} [options] config options for BackboneMarionette.ItemView.         
         * @return {Object} LeftSidebar instance.
         ###        
        constructor: (options = {}) ->
            @template = _.template(leftSidebarTpl)
            @tagName = 'ul'
            @id = 'left_sidebar_serverlist'

            @collection = new ServerList()
            @parentRegion = options.parentRegion

            @events =
                'click ul': 'serverClick'

            super
            @collection.fetch()
            return

        serverClick: (eventObj) ->
            return

)