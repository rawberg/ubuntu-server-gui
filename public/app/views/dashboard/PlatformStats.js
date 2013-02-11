define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        ModelBinder = require('backbone_modelbinder'),
        platformStatsTpl = require('text!views/dashboard/templates/platform-stats.html');

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