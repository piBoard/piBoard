piBoard
=========
----
What is it ?
----
piBoard is a plugable HTML-based dashboard for embedded boards.It provides a plugin architecture for creating plugins that will help with managing your embedded board.
piBoard will give you the abillity to connect to all embedded boards (rasperry pi, beaglebone...etc) that are connected to your local network

How to Use
----
Using piBoard is straight forward, piBoard have two parts:
* Server: which will be installed on the device that you want to manage lets say (rasperry pi)
* Client: which will run on you computer to give you the ability to connect to the device and manage it 

you only need to install piBoard-server on your embedded board (ex: rasperry pi) then run the piBoard-client on your computer. Which will automatically search and list all running piBoard-server inside your local network.

Version
----
0.0.1

Features
----

* Plugins system: you can write your own plugin using javascript, html and nodejs
* Auto scan to detect any running piBoard-server in the local network
* Password protection to prevent insecure access to the board
* Core plugins that comes out of the box when you install the piBoard:
  1. Mouse & keyboard plugin: this plugin will let you control your device mouse and keyboard form your laptop, without hooking a real mouse and keyboard to your rasperrypi.
  2. System plugin: this plugin will give you realtime updates on your system resources (memoury/cpu)
  * More plugins to come with futuer version releases
  

Installation
--------------

First you need to install the latest version of nodejs on the embedded device.

For rasperry pi and debian based embedded devices use the following command to install nodejs:

```sh
wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
sudo dpkg -i node_latest_armhf.deb
```

After installing nodejs you can proceed with piBoard-server installation, to do that download the latest piBoard-server version form 

```sh
wget https://github.com/piBoard/piBoard/archive/master.zip
unzip master.zip
```

Now you will have a new folder called piBoard-master, cd to this folder:

```sh
cd piBoard-master
```

Now run the install script which will take care for installing all the dependencies and setting up the piBoard-server to run on startup, also it will setup the core plugins

to do that run this command
```sh
chmod 755 ./install.sh && ./install.sh
```
Installation my take couple of minutes so be patient please, also the command might ask you for your sudo password, this is because it will try to apt-get install some applications that are needed by the plugins to run.

##### Configuration

After finishing the installation you can edit the package.json file to edit your piBoard name and password.

```sh
vim package.json
```
and change the password and name fields, leaving the password field blank will allow piBoard-client to access your board without authentication

```json
{
  "piBoard": {
    "name": "piBoard",
    "password": "1234567" 
  }
}
```

Client
----
Get the latest release from piBoard Client form the Client repo, under releases.


License
----

MIT


**Free Software, Hell Yeah!**

