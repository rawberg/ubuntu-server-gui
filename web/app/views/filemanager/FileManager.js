define(function (require_browser, exports, module) {
    var $ = require_browser('jquery'),
        Backbone = require_browser('backbone'),
        Marionette = require_browser('marionette'),
        App = require_browser('App'),
    // Models & Collections
        Server = require_browser('models/Server'),
        ServerConnection = require_browser('models/ServerConnection'),
    // Views
        ServerConnectionModal = require_browser('views/modal/ServerConnectionView'),

        fileManagerLayoutTpl = require_browser('text!views/filemanager/templates/layout.html');

    module.exports.FileManagerLayout = Marionette.Layout.extend({
        template: _.template(fileManagerLayoutTpl),
        id: 'file-manager-layout',

        regions: {
            sidebarLeftRegion: '#sidebar_left',
            fileManagerRegion: '#file-manager'
        },

        initialize: function(options) {
            App.vent.on('server:connected', _.bind(function(sshProxy) {
                this.showFileManager(sshProxy);
                _.delay(_.bind(App.closeModal, App), 1200);
            }, this));

            this.sidebarLeftRegion.on('show', _.bind(function(view) {
                view.on('itemview:onServerClick', _.bind(this.onServerClick, this));
            }, this));
        },

        onServerClick: function(itemView, server) {
            var serverConnection = new ServerConnection({}, {server: server});
            App.showModal(new ServerConnectionModal({model: serverConnection}));
            serverConnection.connect();
        },

        showFileManager: function(sshProxy) {
            var directoryCollection;
            sshProxy.sftp(function(err, sftp) {
                if (err) throw err;
                sftp.on('end', function() {
                    console.log('SFTP :: SFTP session closed');
                });
                sftp.opendir('/', function readdir(err, handle) {
                    if (err) throw err;
                    sftp.readdir(handle, function(err, list) {
                        if (err) throw err;
                        if (list === false) {
                            sftp.close(handle, function(err) {
                                if (err) throw err;
                                console.log('SFTP :: Handle closed');
                                sftp.end();
                            });
                            return;
                        }
                        console.dir(list);
                        readdir(undefined, handle);
                    });
                });
            });
        }
    });
});
