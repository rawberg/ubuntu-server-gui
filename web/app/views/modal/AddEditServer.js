define(function (require_browser) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        ModelBinder = require_browser('backbone_modelbinder'),
        App = require_browser('App'),
        Server = require_browser('models/Server'),
        BaseForm = require_browser('views/BaseForm'),
        addEditServerTpl = require_browser('text!views/modal/templates/add-edit-server.html');

    require_browser('bootstrap_modal');
    /**
     * @params {model: Server}
     */
    return BaseForm.extend({

        tagName: 'div',
        id: 'modal_add_server',
        className: 'modal',
        template: _.template(addEditServerTpl),

        events: {
            'click #add_server_btn': 'onSubmit',
            'keyup input': 'onInputKeyup'
        },

        templateHelpers: function() {
            return {operationLabel: this.options.operationLabel ? this.options.operationLabel : 'Add'}
        },

        initialize: function(options) {
            this.App = options && options.App ? options.App : App;
            this.model = options && options.model ? options.model : new Server();
            this.modelBinder = new ModelBinder();
        },

        onSubmit: function(eventObj) {
            eventObj.stopPropagation();
            eventObj.preventDefault();
            eventObj.returnValue = false;

            this.hideError();
            this.disableForm();
            this.model.save();
            this.App.vent.trigger('server:new-server-added', {
                server: this.model,
                connect: false       // Todo: add form field/button to select "save and connect"
            });

            this.modelBinder.unbind();
            this.App.closeModal();
        },

        onInputKeyup: function(eventObj) {
            eventObj.stopPropagation();
            eventObj.preventDefault();
            eventObj.returnValue = false;
            if (eventObj.keyCode === 13) {
                this.onSubmit(eventObj);
            }
            return false;
        },

        onAddServerError: function() {
            this.showError(this.model.get('errorMsg'));
        },

        onRender: function() {
            this.clearForm();
            this.enableForm();
            this.modelBinder.bind(this.model, this.el);
        },

        showError: function(msg) {
            this.enableForm();
            $('#error_alert').text(msg).show();
        }
    });
});
