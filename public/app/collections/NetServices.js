define(['jquery', 'underscore', 'backbone', 'socket_io', 'App'],

    function($, _, Backbone, io, App) {

        return Backbone.Collection.extend({
            url: 'http://10.0.1.13:3030/dash',

            initialize: function(options) {
                if (options === null) {
                    options = {};
                }
                this.parse = __bind(this.parse, this);

                this.remote = true;
                this.ws = io.connect(this.url, App.ioConfig);
                this.ws.on('net-services', this.parse);
            },

            fetch: function(options) {
                if (options === null) {
                    options = {};
                }
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
                    item.name = _this.formatService(item.name);
                    if (vals.indexOf(item.name) === -1) {
                        results.push(item);
                    }
                    return vals.push(item.name);
                });

                return this.reset(results);
            }

        });
    }
);
