define(function (require) {
    var _ = require('underscore'),
        Backbone = require('backbone'),
        App = require('App'),
        BaseController = require('controllers/Base'),
        DashboardLayout = require('views/dashboard/Dashboard'),
        MainToolbar = require('views/MainToolbar'),
        MainFooterbar = require('views/MainFooterbar');

    return BaseController.extend({
        initialize: function() {
            this.App = App;
            // this.beforeFilters = {
            //     dashboard: ['ensureAuthenticated']
            // };

            BaseController.prototype.initialize.apply(this, arguments);
        },

        dashboard: function() {
            var toolbar = new MainToolbar();
            var footerbar = new MainFooterbar();

            this.App.mainToolbar.show(toolbar);
            this.App.mainFooterbar.show(footerbar);
            this.App.mainViewport.show(new DashboardLayout());
        }
    });

});
