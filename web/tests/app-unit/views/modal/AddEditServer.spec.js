define(function (require_browser) {
    var $ = require_browser('jquery'),
        AddEditServerModal = require_browser('views/modal/AddEditServer'),
        Server = require_browser('models/Server');


    describe('AddEditServer (modal) - ItemView', function() {

        xdescribe('onRender', function() {
            var modalSpy, addEditServerModal;

            beforeEach(function() {
                addEditServerModal = new AddEditServerModal();
                addEditServerModal.render();
            });

            afterEach(function() {
                addEditServerModal.close();
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