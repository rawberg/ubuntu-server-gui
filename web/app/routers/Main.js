define(['routers/Base'], function (BaseRouter) {

    return BaseRouter.extend({
        appRoutes: {
            "": "dashboard",
            "filemanager": "filemanager",
            "filemanager/*path": "filemanager",
            "dashboard": "dashboard",
            "*path": "dashboard"
        }
    });
});