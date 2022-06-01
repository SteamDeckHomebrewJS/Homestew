/**
 * Remove a route from a router stack
 */
module.exports = (app, route, method = null) => {

    // Get all Routes from app
    const stack = app._router.stack;

    // Filter all routes
    const filtered = stack.filter(layer => {
        // Check if route matches
        const routeTest = route.endsWith("*") ? layer.route?.path.startsWith(route.replaceAll("*","")) : layer.regexp.test(route);
        // Check if Method is included
        const methodTest = method ? layer.route.methods.includes(method) : true;
        return !routeTest || !methodTest;
    });

    // Set new App Stack
    app._router.stack = filtered;
}