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
            editorRegion: '#editor-region'
        },

        events: {},

        initialize: function(options) {
            if(typeof options.fileContents === 'undefined' || typeof options.dirPath === 'undefined' || typeof options.server === 'undefined') {
                throw 'missing required options parameters';
            }

            this.fileName = options.fileName;
            this.fileContents = options.fileContents;
            this.server = options.server;
            this.dirPath = options.dirPath;
            this.controllerTriggers = options.controllerTriggers;

            codemirror.commands.save = this.onSaveEditor;
        },

        onCloseEditor: function(cm) {
            this.ui.editorRegion.empty();
            delete this.cm;
            this.controllerTriggers.execute('navigate', 'filemanager', this.path);
        },

        onSaveEditor: function() {
            var filePath = this.dirPath + this.fileName;
            this.server.connection.writeStream(filePath, this.cm.doc.getValue(), {}, function() {
                console.log('saved: ' + filePath);
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