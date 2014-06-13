define(['jquery',
        'underscore',
        'marionette',
        'text!views/dashboard/templates/running-services.html'], function (
        $,
        _,
        Marionette,
        runningServicesTpl) {

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