define(function (requirejs) {
    var _ = requirejs('underscore'),
        Backbone = requirejs('backbone'),
        App = requirejs('App'),
        BaseRouter = requirejs('routers/Base'),
        BaseController = requirejs('controllers/Base'),
        User = requirejs('models/User'),
        Session = requirejs('models/Session');

    describe('Base - Router', function() {
        var MockController, MockRouter;
        var mockController, mockRouter;

        describe('app:navigate', function() {

            MockController = BaseController.extend({
                actionOne: jasmine.createSpy('actionOne'),
                actionTwo: jasmine.createSpy('actionTwo')
            });

            MockRouter = BaseRouter.extend({
                appRoutes: {
                    "routeone": "actionOne",
                    "route/two": "actionTwo"
                }
            });

            beforeEach(function() {
                mockController = new MockController();
                mockRouter = new MockRouter({controller: mockController});
            });

            it('navigates to a route without arguments', function(done) {
                App.execute('app:navigate', 'actionOne');
                expect(mockController.actionOne).toHaveBeenCalled();
                done();
            });

            it('navigates to a route with arguments', function(done) {
                App.execute('app:navigate', 'actionTwo', {sampleObj: {}});
                expect(mockController.actionTwo).toHaveBeenCalledWith({sampleObj: {}});
                done();
            });

        });
    });
});
