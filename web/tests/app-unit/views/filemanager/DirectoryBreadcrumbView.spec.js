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
                setPathSpy = spyOn(directoryExplorerModel, 'set');

                directoryBreadcrumbs = new DirectoryBreadcrumbs([], {directoryExplorer: directoryExplorerModel});
                directoryBreadcrumbView = new DirectoryBreadcrumbView({collection: directoryBreadcrumbs, directoryExplorer: directoryExplorerModel});
                directoryBreadcrumbView.render();
                directoryBreadcrumbs.fetch();
            });

            afterEach(function() {
                directoryBreadcrumbView.close();
            });

            it('calls directoryExplorer.set("path") when a crumb is clicked', function() {
                var homeCrumb = directoryBreadcrumbs.models[1];
                var pathStub = jasmine.createSpy();
                mockClickedCrumbObj = {model: homeCrumb};

                expect(setPathSpy).not.toHaveBeenCalled();
                directoryBreadcrumbView.onCrumbClick(mockClickedCrumbObj);
                expect(setPathSpy).toHaveBeenCalledWith('path', homeCrumb.get('path'));
            });

        });
    });
});