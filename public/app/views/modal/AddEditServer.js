define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        ModelBinder = require('backbone_modelbinder'),
        App = require('App'),
        Server = require('models/Server'),
        BaseForm = require('views/BaseForm'),
        addEditServerTpl = require('text!views/modal/templates/add-edit-server.html');

    require('bootstrap_modal');

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
                server: this.model
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
