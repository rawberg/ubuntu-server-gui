define(function (require_browser) {
    var $ = require_browser('jquery'),
        RemoveServerModal = require_browser('views/modal/RemoveServer'),
        Server = require_browser('models/Server');

    require_browser('bootstrap_modal');

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