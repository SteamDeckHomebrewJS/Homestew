#!/bin/sh

[ "$UID" -eq 0 ] || exec sudo "$0" "$@"

echo "Installing Homestew..."

HOME_FOLDER=/home/deck/homestew

# Create folder structure
rm -rf ${HOME_FOLDER}/service
sudo -u deck mkdir -p ${HOME_FOLDER}/service
sudo -u deck mkdir -p ${HOME_FOLDER}/plugins

# Download latest release and install it
curl -L https://github.com/SteamDeckHomebrewJS/Homestew/releases/latest/download/Homestew --output ${HOME_FOLDER}/service/Homestew
chmod +x ${HOME_FOLDER}/service/Homestew

# Stop Current Instance
systemctl --user stop homestew 2> /dev/null
systemctl --user disable homestew 2> /dev/null
systemctl stop homestew 2> /dev/null
systemctl disable homestew 2> /dev/null

# Remove Service & Check
rm -f /etc/systemd/system/homestew.service
cat > /etc/systemd/system/homestew.service <<- EOM
[Unit]
Description=SteamDeck Plugin Loader
[Service]
Type=simple
User=root
Restart=always
ExecStart=/home/deck/homestew/service/Homestew
WorkingDirectory=/home/deck/homestew/service
Environment=PATH=/home/deck/homestew/plugins
[Install]
WantedBy=multi-user.target
EOM

# Start Service
systemctl daemon-reload
systemctl start plugin_loader
systemctl enable plugin_loader