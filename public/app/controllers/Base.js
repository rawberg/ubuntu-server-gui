define(function (require, exports, module) {
    var _ = require('underscore'),
        Marionette = require('marionette'),
        App = require('App');

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
            console.log('show login here');
            // this.App.mainToolbar.close();
        },

        notFound: function() {
            console.log('not found');
        }
    });
});