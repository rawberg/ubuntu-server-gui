define(function (require_browser) {
    var Marionette = require_browser('marionette');

    return Marionette.AppRouter.extend({

        appRoutes: {
            "": "dashboard",
            "filemanager": "filemanager",
            "dashboard": "dashboard",
            "auth/login": "login",
            "*path": "dashboard"
        }
    });
});