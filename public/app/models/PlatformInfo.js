define([
    'underscore',
    'backbone',
    'socket_io',
    'App'],
    function(_, Backbone, io, App) {

        return Backbone.Model.extend({

            remote: true,
            defaults: {
                'codename': '',
                'release': '',
                'kernel': ''
            },

            initialize: function(attributes, options) {
                this.server = (options && options.server) ? options.server : null;
                this.getAuthToken = _.bind(this.getAuthToken, this);
                this.parse = _.bind(this.parse, this);
                this.ws = io.connect(this.url(), App.ioConfig);
                this.ws.on('os-platform', this.parse);
                this.fetch();

                this.ws.on('error', _.bind(function(errorMsg) {
                    if (errorMsg === 'handshake error') {
                        this.getAuthToken();
                    }
                }, this));
            },

            fetch: function() {
                this.ws.emit('os-platform');
            },

            connectAndFetch: function() {
            },

            parse: function(platformInfo) {
                platformInfo.codename = platformInfo.codename.charAt(0).toUpperCase() + platformInfo.codename.slice(1);
                this.set(platformInfo);
            },

            getAuthToken: function() {
                var that = this;
                $.ajax({
                    url: 'https://' + this.server.get('ipv4') + ':' + this.server.get('port') + '/authtoken',
                    type: 'GET',
                    success: function() {
                        that.ws.disconnect();
                        that.ws = io.connect(_this.url, App.ioConfig);
                        that.ws.on('error', function(errorMsg) {
                            console.log('error inside onError');
                            console.dir(arguments);
                            that.ws.on('os-platform', that.parse);
                            that.ws.emit('os-platform');
                        });
                    }
                });
            },

            url: function() {
                return 'https://' + this.server.get('ipv4') + ':' + this.server.get('port') + '/dash';
            }
        });
    }
);
