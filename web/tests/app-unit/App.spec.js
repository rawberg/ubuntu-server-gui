define(function (require_browser) {
    var $ = require_browser('jquery'),
        App = require_browser('App'),
        Session = require_browser('models/Session'),
        Server = require_browser('models/Server'),
        MainToolbar = require_browser('views/MainToolbar'),
        AddEditServerModal = require_browser('views/modal/AddEditServer'),
        NoobTourPopover = require_browser('views/modal/NoobTourPopover');


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

        describe('onNoobTourActivate', function() {
            var tourSpy, appendToSpy, posStub, windowResizeSpy;
            var clickSwallowSpy, scrollTopSpy, popoverSpy;

            beforeEach(function() {
                appendToSpy = spyOn($.prototype, 'appendTo');
                scrollTopSpy = spyOn($.prototype, 'animate');
                clickSwallowSpy = spyOn($.prototype, 'click');
                windowResizeSpy = spyOn($.prototype, 'resize');

                popoverSpy = spyOn(NoobTourPopover.prototype, 'render');
                posStub = spyOn($.prototype, 'offset').and.returnValue({top: 500, bottom: 540});

                App._initCallbacks.run(undefined, App);
                tourSpy = spyOn(App.commands._wreqrHandlers['noobtour:activate'], 'callback').and.callThrough();
                App.execute('noobtour:activate');
            });

            afterEach(function() {
                App.execute('noobtour:deactivate');
                App.closeRegions();
            });

            it('should be called when the "noobtour:activate" App event is fired', function() {
                expect(tourSpy).toHaveBeenCalled();
            });

            it('should add noob tour backdrop elements to the dom', function() {
                expect(appendToSpy.calls.count()).toBe(2);
            });

            it('should scroll to the bottom of the page', function() {
                var scrollTopVal = $(document).height()-$(window).height();
                expect(scrollTopSpy).toHaveBeenCalledWith({scrollTop: scrollTopVal});
            });

            it('should setup a listener to swallow backdrop click events', function() {
                expect(clickSwallowSpy).toHaveBeenCalled();
            });

            it('should render "NoobTourPopover"', function() {
                expect(popoverSpy).toHaveBeenCalled();
            });

        });

        describe('onNoobTourDeActivate', function() {
            var removeSpy, deactivateTourSpy, offSpy;

            beforeEach(function() {
                deactivateTourSpy = spyOn(App.commands._wreqrHandlers['noobtour:deactivate'], 'callback').and.callThrough();
                removeSpy = spyOn($.prototype, 'remove').and.callThrough();
                offSpy = spyOn($.prototype, 'off').and.callThrough();
                App.execute('noobtour:deactivate');
            });

            afterEach(function() {
                App.closeRegions();
            });

            it('should be called when the "noobtour:deactivate" App event is fired', function() {
                expect(deactivateTourSpy).toHaveBeenCalled();
            });

            it('should unbind the listener swallowing backdrop click events', function() {
                expect(offSpy).toHaveBeenCalledWith('click');
            });

            it('should remove noob tour backdrop elements from the dom', function() {
                expect(removeSpy).toHaveBeenCalled();
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