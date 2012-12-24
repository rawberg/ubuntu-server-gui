define(function (require) {
    var MainFooterbar = require('views/MainFooterbar'),
        App = require('App'),
        AddEditServerModal = require('views/modal/AddEditServer');

    describe('MainFooterbar - ItemView', function() {
        var mainFooterbar, addServerClickSpy;
        var addEditModal, modalRenderSpy, deactivateTourSpy;
        beforeEach(function() {
            deactivateTourSpy = sinon.spy(App.vent._callbacks['noobtour:deactivate']['next'], 'callback');
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
            })

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