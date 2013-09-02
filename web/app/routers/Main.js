define(function (require_browser) {
    var Marionette = require_browser('marionette');

    return Marionette.AppRouter.extend({

        appRoutes: {
            "": "filemanager",
            "filemanager": "filemanager",
            "filemanager/*path": "filemanager",
            "dashboard": "dashboard",
            "auth/login": "login",
            "*path": "filemanager"
        }
    });
});