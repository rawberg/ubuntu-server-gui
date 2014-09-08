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
            var addEditModalSpy;

            beforeEach(function () {
                App._initCallbacks.run(undefined, App);
                spyOn(App.modalContainer, 'show');
                spyOn(MainToolbar.prototype, 'toggleToolbarItems');
                addEditModalSpy = spyOn(App.commands._wreqrHandlers['modal:show'], ['callback']).and.callThrough();

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
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 2).change();
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
            var mainToolbar, serverList, acsDisconnectSpy,
                appServerSetSpy, acsChangeSpy;

            beforeEach(function() {
                App._initCallbacks.run(undefined, App);
                spyOn(MainToolbar.prototype, 'toggleToolbarItems');
                appServerSetSpy = spyOn(App.reqres._wreqrHandlers['server:set'], ['callback']).and.callThrough();

                serverList = new ServerList([
                    {id: '1111', name: 'First Fake Server'},
                    {id: '2222', name: 'Second Fake Server'}
                ]);

                acsDisconnectSpy = spyOn(MainToolbar.prototype, 'onActiveServerDisconnect').and.callThrough();
                acsChangeSpy = spyOn(MainToolbar.prototype, 'onActiveServerChange').and.callThrough();

                mainToolbar = new MainToolbar({servers: serverList});
                mainToolbar.render();
            });

            afterEach(function () {
                mainToolbar.destroy();
                App._initCallbacks.reset();
            });

            it('sets default server selection', function(done) {
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 1).change();
                mainToolbar.onActiveServerChange(serverList.at(1));
                expect(appServerSetSpy).toHaveBeenCalled();
                expect(appServerSetSpy.calls.count()).toBe(1);
                expect(acsDisconnectSpy).not.toHaveBeenCalled();

                mainToolbar.onActiveServerDisconnect();
                expect(mainToolbar.$('.server-select-toggle option:selected').text()).toMatch('Select Server');
                expect(appServerSetSpy.calls.count()).toBe(1);
                done();
           });

            it('triggers default server list selection', function(done) {
                var firstServer = serverList.at(0);
                App.vent.on('server:disconnect', function() {
                    App.vent.trigger('server:disconnected', firstServer);
                }, this);

                expect(mainToolbar.model.get('server_id')).not.toMatch(firstServer.id);
                expect(acsChangeSpy).not.toHaveBeenCalled();
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 1).change();
                expect(appServerSetSpy).toHaveBeenCalled();
                expect(acsChangeSpy).toHaveBeenCalled();
                expect(mainToolbar.model.get('server_id')).toMatch(firstServer.id);
                expect(acsDisconnectSpy).not.toHaveBeenCalled();
                expect(mainToolbar.$('.server-select-toggle option:selected').text()).toMatch(serverList.at(0).get('name'));

                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 0).change();
                expect(acsDisconnectSpy.calls.count()).toBe(1);
                done();
            });
        });

        describe('updates server selection list', function() {
            var mainToolbar, activeServer, otherServer, serverList;

            beforeEach(function () {
                spyOn(MainToolbar.prototype, 'toggleToolbarItems');

                activeServer = new Backbone.Model({id: null, name: 'New Server'});
                otherServer = new Backbone.Model({id: null, name: 'Other Server'});
                serverList = new Backbone.Collection([
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
            });

            it('editing selected server updates the list', function (done) {
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 1).change();
                expect(mainToolbar.model.get('server_id')).toEqual(serverList.at(0).id);
                serverList.get(mainToolbar.model.get('server_id')).set('name', 'GNU Name');
                mainToolbar.model.trigger('change:server_id');
                expect(mainToolbar.$('.server-select-toggle option:selected').text()).toMatch('GNU Name');
                done();
            });

            it('destroying a server in the list updates the list', function(done) {
                expect(serverList._events['remove'].length).toEqual(1);
                mainToolbar.$('.server-select-toggle').prop('selectedIndex', 2).change();
                expect(mainToolbar.model.get('server_id')).toEqual(serverList.at(1).id);
                expect(serverList._events['remove'].length).toEqual(1);
                expect(serverList.length).toEqual(2);
                expect(mainToolbar.$('select option').length).toEqual(3);

                var removeSpy = spyOn(serverList._events['remove'][0], 'callback').and.callThrough();
                mainToolbar.options.servers.at(0).destroy({
                    complete: _.bind(function() {
                        expect(removeSpy.calls.count()).toBe(1);
                        expect(serverList.length).toEqual(1);
                        expect(mainToolbar.$('select option').length).toEqual(2);
                        done();
                    }, this)
                });
            });

            it('stickit sets up collection events through model changes', function(done) {
                var collection = new Backbone.Collection([
                    {id: '1111', name: 'First Fake Server'},
                    {id: '2222', name: 'Second Fake Server'}
                ]);

                collection.at(0).url = "http://localhost";
                collection.at(1).url = "http://localhost";

                var modelOne = new Backbone.Model({id: null, name: 'Model One'});
                var modelTwo = new Backbone.Model({id: null, name: 'Model Two'});

                var SampleView = Marionette.ItemView.extend({
                    template: _.template('<form><select name="server-select"></select></form>'),
                    bindings: {
                        'select[name="server-select"]': {
                            observe: 'id',
                            updateModel: function(val, event, options) {
                                return false;
                            },
                            selectOptions: {
                                collection: 'this.options.machines',
                                labelPath: 'name',
                                valuePath: 'id',
                                defaultOption: {
                                    label: 'Select Server',
                                    value: null
                                }
                            }
                        }
                    },
                    onRender: function() {
                        this.stickit();
                    }
                });

                var sampleView = new SampleView({model: modelOne, machines: collection});
                sampleView.render();
                expect(sampleView.model.cid).toEqual(modelOne.cid);
                expect(collection._events['remove'].length).toEqual(1);

                sampleView.stopListening(sampleView.model);
                sampleView.model.off();
                sampleView.unstickit(sampleView.model);

                sampleView.model = modelTwo;
                sampleView.stickit();
                expect(sampleView.model.cid).toEqual(modelTwo.cid);
                expect(collection._events['remove'].length).toEqual(1);

                expect(collection.length).toEqual(2);
                expect(sampleView.$('select option').length).toEqual(3);
                var removeSpy = spyOn(collection._events['remove'][0], 'callback').and.callThrough();

                collection.at(0).destroy({
                    complete: _.bind(function() {
                        expect(removeSpy.calls.count()).toEqual(1);
                        expect(collection.length).toEqual(1);
                        expect(sampleView.$('select option').length).toEqual(2);
                        done();
                    }, this)
                });
            });
        });
    });
});