define([
    'underscore'
    'backbone'
    'socket_io'
    'app'

], (_, Backbone, io, App) ->
    
    ###*
     * @class PlatformInfo
     * Server operating system info.
     * @extends Backbone.Model
     ###
    class PlatformInfo extends Backbone.Model

        constructor: (options={}) ->
            @remote = true
            @url = 'http://10.0.1.5:3030/dash'
            @defaults =
                'codename': null
                'release': null
                'kernel': null

            super
            @ws = io.connect(@url, App.ioConfig)
            @ws.on('os-platform', @parse)

            @ws.emit('os-platform')
            return

        
        fetch: (options={}) ->
            @ws.emit('os-platform')
            return
        
        
        # formats data returned from the server after fetch is called.
        parse: (platformInfo) =>
            platformInfo.codename = platformInfo.codename.charAt(0).toUpperCase() + platformInfo.codename.slice(1)
            @set(platformInfo)
            return


)