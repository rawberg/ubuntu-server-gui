define([
    'underscore',
    'backbone',
    'models/Session',
    'app'],
    function(_, Backbone, Session, App) {
        return Backbone.Model.extend({

            url: 'https://cloud.ubuntuservergui.dev/main/login',
            remote: true,
            defaults: {
                email: '',
                password: ''
            },

            initialize: function() {
                this.login = _.bind(this.login, this);
                this.App = App;
                this.session = new Session({});
            },

            login: function() {
                var that = this;
                $.ajax({
                    url: 'https://cloud.ubuntuservergui.com/1.0/session',
                    type: 'POST',
                    context: that,
                    data: that.toJSON(),
                    success: that.loginSuccess,
                    error: that.loginError
                });
            },

            loginSuccess: function() {
                this.session.set('active', true);
            },

            loginError: function(jqXHR, textStatus) {
                var msg, _ref, _ref1;
                this.session.set('active', false);
                msg = jQuery.parseJSON(jqXHR.responseText) || 'error';
                this.App.vent.trigger('auth:invalidLoginRequest', msg);
            }
        });
    }
);
