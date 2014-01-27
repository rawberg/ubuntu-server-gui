define(function (require_browser) {
    var $ = require_browser('jquery'),
        NoobTourPopover = require_browser('views/modal/NoobTourPopover');

    describe('NoobTourPopover - ItemView', function() {
        var noobTourPopover, footerPosStub;

        beforeEach(function() {
            footerPosStub = sinon.stub($.prototype, 'offset');
        });

        afterEach(function() {
            footerPosStub.restore();
        });

        describe('onRender', function() {
            var windowResizeSpy;

            beforeEach(function() {
                footerPosStub.returns({top: 500});
                windowResizeSpy = sinon.spy($.prototype, 'resize');
                noobTourPopover = new NoobTourPopover();
                noobTourPopover.render();
            });

            afterEach(function() {
                windowResizeSpy.restore();
                noobTourPopover.close();
            });

            it('should set "top" and "left" coordinates"', function() {
                (noobTourPopover.$el.css('top')).should.equal('415px'); // 500 - 85
                (noobTourPopover.$el.css('left')).should.equal('3px');

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
                footerPosStub.returns({top: 400});
                noobTourPopover = new NoobTourPopover();
                noobTourPopover.render();
                noobTourPopover.onWindowResize();
            });

            afterEach(function() {
                noobTourPopover.close();
            });

            it('should update "top" css coordinate', function() {
                noobTourPopover.$el.css('top').should.equal('315px'); // 400 - 115
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