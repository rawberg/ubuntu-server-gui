define(function (require) {
    var Marionette = require('marionette'),
        BaseRouter = require('routers/Base');

    return BaseRouter.extend({
        initialize: function(options) {
            this.controller = options.controller;
        },

        appRoutes: {
            "": "dashboard",
            "dashboard": "dashboard",
            "auth/login": "login",
            "*path": "notFound"
        }
    });
});