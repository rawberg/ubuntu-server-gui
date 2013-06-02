define(['jquery', 'underscore', 'backbone', 'App'],

    function($, _, Backbone, App) {

        return Backbone.Collection.extend({

            initialize: function(models, options) {
                this.server = (options && options.server) ? options.server : null;
                this.parse = _.bind(this.parse, this);

                this.remote = true;
                this.server.ws.on('net-services', this.parse);
                this.fetch();
                setInterval(_.bind(function() {
                    this.fetch();
                }, this), 5000);

            },

            fetch: function(options) {
                this.server.ws.emit('net-services');
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
                return str;
            },

            /**
             * @method @private
             * Formats data returned from the server after fetch is called.
             * @param {Object} response JSON data from the server
             * @param {Object} [jqXHR] jQuery jqXHR
             * @return {Object} re-formmated JSON data
            */
            parse: function(response, options) {
                var that = this;
                var results = [];
                var vals = [];

                _.each(response.netServices, function(item, index, list) {
                    item.name = that.formatService(item.name);
                    if (vals.indexOf(item.name) === -1) {
                        results.push(item);
                        vals.push(item.name);
                    }

                });
                this.reset(results);
                return results;
            },

            url: function() {
                return 'https://' + this.server.get('ipv4') + ':' + this.server.get('port') + '/dash/net-services';
            }

        });
    }
);
