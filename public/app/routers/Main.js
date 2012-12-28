define(function (require) {
    var Marionette = require('marionette'),
        BaseRouter = require('routers/Base');

    return BaseRouter.extend({

        appRoutes: {
            "": "dashboard",
            "dashboard": "dashboard",
            "auth/login": "login",
            "*path": "login"
        }
    });
});