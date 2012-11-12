define(function (require, exports, module) {
    var Backbone = require('backbone');
    var Session = require('models/Session');

    describe('Session - Model', function() {

        describe('initialize', function() {
            it('should set "active" attribute to undefined and attemptedRoute to "" upon Session creation', function() {
                var sess;
                sess = new Session({});
                (sess.get('active')).should.exist;
                (sess.get('attemptedRoute')).should.equal('');
            });
        });

        describe('active - attribute (onChange)', function() {
            var App;
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
                sinon.spy(App.routers.main, 'navigate');
            });

            afterEach(function() {
                App.routers.main.navigate.restore();
                Session.prototype.set.restore();
                Session.prototype.onStatusChange.restore();
            });

            it('should respond to "active" attribute being set to false and set the "attemptedRoute" attribute', function() {
                sinon.spy(Session.prototype, 'set');
                sinon.spy(Session.prototype, 'onStatusChange');

                var sess = new Session();
                sess.App = App;
                sess.set('active', false);

                (sess.onStatusChange).should.have.been.called;
                (sess.set).should.have.been.calledWith('attemptedRoute', 'destination/route');
                (App.routers.main.navigate).should.have.been.calledWith('auth/login');
            });

            it('should respond to "active" attribute being set to true and navigate to a set "attemptedRoute"', function() {
                sinon.spy(Session.prototype, 'set');
                sinon.spy(Session.prototype, 'onStatusChange');

                var sess = new Session({
                    'active': false,
                    'attemptedRoute': 'destination/route'
                });
                sess.App = App;
                sess.set('active', true);

                (sess.set).should.have.been.calledWith('active', true);
                (sess.onStatusChange).should.have.been.called;
                (App.routers.main.navigate).should.have.been.calledWith('destination/route');
            });

            it('should respond to "active" attribute being set to true and navigate to default route', function() {
                sinon.spy(Session.prototype, 'set');
                sinon.spy(Session.prototype, 'onStatusChange');

                var sess = new Session({
                    'active': false
                });
                sess.App = App;
                sess.set('active', true);

                (sess.set).should.have.been.calledWith('active', true);
                (sess.onStatusChange).should.have.been.called;
                (App.routers.main.navigate).should.have.been.calledWith('');
            });
        });
    });
});
