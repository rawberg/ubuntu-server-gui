define(function (require) {
    var $ = require('jquery'),
        App = require('App'),
        Session = require('models/Session'),
        NoobTourPopover = require('views/modal/NoobTourPopover');

    describe('App', function() {

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
                tourSpy = sinon.spy(App.vent._callbacks['noobtour:activate']['next'], 'callback');
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
                deactivateTourSpy = sinon.spy(App.vent._callbacks['noobtour:deactivate']['next'], 'callback');
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

//        xdescribe('wrapping ajax errors', function() {
//
//        });
    });
});