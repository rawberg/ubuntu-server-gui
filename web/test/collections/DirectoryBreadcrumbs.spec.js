define(function (require_browser) {
    var App = require_browser('App'),
        DirectoryExplorer = require_browser('models/DirectoryExplorer').DirectoryExplorer,
        DirectoryBreadcrumbs = require_browser('models/DirectoryExplorer').DirectoryBreadcrumbs;


    describe('DirectoryBreadcrumbs - Collection', function() {

        describe('fetch', function() {
            // set up the async spec
            var async = new AsyncSpec(this);
            var directoryExplorer, directoryBreadcrumbs;

            beforeEach(function() {
                directoryExplorer = new DirectoryExplorer();
            });

            it('throws an error is directoryExplorer is not provided', function() {
                var execptSpy = sinon.spy(DirectoryBreadcrumbs.prototype, 'initialize');
                try {
                    directoryBreadcrumbs = new DirectoryBreadcrumbs();
                } catch(e) {
                    sinon.assert.threw(execptSpy);
                }
                sinon.assert.threw(execptSpy);
            });

            async.it('builds initial breadcrumb trail when path is 1 level', function(done) {
                directoryBreadcrumbs = new DirectoryBreadcrumbs([], {directoryExplorer: directoryExplorer});
                directoryBreadcrumbs.fetch({reset: true, success: function() {
                    expect(directoryBreadcrumbs.length).to.equal(1);
                    expect(directoryBreadcrumbs.models[0].get('crumb')).to.equal('/');
                    expect(directoryBreadcrumbs.models[0].get('path')).to.equal('/');
                    done();
                }});
            });

            async.it('builds initial breadcrumb trail when path is n+1 levels', function(done) {
                directoryExplorer.set('path', '/home/long/way/to/go');
                directoryBreadcrumbs = new DirectoryBreadcrumbs([], {directoryExplorer: directoryExplorer});
                directoryBreadcrumbs.fetch({reset: true, success: function() {
                    expect(directoryBreadcrumbs.length).to.equal(6);
                    expect(directoryBreadcrumbs.models[0].get('crumb')).to.equal('/');
                    expect(directoryBreadcrumbs.models[0].get('path')).to.equal('/');
                    expect(directoryBreadcrumbs.models[1].get('crumb')).to.equal('home');
                    expect(directoryBreadcrumbs.models[1].get('path')).to.equal('/home/');
                    expect(directoryBreadcrumbs.models[3].get('crumb')).to.equal('way');
                    expect(directoryBreadcrumbs.models[3].get('path')).to.equal('/home/long/way/');
                    done();
                }});

            });

        });

        describe('onChangePath', function() {
            var async = new AsyncSpec(this);
            var directoryExplorer, directoryBreadcrumbs, fetchSpy;

            beforeEach(function() {
                directoryExplorer = new DirectoryExplorer();
            });

            it('rebuilds breadcrumb when path changes', function() {
                fetchSpy = sinon.spy(DirectoryBreadcrumbs.prototype, 'fetch');
                directoryBreadcrumbs = new DirectoryBreadcrumbs([], {directoryExplorer: directoryExplorer});
                directoryExplorer.set('path', '/hello/path');
                sinon.assert.calledOnce(fetchSpy);
            });
        });
    });
});