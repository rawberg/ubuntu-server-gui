define(function (require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var App = require('App');
    var Marionette = require('marionette');
    var ModelBinder = require('backbone_modelbinder');
    var loginSignupLayoutTpl = require('text!views/loginsignup/templates/loginsignup.html');

    return Marionette.ItemView.extend({
        template: _.template(loginSignupLayoutTpl),
        tagName: 'div',
        id: 'loginsignup_view',

        events: {
            'click #login_btn': 'onLoginClick',
            'keyup input': 'onInputKeyup'
        },

        initialize: function(options) {
            this.App = App;
            this.modelBinder = new ModelBinder();
            this.model = options.model;

            this.App.vent.bind('auth:invalidLoginRequest', function(msg) {
                _this.displayError(msg);
                _this.enableForm();
            });
        },

        close: function() {
            this.modelBinder.unbind();
            Marionette.ItemView.__super__.close.apply(this, arguments);
        },

        disableForm: function() {
            this.$(':input').attr('disabled', true);
        },

        displayError: function(msg) {
            var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if ((msg !== null)) {
                this.$('#loginErrorMsg').text(msg).css('visibility', 'visible');
            } else if (this.model.get('email').length === 0 && this.model.get('password').length === 0) {
                this.$('#loginErrorMsg').text('Email and Password are required.').css('visibility', 'visible');
            } else if (this.model.get('email').length === 0 || !emailRegex.test(this.model.get('email'))) {
                this.$('#loginErrorMsg').text('Valid email is required.').css('visibility', 'visible');
            } else if (this.model.get('password').length === 0) {
                this.$('#loginErrorMsg').text('Password is required.').css('visibility', 'visible');
            }
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
            if (this.model.get('email').length <= 0 || this.model.get('password') <= 0) {
                this.displayError();
            } else {
                this.disableForm();
                this.model.login();
            }
        }
    });
});
