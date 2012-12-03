define(function (require) {
    var User = require('models/User'),
        Session = require('models/Session'),
        responses = JSON.parse(require('text!/test/mock-responses/sessions.json'));

    describe('User - Model', function() {

        describe('login', function() {

            var App, server, userSpy, sessionSpy;
            beforeEach(function() {
                // Todo: refactor this into a MockApp helper
                App = {};
                App.user = function() {
                    return {session: function() {
                        return {get: sinon.stub().returns(true)};
                    }};
                };
                App.vent = {trigger: sinon.spy(), bind: sinon.spy()};
                App.routers = sinon.spy();
                App.routers.main = sinon.spy();
                App.routers.main.navigate = sinon.spy();

                server = sinon.fakeServer.create();
                userSpy = sinon.spy(User.prototype, 'loginError');
                sessionSpy = sinon.spy(Session.prototype, 'set');
            });

            afterEach(function() {
                server.restore();
                if(userSpy) {
                    userSpy.restore();
                }
                if(sessionSpy) {
                    sessionSpy.restore();
                }
            });

            it('should make a login request to the server', function() {
                var user;
                user = new User({
                    email: 'david@ubuntuservergui.com',
                    password: 'samplepass'
                });

                user.App = App;
                user.session().App = App;
                user.login();

                server.respond();
                (server.requests[0].method).should.equal('POST');
                (server.requests[0].url).should.equal('https://cloud.ubuntuservergui.com/sessions/');
                (server.requests[0].requestHeaders['Content-Type']).should.equal("application/json;charset=utf-8");
                (server.requests[0].requestBody).should.equal('{"email": "david@ubuntuservergui.com", "password": "samplepass"}');
            });

            it('should set "active" attribute of user.session to true on successful login', function() {
                var user;
                server.respondWith("POST", "https://cloud.ubuntuservergui.com/sessions/", [
                    200,
                    {"Content-Type": "application/json"},
                    JSON.stringify(responses["https://cloud.ubuntuservergui.com/sessions/"]["POST"]["202"][0])
                ]);

                user = new User({
                    email: 'david@ubuntuservergui.com',
                    password: 'samplepass'
                });

                user.App = App;
                user.session().App = App;
                user.login();

                server.respond();
                sessionSpy.should.have.been.calledWith('active', true);
            });

            it('should handle an invalid authentication response', function() {
                var responseBody, user;
                server.respondWith("POST", "https://cloud.ubuntuservergui.com/sessions", [
                    406, {
                      "Content-Type": "application/json"
                  }, JSON.stringify(responses["https://cloud.ubuntuservergui.com/sessions/"]["POST"]["406"][1])
                ]);


                user = new User({
                    email: 'david@ubuntuservergui.com',
                    password: 'samplepass'
                });

                user.App = App;
                user.session().App = App;
                user.login();

                server.respond();
                (user.loginError).should.have.been.called;
                (user.session().set).should.have.been.calledWith('active', false);
            });
        });
    });
});
