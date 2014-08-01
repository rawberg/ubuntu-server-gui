define(['jquery',
        'underscore',
        'marionette',
        'models/User',
        'models/Server',
        'modules/NoobTourModule'], function (
        $,
        _,
        Marionette,
        User,
        Server,
        NoobTourModule) {


    var ModalBackdrop = Marionette.ItemView.extend({template: function() { return '<div class="modal-backdrop in"></div>'; }});
    var Application = Marionette.Application.extend({
        VERSION: '0.9.4',
        routers: {},
        loggers: {},

        getActiveServer: function() {
            if(_.isUndefined(this.activeServer)) {
                return this.setActiveServer(new Server());
            }
            return this.activeServer;
        },

        setActiveServer: function(server) {
            if(server instanceof Server) {
                // TODO: cleanup deactivation/disconnection
                if(this.activeServer instanceof Server) {
                    // disconnect network connections
                    if(this.activeServer.sshProxy) {
                        this.activeServer.sshProxy.end();
                    }
                    if(this.activeServer.sftpProxy) {
                        this.activeServer.sftpProxy.end();
                    }
                    // remove events on current server
                    this.activeServer.off();
                    this.activeServer.stopListening();
                }
                this.activeServer = server;
                this.vent.trigger('active-server:changed', server);
            }
            return this.activeServer;
        },

        isDesktop: function() {
            return (typeof process !== 'undefined');
        },

        showModal: function(view) {
            $(this.modalContainer.el).show();
            this.modalContainer.show(view);
        },

        closeModal: function() {
            this.modalContainer.close();
            $(this.modalContainer.el).hide();
        },

        closePopover: function() {
            this.popoverContainer.close();
        }
    });

    var App = new Application();

    App.addRegions({
        mainToolbar: "#main-toolbar-container",
        mainViewport: "#viewport",
        mainFooterbar: '#main-footerbar-container',
        modalContainer: '#modal-container',
        popoverContainer: '#popover-container'
    });

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

        this.commands.setHandler('noobtour:activate', this.NoobTourModule.activate, this.NoobTourModule);
        this.commands.setHandler('noobtour:deactivate', this.NoobTourModule.deactivate, this.NoobTourModule);
        this.commands.setHandler("modal:close", this.closeModal, this);
        this.commands.setHandler("modal:show", this.showModal, this);

        this.setActiveServer(new Server()); // place holder for the server we're currently connected to
    });

    return App;
});