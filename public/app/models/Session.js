define(function (require) {
    var Backbone = require('backbone');

    return Backbone.Model.extend({
        url: 'https://cloud.ubuntuservergui.com/sessions/',
        remote: true,
        defaults: {
            'active': false,
            'attemptedRoute': undefined
        },

        initialize: function() {
            this.on('change:active', this.onStatusChange);
        },

        onStatusChange: function(session, active) {
            if(active === false) {
                this.set('attemptedRoute', Backbone.history.getFragment());
                Backbone.history.navigate('auth/login', {trigger: true});
            } else if(active === true && this.get('attemptedRoute')) {
                Backbone.history.navigate(this.get('attemptedRoute'), {trigger: true});
                this.set('attemptedRoute', undefined);
            } else {
                Backbone.history.navigate('/', {trigger: true});
                this.set('attemptedRoute', undefined);
            }
        },

        parse: function(response, jqXHR) {
            return {active: response.success};
        }
    });
});
