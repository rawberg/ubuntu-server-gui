define(function (require_browser) {
        var _ = require_browser('underscore'),
        BaseForm = require_browser('views/BaseForm'),
        signupTpl = require_browser('text!views/login-signup/templates/signup.html');

    return BaseForm.extend({
        template: _.template(signupTpl),
        tagName: 'div',
        id: 'signup_view',

        events: {
            'click #signup_btn': 'onSignupClick',
            'keyup input': 'onInputKeyup'
        },

        ui: {
            email: '[name=signup_email]',
            password: '[name=signup_password]'
        },

        initialize: function(options) {
            this.model = options.model;
            this.model.bind('user:signup-error', function(msg) {
                this.displayError(_.flatten(msg.errors, true)[0]);
                this.enableForm();
            }, this);
            BaseForm.__super__.initialize.apply(this, arguments);
        },

        close: function() {
            this.model.unbind();
            BaseForm.__super__.close.apply(this, arguments);
        },

        onSignupClick: function(eventObj) {
            eventObj.stopPropagation();
            eventObj.preventDefault();
            eventObj.returnValue = false;
            this.clearError();

            this.model.set('email', this.ui.email.val());
            this.model.set('password', this.ui.password.val());

            var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (this.model.get('email').length === 0 && this.model.get('password').length === 0) {
                this.displayError('Email and Password are required.');
            } else if (this.model.get('email').length === 0 || !emailRegex.test(this.model.get('email'))) {
                this.displayError('Valid email is required.');
            } else if (this.model.get('password').length === 0) {
                this.displayError('Password is required.');
            } else {
                this.disableForm();
                this.model.signup();
            }
        }
    });
});
