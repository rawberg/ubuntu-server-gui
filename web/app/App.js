define(['jquery',
        'underscore',
        'marionette',
        'views/modal/AddEditServer',
        'views/modal/NoobTourPopover',
        'views/MainFooterbar',
        'views/MainToolbar',
        'models/User',
        'models/Server',
        'collections/ServerList'], function (
        $,
        _,
        Marionette,
        AddEditServerModal,
        NoobTourPopover,
        MainFooterbar,
        MainToolbar,
        User,
        Server,
        ServerList) {


    var ModalBackdrop = Marionette.ItemView.extend({template: function() { return '<div class="modal-backdrop in"></div>'; }});
    var Application = Marionette.Application.extend({
        VERSION: '0.9.2',

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
            if(typeof process !== 'undefined') {
                return true;
            } else {
                return false;
            }
        },

        onNoobTourActivate: function() {
            var footerPos = $('footer').position();
            $('<div class="modal-backdrop in noobtour-backdrop body-minus-footer"></div>').appendTo('body');
            $('<div class="modal-backdrop in noobtour-backdrop footer-minus-add-server"></div>').appendTo('body');

            $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
            // swallow backdrop clicks
            $('noobtour-backdrop').click(function(eventObj) {
                eventObj.preventDefault();
                eventObj.stopPropagation();
            });

            var noobTourPopover = new NoobTourPopover();
            this.popoverContainer.show(noobTourPopover);
        },

        onNoobTourResize: function() {
            if($('footer').length) {
                var topCoord = $('footer').position().top - 78;
                $('.noobtour-backdrop.footer-minus-add-server').css({top: topCoord});
                $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
            }
        },

        onNoobTourDeactivate: function() {
            $('.noobtour-backdrop').off('click').remove();
            this.closePopover();
        },

        onSessionExpired: function() {
            // TODO: switch to the real url
            //window.location = 'https://localhost:8890/signin';
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

    App.addInitializer(function(options) {
        this.vent.on('session:expired', this.onSessionExpired, this);
        this.commands.setHandler('noobtour:activate', this.onNoobTourActivate, this);
        this.commands.setHandler('noobtour:deactivate', this.onNoobTourDeactivate, this);
        this.commands.setHandler("modal:close", this.closeModal, this)
        this.commands.setHandler("modal:show", this.showModal, this)

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

    /*
    App.addInitializer(function(options) {
        var that = this;
        this.onServerError = function(originalModel, jqXHR, options) {
            if (jqXHR.status === 401) {
                that.user.session.set('active', false);
            }
        };

        this.vent.bind("server:error", this.onServerError);

        Backbone.wrapError = function(onError, originalModel, options) {
            return function(model, resp) {
                if (model === originalModel) {
                    resp = resp;
                } else {
                    resp = model;
                }
                if (onError) {
                    onError(originalModel, resp, options);
                } else {
                    originalModel.trigger('error', originalModel, resp, options);
                    that.vent.trigger('server:error', originalModel, resp, options);
                }
            };
        };

    });
    */

    App.addInitializer(function(options) {
        this.formatters = {};
        this.formatters.formatBytes = function(size) {
            if (size < 1024) {
                return size + "kb";
            } else if (size < 1048576) {
                return (Math.round(((size * 10) / 1024) / 10)) + "KB";
            } else {
                return (Math.round(((size * 10) / 1048576) / 10)) + "MB";
            }
        };

        this.formatters.toTitleCase = function(str) {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1);
            });
        };

        this.formatters.zeroPad = function(num, numZeros) {
            var n, zeroString, zeros;
            n = Math.abs(num);
            zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
            zeroString = Math.pow(10, zeros).toString().substr(1);
            if (num < 0) {
                zeroString = '-' + zeroString;
            }
            return zeroString + n;
        };
    });

    return App;
});