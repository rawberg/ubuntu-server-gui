define(['jquery',
        'underscore',
        'backbone',
        'marionette',
        'App',
        'models/Server',
        'text!views/modal/templates/fileops-error.html',
        'backbone_stickit'], function (
        $,
        _,
        Backbone,
        Marionette,
        App,
        Server,
        operationErrorTpl) {

    /**
     * @params {}
     */
    return Marionette.ItemView.extend({
        tagName: 'div',
        template: _.template(operationErrorTpl),
        className: 'modal-dialog modal-fileops',

        events: {
            'click button[name=close]': 'onClickClose'
        },

        bindings: {
            '.modal-message': 'errorMsg',
            '.modal-title': 'title'
        },

        initialize: function(options) {
            if(typeof options.errorMsg === 'undefined' || typeof options.filePath === 'undefined') {
                throw('FileOpsNotice: missing required options errorMsg and/or filePath');
            }
            this.model = new Backbone.Model({
                title: 'File Error',
                errorMsg: options.errorMsg,
                filePath: options.filePath
            });
        },

        onClickClose: function(eventObj) {
            App.execute('modal:close');
            this.model.destroy();
        },

        onRender: function() {
            this.stickit();
        }
    });
});