define(function (requirejs) {
    var $ = requirejs('jquery'),
        Marionette = requirejs('marionette'),
        App = requirejs('App'),
        MainToolbar = requirejs('views/MainToolbar'),
        Server = requirejs('models/Server'),
        ServerList = requirejs('collections/ServerList');


    describe('MainToolbar - ItemView', function () {

        describe('onServerClick', function () {
            var mainToolbar, serverList;
            var addEditModalSpy, setActiveServerSpy;

            beforeEach(function () {
                App._initCallbacks.run(undefined, App);
                spyOn(App.modalContainer, 'show');
                spyOn(MainToolbar.prototype, 'toggleToolbarItems');

                addEditModalSpy = spyOn(App.commands._wreqrHandlers['modal:show'], ['callback']).and.callThrough();
                setActiveServerSpy = spyOn(ServerList.prototype, 'setActive');

                serverList = new ServerList([
                    {id: '1111', name: 'First Fake Server'},
                    {id: '2222', name: 'Second Fake Server'}
                ]);

                mainToolbar = new MainToolbar({servers: serverList});
                mainToolbar.render();
            });

            afterEach(function () {
                mainToolbar.destroy();
                App._initCallbacks.reset();
            });

            it('edits new server model', function() {
                mainToolbar.onServerClick();
                expect(addEditModalSpy.calls.mostRecent().args[0]['model'].id).toBe(null);
            });

            it('edits selected server', function() {
                expect(mainToolbar.model.get('server_id')).toBeNull();
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 2).change();
                expect(setActiveServerSpy).toHaveBeenCalled();
                expect(mainToolbar.model.get('server_id')).toMatch('2222');
                mainToolbar.onServerClick();
                expect(addEditModalSpy.calls.mostRecent().args[0]['model']).toBe(serverList.at(1));
            });

            it('selecting and deselecting edits new server model', function() {
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 2).change();
                expect(mainToolbar.model.get('server_id')).toMatch('2222');
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 0).change();
                expect(mainToolbar.model.get('server_id')).toBe(null);
                expect(mainToolbar.$('.server-select-toggle option:selected').text()).toMatch('Select Server');
                mainToolbar.onServerClick();
                expect(addEditModalSpy.calls.mostRecent().args[0]['model'].id).toBe(null);
            });
        });

        describe('onActiveServerDisconnect', function() {
            var mainToolbar, serverList,
                setActiveServerSpy, toggleToolbarSpy, channelTriggerSpy;

            beforeEach(function() {
                App._initCallbacks.run(undefined, App);
                channelTriggerSpy = spyOn(App.serverChannel.vent, 'trigger').and.callThrough();
                setActiveServerSpy = spyOn(ServerList.prototype, 'setActive');
                toggleToolbarSpy = spyOn(MainToolbar.prototype, 'toggleToolbarItems').and.callThrough();

                serverList = new ServerList([
                    {id: '1111', name: 'First Fake Server'},
                    {id: '2222', name: 'Second Fake Server'}
                ]);

                mainToolbar = new MainToolbar({servers: serverList});
                mainToolbar.render();
            });

            afterEach(function () {
                mainToolbar.destroy();
                App._initCallbacks.reset();
            });

            it('sets default server selection', function(done) {
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 1).change();
                expect(setActiveServerSpy).toHaveBeenCalled();
                mainToolbar.onActiveServerDisconnect();
                expect(mainToolbar.$('.server-select-toggle option:selected').text()).toMatch('Select Server');
                expect(toggleToolbarSpy.calls.mostRecent()['args'][0]).toBeFalsy();
                done();
           });

            it('triggers active server disconnect event', function(done) {
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 1).change();
                expect(setActiveServerSpy).toHaveBeenCalled();
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 0).change();
                expect(setActiveServerSpy.calls.count()).toBe(1);
                expect(channelTriggerSpy.calls.mostRecent()['args'][0]).toBe('disconnect');
                done();
            });
        });

        describe('updates server selection list', function() {
            var mainToolbar, activeServer, otherServer, serverList;

            beforeEach(function () {
                App._initCallbacks.run(undefined, App);
                spyOn(MainToolbar.prototype, 'toggleToolbarItems');
                spyOn(ServerList.prototype, 'setActive');

                serverList = new ServerList([
                    {id: '1111', name: 'First Fake Server'},
                    {id: '2222', name: 'Second Fake Server'}
                ]);
                serverList.at(0).url = "http://localhost";
                serverList.at(1).url = "http://localhost";

                mainToolbar = new MainToolbar({servers: serverList});
                mainToolbar.render();
            });

            afterEach(function () {
                mainToolbar.destroy();
                App._initCallbacks.reset();
            });

            it('editing selected server updates the list', function (done) {
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 1).change();
                expect(mainToolbar.model.get('server_id')).toEqual(serverList.at(0).id);
                serverList.get('1111').set('name', 'GNU Name');
                mainToolbar.model.trigger('change:server_id');
                expect(mainToolbar.$('.server-select-toggle option:selected').text()).toMatch('GNU Name');
                done();
            });

            it('destroying a server in the list updates the list', function(done) {
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 2).change();
                expect(mainToolbar.model.get('server_id')).toEqual(serverList.at(1).id);
                expect(serverList.length).toEqual(2);
                expect(mainToolbar.$('select option').length).toEqual(3);

                var removeSpy = spyOn(serverList._events['remove'][1], 'callback').and.callThrough();
                serverList.at(0).destroy();

                expect(removeSpy.calls.count()).toBe(1);
                expect(serverList.length).toEqual(1);
                expect(mainToolbar.$('select option').length).toEqual(2);
                done();
            });
        });
    });
});