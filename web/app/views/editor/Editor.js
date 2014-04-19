define(function (require_browser, exports, module) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        App = require_browser('App'),
        codemirror = require_browser('codemirror'),

    // Templates
        editorLayoutTpl = require_browser('text!views/editor/templates/editor-layout.html');


    module.exports.EditorLayout = Marionette.Layout.extend({
        template: _.template(editorLayoutTpl),
        tagName: 'div',
        id: 'editor_layout',

        regions: {
            editorRegion: '#editor-region'
        },

        initialize: function(options) {
        },

        onShow: function() {
            codemirror(document.getElementById('editor-region'), {
                value: 'hello code mirror',
                mode: 'htmlmixed',
                theme: 'pastel-on-dark',
                lineNumbers: true,
                autofocus: true
            });
        },

        close: function() {
        }

    });
});