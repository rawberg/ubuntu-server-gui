define(function (requirejs) {
    var $ = requirejs('jquery'),
        AddEditServerModal = requirejs('views/modal/AddEditServer'),
        Server = requirejs('models/Server'),
        ServerConnection = requirejs('models/ServerConnection');


    describe('AddEditServer (modal) - ItemView', function() {

        describe('onRender', function() {
            var server, serverConnection, addEditServerModal;

            beforeEach(function() {
                server = new Server();
                serverConnection = new ServerConnection({}, {server: server});
                addEditServerModal = new AddEditServerModal({
                    model: server,
                    serverList: new Backbone.Collection()
                });
                addEditServerModal.render();
            });

            afterEach(function() {
                addEditServerModal.destroy();
            });

            it('defaults auth_key to checked and sets ssh_keypath to osx default path', function() {
                expect(addEditServerModal.ui.auth_key_checkbox[0].checked).toBeTruthy();
                expect(addEditServerModal.ui.ssh_keypath_text.val()).toBe('~/.ssh/id_rsa');
            });

            it('auth_key remains unchecked when ssh_keypath is null', function() {
                addEditServerModal.model = new Server({keyPath: null});
                addEditServerModal.render();
                expect(addEditServerModal.ui.auth_key_checkbox[0].checked).toBeFalsy();
            });

            it('disables/enables ssh_keypath and change button when auth_key is checked/unchecked', function() {
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

        describe('onSave', function() {
            var server, serverConnection, addEditServerModal;

            beforeEach(function() {
                server = new Server({id: 1, name: "Fake Server"});
                serverConnection = new ServerConnection({}, {server: server});
            });

            afterEach(function() {
                addEditServerModal.destroy();
            });

            it('delete button not displayed when adding a new server', function() {
                addEditServerModal = new AddEditServerModal({
                    serverList: new Backbone.Collection()
                });
                addEditServerModal.render();
                expect(addEditServerModal.ui.request_delete_button.css('display')).toBe('none');
            });

            it('delete confirmation removes the server from the collection', function(done) {
                var destroySpy = spyOn(server, 'destroy').and.callThrough();
                addEditServerModal = new AddEditServerModal({
                    model: server,
                    serverList: new Backbone.Collection()
                });
                addEditServerModal.render();
                expect(addEditServerModal.ui.request_delete_button.css('display')).toBe('inline-block');
                expect(destroySpy).not.toHaveBeenCalled();
                addEditServerModal.onConfirmDelete();
                expect(destroySpy).toHaveBeenCalled();
                done();
            });

            it('adds new server to the collection', function() {
                var serverList = new Backbone.Collection(),
                    newServer = new Server();

                expect(serverList.length).toEqual(0);
                addEditServerModal = new AddEditServerModal({
                    model: newServer,
                    serverList: serverList
                });
                addEditServerModal.render();
                newServer.set({name: 'New Server', ipv4: "127.0.0.1", port: 22});
                addEditServerModal.onSave();
                expect(serverList.length).toEqual(1);
            });
        })
    });
});