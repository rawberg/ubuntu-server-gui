define(function (requirejs) {
    var $ = requirejs('jquery'),
        AddEditServerModal = requirejs('views/modal/AddEditServer'),
        Server = requirejs('models/Server'),
        ServerConnection = requirejs('models/ServerConnection');


    describe('AddEditServer (modal) - ItemView', function() {

        describe('onRender', function() {
            var modalSpy, addEditServerModal;
            var server, serverConnection;

            beforeEach(function() {
                var App = jasmine.createSpy();
                App.vent = {trigger: jasmine.createSpy(), bind: jasmine.createSpy()};
                server = new Server();
                serverConnection = new ServerConnection({}, {server: server});
                addEditServerModal = new AddEditServerModal({App: App, model: server});
                addEditServerModal.render();
            });

            afterEach(function() {
                addEditServerModal.destroy();
            });

            it('defaults auth_key checkbox to checked', function() {
                expect(addEditServerModal.ui.auth_key_checkbox[0].checked).toBeTruthy();
            });

            it('defaults ssh_keypath to osx default key path', function() {
                expect(addEditServerModal.ui.ssh_keypath_text.val()).toBe('~/.ssh/id_rsa');
            });

            it('disables/enables ssh_keypath text field and change button when auth_key is checked/unchecked', function() {
                expect(addEditServerModal.ui.ssh_keypath_text.attr('disabled')).toBe(undefined);
                expect(addEditServerModal.ui.ssh_keypath_button.attr('disabled')).toBe(undefined);

                addEditServerModal.ui.auth_key_checkbox.prop('checked', false).change();
                expect(addEditServerModal.ui.ssh_keypath_text.attr('disabled')).toBe('disabled');
                expect(addEditServerModal.ui.ssh_keypath_button.attr('disabled')).toBe('disabled');

                addEditServerModal.ui.auth_key_checkbox.prop('checked', true).change();
                expect(addEditServerModal.ui.ssh_keypath_text.attr('disabled')).toBe(undefined);
                expect(addEditServerModal.ui.ssh_keypath_button.attr('disabled')).toBe(undefined);
            });

            it('removes/adds default ssh_keypath value when auth_key checkbox is unchecked/checked', function() {
                expect(server.get('keyPath')).toBe('~/.ssh/id_rsa');
                expect(addEditServerModal.ui.ssh_keypath_text.val()).toBe('~/.ssh/id_rsa');

                addEditServerModal.ui.auth_key_checkbox[0].checked = false;
                addEditServerModal.$('input[name=auth_key]').change();

                expect(server.get('keyPath')).toBeNull();
                expect(addEditServerModal.ui.ssh_keypath_text.val()).toBeFalsy();

                addEditServerModal.ui.auth_key_checkbox[0].checked = true;
                addEditServerModal.$('input[name=auth_key]').change();

                expect(server.get('keyPath')).toBe('~/.ssh/id_rsa');
                expect(addEditServerModal.ui.ssh_keypath_text.val()).toBe('~/.ssh/id_rsa');
            });

            it('hides/shows manual password notice when auth_key checkbox is unchecked/checked', function() {
                expect(addEditServerModal.ui.manual_password_notice.css('display')).toBe('none');
                addEditServerModal.ui.auth_key_checkbox[0].checked = false;
                addEditServerModal.$('input[name=auth_key]').change();

                expect(addEditServerModal.ui.manual_password_notice.css('display')).toBe('block');
                addEditServerModal.ui.auth_key_checkbox[0].checked = true;
                addEditServerModal.$('input[name=auth_key]').change();
                expect(addEditServerModal.ui.manual_password_notice.css('display')).toBe('none');
            });
        });
    });
});