define([
    'jquery'
    'underscore'
    'collection/ServerList'    
    'view/UsgItemView'
    'view/modal/AddServer'
    'contextmenu'    
    'text!view/dashboard/tpl/sidebar-left.html'
    
], ($, _, ServerList, UsgItemView, AddServerModal, ContextMenu, leftSidebarTpl) ->
    
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
                'click li': 'onServerClick'
                'contextmenu li': 'onServerRightClick'

            @contextMenu = new ContextMenu([
                {
                    label: "Edit Server",
                    onclick: @onEditServerClick
                },{
                    label: "Remove Server",
                    onclick: @onRemoveServerClick
                }
            ])

            super
            @collection.fetch()
            return

        onServerClick: (eventObj) ->
            console.log('serverClick')
            console.dir(eventObj)
            return

        onServerRightClick: (eventObj) ->
            console.dir(eventObj)
            eventObj.preventDefault()
            eventObj.stopPropagation()
            @contextMenu.sourceEvent = eventObj
            ContextMenu.show(@contextMenu, eventObj.clientX, eventObj.clientY)
            return

        onEditServerClick: (eventObj) =>
            console.log('onEditServerClick')
            console.dir(@contextMenu.sourceEvent)
            console.log('server ID: ' + @contextMenu.sourceEvent.currentTarget.id.slice(10))            
            return

        onRemoveServerClick: (eventObj) =>
            console.log('onRemoveServerClick')
            console.dir(@contextMenu.sourceEvent)
            console.log('server ID: ' + @contextMenu.sourceEvent.currentTarget.id.slice(10))            
            return

        onShow: () ->
            
            return

)