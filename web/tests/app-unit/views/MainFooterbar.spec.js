define(function (requirejs) {
    var $ = requirejs('jquery'),
        MainFooterbar = requirejs('views/MainFooterbar'),
        App = requirejs('App'),
        AddEditServerModal = requirejs('views/modal/AddEditServer');

    xdescribe('MainFooterbar - ItemView', function() {
        var mainFooterbar, addServerClickSpy;
        var modalRenderSpy, deactivateTourSpy;
        beforeEach(function() {
            deactivateTourSpy = spyOn(App.vent._events['noobtour:deactivate'][0], 'callback');
            modalRenderSpy = spyOn(AddEditServerModal.prototype, 'render');
            App._initCallbacks.run(undefined, App);
        });

        afterEach(function() {
            App.mainFooterbar.close();
        });

        describe('clicking add server button', function() {
            beforeEach(function() {
                App.mainFooterbar.currentView.$('#lsfb_btn_add_server').click();
            });

            afterEach(function() {
                App.closeModal();
            });

            it('should render the "AddEditServerModal"', function() {
                expect(modalRenderSpy).toHaveBeenCalled();
            });

            it('should trigger the "noobtour:deactivate" event', function() {
                expect(deactivateTourSpy).toHaveBeenCalled();
            });
        });
    });
});