define(function (requirejs) {
    var _ = requirejs('underscore'),
        Backbone = requirejs('backbone'),
        BaseRouter = requirejs('routers/Base'),
        BaseController = requirejs('controllers/Base'),
        User = requirejs('models/User'),
        Session = requirejs('models/Session');

    describe('Base - Router', function() {
        var App, MockController, MockRouter;
        xdescribe('route and ensureActiveSession', function() {
            App = {};

            BaseRouter.prototype.navigate = sinon.spy();

            MockController = BaseController.extend({
                initialize: function(options) {
                    this.App = App;
                    BaseController.prototype.initialize.apply(this, arguments);
                },
                action: function() {

                }
            });

            MockRouter = BaseRouter.extend({
                initialize: function(options) {
                    this.controller = options.controller;
                    BaseRouter.prototype.initialize.apply(this, arguments);
                },
                appRoutes: {
                    "testroute": "action",
                    "auth/login": "login"
                }
            });

            var brEnsureActiveSessionSpy, mcActionSpy, bcLoginSpy;
            var mockController, mockRouter, specRoute;
            beforeEach(function() {
                Backbone.history = undefined;
                brEnsureActiveSessionSpy = sinon.spy(BaseRouter.prototype, 'ensureActiveSession');
                mcActionSpy = sinon.spy(MockController.prototype, 'action');
                bcLoginSpy = sinon.spy(BaseController.prototype, 'login');
                sessionSetSpy = sinon.spy(Session.prototype, 'set');

                specRoute = window.location.pathname + window.location.search;

                var user = new User();
                App.user = function() { return user; };

                mockController = new MockController();
                mockRouter = new MockRouter({controller: mockController});
                mockRouter.App = App;

                try {
                    Backbone.history.start({silent: true, pushState: true});
                } catch(e) {}
            });

            afterEach(function() {
                brEnsureActiveSessionSpy.restore();
                mcActionSpy.restore();
                bcLoginSpy.restore();
                sessionSetSpy.restore();
                Backbone.History.started = false;
            });

            it('should call ensureActiveSession before the controller method when session is active', function() {
                App.user().session().attributes.active = true;
                var routeSpy = sinon.spy();

                mockRouter.bind("route:action", routeSpy);
                Backbone.history.navigate('testroute', {trigger: true, replace: false});

                try {
                    (routeSpy).should.have.been.calledWith();
                    (brEnsureActiveSessionSpy).should.have.been.called;
                    (mcActionSpy).should.have.been.called;

                    Backbone.history.navigate(specRoute, {replace: true});
                } catch(e) {
                    throw(e);
                }
            });

            // TODO: Replace when auth transition is complete
            it('should call ensureActiveSession, set attempted route and navigate to login route when session is not active', function() {
                App.user().session().attributes.active = false;
                var routeActionSpy = sinon.spy();
                mockRouter.bind("route:action", routeActionSpy);

                Backbone.history.getFragment = sinon.stub().returns('testroute');
                Backbone.history.navigate('testroute', {trigger: true, replace: false});

                try {
                    (routeActionSpy).should.have.been.calledWith();
                    (brEnsureActiveSessionSpy).should.have.been.called;
                    (mcActionSpy).should.not.have.been.called;
                    (mockRouter.navigate).should.have.been.calledWith('auth/login');
                    (sessionSetSpy).should.have.been.calledWith('attemptedRoute', 'testroute');

                    Backbone.history.navigate(specRoute, {replace: true});
                } catch(e) {
                    throw(e);
                }
            });
        });
    });
});
