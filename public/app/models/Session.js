define([
    'jquery',
    'underscore',
    'backbone',
    'app'],
    function($, _, Backbone, App) {
        return Backbone.Model.extend({

            remote: true,
            defaults: {
                'active': '',
                'attemptedRoute': ''
            },

            initialize: function() {
                this.App = App;
                this.on('change:active', this.onStatusChange, this);
            },

            onStatusChange: function(session, active) {
                if (active === false) {
                    if (Backbone.history && (Backbone.history.fragment !== 'auth/login')) {
                        this.set('attemptedRoute', Backbone.history.fragment);
                    }
                    this.App.routers.main.navigate('auth/login', {
                        trigger: true,
                        replace: true
                    });
                } else if (active === true) {
                    this.App.routers.main.navigate(this.get('attemptedRoute'), {
                        trigger: true,
                        replace: true
                    });
                }
            },

            parse: function(response, jqXHR) {
                var status;
                if (response.success === true) {
                    status = true;
                } else {
                    status = false;
                }
                return {status: status};
            }
        });
    }
);
