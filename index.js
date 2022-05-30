/**
 * @description NodeJS Implementation of Homebrew for Steam Deck
 * @author SteffTek
 * @license Apache-2.0
 */

/**
 * Imports
 */
const path = require('path');
const cors = require('cors');
const express = require('express');

/**
 * Libs & Source
 */
// const Plugin = require('./lib/Plugin.js');
const Injection = require('./src/injection');

/**
 * Homebrew Interface
 */
class Homebrew {
    // Application State
    activePlugin = null;

    // Resources
    plugins = [];
    injection = null;

    /**
     * Constructor
     * @param {string} path Path to the homebrew folder
     * @param {string} steamBase base url of steam console
     */
    constructor(path, steamBase) {
        this.path = path;
        this.steamBase = steamBase;
    }

    /**
     * @description starts the homebrew
     */
    async start() {
        // Load tabs
        const isInjected = await this.injectCode();
        if (!isInjected) return;
        // Load Plugins into tabs
        this.loadPlugins();
    }

    /**
     * @description Loads all tabs
     */
    async injectCode() {
        /**
         * Inject into Steam Deck dev console
         */
        this.injection = new Injection(this.steamBase);
        await this.injection.loadTabs();

        // Get Quick Access Tab
        const tab = this.injection.getTab('QuickAccess');
        if (!tab) return false;

        // Inject code
        await tab.inject();
    }

    /**
     * @description Loads all plugins
     */
    loadPlugins() {

    }
}

/**
 * Constants
 */
const PATH = process.env.ENVIRONMENT === 'development' ? path.join(__dirname, "test") : "/home/deck/homestew";
const STEAM_BASE = process.env.STEAM_BASE || "http://localhost:8080";
const PORT = process.env.PORT || 42069;

/**
 * Register Homebrew Interface
 */
const hb = new Homebrew(PATH, STEAM_BASE);

/**
 * Start
 */
hb.start();

/**
 * Create Express Server
 */
const app = express();
app.use(cors({ origin: "*" }));
app.set("PORT", PORT);
app.set("view engine", "ejs");

/**
 * Create Static Server
 */
app.use(express.static("static"));

/**
 * Implement Router
 */
require("./src/server/index")(app, hb);

/**
 * Start Server
 */
app.listen(app.get("PORT"), () => {
    console.log(`Server started on port ${app.get("PORT")}`);
});

/**
 * Export for use in Plugins
 */
module.exports = {
    
}