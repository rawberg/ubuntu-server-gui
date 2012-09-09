define([
    'underscore',
    'backbone'

], (_, Backbone) ->
    
    ###*
     * @class Server
     * General purpose Server model.
     * @extends Backbone.Model
     ###
    class Server extends Backbone.Model

        ###*
         * @constructor
         * Creates a new Server model.
         * @param {Object} [options] config options for Backbone.Model.
         ###
        constructor: (options = {}) ->
            @local = true
            @url = 'Servers'
            @defaults =
                name: null
                ipv4: null
                        
            super
            return
        
        ###*
         * @method @private
         * Formats data returned from the server after fetch is called.
         * @param {Object} platformInfo JSON data from the server
         * @param {Object} [jqXHR] jQuery jqXHR
         * @return {Object} re-formmated JSON data
         ###
        parse: (serverInfo, jqXHR) ->
            #platformInfo.codename = platformInfo.codename.charAt(0).toUpperCase() + platformInfo.codename.slice(1)
            return serverInfo;


)