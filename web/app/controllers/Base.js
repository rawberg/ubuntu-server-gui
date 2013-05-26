define(function (require_browser) {
    var Marionette = require_browser('marionette'),
        App = require_browser('App'),
        LoginSignupLayout = require_browser('views/login-signup/LoginSignupLayout'),
        LoginView = require_browser('views/login-signup/LoginView'),
        SignupView = require_browser('views/login-signup/SignupView');

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