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
            this.server.sshProxy.exec('lsb_release -c', {}, _.bind(function(data) {
                var codename = data.slice(1 + data.indexOf(':')).trim();
                this.set('codename', codename.charAt(0).toUpperCase() + codename.slice(1));
            }, this));

            this.server.sshProxy.exec('lsb_release -d', {}, _.bind(function(data) {
                this.set('release', data.slice(1 + data.indexOf(':')).trim());
            }, this));

            this.server.sshProxy.exec('uname -r', {}, _.bind(function(data) {
                this.set('kernel', data.slice(0, data.length - 1));
            }, this));
        }
    });
});
