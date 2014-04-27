[![Stories in Ready](https://badge.waffle.io/rawberg/ubuntu-server-gui.png?label=ready&title=Ready)](https://waffle.io/rawberg/ubuntu-server-gui)
Ubuntu Server GUI
=================

Open Source node-webkit based GUI manager for Ubuntu Servers.

### Tech Specs
- Single Page JavaScript app using Backbone, Marionette, StickIt, RequireJS & Gulp
- Jasmine unit tests for client side app and nodejs components
- Selenium + Vagrant handles integration between GUI app and server operations
- Gulp driven tooling for smooth test orchestration
- NodeJS makes direct SSH connections to servers and handles local & remote i/o
- Ansible driven configuration management

### Dev Setup on OSX
- git clone git@github.com:rawberg/ubuntu-server-gui.git usg
- git submodule init
- git submodule update
- npm install .

### Running
- cd usg/web
- ../desktop/osx/node-webkit.app/Contents/MacOS/node-webkit .

### Testing
- brew install vagrant
- npm install .
- gulp app-unit // runs all the unit tests
- gulp app-node // run the node component tests
- gulp app-integration  // run the integration tests (uses selenium and vagrant)

### Status - Beta
I re-architected this app 3+ times over the last two years but it's finally ready to blossom.

### Documentation
- for now the tests and source code are the best documentation
- all test cases have been carefully worded to explain what each unit is responsible for


### License
[GPL 3.0](http://opensource.org/licenses/GPL-3.0)
