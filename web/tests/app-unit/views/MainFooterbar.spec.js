define(function (require_browser) {
    var MainFooterbar = require_browser('views/MainFooterbar'),
        App = require_browser('App'),
        AddEditServerModal = require_browser('views/modal/AddEditServer');

    xdescribe('MainFooterbar - ItemView', function() {
        var mainFooterbar, addServerClickSpy;
        var modalRenderSpy, deactivateTourSpy;
        beforeEach(function() {
            deactivateTourSpy = sinon.spy(App.vent._events['noobtour:deactivate'][0], 'callback');
            modalRenderSpy = sinon.spy(AddEditServerModal.prototype, 'render');
            App._initCallbacks.run(undefined, App);
        });

        afterEach(function() {
            App.mainFooterbar.close();
            modalRenderSpy.restore();
            deactivateTourSpy.restore();
        });

        describe('clicking add server button', function() {
            beforeEach(function() {
                App.mainFooterbar.currentView.$('#lsfb_btn_add_server').click();
            });

            afterEach(function() {
                App.closeModal();
            });

            it('should render the "AddEditServerModal"', function() {
                (modalRenderSpy).should.have.been.called;
            });

            it('should trigger the "noobtour:deactivate" event', function() {
                (deactivateTourSpy).should.have.been.called;
            });
        });
    });
});