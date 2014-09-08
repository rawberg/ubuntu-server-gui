define(['jquery',
        'underscore',
        'App',
        'models/Server',
        'views/BaseForm',
        'text!views/modal/templates/add-edit-server.html'], function (
        $,
        _,
        App,
        Server,
        BaseForm,
        addEditServerTpl) {

    /**
     * @params {model: Server}
     */
    return BaseForm.extend({

        tagName: 'div',
        className: 'modal-dialog modal-add-edit-server',
        template: _.template(addEditServerTpl),

        ui: {
            auth_key_checkbox: "input[name=auth_key]",
            cancel_button: "button[name='cancel']",
            cancel_delete_button: "button[name='cancel_delete']",
            confirm_delete_button: "button[name='confirm_delete']",
            request_delete_button: "button[name='request_delete']",
            manual_password_notice: ".form-group.manual-password",
            save_button: "button[name='save']",
            ssh_keypath_text: "input[name=ssh_keypath]",
            ssh_keypath_file: "input[type=file]",
            ssh_keypath_button: "button[name='change']",
        },

        events: {
            'click a.close': 'onCancel',
            'click @ui.cancel_button': 'onCancel',
            'click @ui.cancel_delete_button': 'onCancelDelete',
            'click @ui.ssh_keypath_button': 'onClickChangeKeypath',
            'click @ui.confirm_delete_button': 'onConfirmDelete',
            'click @ui.request_delete_button': 'onRequestDelete',
            'click @ui.save_button': 'onSave',
            'change input[type=file]': 'onUpdateKeypath',
            'keyup input': 'onInputKeyup',
        },

        bindings: {
            'input[name="name"]': 'name',
            'input[name="ipv4"]': 'ipv4',
            'input[name="port"]': 'port',
            'input[name="username"]': 'username',
            'input[name=ssh_keypath]': 'keyPath',
            'input[name="auth_key"]': {
                observe: 'keyPath',
                update: function($el, val, model, options) {
                    var checked = (val !== '' && typeof val !== 'undefined');
                    $el.prop('checked', checked);
                    this.ui.ssh_keypath_text.attr('disabled', !checked);
                    this.ui.ssh_keypath_button.attr('disabled', !checked);
                    this.ui.manual_password_notice.toggle(!checked);
                },
                updateModel: function(val, event, options) {
                    if(event.currentTarget.checked === false) {
                        this.model.set('keyPath', null);
                        return false;
                    } else if (val === null || val === '' || typeof val === 'undefined') {
                        this.setDefaultKeyPath();
                        return false;
                    }
                    return true;
                }
            },
            'button[name="request_delete"]': {
                observe: 'id',
                updateView: false,
                visible: function(val, options) {
                    var visibility = true;
                    if(this.model.isNew()) {
                        visibility = false;
                    }
                    return visibility;
                }
            }
        },

        templateHelpers: function() {
            return {operationLabel: this.options.operationLabel ? this.options.operationLabel : 'Add'}
        },

        initialize: function(options) {
            if(!options || !options.serverList) {
                throw 'serverList required';
            }
            this.model = options && options.model ? options.model : new Server();
            // allow keyPath to be null
            if(this.model.get('keyPath') === '' || typeof this.model.get('keyPath') === 'undefined') {
                this.setDefaultKeyPath();
            }
        },

        onAddServerError: function() {
            this.showError(this.model.get('errorMsg'));
        },

        onCancel: function(eventObj) {
            App.execute('modal:close');
        },

        onCancelDelete: function(eventOjb) {
            this.ui.request_delete_button.show();
            this.$('.confirm-delete').hide();
        },

        onClickChangeKeypath: function(eventObj) {
            this.ui.ssh_keypath_file.click();
        },

        onConfirmDelete: function(eventOjb) {
            this.model.destroy();
            App.execute('modal:close');
        },

        onInputKeyup: function(eventObj) {
            eventObj.stopPropagation();
            eventObj.preventDefault();
            eventObj.returnValue = false;
            if (eventObj.keyCode === 13) {
                this.onSave(eventObj);
            }
            return false;
        },

        onRender: function() {
            this.clearForm();
            this.enableForm();
            this.stickit();
        },

        onRequestDelete: function() {
            this.ui.request_delete_button.hide();
            this.$('.confirm-delete').show();
        },

        onSave: function(eventObj) {
            if(eventObj) {
                eventObj.stopPropagation();
                eventObj.preventDefault();
                eventObj.returnValue = false;
            }

            this.hideError();
            this.disableForm();
            this.model.save();

            if(!this.options.serverList.get(this.model.id)) {
                this.options.serverList.add(this.model);
            } else if(this.options && this.options.toolbarModel) {
                this.options.toolbarModel.trigger('change:server_id');
            }
            App.execute('modal:close');
        },

        onUpdateKeypath: function() {
            this.model.set('keyPath', this.ui.ssh_keypath_file.val());
        },

        setDefaultKeyPath: function() {
            // TODO: make this platform specific
            this.model.set('keyPath', '~/.ssh/id_rsa');
        },

        showError: function(msg) {
            this.enableForm();
            $('#error_alert').text(msg).show();
        }
    });
});
