define(function (require_browser) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        loginSignupLayoutTpl = require_browser('text!views/login-signup/templates/layout.html');

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