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
                App._initCallbacks.run(undefined, App);
                showSpy = spyOn(App.modalContainer, 'show');
            });

            afterEach(function() {
                App.emptyRegions();
                App._initCallbacks.reset();
            });

            it('should show the modal', function(done) {
                App.execute('modal:show', new AddEditServerModal({
                    serverList: new Backbone.Collection()
                }));
                expect(showSpy).toHaveBeenCalled();
                done();
            });

        });

        describe('closeModal', function() {
            var resetSpy, showSpy;

            beforeEach(function() {
                App._initCallbacks.run(undefined, App);
                resetSpy = spyOn(App.modalContainer, 'reset');
                showSpy = spyOn(App.modalContainer, 'show');
            });

            afterEach(function() {
                App.emptyRegions();
                App._initCallbacks.reset();
            });


            it('should call "reset" on the modal region', function() {
                App.showModal(new AddEditServerModal({
                    serverList: new Backbone.Collection()
                }));
                App.closeModal();
                expect(resetSpy).toHaveBeenCalled();
            });
        });

        describe('activeServer', function() {
            var toggleToolbarItemsStub;

            beforeEach(function() {
                App._initCallbacks.run(undefined, App);
                toggleToolbarItemsStub = spyOn(MainToolbar.prototype, 'toggleToolbarItems');
            });

            afterEach(function() {
                App.emptyRegions();
                App._initCallbacks.reset();
            });

            describe('getActiveServer', function() {

                it('sets a blank activeServer on startup', function() {
                    var activeServer = App.getActiveServer();
                    expect(activeServer instanceof Server).toBeTruthy();
                    expect(activeServer.get('ipv4')).toBeNull();
                });
            });

            describe('setActiveServer', function() {
                var activeServerSpy;

                beforeEach(function() {
                    App._initCallbacks.run(undefined, App);
                    activeServerSpy = spyOn(App.vent, 'trigger');
                });

                afterEach(function() {
                    App._initCallbacks.reset();
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