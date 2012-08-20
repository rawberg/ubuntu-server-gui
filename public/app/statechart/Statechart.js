define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'stativus'
  
  ], function($, _, Backbone, Router, Stativus) {

        var Statechart = Stativus.createStatechart();
        Statechart.views = {};
        Statechart.collections = {};
        
        return Statechart;
});