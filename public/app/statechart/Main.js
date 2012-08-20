define([
  'jquery',
  'underscore',
  'backbone',
  'collection/ServerList',
  'statechart/Statechart',
  'domReady!',
  'view/Header',
  'view/LeftSidebar'
  
  ], function($, _, Backbone, ServerListCollection, Statechart, Doc, Header, LeftSidebar) {
        
        Statechart.addState('main', {
            
            enterState: function() {
                var me = this,
                header = me.statechart.views.header = new Header(),
                leftSidebar = me.statechart.views.leftSidebar = new LeftSidebar({renderTarget:'#viewport'});

                var serverList = me.statechart.collections.serverList = new ServerListCollection();
                serverList.on('reset', function() {
                    leftSidebar.render.apply(leftSidebar, arguments);
                });

                serverList.fetch();

                header.render({renderTarget:'body'});
            },
            
            exitState: function() {
                console.log('exiting main state');
            },

            refreshServerList: function() {
                console.log('refersh server list');
                var me = this;
                me.statechart.collections.serverList.fetch();
            }
        });
        
        return Statechart;
        
});