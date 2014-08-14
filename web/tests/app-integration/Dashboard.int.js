var fs = require('fs');

module.exports = {

    setUp : function(browser) {
        this.fixtures = JSON.parse(fs.readFileSync('tests/fixtures/dynamic_fixtures.json'));
        browser
            .waitForElementPresent('select.server-select-toggle', 4000)
            .click('select.server-select-toggle option:last-child')
            .waitForElementPresent('.dashboard-container', 3000)
            .waitForElementNotPresent('.modal-body.connecting', 2000)
    },

    'clears dashboard screen when server disconnects' : function (browser) {
        browser
            .click('select.server-select-toggle option:first-child')
            .pause(200)
            .assert.elementNotPresent('#dash_performance .performance', 'dashboard performance component removed')
            .assert.elementNotPresent('#dash_platform .software', 'dashboard software component removed')
            .assert.containsText('select.server-select-toggle option:checked', 'Select Server')
            .end()
    }
};