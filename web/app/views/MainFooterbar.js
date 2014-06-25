define(['backbone',
        'underscore',
        'marionette',
        'text!views/templates/main-footerbar.html'], function (
        Backbone,
        _,
        Marionette,
        mainFooterbarTpl) {

    return Marionette.ItemView.extend({
        template: _.template(mainFooterbarTpl),
        tagName: 'footer',

        triggers: {
            'click #lsfb_btn_add_server': 'server:add:click'
        },

        initialize: function(options) {
            this.App = options.App;
        },

        templateHelpers: function() {
            return {appVersion: this.App.VERSION};
        }
    });
});
