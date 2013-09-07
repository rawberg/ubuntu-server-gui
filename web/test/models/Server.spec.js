define(['models/Server', 'app'], function(Server, App) {

    describe('Server - Model', function() {
        // set up the async spec
        var async = new AsyncSpec(this);

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

    });
});
