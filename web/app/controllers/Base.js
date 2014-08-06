define(['marionette',
        'App',
        'views/login-signup/LoginSignupLayout',
        'views/login-signup/LoginView',
        'views/login-signup/SignupView'], function (
        Marionette,
        App,
        LoginSignupLayout,
        LoginView,
        SignupView) {

    return Marionette.Controller.extend({

        notFound: function() {
            console.log('not found');
        }
    });
});