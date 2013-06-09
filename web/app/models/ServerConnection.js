define(function (require_browser) {
    var Backbone = require_browser('backbone'),
        App = require_browser('App'),
        shoe = require_browser('shoe'),
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

            sshProxy.on('ready', _.bind(function() {
                this.options.server.sshProxy = sshProxy;
                this.set('connection_status', 'connected');
                App.vent.trigger('server:connected', this.options.server);
            }, this));

            //TODO: find a better place or logging and error trapping
            sshProxy.on('error', function(err) {
                console.log('SSH Connection :: error :: ' + err);
            });

            sshProxy.on('end', function() {
                console.log('SSh Connection :: end');
            });

            sshProxy.on('close', function(had_error) {
                console.log('SSH Connection :: close');
            });

            //TODO: make username and password dynamic
            sshProxy.connect({
                host: this.options.server.get('ipv4'),
                port: this.options.server.get('port'),
                username: 'stdissue',
                password: 'devbox99'
            });
        },

        initiateRemoteProxy: function(serverConnection) {
            //TODO: replace show url with proper url
            var wsStream = shoe('http://localhost:9999/proxy');
            var dnodeStream = dnode();

            dnodeStream.on('remote', _.bind(function (usgCloud) {
                var ip = this.options.server.get('ipv4');
                var port = this.options.server.get('port');

                usgCloud.sshProxyConnect(ip, port, _.bind(function() {
                    this.options.server.sshProxy = usgCloud;
                    this.set('connection_status', 'connected');
                    App.vent.trigger('server:connected', this.options.server);
                }, this));

            }, this));
            dnodeStream.pipe(wsStream).pipe(dnodeStream);

            //TODO: find a better place or logging and error trapping
            dnodeStream.on('error', function(err) {
                console.log('Cloud Connection :: error :: ' + err);
            });

            dnodeStream.on('end', function() {
                console.log('Cloud Connection :: end');
            });

            dnodeStream.on('close', function(had_error) {
                console.log('Cloud Connection :: close');
            });
        }

    });
});
