define(function (require_browser, exports, module) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Backbone = require_browser('backbone');

    return Backbone.Model.extend({
        remote: true,
        defaults: {
            'codename': '',
            'release': '',
            'kernel': ''
        },

        initialize: function(attributes, options) {
            this.server = (options && options.server) ? options.server : null;
            this.fetch();
        },

        fetch: function() {
            this.server.sshProxy.exec('lsb_release -c', {}, _.bind(function(err, stream) {
                stream.on('data', _.bind(function(data, extended) {
                    data = data.toString();
                    var codename = data.slice(1 + data.indexOf(':')).trim();
                    this.set('codename', codename.charAt(0).toUpperCase() + codename.slice(1));
                }, this));
            }, this));

            this.server.sshProxy.exec('lsb_release -d', {}, _.bind(function(err, stream) {
                stream.on('data', _.bind(function(data, extended) {
                    data = data.toString();
                    this.set('release', data.slice(1 + data.indexOf(':')).trim());
                }, this));
            }, this));
//
            this.server.sshProxy.exec('uname -r', {}, _.bind(function(err, stream) {
                stream.on('data', _.bind(function(data, extended) {
                    data = data.toString();
                    this.set('kernel', data.slice(0, data.length - 1));
                }, this));
            }, this));
        }
    });
});
