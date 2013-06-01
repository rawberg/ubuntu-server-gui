Ubuntu Server GUI
=================

GUI client app designed to work with the [Ubuntu Server API](https://github.com/rawberg/ubuntu-server-api).

### Status - Developer Preview

This is a very early version of the app I'm releasing to get developer feedback.


### Install For Developers

    git clone git@github.com:rawberg/ubuntu-server-gui.git ubuntu-server-gui
    cd ubuntu-server-gui/public
    npm install .
    setup a local web server to point to public/index.html
    (getting started will be easier soon, I promise)


### Install Notes

- make sure you install the [server side application]((https://github.com/rawberg/ubuntu-server-api) on any servers you'd like to connect too


### Deployment

running grunt build will create a "deployable" directory containing an optimized version ready for deployment


### Tests

- written with [Mocha](http://visionmedia.github.com/mocha/) and [Chai](http://chaijs.com/api/bdd/)
- open public/test/TestRunner.html in a browser to run them


### Documentation

- for now the tests and source code are the best documentation
- all test cases have been carefully worded to explain what each unit is responsible for
- pretty documentation is coming soon


### License
[GPL 3.0](http://opensource.org/licenses/GPL-3.0)
