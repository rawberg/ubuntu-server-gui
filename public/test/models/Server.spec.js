define(['models/Server', 'app'], function(Server, App) {

    describe('Server - Model', function() {

        describe('save (local storage)', function() {
            window.localStorage.clear();

            var server, storedServer;
            beforeEach(function() {
                server = new Server();
                server.set('name', 'Sample Server');
                server.set('ipv4', '192.168.0.1');
                server.save();

                storedServer = JSON.parse(window.localStorage['Servers'+server.id]);
            });

            afterEach(function() {
                window.localStorage.clear();
            });

            it('should save model to localStorage', function(done) {
                var localStorageServers = window.localStorage["Servers"].split(',');
                (localStorageServers.length).should.equal(1);
                done();
            });

            it('"id" should match server "id" in localStorage', function(done) {
                (window.localStorage["Servers"]).should.equal(server.id);
                done();
            });

            it('server "name" should match server "name" in localStorage', function() {
                (storedServer.name).should.equal(server.get('name'));
            });

            it('server "ipv4" should match "ipv4" address in localStorage', function() {
                (storedServer.ipv4).should.equal(server.get('ipv4'));
            });

            it('should delete model from localStorage when calling destroy', function(done) {
                server.set('name', 'Super Sample Server');
                server.set('ipv4', '192.168.10.1');
                server.save();

                (window.localStorage["Servers"]).should.equal(server.id);
                server.destroy();

                (window.localStorage["Servers"].length).should.equal(0);
                done();
            });

            it('should persist model attribute edits back to localStorage when calling save after edits', function(done) {
                server.set('name', 'Super Sample Server');
                server.set('ipv4', '192.168.10.1');
                server.save();

                expect(window.localStorage["Servers"]).to.be.equal(server.id);
                server.set('name', 'Changed Sample Server');
                server.set('ipv4', '111.108.0.1');
                server.save();

                var serverData, serverKey;
                serverKey = "Servers" + server.id;
                serverData = JSON.parse(window.localStorage[serverKey]);
                (serverData.name).should.equal('Changed Sample Server');
                (serverData.ipv4).should.equal('111.108.0.1');
                done();
            });
        });
    });
});
