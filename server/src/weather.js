const axios = require("axios");
const BASE_URL = "https://api.weather.gov";
// const BASE_URL = "https://api.weather.gov/alerts/active?area=TX"

// Map alert types -> app hazards
function extractHazards(alerts) {
    return alerts.map(alert => ({
        event: alert.properties.event,
        severity: alert.properties.severity,
        urgency: alert.properties.urgency,
        description: alert.properties.headline
    }));
}

async function getWeatherAlerts(state = "TX") {
    try {
        const response = await axios.get(
            `${BASE_URL}/alerts/active`,
            {
                params: { area: state },
                headers: {
                    "User-Agent": "(NavSense, your@email.com)"
                }
            }
        );

        const alerts = response.data.features;

        return {
            count: alerts.length,
            hazards: extractHazards(alerts)
        };

    } catch (error) {
        throw new Error("Failed to fetch weather");
    }
}

module.exports = { getWeatherAlerts };