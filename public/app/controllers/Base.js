define(function (require, exports, module) {
    var _ = require('underscore'),
        Marionette = require('marionette'),
        App = require('App'),
        LoginSignupView = require('views/login-signup/LoginSignupView');

    return Marionette.Controller.extend({
        initialize: function(options) {
            this.App = (options && options.App) ? options.App : App;
        },

        ensureAuthenticated: function() {
            if(this.App.user().session().get('active')) {
                return true;
            } else {
                return 'auth/login';
            }
        },

        login: function() {
            this.App.mainViewport.show(new LoginSignupView({model: this.App.user()}));
        },

        notFound: function() {
            console.log('not found');
        }
    });
});