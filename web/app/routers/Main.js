define(function (require_browser) {
    var Marionette = require_browser('marionette');

    return Marionette.AppRouter.extend({

        appRoutes: {
            "": "dashboard",
            "filemanager": "filemanager",
            "filemanager/*path": "filemanager",
            "dashboard": "dashboard",
            "editor": "editor",
            "auth/login": "login",
            "*path": "dashboard"
        }
    });
});