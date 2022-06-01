/**
 * @description Menu Overwrite from Injection
 * @author SteffTek
 * @license Apache-2.0
 */

/**
 * Icon by Font Awesome
 * https://fontawesome.com/icons/puzzle-piece?s=solid
 */
const PLUGIN_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" fill="currentColor" class="bi bi-plugin" viewBox="0 0 512 512">
        <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path d="M512 288c0 35.35-21.49 64-48 64c-32.43 0-31.72-32-55.64-32C394.9 320 384 330.9 384 344.4V480c0 17.67-14.33 32-32 32h-71.64C266.9 512 256 501.1 256 487.6C256 463.1 288 464.4 288 432c0-26.51-28.65-48-64-48s-64 21.49-64 48c0 32.43 32 31.72 32 55.64C192 501.1 181.1 512 167.6 512H32c-17.67 0-32-14.33-32-32v-135.6C0 330.9 10.91 320 24.36 320C48.05 320 47.6 352 80 352C106.5 352 128 323.3 128 288S106.5 223.1 80 223.1c-32.43 0-31.72 32-55.64 32C10.91 255.1 0 245.1 0 231.6v-71.64c0-17.67 14.33-31.1 32-31.1h135.6C181.1 127.1 192 117.1 192 103.6c0-23.69-32-23.24-32-55.64c0-26.51 28.65-47.1 64-47.1s64 21.49 64 47.1c0 32.43-32 31.72-32 55.64c0 13.45 10.91 24.36 24.36 24.36H352c17.67 0 32 14.33 32 31.1v71.64c0 13.45 10.91 24.36 24.36 24.36c23.69 0 23.24-32 55.64-32C490.5 223.1 512 252.7 512 288z"/>
    </svg>
`;

/**
 * Top level function that will be executed
 */
(() => {
    /**
     * MENU SETUP
     */
    // Get all tabs
    let tabs = document.getElementsByClassName("quickaccessmenu_TabContentColumn_2z5NL Panel Focusable")[0];
    // Set the last tab to our new icon
    tabs.children[tabs.children.length - 1].innerHTML = PLUGIN_ICON;
    // Get pages
    let pages = document.getElementsByClassName("quickaccessmenu_AllTabContents_2yKG4 quickaccessmenu_Down_3rR0o")[0];
    // get the last page
    let page = pages.children[pages.children.length - 1];
    // Create Iframe as page content
    page.innerHTML =  `<iframe id="plugins" style="border: none; width: 100%; height: 100%;" src="${BASE_URL}"></iframe>`;
    // Create A section at the Bottom with a reload button
    page.innerHTML += `
    <div style="width: 100%; height: 40px; border-top: 2px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; color: rgba(255,255,255,0.5);">
        <!-- VERSION -->
        <p style="margin: 10px;">${HOMESTEW_VERSION}</p>
        <!-- Reload Button -->
        <div class="Focusable" style="margin: 10px; width: 20px; height: 20px;" onclick="reloadPlugins()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                <path fill="white" stroke="white;" opacity="0.5" d="M496 48V192c0 17.69-14.31 32-32 32H320c-17.69 0-32-14.31-32-32s14.31-32 32-32h63.39c-29.97-39.7-77.25-63.78-127.6-63.78C167.7 96.22 96 167.9 96 256s71.69 159.8 159.8 159.8c34.88 0 68.03-11.03 95.88-31.94c14.22-10.53 34.22-7.75 44.81 6.375c10.59 14.16 7.75 34.22-6.375 44.81c-39.03 29.28-85.36 44.86-134.2 44.86C132.5 479.9 32 379.4 32 256s100.5-223.9 223.9-223.9c69.15 0 134 32.47 176.1 86.12V48c0-17.69 14.31-32 32-32S496 30.31 496 48z"/>
            </svg>
        </div>
    </div>
    `
})();

/**
 * Refresh current View
 */
const refreshView = async () => {
    // Get iframe
    let iframe = document.getElementById("plugins");
    // Check
    if(!iframe) return;
    // Refresh iframe
    iframe.contentWindow.location.reload();
}

/**
 * Reload the Plugin Loader
 */
const reloadPlugins = async () => {
    // Create a Request for the Plugin Loader to refresh everything
    await fetch(`${BASE_URL}/reload`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    // Go Back to the Main Page
    // Get iframe
    let iframe = document.getElementById("plugins");
    if(!iframe) return;
    iframe.contentWindow.location.href = BASE_URL;
    // Reload the view
    this.refreshView();
}