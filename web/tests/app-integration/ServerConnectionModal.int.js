module.exports = {

    setUp : function() {
    },

    tearDown : function() {
    },

    'displays connecting modal when attempting to connect to a server via ssh key auth' : function (browser) {
        browser
            .pause(1000)
            .waitForElementPresent('select.server-select-toggle', 2000)
            .click('select.server-select-toggle option:last-child')
            .waitForElementPresent('.modal-body.connecting', 1000)
            .waitForElementPresent('.dashboard-container', 1000)
            .pause(500)
            .assert.elementNotPresent('.modal-body', 'connection model is removed after successful connection')
            .end()
  }
}