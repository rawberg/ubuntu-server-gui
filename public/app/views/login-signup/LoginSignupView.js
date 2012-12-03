define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        App = require('App'),
        Marionette = require('marionette'),
        ModelBinder = require('backbone_modelbinder'),
        loginSignupLayoutTpl = require('text!views/login-signup/templates/login-signup.html');

    return Marionette.ItemView.extend({
        template: _.template(loginSignupLayoutTpl),
        tagName: 'div',
        id: 'loginsignup_view',
        className: 'mock-style',

        events: {
            'click #login_btn': 'onLoginClick',
            'keyup input': 'onInputKeyup'
        },

        initialize: function(options) {
            this.App = App;
            this.modelBinder = new ModelBinder();
            this.model = options.model;
            this.App.vent.bind('user:login-error', function(msg) {
                this.displayError(_.flatten(msg.errors, true)[0]);
                this.enableForm();
            }, this);
        },

        close: function() {
            this.modelBinder.unbind();
            Marionette.ItemView.__super__.close.apply(this, arguments);
        },

        disableForm: function() {
            this.$(':input').attr('disabled', true);
        },

        displayError: function(msg) {
            this.$('#loginErrorMsg').text(msg).css('visibility', 'visible');
        },

        clearError: function() {
            this.$('#loginErrorMsg').text('').css('visibility', 'hidden');
        },

        enableForm: function() {
            this.$(':input').attr('disabled', false);
        },

        onInputKeyup: function(eventObj) {
            if (eventObj.keyCode === 13) {
                $(eventObj.target).closest('form').parent().find('button').click();
            }
        },

        onRender: function() {
            return this.modelBinder.bind(this.model, this.el);
        },

        onLoginClick: function(eventObj) {
            eventObj.stopPropagation();
            eventObj.preventDefault();
            eventObj.returnValue = false;

            this.clearError();

            var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (this.model.get('email').length === 0 && this.model.get('password').length === 0) {
                this.displayError('Email and Password are required.');
            } else if (this.model.get('email').length === 0 || !emailRegex.test(this.model.get('email'))) {
                this.displayError('Valid email is required.');
            } else if (this.model.get('password').length === 0) {
                this.displayError('Password is required.');
            } else {
                this.disableForm();
                this.model.login();
            }
        }
    });
});
