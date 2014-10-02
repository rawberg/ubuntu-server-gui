define(["jquery",
        "underscore",
        "marionette",
        "App",
        "collections/NetServices",
        "models/PlatformInfo",
        "models/ServerOverview",
        "views/dashboard/PlatformStats",
        "views/dashboard/RunningServices",
        "views/dashboard/UtilizationStats",
        "text!views/dashboard/templates/layout.html"], function (
        $,
        _,
        Marionette,
        App,
        // Models & Collections
        NetServices,
        PlatformInfo,
        // Views
        ServerOverview,
        PlatformStatsView,
        RunningServicesView,
        UtilizationStatsView,
        dashboardLayoutTpl) {

    return Marionette.LayoutView.extend({
        template: _.template(dashboardLayoutTpl),
        id: "dashboard_layout",

        regions: {
            performanceRegion: "#dash_performance",
            platformRegion: "#dash_platform"
        },

        initialize: function(options) {
            App.serverChannel.vent.on("reconnect", this.onActiveServerChange, this);
            App.serverChannel.vent.on("connected", this.onActiveServerChange, this);
            App.serverChannel.vent.on("disconnected", this.onActiveServerDisconnected, this);
        },

        onDestroy: function() {
            App.serverChannel.vent.off("reconnect", this.onActiveServerChange);
            App.serverChannel.vent.off("connected", this.onActiveServerChange);
            App.serverChannel.vent.off("disconnected", this.onActiveServerDisconnected);
        },

        onRender: function() {
            this.onActiveServerChange(this.options.server);
        },

        onActiveServerChange: function(server) {
            if(server.isConnected()) {
                this.showMonitoring(server);
            }
            this.options.server = server;
        },

        onActiveServerDisconnected: function(server) {
            this.regionManager.emptyRegions();
        },

        showMonitoring: function(serverModel) {
            var platformStatsView = new PlatformStatsView({
                model: new PlatformInfo({}, {server: serverModel})
            });

            var utilizationView = new UtilizationStatsView({
                model: new ServerOverview({}, {server: serverModel})
            });

            this.platformRegion.show(platformStatsView);
            this.performanceRegion.show(utilizationView);
        },
    });
});
