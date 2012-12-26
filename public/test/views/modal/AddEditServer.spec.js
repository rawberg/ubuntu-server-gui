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

            it('should update the server model when form fields change', function() {
                addEditServerModal.$('form input[name=name]').val('Sample Server');
                addEditServerModal.$('form input[name=name]').trigger('change');
                addEditServerModal.$('form input[name=ipv4]').val('10.0.0.1');
                addEditServerModal.$('form input[name=ipv4]').trigger('change');

                (addEditServerModal.model.get('name')).should.equal('Sample Server');
                (addEditServerModal.model.get('ipv4')).should.equal('10.0.0.1');
            });

        });
    });
});