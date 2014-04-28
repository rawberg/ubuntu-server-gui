define(function (require_browser, exports, module) {
    var $ = require_browser('jquery'),
        _ = require_browser('underscore'),
        Marionette = require_browser('marionette'),
        App = require_browser('App'),
        codemirror = require_browser('codemirror'),

    // Templates
        editorLayoutTpl = require_browser('text!views/editor/templates/editor-layout.html');


    module.exports.EditorLayout = Marionette.ItemView.extend({
        template: _.template(editorLayoutTpl),
        tagName: 'div',
        id: 'editor_layout',

        ui: {
            editorRegion: '#editor-region'
        },

        initialize: function(options) {
            codemirror.commands.save = this.onSave;
        },

        onCloseEditor: function(cm) {
            this.ui.editorRegion.empty();
            delete this.cm;
            this.options.controllerTriggers.execute('navigate', 'filemanager', this.options.path);
        },

        onSave: function(cm) {
            var fs = require('fs');
            fs.writeFile('sample.conf', cm.doc.getValue(), function() {
                console.log('saving complete');
            });
        },

        onShow: function() {
            var fs = require('fs');
            var cm = this.cm = codemirror(this.ui.editorRegion[0], {
                mode: 'shell',
                theme: 'pastel-on-dark',
                lineNumbers: true,
                autofocus: true,
                extraKeys: {'Ctrl-Esc': _.bind(this.onCloseEditor, this)}
            });

            var fileStream = fs.createReadStream('sample.conf', {encoding: 'utf8'});
            fileStream.on('data', function(chunk) {
                cm.doc.replaceRange(chunk, {line: Infinity});
            });

            fileStream.on('end', function() {
                cm.doc.setCursor(0);
            });
        },

        close: function() {
        }

    });
});