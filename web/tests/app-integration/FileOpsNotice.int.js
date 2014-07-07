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

    'displays file operations error modal when attempting to access a remote file with insufficient permissions' : function (browser) {
        browser
            .assert.elementNotPresent('.modal-fileops', 'error modal is not immediately open')
            .click('xpath', '//table//td[@class="filename"][text()="root"]')
            .assert.elementPresent('.modal-fileops .modal-body', 'file operation error modal displays', 2000)
            .click('button[name=close]')
            .assert.elementNotPresent('.modal-fileops', 'modal is closed', 1500)
            .assert.elementPresent('#file-manager-breadcrumbs .breadcrumb .crumb', 'user is back at root file manager')
            .end()
    }
}