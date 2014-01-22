define(function (require_browser, exports, module) {
    var Backbone = require_browser('backbone'),
        _ = require_browser('underscore');

    var DirectoryBreadcrumb = module.exports.DirectoryBreadcrumb = Backbone.Model.extend({
        defaults: {
            'crumb': '',
            'path': ''
        }

    });

    var DirectoryBreadcrumbs = module.exports.DirectoryBreadcrumbs = Backbone.Collection.extend({
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

    module.exports.DirectoryExplorer = Backbone.Model.extend({
        defaults: {
            'path': '/'
        },

        initialize: function(attributes, options) {

        },

        appendPath: function(pathExtension) {
            if(typeof pathExtension === 'string' && pathExtension != '') {
                var newPath = this.get('path') + pathExtension + '/';
                this.set('path', newPath);
            }
        }

    });


});
