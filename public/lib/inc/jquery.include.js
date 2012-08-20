(function($) {
    $.fn.include = function(settings) {
        this.each(function() {
            var container = $(this);
            var pageSrc = container.attr('src');
            var dataSrc = container.attr('data');
            var target = container.attr('target');
            var action = container.attr('action');
            
            $.get(pageSrc, {}, function(markup) {
                if(typeof target !== 'undefined' && typeof action !== 'undefined' && typeof dataSrc !== 'undefined') {
                    $.getJSON(dataSrc, function(data) {
                        $(target)[action](markup);
                        container.remove();
                    });
                } else if (typeof target !== 'undefined' && typeof action !== 'undefined') {
                    $(target)[action](markup);
                    container.remove();                        
                } else if (typeof dataSrc !== 'undefined') {
                    $.getJSON(dataSrc, function(data) {
                        container.replaceWith(markup);
                    });
                } else {
                    container.replaceWith(markup);
                }
            });
        });
        return this;
    };

    $(document).ready(function() {
        var list = $('include');
        $('include').include();
    });
})(jQuery);