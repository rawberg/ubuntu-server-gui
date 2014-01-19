define(function (require_browser) {
    var DirectoryExplorer = require_browser('models/DirectoryExplorer');


    describe('DirectoryExplorer - Model', function() {
        // set up the async spec
        var async = new AsyncSpec(this);

        describe('buildBreadcrumb', function() {
            var directoryExplorer;

            beforeEach(function() {
                directoryExplorer = new DirectoryExplorer();
            });

            it('breadcrumb gets rebuilt when path changes', function() {
                expect(directoryExplorer.get('breadcrumb')).to.equal('/');
                directoryExplorer.set('path', '/home/users/home_folder/sub-folder/');
                expect(directoryExplorer.get('breadcrumb')).to.equal('/ &gt; home &gt; users &gt; home_folder &gt; sub-folder');
            });

        });
    });
});