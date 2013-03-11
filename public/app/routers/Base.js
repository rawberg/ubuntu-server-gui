define(function (require) {
    var _ = require('underscore'),
        Backbone = require('backbone'),
        Marionette = require('marionette'),
        App = require('App');

    return Marionette.AppRouter.extend({

        initialize: function() {
            this.App = App;
        },

//        ensureActiveSession: function() {
//            if(!this.App.user().session().get('active')) {
//                this.App.user().session().set('attemptedRoute', Backbone.history.getFragment());
//                this.navigate('auth/login', {trigger: true});
//                return false;
//            } else {
//                return true;
//            }
//        },

        route: function(route, name, callback) {
            if(name !== 'login') {
                var originalCallback = callback;

                callback = _.bind(function() {
                    if(this.ensureActiveSession()) {
                        originalCallback.apply( this, arguments );
                    }
                }, this);
            }

            Marionette.AppRouter.prototype.route.call(this, route, name, callback);
        }
    });
});