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
            '../test/App.spec',
            // Views
            'views/MainToolbar.spec.js',
            'views/MainFooterbar.spec.js',
            // Views (dashboard)
            'views/dashboard/LeftSidebar.spec.js',
            // Views (login-signup)
            'views/login-signup/LoginSignup.spec.js',
            'views/login-signup/Login.spec.js',
            'views/login-signup/Signup.spec.js',
            // Models
            '../test/models/Server.spec',
            '../test/models/User.spec',
            '../test/models/Session.spec',
            // Controllers
            '../test/controllers/Base.spec',
            '../test/controllers/Main.spec',
            // Routers
            '../test/routers/Base.spec'
            ],
            function() {
                chai.use(sinonChai);
                mocha.run();
            }
        );

    });

});

