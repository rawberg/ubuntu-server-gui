define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        Session = require('models/Session');

    return Backbone.Model.extend({

        url: 'https://cloud.ubuntuservergui.com/register/',
        remote: true,
        defaults: {
            email: '',
            password: ''
        },

        initialize: function() {
            this.login = _.bind(this.login, this);
            var session = new Session();
            this.session = function() { return session; };
        },

        login: function() {
            Backbone.sync('create', this.session(), {
                url: 'https://cloud.ubuntuservergui.com/sessions/',
                context: this,
                contentType: 'application/json',
                data: '{"email": "' + this.get('email') + '", "password": "' + this.get('password') + '"}',
                success: this.loginSuccess,
                error: this.loginError
            });
        },

        loginSuccess: function() {
            this.session().set('active', true);
        },

        loginError: function(jqXHR, textStatus) {
            var msg;
            this.App = require('App');
            this.session().set('active', false);
            msg = jQuery.parseJSON(jqXHR.responseText) || {"email or password": ["Invalid email or password."]};
            this.App.vent.trigger('user:login-error', msg);
        }
    });
});
