define(function (require_browser, exports, module) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Backbone = require_browser('backbone');

    var DirectoryContents = module.exports.DirectoryContents = Backbone.Collection.extend({

        initialize: function(models, options) {
            this.server = (options && options.server) ? options.server : null;
            if(this.server === null) {
                throw 'server required for DirectoryContents collection.';
            }
        },

        fetch: function(options) {
            var path = (options && options.path) ? options.path : '/';
            this.server.sshProxy.usgOpendir(path, _.bind(function (err, list) {
                this.add(list);
                console.log(list);
            }, this));
        }
    });
});