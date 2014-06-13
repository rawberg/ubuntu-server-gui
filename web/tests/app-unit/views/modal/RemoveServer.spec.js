define(function (requirejs) {
    var $ = requirejs('jquery'),
        RemoveServerModal = requirejs('views/modal/RemoveServer'),
        Server = requirejs('models/Server');


    describe('RemoveServer (modal) - ItemView', function() {

        describe('onRender', function() {
            var modalSpy, removeServerModal;
            beforeEach(function() {
                modalSpy = sinon.spy($.prototype, 'modal');

                removeServerModal = new RemoveServerModal();
                removeServerModal.render();
            });

            afterEach(function() {
                removeServerModal.close();
                modalSpy.restore();
            });


        });
    });
});