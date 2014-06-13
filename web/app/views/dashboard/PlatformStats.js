define(['jquery',
        'underscore',
        'marionette',
        'text!views/dashboard/templates/platform-stats.html',
        'backbone_stickit'], function (
        $,
        _,
        Marionette,
        platformStatsTpl) {

    return Marionette.ItemView.extend({
        template: _.template(platformStatsTpl),
        tagName: 'div',
        className: 'software',

        bindings: {
            '[name=release]': 'release',
            '[name=codename]': 'codename',
            '[name=kernel]': 'kernel'
        },

        onRender: function() {
            this.stickit();
        }
    });
});