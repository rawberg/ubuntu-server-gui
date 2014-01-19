define(function (require_browser) {
    var DirectoryExplorer = require_browser('models/DirectoryExplorer');


    describe('DirectoryExplorer - Model', function() {
        // set up the async spec
        var async = new AsyncSpec(this);

        describe('appendPath', function() {
            var directoryExplorer;

            beforeEach(function() {
                directoryExplorer = new DirectoryExplorer();
            });

            it('adds pathExtension to existing path', function() {
                expect(directoryExplorer.get('path')).to.equal('/');
                directoryExplorer.appendPath('home');
                expect(directoryExplorer.get('path')).to.equal('/home/');
            });

            it('does not add an empty pathExtension', function() {
                expect(directoryExplorer.get('path')).to.equal('/');
                directoryExplorer.appendPath('');
                expect(directoryExplorer.get('path')).to.equal('/');
            });

            it('only allows a string to be appended to path', function() {
                expect(directoryExplorer.get('path')).to.equal('/');
                directoryExplorer.appendPath(undefined);
                expect(directoryExplorer.get('path')).to.equal('/');
                directoryExplorer.appendPath(88);
                expect(directoryExplorer.get('path')).to.equal('/');
                directoryExplorer.appendPath(null);
                expect(directoryExplorer.get('path')).to.equal('/');
            });

        });

        describe('buildBreadcrumb', function() {
            var directoryExplorer;

            beforeEach(function() {
                directoryExplorer = new DirectoryExplorer();
            });

            it('rebuilds breadcrumb when path changes', function() {
                expect(directoryExplorer.get('breadcrumb')).to.equal('/');
                directoryExplorer.set('path', '/home/users/home_folder/sub-folder/');
                expect(directoryExplorer.get('breadcrumb')).to.equal('/ &gt; home &gt; users &gt; home_folder &gt; sub-folder');
            });

        });
    });
});