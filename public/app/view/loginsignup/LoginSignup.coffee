define([
    'jquery',
    'underscore',
    'backbone_marionette',
    'backbone_modelbinder',
    'text!view/loginsignup/tpl/loginsignup.html'
    
], ($, _, BackboneMarionette, BackboneModelBinder, loginSignupLayoutTpl) ->

    ###*
     * @class LoginSignup
     * Displays login/signup form.
     * @extends BackboneMarionette.ItemView
     ###    
    class LoginSignup extends BackboneMarionette.ItemView

        ###*
         * @constructor
         * Creates a new LoginSignup instance.
         * @param {Object} [options] config options for BackboneMarionette.ItemView.
         * @return {Object} LoginSignup instance
         ###        
        constructor: (options = {}) ->
            @template = _.template(loginSignupLayoutTpl)
        
            @tagName = 'div'
            @id = 'loginsignup_view'

            @model = options.model
            @modelBinder  = new BackboneModelBinder()

            @events =
                'click #login_btn': 'onLoginClick'
                'keyup input': 'onInputKeyup'

            if(@model.app?)
                @app = @model.app
                @app.vent.bind('auth:invalidLoginRequest', (msg) =>
                    @displayError(msg)
                    @enableForm()
                    return
                )


            return super(options)

        
        close: ->
            @modelBinder.unbind()
            super
            return

        disableForm: ->
            @.$(':input').attr('disabled', true)
            return

        displayError: (msg) ->
            emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

            if(msg?)
                @$('#loginErrorMsg').text(msg).css('visibility', 'visible')
            else if(@model.get('email').length == 0 and @model.get('password').length == 0)
                @$('#loginErrorMsg').text('Email and Password are required.').css('visibility', 'visible')
            else if(@model.get('email').length == 0 or !emailRegex.test(@model.get('email')))
                @$('#loginErrorMsg').text('Valid email is required.').css('visibility', 'visible')
            else if(@model.get('password').length == 0)
                @$('#loginErrorMsg').text('Password is required.').css('visibility', 'visible')
            return

        clearError: ->
            @$('#loginErrorMsg').text('').css('visibility', 'hidden')
            return

        enableForm: ->
            @.$(':input').attr('disabled', false)

        onInputKeyup: (eventObj) ->
            if (eventObj.keyCode == 13)
                $(eventObj.target).closest('form').parent().find('button').click()
            return

        onRender: ->
            @modelBinder.bind(@model, @el)
            return @

        onLoginClick: (eventObj) ->
            eventObj.stopPropagation()
            eventObj.preventDefault()
            eventObj.returnValue = false

            @clearError()
            
            if(@model.get('email').length <= 0 or @model.get('password') <= 0)
                @displayError()
            else
                @disableForm()  
                @model.login()

            return

)
