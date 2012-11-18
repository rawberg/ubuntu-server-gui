define(function (require) {
    var App = require('App'),
        Session = require('models/Session');

    describe('App', function() {
        beforeEach(function() {
            App.start();
        });

        describe('start', function() {
            it('should have a user containing a session', function() {
                (App.user()).should.exist;
                (App.user().session()).should.exist;
            });

            it('should have an empty routers object', function() {
                (App.routers).should.be.empty;
            });
        });

        describe('vent', function() {
            var ventSpy;
            beforeEach(function() {
                App.start();
                ventSpy = sinon.spy(App.vent, 'trigger');
            });

            afterEach(function() {
                ventSpy.restore();
            });

            it('only trigger "session:expired" when session.active is set to false', function() {
                var sessionSpy = sinon.spy(Session.prototype, 'set');
                App.user().session().set('active', true);

                (sessionSpy).should.have.been.calledWith('active', true);
                (ventSpy).should.not.have.been.called;

                App.user().session().set('active', false);
                (sessionSpy).should.have.been.calledWith('active', false);
                (ventSpy).should.have.been.calledWith('session:expired');
            });

        });
    });
});