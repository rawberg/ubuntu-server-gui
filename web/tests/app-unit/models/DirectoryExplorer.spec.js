define(function (require_browser) {
    var DirectoryExplorer = require_browser('models/DirectoryExplorer').DirectoryExplorer;


    describe('DirectoryExplorer - Model', function() {
        describe('appendPath', function() {
            var directoryExplorer;

            beforeEach(function() {
                directoryExplorer = new DirectoryExplorer();
            });

            it('adds pathExtension to existing path', function() {
                expect(directoryExplorer.get('path')).toBe('/');
                directoryExplorer.appendPath('home');
                expect(directoryExplorer.get('path')).toBe('/home/');
            });

            it('does not add an empty pathExtension', function() {
                expect(directoryExplorer.get('path')).toBe('/');
                directoryExplorer.appendPath('');
                expect(directoryExplorer.get('path')).toBe('/');
            });

            it('only allows a string to be appended to path', function() {
                expect(directoryExplorer.get('path')).toBe('/');
                directoryExplorer.appendPath(undefined);
                expect(directoryExplorer.get('path')).toBe('/');
                directoryExplorer.appendPath(88);
                expect(directoryExplorer.get('path')).toBe('/');
                directoryExplorer.appendPath(null);
                expect(directoryExplorer.get('path')).toBe('/');
            });

        });
    });
});