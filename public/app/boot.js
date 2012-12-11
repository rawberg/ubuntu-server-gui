define(function (require) {
    var $ = require('jquery'),
        Backbone = require('backbone'),
        App = require('App'),
        MainController = require('controllers/Main'),
        MainRouter = require('routers/Main');


    App.routers.main = new MainRouter({controller: new MainController()});
    App.user().session().fetch({
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        complete: function() {
            $(document).ready(function() {
                Backbone.history.start({pushState: true});
            });
        }
    });
});
