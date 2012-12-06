define(function (require) {
    var $ = require('jquery'),
        Backbone = require('backbone'),
        Marionette = require('marionette'),
        User = require('models/User');

    var App = new Marionette.Application();

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
        this.ioConfig = {
          'transports': ['websocket'],
          'max reconnection attempts': 2,
          'reconnect': false,
          'try multiple transports': false
        };
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