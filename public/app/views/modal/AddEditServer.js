define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        ModelBinder = require('backbone_modelbinder'),
        Server = require('models/Server'),
        ServerList = require('collections/ServerList'),
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
            this.modelBinder = new ModelBinder();
            this.model = options && options.model ? options.model : new Server();
        },

        hideModal: function() {
            this.modelBinder.unbind();
            $('#modal_add_server').modal('hide');
            this.clearForm();
            this.enableForm();
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
            this.hideModal();
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
            $('#modal_add_server').modal({show: true})
                .on('hidden', _.bind(function() {
                    this.clearForm();
                    this.close();
                }, this))
                .on('shown', _.bind(function() {
                    this.modelBinder.bind(this.model, this.el);
                    $('input[type=text]:first').focus();
                }, this));
        },

        showError: function(msg) {
            this.enableForm();
            $('#error_alert').text(msg).show();
        }
    });
});
