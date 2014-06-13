define(['jquery',
        'underscore',
        'marionette',
        'text!views/modal/templates/noob-tour-popover.html'], function (
        $,
        _,
        Marionette,
        popoverTpl) {

    return Marionette.ItemView.extend({
        template: _.template(popoverTpl),
        tagName: 'div',
        className: 'noobtour-popover popover fade top in',

        onRender: function() {
            var topCoord = $('#lsfb_btn_add_server').offset().top - 85;
            this.$el.css({top: topCoord, left: 3, display: 'block'});

            this.resizeListener = _.bind(this.onWindowResize, this);
            $(window).resize(this.resizeListener);
        },

        onWindowResize: function() {
            if($('#lsfb_btn_add_server').length) {
                var topCoord = $('#lsfb_btn_add_server').offset().top - 85;
                this.$el.css({top: topCoord});
            }
        },

        onClose: function() {
            $(window).off('resize', this.resizeListener);
        }
    });
});

