define(function (requirejs) {
    var $ = requirejs('jquery'),
        App = requirejs('App'),
        Session = requirejs('models/Session'),
        Server = requirejs('models/Server'),
        MainToolbar = requirejs('views/MainToolbar'),
        AddEditServerModal = requirejs('views/modal/AddEditServer');


    describe('App', function() {
        describe('start', function() {
            var posStub;

            beforeEach(function() {
                posStub = spyOn($.prototype, 'offset').and.returnValue({top: 500, bottom: 540});
                App._initCallbacks.run(undefined, App);
            });

            afterEach(function() {
                App.closeRegions();
            });

            it('should have a user containing a session', function() {
                (App.user()).should.exist;
                (App.user().session()).should.exist;
            });

            it('should have an empty routers object', function() {
                (App.routers).should.be.empty;
            });
        });

        describe('showModal', function() {
            var modalSpy, viewRenderSpy;

            beforeEach(function() {
                viewRenderSpy = spyOn(AddEditServerModal.prototype, 'render');
                App.execute('modal:show', new AddEditServerModal({App: jasmine.createSpy()}));
            });

            afterEach(function() {
                App.closeRegions();
            });

            it('should show the modal', function() {
                expect(viewRenderSpy).toHaveBeenCalled();
            });

        });

        describe('closeModal', function() {
            var viewRemoveSpy;

            beforeEach(function() {
                viewRemoveSpy = spyOn(AddEditServerModal.prototype, 'remove');
                App.showModal(new AddEditServerModal({App: jasmine.createSpy()}));
            });

            it('should call "remove" on the currentView in the modal region', function() {
                App.closeModal();
                expect(viewRemoveSpy).toHaveBeenCalled();
            });
        });

        describe('activeServer', function() {
            var posStub, toggleToolbarItemsStub;

            beforeEach(function() {
                toggleToolbarItemsStub = spyOn(MainToolbar.prototype, 'toggleToolbarItems');
                posStub = spyOn($.prototype, 'offset').and.returnValue({top: 500, bottom: 540});
            });

            afterEach(function() {
                App.closeRegions();
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
                   activeServerSpy = spyOn(App.vent._events['active-server:changed'][0], 'callback');
                    App._initCallbacks.run(undefined, App);
                });

                it('replaces existing active server', function() {
                    var firstActiveServer = App.getActiveServer();
                    var secondActiveServer = App.setActiveServer(new Server());
                    expect(firstActiveServer.cid).not.toBe(secondActiveServer.cid);
                });

                it('triggers App.vent "active-server:changed" when a new server is set', function() {
                    expect(activeServerSpy.calls.count()).toBe(0);
                    App.setActiveServer(new Server());
                    expect(activeServerSpy.calls.count()).toBe(1);
                });

                it('unbinds existing listeners when activeServer is replaced', function() {
                    var firstActiveServer = App.getActiveServer();
                    firstActiveServer.on('change', jasmine.createSpy());
                    expect(firstActiveServer._events.change.length).toBe(1);
                    App.setActiveServer(new Server());
                    expect(firstActiveServer._events).toBeUndefined();
                });

            });

        });

    });
});