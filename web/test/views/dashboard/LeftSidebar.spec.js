define(function (require_browser, exports, module) {
    var AddEditServerModal = require_browser('views/modal/AddEditServer'),
        ContextMenu = require_browser('contextmenu'),
        DashboardLayout = require_browser('views/dashboard/Dashboard'),
        LeftSidebarView = require_browser('views/dashboard/LeftSidebar').LeftSidebar,
        RemoveServerModal = require_browser('views/modal/RemoveServer'),
        ServerListCollection = require_browser('collections/ServerList');


    xdescribe('LeftSidebar - UsgCollectionView', function() {

        var leftSidebar, listAddSpy, serversCollection,
            listRemoveSpy, listRightClickSpy, contextShowSpy,
            onEditServerClickSpy, onRemoveServerClickSpy, modalShowSpy;
        beforeEach(function() {
            listAddSpy = sinon.spy(ServerListCollection.prototype, 'add');
            listRemoveSpy = sinon.spy(ServerListCollection.prototype, 'remove');
            serversCollection = new ServerListCollection([
                {name: 'Web Server', id: 'server_id_c2170a11-c3bb-5b81-33ed-f28eaa21e43c'},
                {name: 'DB Server', id: 'server_id_70a9dc3b-6a7a-c092-0eba-665abdeb42ab'}
            ]);

            listRightClickSpy = sinon.spy(LeftSidebarView.prototype, 'onServerRightClick');
            onEditServerClickSpy = sinon.spy(LeftSidebarView.prototype, 'onEditServerClick');
            onRemoveServerClickSpy = sinon.spy(LeftSidebarView.prototype, 'onRemoveServerClick');
            contextShowSpy = sinon.spy(ContextMenu, 'show');

            leftSidebar = new LeftSidebarView({collection: serversCollection});
            modalShowSpy = sinon.spy(leftSidebar.App, 'showModal');
            leftSidebar.render();
        });

        afterEach(function() {
            listAddSpy.restore();
            listRemoveSpy.restore();
            listRightClickSpy.restore();
            modalShowSpy.restore();
            onEditServerClickSpy.restore();
            onRemoveServerClickSpy.restore();
            contextShowSpy.restore();
            leftSidebar.close();
        });

        describe('initialize', function() {
            it('should set contextMenu', function() {
                (leftSidebar.contextMenu).should.exist;
            });

            it('should have a ServerList collection', function() {
                (leftSidebar.collection).should.be.an.instanceof(ServerListCollection);
            });
        });

        describe('render', function() {
            it('should show the name of servers in the server list collection', function() {
                (leftSidebar.$('span').first().text()).should.equal('Web Server');
            });
        });

        describe('onServerRightClick', function() {
            beforeEach(function() {
                leftSidebar.$('li').first().trigger({type: 'contextmenu', clientX: 100, clientY: 100});
            });

            it('displays the contextmenu when right clicking a server in the list', function() {
                (listRightClickSpy).should.have.been.called;
            });

            it('clicking edit server in the contextmenu calls onEditServerClick', function() {
                $(".server-list-contextmenu menuitem[label='Edit Server']").first().trigger({type: 'click'});
                (onEditServerClickSpy).should.have.been.called;
                (modalShowSpy).should.have.been.called;
                (modalShowSpy.args[0][0]).should.be.an.instanceof(AddEditServerModal);
                leftSidebar.App.closeModal();
            });

            it('clicking remove server in the contextmenu calls onRemoveServerClick', function() {
                $(".server-list-contextmenu menuitem[label='Remove Server']").first().trigger({type: 'click'});
                (onRemoveServerClickSpy).should.have.been.called;
                (modalShowSpy).should.have.been.called;
                (modalShowSpy.args[0][0]).should.be.an.instanceof(RemoveServerModal);
                leftSidebar.App.closeModal();
            });
        });

    });
});