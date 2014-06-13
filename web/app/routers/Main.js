define(['marionette'], function (Marionette) {

    return Marionette.AppRouter.extend({
        appRoutes: {
            "": "dashboard",
            "filemanager": "filemanager",
            "filemanager/*path": "filemanager",
            "dashboard": "dashboard",
            "auth/login": "login",
            "*path": "dashboard"
        }
    });
});