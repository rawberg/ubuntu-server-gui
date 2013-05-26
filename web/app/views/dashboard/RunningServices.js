define(function (require_browser) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        ModelBinder = require_browser('backbone_modelbinder'),
        runningServicesTpl = require_browser('text!views/dashboard/templates/running-services.html');

    return Marionette.ItemView.extend({
        template: _.template(runningServicesTpl),
        tagName: 'div',
        className: 'services',

        collectionEvents: {
            'add': 'render',
            'remove': 'render',
            'reset': 'render'
        }
    });
});