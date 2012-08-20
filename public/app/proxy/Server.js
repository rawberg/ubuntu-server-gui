define([
  'jquery',
  'underscore',
  'backbone'
  ], function($, _, Backbone) {

    var ServerProxy = function(options) {
        var me = this;
        me._configure(options || {});
        me.initialize.apply(me, arguments);
    };
        
    _.extend(ServerProxy.prototype, Backbone.Events, {
        _configure : function(options) {
            if (this.options) {
                options = _.extend({}, this.options, options);
            }
                        
            this.options = options;
        },
        
        initialize: function(options) {
        
        },
        
        createNew: function(keyVals, callback) {
            var me = this;
            var payload = {};
                        
            $.ajax({
                url: '../ui/api/generic.php?guest_launch',
                data: payload,
                dataType: 'json',
                type: 'POST',
                success: function(data, textStatus, jqXHR) {
                    if(typeof callback !== 'undefined') {
                        callback(data);
                    }
                },
                error: function() {
                }
            });
        },

        fetchAll: function() {
            var me = this;
            $.ajax({
                url: '/app/mock-data/servers.json',
                dataType: 'json',
                success: function(data, textStatus, jqXHR) {
                    me.parseFetchAll(data);
                }
            });
        },
        
        parseFetchAll: function(data) {
            return data.servers;
        }
        
    });
});