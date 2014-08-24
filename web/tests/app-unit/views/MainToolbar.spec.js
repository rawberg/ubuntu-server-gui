define(function (requirejs) {
    var $ = requirejs('jquery'),
        App = requirejs('App'),
        MainToolbar = requirejs('views/MainToolbar'),
        Server = requirejs('models/Server'),
        ServerList = requirejs('collections/ServerList');


    describe('MainToolbar - ItemView', function () {

        describe('onServerClick', function () {
            var mainToolbar, activeServer, serverList;
            var addEditModalSpy;

            beforeEach(function () {
                App._initCallbacks.run(undefined, App);
                spyOn(App.modalContainer, 'show');
                spyOn(MainToolbar.prototype, 'toggleToolbarItems');
                addEditModalSpy = spyOn(App.commands._wreqrHandlers['modal:show'], ['callback']).and.callThrough();

                activeServer = App.getActiveServer();
                serverList = new ServerList([
                    {id: '1111', name: 'First Fake Server'},
                    {id: '2222', name: 'Second Fake Server'}
                ]);

                mainToolbar = new MainToolbar({model: activeServer, servers: serverList});
                mainToolbar.render();
            });

            afterEach(function () {
                mainToolbar.destroy();
            });

            it('edits passed in model', function() {
                mainToolbar.onServerClick();
                expect(addEditModalSpy.calls.mostRecent().args[0]['model']).toBe(activeServer);
            });

            it('edits selected server', function() {
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 2).change();
                expect(mainToolbar.model.id).toMatch('2222');
                mainToolbar.onServerClick();
                expect(addEditModalSpy.calls.mostRecent().args[0]['model']).toBe(serverList.at(1));
            });

            it('selecting and deselecting edits new server model', function() {
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 2).change();
                expect(mainToolbar.model.id).toMatch('2222');
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 0).change();
                expect(mainToolbar.model.id).toBe(null);
                expect(mainToolbar.$('.server-select-toggle option:selected').text()).toMatch('Select Server');
                mainToolbar.onServerClick();
                expect(addEditModalSpy.calls.mostRecent().args[0]['model']).toBe(mainToolbar.model);
            });
        });

        describe('onActiveServerDisconnect', function() {
            var mainToolbar, activeServer, serverList,
                acsDisconnectSpy, updateListSpy, appServerSetSpy;

            beforeEach(function() {
                App._initCallbacks.run(undefined, App);
                spyOn(MainToolbar.prototype, 'toggleToolbarItems');
                appServerSetSpy = spyOn(App.reqres._wreqrHandlers['server:set'], ['callback']).and.callThrough();

                activeServer = App.getActiveServer();
                serverList = new ServerList([
                    {id: '1111', name: 'First Fake Server'},
                    {id: '2222', name: 'Second Fake Server'}
                ]);

                acsDisconnectSpy = spyOn(MainToolbar.prototype, 'onActiveServerDisconnect').and.callThrough();
                mainToolbar = new MainToolbar({model: activeServer, servers: serverList});
                mainToolbar.render();
            });

            afterEach(function () {
                mainToolbar.destroy();
            });

            it('sets default server selection', function(done) {
                updateListSpy = spyOn(mainToolbar, 'updateServerSelectionList').and.callThrough();
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 1).change();
                mainToolbar.onActiveServerChange(serverList.at(1));
                expect(appServerSetSpy).toHaveBeenCalled();
                expect(appServerSetSpy.calls.count()).toBe(1);
                expect(updateListSpy).not.toHaveBeenCalled();
                expect(acsDisconnectSpy).not.toHaveBeenCalled();

                mainToolbar.onActiveServerDisconnect();
                expect(acsDisconnectSpy).toHaveBeenCalled();
                expect(acsDisconnectSpy.calls.count()).toBe(1);
                expect(mainToolbar.$('.server-select-toggle option:selected').text()).toMatch('Select Server');
                expect(updateListSpy).not.toHaveBeenCalled();
                expect(appServerSetSpy.calls.count()).toBe(1);
                done();
           });

            it('triggers default server list selection', function(done) {
                updateListSpy = spyOn(mainToolbar, 'updateServerSelectionList').and.callThrough();
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 1).change();
                expect(appServerSetSpy).toHaveBeenCalled();
                expect(updateListSpy).not.toHaveBeenCalled();
                expect(acsDisconnectSpy).not.toHaveBeenCalled();
                expect(mainToolbar.$('.server-select-toggle option:selected').text()).toMatch(serverList.at(0).get('name'));

                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 0).change();
                expect(acsDisconnectSpy).toHaveBeenCalled();
                expect(acsDisconnectSpy.calls.count()).toBe(1);
                expect(appServerSetSpy.calls.count()).toBe(2);
                expect(updateListSpy).not.toHaveBeenCalled();
                done();
            });
        });

        describe('updateServerSelectionList', function() {
            var mainToolbar, activeServer, serverList,
                updateSelectionListSpy;

            beforeEach(function () {
                App._initCallbacks.run(undefined, App);
                spyOn(MainToolbar.prototype, 'toggleToolbarItems');

                activeServer = App.getActiveServer();
                serverList = new ServerList([
                    {id: '1111', name: 'First Fake Server'},
                    {id: '2222', name: 'Second Fake Server'}
                ]);

                mainToolbar = new MainToolbar({model: activeServer, servers: serverList});
                mainToolbar.render();
            });

            afterEach(function () {
                mainToolbar.destroy();
            });

            it('editing passed in server does not update list', function () {
                updateSelectionListSpy = spyOn(mainToolbar, 'updateServerSelectionList').and.callThrough();
                mainToolbar.model.set('name', 'New Name');
                expect(updateSelectionListSpy).not.toHaveBeenCalled();
            });

            it('editing selected server updates the list', function (done) {
                updateSelectionListSpy = spyOn(mainToolbar, 'updateServerSelectionList').and.callThrough();
                expect(updateSelectionListSpy).not.toHaveBeenCalled();
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 1).change();
                expect(mainToolbar.model.id).toMatch('1111');
                expect(updateSelectionListSpy).not.toHaveBeenCalled();
                mainToolbar.model.set('name', 'GNU Name');
                expect(updateSelectionListSpy).toHaveBeenCalled();
                expect(updateSelectionListSpy.calls.count()).toBe(1);
                expect(mainToolbar.$('.server-select-toggle option:selected').text()).toMatch('GNU Name');
                done();
            });
        });
    });
});