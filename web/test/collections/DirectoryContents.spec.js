define(function (require_browser) {
    var App = require_browser('App'),
        DirectoryContents = require_browser('collections/DirectoryContents');

    describe('DirectoryContents - Collection', function() {

        describe('fetch', function() {
            var directoryContents;

            beforeEach(function() {
                sftpOpenDirSpy = sinon.stub(DirectoryContents.prototype, 'sftpOpenDir');
                directoryContents = new DirectoryContents();
            });

            afterEach(function() {
                sftpOpenDirSpy.restore();
                directoryContents.reset([], {silent: true});
            });

            xit('should call sftpOpenDir', function() {
                directoryContents.fetch();
                (sftpOpenDirSpy).should.have.been.called;
            });

        });
    });
});