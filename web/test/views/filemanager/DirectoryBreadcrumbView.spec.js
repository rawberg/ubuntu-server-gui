define(function (require_browser) {
    var DirectoryBreadcrumbView = require_browser('views/filemanager/FileManager').DirectoryBreadcrumbView,
        DirectoryBreadcrumbs = require_browser('models/DirectoryExplorer').DirectoryBreadcrumbs,
        DirectoryExplorerModel = require_browser('models/DirectoryExplorer').DirectoryExplorer;


    describe('DirectoryBreadcrumbView', function() {
        var directoryBreadcrumbView;

        describe('onCrumbClick', function() {
            var mockClickedCrumbObj, setPathSpy;
            var directoryExplorerModel;

            beforeEach(function() {
                directoryExplorerModel = new DirectoryExplorerModel({path: '/home/dir/'});
                setPathSpy = sinon.spy(directoryExplorerModel, 'set');

                directoryBreadcrumbs = new DirectoryBreadcrumbs([], {directoryExplorer: directoryExplorerModel});
                directoryBreadcrumbView = new DirectoryBreadcrumbView({collection: directoryBreadcrumbs, directoryExplorer: directoryExplorerModel});
                directoryBreadcrumbView.render();
                directoryBreadcrumbs.fetch();
            });

            afterEach(function() {
                setPathSpy.restore();
                directoryBreadcrumbView.close();
            });

            it('calls directoryExplorer.set("path") when a crumb is clicked', function() {
                var homeCrumb = directoryBreadcrumbs.models[1];
                var pathStub = sinon.stub();
                mockClickedCrumbObj = {model: homeCrumb};

                sinon.assert.notCalled(setPathSpy)
                directoryBreadcrumbView.onCrumbClick(mockClickedCrumbObj);
                sinon.assert.calledWith(setPathSpy, 'path', homeCrumb.get('path'));
            });

        });
    });
});