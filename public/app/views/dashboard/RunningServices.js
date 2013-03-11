define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        ModelBinder = require('backbone_modelbinder'),
        runningServicesTpl = require('text!views/dashboard/templates/running-services.html');

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