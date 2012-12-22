define(function (require) {
    var MainFooterbar = require('views/MainFooterbar'),
        App = require('App'),
        AddEditServerModal = require('views/modal/AddEditServer');

    describe('MainFooterbar - ItemView', function() {
        var mainFooterbar, addServerClickSpy, appModalSpy;
        var addEditModal, modalRenderSpy;
        beforeEach(function() {
            appModalSpy = sinon.spy(App.modal, 'show');
            addServerClickSpy = sinon.spy(MainFooterbar.prototype, 'onAddServerClick');
            modalRenderSpy = sinon.spy(AddEditServerModal.prototype, 'render');
            mainFooterbar = new MainFooterbar();
            mainFooterbar.App = App;
            mainFooterbar.render();
        });

        afterEach(function() {
            mainFooterbar.close();
            addServerClickSpy.restore();
            appModalSpy.restore();
            modalRenderSpy.restore();
        });

        describe('initialze', function() {
            it('should set the main footerbar template', function() {
                (mainFooterbar.template).should.exist;
            });
        });

        describe('onAddServerClick', function() {
            it('should show the add/edit server modal', function() {
                mainFooterbar.$('#lsfb_btn_add_server').click();
                (addServerClickSpy).should.have.been.called;
                (appModalSpy).should.have.been.called;
                (modalRenderSpy).should.have.been.called;
            });
        });
    });
});