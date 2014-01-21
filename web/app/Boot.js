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

        // Misc
        text: '../libs/require/text',
        moment: '../libs/moment/moment',
        filesize: '../libs/filesize/filesize.min',

        // Testing Libs
        jasmine: '../libs/jasmine/jasmine',
        jasmine_html: '../libs/jasmine/jasmine-html',
        jasmine_async: '../libs/jasmine/jasmine.async',
        sinon: '../libs/sinon/sinon-1.7.1',
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
        'jasmine_async': {
            deps: ['jasmine']
        },
        'sinon': {
            exports: 'sinon'
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
    require_browser(['jquery', 'chai', 'sinon_chai', 'sinon', 'jasmine', 'jasmine_html', 'jasmine_async'],
        function($, chai, sinonChai) {
            $(document).ready(function() {
                // Chai
                assert = chai.assert;
                should = chai.should();
                expect = chai.expect;

                require_browser([
                    'test/App.spec.js',
                    // Mock Responses
//                    'test/mock-responses/Sessions.response.js',
                    // Views
                    'test/views/MainToolbar.spec.js',
                    'test/views/MainFooterbar.spec.js',
                    // Views (dashboard)
                    'test/views/dashboard/LeftSidebar.spec.js',
                    'test/views/dashboard/LeftSidebarItem.spec.js',
                    'test/views/dashboard/Dashboard.spec.js',
                    // Views (filemanager)
                    'test/views/filemanager/FileManager.spec.js',
                    'test/views/filemanager/DirectoryExplorerView.spec.js',
                    // Views (login-signup)
                    'test/views/login-signup/LoginSignup.spec.js',
//                    'test/views/login-signup/Login.spec.js',
                    'test/views/login-signup/Signup.spec.js',
                    // Modals/Popovers
                    'test/views/modal/AddEditServer.spec.js',
                    'test/views/modal/RemoveServer.spec.js',
                    'test/views/modal/NoobTourPopover.spec.js',
                    'test/views/modal/ServerConnectionView.spec.js',
                    // Collections
                    'test/collections/ServerList.spec.js',
                    'test/collections/DirectoryContents.spec.js',
                    'test/collections/DirectoryBreadcrumbs.spec.js',
                    // Models
                    'test/models/DirectoryExplorer.spec.js',
                    'test/models/Server.spec.js',
                    'test/models/ServerConnection.spec.js',
//                    'test/models/User.spec.js',
//                    'test/models/Session.spec.js',
                    // Controllers
                    'test/controllers/Main.spec.js',
                    // Routers
                    'test/routers/Base.spec.js'
                ],
                    function() {
                        chai.use(sinonChai);
                        var jasmineEnv = jasmine.getEnv();
                        jasmineEnv.updateInterval = 250;

                        var htmlReporter = new jasmine.HtmlReporter();
                        jasmineEnv.addReporter(htmlReporter);

                        jasmineEnv.specFilter = function(spec) {
                            return htmlReporter.specFilter(spec);
                        };

                        jasmineEnv.execute();
                    }
                );

            });
        }
    );
}
