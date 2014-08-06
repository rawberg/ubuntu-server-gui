define(function (requirejs) {
    var App = requirejs('App'),
        DirectoryExplorer = requirejs('models/DirectoryExplorer'),
        DirectoryBreadcrumbs = requirejs('collections/DirectoryBreadcrumbs');


    describe('DirectoryBreadcrumbs - Collection', function() {

        describe('fetch', function() {
            var directoryExplorer, directoryBreadcrumbs;

            beforeEach(function() {
                directoryExplorer = new DirectoryExplorer();
            });

            it('throws an error is directoryExplorer is not provided', function() {
                var exceptSpy = spyOn(DirectoryBreadcrumbs.prototype, 'initialize');
                try {
                    directoryBreadcrumbs = new DirectoryBreadcrumbs();
                } catch(e) {
                    expect(exceptSpy).toHaveBeenCalled();
                }
                expect(exceptSpy).toHaveBeenCalled();
            });

            it('builds initial breadcrumb trail when path is 1 level', function(done) {
                directoryBreadcrumbs = new DirectoryBreadcrumbs([], {directoryExplorer: directoryExplorer});
                directoryBreadcrumbs.fetch({reset: true, success: function() {
                    expect(directoryBreadcrumbs.length).toBe(1);
                    expect(directoryBreadcrumbs.models[0].get('crumb')).toBe('/');
                    expect(directoryBreadcrumbs.models[0].get('path')).toBe('/');
                    done();
                }});
            });

            it('builds initial breadcrumb trail when path is n+1 levels', function(done) {
                directoryExplorer.set('path', '/home/long/way/to/go');
                directoryBreadcrumbs = new DirectoryBreadcrumbs([], {directoryExplorer: directoryExplorer});
                directoryBreadcrumbs.fetch({reset: true, success: function() {
                    expect(directoryBreadcrumbs.length).toBe(6);
                    expect(directoryBreadcrumbs.models[0].get('crumb')).toBe('/');
                    expect(directoryBreadcrumbs.models[0].get('path')).toBe('/');
                    expect(directoryBreadcrumbs.models[1].get('crumb')).toBe('home');
                    expect(directoryBreadcrumbs.models[1].get('path')).toBe('/home/');
                    expect(directoryBreadcrumbs.models[3].get('crumb')).toBe('way');
                    expect(directoryBreadcrumbs.models[3].get('path')).toBe('/home/long/way/');
                    done();
                }});

            });

        });

        describe('onChangePath', function() {
            var directoryExplorer, directoryBreadcrumbs, fetchSpy;

            beforeEach(function() {
                directoryExplorer = new DirectoryExplorer();
            });

            it('rebuilds breadcrumb when path changes', function() {
                fetchSpy = spyOn(DirectoryBreadcrumbs.prototype, 'fetch');
                directoryBreadcrumbs = new DirectoryBreadcrumbs([], {directoryExplorer: directoryExplorer});
                directoryExplorer.set('path', '/hello/path');
                expect(fetchSpy).toHaveBeenCalled();
            });
        });
    });
});