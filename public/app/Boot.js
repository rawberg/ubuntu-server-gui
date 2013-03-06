require.config({
    baseUrl: (window.basePath ? window.basePath : '') + 'app/',
    paths: {
        // Core Libs
        jquery: '../libs/jquery/jquery-1.8.2.min',
        underscore: '../libs/underscore/underscore',
        backbone: '../libs/backbone/backbone',
        marionette: '../libs/backbone.marionette/backbone.marionette',

        // Addons
        backbone_dualstorage: '../libs/backbone.dualstorage/backbone.dualstorage',
        backbone_modelbinder: '../libs/backbone.modelbinder/Backbone.ModelBinder',
        backbone_routefilter: '../libs/backbone.routefilter/backbone.routefilter',
        backbone_stickit: '../libs/backbone.stickit/backbone.stickit',

        // Bootstrap & jQuery Plugins
        bootstrap_modal: '../css/flatstrap/assets/js/bootstrap-modal',
        bootstrap_tooltip: '../css/flatstrap/assets/js/bootstrap-tooltip',
        bootstrap_popover: '../css/flatstrap/assets/js/bootstrap-popover',
        bootstrap_transition: '../css/flatstrap/assets/js/bootstrap-transition',
        gauge: '../libs/gauge.js/dist/gauge',
        contextmenu: '../libs/contextmenu/contextmenu',

        // Misc
        ace: '../libs/ace/lib/ace',
        text: '../libs/require/text',
        socket_io: '../libs/socket.io-client/dist/socket.io',

        // Testing Libs
        mocha: '../libs/mocha/mocha',
        sinon: '../libs/sinon/sinon-1.5.0',
        chai: '../libs/chai/chai',
        sinon_chai: '../libs/chai/plugins/sinon-chai'
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
        'bootstrap_modal': {
            deps: ['jquery'],
            exports: 'jQuery.fn.modal'
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
    require(['jquery', 'backbone', 'App', 'controllers/Main', 'routers/Main'],
        function($, Backbone, App, MainController, MainRouter) {
            var rootPath = '/';
            var pushState = true;
            // support using Backbone router when app is loaded via file://
            if(location.pathname.indexOf('/public/index.html') !== -1) {
                rootPath = location.pathname.substring(0, location.pathname.lastIndexOf('/public/index.html')+18);
                pushState = false;
            }

            App.routers.main = new MainRouter({controller: new MainController()});
            App.user().session().fetch({
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                complete: function() {
                    $(document).ready(function() {
                        Backbone.history.start({pushState: pushState, root: rootPath});
                    });
                }
            });
        }
    );
} else {
    require(['jquery', 'chai', 'sinon_chai'],
        function($, chai, sinonChai) {
            $(document).ready(function() {
                // Chai
                assert = chai.assert;
                should = chai.should();
                expect = chai.expect;

                // Mocha
                mocha.setup({
                    ui: 'bdd',
                    ignoreLeaks: true
                });

                require([
                    'test/App.spec.js',
                    // Views
                    'test/views/MainToolbar.spec.js',
                    'test/views/MainFooterbar.spec.js',
                    // Views (dashboard)
                    'test/views/dashboard/LeftSidebar.spec.js',
                    'test/views/dashboard/LeftSidebarItem.spec.js',
                    'test/views/dashboard/Dashboard.spec.js',
                    // Views (login-signup)
                    'test/views/login-signup/LoginSignup.spec.js',
                    'test/views/login-signup/Login.spec.js',
                    'test/views/login-signup/Signup.spec.js',
                    // Modals/Popovers
                    'test/views/modal/AddEditServer.spec.js',
                    'test/views/modal/RemoveServer.spec.js',
                    'test/views/modal/NoobTourPopover.spec.js',
                    'test/views/modal/ServerConnection.spec.js',
                    // Collections
                    'test/collections/ServerList.spec.js',
                    // Models
                    'test/models/Server.spec.js',
                    'test/models/User.spec.js',
                    'test/models/Session.spec.js',
                    // Controllers
                    'test/controllers/Base.spec.js',
                    'test/controllers/Main.spec.js',
                    // Routers
                    'test/routers/Base.spec.js'
                ],
                    function() {
                        chai.use(sinonChai);
                        mocha.run();
                    }
                );

            });
        }
    );
}
