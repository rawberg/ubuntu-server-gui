define(function (require_browser) {
    var Backbone = require_browser('backbone'),
        App = require_browser('App');

    require_browser('socket_io');

    return Backbone.Model.extend({
        initialize: function(attributes, options) {
            if(typeof options.server === "undefined") {
                throw "Expected server to be provided.";
            }
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
            App.sshProxy = new SshConnection();

            App.sshProxy.on('ready', function() {
                App.sshProxy.exec('uname -a', function(err, stream) {
                    if (err) {
                        throw err;
                    }

                    stream.on('data', function(data, extended) {
                        console.log((extended === 'stderr' ? 'STDERR: \n' : 'STDOUT: \n')
                            + data);
                    });

                    stream.close();
                });
            });

            App.sshProxy.on('error', function(err) {
                console.log('Connection :: error :: ' + err);
            });

            App.sshProxy.on('end', function() {
                console.log('Connection :: end');
            });

            App.sshProxy.on('close', function(had_error) {
                console.log('Connection :: close');
            });

            App.sshProxy.connect({
                host: this.options.server.get('host'),
                port: this.options.server.get('port'),
                username: 'stdissue',
                password: 'devbox99'
            });
        },

        initiateRemoteProxy: function(serverConnection) {
            debugger;
//            var ws = window.ws = this.ws = io.connect(server.url()+'/dash', App.ioConfig);
//            ws.on('connect', _.bind(function() {
//                serverConnection.set('connection_status', 'connected');
//                App.vent.trigger('server:connected', this);
//            }, this));
//            // Not very DRY, socket.io doesn't seem to support binding multiple events at once
//            ws.on('connect_failed', function() {
//                serverConnection.set('connection_status', 'connection error');
//            });
//            ws.on('error', function() {
//                serverConnection.set('connection_status', 'connection error');
//            });
//            ws.on('reconnect_error', function() {
//                serverConnection.set('connection_status', 'connection error');
//            });
//            ws.on('reconnect_failed', function() {
//                serverConnection.set('connection_status', 'connection error');
//            });
        }

    });
});
