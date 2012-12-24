define(function (require) {
    var $ = require('jquery'),
        NoobTourPopover = require('views/modal/NoobTourPopover');

    describe('NoobTourPopover - ItemView', function() {
        var noobTourPopover, footerPosStub;

        beforeEach(function() {
            footerPosStub = sinon.stub($.prototype, 'position');
        });

        afterEach(function() {
            footerPosStub.restore();
        });

        describe('onRender', function() {
            var windowResizeSpy;

            beforeEach(function() {
                footerPosStub.returns({top: 666});
                windowResizeSpy = sinon.spy($.prototype, 'resize');
                noobTourPopover = new NoobTourPopover();
                noobTourPopover.render();
            });

            afterEach(function() {
                windowResizeSpy.restore();
                noobTourPopover.close();
            });

            it('should set "top" and "left" coordinates"', function() {
                (noobTourPopover.$el.css('top')).should.equal('533px'); // 666 - 133
                (noobTourPopover.$el.css('left')).should.equal('2px');

            });

            it('should set "display: block"', function() {
                (noobTourPopover.$el.css('display')).should.equal('block');
            });

            it('should bind to "window.resize"', function() {
                (windowResizeSpy).should.have.been.called;
            });

        })

        describe('onWindowResize', function() {
            beforeEach(function() {
                footerPosStub.returns({top: 444});
                noobTourPopover = new NoobTourPopover();
                noobTourPopover.render();
                noobTourPopover.onWindowResize();
            });

            afterEach(function() {
                noobTourPopover.close();
            });

            it('should update "top" css coordinate', function() {
                noobTourPopover.$el.css('top').should.equal('311px'); // 444 - 133
            });
        });

        describe('onClose', function() {

            var offSpy, onCloseSpy;
            beforeEach(function() {
                footerPosStub.returns({top: 505});
                offSpy = sinon.spy($.prototype, 'off');
                onCloseSpy = sinon.spy(NoobTourPopover.prototype, 'onClose');

                noobTourPopover = new NoobTourPopover();
                noobTourPopover.render();
                noobTourPopover.close();
            });

            afterEach(function() {
                offSpy.restore();
                onCloseSpy.restore();
                noobTourPopover.close();
            });

            it('should be called when an instance of NoobTourPopover is closed', function() {
                (onCloseSpy).should.have.been.called;
            });

            it('should unbind "window.resize" event', function() {
                (offSpy).should.have.been.calledWith('resize');
            });

        });

    });
});