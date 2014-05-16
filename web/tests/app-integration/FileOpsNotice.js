module.exports = {

    setUp : function(browser) {
        browser
            .waitForElementPresent('select.server-select-toggle', 4000)
            .click('select.server-select-toggle option:last-child')
            .waitForElementPresent('.dashboard-container', 3000)
            .waitForElementNotPresent('.modal-body.connecting', 2000)
            .click('.toolbar-file_cabinet')
            .waitForElementPresent('.directory-explorer', 2000)
    },

    tearDown : function() {

    },

    'displays file operations error modal when attempting to access a remote file with insufficient permissions' : function (browser) {
        browser
            .assert.elementNotPresent('.modal-fileops', 'error modal is not immediately open')
            // should be root, TODO: use xpath and text()=root
            // https://groups.google.com/forum/#!topic/nightwatchjs/d0p72Ub9Idg
            .click('.directory-explorer tr:nth-child(15) td.filename')
            .assert.elementPresent('.modal-fileops .modal-body', 'file operation error modal displays')
            .click('button[name=close]')
            .assert.elementNotPresent('.modal-fileops', 'modal is closed')
            .assert.elementPresent('#file-manager-breadcrumbs .breadcrumb .crumb', 'user is back at root file manager')
            .end()
    }
};