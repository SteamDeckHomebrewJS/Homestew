/**
 * @description Inject Code into the Steam Decks Dev Console
 * @author SteffTek
 * @license Apache-2.0
 */

/**
 * Imports
 */
const Tab = require('../../lib/Tab.js');
const axios = require('axios');

module.exports = class Injection {
    #tabs = [];

    /**
     * @description Inject code into the Steam Decks Dev Console
     * @param {string} steamBase url of steam debug console
     */
    constructor(steamBase) {
        this.steamBase = steamBase;
    }

    /**
     * @description starts the homebrew
     */
    async loadTabs() {
        // Fetch steamBase/json
        const result = await axios.get(`${this.steamBase}/json`).catch(err => {
            return null;
        });

        // Get Data
        const data = result?.data;

        // Check if data is valid
        if (!data || !Array.isArray(data)) return;

        // Get tabs
        data.forEach(tabData => {
            console.log(`Processing Tab ${tabData.title}`);
            // Create new Tab
            const tab = new Tab(tabData.id, tabData.type, tabData.title, tabData.url, tabData.webSocketDebuggerUrl);
            // Append to tabs
            this.#tabs.push(tab);
        });
    }

    /**
     * @description Getter for tabs
     */
    getTabs() {
        return this.#tabs;
    }

    /**
     * @description Get tab by title
     * @param {string} title title of tab
     * @returns {Tab} tab
     */
    getTab(title) {
        return this.#tabs.find(tab => tab.title === title);
    }
}