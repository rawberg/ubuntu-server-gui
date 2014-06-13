define(['backbone', 'underscore', 'models/DirectoryBreadcrumb'], function (Backbone, _, DirectoryBreadcrumb) {

    return Backbone.Collection.extend({
        model: DirectoryBreadcrumb,

        initialize: function(models, options) {
            this.directoryExplorer = (options && options.directoryExplorer) ? options.directoryExplorer : null;
            if(this.directoryExplorer === null) {
                throw 'directoryExplorer required for DirectoryBreadcrumbs collection.';
            }
            this.directoryExplorer.on('change:path', _.bind(this.onChangePath, this));
        },

        onChangePath: function() {
            this.fetch({reset: true, parse: false});
        },

        sync: function(syncmethod, context, options) {
            var crumbs = [{crumb: '/', path: '/'}];
            var pathPieces = this.directoryExplorer.get('path').replace(/^\/|\/$/g, '').split('/');
            var pieceCount = pathPieces.length;
            if(pathPieces[0] !== '') {  // maybe a better regex would avoid the need for this?
                for(var pcounter = 0; pcounter < pieceCount; pcounter++) {
                    crumbs.push({
                        crumb: pathPieces[pcounter],
                        path: '/' + pathPieces.slice(0, pcounter+1).join('/') + '/'
                    });
                }
            }

            options.success(crumbs);
            return crumbs;
        }
    });

});