define([
    'jquery'
    'underscore'
    'backbone'
    'app'
    'model/Session'

], ($, _, Backbone, App, Session) ->

    ###*
     * @class User
     * Current user
     * @extends Backbone.Model
     ###    
    class User extends Backbone.Model

        ###*
         * @constructor
         * Creates a new User model.
         * @param {Object} [attributes] attributes for Backbone.Model         
         * @param {Object} [options] config options for Backbone.Model
         ###
        constructor: (attributes={}, options={}) ->
            @App = App
            @remote = true
            @url = 'https://cloud.ubuntuservergui.dev/main/login'
            @defaults = 
                email: ''
                password: ''

            @session = new Session({})
            super
            return

        login: () =>
            $.ajax({
                url: 'https://cloud.ubuntuservergui.dev/main/login'
                type: 'POST'
                context: @
                data: @toJSON()
                success: @loginSuccess
                error:  @loginError
            })
            return

        loginSuccess: () ->
            @session.set('active', true)
            return

        loginError: (jqXHR, textStatus) ->
            @session.set('active', false)
            msg = jQuery.parseJSON(jqXHR.responseText)?.msg ? 'error'
            @App.vent.trigger('auth:invalidLoginRequest', msg)
            return

)
