define(['models/Server', 'app'], function(Server, App) {

    describe('Server - Model', function() {

        describe('save (local storage)', function() {
            window.localStorage.clear();

            var server;
            beforeEach(function() {
                server = new Server();
            });

            afterEach(function() {
                window.localStorage.clear();
            });

            it('should save model to localStorage', function(done) {
                server.set('name', 'Sample Server');
                server.set('ipv4', '192.168.0.1');
                server.save();

                var localStorageServers = window.localStorage["Servers"].split(',');
                (localStorageServers.length).should.equal(1);
                done();
            });

            it('model id should match item id in localStorage', function(done) {
                server.set('name', 'Super Sample Server');
                server.set('ipv4', '192.168.10.1');
                server.save();

                (window.localStorage["Servers"]).should.equal(server.id);
                done();
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
