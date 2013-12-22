define(function (require_browser) {
    var $ = require_browser('jquery'),
        Marionette = require_browser('marionette'),
        NoobTourPopover = require_browser('views/modal/NoobTourPopover'),
        User = require_browser('models/User'),
        ModalBackdrop = Marionette.ItemView.extend({template: function() { return '<div class="modal-backdrop in"></div>'; }});

    require_browser('bootstrap_tooltip');

    var Application = Marionette.Application.extend({
        getActiveServer: function() {
            if(this.activeServer !== undefined) {
                return this.activeServer;
            } else {
                return false;
            }
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
            this.modalContainer.show(noobTourPopover);
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
        },

        onSessionExpired: function() {
            // TODO: switch to the real url
            //window.location = 'https://localhost:8890/signin';
        },

        onServerSelected: function(server) {
            this.activeServer = server;
        },

        showModal: function(view) {
            $(this.modalContainer.el).show();
            this.modalContainer.show(view);
        },

        closeModal: function() {
            this.modalContainer.close();
            $(this.modalContainer.el).hide();
        }
    });

    var App = new Application();

    App.addRegions({
        mainToolbar: "#main-toolbar-container",
        mainViewport: "#viewport",
        mainFooterbar: '#main-footerbar-container',
        modalContainer: '#modal-container'
    });

    App.addInitializer(function(options) {
        var user = new User();
        this.user = function() { return user; };

        this.routers = {};
        this.activeServer = undefined; // place holder for the server we're currently connected to

        this.vent.on('server:selected', this.onServerSelected, this);
        this.vent.on('noobtour:activate', this.onNoobTourActivate, this);
        this.vent.on('noobtour:deactivate', this.onNoobTourDeactivate, this);
        this.vent.on('session:expired', this.onSessionExpired, this);
        this.vent.on('modal:close', this.closeModal, this);
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