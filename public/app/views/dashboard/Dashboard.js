define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        dashboardLayoutTpl = require('text!views/dashboard/templates/layout.html');

    require('bootstrap_modal');
    require('bootstrap_tooltip');
    require('bootstrap_popover');

    return Marionette.Layout.extend({
        template: _.template(dashboardLayoutTpl),
        id: 'dashboard_layout',

        regions: {
            sidebarLeftRegion: '#sidebar_left',
            performanceRegion: '#dash_performance',
            servicesRegion: '#dash_services',
            platformRegion: '#dash_platform'
        },

        activateNoobTour: function() {
            $('<div class="modal-backdrop" />').appendTo(document.body).css('bottom', '24px');
            var footerCoordinates = $('#main_footerbar_container').offset();
            $('<div class="modal-backdrop" />').appendTo(document.body).css({top: String(footerCoordinates.top - 74) + 'px', bottom: '0px', left: '31px', right: '0px'});
            $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
        },

        onShow: function() {
//            this.activateNoobTour();
        }
    });
});
