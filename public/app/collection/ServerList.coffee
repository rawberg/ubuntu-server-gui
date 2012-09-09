define([
    'jquery'
    'underscore'
    'backbone'
    'app'
    'model/Server'
  
  ], ($, _, Backbone, App, ServerModel) ->
    
    ###*
     * @class ServerList
     * List of servers associated with User's account
     * @extends Backbone.Collection
     ###
    class ServerList extends Backbone.Collection
        constructor: (options={}) ->
            @App = App
            @url = 'Servers'
            @local = true

            @App.vent.on('server:new-server-added', @addNewServer, @)
            super
            return

        addNewServer: (eventData) ->
            @add(eventData.server)
            return

    return ServerList
)