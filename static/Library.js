/**
 * @description Frontend Libary for Plugins to communicate with the Homebrew Application
 * @author SteffTek
 * @license Apache-2.0
 */

/**
 * Refresh current View
 */
const refreshView = async () => {
    // Get iframe
    let iframe = document.getElementById("plugins");
    // Check
    if(!iframe) return;
    // Refresh iframe
    iframe.contentWindow.body.innerHTML = fetch(`${getBaseURL()}`).then(res => res.text());
}

/**
 * Get Current Plugin
 */
const getCurrentPlugin = () => {
    return PLUGIN_NAME || null;
}

const getBaseURL = () => {
    return BASE_URL || "http://127.0.0.1:42069";
}

/**
 * Make a GET request to the plugin
 * @returns {Promise<any>} request
 */
const get = (url, data = null) => {
    // Remove leading / from url
    url = url.replace(/^\//, "");
    // Get current plugin
    const plugin = getCurrentPlugin();
    // Check
    if(!plugin) return;
    // Fetch to /${plugin}/${url}
    return fetch(`${getBaseURL()}/${plugin}/${url}?${data ? new URLSearchParams(data) : null}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json());
}

/**
 * Make a request to the plugin
 */
const request = (url, type = "POST", data = null) => {
    // Remove leading / from url
    url = url.replace(/^\//, "");
    // Get current plugin
    const plugin = getCurrentPlugin();
    // Check
    if(!plugin) return;
    // Fetch to /${plugin}/${url}
    return fetch(`${getBaseURL()}/${plugin}/${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
}

/**
 * Make a POST request to the plugin
 */
const post = (url, data = null) => {
    // Forward to request
    return request(url, "POST", data);
}

/**
 * Make a PUT request to the plugin
 */
const put = (url, data = null) => {
    // Forward to request
    return request(url, "PUT", data);
}

/**
 * Make a DELETE request to the plugin
 */
const remove = (url, data = null) => {
    // Forward to request
    return request(url, "DELETE", data);
}

/**
 * Make a PATCH request to the plugin
 */
const patch = (url, data = null) => {
    // Forward to request
    return request(url, "PATCH", data);
}