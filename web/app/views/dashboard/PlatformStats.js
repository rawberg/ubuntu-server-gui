define(function (require_browser) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        platformStatsTpl = require_browser('text!views/dashboard/templates/platform-stats.html');

    require_browser('backbone_stickit');

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