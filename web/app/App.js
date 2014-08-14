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
        VERSION: '0.9.5',
        routers: {},
        loggers: {},

        regions: {
            mainToolbar: "#main-toolbar-container",
            mainViewport: "#viewport",
            mainFooterbar: '#main-footerbar-container',
            modalContainer: '#modal-container',
            popoverContainer: '#popover-container'
        },

        getActiveServer: function() {
            if(_.isUndefined(this.activeServer)) {
                return this.setActiveServer(new Server());
            }
            return this.activeServer;
        },

        setActiveServer: function(server) {
            if(server instanceof Server) {
                this.activeServer = server;
                this.vent.trigger('server:changed', server);
            }
            return this.activeServer;
        },

        isDesktop: function() {
            return (typeof process !== 'undefined');
        },

        showModal: function(view) {
            $(this.modalContainer.el).show();
            this.modalContainer.show(view, {forceShow: true});
        },

        closeModal: function() {
            this.modalContainer.reset();
            $(this.modalContainer.el).hide();
        },

        closePopover: function() {
            this.popoverContainer.reset();
        }
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

        this.commands.setHandler('noobtour:activate', this.NoobTourModule.activate, this.NoobTourModule);
        this.commands.setHandler('noobtour:deactivate', this.NoobTourModule.deactivate, this.NoobTourModule);
        this.commands.setHandler("modal:close", this.closeModal, this);
        this.commands.setHandler("modal:show", this.showModal, this);

        this.reqres.setHandler('server:set', this.setActiveServer, this);
        this.reqres.setHandler('server:get', this.getActiveServer, this);

        // place holder for the server we're currently connected to
        this.reqres.request('server:set', new Server());
    });

    return App;
});