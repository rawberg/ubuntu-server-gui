define(function (require_browser, exports, module) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Backbone = require_browser('backbone'),
        Marionette = require_browser('marionette'),
        App = require_browser('App'),
        Server = require_browser('models/Server'),
        operationErrorTpl = require_browser('text!views/modal/templates/fileops-error.html');
//        operationPendingTpl = require_browser('text!views/modal/templates/server-connection-connecting.html'),

    require_browser('backbone_stickit');
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