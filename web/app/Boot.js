require_browser.config({
    paths: {
        // Core Libs
        jquery: '../libs/jquery/jquery-2.0.3.min',
        underscore: '../libs/underscore/underscore',
        backbone: '../libs/backbone/backbone',
        'backbone.babysitter': '../libs/backbone.marionette/backbone.babysitter',
        'backbone.wreqr': '../libs/backbone.marionette/backbone.wreqr',
        marionette: '../libs/backbone.marionette/backbone.marionette',

        // Addons
        backbone_dualstorage: '../libs/backbone.dualstorage/backbone.dualstorage',
        backbone_modelbinder: '../libs/backbone.modelbinder/Backbone.ModelBinder',
        backbone_routefilter: '../libs/backbone.routefilter/backbone.routefilter',
        backbone_stickit: '../libs/backbone.stickit/backbone.stickit',

        // Bootstrap & jQuery Plugins
        bootstrap_tooltip: '../css/bootstrap/js/tooltip',
        bootstrap_popover: '../css/bootstrap/js/popover',
        bootstrap_transition: '../css/bootstrap/js/transition',
        gauge: '../libs/gauge.js/gauge.min',
        contextmenu: '../libs/contextmenu/contextmenu',

        // CodeMirror
        codemirror: '../libs/codemirror/lib/codemirror',

        // Misc
        text: '../libs/require/text',
        moment: '../libs/moment/moment',
        filesize: '../libs/filesize/filesize.min',

        // Testing Libs
        jasmine: '../libs/jasmine/jasmine',
        jasmine_html: '../libs/jasmine/jasmine-html',
        jasmine_console: '../libs/jasmine/jasmine-console',
        jasmine_boot: '../libs/jasmine/jasmine-boot',
        sinon: '../libs/sinon/sinon-1.7.3',
        chai: '../libs/chai/chai',
        sinon_chai: '../libs/chai/sinon-chai'
    },

    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone_stickit': {
            deps: ['jquery', 'backbone']
        },
        'backbone_dualstorage': {
            deps: ['backbone']
        },
        'bootstrap_tooltip': {
            deps: ['jquery']
        },
        'bootstrap_popover': {
            deps: ['jquery', 'bootstrap_tooltip']
        },
        'bootstrap_transition': {
            deps: ['jquery']
        },
        'jasmine': {
            exports: 'jasmine'
        },
        'jasmine_html': {
            deps: ['jasmine']
        },
        'jasmine_console': {
            deps: ['jasmine']
        },
        'jasmine_boot': {
            deps: ['jasmine']
        },
        'gauge': {
            deps: ['jquery'],
            exports: 'Donut'
        },
        'contextmenu': {
            exports: 'contextmenu'
        }
    }
});

function resetLocalStorageLoadFixtures() {
//    require('nw.gui').Window.get().showDevTools();
    var fs = require('fs'),
    Server = require_browser('models/Server');

    var server_fixtures = [];
    window.localStorage.clear();
    try {
        if(window.appintegrationtests) {
            server_fixtures = JSON.parse(fs.readFileSync('../../web/tests/fixtures/dynamic_fixtures.json'));
        } else if(window.appnodetests) {
            server_fixtures = JSON.parse(fs.readFileSync('../fixtures/dynamic_fixtures.json'));
        }
    } catch(e) {
        console.log('no fixture data was found: ('+e.message+')');
    }

    server_fixtures.forEach(function(server) {
        new Server(server).save();
    });
}

