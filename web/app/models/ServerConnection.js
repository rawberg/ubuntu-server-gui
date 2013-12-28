define(function (require_browser) {
    var Backbone = require_browser('backbone'),
        App = require_browser('App');

    return Backbone.Model.extend({
        initialize: function(attributes, options) {
            if(typeof options.server === "undefined") {
                throw "Expected server to be provided.";
            }
            this.options = options || {};
        },

        connect: function() {
            if(typeof process !== 'undefined') {
                return function() {
                    this.initiateLocalProxy();
                }
            } else {
                return false;
//                throw 'no available via web browser';
            }
        }(),

        initiateLocalProxy: function(callback) {
            var SshConnection = require('ssh2');
            var sshProxy = new SshConnection();

            //TODO: make username and password dynamic
            sshProxy.connect({
                host: this.options.server.get('ipv4'),
                port: this.options.server.get('port'),
                username: 'stdissue',
                password: 'devbox99'
            });

            sshProxy.on('ready', _.bind(function() {
                this.options.server.sshProxy = sshProxy;
                this.set('connection_status', 'connected');

                // also connect via sftp
                sshProxy.sftp(_.bind(function (err, sftpConnection) {
                    this.options.server.sftpProxy = sftpConnection;
                    if (err) throw err;
                    sftpConnection.on('end', function () {
                        console.log('SFTP :: SFTP session closed');
                    });
                }, this));

                App.vent.trigger('server:connected', this.options.server);
            }, this));

            //TODO: find a better place or logging and error trapping
            //TODO: decide how consumers will know sshProxy is no longer active
            sshProxy.on('error', function(err) {
                console.log('SSH Connection :: error :: ', err);
            });

            sshProxy.on('end', function() {
                console.log('SSh Connection :: end');
                App.vent.trigger('server:disconnected', this.options.server);
            });

            sshProxy.on('close', function(had_error) {
                console.log('SSH Connection :: close');
            });

            sshProxy.usgExec = function (cmd, options, callback) {
                sshProxy.exec(cmd, options, function (err, sshStream) {
                    if (err) {
                        throw err;
                    }
                    sshStream.on('data', function (data, extended) {
                        callback(data.toString());
                    });
                });
            }

            sshProxy.usgOpendir = function(path, callback) {
                sshProxy.opendir(path, function (err, handle) {
                    // TODO: add recursion for readdir
                    sshProxy.readdir(handle, function (err, list) {
                        if (err) {
                            throw err;
                        }
                        if (list === false) {
                            callback(err, list);
                        }
                        callback(err, list);
                    });
                });
            }
        }

    });
});
