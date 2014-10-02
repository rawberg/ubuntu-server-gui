define(function (requirejs) {
    var App = requirejs("App"),
        ServerList = requirejs("collections/ServerList"),
        Server = requirejs("models/Server");

    describe("ServerList - Collection", function() {
        xdescribe("noobtour activation", function() {
            var serverList, posStub, noobActivateSpy;

            beforeEach(function() {
                posStub = spyOn($.prototype, "offset").and.returnValue({top: 500, bottom: 540});
                serverList = new ServerList();

                App._initCallbacks.run(undefined, App);
                noobActivateSpy = spyOn(App.commands._wreqrHandlers["noobtour:activate"], "callback");
            });

            afterEach(function() {
                serverList.reset([], {silent: true});
            });

            it("called when all servers are removed from the collection", function() {
                serverList.add([{name: "Server One"}, {name: "Server Two"}]);
                serverList.pop();
                serverList.pop();
                expect(noobActivateSpy).toHaveBeenCalled();
            });

            it("called when the server/local storage returns zero results", function() {
                serverList.fetch();
                expect(noobActivateSpy).toHaveBeenCalled();
            });
        });

        xdescribe("onAddServer", function() {
            var posStub, onAddSpy, serverList;

            beforeEach(function() {
                posStub = spyOn($.prototype, "offset").and.returnValue({top: 500, bottom: 540});
                onAddSpy = spyOn(ServerList.prototype, "onAddServer");

                serverList = new ServerList();
                App._initCallbacks.run(undefined, App);
            });

            afterEach(function() {
                App._initCallbacks.reset();
                serverList.reset([], {silent: true});
            });

            it("called when App.vent add:server is triggered", function() {
                App.vent.trigger("server:add", new Server());
                expect(onAddSpy).toHaveBeenCalled();
            });
        });

        describe("activeServer", function() {
            describe("setActive", function() {
                var serverList, serverChannelEventSpy;

                beforeEach(function() {
                    serverList = new ServerList([{
                        id: "1111",
                        name: "Server One",
                    }, {
                        id: "2222",
                        name: "Server Two"
                    }]);
                    serverList.get("2222").connect = jasmine.createSpy();
                    App._initCallbacks.run(undefined, App);
                    serverChannelEventSpy = spyOn(App.serverChannel.vent, "trigger");
                });

                afterEach(function() {
                    App._initCallbacks.reset();
                });

                it("sets initial activeServer - does not autoconnect", function() {
                    expect(serverList.getActive().isNew()).toBeTruthy();
                    serverList.setActive("XXXX");
                    expect(serverList.getActive().isNew()).toBeTruthy();
                    serverList.setActive("2222");
                    expect(serverList.activeServer.id).toEqual("2222");

                    expect(serverList.get("2222").connect).not.toHaveBeenCalled();

                    expect(serverChannelEventSpy.calls.count()).toEqual(1);
                    expect(serverChannelEventSpy.calls.first().args[0]).toEqual("changed");
                });

                it("sets initial activeServer - does autoconnect", function() {
                    expect(serverList.activeServer).toBeUndefined();
                    serverList.setActive("2222", {connect: true});

                    expect(serverList.get("2222").connect).toHaveBeenCalled();

                    expect(serverChannelEventSpy.calls.count()).toEqual(1);
                    expect(serverChannelEventSpy.calls.first().args[0]).toEqual("changed");
                });
            });

        });
    });
});