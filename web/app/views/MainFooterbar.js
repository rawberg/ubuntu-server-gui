define(['underscore',
        'marionette',
        'text!views/templates/main-footerbar.html'], function (
        _,
        Marionette,
        mainFooterbarTpl) {

    return Marionette.ItemView.extend({
        template: _.template(mainFooterbarTpl),
        tagName: 'footer',

        triggers: {
            'click #lsfb_btn_add_server': 'server:add:click'
        }
    });
});
