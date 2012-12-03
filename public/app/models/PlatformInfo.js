define([
    'underscore',
    'backbone',
    'socket_io',
    'App'],
    function(_, Backbone, io, App) {

        return Backbone.Model.extend({

            remote: true,
            url: 'http://10.0.1.13:3030/dash',
            defaults: {
                'codename': null,
                'release': null,
                'kernel': null
            },

            initialize: function() {
                this.getAuthToken = __bind(this.getAuthToken, this);
                this.parse = __bind(this.parse, this);
                this.ws = io.connect(this.url, App.ioConfig);
                this.ws.on('error', function(errorMsg) {
                    if (errorMsg === 'handshake error') {
                        _this.getAuthToken();
                    }
                    this.ws.on('os-platform', this.parse);
                    this.ws.emit('os-platform');
                });
            },

            fetch: function() {
                this.ws.emit('os-platform');
            },

            connectAndFetch: function() {
                console.log('inside connectAndFetch');
            },

            parse: function(platformInfo) {
                console.log('inside parse');
                console.dir(arguments);
                platformInfo.codename = platformInfo.codename.charAt(0).toUpperCase() + platformInfo.codename.slice(1);
                this.set(platformInfo);
            },

            getAuthToken: function() {
                var that = this;
                $.ajax({
                    url: 'http://10.0.1.13:3030/authtoken',
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
            }
        });
    }
);
