define(function (require) {
    var Marionette = require('marionette'),
        App = require('App'),
        LoginSignupLayout = require('views/login-signup/LoginSignupLayout'),
        LoginView = require('views/login-signup/LoginView'),
        SignupView = require('views/login-signup/SignupView');

    return Marionette.Controller.extend({
        initialize: function(options) {
            this.App = (options && options.App) ? options.App : App;
        },

        login: function() {
            var loginSignupLayout = new LoginSignupLayout();
            this.App.mainViewport.show(loginSignupLayout);
            loginSignupLayout.loginRegion.show(new LoginView({model: this.App.user()}));
            loginSignupLayout.signupRegion.show(new SignupView({model: this.App.user()}));
        },

        notFound: function() {
            console.log('not found');
        }
    });
});