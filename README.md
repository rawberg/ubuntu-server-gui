[![Stories in Ready](https://badge.waffle.io/rawberg/ubuntu-server-gui.png?label=ready&title=Ready)](https://waffle.io/rawberg/ubuntu-server-gui)
Ubuntu Server GUI
=================

Open Source desktop GUI manager for Ubuntu Servers. Just want to use the app? Download the binary for [OSX](http://ubuntuservergui.com/dl/Ubuntu-Server-GUI_osx085.dmg) and [Windows](http://ubuntuservergui.com/dl/Ubuntu-Server-GUI_win085.zip).

### Tech Specs
- Node-Webkit provides the desktop shell
- Single Page JavaScript app using Backbone, Marionette, StickIt, RequireJS & Gulp
- Jasmine unit tests for client side app and nodejs components
- Selenium + Vagrant handles integration between GUI app and server operations
- Gulp driven tooling for smooth test orchestration
- NodeJS makes direct SSH connections to servers and handles local & remote i/o

### Dev Setup on OSX
```
git clone git@github.com:rawberg/ubuntu-server-gui.git usg
cd usg  
git submodule init  
git submodule update
cd web
npm install .
```

### Running
- ```cd usg/web```
- ```../desktop/osx/node-webkit.app/Contents/MacOS/node-webkit .```

### Testing
- ```brew install vagrant```
- ```npm install .```
- ```gulp app-unit // runs all the unit tests```
- ```gulp app-node // run the node component tests```
- ```gulp app-integration  // run the integration tests (uses selenium and vagrant)```

### Status - Beta
The foundational architecture is in place and the current version is ready to use as a basic remote file editor. GUI driven controls are in progress!

### Documentation
- for now the tests and source code are the best documentation
- all test cases have been carefully worded to explain what each unit is responsible for

### Security
Security issues are treated with the highest priority. Please report any potential security concerns via the channels below and they be will handled immediately!

###### Links
* [node-webkit security wiki page](https://github.com/rogerwang/node-webkit/wiki/Security) 
* [node ssh2 library](https://github.com/mscdex/ssh2) 

### Bugs, Support and Feedback
 [bugs & support requests](https://github.com/rawberg/ubuntu-server-gui/issues)
[feedback @ubuntu-server-gui on twitter](https://twitter.com/ubuntuservergui)

### License
[GPL 3.0](http://opensource.org/licenses/GPL-3.0)
