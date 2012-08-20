define([
    'underscore',
    'backbone'

], (_, Backbone) ->
    
    ###*
     * @class PlatformInfo
     * Server operating system info.
     * @extends Backbone.Model
     ###
    class PlatformInfo extends Backbone.Model

        ###*
         * @constructor
         * Creates a new PlatformInfo model.
         * @param {Object} [options] config options for Backbone.Model.
         * @return {Object} PlatformInfo model.
         ###
        constructor: (options={}) ->
            @remote = true
            @url = 'http://10.0.1.6:3000/os/platform'
            @defaults =
                'codename': null
                'release': null
                'kernel': null

            super
            @fetch()
            return
        
        ###*
         * @method @private
         * Formats data returned from the server after fetch is called.
         * @param {Object} platformInfo JSON data from the server
         * @param {Object} [jqXHR] jQuery jqXHR
         * @return {Object} re-formmated JSON data
         ###
        parse: (platformInfo, jqXHR) ->
            platformInfo.codename = platformInfo.codename.charAt(0).toUpperCase() + platformInfo.codename.slice(1)
            return platformInfo;


)