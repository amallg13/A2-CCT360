
// Open-Meteo Air Quality API Integration

//Store the coordinates of each city

const cities = {
    "toronto": {
        name: "Toronto",
        latitude: 43.6532,
        longitude: -79.3832
    },

    "los-angeles": {
        name: "Los Angeles",
        latitude: 34.0522,
        longitude: -118.2437
    },

    "new-delhi": {
        name: "New Delhi",
        latitude: 28.6139,
        longitude: 77.2090
    }
};


// Get the HTML elements

const citySelect = document.getElementById("city");
const aqiValue = document.getElementById("aqi-value");
const airMessage = document.getElementById("air-quality-message");

const haze = document.getElementById("haze");
const cityView = document.getElementById("city-view");


// Display loading and error messages

function showLoading() {
    aqiValue.textContent = "Loading...";

    airMessage.textContent =
        "Checking the latest available air quality data...";
}

function showError() {
    aqiValue.textContent = "--";

    airMessage.textContent =
        "Air quality data is currently unavailable. Please try again.";

    haze.style.opacity = "0.4";
    haze.style.backgroundColor = "#928b80";

    cityView.style.backgroundColor = "#a9c7d8";

    document.body.dataset.aqiLevel = "unknown";
}


// Determine the air quality category

function getAirQuality(aqi) {

    if (aqi <= 50) {
        return {
            category: "Good",
            message: "The air is relatively clean. The view outside is clear.",
            hazeOpacity: 0.08,
            hazeColor: "#dce9e8",
            backgroundColor: "#a9d2e5",
            level: "good"
        };
    }

    else if (aqi <= 100) {
        return {
            category: "Moderate",
            message: "The air quality is moderate. A slight haze begins to appear.",
            hazeOpacity: 0.22,
            hazeColor: "#c4c2b5",
            backgroundColor: "#b6c6ca",
            level: "moderate"
        };
    }

    else if (aqi <= 150) {
        return {
            category: "Unhealthy for Sensitive Groups",
            message: "The air carries pollutants that may affect sensitive groups.",
            hazeOpacity: 0.35,
            hazeColor: "#aaa69a",
            backgroundColor: "#aab2b2",
            level: "sensitive"
        };
    }

    else if (aqi <= 200) {
        return {
            category: "Unhealthy",
            message: "The air is unhealthy. The city outside begins to disappear.",
            hazeOpacity: 0.48,
            hazeColor: "#928b80",
            backgroundColor: "#939d9e",
            level: "unhealthy"
        };
    }

    else if (aqi <= 300) {
        return {
            category: "Very Unhealthy",
            message: "Pollution levels are very high. The view is becoming difficult to see.",
            hazeOpacity: 0.65,
            hazeColor: "#77756e",
            backgroundColor: "#777f81",
            level: "very-unhealthy"
        };
    }

    else {
        return {
            category: "Hazardous",
            message: "The air quality is hazardous. The world outside is hidden behind pollution.",
            hazeOpacity: 0.80,
            hazeColor: "#555653",
            backgroundColor: "#5c6263",
            level: "hazardous"
        };
    }
}


// Change the appearance of the window

function updateWindow(airQuality) {

    // Change the amount of haze
    haze.style.opacity = airQuality.hazeOpacity;

    // Change the haze colour
    haze.style.backgroundColor = airQuality.hazeColor;

    // Change the colour of the city view
    cityView.style.backgroundColor = airQuality.backgroundColor;

    // Change the overall page colour using CSS
    document.body.dataset.aqiLevel = airQuality.level;
}


// Display the AQI information

function displayAirQuality(aqi, cityName, time) {

    const airQuality = getAirQuality(aqi);

    // Display the AQI number
    aqiValue.textContent = aqi;

    // Display the air quality category and message
    airMessage.textContent =
        cityName + ": " + airQuality.category + ". " +
        airQuality.message;

    // Update the window appearance
    updateWindow(airQuality);

    // Display the time of the measurement
    const timeElement = document.getElementById("aqi-time");

    if (timeElement) {
        timeElement.textContent = "Model data time: " + time;
    }
}


// Fetch data from Open-Meteo

let latestRequest = 0;

async function updateAirQuality(cityKey) {

    const city = cities[cityKey];

    // Check if the selected city exists
    if (!city) {
        showError();
        return;
    }

    // Give every request an ID so old responses cannot
    // overwrite data from a more recent city selection.
    const requestID = ++latestRequest;

    showLoading();

    try {

        // Create the API URL
        const url =
            `https://air-quality-api.open-meteo.com/v1/air-quality` +
            `?latitude=${city.latitude}` +
            `&longitude=${city.longitude}` +
            `&current=us_aqi` +
            `&timezone=auto`;

        // Fetch the API data
        const response = await fetch(url);

        // Check for an API error
        if (!response.ok) {
            throw new Error("Could not retrieve air quality data.");
        }

        // Convert the response into JSON
        const data = await response.json();

        // Ignore an older request if another city was selected
        if (requestID !== latestRequest) {
            return;
        }

        // Check that the AQI information exists
        if (
            !data.current ||
            data.current.us_aqi === null ||
            data.current.us_aqi === undefined
        ) {
            throw new Error("AQI data is missing.");
        }

        // Get the AQI number and measurement time
        const aqi = Math.round(data.current.us_aqi);
        const time = data.current.time;

        // Display everything on the website
        displayAirQuality(aqi, city.name, time);

        console.log(city.name + " AQI:", aqi);

    }

    catch (error) {

        // Ignore errors from outdated requests
        if (requestID !== latestRequest) {
            return;
        }

        console.error("Air Quality API Error:", error);

        showError();
    }
}


// Update data when the user selects a city

citySelect.addEventListener("change", function() {

    const selectedCity = citySelect.value;

    updateAirQuality(selectedCity);

});


// Load Toronto data when the website opens

updateAirQuality(citySelect.value);


// Make the function for person 3

window.updateAirQuality = updateAirQuality;
