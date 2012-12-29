define(function (require) {
    var User = require('models/User'),
        SignupView = require('views/login-signup/SignupView'),
        responses = JSON.parse(require('text!/test/mock-responses/register.json'));

    describe('SignupView - ItemView', function() {

        describe('signup form - event bindings & validation', function() {
            var user, signupView, App;
            beforeEach(function() {
                sinon.spy(SignupView.prototype, 'onSignupClick');
                sinon.spy(SignupView.prototype, 'displayError');
                sinon.spy(SignupView.prototype, 'clearError');
                sinon.spy(SignupView.prototype, 'disableForm');
                sinon.spy(SignupView.prototype, 'enableForm');
                sinon.spy(User.prototype, 'signup');

                // Todo: refactor this into a MockApp helper
                App = sinon.spy();
                App.vent = {trigger: sinon.spy(), bind: sinon.spy()};
                Backbone.history = new Backbone.History();
                Backbone.history.navigate = sinon.spy();

                user = new User();
                user.session().App = App;

                signupView = new SignupView({
                    model: user
                });

                signupView.render();
            });

            afterEach(function() {
                signupView.remove();
                SignupView.prototype.onSignupClick.restore();
                SignupView.prototype.displayError.restore();
                SignupView.prototype.clearError.restore();
                SignupView.prototype.disableForm.restore();
                SignupView.prototype.enableForm.restore();
                User.prototype.signup.restore();
            });

            it('should update user model when field values change', function() {
                var server = sinon.fakeServer.create();
                signupView.$('#signup_form input[name=signup_email]').val('russell.peters@aol.com');
                signupView.$('#signup_form input[name=signup_email]').trigger('change');
                signupView.$('#signup_form input[name=signup_password]').val('sample-pass');
                signupView.$('#signup_form input[name=signup_password]').trigger('change');
                signupView.$('#signup_btn').click();

                server.respondWith("POST", "https://cloud.ubuntuservergui.com/register/", [
                    202,
                    {"Content-Type": "application/json"},
                    JSON.stringify(responses["https://cloud.ubuntuservergui.com/register/"]["POST"]["202"][0])
                ]);
                server.respond();

                (user.get('email')).should.equal('russell.peters@aol.com');
                (user.get('password')).should.equal('sample-pass');
            });

            it('should show an error message if email field is empty', function() {
                signupView.$('#signup_form input[name=signup_password]').val('pass');
                signupView.$('#signup_form input[name=signup_password]').trigger('change');
                signupView.$('#signup_btn').click();
                (signupView.displayError).should.have.been.called;
                (signupView.$('.form-errors').css('visibility') === 'visible').should.be.ok;
            });

            it('should show an error message if password field is empty', function() {
                signupView.$('#signup_form input[name=signup_email]').val('sample@mail.com');
                signupView.$('#signup_form input[name=signup_email]').trigger('change');
                signupView.$('#signup_btn').click();
                (signupView.displayError).should.have.been.called;
                (signupView.$('.form-errors').css('visibility') === 'visible').should.be.ok;
            });

            it('should call displayError and show error messages if email or password fields are empty', function() {
                sinon.spy(signupView.model, 'login');
                signupView.$('#signup_form input[name=signup_email]').val('');
                signupView.$('#signup_form input[name=signup_email]').trigger('change');
                signupView.$('#signup_form input[name=signup_password]').val('');
                signupView.$('#signup_form input[name=signup_password]').trigger('change');
                signupView.$('#signup_btn').click();

                (signupView.onSignupClick).should.have.been.called;
                (signupView.displayError).should.have.been.called;
                (signupView.disableForm).should.not.have.been.called;
                (signupView.model.login).should.not.have.been.called;
                (signupView.$('.form-errors').css('visibility') === 'visible').should.be.ok;

                signupView.model.login.restore();
            });

            it('should call onSignupclick and clearError when login button is clicked', function() {
                signupView.$('#signup_btn').click();

                (signupView.onSignupClick).should.have.been.called;
                (signupView.clearError).should.have.been.called;
            });

            it('should disableForm and call user.signup when signup button is clicked with valid data', function() {
                var server = sinon.fakeServer.create();
                sinon.spy(signupView.model, 'signup');

                signupView.$('#signup_form input[name=signup_email]').val('sample@mail.com');
                signupView.$('#signup_form input[name=signup_email]').trigger('change');
                signupView.$('#signup_form input[name=signup_password]').val('pass');
                signupView.$('#signup_form input[name=signup_password]').trigger('change');
                signupView.$('#signup_btn').click();

                server.respondWith("POST", "https://cloud.ubuntuservergui.com/register/", [
                    202,
                    {"Content-Type": "application/json"},
                    JSON.stringify(responses["https://cloud.ubuntuservergui.com/register/"]["POST"]["202"][0])
                ]);
                server.respond();

                (signupView.clearError).should.have.been.called;
                (signupView.disableForm).should.have.been.called;
                (signupView.model.signup).should.have.been.called;

                signupView.model.signup.restore();
                server.restore();
            });

            it('should display an error message when server responds with a 406 error', function() {
                var server = sinon.fakeServer.create();

                signupView.$('#signup_form input[name=signup_email]').val('wrong-email@mail.com');
                signupView.$('#signup_form input[name=signup_email]').trigger('change');
                signupView.$('#signup_form input[name=signup_password]').val('pass');
                signupView.$('#signup_form input[name=signup_password]').trigger('change');
                signupView.$('#signup_btn').click();

                server.respondWith("POST", "https://cloud.ubuntuservergui.com/register/", [
                    406,
                    {"Content-Type": "application/json"},
                    JSON.stringify(responses["https://cloud.ubuntuservergui.com/register/"]["POST"]["406"][1])
                ]);
                server.respond();

                var serverErrorMsg = _.flatten(responses["https://cloud.ubuntuservergui.com/register/"]["POST"]["406"][1]['errors'], true)[0];
                (signupView.displayError).should.have.been.calledWith(serverErrorMsg);
                (signupView.enableForm).should.have.been.called;
                (signupView.$('.form-errors').css('visibility') === 'visible').should.be.ok;

                server.restore;
            });

            it('should display an error message when server responds with a 400 error', function() {
                var server = sinon.fakeServer.create();

                signupView.$('#signup_form input[name=signup_email]').val('wrong-email@mail.com');
                signupView.$('#signup_form input[name=signup_email]').trigger('change');
                signupView.$('#signup_form input[name=signup_password]').val('pass');
                signupView.$('#signup_form input[name=signup_password]').trigger('change');
                signupView.$('#signup_btn').click();

                server.respondWith("POST", "https://cloud.ubuntuservergui.com/register/", [
                    400,
                    {"Content-Type": "application/json"},
                    JSON.stringify(responses["https://cloud.ubuntuservergui.com/register/"]["POST"]["400"][0])
                ]);
                server.respond();

                var serverErrorMsg = _.flatten(responses["https://cloud.ubuntuservergui.com/register/"]["POST"]["400"][0]['errors'], true)[0];
                (signupView.displayError).should.have.been.calledWith(serverErrorMsg);
                (signupView.enableForm).should.have.been.called;
                (signupView.$('.form-errors').css('visibility') === 'visible').should.be.ok;

                server.restore;
            });
        });

    });
});
