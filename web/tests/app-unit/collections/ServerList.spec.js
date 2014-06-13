define(function (requirejs) {
    var App = requirejs('App'),
        ServerList = requirejs('collections/ServerList'),
        Server = requirejs('models/Server');

    xdescribe('ServerList - Collection', function() {

        describe('onRemove', function() {

            var onRemoveServerSpy, ventTriggerSpy,
                serverList, serverModel, footerPosStub;
            beforeEach(function() {
                footerPosStub = sinon.stub($.prototype, 'offset');
                onRemoveServerSpy = sinon.spy(ServerList.prototype, 'onRemove');
                serverList = new ServerList();
                ventTriggerSpy = sinon.spy(serverList.App.vent, 'trigger')
                serverList.add([{name: 'Server One'}, {name: 'Server Two'}]);
            });

            afterEach(function() {
                onRemoveServerSpy.restore();
                footerPosStub.restore();
                ventTriggerSpy.restore();
                serverList.reset([], {silent: true});
            });

            it('should be called when a server is removed from the collection', function() {
                serverList.pop();
                (onRemoveServerSpy).should.have.been.called;
                (ventTriggerSpy).should.not.have.been.called;
            });

            it('should be called when all servers are removed from the collection and trigger "noobtour:activate"', function() {
                footerPosStub.returns({top: 666});
                serverList.pop();
                serverList.pop();
                (onRemoveServerSpy).should.have.been.calledTwice;
                (ventTriggerSpy).should.have.been.called;
            });
        });
    });
});