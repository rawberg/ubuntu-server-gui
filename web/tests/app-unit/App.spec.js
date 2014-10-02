define(function (requirejs) {
    var App = requirejs("App"),
        Session = requirejs("models/Session"),
        Server = requirejs("models/Server"),
        ServerConnection = requirejs("models/ServerConnection"),
        MainToolbar = requirejs("views/MainToolbar"),
        AddEditServerModal = requirejs("views/modal/AddEditServer");


    describe("App", function() {
        var resetSpy, showSpy;

        beforeEach(function() {
            App._initCallbacks.run(undefined, App);
            resetSpy = spyOn(App.modalContainer, "reset");
            showSpy = spyOn(App.modalContainer, "show");
        });

        afterEach(function() {
            App.emptyRegions();
            App._initCallbacks.reset();
        });

        describe("showModal", function() {
            it("should show the modal", function(done) {
                App.execute("modal:show", new AddEditServerModal({
                    serverList: new Backbone.Collection()
                }));
                expect(showSpy).toHaveBeenCalled();
                done();
            });

        });

        describe("closeModal", function() {
            it("should call 'reset' on the modal region", function() {
                App.showModal(new AddEditServerModal({
                    serverList: new Backbone.Collection()
                }));
                App.closeModal();
                expect(resetSpy).toHaveBeenCalled();
            });
        });
        
        describe("connectionModal", function() {
            var fakeServer;

            beforeEach(function() {
                fakeServer = new Server({name: 'TestServe', ipv4: '127.0.0.1'});
                fakeServer.connection = new ServerConnection({}, {server: fakeServer});
                jasmine.clock().install();
            });

            afterEach(function() {
               fakeServer.destroy();
               jasmine.clock().uninstall();
            });

            it("should close connection modal upon connected status", function(done) {
                expect(resetSpy).not.toHaveBeenCalled();
                App.connectionModal(fakeServer);
                expect(showSpy).toHaveBeenCalled();
                fakeServer.connection.set('connection_status', 'connected');
                jasmine.clock().tick(801);
                expect(resetSpy).toHaveBeenCalled();
                done();
            });

            it("should close the modal on cancel event", function(done) {
                expect(resetSpy).not.toHaveBeenCalled();
                App.connectionModal(fakeServer);
                var connectionModal = showSpy.calls.mostRecent()['args'][0];
                connectionModal.trigger('cancel');
                expect(resetSpy).toHaveBeenCalled();
                done();
            });
        });
    });
});