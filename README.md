# Homestew (WIP)
HomeStew (Homebrew in NodeJS) for the SteamDeck.

---

## Credit
### Thanks to the Python Implementation of [SteamDeck Homebrew](https://github.com/SteamDeckHomebrew/PluginLoader). They helped build this Repo by providing awesome OpenSource Software.

### To avoid fragmentation, please use SteamDeck Homebrew instead of Homestew, this is a fun project but it's currently not the heart of SteamDeck Modding.

---

## Installation
**You need to have a password set for your Deck User first**
- Use `passwd` in a terminal
- Type your password
- ???
- Profit!

### After you set your password

1. Go into the Steam Deck Settings
2. Under System -> System Settings toggle `Enable Developer Mode`
3. Scroll the sidebar all the way down and click on `Developer`
4. Under Miscellaneous, enable `CEF Remote Debugging`
5. Click on the `STEAM` button and select `Power` -> `Switch to Desktop`
6. Open a terminal and paste the following command into it: 
    - `curl -L https://github.com/SteamDeckHomebrewJS/Homestew/raw/main/scripts/install.sh | sh`
7. Done! Reboot back into Gaming mode and enjoy your plugins!

### Install Plugins
- Copy Plugins into your `~/homestew/plugins` folder.

### Uninstall
- Open a terminal and paste the following command into it:
  - `curl -L https://github.com/SteamDeckHomebrewJS/Homestew/raw/main/scripts/uninstall.sh | sh`