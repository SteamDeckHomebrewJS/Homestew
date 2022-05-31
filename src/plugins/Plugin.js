/**
 * @description Core Plugin
 * @author SteffTek
 * @license Apache-2.0
 */

/**
 * Imports
 */
const path = require('path');
const fs = require('fs');
module.exports = class Plugin {
    #mainHtml = null;
    #tileHtml = null;
    #executable = null;
    #json = null;

    #folder = null;
    #name = null;
    #version = null;
    #valid = false;

    #instance = null;

    constructor(json, folder) {
        this.#json = json;
        this.#folder = folder;
        this.#name = json.name?.toString();
        this.#version = json.version?.toString();

        // Check if valid
        this.#valid = this.#name && this.#version;

        // Check if executable exists, if so, require it
        if(fs.existsSync(path.join(folder, json.main))) {
            this.#executable = require(path.join(folder, json.main));
        }

        // Check if main.html exists, if so, load it
        if (fs.existsSync(path.join(folder, json.view))) {
            this.#mainHtml = fs.readFileSync(path.join(folder, json.view), 'utf8');
        }

        // Check if tile.html exists, if so, load it
        if (fs.existsSync(path.join(folder, json.tile))) {
            this.#tileHtml = fs.readFileSync(path.join(folder, json.tile), 'utf8');
        }
    }

    /**
     * State Methods
     */
    isValid() {
        return this.#valid;
    }

    getName() {
        return this.#name;
    }

    getVersion() {
        return this.#version;
    }

    getTile() {
        return this.#tileHtml;
    }

    getView() {
        return this.#mainHtml;
    }

    getInstance() {
        return this.#instance;
    }

    /**
     * Run
     */
    run() {
        // Check if Valid
        if (!this.isValid()) return;
        // Require Executable and create a new instance
        if (this.#executable) {
            this.#instance = new this.#executable();
        }
    }
}