define(function (require_browser) {
    var $ = require_browser('jquery'),
        AddEditServerModal = require_browser('views/modal/AddEditServer'),
        Server = require_browser('models/Server');


    describe('AddEditServer (modal) - ItemView', function() {

        describe('onRender', function() {
            var modalSpy, addEditServerModal;
            var server;

            beforeEach(function() {
                var App = sinon.spy();
                App.vent = {trigger: sinon.spy(), bind: sinon.spy()};
                server = new Server();
                addEditServerModal = new AddEditServerModal({App: App, model: server});
                addEditServerModal.render();
            });

            afterEach(function() {
                addEditServerModal.close();
            });

            it('defaults auth_key checkbox to checked', function() {
                expect(addEditServerModal.ui.auth_key_checkbox[0].checked).to.be.true;
            });

            it('it defaults ssh_keypath to osx default key path', function() {
                expect(addEditServerModal.ui.ssh_keypath.val()).to.equal('~/.ssh/id_rsa');
            });

            it('removes/adds default ssh_keypath value when auth_key checkbox is unchecked/checked', function() {
                expect(server.get('keyPath')).to.equal('~/.ssh/id_rsa');
                expect(addEditServerModal.ui.ssh_keypath.val()).to.equal('~/.ssh/id_rsa');

                addEditServerModal.ui.auth_key_checkbox[0].checked = false;
                addEditServerModal.$('input[name=auth_key]').change();

                expect(server.get('keyPath')).to.be.a('null');
                expect(addEditServerModal.ui.ssh_keypath.val()).to.equal('');

                addEditServerModal.ui.auth_key_checkbox[0].checked = true;
                addEditServerModal.$('input[name=auth_key]').change();

                expect(server.get('keyPath')).to.equal('~/.ssh/id_rsa');
                expect(addEditServerModal.ui.ssh_keypath.val()).to.equal('~/.ssh/id_rsa');
            });
        });
    });
});