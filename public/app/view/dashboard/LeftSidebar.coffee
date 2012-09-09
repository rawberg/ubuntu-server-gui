define([
    'jquery'
    'underscore'
    'app'
    'collection/ServerList'    
    'view/UsgCollectionView'
    'view/dashboard/LeftSidebarItem'
    'view/modal/AddEditServer'
    'view/modal/RemoveServer'
    'contextmenu'    
    
], ($, _, App, ServerList, UsgCollectionView, LeftsidebarItem, AddEditServerModal, RemoveServerModal, ContextMenu) ->
    
    ###*
     * @class LeftSidebar
     * Displays list of servers associated with the 
     * user's account in the left sidebar of the Dashboard. 
     * @extends UsgCollectionView
     ###    
    class LeftSidebar extends UsgCollectionView
        
        ###*
         * @constructor
         * Creates a new LeftSidebar instance.
         * @param {Object} [options] config options for UsgCollectionView.         
         * @return {Object} LeftSidebar instance.
         ###        
        constructor: (options = {}) ->
            @App = App

            @itemView = LeftsidebarItem
            @itemViewOptions = {}

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
            #console.log('serverClick')
            #console.dir(eventObj)
            return

        onServerRightClick: (eventObj) ->
            eventObj.preventDefault()
            eventObj.stopPropagation()
            @contextMenu.sourceEvent = eventObj
            ContextMenu.show(@contextMenu, eventObj.clientX, eventObj.clientY)
            return

        onEditServerClick: (eventObj) =>
            server = @collection.get(@contextMenu.sourceEvent.currentTarget.id.slice(10))
            @App.modal.show(new AddEditServerModal({model: server, operationLabel: 'Edit'}))
            return

        onRemoveServerClick: (eventObj) =>
            server = @collection.get(@contextMenu.sourceEvent.currentTarget.id.slice(10))
            @App.modal.show(new RemoveServerModal({model: server}))
            return

)