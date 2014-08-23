var fs = require('fs');

module.exports = {

    setUp: function () {
        this.fixtures = JSON.parse(fs.readFileSync('tests/fixtures/dynamic_fixtures.json'));
    },

    tearDown: function () {

    },

    'dashboard toolbar button has no effect when there is no active server': function (browser) {
        browser
            .url(function(session) {
                var currentUrl = session.value;
                browser
                    .waitForElementPresent('.toolbar-dashboard', 4000, 'wait for toolbar icons')
                    .click('.toolbar-dashboard a')
                    .pause(500)
                    .assert.urlEquals(currentUrl, 'url does not contain #dashboard hash value')
                    .end();
            })
    },

    'filemanager toolbar button navigates to filemanager when server is active': function(browser) {
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
            .end();
    },

    'server select list is reset and toolbar links are in-activated when server disconnects': function(browser) {
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
    },

    'server select list is reset on server connection error': function(browser) {
        browser
            .waitForElementPresent('select.server-select-toggle', 4000, 'select server drop down displays')
            .assert.attributeEquals('select.server-select-toggle', 'selectedIndex', '0', 'server select list starts at default')
            .click('.toolbar-server_rack a')
            .assert.elementPresent('.modal-body')
            .setValue('input[name=name]', 'ConnectionFailBox')
            .setValue('input[name=ipv4]', '127.0.0.2')
            .setValue('input[name=username]', 'vagrant')
            .click('button[name=save]')
            .waitForElementPresent('.modal-body.connection-error', 6000)
            .click('button[name=cancel]')
            .waitForElementNotPresent('.modal-body', 4000)
            .assert.attributeEquals('select.server-select-toggle', 'selectedIndex', '0', 'server select list reset to default')
            .end();
    },

    'add server via top toolbar icon and connect to it via username/password auth': function(browser) {
        browser
            .waitForElementPresent('.toolbar-server_rack', 4000, 'wait for toolbar icons')
            .click('.toolbar-server_rack a')
            .assert.elementPresent('.modal-body')
            .setValue('input[name=name]', 'AddedTestbox')
            .setValue('input[name=ipv4]', '127.0.0.1') //this.fixtures.active_vm.public_ip)
            .setValue('input[name=port]', [browser.Keys.BACK_SPACE,browser.Keys.BACK_SPACE, '2222'])
            .setValue('input[name=username]', 'vagrant')
            .click('input[name=auth_key]')
            .click('button[name=save]')
            .waitForElementPresent('.modal-body.password-required', 2000)
            .setValue('input[name=ssh_password]', 'vagrant')
            .click('button[name=connect]')
            .waitForElementNotPresent('.modal-body', 4000)
            .end();
    },

    'top toolbar icon edits active server': function(browser) {
        browser
            .waitForElementPresent('.toolbar-server_rack', 4000, 'wait for toolbar icons')
            .click('.toolbar-server_rack a')
            .assert.elementPresent('.modal-body')
            .setValue('input[name=name]', 'EditTestBox')
            .setValue('input[name=ipv4]', '127.0.0.1')
            .setValue('input[name=port]', [browser.Keys.BACK_SPACE,browser.Keys.BACK_SPACE, '2222'])
            .setValue('input[name=username]', 'vagrant')
            .click('input[name=auth_key]')
            .click('button[name=save]')
            .waitForElementPresent('.modal-body.password-required', 2000)
            .setValue('input[name=ssh_password]', 'vagrant')
            .click('button[name=connect]')
            .waitForElementNotPresent('.modal-body', 4000)
            .click('.toolbar-server_rack a')
            .waitForElementPresent('.modal-body', 2000)
            .pause(300)
            .assert.containsText('.modal-header h4', 'Edit', 'modal title contains Edit')
            .assert.value('.modal-body input[name=name]', 'EditTestBox')
            .assert.value('.modal-body input[name=ipv4]', '127.0.0.1')
            .assert.value('.modal-body input[name=port]', '2222')
            .assert.value('.modal-body input[name=username]', 'vagrant')
            .assert.value('.modal-body input[name=auth_key]', '')
            .end();
    }

};