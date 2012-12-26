define(function (require) {
    var $ = require('jquery'),
        RemoveServerModal = require('views/modal/RemoveServer'),
        Server = require('models/Server');

    require('bootstrap_modal');

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