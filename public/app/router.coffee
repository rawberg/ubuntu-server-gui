define([
    'jquery'
    'underscore'
    'backbone'
    'backbone_marionette'

], ($, _, Backbone, BackboneMarionette) ->

    class Router extends BackboneMarionette.AppRouter
        constructor: () ->
            @appRoutes =
                "": "dashboard"
                "dashboard": "dashboard"
                "index.html": "dashboard"
                "auth/login": "login"

            super
            return
)