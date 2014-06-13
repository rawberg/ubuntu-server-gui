define(function (requirejs) {
    var MainToolbar = requirejs('views/MainToolbar'),
        ServerList = requirejs('collections/ServerList'),
        Server = requirejs('models/Server');

    describe('MainToolbar - ItemView', function() {
        var mainToolbar, appSpy, stickitSpy, serverList;

        beforeEach(function() {
            serverList = new ServerList();
            appSpy = {servers: serverList, getActiveServer: function() { return new Server(); }, vent: {on: jasmine.createSpy()}};
            stickitSpy = spyOn(MainToolbar.prototype, 'stickit');
            mainToolbar = new MainToolbar({App:appSpy});
            mainToolbar.render();
        });

        afterEach(function() {
            mainToolbar.close();
        });

        describe('stickit', function() {

            it('should call stickit when a new server is added to serverList', function() {
                expect(stickitSpy.calls.count()).toBe(1);
                serverList.add(new Server({name: 'fake server'}));
                expect(stickitSpy.calls.count()).toBe(2);
            });

             it('should call stickit when serverList collected is synced', function() {
                expect(stickitSpy.calls.count()).toBe(1);
                serverList.trigger('sync');
                expect(stickitSpy.calls.count()).toBe(2);
            });
        });
    });
});