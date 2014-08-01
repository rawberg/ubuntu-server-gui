define(['underscore',
        'marionette',
        'App',
        'views/modal/AddEditServer',
        'text!views/templates/main-footerbar.html'], function (
        _,
        Marionette,
        App,
        AddEditServerModal,
        mainFooterbarTpl) {

    return Marionette.ItemView.extend({
        template: _.template(mainFooterbarTpl),
        tagName: 'footer',

        events: {
            'click .fb-feedback': 'onClickFeedback'
        },

        triggers: {
            'click #lsfb_btn_add_server': 'server:add:click'
        },

        onClickFeedback: function() {
            require('nw.gui').Shell.openExternal("https://github.com/rawberg/ubuntu-server-gui/issues");
        },

        onServerAddClick: function() {
            App.execute('noobtour:deactivate');
            App.execute('modal:show', new AddEditServerModal({operationLabel:'Add'}));
        },

        templateHelpers: function() {
            return {appVersion: App.VERSION};
        }
    });
});
