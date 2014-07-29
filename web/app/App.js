define(['jquery',
        'underscore',
        'marionette',
        'views/modal/AddEditServer',
        'views/MainFooterbar',
        'views/MainToolbar',
        'models/User',
        'models/Server',
        'collections/ServerList',
        'modules/NoobTourModule'], function (
        $,
        _,
        Marionette,
        AddEditServerModal,
        MainFooterbar,
        MainToolbar,
        User,
        Server,
        ServerList,
        NoobTourModule) {


    var ModalBackdrop = Marionette.ItemView.extend({template: function() { return '<div class="modal-backdrop in"></div>'; }});
    var Application = Marionette.Application.extend({
        VERSION: '0.9.4',
        loggers: {},

        _appToolbars: function() {
            var toolbarView = new MainToolbar({App:this}),
                footerbarView = new MainFooterbar({App:this});

            this.mainToolbar.show(toolbarView);
            toolbarView.on('server:add:click', _.bind(function(eventObj) {
                this.execute('modal:show', new AddEditServerModal({operationLabel:'Add', App:this}));
            }, this));


            this.mainFooterbar.show(footerbarView);
            footerbarView.on('server:add:click', _.bind(function() {
                this.execute('noobtour:deactivate');
                this.execute('modal:show', new AddEditServerModal({operationLabel:'Add', App:this}));
            }, this));
        },

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

    App.addInitializer(function(options) {
        this.module("NoobTourModule", NoobTourModule);
        this.vent.on('session:expired', this.onSessionExpired, this);
        this.commands.setHandler('noobtour:activate', this.NoobTourModule.activate, this.NoobTourModule);
        this.commands.setHandler('noobtour:deactivate', this.NoobTourModule.deactivate, this.NoobTourModule);
        this.commands.setHandler("modal:close", this.closeModal, this);
        this.commands.setHandler("modal:show", this.showModal, this);

        var user = new User();
        this.user = function() { return user; };
        this.setActiveServer(new Server()); // place holder for the server we're currently connected to

        this.routers = {};
        this.servers = new ServerList();
        this._appToolbars();

        this.servers.fetch({success: _.bind(function() {
            if(this.servers.length === 0) {
                this.execute('noobtour:activate');
            }
        }, this)});

        this.servers.on('remove', function(serverModel, serversCollection, options) {
            if(serversCollection.length === 0) {
                this.execute('noobtour:activate');
            }
        }, this);


    });

    return App;
});