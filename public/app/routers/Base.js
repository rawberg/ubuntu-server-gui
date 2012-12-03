define(function (require) {
    var Marionette = require('marionette');

    return Marionette.AppRouter.extend({

        route: function(route, name, callback) {
            if(this.controller['beforeFilters'] && this.controller['beforeFilters'][name]) {
                var originalCallback = callback;
                var beforeFilterName = this.controller['beforeFilters'][name];

                callback = _.bind(function() {
                    // call beforeFilter method
                    var routeOrTrue = this.controller[beforeFilterName].apply(this.controller, arguments);
                    if (routeOrTrue !== true && typeof routeOrTrue === 'string') {
                        // chance to redirect to a different route
                        this.navigate(routeOrTrue, {trigger: true});
                        return;
                    } else if(routeOrTrue !== true) {
                        return;
                    }

                    // call regular controller method
                    originalCallback.apply( this, arguments );
                }, this);

            }
            Marionette.AppRouter.prototype.route.call(this, route, name, callback);
        }
    });
});