define(function (requirejs) {
    var App = requirejs('App'),
        Session = requirejs('models/Session'),
        Server = requirejs('models/Server'),
        MainToolbar = requirejs('views/MainToolbar'),
        AddEditServerModal = requirejs('views/modal/AddEditServer');


    describe('App', function() {

        describe('showModal', function() {
            var showSpy;

            beforeEach(function() {
                showSpy = spyOn(App.modalContainer, 'show');
                App.execute('modal:show', new AddEditServerModal());
            });

            afterEach(function() {
                App.emptyRegions();
            });

            it('should show the modal', function() {
                expect(showSpy).toHaveBeenCalled();
            });

        });

        describe('closeModal', function() {
            var resetSpy, showSpy;

            beforeEach(function() {
                resetSpy = spyOn(App.modalContainer, 'reset');
                showSpy = spyOn(App.modalContainer, 'show');
                App.showModal(new AddEditServerModal());
            });

            it('should call "reset" on the modal region', function() {
                App.closeModal();
                expect(resetSpy).toHaveBeenCalled();
            });
        });

        describe('activeServer', function() {
            var toggleToolbarItemsStub;

            beforeEach(function() {
                toggleToolbarItemsStub = spyOn(MainToolbar.prototype, 'toggleToolbarItems');
            });

            afterEach(function() {
                App.emptyRegions();
            });

            describe('getActiveServer', function() {

                it('sets a blank activeServer on startup', function() {
                    App._initCallbacks.run(undefined, App);
                    var activeServer = App.getActiveServer();
                    expect(activeServer instanceof Server).toBeTruthy();
                    expect(activeServer.get('ipv4')).toBeNull();
                });
            });

            describe('setActiveServer', function() {
                var activeServerSpy;

                beforeEach(function() {
                    activeServerSpy = spyOn(App.vent, 'trigger');
                });

                it('replaces existing active server', function() {
                    var firstActiveServer = App.getActiveServer();
                    var secondActiveServer = App.setActiveServer(new Server());
                    expect(firstActiveServer.cid).not.toBe(secondActiveServer.cid);
                });

                it('triggers App.vent "server:changed" when a new server is set', function() {
                    var server = new Server();
                    expect(activeServerSpy.calls.count()).toBe(0);
                    App.setActiveServer(server);
                    expect(activeServerSpy.calls.count()).toBe(1);
                    expect(activeServerSpy).toHaveBeenCalledWith('server:changed', server);
                });

            });

        });

    });
});