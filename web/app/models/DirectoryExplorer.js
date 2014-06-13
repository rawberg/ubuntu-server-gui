define(['backbone', 'underscore'], function (Backbone, _) {

    return Backbone.Model.extend({
        defaults: {
            'path': '/'
        },

        appendPath: function(pathExtension) {
            if(typeof pathExtension === 'string' && pathExtension != '') {
                var newPath = this.get('path') + pathExtension + '/';
                this.set('path', newPath);
            }
        }

    });


});
