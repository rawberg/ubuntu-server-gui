define(function (requirejs) {
    var App = requirejs('App'),
        ServerList = requirejs('collections/ServerList'),
        Server = requirejs('models/Server');

    describe('ServerList - Collection', function() {
        describe('noobtour activation', function() {
            var serverList, posStub, noobActivateSpy;

            beforeEach(function() {
                posStub = spyOn($.prototype, 'offset').and.returnValue({top: 500, bottom: 540});
                serverList = new ServerList();

                App._initCallbacks.run(undefined, App);
                noobActivateSpy = spyOn(App.commands._wreqrHandlers['noobtour:activate'], 'callback');
            });

            afterEach(function() {
                serverList.reset([], {silent: true});
            });

            it('called when all servers are removed from the collection', function() {
                serverList.add([{name: 'Server One'}, {name: 'Server Two'}]);
                serverList.pop();
                serverList.pop();
                expect(noobActivateSpy).toHaveBeenCalled();
            });

            it('called when the server/local storage returns zero results', function() {
                serverList.fetch();
                expect(noobActivateSpy).toHaveBeenCalled();
            });
        });

        describe('onAddServer', function() {
            var posStub, onAddSpy, serverList;

            beforeEach(function() {
                posStub = spyOn($.prototype, 'offset').and.returnValue({top: 500, bottom: 540});
                onAddSpy = spyOn(ServerList.prototype, 'onAddServer');

                serverList = new ServerList();
                App._initCallbacks.run(undefined, App);
            });

            afterEach(function() {
                serverList.reset([], {silent: true});
            });

            it('called when App.vent add:server is triggered', function() {
                App.vent.trigger('server:add', new Server());
                expect(onAddSpy).toHaveBeenCalled();
            });
        });
    });
});