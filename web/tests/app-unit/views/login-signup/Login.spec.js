define(function (require_browser) {
    var User = require_browser('models/User'),
        LoginView = require_browser('views/login-signup/LoginView'),
        responses = JSON.parse(require_browser('text!/tests/app-unit/mock-responses/sessions.json'));

    describe('LoginView - ItemView', function() {

        describe('login form - event bindings & validation', function() {
            var user, loginView, App;
            beforeEach(function() {
                sinon.spy(LoginView.prototype, 'onLoginClick');
                sinon.spy(LoginView.prototype, 'displayError');
                sinon.spy(LoginView.prototype, 'clearError');
                sinon.spy(LoginView.prototype, 'disableForm');
                sinon.spy(LoginView.prototype, 'enableForm');
                sinon.spy(User.prototype, 'login');

                // Todo: refactor this into a MockApp helper
                App = sinon.spy();
                App.vent = {trigger: sinon.spy(), bind: sinon.spy()};
                Backbone.history = new Backbone.History();
                Backbone.history.navigate = sinon.spy();

                user = new User();
                user.session().App = App;

                loginView = new LoginView({
                    model: user
                });

                loginView.render();
            });

            afterEach(function() {
                loginView.remove();
                LoginView.prototype.onLoginClick.restore();
                LoginView.prototype.displayError.restore();
                LoginView.prototype.clearError.restore();
                LoginView.prototype.disableForm.restore();
                LoginView.prototype.enableForm.restore();
                User.prototype.login.restore();
            });

            it('should update user model when field values change', function() {
                loginView.$('#login_form input[name=login_email]').val('russell.peters@aol.com');
                loginView.$('#login_form input[name=login_email]').trigger('change');
                loginView.$('#login_form input[name=login_password]').val('sample-pass');
                loginView.$('#login_form input[name=login_password]').trigger('change');
                loginView.$('#login_btn').click();

                (user.get('email')).should.equal('russell.peters@aol.com');
                (user.get('password')).should.equal('sample-pass');
            });

            it('should show an error message if email field is empty', function() {
                loginView.$('#login_form input[name=login_password]').val('pass');
                loginView.$('#login_form input[name=login_password]').trigger('change');
                loginView.$('#login_btn').click();

                (loginView.displayError).should.have.been.called;
                (loginView.$('.form-errors').css('visibility') === 'visible').should.be.ok;
            });

            it('should show an error message if password field is empty', function() {
                loginView.$('#login_form input[name=login_email]').val('sample@mail.com');
                loginView.$('#login_form input[name=login_email]').trigger('change');
                loginView.$('#login_btn').click();

                (loginView.displayError).should.have.been.called;
                (loginView.$('.form-errors').css('visibility') === 'visible').should.be.ok;
            });

            it('should call displayError and show error messages if email or password fields are empty', function() {
                sinon.spy(loginView.model, 'login');
                loginView.$('#login_form input[name=login_email]').val('');
                loginView.$('#login_form input[name=login_email]').trigger('change');
                loginView.$('#login_form input[name=login_password]').val('');
                loginView.$('#login_form input[name=login_password]').trigger('change');
                loginView.$('#login_btn').click();

                (loginView.onLoginClick).should.have.been.called;
                (loginView.displayError).should.have.been.called;
                (loginView.disableForm).should.not.have.been.called;
                (loginView.model.login).should.not.have.been.called;
                (loginView.$('.form-errors').css('visibility') === 'visible').should.be.ok;

                loginView.model.login.restore();
            });

            it('should call onLoginClick and clearError when login button is clicked', function() {
                loginView.$('#login_btn').click();

                (loginView.onLoginClick).should.have.been.called;
                (loginView.clearError).should.have.been.called;
            });

            it('should disableForm and call user.login when login button is clicked with valid data', function() {
                var server = sinon.fakeServer.create();
                sinon.spy(loginView.model, 'login');

                loginView.$('#login_form input[name=login_email]').val('sample@mail.com');
                loginView.$('#login_form input[name=login_email]').trigger('change');
                loginView.$('#login_form input[name=login_password]').val('pass');
                loginView.$('#login_form input[name=login_password]').trigger('change');
                loginView.$('#login_btn').click();

                server.respondWith("POST", "https://cloud.ubuntuservergui.com/sessions/", [
                    202,
                    {"Content-Type": "application/json"},
                    JSON.stringify(responses["https://cloud.ubuntuservergui.com/sessions/"]["POST"]["202"])
                ]);
                server.respond();

                (loginView.clearError).should.have.been.called;
                (loginView.disableForm).should.have.been.called;
                (loginView.model.login).should.have.been.called;

                loginView.model.login.restore();
                server.restore();
            });

            it('should display an error message when server responds with a 406 error', function() {
                var server = sinon.fakeServer.create();

                loginView.$('#login_form input[name=login_email]').val('wrong-email@mail.com');
                loginView.$('#login_form input[name=login_email]').trigger('change');
                loginView.$('#login_form input[name=login_password]').val('pass');
                loginView.$('#login_form input[name=login_password]').trigger('change');
                loginView.$('#login_btn').click();

                server.respondWith("POST", "https://cloud.ubuntuservergui.com/sessions/", [
                    406,
                    {"Content-Type": "application/json"},
                    JSON.stringify(responses["https://cloud.ubuntuservergui.com/sessions/"]["POST"]["406"][0])
                ]);
                server.respond();

                var serverErrorMsg = _.flatten(responses["https://cloud.ubuntuservergui.com/sessions/"]["POST"]["406"][0]['errors'], true)[0];
                (loginView.displayError).should.have.been.called;
                (loginView.displayError).should.have.been.calledWith(serverErrorMsg);
                (loginView.enableForm).should.have.been.called;
                (loginView.$('.form-errors').css('visibility') === 'visible').should.be.ok;

                server.restore;
            });

            it('should display an error message when server responds with a 400 error', function() {
                var server = sinon.fakeServer.create();

                loginView.$('#login_form input[name=login_email]').val('wrong-email@mail.com');
                loginView.$('#login_form input[name=login_email]').trigger('change');
                loginView.$('#login_form input[name=login_password]').val('pass');
                loginView.$('#login_form input[name=login_password]').trigger('change');
                loginView.$('#login_btn').click();

                server.respondWith("POST", "https://cloud.ubuntuservergui.com/sessions/", [
                    400,
                    {"Content-Type": "application/json"},
                    JSON.stringify(responses["https://cloud.ubuntuservergui.com/sessions/"]["POST"]["400"][0])
                ]);
                server.respond();

                var serverErrorMsg = _.flatten(responses["https://cloud.ubuntuservergui.com/sessions/"]["POST"]["400"][0]['errors'], true)[0];
                (loginView.displayError).should.have.been.called;
                (loginView.displayError).should.have.been.calledWith(serverErrorMsg);
                (loginView.enableForm).should.have.been.called;
                (loginView.$('.form-errors').css('visibility') === 'visible').should.be.ok;

                server.restore;
            });
        });

    });
});
