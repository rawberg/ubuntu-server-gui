define(function (require_browser) {
    var MainFooterbar = require_browser('views/MainFooterbar'),
        App = require_browser('App'),
        AddEditServerModal = require_browser('views/modal/AddEditServer');

    describe('MainFooterbar - ItemView', function() {
        var mainFooterbar, addServerClickSpy;
        var modalRenderSpy, deactivateTourSpy;
        beforeEach(function() {
            App.initCallbacks.run(undefined, App);
            deactivateTourSpy = sinon.spy(App.vent._events['noobtour:deactivate'][0], 'callback');
            addServerClickSpy = sinon.spy(MainFooterbar.prototype, 'onAddServerClick');
            modalRenderSpy = sinon.spy(AddEditServerModal.prototype, 'render');

            mainFooterbar = new MainFooterbar();
            mainFooterbar.App = App;
            mainFooterbar.render();
        });

        afterEach(function() {
            mainFooterbar.close();
            addServerClickSpy.restore();
            modalRenderSpy.restore();
            deactivateTourSpy.restore();
        });

        describe('initialze', function() {
            it('should set the main footerbar template', function() {
                (mainFooterbar.template).should.exist;
            });
        });

        describe('onAddServerClick', function() {
            beforeEach(function() {
                mainFooterbar.$('#lsfb_btn_add_server').click();
            });

            afterEach(function() {
                App.closeModal();
            });

            it('should be called when add server button is clicked', function() {
                (addServerClickSpy).should.have.been.called;
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