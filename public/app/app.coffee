define([
    'underscore'
    'backbone_marionette'

], (_, BackboneMarionette) ->

    class App extends BackboneMarionette.Application

        ###*
         * Sets up main application regions for toolbar
         * and viewport.
         *
         * Bound to initialize:before to make sure
         * the regions are always avaialable before
         * anything else runs.
         *
         ###
        constructor: () ->
            super

            # Sets up main application regions
            # we're doing this here to make sure
            # they are immediatley avalable.
            @addRegions({
                mainToolbar: "#main_toolbar_container"
                mainViewport: "#viewport"
                mainFooterbar: '#main_footerbar_container'
            })

            ###*
             * Overrides for BackboneMarionette templating loading
             * and rendering. Optimizing Marionette for using underscore
             * templates along with Require.js.
             *
             * https://github.com/derickbailey/backbone.marionette/wiki/Using-marionette-with-requirejs
             *
             ###
            @bind('initialize:before', (options) ->
                # See "Using marionette with requirejs" in Marionette's Github Repo for details
                BackboneMarionette.TemplateCache.prototype.loadTemplate = (templateId) ->
                    # Marionette expects "templateId" to be the ID of a DOM element.
                    # But with RequireJS, templateId is actually the full text of the template.
                    template = templateId

                    # Make sure we have a template before trying to compile it
                    if (!template || template.length == 0)
                        msg = "Could not find template: '" + templateId + "'"
                        err = new Error(msg)
                        err.name = "NoTemplateError"
                        throw err

                    return template

                BackboneMarionette.Renderer.render = (template, data={}) ->
                    return template(data)

                return
            )

            ###*
             * Sets up User and Session model objects
             * and attaches them to the application instance.
             * 
             * Creates a MainController instance and corresponding
             * Backbone Router object.
             *
             ###
            @addInitializer((options) ->
                @routers = {} # setup a place to store routers
                return
            )
        

            ###*
             * Overrides Backbone.wrapError to trigger an Application
             * server:error event whenenver an ajax call returns a
             * 401 status code.
             *
             * Allows us to centeralize the way the app responds to
             * session timeouts and un-authenticated user condition.
             *
             ###
            @addInitializer((options) ->
                @onServerError = (originalModel, jqXHR, options) =>
                    if(jqXHR.status == 401)
                        @user.session.set('active', false)
                    return

                @vent.bind("server:error", @onServerError)
                Backbone.wrapError = (onError, originalModel, options) =>
                    return (model, resp) =>
                        if(model == originalModel)
                            resp = resp
                        else
                            resp = model
                        if (onError)
                            onError(originalModel, resp, options)
                            return
                        else
                            originalModel.trigger('error', originalModel, resp, options)
                            @vent.trigger('server:error', originalModel, resp, options)  # Only line added to original method
                            return
                return
            )

            ###*
             * Sets up some application wide data formatting
             * utilities.
             * 
             * TODO: put these in their own class/module.
             ###
            @addInitializer((options) ->
                @formatters = {}

                @formatters.formatBytes = (size) ->
                    if (size < 1024)
                        return size + "kb"
                    else if (size < 1048576)
                        return (Math.round(((size*10) / 1024) / 10)) + "KB"
                    else
                        return (Math.round(((size*10) / 1048576) / 10)) + "MB"

                @formatters.toTitleCase = (str) ->
                    return str.replace(/\w\S*/g, (txt) -> return txt.charAt(0).toUpperCase() + txt.substr(1))

                @formatters.zeroPad = (num, numZeros) ->
                    n = Math.abs(num)
                    zeros = Math.max(0, numZeros - Math.floor(n).toString().length)
                    zeroString = Math.pow(10,zeros).toString().substr(1)              

                    if( num < 0 )
                        zeroString = '-' + zeroString
                    return zeroString+n
                
                return
            )             

    return new App()
)
