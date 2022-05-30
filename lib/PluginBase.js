/**
 * @description Plugin Interface
 * @author SteffTek
 * @license Apache-2.0
 */
module.exports = class PluginBase {
    // Plugin State
    #name = null;
    #version = null;
    #valid = false;

    constructor(name, version) {
        this.#name = name.toString();
        this.#version = version.toString();

        // Check if valid
        this.#valid = this.#name && this.#version;
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

    /**
     * To Overwrite
     */

    /**
     * @overwrite
     * Create Routes for your plugin.
     * Basepath is /%pluginName%/
     * @param {Express} router a new expressJS router object
     */
    routes(router) {}
}