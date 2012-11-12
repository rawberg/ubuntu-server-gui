define(['jquery', 'underscore', 'backbone', 'App', 'models/Server'],
    function($, _, Backbone, App, ServerModel) {
    /**
    * @class ServerList
    * List of servers associated with User's account
    * @extends Backbone.Collection
    */

    return Backbone.Collection.extend({
        url: 'Servers',

        initialize: function(options) {
            if (options === null) {
                options = {};
            }

            this.App = App;
            this.local = true;
            this.App.vent.on('server:new-server-added', this.addNewServer, this);
        },

        addNewServer: function(eventData) {
            this.add(eventData.server);
        }

    });
});
