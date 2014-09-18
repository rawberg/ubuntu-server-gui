define(['jquery',
        'underscore',
        'marionette',
        'modules/NoobTourModule',
        'models/User',
        'views/modal/ServerConnectionView'], function (
        $,
        _,
        Marionette,
        NoobTourModule,
        User,
        ServerConnectionModal) {

    var ModalBackdrop = Marionette.ItemView.extend({
        template: function() { return '<div class="modal-backdrop in"></div>'; }
    });

    var Application = Marionette.Application.extend({
        VERSION: '0.9.6',
        routers: {},
        loggers: {},

        regions: {
            mainToolbar: "#main-toolbar-container",
            mainViewport: "#viewport",
            mainFooterbar: '#main-footerbar-container',
            modalContainer: '#modal-container',
            popoverContainer: '#popover-container'
        },

        closeModal: function() {
            this.modalContainer.reset();
            $(this.modalContainer.el).hide();
        },

        closePopover: function() {
            this.popoverContainer.reset();
        },

        connectionModal: function(server) {
            this.listenTo(server.connection, 'change:connection_status', function(model, status) {
                if(status === 'connected') {
                    _.delay(_.bind(App.closeModal, App), 800);
                }
            });

            var connectionModal = new ServerConnectionModal({model: server.connection});
            this.listenTo(connectionModal, "cancel", App.closeModal, App);
            this.showModal(connectionModal);
        },

        isDesktop: function() {
            return (typeof process !== 'undefined');
        },

        showModal: function(view) {
            $(this.modalContainer.el).show();
            this.modalContainer.show(view, {forceShow: true});
        },
    });

    var App = new Application();


    // Loggers
    App.addInitializer(function() {

        // --- Rollbar initialization placeholder --- //

        this.commands.setHandler('log:error', function(options) {
            options.severity = options.severity ? options.severity : 'error';
            options.err['node-webkit'] = process.versions['node-webkit'];
            options.err['nodejs'] = process.versions['node'];
            options.err['desktop-os'] = process.platform;
            if(this.loggers.hasOwnProperty('rollbar')) {
                this.loggers.rollbar.reportMessageWithPayloadData(options.msg, {
                    level: options.severity,
                    err: options.err
                });
            } else {
                console.log('Error Log: ', options);
            }
        }, this);
    });

    // App Modules & Handlers
    App.addInitializer(function(options) {
        this.module("NoobTourModule", NoobTourModule);
        this.serverChannel = Backbone.Wreqr.radio.channel('server');
        this.serverChannel.vent.on('connection');

        this.commands.setHandler('noobtour:activate', this.NoobTourModule.activate, this.NoobTourModule);
        this.commands.setHandler('noobtour:deactivate', this.NoobTourModule.deactivate, this.NoobTourModule);
        this.commands.setHandler("modal:close", this.closeModal, this);
        this.commands.setHandler("modal:show", this.showModal, this);
    });

    return App;
});