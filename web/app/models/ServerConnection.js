define(function (require_browser) {
    var Backbone = require_browser('backbone'),
        App = require_browser('App'),
        websocket = require_browser('websocket'),
        dnode = require_browser('dnode');

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
                return function() {
                    this.initiateRemoteProxy();
                }
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
        },

        initiateRemoteProxy: function(serverConnection) {
            //TODO: replace show url with proper url
            var wsStream = websocket('wss://localhost:8890/rox');
            var dnodeStream = dnode();

            dnodeStream.on('remote', _.bind(function (usgCloud) {
                var ip = this.options.server.get('ipv4');
                var port = this.options.server.get('port');

                usgCloud.connect(ip, port, _.bind(function() {
                    this.options.server.sshProxy = usgCloud;
                    this.options.server.sftpProxy = usgCloud; // reference to dnode
                    this.set('connection_status', 'connected');
                    App.vent.trigger('server:connected', this.options.server);
                }, this));

            }, this));

            wsStream.on('error', _.bind(function(errorEvent) {
                dnodeStream.end();
                // TODO: inspect errorEvent further to catch other cases
                this.set('connection_status', 'connection error');
                App.vent.trigger('session:expired');
            }, this));

            wsStream.on('connect', function() {
                dnodeStream.pipe(wsStream).pipe(dnodeStream);
            });

            wsStream.on('close', function() {
                console.log('websocket closed');
                dnodeStream.close();
            });

            //TODO: find a better place or logging and error trapping
            dnodeStream.on('error', function(err) {
                console.log('Cloud Connection :: error :: ' + err);
            });

            dnodeStream.on('end', _.bind(function() {
                wsStream.end();
                App.vent.trigger('server:disconnected', this.options.server);
                console.log('Cloud Connection :: end');
            }, this));

            dnodeStream.on('close', function(had_error) {
                wsStream.close();
                console.log('Cloud Connection :: close');
            });
        }

    });
});
