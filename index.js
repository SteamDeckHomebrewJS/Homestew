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
const PluginBase = require('./lib/PluginBase.js');
const Injection = require('./src/injection');

/**
 * Homebrew Interface
 */
class Homebrew {
    // Application State
    activePlugin = null;
    #reinjection = null;

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
        await this.injectCode();
        // Load Plugins into tabs
        this.loadPlugins();
    }

    /**
     * @description stops homebrew
     */
    stop() {
        clearInterval(this.#reinjection);
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

        // Log
        console.log("Getting QuickAccess Tab...")

        // Get Quick Access Tab
        const tab = this.injection.getTab('QuickAccess');
        if (!tab) {
            console.log("Tab not found. Make sure Steam Game Mode is running.");
        } else {
            // Inject code
            await tab.inject();
        };

        /**
         * @description Check if code is still injected, if not, reinject
         */
        this.#reinjection = setInterval(async () => {
            // Fetching Tabs
            console.log("Fetching tabs...");
            await this.injection.loadTabs();
            // Get Tab
            const quickAccess = this.injection.getTab("QuickAccess");
            // Check if Tab is there
            if(!quickAccess) return;
            // Check if QuickAccess is still injected
            const hasElement = await quickAccess.hasElement("plugins");
            if(hasElement) return;
            // Reinject
            console.log("Reinjecting Code in QuickAccess Menu...");
            quickAccess.injectCode();
        }, 1000);
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
const HOME_PATH = process.env.ENVIRONMENT === 'development' ? path.join(__dirname) : process.env.PATH || "/home/deck/homestew";
const STEAM_BASE = process.env.STEAM_BASE || "http://localhost:8080";
const SERVER_PORT = process.env.PORT || 42069;
const SERVER_HOST = process.env.HOST || "127.0.0.1";

/**
 * Register Homebrew Interface
 */
const hb = new Homebrew(HOME_PATH, STEAM_BASE);

/**
 * Start
 */
hb.start();

/**
 * Create Express Server
 */
const app = express();
app.use(cors({ origin: "*" }));
app.set("PORT", SERVER_PORT);
app.set("HOST", SERVER_HOST);

/**
 * View Engine Settings
 */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/**
 * Create Static Server
 */
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'views')));

/**
 * Implement Router
 */
require("./src/server/index")(app, hb);

/**
 * Start Server
 */
app.listen(app.get("PORT"), app.get("HOST"), () => {
    console.log(`Server started on port ${app.get("PORT")}`);
});

/**
 * Export for use in Plugins
 */
module.exports = {
    PluginBase
}