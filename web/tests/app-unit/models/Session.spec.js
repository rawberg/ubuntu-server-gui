define(function (requirejs) {
    var Backbone = requirejs('backbone');
    var Session = requirejs('models/Session');

    describe('Session - Model', function() {

        describe('initialize', function() {
            it('should set "active" attribute to undefined and attemptedRoute to undefined upon Session creation', function() {
                var sess = new Session();
                expect(sess.get('active')).to.exist;
                expect(sess.get('attemptedRoute')).to.not.exist;
            });
        });

        describe('active - attribute', function() {
            var navigateSpy, sessionSetSpy, sessionStatusChangeSpy;
            beforeEach(function() {

                Backbone.history = new Backbone.History();
                Backbone.history.start({
                    silent: true,
                    pushState: false
                });

                Backbone.history.stop();
                Backbone.history.getFragment = sinon.stub().returns('destination/route');

                navigateSpy = sinon.spy(Backbone.history, 'navigate');
                sessionSetSpy = sinon.spy(Session.prototype, 'set');
                sessionStatusChangeSpy = sinon.spy(Session.prototype, 'onStatusChange');
            });

            afterEach(function() {
                navigateSpy.restore();
                sessionSetSpy.restore();
                sessionStatusChangeSpy.restore();
            });

            it('should navigate to auth/login route when set to false', function() {
                var session = new Session({active: true});
                session.set('active', false);
                (sessionStatusChangeSpy).should.have.been.called;
                (sessionSetSpy).should.have.been.calledWith('attemptedRoute', 'destination/route');
                (Backbone.history.navigate).should.have.been.calledWith('auth/login');
            });

            it('should navigate to attempted route when set to true and attemptedRoute is defined', function() {
                var session = new Session({active: true});
                session.set('active', false);
                session.set('active', true);
                (Backbone.history.navigate).should.have.been.calledWith('destination/route');
                (sessionSetSpy).should.have.been.calledWith('attemptedRoute', undefined);
            });

            it('should navigate to / when set to true and attemptedRoute is undefined', function() {
                var session = new Session();
                session.set('active', true);
                (Backbone.history.navigate).should.have.been.calledWith('/');
                (sessionSetSpy).should.have.been.calledWith('attemptedRoute', undefined);
            });
        });
    });
});
