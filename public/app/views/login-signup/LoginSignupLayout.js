define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        loginSignupLayoutTpl = require('text!views/login-signup/templates/layout.html');

    return Marionette.Layout.extend({
        template: _.template(loginSignupLayoutTpl),
        tagName: 'div',
        className: 'login-signup-layout',

        regions: {
            loginRegion: '.login-container',
            signupRegion: '.signup-container'
        }
    });
});