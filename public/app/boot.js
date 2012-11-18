define(function (require) {
    var $ = require('jquery'),
        Backbone = require('backbone'),
        App = require('App'),
        MainController = require('controllers/Main'),
        MainRouter = require('routers/Main');


    App.routers.main = new MainRouter({controller: new MainController()});
    App.vent.on('session:expired', function() {
        App.routers.main.navigate('auth/login', {trigger: true});
    });

    $(document).ready(function() {
        Backbone.history.start({pushState: true});
    });
});
