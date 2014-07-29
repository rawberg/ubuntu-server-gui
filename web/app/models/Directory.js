define(['backbone', 'underscore'], function (Backbone, _) {

    return Backbone.Model.extend({
        parse: function(response, options) {
            try {
                result = {
                    filename: response.filename,
                    mode: response.attrs.mode,
                    atime: response.attrs.atime,
                    mtime: response.attrs.mtime,
                    size: response.attrs.size,
                    permissions: response.attrs.permissions
                }
            }
            catch(e) {
                result = {};
            }
            return result;
        }
    });
});