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
            'test/App.spec.js',
            // Views
            'test/views/MainToolbar.spec.js',
            'test/views/MainFooterbar.spec.js',
            // Views (dashboard)
            'test/views/dashboard/LeftSidebar.spec.js',
            'test/views/dashboard/LeftSidebarItem.spec.js',
            // Views (login-signup)
            'test/views/login-signup/LoginSignup.spec.js',
            'test/views/login-signup/Login.spec.js',
            'test/views/login-signup/Signup.spec.js',
            // Modals/Popovers
            'test/views/modal/AddEditServer.spec.js',
            'test/views/modal/RemoveServer.spec.js',
            'test/views/modal/NoobTourPopover.spec.js',
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

});

