module.exports = {

    setUp: function () {
    },

    tearDown: function () {

    },

    'clicking dashboard toolbar button has no effect when there is no active server': function (browser) {
        browser
            .url(function(session) {
                var currentUrl = session.value;
                browser
                    .waitForElementPresent('.toolbar-dashboard', 4000, 'wait for toolbar icons')
                    .click('.toolbar-dashboard a')
                    .pause(500)
                    .assert.urlEquals(currentUrl, 'url does not contain #dashboard hash value')
                    .end()
            })
    },

    'clicking filemanager toolbar button navigates to filemanager when server is active': function(browser) {
        browser
            .waitForElementPresent('select.server-select-toggle', 4000, 'select server drop down displays')
            .click('select.server-select-toggle option:last-child')
            .waitForElementPresent('.dashboard-container', 3000, 'dashboard container displays')
            .waitForElementNotPresent('.modal-body.connecting', 2000)
            .url(function(session) {
                var currentUrl = session.value;
                browser
                    .waitForElementPresent('.toolbar-file_cabinet', 4000, 'wait for toolbar icons')
                    .click('.toolbar-file_cabinet a')
                    .pause(500)
                    .assert.urlEquals(currentUrl + '#filemanager', 'url hash contains #filemanager')
            })
            .end()
    },

    'when server disconnects toolbar links are in-activated and server select list is reset': function(browser) {
        browser
            .waitForElementPresent('select.server-select-toggle', 4000, 'select server drop down displays')
            .assert.attributeEquals('select.server-select-toggle', 'selectedIndex', '0', 'server select list starts at default')
            .url(function(session) {
                var mainUrl = session.value;
                browser
                    .click('select.server-select-toggle option:last-child')
                    .waitForElementPresent('.dashboard-container', 3000, 'dashboard container displays')
                    .waitForElementNotPresent('.modal-body.connecting', 2000)
                    .pause(1000)
                    .execute(function() {
                        var activeServer = window.App.getActiveServer();
                        activeServer.connection.disconnect();
                    })
                    .pause(1000)
                    .assert.attributeEquals('select.server-select-toggle', 'selectedIndex', '0', 'server select list reset to default')
                    .click('.toolbar-file_cabinet a')
                    .assert.elementNotPresent('.directory-explorer', 'should not go to file manager screen')
                    .assert.urlEquals(mainUrl, 'url is main app url')
            })
            .end();
    }
}