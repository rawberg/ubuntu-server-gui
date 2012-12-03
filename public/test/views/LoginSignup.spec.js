define(function (require) {
    var User = require('models/User'),
        LoginSignup = require('views/login-signup/LoginSignupView'),
        responses = JSON.parse(require('text!/test/mock-responses/sessions.json'));

    describe('LoginSignup - ItemView', function() {

        describe('login form - event bindings & validation', function() {
            var user, loginSignup, App;
            beforeEach(function() {
                sinon.spy(LoginSignup.prototype, 'onLoginClick');
                sinon.spy(LoginSignup.prototype, 'displayError');
                sinon.spy(LoginSignup.prototype, 'clearError');
                sinon.spy(LoginSignup.prototype, 'disableForm');
                sinon.spy(LoginSignup.prototype, 'enableForm');
                sinon.spy(User.prototype, 'login');

                // Todo: refactor this into a MockApp helper
                App = sinon.spy();
                App.vent = {trigger: sinon.spy(), bind: sinon.spy()};
                App.routers = sinon.spy();
                App.routers.main = sinon.spy();
                App.routers.main.navigate = sinon.spy();

                user = new User();
                user.session().App = App;

                loginSignup = new LoginSignup({
                    model: user
                });

                loginSignup.render();
            });

            afterEach(function() {
                loginSignup.remove();
                LoginSignup.prototype.onLoginClick.restore();
                LoginSignup.prototype.displayError.restore();
                LoginSignup.prototype.clearError.restore();
                LoginSignup.prototype.disableForm.restore();
                LoginSignup.prototype.enableForm.restore();
                User.prototype.login.restore();
            });

            it('should update user model when field values change', function() {
                loginSignup.$('input[name=email]').val('russell.peters@aol.com');
                loginSignup.$('input[name=email]').trigger('change');
                loginSignup.$('input[name=password]').val('sample-pass');
                loginSignup.$('input[name=password]').trigger('change');

                (user.get('email')).should.equal('russell.peters@aol.com');
                (user.get('password')).should.equal('sample-pass');
            });

            it('should show an error message if email field is empty', function() {
                loginSignup.$('input[name=password]').val('pass');
                loginSignup.$('input[name=password]').trigger('change');
                loginSignup.$('#login_btn').click();
                (loginSignup.displayError).should.have.been.called;
                (loginSignup.$('#loginErrorMsg').css('visibility') === 'visible').should.be.ok;
            });

            it('should show an error message if password field is empty', function() {
                loginSignup.$('input[name=email]').val('sample@mail.com');
                loginSignup.$('input[name=email]').trigger('change');
                loginSignup.$('#login_btn').click();
                (loginSignup.displayError).should.have.been.called;
                (loginSignup.$('#loginErrorMsg').css('visibility') === 'visible').should.be.ok;
            });

            it('should call displayError and show error messages if email or password fields are empty', function() {
                sinon.spy(loginSignup.model, 'login');
                loginSignup.$('input[name=email]').val('');
                loginSignup.$('input[name=email]').trigger('change');
                loginSignup.$('input[name=password]').val('');
                loginSignup.$('input[name=password]').trigger('change');
                loginSignup.$('#login_btn').click();

                (loginSignup.onLoginClick).should.have.been.called;
                (loginSignup.displayError).should.have.been.called;
                (loginSignup.disableForm).should.not.have.been.called;
                (loginSignup.model.login).should.not.have.been.called;
                (loginSignup.$('#loginErrorMsg').css('visibility') === 'visible').should.be.ok;

                loginSignup.model.login.restore();
            });

            it('should call onLoginClick and clearError when login button is clicked', function() {
                loginSignup.$('#login_btn').click();

                (loginSignup.onLoginClick).should.have.been.called;
                (loginSignup.clearError).should.have.been.called;
            });

            it('should disableForm and call user.login when login button is clicked with valid data', function() {
                var server = sinon.fakeServer.create();
                sinon.spy(loginSignup.model, 'login');

                loginSignup.$('input[name=email]').val('sample@mail.com');
                loginSignup.$('input[name=email]').trigger('change');
                loginSignup.$('input[name=password]').val('pass');
                loginSignup.$('input[name=password]').trigger('change');
                loginSignup.$('#login_btn').click();

                server.respondWith("POST", "https://cloud.ubuntuservergui.com/sessions/", [
                    202,
                    {"Content-Type": "application/json"},
                    JSON.stringify(responses["https://cloud.ubuntuservergui.com/sessions/"]["POST"]["202"])
                ]);
                server.respond();

                (loginSignup.clearError).should.have.been.called;
                (loginSignup.disableForm).should.have.been.called;
                (loginSignup.model.login).should.have.been.called;

                loginSignup.model.login.restore();
                server.restore();
            });

            it('should display an error message when server responds with a 406 error', function() {
                var server = sinon.fakeServer.create();

                loginSignup.$('input[name=email]').val('wrong-email@mail.com');
                loginSignup.$('input[name=email]').trigger('change');
                loginSignup.$('input[name=password]').val('pass');
                loginSignup.$('input[name=password]').trigger('change');
                loginSignup.$('#login_btn').click();

                server.respondWith("POST", "https://cloud.ubuntuservergui.com/sessions/", [
                    406,
                    {"Content-Type": "application/json"},
                    JSON.stringify(responses["https://cloud.ubuntuservergui.com/sessions/"]["POST"]["406"][0])
                ]);
                server.respond();

                var serverErrorMsg = _.flatten(responses["https://cloud.ubuntuservergui.com/sessions/"]["POST"]["406"][0]['errors'], true)[0];
                (loginSignup.displayError).should.have.been.calledWith(serverErrorMsg);
                (loginSignup.enableForm).should.have.been.called;
                (loginSignup.$('#loginErrorMsg').css('visibility') === 'visible').should.be.ok;

                server.restore;
            });

            it('should display an error message when server responds with a 400 error', function() {
                var server = sinon.fakeServer.create();

                loginSignup.$('input[name=email]').val('wrong-email@mail.com');
                loginSignup.$('input[name=email]').trigger('change');
                loginSignup.$('input[name=password]').val('pass');
                loginSignup.$('input[name=password]').trigger('change');
                loginSignup.$('#login_btn').click();

                server.respondWith("POST", "https://cloud.ubuntuservergui.com/sessions/", [
                    400,
                    {"Content-Type": "application/json"},
                    JSON.stringify(responses["https://cloud.ubuntuservergui.com/sessions/"]["POST"]["400"][0])
                ]);
                server.respond();

                var serverErrorMsg = _.flatten(responses["https://cloud.ubuntuservergui.com/sessions/"]["POST"]["400"][0]['errors'], true)[0];
                (loginSignup.displayError).should.have.been.calledWith(serverErrorMsg);
                (loginSignup.enableForm).should.have.been.called;
                (loginSignup.$('#loginErrorMsg').css('visibility') === 'visible').should.be.ok;

                server.restore;
            });

        });
    });
});
