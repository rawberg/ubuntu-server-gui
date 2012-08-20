define([
    'underscore'
    'backbone'
    'app'
    'view/dashboard/Dashboard'
    'view/loginsignup/LoginSignup'
    
], (_, Backbone, App, Dashboard, LoginSignup) ->
    
    ###*
     * @class Main
     * Main entry point for the application.
     * @extends Backbone.Events
     ###    
    class Main
        _.extend(@prototype, Backbone.Events)
        
        ###*
         * @constructor
         * Creates a new Main controller.
         * @param {Object} [options] config options for the controller.
         * @return {Object} Main controller instance.
         ###
        constructor: (options) ->
            @App = App
            @views = {}
            return @

        ###*
         * @method
         * Creates the application dashboard.
         * @return {Object} Main controller instance.
         ###
        dashboard: () ->               
            dashboardLayout = new Dashboard()
            @App.mainViewport.show(dashboardLayout)
            return @

        ###*
         * @method
         * Creates the application login screen.
         * @return {Object} Main controller instance.
         ###
        login: () ->
            @App.mainToolbar.close()
            #loginSignup = new LoginSignup({model: @App.user})
            #loginSignup.on('submitLogin', @onSubmitLogin)
            #@App.mainViewport.show(loginSignup)        
            return @

        onSubmitLogin: (user) ->
            #user.login()
            return                     

)