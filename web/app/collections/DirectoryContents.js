define(function (require_browser, exports, module) {
    var Backbone = require_browser('backbone'),
        _ = require_browser('underscore');

    var Directory = Backbone.Model.extend({
        parse: function(response, options) {
            try {
                result = {
                    filename: response.filename,
                    mode: response.attrs.mode,
                    atime: response.attrs.atime,
                    mtime: response.attrs.mtime,
                    size: response.attrs.size,
                    permissions: response.attrs.permissions
                }
            }
            catch(e) {
                result = {};
            }
            return result;
        }
    });

    var DirectoryContents = module.exports.DirectoryContents = Backbone.Collection.extend({
        model: Directory,
        sortProperty: '',
        sortDirection: 'ASC',

        initialize: function(models, options) {
            this.server = (options && options.server) ? options.server : null;
            if(this.server === null) {
                throw 'server required for DirectoryContents collection.';
            }
        },

        comparator: function(modelOne, modelTwo, otherStuff) {
            return this[this.sortProperty + 'Sort'].call(this, modelOne, modelTwo);
        },

        fetch: function(options) {
            var path = (options && options.path) ? options.path : '/';
            this.server.sftpProxy.opendir(path, _.bind(this.parseDir, this));
        },

        parseDir: function(err, buffer) {
            if(err) {
                console.log('parseDir error: ', err);
            } else {
                this.server.sftpProxy.readdir(buffer, _.bind(function(err, list) {
                    if(err) {
                        console.log('readdir error: ', err);
                    } else if(list) {
                        this.add(list, {parse: true, sort: false});
                        this.parseDir(buffer);
                    }
                }, this));
            }
        },

        filenameSort: function(modelOne, modelTwo) {
            if(this.sortDirection === 'ASC') {
                return (modelOne.get('filename')) > (modelTwo.get('filename')) ? 1 : -1;
            } else {
                return (modelOne.get('filename')) < (modelTwo.get('filename')) ? 1 : -1;
            }
        },

        mtimeSort: function(modelOne, modelTwo) {
            if (this.sortDirection === 'ASC') {
                return (modelOne.get('mtime')) > (modelTwo.get('mtime')) ? 1 : -1;
            } else {
                return (modelOne.get('mtime')) < (modelTwo.get('mtime')) ? 1 : -1;
            }
        },

        sizeSort: function(modelOne, modelTwo) {
            if (this.sortDirection === 'ASC') {
                return (modelOne.get('size')) > (modelTwo.get('size')) ? 1 : -1;
            } else {
                return (modelOne.get('size')) < (modelTwo.get('size')) ? 1 : -1;
            }
        },

        sort: function (options) {
            if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
            options || (options = {});

            var currentSortProperty = this.sortProperty;
            this.sortProperty = options.sortProperty ? options.sortProperty : 'filename';

            if (currentSortProperty === this.sortProperty) {
                this.sortDirection = (this.sortDirection === 'DSC') ? 'ASC': 'DSC';
            } else {
                this.sortDirection = 'ASC';
            }

            this.sortDirection = options.sortDirection ? options.sortDirection : this.sortDirection;
            this.models.sort(_.bind(this.comparator, this));

            if (!options.silent) this.trigger('sort', this, options);
            return this;
        }

    });
});