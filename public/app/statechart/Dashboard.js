define([
  'jquery',
  'underscore',
  'backbone',
  'statechart/Statechart',
  'view/dashboard/Dashboard',
  'view/dashboard/UtilizationStats',
  'view/dashboard/RunningServices',
  'view/dashboard/SoftwareStats'
  
  ], function($,
              _,
              Backbone,
              Statechart,
              Dashboard,
              UtilizationStats,
              RunningServices,
              SoftwareStats) {
  
        var dashboardState = Statechart.addState('dashboard', {
            globalConcurrentState: 'main',
            initialSubstate: 'dashboard.main',
            views: {},
            
            enterState: function() {
                var me = this;
                                
                var dashboardView = me.views.dashboardView = new Dashboard();
                dashboardView.render({renderTarget:'#viewport', renderAction:'append'});
            },
            
            exitState: function() {

            }

        });

        dashboardState.addState('dashboard.main', {
            globalConcurrentState: 'main',
            parentState: 'dashboard',
            views: {},
            collections: {},
            proxies: {},

            enterState: function() {
              var me = this;

              var utilizationStats = me.views.utilizationStats = new UtilizationStats();
              utilizationStats.render({renderTarget:'#dashboard', renderAction:'append'});

              var runningServices = me.views.runningServices = new RunningServices();
              runningServices.render({renderTarget:'#dashboard', renderAction:'append'});

              var softwareStats = me.views.softwareStats = new SoftwareStats();
              softwareStats.render({renderTarget:'#dashboard', renderAction:'append'});

            },

            exitState: function() {
              

            }
        });
  }
);