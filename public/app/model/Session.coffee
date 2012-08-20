define([
    'jquery'
    'underscore'
    'backbone'
    'app'

], ($, _, Backbone, App) ->
    
    ###*
     * @class Session
     * Client-side representation of current users's session state.
     * @extends Backbone.Model
     ###
    class Session extends Backbone.Model
        
        ###*
         * @constructor
         * Creates a new Session model.
         * @param {Object} [attributes] attributes for Backbone.Model
         * @param {Object} [options] config options for Backbone.Model
         ###        
        constructor: (attributes={}, options={}) ->
            @App = App
            @remote = true
            @url = 'http://whatever.com'
            @defaults =
                'active': undefined
                'attemptedRoute': ''

            @on('change:active', @onStatusChange, @)
            super
            return

        ###*
         * @method @private
         * Responds to 'active' attribute changes, if 'active'
         * is set to false it saves the attemptedRoute and
         * navigates the user to the login page.
         *
         * @param {Object} Session model object
         * @param {String} active new value set for active attribute
         ###
        onStatusChange: (session, active) ->
            if(active == false)
                @set('attemptedRoute', Backbone.history.fragment) unless Backbone.history.fragment == 'auth/login'
                @App.routers.main.navigate('auth/login', {trigger: true, replace: true})
            else if(active == true)
                @App.routers.main.navigate(@get('attemptedRoute'), {trigger: true, replace: true})
            return
        
        ###*
         * @method @private
         * Formats data returned from the server after fetch is called.
         * @param {Object} response JSON data from the server
         * @param {Object} [jqXHR] jQuery jqXHR
         * @return {Object} re-formmated JSON data
         ###
        parse: (response, jqXHR) ->
            if(response.success == true)
                status = true
            else
                status = false

            return {status: status}
    
)