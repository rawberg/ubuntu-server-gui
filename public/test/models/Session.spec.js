define(function (require) {
    var Backbone = require('backbone');
    var Session = require('models/Session');

    describe('Session - Model', function() {

        describe('initialize', function() {
            it('should set "active" attribute to undefined and attemptedRoute to "" upon Session creation', function() {
                var sess = new Session();
                (sess.get('active')).should.exist;
                (sess.get('attemptedRoute')).should.equal('');
            });
        });

        xdescribe('active - attribute (onChange)', function() {
            var App, routerSpy, sessionSpy;
            beforeEach(function() {
                Backbone.history = new Backbone.History();
                Backbone.history.start({
                    silent: true,
                    pushState: false
                });

                Backbone.history.stop();
                Backbone.history.fragment = 'destination/route';
                App = {
                    routers: {
                        main: {
                            navigate: function() {}
                        }
                    }
                };
                routerSpy = sinon.spy(App.routers.main, 'navigate');
                sessionSpy = sinon.spy(Session.prototype, 'set');
            });

            afterEach(function() {
                routerSpy.restore();
                sessionSpy.restore();
            });

        });
    });
});
