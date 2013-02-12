define(['jquery', 'underscore', 'backbone', 'socket_io', 'App'],

    function($, _, Backbone, io, App) {

        return Backbone.Collection.extend({

            initialize: function(models, options) {
                this.server = (options && options.server) ? options.server : null;
                this.parse = _.bind(this.parse, this);

                this.remote = true;
                this.ws = io.connect(this.url(), App.ioConfig);
                this.ws.on('net-services', this.parse);
                this.fetch();
                setInterval(_.bind(function() {
                    this.fetch();
                }, this), 5000);

                this.ws.on('error', _.bind(function(errorMsg) {
                    console.log('connection error', arguments);
                }, this));
            },

            fetch: function(options) {
                this.ws.emit('net-services');
            },

            /**
             * @method @private
             * Formats network service names.
             * @param {String} str network service name from the server.
             * @return {String} re-formmated service name
            */
            formatService: function(str) {
                str = str.replace(/node/, 'nodeJS');
                str = str.replace(/(isc dhcp client|dhclient|dhclient3)\b/, 'DHCP Client');
                str = str.replace(/sshd/i, 'ssh');
                str = str.replace(/(db|sql|ssh|dhcp)\b/, function(txt) {
                    return txt.toUpperCase();
                });
            },

            /**
             * @method @private
             * Formats data returned from the server after fetch is called.
             * @param {Object} response JSON data from the server
             * @param {Object} [jqXHR] jQuery jqXHR
             * @return {Object} re-formmated JSON data
            */
            parse: function(response) {
                var that = this;
                var results = [];
                var vals = [];

                _.each(response.netServices, function(item, index, list) {
                    item.name = that.formatService(item.name);
                    if (vals.indexOf(item.name) === -1) {
                        results.push(item);
                    }
                    return vals.push(item.name);
                });

                return this.reset(results);
            },

            url: function() {
                return 'https://' + this.server.get('ipv4') + ':' + this.server.get('port') + '/dash';
            }

        });
    }
);
