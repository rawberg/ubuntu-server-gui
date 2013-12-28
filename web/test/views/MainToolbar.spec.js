define(function (require_browser) {
    var MainToolbar = require_browser('views/MainToolbar'),
        ServerList = require_browser('collections/ServerList'),
        Server = require_browser('models/Server');

    describe('MainToolbar - ItemView', function() {
        var mainToolbar, appSpy, stickitSpy, serverList;

        beforeEach(function() {
            serverList = new ServerList();
            appSpy = {servers: serverList, activeServer: new Server()};
            stickitSpy = sinon.spy(MainToolbar.prototype, 'stickit');
            mainToolbar = new MainToolbar({App:appSpy});
            mainToolbar.render();
        });

        afterEach(function() {
            mainToolbar.close();
            stickitSpy.restore();
        });

        describe('highlightIcon', function() {

            it('should add "active" css class to a toolbar icon and remove "active" class from existing icons', function() {
                mainToolbar.highlightIcon('toolbar-dashboard');
                (mainToolbar.$('.toolbar-dashboard').hasClass('active')).should.be.ok;
                mainToolbar.highlightIcon('toolbar-file_cabinet');
                (mainToolbar.$('.toolbar-dashboard').hasClass('active')).should.be.false;
                (mainToolbar.$('.toolbar-file_cabinet').hasClass('active')).should.be.ok;
            });
        });

        describe('onClickIcon', function() {

            it('should add active class to an icon when clicked', function() {
                mainToolbar.$('.toolbar-file_cabinet').click();
                (mainToolbar.$('.toolbar-file_cabinet').hasClass('active')).should.be.ok;
            });
        });

        describe('stickit', function() {

            it('should call stickit when a new server is added to serverList', function() {
                (stickitSpy.callCount).should.equal(1);
                serverList.add(new Server({name: 'fake server'}));
                (stickitSpy.callCount).should.equal(2);
            });

             it('should call stickit when serverList collected is synced', function() {
                (stickitSpy.callCount).should.equal(1);
                serverList.trigger('sync');
                (stickitSpy.callCount).should.equal(2);
            });
        });
    });
});