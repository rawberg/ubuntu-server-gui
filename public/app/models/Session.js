define(function (require) {
        Backbone = require('backbone');

    return Backbone.Model.extend({

        remote: true,
        defaults: {
            'active': false
        },

        parse: function(response, jqXHR) {
            var status;
            if (response.success === true) {
                status = true;
            } else {
                status = false;
            }
            return {status: status};
        }
    });
});
