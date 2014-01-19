define(function (require_browser) {
    var Backbone = require_browser('backbone');

    return Backbone.Model.extend({

        defaults: {
            'path': '/',
            'breadcrumb': '/'
        },

        initialize: function(attributes, options) {
            this.on('change:path', _.bind(this.buildBreadcrumb, this));
        },

        appendPath: function(pathExtension) {
            if(typeof pathExtension === 'string' && pathExtension != '') {
                var newPath = this.get('path') + pathExtension + '/';
                this.set('path', newPath);
            }
        },

        buildBreadcrumb: function() {
            var pathPieces = this.get('path').split('/');
            pathPieces.splice(1, 0, '/');
            var breadcrumb = pathPieces.join(' &gt; ');
            this.set('breadcrumb', breadcrumb.slice(6, -6));
        }

    });
});
