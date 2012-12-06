define(function (require) {
    var _ = require('underscore'),
        Marionette = require('marionette'),
        App = require('App'),
        LoginSignupView = require('views/login-signup/LoginSignupView');

    return Marionette.Controller.extend({
        initialize: function(options) {
            this.App = (options && options.App) ? options.App : App;
        },

        login: function() {
            this.App.mainViewport.show(new LoginSignupView({model: this.App.user()}));
        },

        notFound: function() {
            console.log('not found');
        }
    });
});