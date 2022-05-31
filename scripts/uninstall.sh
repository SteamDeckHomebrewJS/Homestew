#!/bin/sh

echo "Uninstalling Homestew..."

HOME_FOLDER=/home/deck/homestew

# Disable and remove services
sudo systemctl disable --now homestew.service > /dev/null
sudo rm -f /home/deck/.config/systemd/user/homestew.service
sudo rm -f /etc/systemd/system/homestew.service

# Remove temporary folder if it exists from the install process
rm -rf /tmp/homestew

# Cleanup service folder
sudo rm ${HOME_FOLDER}/service/Homestew