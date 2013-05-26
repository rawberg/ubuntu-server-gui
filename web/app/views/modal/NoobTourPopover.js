define(function (require_browser) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        popoverTpl = require_browser('text!views/modal/templates/noob-tour-popover.html');

    require_browser('bootstrap_tooltip');
    require_browser('bootstrap_popover');

    return Marionette.ItemView.extend({
        template: _.template(popoverTpl),
        tagName: 'div',
        className: 'noobtour-popover popover fade top in',

        onRender: function() {
            var topCoord = $('#lsfb_btn_add_server').position().top - 133;
            this.$el.css({top: topCoord, left: 2, display: 'block'});

            this.resizeListener = _.bind(this.onWindowResize, this);
            $(window).resize(this.resizeListener);
        },

        onWindowResize: function() {
            if($('#lsfb_btn_add_server').length) {
                var topCoord = $('#lsfb_btn_add_server').position().top - 133;
                this.$el.css({top: topCoord});
            }
        },

        onClose: function() {
            $(window).off('resize', this.resizeListener);
        }
    });
});

