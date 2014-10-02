define([
    'models/Server',
    'models/ServerConnection',
    'App'], function(Server, ServerConnection, App) {

    describe('Server - Model', function() {
        describe('url', function() {
            var server;

            beforeEach(function() {
                server = new Server();
                server.set('name', 'Sample Server');
                server.set('ipv4', '10.10.0.1');
                server.set('port', 9090);
            });

            it('should return a correctly formatted websocket url', function() {
               (server.getUrl()).should.have.string('http://10.10.0.1:9090');
            });
        });

        describe('saving, updating and deleting (local storage)', function() {
            window.localStorage.clear();
            var server, storedServer;

            beforeEach(function() {
                server = new Server({name: 'Sample Server', 'ipv4': '192.168.0.1'}, {local: true});
                server.save();

                storedServer = JSON.parse(window.localStorage['Servers'+server.id]);
            });

            afterEach(function() {
                window.localStorage.clear();
            });

            it('should save model to localStorage', function() {
                var localStorageServers = window.localStorage["Servers"].split(',');
                (localStorageServers.length).should.equal(1);
            });

            it('server "id", "name" and "ipv4" should match data in localStorage', function() {
                (window.localStorage["Servers"]).should.equal(server.id);
                (storedServer.name).should.equal(server.get('name'));
                (storedServer.ipv4).should.equal(server.get('ipv4'));
            });

            it('should delete model from localStorage when calling destroy', function() {
                var secondServer = new Server({name: 'second server'}, {local: true});
                secondServer.save();
                (window.localStorage["Servers"].split(',').length).should.equal(2);

                secondServer.destroy();
                (window.localStorage["Servers"].split(',').length).should.equal(1);
            });

            it('should persist model attribute edits back to localStorage when calling save after edits', function() {
                var serverKey = "Servers" + server.id;
                var originalServerData = JSON.parse(window.localStorage[serverKey]);

                (originalServerData.name).should.equal('Sample Server');
                (originalServerData.ipv4).should.equal('192.168.0.1');

                server.set('name', 'Changed Sample Server');
                server.set('ipv4', '111.108.0.1');
                server.save();

                var updatedServerData = JSON.parse(window.localStorage[serverKey]);
                (updatedServerData.name).should.equal('Changed Sample Server');
                (updatedServerData.ipv4).should.equal('111.108.0.1');
            });
        });

        describe('isConnected', function() {
            var server;

            beforeEach(function() {
                server = new Server({
                    name: 'Sample Server',
                    ipv4: '10.10.0.1',
                    port: 9090
                });
            });

            it('returns false when no connection esists', function() {
                expect(server.isConnected()).toBeFalsy();
            });
        });

        describe('connect', function() {
            var fakeServer, modalSpy, connectSpy;

            beforeEach(function() {
                App._initCallbacks.run(undefined, App);
                connectSpy = spyOn(ServerConnection.prototype, 'connect');

                fakeServer = new Server({
                    id: '1111',
                    name: 'Fake Server',
                    ipv4: '10.0.0.1'
                });
                modalSpy = spyOn(App, 'connectionModal');
            });

            afterEach(function() {
                App._initCallbacks.reset();
            });

            it('initiates ssh connection', function() {
                expect(fakeServer.connection).toBeUndefined();
                expect(modalSpy).not.toHaveBeenCalled();
                expect(connectSpy).not.toHaveBeenCalled();
                fakeServer.connect();
                expect(modalSpy).toHaveBeenCalled();
                expect(connectSpy).toHaveBeenCalled();
                expect(fakeServer.connection).toBeDefined();
            });
        });

    });
});
