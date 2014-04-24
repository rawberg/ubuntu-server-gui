define(function (require_browser) {
    var DirectoryExplorerView = require_browser('views/filemanager/FileManager').DirectoryExplorerView,
        DirectoryExplorerModel = require_browser('models/DirectoryExplorer').DirectoryExplorer;


    describe('DirectoryExplorerView', function() {
        var directoryExplorerView;

        describe('onFilenameClick', function() {
            var mockClickedDirObj, appendPathSpy;
            var directoryExplorerModel;

            beforeEach(function() {
                directoryExplorerModel = new DirectoryExplorerModel();
                appendPathSpy = sinon.spy(directoryExplorerModel, 'appendPath');
                directoryExplorerView = new DirectoryExplorerView({model: directoryExplorerModel});
                directoryExplorerView.render();
            });

            afterEach(function() {
                appendPathSpy.restore();
                directoryExplorerView.close();
            });

            it('calls directoryExplorer.appendPath if model is a directory', function() {
                var modeStub = sinon.stub();
                mockClickedDirObj = {model: {get: modeStub.withArgs('mode').returns(16877)}};

                sinon.assert.notCalled(appendPathSpy)
                directoryExplorerView.onFilenameClick(mockClickedDirObj);
                sinon.assert.calledOnce(appendPathSpy);
            });

            it("triggers filemanager:filename:click if model is not a directory", function() {
                var filenameClickSpy = sinon.spy();
                var modeStub = sinon.stub();
                mockClickedDirObj = {model: {get: modeStub.withArgs('mode').returns(26977)}};

                directoryExplorerView.on('filemanager:file:click', filenameClickSpy);
                directoryExplorerView.onFilenameClick(mockClickedDirObj);

                jasmine.getEnv().expect(filenameClickSpy.args[0].length).toBe(2);
                sinon.assert.calledOnce(filenameClickSpy);
                sinon.assert.notCalled(appendPathSpy);
            })
        });
    });
});