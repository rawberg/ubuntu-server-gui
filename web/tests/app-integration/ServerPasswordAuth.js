var wd = require('wd'),
    chai = require('chai'),
    chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;


describe("Appliation Initialization", function() {
    var browser;

    before(function(done) {
        browser = wd.promiseChainRemote();
//        browser._debugPromise();
        browser.init({browserName:'chrome', webStorageEnabled:true}).nodeify(done);
    });

    beforeEach(function(done) {
        browser.get("file:///Users/david/Documents/Bergstyle/Web-P-and-D/Projects/NimbleVentures/Ubuntu-Server-GUI/code/app.ubuntuservergui/web/testrunner_app-int.html")
            .windowHandle()
            .nodeify(done);
    });

    after(function(done) {
       browser.quit().nodeify(done);
    });

    it('spawns add server modal and closes it on cancel', function(done) {
        browser
            .setImplicitWaitTimeout(2000)
            .elementByIdIfExists('lsfb_btn_add_server')
            .click()
            .waitForElementByName('cancel')
            .click()
            .hasElementByClassName('modal-add-edit-server').should.eventually.be.false
            .nodeify(done);
    });

    it('should set application title', function(done) {
        browser.title().should.eventually.contain('Ubuntu Server GUI').nodeify(done);
    });

    it('add a new server with password authentication', function(done) {
        browser
            .setImplicitWaitTimeout(2000)
            .elementByIdIfExists('lsfb_btn_add_server').click()
            .elementByNameIfExists('name').type('Integration Server')
            .elementByNameIfExists('ipv4').type('10.0.1.1')
            .elementByNameIfExists('username').type('stdissue')
            .elementByNameIfExists('auth_key').click()
            .sleep(2000)
            .elementByNameIfExists('save').click()
            .hasElementByClassName('modal-add-edit-server').should.eventually.be.false
            .sleep(2000)
            .nodeify(done);


    });
});