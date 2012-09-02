require.config(
    paths:
        jquery: '../lib/jquery/jquery-1.7.2.min'
        underscore: '../lib/underscore/underscore'
        backbone: '../lib/backbone/backbone'
        backbone_dualstorage: '../lib/backbone.dualstorage/backbone.dualstorage'
        backbone_marionette: '../lib/backbone.marionette/backbone.marionette'
        backbone_modelbinder: '../lib/backbone.modelbinder/Backbone.ModelBinder.min'
        text: '../lib/require/text'
        bootstrap_modal: '../css/sass-twitter-bootstrap/js/bootstrap-modal'
        bootstrap_transition: '../css/sass-twitter-bootstrap/js/bootstrap-transition'
        gauge: '../lib/gauge.js/dist/gauge'
        contextmenu: '../lib/contextmenu/contextmenu'

    shim:
        'underscore':
            exports: '_'

        'backbone':
            deps: ['underscore', 'jquery']
            exports: 'Backbone'

        'backbone_dualstorage':
            deps: ['backbone']

        'bootstrap_modal':
            deps: ['jquery']
            exports: 'jQuery.fn.modal'

        'bootstrap_transition':
            deps: ['jquery']

        'gauge':
            deps: ['jquery']
            exports: 'Donut'

        'contextmenu':
            exports: 'contextmenu'
)

###*
 * This setup allows all of these modules to access the
 * application module safely, after it's been fully initialized.
 * 
 * Other techniques caused requirejs circular dependency issues.
 *
 ###
require([
    'jquery'
    'backbone'
    'app'
    'model/Session'
    'model/User'
    'controller/Main'
    'router'
    'view/MainToolbar'
    'view/MainFooterbar'
    'view/modal/AddServer'
    'backbone_dualstorage'

], ($, Backbone, App, Session, User, MainController, Router, MainToolbar, MainFooterbar, AddServerModal) ->
    App.start()
    App.user = new User()
    mainController = new MainController()

    
    $(document).ready(() ->
        App.routers.main = new Router({controller: mainController})
        Backbone.history.start({pushState: false})
               
        toolbar = new MainToolbar()
        App.mainToolbar.show(toolbar)

        footerbar = new MainFooterbar()
        App.mainFooterbar.show(footerbar)
        
        
        # make sure the toolbar is shown upon
        # session activation
        App.user.session.on('change:active', (session, active) =>
            if(active == true)
                toolbar = new MainToolbar()
                App.mainToolbar.show(toolbar)
        )
    
        return
    )
    return
)