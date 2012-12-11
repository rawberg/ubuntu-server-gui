define(function (require) {
    var User = require('models/User'),
        LoginSignupView = require('views/login-signup/LoginSignupLayout');

    describe('LoginSignupLayout - Layout', function() {
        it('should have a loginRegion and signupRegion', function() {
            var loginSignupView = new LoginSignupView();
            (loginSignupView.loginRegion).should.exist;
            (loginSignupView.signupRegion).should.exist;
        });
    });
});