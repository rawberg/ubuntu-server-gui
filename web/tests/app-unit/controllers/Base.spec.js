define(function (require_browser) {
        // Libs
    var Marionette = require_browser('marionette'),
        BaseController = require_browser('controllers/Base');


    describe('Base - Controller', function() {

        describe('_navigate', function() {
            var baseController, footerPosStub, methodSpy;

            beforeEach(function() {
                footerPosStub = sinon.stub($.prototype, 'offset');
                footerPosStub.returns({top: 666});

                baseController = new BaseController();
                methodSpy = sinon.stub(baseController, 'notFound');
            });

            afterEach(function() {
                footerPosStub.restore();
                methodSpy.restore();
            });

            it('controller methods called via controllerTriggers wreqr commands', function() {
                baseController.controllerTriggers.execute('navigate', 'notFound', 'sampleArgument');
                sinon.assert.called(methodSpy);
                sinon.assert.calledWith(methodSpy, 'sampleArgument');
            });
        });

    });
});