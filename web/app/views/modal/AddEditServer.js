define(function (require_browser) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Server = require_browser('models/Server'),
        BaseForm = require_browser('views/BaseForm'),
        addEditServerTpl = require_browser('text!views/modal/templates/add-edit-server.html');

    /**
     * @params {model: Server}
     */
    return BaseForm.extend({

        tagName: 'div',
        className: 'modal-dialog modal-add-edit-server',
        template: _.template(addEditServerTpl),

        bindings: {
            'input[name="name"]': 'name',
            'input[name="ipv4"]': 'ipv4',
            'input[name="ssh_keypath"]': 'keyPath',
            'input[name="auth_key"]': {
                observe: 'keyPath',
                update: function($el, val, model, options) {
                    var checked = (val !== null && val !== '' && typeof val !== 'undefined');
                    $el.prop('checked', checked);
                },
                updateModel: function(val, event, options) {
                    if(event.currentTarget.checked === false) {
                        this.model.set('keyPath', null);
                    } else {
                        this.setDefaultKeyPath();
                    }
                    return false;
                }
            }
        },

        events: {
            'click button[name="save"]': 'onSave',
            'click button[name="cancel"]': 'onCancel',
            'click a.close': 'onCancel',
            'keyup input': 'onInputKeyup'
        },

        ui: {
            auth_key_checkbox: "input[name=auth_key]",
            ssh_keypath: "input[name=ssh_keypath]"
        },

        templateHelpers: function() {
            return {operationLabel: this.options.operationLabel ? this.options.operationLabel : 'Add'}
        },

        initialize: function(options) {
            this.App = options && options.App ? options.App : App;
            this.model = options && options.model ? options.model : new Server();
            this.setDefaultKeyPath();
        },

        onCancel: function(eventObj) {
            this.App.execute('modal:close');
        },

        onSave: function(eventObj) {
            eventObj.stopPropagation();
            eventObj.preventDefault();
            eventObj.returnValue = false;

            this.hideError();
            this.disableForm();
            this.model.save();
            this.model = this.App.servers.add(this.model);
            this.activeServer = this.model;
            this.App.execute('modal:close');
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
            var currentPath = this.model.get('keyPath');
            if(currentPath === null || currentPath === '' || typeof currentPath === 'undefined') {
                this.model.set('keyPath', '~/.ssh/id_rsa'); // TODO: make this platform specific
            }
        },

        showError: function(msg) {
            this.enableForm();
            $('#error_alert').text(msg).show();
        }
    });
});
