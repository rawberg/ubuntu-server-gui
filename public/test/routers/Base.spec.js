define(function (require) {

    var _ = require('underscore'),
        Backbone = require('backbone'),
        BaseRouter = require('routers/Base'),
        BaseController = require('controllers/Base');

    describe('Base - Router', function() {
        var App, MockController, MockRouter;
        describe('route beforeFilters', function() {
            App = {};
            App.user = function() {
                return {session: function() {
                    return {get: {}};
                }};
            };
            App.routers = {main: {}};

            MockController = BaseController.extend({
                initialize: function(options) {
                    this.beforeFilters = {
                        action: 'ensureAuthenticated'
                    };

                    this.App = App;
                    BaseController.prototype.initialize.apply(this, arguments);
                },
                action: function() {

                }
            });

            MockRouter = BaseRouter.extend({
                initialize: function(options) {

                    this.controller = options.controller;
                },
                appRoutes: {
                    "testroute": "action",
                    "auth/login": "login"
                }
            });

            var authSpy, actionSpy, loginSpy, mockController, mockRouter, specRoute;
            beforeEach(function() {
                authSpy = sinon.spy(BaseController.prototype, 'ensureAuthenticated');
                loginSpy = sinon.spy(BaseController.prototype, 'login');
                actionSpy = sinon.spy(MockController.prototype, 'action');
                specRoute = window.location.pathname + window.location.search;

                mockController = new MockController();
                mockRouter = new MockRouter({controller: mockController});
                App.routers.main = mockRouter;

                try {
                    Backbone.history.start({silent:true, pushState:true});
                } catch(e) {}
            });

            afterEach(function() {
                authSpy.restore();
                actionSpy.restore();
                loginSpy.restore();
            });

            it('should call wrapped beforeFilter function before controller method', function() {
                mockController.App.user().session().get = sinon.stub().returns(true);
                var routeSpy = sinon.spy();
                mockRouter.navigate("faketown");
                mockRouter.bind("route:action", routeSpy);
                mockRouter.navigate('testroute', {trigger: true, replace: false});

                try {
                    (routeSpy).should.have.been.called;
                    (routeSpy).should.have.been.calledWith();
                    (authSpy).should.have.been.called;
                    (actionSpy).should.have.been.called;

                    mockRouter.navigate(specRoute, {replace: true});
                } catch(e) {
                    throw(e);
                }
            });

            it('should call wrapped beforeFilter and naviate to login instead of original controller method', function() {
                mockController.App.user().session().get = sinon.stub().returns(false);
                var routeActionSpy = sinon.spy();
                mockRouter.navigate("faketown");
                mockRouter.bind("route:action", routeActionSpy);
                mockRouter.navigate('testroute', {trigger: true, replace: false});

                try {
                    (routeActionSpy).should.have.been.called;
                    (routeActionSpy).should.have.been.calledWith();
                    (authSpy).should.have.been.called;
                    (actionSpy).should.not.have.been.called;
                    (loginSpy).should.have.been.called;

                    mockRouter.navigate(specRoute, {replace: true});
                } catch(e) {
                    throw(e);
                }
            });
        });
    });
});
