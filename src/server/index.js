/**
 * @description ExpressJS Server for better communication between the Homebrew and the Plugins
 * @author SteffTek
 * @license Apache-2.0
 * @param {object} app express app
 * @param {object} homebrew homebrew instance
 */
module.exports = (app, homebrew) => {

    /**
     * Main Page
     */
    app.get('/', (req, res) => {
        // Render EJS Index File
        res.render("pages/index", {
            plugins: []
        });
    });

    /**
     * @description Plugin Management
     */


    /**
     * @description Get Steam Resources from QuickAccess Tab
     */
    app.get("/steam/*", async (req, res) => {
        // Get Tab
        const tab = homebrew.injection.getTab("QuickAccess");
        if(!tab) return res.status(404).send("QuickAccess Menu not found.");
        // Get Route without /steam
        const resource = req.url.replace("/steam", "");
        // Get Resource
        const result = await tab.getSteamResource(resource);
        // Send
        res.send(result);
    });

    /**
     * @description custom_fonts endpoint redirection
     */
    app.get("/custom_fonts/*", async (req, res) => {
        // Get Tab
        const tab = homebrew.injection.getTab("QuickAccess");
        if(!tab) return res.status(404).send("QuickAccess Menu not found.");
        // Get Resource
        const result = await tab.getSteamResource(req.url);
        // Send
        res.send(result);
    });
}