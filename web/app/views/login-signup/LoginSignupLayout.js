define(['jquery',
        'underscore',
        'marionette',
        'text!views/login-signup/templates/layout.html'], function (
        $,
        _,
        Marionette,
        loginSignupLayoutTpl) {

    return Marionette.LayoutView.extend({
        template: _.template(loginSignupLayoutTpl),
        tagName: 'div',
        className: 'login-signup-layout',

        regions: {
            loginRegion: '.login-container',
            signupRegion: '.signup-container'
        }
    });
});