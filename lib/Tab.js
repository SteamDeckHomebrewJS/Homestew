/**
 * @description Wrapper for interacting with tabs
 * @author SteffTek
 * @license Apache-2.0
 */

/**
 * Imports
 */
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const packageInfo = require("../package.json");

module.exports = class Tab {
    /**
     * Wrap a tab
     * @param {string} id tab id
     * @param {string} type tab type
     * @param {string} title tab title
     * @param {string} url tab url in browser
     * @param {string} webSocketDebuggerUrl websocket debugger for injecting code
     */
    constructor(id, type, title, url, webSocketDebuggerUrl) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.url = url;
        this.webSocketDebuggerUrl = webSocketDebuggerUrl;
    }

    /**
     * Code Injection
     */
    async inject() {
        // SET BASE URL
        await this.execute(`const BASE_URL = "http://${ process.env.HOST || '127.0.0.1' }:${ process.env.PORT || '42069' }"; const HOMESTEW_VERSION = "${packageInfo.version}"`);
        // Get Menu.js libary
        let menuLib = fs.readFileSync(path.join(__dirname, 'Menu.js'), 'utf8');
        // Inject code & Create IFrame
        await this.execute(menuLib, true);
    }

    /**
     * Check Elements
     * @param {string} elementId HTML Id of the element
     * @returns {boolean}
     */
    async hasElement(elementId) {
        const result = await this.execute(`document.getElementById('${elementId}') != null`);
        // Check Result
        if(!result?.result?.value) return false;
        return true;
    }

    /**
     * Execute in Tab
     */
    async execute(js, isAsync = true) {
        // Connect to tab
        const connection = await this.#connect().catch((err) => {
            // Close
            console.error(err);
            this.#close();
            return;
        });

        // Create Payload
        const payload = {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": js,
                "userGesture": true,
                "awaitPromise": isAsync
            }
        };

        // Execute
        const result = await this.#sendCommand(connection, payload, true);

        // Close connection
        this.#close(connection);

        // Return result
        return result;
    }

    /**
     * Request a resource from the steam client
     * @param {string} url request url
     * @returns {string|null} requested data
     */
    async getSteamResource(url) {
        // Format URL to be BASE / URL, replace leading slash
        const formattedUrl = `https://steamloopback.host/${url.replace(/^\//, '')}`;
        const result = await this.execute(`(async function test() {{ return await (await fetch("${formattedUrl}")).text() }})()`, true);
        return result?.result?.value || null;
    }

    /**
     * Connection
     * @returns {WebSocket} connection
     */
    #connect() {
        return new Promise((resolve, reject) => {
            // Connect to websocket url of tab
            const connection = new WebSocket(this.webSocketDebuggerUrl);
            // On open
            connection.onopen = () => {
                console.log(`Connected to ${this.webSocketDebuggerUrl}`);
                resolve(connection);
            };
            // On error
            connection.onerror = (err) => {
                console.log(`Error: ${err}`);
                reject(err);
            };
        });
    }

    #close(connection) {
        // Close connection
        connection.close();
        // Remove connection
        connection = null;
    }

    #sendCommand(connection, command, receive = true) {
        if(!connection) return null;
        return new Promise((resolve) => {
            console.log(`Sending Command to Tab ${this.title} (${JSON.stringify(command)})`);
            // Send command
            connection.send(JSON.stringify(command));
            if(!receive) return null;
            // On message
            connection.onmessage = (message) => {
                // Parse message
                const data = JSON.parse(message.data);
                // Return message
                resolve(data.result);
            };
        });
    }
}