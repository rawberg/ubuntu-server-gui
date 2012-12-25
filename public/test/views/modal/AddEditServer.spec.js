define(function (require) {
    var $ = require('jquery'),
        AddEditServerModal = require('views/modal/AddEditServer'),
        Server = require('models/Server');

    require('bootstrap_modal');

    describe('AddEditServer (modal) - ItemView', function() {

        describe('onRender', function() {
            var modalSpy, addEditServerModal;
            beforeEach(function() {
                modalSpy = sinon.spy($.prototype, 'modal');

                addEditServerModal = new AddEditServerModal();
                addEditServerModal.render();
            });

            afterEach(function() {
                addEditServerModal.close();
                modalSpy.restore();
            });

            it('should show the modal', function() {
                (modalSpy).should.have.been.calledWith({show: true});
            });

        });
    });
});