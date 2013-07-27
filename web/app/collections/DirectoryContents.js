define(function (require_browser, exports, module) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette');

    return Backbone.Collection.extend({

        initialize: function(models, options) {
            this.server = (options && options.server) ? options.server : null;
        },

        fetch: function(options) {
            var path = (options && options.server) ? options.server : '/';
            this.sftpOpenDir(path);
        },

        sftpReadDir: function(handle) {
            this.server.sshProxy.sftp.readdir(handle, _.bind(function(err, list) {
                if (err) {
                    throw err;
                }
                if (list === false) {
                    this.server.sshProxy.sftp.close(handle, function(err) {
                        if (err) throw err;
                        console.log('SFTP :: Handle closed');
                        this.server.sshProxy.sftp.end();
                    });
                    return;
                }
                console.dir(list);
                console.log('adding to list...');
                this.add(list);
                this.sftpReadDir.call(undefined, handle);
            }, this));
        },

        sftpOpenDir: function(path) {
            this.server.sshProxy.sftp(_.bind(function(err, sftp) {
                if (err) throw err;
                sftp.on('end', function() {
                    console.log('SFTP :: SFTP session closed');
                });
                this.remove(); // empty the collection
                sftp.opendir(path, this.sftpReadDir);
            }, this));
        }
    });
});