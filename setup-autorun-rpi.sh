#! /bin/sh

chmod 755 $(pwd)/piBoard-init.sh
sed -i 's?replace-me-with-piBoard-path?'`pwd`'?g' $(pwd)/piBoard-init.sh
sudo sed -i '/piBoard-init.sh start/d' /etc/xdg/lxsession/LXDE/autostart
sudo echo @$(pwd)/piBoard-init.sh start >> /etc/xdg/lxsession/LXDE/autostart