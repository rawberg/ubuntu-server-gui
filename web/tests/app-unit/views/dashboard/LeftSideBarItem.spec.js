define(function (requirejs, exports, module) {
    var LeftSidebarItem = requirejs('views/dashboard/LeftSidebar').LeftSidebarItem,
        Server = requirejs('models/Server');

    xdescribe('LeftSidebarItem - ItemView', function() {

        var leftSidebarItem, server;
        beforeEach(function() {
            server = new Server({
                name: 'Sample Server',
                id: 'c2170a11-c3bb-5b81-33ed-f28eaa21e43c'
            });

            leftSideBarItem = new LeftSidebarItem({model: server});
            leftSideBarItem.render()
        });

        afterEach(function() {
            leftSideBarItem.close();
        });

        describe('onRender', function() {
            it('should set "id" of the li to match the server "id"', function() {
                (leftSideBarItem.el.id).should.equal('server_id_' + server.get('id'));
            });

            it('should set the "name" of the server in the span tag', function() {
                (leftSideBarItem.el.innerText).should.equal(server.get('name'));
            });
        });

    });
});