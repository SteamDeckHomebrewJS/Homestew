/**
 * @description Shop Plugin for Homestew
 * @author SteffTek
 * @license Apache-2.0
 */

/**
 * Imports
 */

module.exports = class Plugin {
    /**
     * @override
     * Export Routes
     * @param {Router} router expressjs router
     */
    routes(router) {
        // Get Battery Report
        router.get("/report", (req, res) => {
            // Get Battery Report
            const report = getBatteryReport();
            // Send Report
            res.json(report);
        });
    }
}

/**
 * Utils
 */
const getBatteryReport = () => {
    // Execute Sub Process & wait till finished
    const { stdout, stderr } = require('child_process').spawnSync("upower", ["-i", "/org/freedesktop/UPower/devices/battery_BAT1"]);

    // Check if error
    if (stderr) return { error: true };

    // Get Output
    const report = stdout?.toString() || "";

    return {
        "model": getValue(report, "model"),
        "percentage": getValue(report, "percentage"),
        "capacity": getValue(report, "capacity"),
        "warningLevel": getValue(report, "warning-level").toUpperCase(),
        "state": getValue(report, "state").toUpperCase(),
        "energy": getValue(report, "energy"),
        "energyEmpty": getValue(report, "energy-empty"),
        "energyFull": getValue(report, "energy-full"),
        "energyFullDesign": getValue(report, "energy-full-design"),
        "energyRate": getValue(report, "energy-rate"),
        "timeToEmpty": getValue(report, "time to empty"),
        "timeToFull": getValue(report, "time to full"),
        "voltage": getValue(report, "voltage"),
    }
}

const getValue = (report, field) => {
    // Get Field '{field}:[^a-zA-Z0-9]+([a-zA-Z0-9.% ]+)'
    const regex = new RegExp(`${field}:[^a-zA-Z0-9]+([a-zA-Z0-9.% ]+)`);
    // Get Value
    const value = report.match(regex);
    // Return Value
    return value ? value[1] : "N/A";
}