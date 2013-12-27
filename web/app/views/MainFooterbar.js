define(function (require_browser) {
    var _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        mainFooterbarTpl = require_browser('text!views/templates/main-footerbar.html');

    return Marionette.ItemView.extend({
        template: _.template(mainFooterbarTpl),
        tagName: 'footer',

        triggers: {
            'click #lsfb_btn_add_server': 'server:add:click'
        }
    });
});
