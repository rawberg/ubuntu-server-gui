define(['jquery',
        'underscore',
        'marionette'], function(
        $,
        _,
        Marionette,
        directoryExplorerTpl,
        directoryItemTpl) {

    var DirectoryBreadcrumbItemView = Marionette.ItemView.extend({
        template: _.template('<span class="crumb"></span>'),
        tagName: 'li',

        triggers: {
            'click .crumb': 'crumb:click'
        },

        bindings: {
            '.crumb': 'crumb'
        },

        onRender: function() {
            this.stickit();
        }
    });

    return Marionette.CollectionView.extend({
        tagName: 'ol',
        className: 'breadcrumb',
        itemView: DirectoryBreadcrumbItemView,

        initialize: function(options) {
            this.on('itemview:crumb:click', _.bind(this.onCrumbClick, this));
        },

        onCrumbClick: function(itemView) {
            var pathCrumb = itemView.model.get('path');
            this.options.directoryExplorer.set('path', pathCrumb);
        }
    });
});