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

            @App.vent.on('server:new-server-added', @fetch, @)
            super
            return

        ###*
         * @method @private
         * Formats data returned from the server after fetch is called.
         * @param {Object} response JSON data from the server
         * @param {Object} [jqXHR] jQuery jqXHR
         * @return {Object} re-formmated JSON data
         ###
        ###
        parse: (response, jqXHR) ->
            return response.servers
        ###

    return ServerList
)