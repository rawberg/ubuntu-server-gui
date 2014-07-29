define(['jquery',
        'underscore',
        'marionette',
        'views/modal/NoobTourPopover'], function (
        $,
        _,
        Marionette,
        NoobTourPopover) {

    return Marionette.Module.extend({
        startWithParent: true,

        activate: function() {
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
            this.app.popoverContainer.show(noobTourPopover);
        },

        onNoobTourResize: function() {
            if($('footer').length) {
                var topCoord = $('footer').position().top - 78;
                $('.noobtour-backdrop.footer-minus-add-server').css({top: topCoord});
                $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
            }
        },

        deactivate: function() {
            $('.noobtour-backdrop').off('click').remove();
            this.app.closePopover();
        },
    });
});
