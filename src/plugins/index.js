/**
 * @description Manage Plugins
 * @author SteffTek
 * @license Apache-2.0
 */

/**
 * Imports
 */
const express = require('express');
const Plugin = require("./Plugin.js");
const path = require('path');
const fs = require('fs');
const removeRoute = require("../utils/removeRoute");

module.exports = class PluginManager {
    // State
    #plugins = [];

    constructor(path, app) {
        this.path = path;
        this.app = app;
    }

    /**
     * Getter
     */
    getPlugin(name) {
        return this.#plugins.find(plugin => plugin.name === name);
    }

    getPlugins() {
        return this.#plugins;
    }

    /**
     * Get Plugin in Folder & Load Them
     */
    loadPlugins() {
        // Load all plugin folders in this.path / plugins
        const pluginPath = path.join(this.path, 'plugins');
        let pluginFolders = fs.readdirSync(pluginPath);
        // Filter all non folders
        pluginFolders = pluginFolders.filter(folder => fs.lstatSync(path.join(pluginPath, folder)).isDirectory());
        // Load all plugins
        pluginFolders.forEach(folder => {
            // Get Plugin Name
            const name = path.basename(folder);
            // Load Plugin
            this.loadPlugin(name);
        });
        // Create Routes
        this.createRoutes();
    }

    /**
     * Reload Plugins
     */
    reload() {
        // Remove all Routes & Stop Plugin
        this.#plugins.forEach(plugin => {
            plugin.stop();
            this.removeRoutes(plugin);
        });

        // Unload all Plugins
        this.#plugins = [];

        // Load all Plugins
        this.loadPlugins();
    }

    /**
     * Load Plugin
     */
    loadPlugin(name) {
        // Create Path
        const pluginPath = path.join(this.path, 'plugins', name);
        // Load PluginJSON
        const pluginJSON = require(path.join(pluginPath, 'plugin.json'));
        // Check if PluginJSON is valid
        if (!pluginJSON) return;
        // Check If Plugin is already loaded
        if (this.getPlugin(name)) return;
        // Create Plugin
        const plugin = new Plugin(pluginJSON, pluginPath);
        // Check if Plugin is valid
        if (!plugin.isValid()) return;
        // Add Plugin to List
        this.#plugins.push(plugin);
        // Run Plugin
        plugin.run();
    }

    /**
     * Create Plugin Routes
     */
    createRoutes() {
        // For Each Plugin
        this.#plugins.forEach(plugin => {
            // Check if Plugin Instance has a routes function
            if (!plugin.getInstance()?.routes) return;
            // Create a new Express Router with merge params
            const router = express.Router({ mergeParams: true });
            // Call Plugin Instance routes function
            plugin.getInstance().routes(router);
            // Create Tile View
            router.get("/tile", (req, res) => { res.type("html").send(plugin.getTile()) });

            // Append Router to Plugin for easy access
            plugin.setRouter(router);

            // Create View
            // Render EJS Index File
            this.app.get(`/plugins/${plugin.getName()}`, (req, res) => {
                res.render("pages/plugin", {
                    plugin: plugin
                });
            });
            // Add Router to Express App
            this.app.use(`/plugins/${plugin.getName()}`, router);
        });
    }

    /**
     * Removes Routes from Plugin
     * @param {Plugin} plugin 
     */
    removeRoutes(plugin) {
        // Check if plugin has router
        if(!plugin.getRouter());
        // Remove All Plugin Routes
        removeRoute(plugin.getRouter(), "/*");
        // Remove Plugin View
        removeRoute(this.app, `/plugins/${plugin.getName()}`)
    }
}