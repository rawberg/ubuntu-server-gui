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

        initialize: function(attributes) {
            this.login = _.bind(this.login, this);
            this.signup = _.bind(this.signup, this);
            var session = new Session();
            this.session = function() { return session; };
        },

        login: function() {
            Backbone.sync('create', this.session(), {
                url: 'https://cloud.ubuntuservergui.com/sessions/',
                context: this,
                contentType: 'application/json',
                data: '{"email": "' + this.get('email') + '", "password": "' + this.get('password') + '"}',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: this.loginSuccess,
                error: this.loginError
            });
        },

        loginSuccess: function() {
            this.session().set('active', true);
        },

        loginError: function(jqXHR, textStatus) {
            this.session().set('active', false);

            var msg;
            msg = $.parseJSON(jqXHR.responseText) || {"email or password": ["Invalid email or password."]};
            this.trigger('user:login-error', msg);
        },

        signupError: function(jqXHR, textStatus) {
            this.session().set('active', false);

            var msg;
            msg = $.parseJSON(jqXHR.responseText) || {"email or password": ["Invalid email or password."]};
            this.trigger('user:signup-error', msg);
        },

        signup: function() {
            Backbone.sync('create', this, {
                url: 'https://cloud.ubuntuservergui.com/register/',
                context: this,
                contentType: 'application/json',
                data: '{"email": "' + this.get('email') + '", "password": "' + this.get('password') + '"}',
//                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: this.loginSuccess,
                error: this.signupError
            });
        }
    });
});
