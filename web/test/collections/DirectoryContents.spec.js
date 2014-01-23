define(function (require_browser) {
    var App = require_browser('App'),
        DirectoryExplorer = require_browser('models/DirectoryExplorer').DirectoryExplorer,
        DirectoryContents = require_browser('collections/DirectoryContents').DirectoryContents;


    describe('DirectoryContents - Collection', function() {
        var directoryContents, directoryExplorer, sampleData;
        var fetchSpy;

        describe('sort', function() {
            beforeEach(function() {
                var sampleData = [{
                    filename: 'one-file.jpg',
                    size: 434343,
                    mtime: 1360468126   // 2/9/2013 7:48:46 PM
                },{
                    filename: 'sample-file.png',
                    size: 100000,
                    mtime: 1366266020   // 4/17/2013 11:20:20 PM
                },{
                    filename: 'a-first-file.ini',
                    size: 444444,
                    mtime: 1378969110   // 9/11/2013 11:58:30 PM
                },{
                    filename: 'z-last-file.config',
                    size: 999999,
                    mtime: 1330970070   // 3/5/2012 9:54:30 AM
                }];
                fetchSpy = sinon.stub(DirectoryContents.prototype, 'fetch');
                directoryExplorer = new DirectoryExplorer();
                directoryContents = new DirectoryContents(sampleData, {directoryExplorer: directoryExplorer, server: {}});
            });

            afterEach(function() {
                fetchSpy.restore();
                directoryContents.reset([], {silent: true});
            });

            it('triggers onSort when data is sorted', function() {
                var sortEventSpy = sinon.spy();
                directoryContents.on('sort', sortEventSpy);

                sortEventSpy.should.not.have.been.called;
                directoryContents.sort({sortProperty: 'mtime'});
                sortEventSpy.should.have.been.called;
                (sortEventSpy.args[0][1]['sortProperty']).should.equal('mtime');
            });

            it('default sorts by filename (ASC)', function() {
                (directoryContents.first().get('filename')).should.equal('a-first-file.ini');
                (directoryContents.last().get('filename')).should.equal('z-last-file.config');
            });

            it('sort remains the same when options.sortDirection is set to the current sort direction', function() {
                (directoryContents.first().get('filename')).should.equal('a-first-file.ini');
                (directoryContents.last().get('filename')).should.equal('z-last-file.config');
                directoryContents.sort({sortDirection: directoryContents.sortDirection});
                (directoryContents.first().get('filename')).should.equal('a-first-file.ini');
                (directoryContents.last().get('filename')).should.equal('z-last-file.config');
            });

            it('sorts by file size (ASC) and (DSC) via sortDirection option', function() {
                directoryContents.sort({sortProperty: 'size'});
                (directoryContents.first().get('size')).should.equal(100000);
                (directoryContents.last().get('size')).should.equal(999999);

                var sortDirection = (directoryContents.sortDirection === 'DSC') ? 'ASC': 'DSC';
                directoryContents.sort({sortProperty: 'size', sortDirection: sortDirection});
                (directoryContents.first().get('size')).should.equal(999999);
                (directoryContents.last().get('size')).should.equal(100000);
            });

            it('sorts by modified time (ASC) and (DSC) via sortDirection option', function () {
                directoryContents.sort({sortProperty: 'mtime'});
                (directoryContents.first().get('mtime')).should.equal(1330970070);
                (directoryContents.last().get('mtime')).should.equal(1378969110);

                var sortDirection = (directoryContents.sortDirection === 'DSC') ? 'ASC': 'DSC';
                directoryContents.sort({sortProperty: 'mtime', sortDirection: sortDirection});
                (directoryContents.first().get('mtime')).should.equal(1378969110);
                (directoryContents.last().get('mtime')).should.equal(1330970070);
            });

            it('correctly toggles sort direction on repeat sorts of the same property via sortDirection option', function() {
                (directoryContents.sortDirection).should.equal('ASC');

                directoryContents.sort({sortProperty: 'mtime'});
                (directoryContents.sortDirection).should.equal('ASC');

                var sortDirection = (directoryContents.sortDirection === 'DSC') ? 'ASC': 'DSC';
                directoryContents.sort({sortProperty: 'mtime', sortDirection: sortDirection});
                (directoryContents.sortDirection).should.equal('DSC');

                var sortDirection = (directoryContents.sortDirection === 'DSC') ? 'ASC': 'DSC';
                directoryContents.sort({sortProperty: 'mtime', sortDirection: sortDirection});
                (directoryContents.sortDirection).should.equal('ASC');
            });
        });

        describe('fetch', function() {
            beforeEach(function() {
                fetchSpy = sinon.stub(DirectoryContents.prototype, 'fetch');
                directoryExplorer = new DirectoryExplorer();
                directoryContents = new DirectoryContents(sampleData, {directoryExplorer: directoryExplorer, server: {}});
            });

            afterEach(function() {
                fetchSpy.restore();
                directoryContents.reset([], {silent: true});
            });

            it('calls fetch when directoryExplorer path changes', function() {
                expect(fetchSpy.called).to.be.false;
                directoryExplorer.set('path', '/new/path/');
                expect(fetchSpy.called).to.be.true;
            });
        });
    });
});