Ubuntu Server GUI
=================

GUI client app designed to work with the [Ubuntu Server API](https://github.com/rawberg/ubuntu-server-api).


### Status - Developer Preview

This is a very early version of the app I'm releasing to get developer feedback.


### Install For Developers

You'll need three tools to assist in ensuring installation is correct and general quality control through out your projects life cycle.

  *VirtualEnv* : Your project won't be the only code on your system that uses python or node, this tool creates isolated library environments to keep the packages you use for your project separate from your system.

  *VirtualEnvWrapper* : Makes dealing with virtualenv easier, really a bulter of sorts.

  *NodeEnv*: Install specific versions of Node in your virtualenv, and promotes the isolated environment for node packages. packages installed the global switch (-g) will end up in the isolated environment.

1. Prepare an isolated environment

    	sudo pip install virtualenvwrapper nodeenv
	export WORKON_HOME=~/Envs
	mkdir -p $WORKON_HOME
	source /usr/local/bin/virtualenvwrapper.sh
	mkvirtualenv --distribute ubuntu-server-gui
	nodeenv -p

2. Install Ubuntu Server Gui Client

	git clone git@github.com:rawberg/ubuntu-server-gui.git ubuntu-server-gui
	cd ubuntu-server-gui/public
	npm install .

3. First Run

	grunt server


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
