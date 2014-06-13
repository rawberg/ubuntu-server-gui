define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {

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
            this.server.sshProxy.usgExec('lsb_release -c', {}, _.bind(function(data, extended) {
                var codename = data.slice(1 + data.indexOf(':')).trim();
                this.set('codename', codename.charAt(0).toUpperCase() + codename.slice(1));
            }, this));

            this.server.sshProxy.usgExec('lsb_release -d', {}, _.bind(function(data, extended) {
                this.set('release', data.slice(1 + data.indexOf(':')).trim());
            }, this));

            this.server.sshProxy.usgExec('uname -r', {}, _.bind(function(data, extended) {
                this.set('kernel', data.slice(0, data.length - 1));
            }, this));
        }
    });
});
