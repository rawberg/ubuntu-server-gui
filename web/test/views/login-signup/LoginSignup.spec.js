define(function (require_browser) {
    var User = require_browser('models/User'),
        LoginSignupView = require_browser('views/login-signup/LoginSignupLayout');

    describe('LoginSignupLayout - Layout', function() {
        it('should have a loginRegion and signupRegion', function() {
            var loginSignupView = new LoginSignupView();
            (loginSignupView.loginRegion).should.exist;
            (loginSignupView.signupRegion).should.exist;
        });
    });
});