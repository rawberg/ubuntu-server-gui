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
            manual_password_notice: ".form-group.manual-password",
            ssh_keypath_text: "input[name=ssh_keypath]",
            ssh_keypath_file: "input[type=file]",
            ssh_keypath_button: "button[name='change']"
        },

        events: {
            'click button[name="save"]': 'onSave',
            'click button[name="cancel"]': 'onCancel',
            'click button[name="delete"]': 'onDelete',
            'click button[name="change"]': 'onClickChangeKeypath',
            'click a.close': 'onCancel',
            'keyup input': 'onInputKeyup',
            'change input[type=file]': 'onUpdateKeypath'
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
            }
        },

        templateHelpers: function() {
            return {operationLabel: this.options.operationLabel ? this.options.operationLabel : 'Add'}
        },

        initialize: function(options) {
            this.model = options && options.model ? options.model : new Server();
            // allow keyPath to be null
            if(this.model.get('keyPath') === '' || typeof this.model.get('keyPath') === 'undefined') {
                this.setDefaultKeyPath();
            }
        },

        onCancel: function(eventObj) {
            App.execute('modal:close');
        },

        onClickChangeKeypath: function(eventObj) {
            this.ui.ssh_keypath_file.click();
        },

        onUpdateKeypath: function() {
            this.model.set('keyPath', this.ui.ssh_keypath_file.val());
        },

        onSave: function(eventObj) {
            eventObj.stopPropagation();
            eventObj.preventDefault();
            eventObj.returnValue = false;

            this.hideError();
            this.disableForm();

            if(this.model.isNew()) {
                console.log('AddEditServer trigger add:server');
                App.vent.trigger('add:server', this.model);
            } else {
                App.execute('modal:close');
            }
            this.model.save();
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

        onAddServerError: function() {
            this.showError(this.model.get('errorMsg'));
        },

        onRender: function() {
            this.clearForm();
            this.enableForm();
            this.stickit();
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
