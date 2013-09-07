define(function (require_browser) {
    var $ = require_browser('jquery'),
        App = require_browser('App'),
        Session = require_browser('models/Session'),
        AddEditServerModal = require_browser('views/modal/AddEditServer'),
        NoobTourPopover = require_browser('views/modal/NoobTourPopover');

    require_browser('bootstrap_modal');

    describe('App', function() {

        beforeEach(function() {
            App.initCallbacks.run(undefined, App);
        });

        afterEach(function() {
        });

        describe('start', function() {
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
                tourSpy = sinon.spy(App.vent._events['noobtour:activate'][0], 'callback');
                posStub = sinon.stub($.prototype, 'position');
                posStub.returns({top: 500, bottom: 540});

                appendToSpy = sinon.spy($.prototype, 'appendTo');
                scrollTopSpy = sinon.spy($.prototype, 'animate');
                clickSwallowSpy = sinon.spy($.prototype, 'click');
                windowResizeSpy = sinon.spy($.prototype, 'resize');

                popoverSpy = sinon.spy(NoobTourPopover.prototype, 'render');
                App.vent.trigger('noobtour:activate');
            });

            afterEach(function() {
                tourSpy.restore();
                posStub.restore();
                appendToSpy.restore();
                scrollTopSpy.restore();
                clickSwallowSpy.restore();
                windowResizeSpy.restore();
                popoverSpy.restore();
                App.vent.trigger('noobtour:deactivate');
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

            it('should setup a listener for "window.resize" events', function() {
                (windowResizeSpy.callCount).should.equal(2);
            });

        });

        describe('onNoobTourDeActivate', function() {
            var removeSpy, deactivateTourSpy, offSpy;
            beforeEach(function() {
                deactivateTourSpy = sinon.spy(App.vent._events['noobtour:deactivate'][0], 'callback');
                removeSpy = sinon.spy($.prototype, 'remove');
                offSpy = sinon.spy($.prototype, 'off');
                App.vent.trigger('noobtour:deactivate');
            });

            afterEach(function() {
                deactivateTourSpy.restore();
                removeSpy.restore();
                offSpy.restore();
            });

            it('should be called when the "noobtour:deactivate" App event is fired', function() {
                (deactivateTourSpy).should.have.been.called;
            });

            it('should unbind the listener swallowing backdrop click events', function() {
                (offSpy).should.have.been.calledWith('click');
            });

            it('should unbind "window.resize" event', function() {
                (offSpy).should.have.been.calledWith('resize');
            });

            it('should remove noob tour backdrop elements from the dom', function() {
                (removeSpy).should.have.been.called;
            });
        });

        describe('showModal', function() {
            var modalSpy, viewRenderSpy;

            beforeEach(function() {
                modalSpy = sinon.spy($.prototype, 'modal');
                viewRenderSpy = sinon.spy(AddEditServerModal.prototype, 'render');
                App.showModal(new AddEditServerModal());
            });

            afterEach(function() {
                modalSpy.restore();
                viewRenderSpy.restore();
                App.closeModal();
            });

            it('should show the modal', function() {
                (modalSpy).should.have.been.calledWith('show');
                (viewRenderSpy).should.have.been.called;
            });

        });

        describe('closeModal', function() {
            var viewRemoveSpy;

            beforeEach(function() {
                viewRemoveSpy = sinon.spy(AddEditServerModal.prototype, 'remove');
                App.showModal(new AddEditServerModal());
            });

            it('should call "remove" on the currentView in the modal region', function() {
                App.closeModal();
                (viewRemoveSpy).should.have.been.called;
            });
        });

    });
});