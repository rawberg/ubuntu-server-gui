define(function (require, exports, module) {
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
            // Views
            '../test/views/LoginSignup.spec',
            // Models
            '../test/models/Server.spec',
            '../test/models/User.spec',
            '../test/models/Session.spec'
            ], function() {
            chai.use(sinonChai);
            mocha.run();
        });

    });

});