// testrunner should not automatically start the application
if(typeof(window.TESTRUNNER) === 'undefined') {
    require_browser(['jquery', 'backbone', 'App', 'controllers/Main', 'routers/Main'],
        function($, Backbone, App, MainController, MainRouter) {
            var rootPath = '/';
            var pushState = true;

            // support using Backbone router when app is loaded via file://
            if(location.pathname.indexOf('/web/index.html') !== -1) {
                rootPath = location.pathname.substring(0, location.pathname.lastIndexOf('/web/index.html')+18);
                pushState = false;
            } else if (location.pathname.indexOf('testrunner_app-int.html') !== -1) {
                rootPath = location.pathname.substring(0, location.pathname.lastIndexOf('testrunner_app-int.html')+23);
                pushState = false;
            }

            if(window.appintegrationtests) {
                process.mainModule.paths = [ '../../web/node_modules' ].concat(process.mainModule.paths);
                resetLocalStorageLoadFixtures();
            }

            App.start();
            App.routers.main = new MainRouter({controller: new MainController()});

            $(document).ready(function() {
                Backbone.history.start({pushState: pushState, root: rootPath});
            });

//            App.user().session().fetch({
//                xhrFields: {
//                    withCredentials: true
//                },
//                crossDomain: true,
//                complete: function() {
//
//                }
//            });
        }
    );
} else {
    require_browser(['jquery', 'chai', 'sinon_chai', 'sinon', 'jasmine', 'jasmine_html', 'jasmine_console', 'jasmine_boot'],
        function($, chai, sinonChai, sinon, jasmine, jasmine_html, jasmine_console, jasmine_boot) {
            $(document).ready(function() {
                // Chai
                assert = chai.assert;
                should = chai.should();
                expect = chai.expect;
                var testfiles = [];

                if(window.appunittests) {
                    testfiles = [
                        'tests/app-unit/App.spec.js',
                        // Mock Responses
    //                    'tests/app-unit/mock-responses/Sessions.response.js',
                        // Views
                        'tests/app-unit/views/MainToolbar.spec.js',
                        'tests/app-unit/views/MainFooterbar.spec.js',
                        // Views (dashboard)
                        'tests/app-unit/views/dashboard/LeftSidebar.spec.js',
                        'tests/app-unit/views/dashboard/LeftSidebarItem.spec.js',
                        'tests/app-unit/views/dashboard/Dashboard.spec.js',
                        // Views (filemanager)
                        'tests/app-unit/views/filemanager/FileManager.spec.js',
                        'tests/app-unit/views/filemanager/DirectoryExplorerView.spec.js',
                        'tests/app-unit/views/filemanager/DirectoryBreadcrumbView.spec.js',
                        // Views (login-signup)
                        'tests/app-unit/views/login-signup/LoginSignup.spec.js',
    //                    'tests/app-unit/views/login-signup/Login.spec.js',
    //                    'tests/app-unit/views/login-signup/Signup.spec.js',
                        // Modals/Popovers
                        'tests/app-unit/views/modal/AddEditServer.spec.js',
                        'tests/app-unit/views/modal/RemoveServer.spec.js',
                        'tests/app-unit/views/modal/NoobTourPopover.spec.js',
                        'tests/app-unit/views/modal/ServerConnectionView.spec.js',
                        // Collections
                        'tests/app-unit/collections/ServerList.spec.js',
                        'tests/app-unit/collections/DirectoryContents.spec.js',
                        'tests/app-unit/collections/DirectoryBreadcrumbs.spec.js',
                        // Models
                        'tests/app-unit/models/DirectoryExplorer.spec.js',
                        'tests/app-unit/models/Server.spec.js',
    //                    'tests/app-unit/models/User.spec.js',
    //                    'tests/app-unit/models/Session.spec.js',
                        // Controllers
                        'tests/app-unit/controllers/Base.spec.js',
                        'tests/app-unit/controllers/Main.spec.js',
                        // Routers
                        'tests/app-unit/routers/Base.spec.js'
                    ];
                } else if(window.appnodetests) {
                    testfiles = [
                        // Models
                        'tests/app-node/models/ServerConnection.spec.js'
                    ]
                }

                require_browser(testfiles, function() {
                    chai.use(sinonChai);

                    if(typeof process !== 'undefined') {
                        resetLocalStorageLoadFixtures();
                    }

                    window.onload();
                });
            });
        }
    );
}
