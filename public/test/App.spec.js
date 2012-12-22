define(function (require) {
    var $ = require('jquery'),
        App = require('App'),
        Session = require('models/Session');

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
            var tourSpy, appendToSpy, posStub;
            var clickSwallowSpy, scrollTopSpy;
            beforeEach(function() {
                tourSpy = sinon.spy(App.vent._callbacks['noobtour:activate']['next'], 'callback');
                posStub = sinon.stub($.prototype, 'position');

                posStub.returns({top: 500, bottom: 540});
                appendToSpy = sinon.spy($.prototype, 'appendTo');
                scrollTopSpy = sinon.spy($.prototype, 'animate');
                clickSwallowSpy = sinon.spy($.prototype, 'click');
                App.vent.trigger('noobtour:activate');
            });

            afterEach(function() {
                tourSpy.restore();
                posStub.restore();
                appendToSpy.restore();
                scrollTopSpy.restore();
                clickSwallowSpy.restore();
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

        });

        describe('onNoobTourDeActivate', function() {
            var removeSpy, removeTourSpy, clickSwallowSpy;
            beforeEach(function() {
                removeTourSpy = sinon.spy(App.vent._callbacks['noobtour:deactivate']['next'], 'callback');
                removeSpy = sinon.spy($.prototype, 'remove');
                clickSwallowSpy = sinon.spy($.prototype, 'off');
                App.vent.trigger('noobtour:deactivate');
            });

            afterEach(function() {
                removeTourSpy.restore();
                removeSpy.restore();
                clickSwallowSpy.restore();
            });

            it('should be called when the "noobtour:deactivate" App event is fired', function() {
                (removeTourSpy).should.have.been.called;
            });

            it('should unbind the listener swallowing backdrop click events', function() {
                (clickSwallowSpy).should.have.been.called;
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