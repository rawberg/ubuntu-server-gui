define([
    'jquery',
    'backbone',
    'App',
    'models/Session',
    'models/User',
    'routers/MainRouter',
    'views/MainToolbar',
    'views/MainFooterbar',
    'backbone_dualstorage'],

    function($, Backbone, App, Session, User, MainRouter, MainToolbar, MainFooterbar) {
        App.start();
        App.user = new User();

        $(document).ready(function() {
            App.routers.main = new MainRouter();

            Backbone.history.start({
                pushState: false
            });

            // var toolbar = new MainToolbar();
            // var footerbar = new MainFooterbar();

            // App.mainToolbar.show(toolbar);
            // App.mainFooterbar.show(footerbar);

            // App.user.session.on('change:active', function(session, active) {
            //     if (active === true) {
            //         toolbar = new MainToolbar();
            //         return App.mainToolbar.show(toolbar);
            //     }
            // });
        });
    }
);
