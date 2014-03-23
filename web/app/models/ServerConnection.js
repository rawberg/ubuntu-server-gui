define(function (require_browser) {
    var Backbone = require_browser('backbone'),
        App = require_browser('App');

    return Backbone.Model.extend({

        initialize: function(attributes, options) {
            if(typeof options.server === "undefined") {
                throw "Expected server to be provided.";
            }
            this.server = options.server

            this.connectOptions = {
//                debug: function(msg) {
//                    console.log(msg);
//                },
                host: this.server.get('ipv4'),
                port: this.server.get('port'),
                username: this.server.get('username')
            };
        },

        connect: function(options, callback) {
            options = _.isObject(options) ? options : {};
            if(typeof process === 'undefined') {
                throw 'cannot connect to a server from a web browser';
            }

            if(!_.isUndefined(options.password)) {
                this.connectOptions.password = options.password;
            }

            if((this.server.get('keyPath') !== null) || !_.isUndefined(this.connectOptions.password)) {
                this.initiateLocalProxy(callback);
            } else if(_.isUndefined(options.password)) {
                this.set('connection_status', 'password_required');
                if(_.isFunction(callback)) {
                    callback();
                }
            }
        },

        initiateLocalProxy: function(callback) {
            callback = _.isFunction(callback) ? callback : function() {};
            var SshConnection = require('ssh2');
            var sshProxy = this.sshProxy = new SshConnection();

            if(this.server.get('keyPath') !== null) {
                try {
                    this.connectOptions.privateKey = require('fs').readFileSync(this.server.get('keyPath'));
                } catch(e) {
                    this.set('connection_status', 'ssh key error');
                    callback();
                    return;
                }
            }

            try {
                sshProxy.connect(this.connectOptions);
            } catch(e) {
                this.set('connection_status', 'connection error');
                callback();
                return;
            }

            sshProxy.on('ready', _.bind(function() {
                this.server.sshProxy = sshProxy;
                this.set('connection_status', 'connected');

                // also connect via sftp
                sshProxy.sftp(_.bind(function (err, sftpConnection) {
                    this.server.sftpProxy = sftpConnection;
                    if (err) throw err;
                    sftpConnection.on('end', function () {
                        console.log('SFTP :: SFTP session closed');
                    });
                }, this));

                App.vent.trigger('server:connected', this.server);
                    callback();
            }, this));

            //TODO: find a better place or logging and error trapping
            //TODO: decide how the app will handle sshProxy errors and disconnects
            sshProxy.on('error', _.bind(function(err) {
//                console.log('SSH Connection :: error :: ', err);
                this.set('connection_status', 'connection error');
                callback();
                return;
            }, this));

            sshProxy.on('end', function() {
                App.vent.trigger('server:disconnected', this.server);
            });

            sshProxy.on('close', function(had_error) {
                App.vent.trigger('server:closed', this.server);
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
        }

    });
});
