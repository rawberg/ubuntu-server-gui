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
                appendPathSpy = spyOn(directoryExplorerModel, 'appendPath');
                directoryExplorerView = new DirectoryExplorerView({model: directoryExplorerModel});
                directoryExplorerView.render();
            });

            afterEach(function() {
                directoryExplorerView.close();
            });

            it('calls directoryExplorer.appendPath if model is a directory', function() {
                var modeStub = jasmine.createSpy();
                mockClickedDirObj = {model: {
                    get: modeStub.and.callFake(function(attr) {
                        if(attr == 'mode') {
                            return 16877;
                        } else {
                            return '';
                        }
                    })
                }};

                expect(appendPathSpy).not.toHaveBeenCalled();
                directoryExplorerView.onFilenameClick(mockClickedDirObj);
                expect(appendPathSpy).toHaveBeenCalled();
            });

            it("triggers filemanager:filename:click if model is not a directory", function() {
                var filenameClickSpy = jasmine.createSpy();
                var modeStub = jasmine.createSpy();
                mockClickedDirObj = {model: {
                    get: modeStub.and.callFake(function(attr) {
                        if(attr == 'mode') {
                            return 26977;
                        } else {
                            return '';
                        }
                    })
                }};

                directoryExplorerView.on('filemanager:file:click', filenameClickSpy);
                directoryExplorerView.onFilenameClick(mockClickedDirObj);

                expect(filenameClickSpy).toHaveBeenCalled();
                expect(appendPathSpy).not.toHaveBeenCalled();
            })
        });
    });
});