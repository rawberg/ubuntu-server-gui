define(function (require) {
    var BaseController = require('controllers/Base'),
        User = require('models/User');

    describe('Base - Controller', function() {

        describe('initialize', function() {

            it('should have a real App object containing a user instance', function() {
                var controllerRealApp = new BaseController();
                assert.instanceOf(controllerRealApp.App.user(), User);
            });

            it('should have a mock App object containing a sinon stub', function() {
                var App = {};
                App.user = function() {
                    return {session: function() {
                        return {get: sinon.stub().returns(true)};
                    }};
                };
                App.routers = {main: {}};

                var controllerMockApp = new BaseController({App: App});
                assert.equal(controllerMockApp.App.user().session().get, 'stub');
                assert.ok(controllerMockApp.App.user().session().get('anything'));
            });
        });
    });
});