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
        controllerTriggers: new Backbone.Wreqr.Commands(),

        initialize: function(options) {
            this.App = (options && options.App) ? options.App : App;
            this.controllerTriggers.setHandler('navigate', this._navigate, this);
        },

        // provides a way to navigate between controller methods
        // from views without requiring global App object.
        _navigate: function() {
            var args = Array.prototype.slice.call(arguments);
            var method = args.shift();
            if (typeof(this[method]) === 'function') {
                this[method].apply(this, args);
            } else {
                throw new Error('method: ' + method + ' not found on controller');
            }
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