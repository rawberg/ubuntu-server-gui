define([
    'jquery',
    'underscore',
    'backbone'
  
  ], ($, _, Backbone) ->
    
    ###*
     * @class NetServices
     * Running network services.
     * @extends Backbone.Collection
     ###
    class NetServices extends Backbone.Collection
        constructor: (options={}) ->
            @remote = true
            @url = 'http://10.0.1.6:3000/net/services'
            super
            return
        
        ###*
         * @method @private
         * Formats network service names.
         * @param {String} str network service name from the server.
         * @return {String} re-formmated service name
         ###
        formatService: (str) ->
            str = str.replace(/node/, 'nodeJS');
            str = str.replace(/(isc dhcp client|dhclient|dhclient3)\b/, 'DHCP Client');
            str = str.replace(/sshd/i, 'ssh');
            str = str.replace(/(db|sql|ssh|dhcp)\b/, (txt) -> return txt.toUpperCase())
            return str;
        
        ###*
         * @method @private
         * Formats data returned from the server after fetch is called.
         * @param {Object} response JSON data from the server
         * @param {Object} [jqXHR] jQuery jqXHR
         * @return {Object} re-formmated JSON data
         ###        
        parse: (response, jqXHR) ->
            results = []
            vals = []
            
            # filter out duplicates by name
            _.each(response.netServices, (item, index, list) =>
                item.name = @formatService(item.name)
                if(vals.indexOf(item.name) == -1)
                    results.push(item)

                vals.push(item.name)
            )
            return results

)