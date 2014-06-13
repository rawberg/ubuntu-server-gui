define(function (requirejs) {
        // Libs
    var $ = requirejs('jquery'),
        Marionette = requirejs('marionette'),
        BaseController = requirejs('controllers/Base');


    describe('Base - Controller', function() {

        describe('_navigate', function() {
            var baseController, footerPosStub, methodSpy;

            beforeEach(function() {
                footerPosStub = spyOn($.prototype, 'offset').and.returnValue({top: 666});

                baseController = new BaseController();
                methodSpy = spyOn(baseController, 'notFound');
            });

            afterEach(function() {
            });

            it('controller methods called via controllerTriggers wreqr commands', function() {
                baseController.controllerTriggers.execute('navigate', 'notFound', 'sampleArgument');
                expect(methodSpy).toHaveBeenCalled();
                expect(methodSpy).toHaveBeenCalledWith('sampleArgument');
            });
        });

    });
});