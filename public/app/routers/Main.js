define(function (require) {
    var Marionette = require('marionette');

    return Marionette.AppRouter.extend({

        appRoutes: {
            "": "dashboard",
            "dashboard": "dashboard",
            "auth/login": "login",
            "*path": "login"
        }
    });
});