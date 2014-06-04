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
                posStub = sinon.stub($.prototype, 'offset');
                posStub.returns({top: 500, bottom: 540});
                App._initCallbacks.run(undefined, App);
            });

            afterEach(function() {
                App.closeRegions();
                posStub.restore();
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
                appendToSpy = sinon.spy($.prototype, 'appendTo');
                scrollTopSpy = sinon.spy($.prototype, 'animate');
                clickSwallowSpy = sinon.spy($.prototype, 'click');
                windowResizeSpy = sinon.spy($.prototype, 'resize');

                popoverSpy = sinon.spy(NoobTourPopover.prototype, 'render');
                posStub = sinon.stub($.prototype, 'offset');
                posStub.returns({top: 500, bottom: 540});

                App._initCallbacks.run(undefined, App);
                tourSpy = sinon.spy(App.commands._wreqrHandlers['noobtour:activate'], 'callback');
                App.execute('noobtour:activate');
            });

            afterEach(function() {
                tourSpy.restore();
                appendToSpy.restore();
                scrollTopSpy.restore();
                clickSwallowSpy.restore();
                windowResizeSpy.restore();
                popoverSpy.restore();
                posStub.restore();
                App.execute('noobtour:deactivate');
                App.closeRegions();
            });

            it('should be called when the "noobtour:activate" App event is fired', function() {
                (tourSpy).should.have.been.called;
            });

            it('should add noob tour backdrop elements to the dom', function() {
                (appendToSpy.callCount).should.equal(2);
            });

            it('should scroll to the bottom of the page', function() {
                var scrollTopVal = $(document).height()-$(window).height();
                (scrollTopSpy).should.have.been.called;
                (scrollTopSpy.calledWith({scrollTop: scrollTopVal})).should.be.true;
            });

            it('should setup a listener to swallow backdrop click events', function() {
                (clickSwallowSpy).should.have.been.called;
            });

            it('should render "NoobTourPopover"', function() {
                (popoverSpy).should.have.been.called;
            });

        });

        describe('onNoobTourDeActivate', function() {
            var removeSpy, deactivateTourSpy, offSpy;

            beforeEach(function() {
                deactivateTourSpy = sinon.spy(App.commands._wreqrHandlers['noobtour:deactivate'], 'callback');
                removeSpy = sinon.spy($.prototype, 'remove');
                offSpy = sinon.spy($.prototype, 'off');
                App.execute('noobtour:deactivate');
            });

            afterEach(function() {
                deactivateTourSpy.restore();
                removeSpy.restore();
                offSpy.restore();
                App.closeRegions();
            });

            it('should be called when the "noobtour:deactivate" App event is fired', function() {
                (deactivateTourSpy).should.have.been.called;
            });

            it('should unbind the listener swallowing backdrop click events', function() {
                (offSpy).should.have.been.calledWith('click');
            });

            it('should remove noob tour backdrop elements from the dom', function() {
                (removeSpy).should.have.been.called;
            });
        });

        describe('showModal', function() {
            var modalSpy, viewRenderSpy;

            beforeEach(function() {
                viewRenderSpy = sinon.spy(AddEditServerModal.prototype, 'render');
                App.execute('modal:show', new AddEditServerModal({App:sinon.spy()}));
            });

            afterEach(function() {
                viewRenderSpy.restore();
                App.closeRegions();
            });

            it('should show the modal', function() {
                (viewRenderSpy).should.have.been.called;
            });

        });

        describe('closeModal', function() {
            var viewRemoveSpy;

            beforeEach(function() {
                viewRemoveSpy = sinon.spy(AddEditServerModal.prototype, 'remove');
                App.showModal(new AddEditServerModal({App:sinon.spy()}));
            });

            it('should call "remove" on the currentView in the modal region', function() {
                App.closeModal();
                (viewRemoveSpy).should.have.been.called;
            });
        });

        describe('activeServer', function() {
            var posStub, toggleToolbarItemsStub;

            beforeEach(function() {
                toggleToolbarItemsStub = sinon.stub(MainToolbar.prototype, 'toggleToolbarItems');
                posStub = sinon.stub($.prototype, 'offset');
                posStub.returns({top: 500, bottom: 540});
            });

            afterEach(function() {
                App.closeRegions();
                toggleToolbarItemsStub.restore();
                posStub.restore();
            });

            describe('getActiveServer', function() {

                it('sets a blank activeServer on startup', function() {
                    App._initCallbacks.run(undefined, App);
                    var activeServer = App.getActiveServer();
                    expect(activeServer instanceof Server).to.be.true;
                    expect(activeServer.get('ipv4')).to.be.null;
                });
            });

            describe('setActiveServer', function() {
                var activeServerSpy;

                beforeEach(function() {
                   activeServerSpy = sinon.spy(App.vent._events['active-server:changed'][0], 'callback');
                    App._initCallbacks.run(undefined, App);
                });

                afterEach(function() {
                    activeServerSpy.restore();
                });

                it('replaces existing active server', function() {
                    var firstActiveServer = App.getActiveServer();
                    var secondActiveServer = App.setActiveServer(new Server());
                    expect(firstActiveServer.cid).to.not.equal(secondActiveServer.cid);
                });

                it('triggers App.vent "active-server:changed" when a new server is set', function() {
                    expect(activeServerSpy.callCount).to.equal(0);
                    App.setActiveServer(new Server());
                    expect(activeServerSpy.callCount).to.equal(1);
                });

                it('unbinds existing listeners when activeServer is replaced', function() {
                    var firstActiveServer = App.getActiveServer();
                    firstActiveServer.on('change', sinon.spy());
                    expect(firstActiveServer._events.change.length).to.equal(1);
                    App.setActiveServer(new Server());
                    expect(_.has(firstActiveServer._events, 'change')).to.be.false;
                });

            });

        });

    });
});