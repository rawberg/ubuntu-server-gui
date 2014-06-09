var app = require('app');
var BrowserWindow = require('browser-window');

// Report crashes to our server.
//require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        "node-integration": "all",
        title: "Ubuntu Server GUI",
        width: 800,
        height: 800,
        "web-preferences": {
            "web-security": false
        }
    });

    // and load the index.html of the app.
//  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.loadUrl('file://' + __dirname + '/testrunner_app-unit.html');
//    mainWindow.loadUrl('http://app.ubuntuservergui.dev:8888/index.html');

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});