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
            // TODO: test
            if(typeof options.file === 'undefined' || typeof options.path === 'undefined' || typeof options.server === 'undefined') {
                throw 'missing required options parameters';
            }
            this.server = options.server;
            this.dirPath = options.path;
            this.filePath = options.path + options.file;
            this.controllerTriggers = options.controllerTriggers;
            codemirror.commands.save = this.onSave;
        },

        onCloseEditor: function(cm) {
            this.ui.editorRegion.empty();
            delete this.cm;
            this.controllerTriggers.execute('navigate', 'filemanager', this.path);
        },

        onSave: function(cm) {
            this.server.sftpProxy.createWriteStream(this.filePath, cm.doc.getValue(), function() {
                console.log('saving complete');
            });
        },

        onShow: function() {
            var StringDecoder = require('string_decoder').StringDecoder;
            var decoder = new StringDecoder('utf8');
            var cm = this.cm = codemirror(this.ui.editorRegion[0], {
                mode: 'shell',
                theme: 'pastel-on-dark',
                lineNumbers: true,
                autofocus: true,
                extraKeys: {'Ctrl-Esc': _.bind(this.onCloseEditor, this)}
            });

            var fileStream = this.server.sftpProxy.createReadStream(this.filePath, {encoding: 'utf8'});
            fileStream.on('data', function(chunk) {
                cm.doc.replaceRange(decoder.write(chunk), {line: Infinity});
            });

            fileStream.on('end', function() {
                cm.doc.setCursor(0);
            });
        },

        close: function() {
        }

    });
});