define(function (require) {
    var $ = require('jquery');
    var chai = require("chai");
    var sinonChai = require("sinon_chai");

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
            '../test/App.spec.js',
            // Views
            'views/MainToolbar.spec.js',
            'views/MainFooterbar.spec.js',
            // Views (dashboard)
            'views/dashboard/LeftSidebar.spec.js',
            'views/dashboard/LeftSidebarItem.spec.js',
            // Views (login-signup)
            'views/login-signup/LoginSignup.spec.js',
            'views/login-signup/Login.spec.js',
            'views/login-signup/Signup.spec.js',
            // Modals/Popovers
            'views/modal/AddEditServer.spec.js',
            'views/modal/RemoveServer.spec.js',
            'views/modal/NoobTourPopover.spec.js',
            // Collections
            '../test/collections/ServerList.spec.js',
            // Models
            '../test/models/Server.spec.js',
            '../test/models/User.spec.js',
            '../test/models/Session.spec.js',
            // Controllers
            '../test/controllers/Base.spec.js',
            '../test/controllers/Main.spec.js',
            // Routers
            '../test/routers/Base.spec.js'
            ],
            function() {
                chai.use(sinonChai);
                mocha.run();
            }
        );

    });

});

