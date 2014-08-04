module.exports = {

    setUp : function(browser) {
        browser
            .waitForElementPresent('select.server-select-toggle', 4000, 'select server drop down displays')
            .click('select.server-select-toggle option:last-child')
            .waitForElementPresent('.dashboard-container', 5000, 'dashboard container displays')
            .waitForElementNotPresent('.modal-body.connecting', 4000)
            .click('.toolbar-file_cabinet a')
            .waitForElementPresent('.directory-explorer', 2000, 'directory explorer displays')
    },

    'file editor displays contents of an existing file' : function (browser) {
        browser
            .click('xpath', '//table//td[@class="filename"][text()="vagrant"]')
            .waitForElementPresent('.directory-explorer tbody', 2000, 'directory explorer shows vagrant folder contents')
            .click('xpath', '//table//td[@class="filename"][text()="Z01-existing_file.txt"]')
            .waitForElementPresent('#editor_layout', 2000, 'containing layout for code mirror displays')
            .assert.elementPresent('.CodeMirror-lines', 'displays code mirror editor')
            .assert.containsText('.CodeMirror-lines pre span', 'existing content', 'existing file contents is shown in the editor')
            .end()
    },

    'file editor tab closes file and returns user to file manager' : function (browser) {
        browser
            .click('xpath', '//table//td[@class="filename"][text()="vagrant"]')
            .waitForElementPresent('.directory-explorer tbody', 2000, 'directory explorer shows vagrant folder contents')
            .click('xpath', '//table//td[@class="filename"][text()="Z01-existing_file.txt"]')
            .waitForElementPresent('#editor_layout', 2000, 'containing layout for code mirror displays')
            .assert.elementPresent('.CodeMirror-lines', 'displays code mirror editor')
            .click('.file-close')
            .waitForElementPresent('.breadcrumb', 2000, 'back at file manager')
            .end()
    },

    'file editor displays edits and saves an existing file' : function (browser) {
        var windowHandle;
        browser.window_handle(function(result) {
            windowHandle = result;
        });
        browser
            .click('xpath', '//table//td[@class="filename"][text()="vagrant"]')
            .waitForElementPresent('.directory-explorer tbody', 2000, 'directory explorer shows vagrant folder contents')
            .click('xpath', '//table//td[@class="filename"][text()="Z01-existing_file.txt"]')
            .waitForElementPresent('#editor_layout', 3000, 'containing layout for code mirror displays')
            .pause(1000)
            .assert.elementPresent('.CodeMirror-lines', 'displays code mirror editor')
            .assert.containsText('.CodeMirror-lines pre span', 'existing content', 'existing file contents is shown in the editor')
            .click('.CodeMirror-lines')
            .keys([
                browser.Keys.UP_ARROW,
                browser.Keys.HOME,
                browser.Keys.DELETE,
                browser.Keys.DELETE,
                browser.Keys.DELETE,
                browser.Keys.DELETE,
                browser.Keys.DELETE,
                browser.Keys.DELETE,
                browser.Keys.DELETE,
                browser.Keys.DELETE,
                'new'
            ])
            .keys([browser.Keys.META, 's'])
            .keys([browser.Keys.META])
            .click('.toolbar-file_cabinet a')
            .waitForElementPresent('.breadcrumb', 2000, 'wait for breadcrumb bar')
            .assert.containsText('.breadcrumb li:last-child span', '/', 'furthest breadcrumb is /')
            .click('xpath', '//table//td[@class="filename"][text()="vagrant"]')
            .waitForElementPresent('.directory-explorer tbody', 2000, 'directory explorer shows vagrant folder contents')
            .click('xpath', '//table//td[@class="filename"][text()="Z01-existing_file.txt"]')
            .assert.containsText('.CodeMirror-lines pre span', 'new content', 'new contents is shown in the editor')
            .keys([
                browser.Keys.UP_ARROW,
                browser.Keys.HOME,
                browser.Keys.DELETE,
                browser.Keys.DELETE,
                browser.Keys.DELETE,
                'existing'
            ])
            .keys([browser.Keys.META, 's'])
            .keys(['w'])
            .keys([browser.Keys.META])
            .waitForElementPresent('.breadcrumb', 2500, 'wait for breadcrumb bar')
            .assert.containsText('.breadcrumb li:last-child span', '/', 'furthest breadcrumb is /')
            .click('xpath', '//table//td[@class="filename"][text()="vagrant"]')
            .waitForElementPresent('.directory-explorer tbody', 2500, 'directory explorer shows vagrant folder contents')
            .click('xpath', '//table//td[@class="filename"][text()="Z01-existing_file.txt"]')
            .assert.containsText('.CodeMirror-lines pre span', 'existing content', 'existing file contents is shown in the editor')
            .end()
    }
};