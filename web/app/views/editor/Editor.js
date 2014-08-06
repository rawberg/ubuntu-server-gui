define(['jquery',
        'underscore',
        'marionette',
        'App',
        'codemirror',
        'text!views/editor/templates/editor-layout.html'], function (
        $,
        _,
        Marionette,
        App,
        codemirror,
        editorLayoutTpl) {

    return Marionette.ItemView.extend({
        template: _.template(editorLayoutTpl),
        tagName: 'div',
        id: 'editor_layout',

        ui: {
            editorRegion: '#editor-region',
        },

        bindings: {
            '.filename': {
                observe: 'fileName',
            }
        },

        triggers: {
            'click .file-close': 'close:editor',
        },

        initialize: function(options) {
            if(typeof options.fileContents === 'undefined' || typeof options.dirPath === 'undefined' || typeof options.server === 'undefined') {
                throw 'missing required options parameters';
            }

            this.model = new Backbone.Model({
                fileName: options.fileName,
                dirPath: options.dirPath,
                filePath: options.dirPath + options.fileName,
            });

            this.fileContents = options.fileContents;
            codemirror.commands.save = this.onSaveEditor;
        },

        onCloseEditor: function(cm) {
            this.ui.editorRegion.empty();
            delete this.cm;
            App.execute('app:navigate', 'filemanager', this.path);
        },

        onRender: function() {
            this.stickit();
        },

        onSaveEditor: function() {
            this.options.server.connection.writeStream(this.model.get('filePath'), this.cm.doc.getValue(), {}, function() {
                console.log('saved');
            });
        },

        onShow: function() {
            var cm = this.cm = codemirror(this.ui.editorRegion[0], {
                value: this.fileContents,
                mode: 'shell',
                theme: 'pastel-on-dark',
                lineNumbers: true,
                autofocus: true,
                extraKeys: {
                    'Cmd-W': _.bind(this.onCloseEditor, this),
                    'Cmd-S': _.bind(this.onSaveEditor, this)
                }
            });

            cm.doc.setCursor(0);
        },

        close: function() {
        }

    });
});