define(function (require_browser) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        ModelBinder = require_browser('backbone_modelbinder'),
        platformStatsTpl = require_browser('text!views/dashboard/templates/platform-stats.html');

    return Marionette.ItemView.extend({
        template: _.template(platformStatsTpl),
        tagName: 'div',
        className: 'software',

        initialize: function() {
            this._modelBinder = new ModelBinder();
        },

        onRender: function() {
            this._modelBinder.bind(this.model, this.el);
        }
    });
});