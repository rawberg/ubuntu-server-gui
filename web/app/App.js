define(function (require_browser) {
    var $ = require_browser('jquery'),
        Marionette = require_browser('marionette'),
        NoobTourPopover = require_browser('views/modal/NoobTourPopover'),
        User = require_browser('models/User');

    require_browser('bootstrap_tooltip');
    require_browser('bootstrap_modal');

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
            $('<div class="modal-backdrop noobtour-backdrop body-minus-footer"></div>').appendTo('body');
            $('<div class="modal-backdrop noobtour-backdrop footer-minus-add-server"></div>')
                .css({top: footerPos.top - 78, bottom: 0, right: 0, height: 28})
                .appendTo('body');
            $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });

            // swallow backdrop clicks
            $('noobtour-backdrop').click(function(eventObj) {
                eventObj.preventDefault();
                eventObj.stopPropagation();
            });

            var noobTourPopover = new NoobTourPopover();
            this.modal.show(noobTourPopover);
            $(window).resize(this.onNoobTourResize);
        },

        onNoobTourResize: function() {
            if($('footer').length) {
                var topCoord = $('footer').position().top - 78;
                $('.noobtour-backdrop.footer-minus-add-server').css({top: topCoord});
                $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
            }
        },

        onNoobTourDeactivate: function() {
            this.modal.close();
            $('.noobtour-backdrop').off('click').remove();
            $(window).off('resize', this.onNoobTourResize);
        },

        onSessionExpired: function() {
            // TODO: switch to the real url
            //window.location = 'https://localhost:8890/signin';
        },

        onServerSelected: function(server) {
            this.activeServer = server;
        },

        showModal: function(view) {
            this.modal.show(view);
            this.modal.currentView.$el.modal('show')
                .on('hidden', _.bind(this.closeModal, this));
        },

        closeModal: function() {
            if(this.modal.currentView.$el.hasClass('in')) {
                this.modal.currentView.$el.modal('hide');
            }

            if(this.modal.currentView) {
                this.modal.currentView.$el.off('hidden');
            }
            this.modal.close();
        }
    });

    var App = new Application();

    App.addRegions({
        mainToolbar: "#main_toolbar_container",
        mainViewport: "#viewport",
        mainFooterbar: '#main_footerbar_container',
        modal: '#modal_container'
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

    App.start();
    return App;
});