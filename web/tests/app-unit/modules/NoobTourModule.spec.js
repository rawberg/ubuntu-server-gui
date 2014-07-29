define(function (requirejs) {
    var $ = requirejs('jquery'),
        App = requirejs('App'),
        Session = requirejs('models/Session'),
        Server = requirejs('models/Server'),
        MainToolbar = requirejs('views/MainToolbar'),
        NoobTourPopover = requirejs('views/modal/NoobTourPopover');


    describe('NoobTourModule', function() {
        describe('onNoobTourActivate', function () {
            var tourSpy, appendToSpy, posStub, windowResizeSpy;
            var clickSwallowSpy, scrollTopSpy, popoverSpy;

            beforeEach(function () {
                appendToSpy = spyOn($.prototype, 'appendTo');
                scrollTopSpy = spyOn($.prototype, 'animate');
                clickSwallowSpy = spyOn($.prototype, 'click');
                windowResizeSpy = spyOn($.prototype, 'resize');

                popoverSpy = spyOn(NoobTourPopover.prototype, 'render');
                posStub = spyOn($.prototype, 'offset').and.returnValue({top: 500, bottom: 540});

                App._initCallbacks.run(undefined, App);
                tourSpy = spyOn(App.commands._wreqrHandlers['noobtour:activate'], 'callback').and.callThrough();
                App.execute('noobtour:activate');
            });

            afterEach(function () {
                App.execute('noobtour:deactivate');
                App.closeRegions();
            });

            it('should be called when the "noobtour:activate" App event is fired', function () {
                expect(tourSpy).toHaveBeenCalled();
            });

            it('should add noob tour backdrop elements to the dom', function () {
                expect(appendToSpy.calls.count()).toBe(2);
            });

            it('should scroll to the bottom of the page', function () {
                var scrollTopVal = $(document).height() - $(window).height();
                expect(scrollTopSpy).toHaveBeenCalledWith({scrollTop: scrollTopVal});
            });

            it('should setup a listener to swallow backdrop click events', function () {
                expect(clickSwallowSpy).toHaveBeenCalled();
            });

            it('should render "NoobTourPopover"', function () {
                expect(popoverSpy).toHaveBeenCalled();
            });

        });

        describe('onNoobTourDeActivate', function () {
            var removeSpy, deactivateTourSpy, offSpy;

            beforeEach(function () {
                deactivateTourSpy = spyOn(App.commands._wreqrHandlers['noobtour:deactivate'], 'callback').and.callThrough();
                removeSpy = spyOn($.prototype, 'remove').and.callThrough();
                offSpy = spyOn($.prototype, 'off').and.callThrough();
                App.execute('noobtour:deactivate');
            });

            afterEach(function () {
                App.closeRegions();
            });

            it('should be called when the "noobtour:deactivate" App event is fired', function () {
                expect(deactivateTourSpy).toHaveBeenCalled();
            });

            it('should unbind the listener swallowing backdrop click events', function () {
                expect(offSpy).toHaveBeenCalledWith('click');
            });

            it('should remove noob tour backdrop elements from the dom', function () {
                expect(removeSpy).toHaveBeenCalled();
            });
        });
    });
});