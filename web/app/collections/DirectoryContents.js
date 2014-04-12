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
            this.directoryExplorer = (options && options.directoryExplorer) ? options.directoryExplorer : null;
            if(this.server === null || this.directoryExplorer === null) {
                throw 'server and directoryExplorer required for DirectoryContents collection.';
            }
            this.directoryExplorer.on('change:path', _.bind(this.onChangePath, this));
        },

        comparator: function(modelOne, modelTwo, otherStuff) {
            return this[this.sortProperty + 'Sort'].call(this, modelOne, modelTwo);
        },

        onChangePath: function() {
            // TODO check to make sure we can navigate to this path first
            this.fetch({reset: true});
        },

        fetch: function(options) {
            var path = this.directoryExplorer.get('path');
            this.server.sftpProxy.opendir(path, _.bind(function(err, buffer) {
                this.parseDir(err, buffer, options);
            }, this));
        },

        parseDir: function(err, buffer, options) {
            // TODO setup integration test harness to properly test this
            options = options ? options : {};
            options.listInProgress = options.listInProgress ? options.listInProgress : [];

            if(err) {
                console.log('parseDir error (continuing): ', err);
            }

            if(buffer) {
                this.server.sftpProxy.readdir(buffer, _.bind(function(err, list) {
                    if(err) {
                        console.log('readdir error: ', err);
                    } else if(list) {
                        options.listInProgress = options.listInProgress.concat(list);
                        this.parseDir(undefined, buffer, options);
                    } else {
                        if(options.reset) {
                            this.reset(options.listInProgress, _.extend(options, {parse: true, sort: true}));
                        } else {
                            this.add(options.listInProgress, _.extend(options, {parse: true, sort: true}));
                        }
                    }
                }, this));
            }
        },

        parse: function(resp, options) {
            // TODO consider achieving this result by overriding SFTP opendir config
            return _.reject(resp, function(item) {
                return item.filename === '.' || item.filename === '..';
            })
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

            this.sortDirection = options.sortDirection ? options.sortDirection : this.sortDirection;
            this.models.sort(_.bind(this.comparator, this));

            if (!options.silent) this.trigger('sort', this, options);
            return this;
        }

    });
});