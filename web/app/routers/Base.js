define(['underscore',
        'backbone',
        'marionette',
        'App'], function (
        _,
        Backbone,
        Marionette,
        App) {

    return Marionette.AppRouter.extend({

        initialize: function(options) {
            App.commands.setHandler('app:navigate', this._navigate, this);
        },

        // provides a way to navigate between controller methods
        // from views without requiring global App object.
        _navigate: function() {
            var args = Array.prototype.slice.call(arguments);
            var method = args.shift();

            if (typeof(this.options.controller[method]) === 'function') {
                this.options.controller[method].apply(this.options.controller, args);
            } else {
                throw new Error('method: ' + method + ' not found on controller');
            }
        }

    });
});