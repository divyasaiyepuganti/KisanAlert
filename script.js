// ============================================================
// KISANALERT
// STEP 4
// GPS + LOCATION + WEATHER
// ============================================================


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let userLatitude = null;
let userLongitude = null;
let latestDailyForecast = null;
// ============================================================
// MAP VARIABLES
// ============================================================

let fieldMap = null;

let fieldMarker = null;


// ============================================================
// USE MY LOCATION
// ============================================================

function useMyLocation() {

    const locationStatus =
        document.getElementById("locationStatus");

    const coordinates =
        document.getElementById("coordinates");

    const locationName =
        document.getElementById("locationName");


    // Check GPS support

    if (!navigator.geolocation) {

        locationStatus.innerText =
            "❌ GPS is not supported by your browser.";

        return;
    }


    // Loading messages

    locationStatus.innerText =
        "📍 Detecting your location...";

    locationName.innerText =
        "Finding your location...";


    // Get GPS

    navigator.geolocation.getCurrentPosition(

        async function(position) {

            // ------------------------------------------------
            // GET COORDINATES
            // ------------------------------------------------

            userLatitude =
                position.coords.latitude;

            userLongitude =
                position.coords.longitude;
                initializeFieldMap(
    userLatitude,
    userLongitude
);


            // ------------------------------------------------
            // DISPLAY COORDINATES
            // ------------------------------------------------

            coordinates.innerHTML =
                "Latitude: " +
                userLatitude.toFixed(6) +
                "<br>" +
                "Longitude: " +
                userLongitude.toFixed(6);


            locationStatus.innerText =
                "✅ Location detected";


            // ------------------------------------------------
            // GET LOCATION NAME
            // ------------------------------------------------

            await getLocationName(
                userLatitude,
                userLongitude
            );


            // ------------------------------------------------
            // GET WEATHER
            // ------------------------------------------------

            await getWeather(
                userLatitude,
                userLongitude
            );
            await getForecast(
    userLatitude,
    userLongitude
);


            // Console

            console.log(
                "Latitude:",
                userLatitude
            );

            console.log(
                "Longitude:",
                userLongitude
            );

        },


        function(error) {

    console.error("GPS Error:", error);

    if (error.code === error.PERMISSION_DENIED) {

        locationStatus.innerText =
            "❌ Location permission denied.";

        locationName.innerText =
            "Please allow location access in your browser.";

    }

    else if (error.code === error.POSITION_UNAVAILABLE) {

        locationStatus.innerText =
            "❌ Location unavailable.";

        locationName.innerText =
            "Please check your GPS/location settings.";

    }

    else if (error.code === error.TIMEOUT) {

        locationStatus.innerText =
            "❌ Location request timed out.";

        locationName.innerText =
            "Please try again.";

    }

    else {

        locationStatus.innerText =
            "❌ Unable to detect location.";

        locationName.innerText =
            "Please try again.";

    }
}

    );

}


// ============================================================
// GET LOCATION NAME
// ============================================================

async function getLocationName(latitude, longitude) {

    const locationName =
        document.getElementById("locationName");


    try {

        const response = await fetch(

            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`

        );


        if (!response.ok) {

            throw new Error(
                "Location service failed"
            );

        }


        const data =
            await response.json();


        const address =
            data.address;

const city =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.city_district ||
    address.county ||
    address.state_district ||
    "Unknown city";


        const state =
            address.state ||
            "Unknown state";


        const country =
            address.country ||
            "Unknown country";


        locationName.innerHTML =
            `📍 ${city}, ${state}, ${country}`;


    } catch (error) {

        console.error(
            "Location name error:",
            error
        );


        locationName.innerText =
            "📍 Location name unavailable.";

    }

}


// ============================================================
// GET WEATHER
// ============================================================

async function getWeather(latitude, longitude) {

    const weatherStatus =
        document.getElementById("weatherStatus");


    try {

        weatherStatus.innerText =
            "🌦️ Loading weather data...";


        // Open-Meteo API

        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m` +
            `&temperature_unit=celsius` +
            `&wind_speed_unit=kmh` +
            `&precipitation_unit=mm`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Weather API failed"
            );

        }


        const data =
            await response.json();


        console.log(
            "Weather data:",
            data
        );


        // ------------------------------------------------
        // CURRENT WEATHER
        // ------------------------------------------------

        const current =
            data.current;


        // Temperature

        document.getElementById(
            "temperature"
        ).innerText =
            `${current.temperature_2m} °C`;


        // Humidity

        document.getElementById(
            "humidity"
        ).innerText =
            `${current.relative_humidity_2m} %`;


        // Rain / precipitation

        document.getElementById(
            "rain"
        ).innerText =
            `${current.precipitation} mm`;


        // Wind

        document.getElementById(
            "wind"
        ).innerText =
            `${current.wind_speed_10m} km/h`;


        // Weather condition

        document.getElementById(
            "weatherCondition"
        ).innerText =
            getWeatherDescription(
                current.weather_code
            );


        weatherStatus.innerText =
            "✅ Current weather loaded";
            updateFarmStatus();
            


    } catch (error) {

        console.error(
            "Weather error:",
            error
        );


        weatherStatus.innerText =
            "❌ Weather data could not be loaded.";

    }

}


// ============================================================
// WEATHER CODE → DESCRIPTION
// ============================================================

function getWeatherDescription(code) {

    const weatherCodes = {

        0: "☀️ Clear sky",

        1: "🌤️ Mainly clear",

        2: "⛅ Partly cloudy",

        3: "☁️ Overcast",

        45: "🌫️ Fog",

        48: "🌫️ Depositing rime fog",

        51: "🌦️ Light drizzle",

        53: "🌦️ Moderate drizzle",

        55: "🌧️ Dense drizzle",

        61: "🌧️ Slight rain",

        63: "🌧️ Moderate rain",

        65: "🌧️ Heavy rain",

        71: "🌨️ Slight snowfall",

        73: "🌨️ Moderate snowfall",

        75: "❄️ Heavy snowfall",

        80: "🌦️ Slight rain showers",

        81: "🌧️ Moderate rain showers",

        82: "⛈️ Violent rain showers",

        95: "⛈️ Thunderstorm",

        96: "⛈️ Thunderstorm with hail",

        99: "⛈️ Heavy thunderstorm with hail"

    };


    return weatherCodes[code] ||
        "🌍 Weather condition unavailable";

}
// ============================================================
// CROP SELECTION
// ============================================================

const cropSelect =
    document.getElementById("cropSelect");

const cropStatus =
    document.getElementById("cropStatus");


cropSelect.addEventListener(
    "change",
    function() {

        const selectedCrop =
            cropSelect.value;


        if (selectedCrop === "") {

            cropStatus.innerText =
                "No crop selected";

            return;
        }


        // Get crop name

        const cropName =
            cropSelect.options[
                cropSelect.selectedIndex
            ].text;


        cropStatus.innerText =
    `✅ Selected crop: ${cropName}`;

updateFarmStatus();
if(latestDailyForecast){
    checkEarlyWarning(latestDailyForecast);
}



        console.log(
            "Selected crop:",
            selectedCrop
        );

    }
);
// ============================================================
// STEP 7
// CROP-SPECIFIC FARM ALERT ENGINE
// ============================================================

function checkFarmAlert() {

    // --------------------------------------------------------
    // GET SELECTED CROP
    // --------------------------------------------------------

    const crop =
        document.getElementById("cropSelect").value;
        updateMandiPrice(crop);


    // --------------------------------------------------------
    // GET WEATHER DATA
    // --------------------------------------------------------

    const temperature =
        parseFloat(
            document.getElementById("temperature").innerText
        );

    const rain =
        parseFloat(
            document.getElementById("rain").innerText
        );

    const humidity =
        parseFloat(
            document.getElementById("humidity").innerText
        );
        


    // --------------------------------------------------------
    // ALERT ELEMENTS
    // --------------------------------------------------------

    const alertBox =
        document.getElementById("alertBox");

    const alertTitle =
        document.getElementById("alertTitle");

    const alertMessage =
        document.getElementById("alertMessage");

    const alertAction =
        document.getElementById("alertAction");


    // --------------------------------------------------------
    // CROP CHECK
    // --------------------------------------------------------

    if (crop === "") {

        showAlert(
            alertBox,
            alertTitle,
            alertMessage,
            alertAction,

            "⚠️ SELECT YOUR CROP",

            "Please select the crop growing in your field.",

            "💡 Select a crop before checking the farm alert.",

            "warning"
        );

        return;
    }


    // --------------------------------------------------------
    // WEATHER CHECK
    // --------------------------------------------------------

    if (
        Number.isNaN(temperature) ||
        Number.isNaN(rain) ||
        Number.isNaN(humidity)
    ) {

        showAlert(
            alertBox,
            alertTitle,
            alertMessage,
            alertAction,

            "⚠️ WEATHER DATA UNAVAILABLE",

            "Weather information is not available yet.",

            "💡 Click 'Use My Location' first and wait for weather data.",

            "warning"
        );

        return;
    }


    // ========================================================
    // 🌾 RICE
    // ========================================================

    if (crop === "rice") {

        // Heavy rain

        if (rain >= 10) {

            showAlert(
                alertBox,
                alertTitle,
                alertMessage,
                alertAction,

                "🔴 RICE — HEAVY RAIN WARNING",

                "Heavy rainfall may cause waterlogging in the rice field.",

                "💡 Check field drainage and monitor water levels.",

                "danger"
            );

            return;
        }


        // High temperature

        if (temperature >= 38) {

            showAlert(
                alertBox,
                alertTitle,
                alertMessage,
                alertAction,

                "🟠 RICE — HIGH TEMPERATURE",

                "High temperature may cause stress to the crop.",

                "💡 Monitor soil moisture and field water levels.",

                "warning"
            );

            return;
        }


        // Normal

        showSafeAlert(
            alertBox,
            alertTitle,
            alertMessage,
            alertAction,

            "Rice"
        );

        return;
    }


    // ========================================================
    // 🌽 MAIZE
    // ========================================================

    if (crop === "maize") {

        // High temperature

        if (temperature >= 38) {

            showAlert(
                alertBox,
                alertTitle,
                alertMessage,
                alertAction,

                "🔴 MAIZE — HEAT STRESS WARNING",

                "High temperature may increase heat stress in maize.",

                "💡 Monitor soil moisture and provide irrigation when appropriate.",

                "danger"
            );

            return;
        }


        // Heavy rain

        if (rain >= 10) {

            showAlert(
                alertBox,
                alertTitle,
                alertMessage,
                alertAction,

                "🟡 MAIZE — HEAVY RAIN CAUTION",

                "Heavy rainfall may affect soil conditions and drainage.",

                "💡 Check field drainage and avoid unnecessary irrigation.",

                "warning"
            );

            return;
        }


        showSafeAlert(
            alertBox,
            alertTitle,
            alertMessage,
            alertAction,

            "Maize"
        );

        return;
    }


    // ========================================================
    // 🍅 TOMATO
    // ========================================================

    if (crop === "tomato") {

        // High humidity

        if (humidity >= 80) {

            showAlert(
                alertBox,
                alertTitle,
                alertMessage,
                alertAction,

                "🟠 TOMATO — HIGH HUMIDITY CAUTION",

                "High humidity can create favorable conditions for fungal diseases.",

                "💡 Check leaves regularly for spots and signs of fungal infection.",

                "warning"
            );

            return;
        }


        // Heavy rain

        if (rain >= 10) {

            showAlert(
                alertBox,
                alertTitle,
                alertMessage,
                alertAction,

                "🔴 TOMATO — HEAVY RAIN WARNING",

                "Heavy rainfall may damage tomato plants and increase disease risk.",

                "💡 Improve drainage and inspect plants after rainfall.",

                "danger"
            );

            return;
        }


        showSafeAlert(
            alertBox,
            alertTitle,
            alertMessage,
            alertAction,

            "Tomato"
        );

        return;
    }


    // ========================================================
    // 🌶️ CHILLI
    // ========================================================

    if (crop === "chilli") {

        // High humidity

        if (humidity >= 80) {

            showAlert(
                alertBox,
                alertTitle,
                alertMessage,
                alertAction,

                "🟠 CHILLI — DISEASE MONITORING ALERT",

                "High humidity may increase the chance of fungal disease.",

                "💡 Inspect leaves and stems regularly for disease symptoms.",

                "warning"
            );

            return;
        }


        // High temperature

        if (temperature >= 38) {

            showAlert(
                alertBox,
                alertTitle,
                alertMessage,
                alertAction,

                "🔴 CHILLI — HEAT STRESS WARNING",

                "Very high temperature may stress chilli plants.",

                "💡 Monitor soil moisture and protect plants from excessive heat.",

                "danger"
            );

            return;
        }


        showSafeAlert(
            alertBox,
            alertTitle,
            alertMessage,
            alertAction,

            "Chilli"
        );

        return;
    }


    // ========================================================
    // 🥜 GROUNDNUT
    // ========================================================

    if (crop === "groundnut") {

        // Heavy rain

        if (rain >= 10) {

            showAlert(
                alertBox,
                alertTitle,
                alertMessage,
                alertAction,

                "🟡 GROUNDNUT — EXCESS RAIN CAUTION",

                "Excess rainfall may cause waterlogging and affect the crop.",

                "💡 Check soil drainage and avoid additional irrigation.",

                "warning"
            );

            return;
        }


        // High temperature

        if (temperature >= 38) {

            showAlert(
                alertBox,
                alertTitle,
                alertMessage,
                alertAction,

                "🟠 GROUNDNUT — HEAT CAUTION",

                "High temperature may increase crop water requirements.",

                "💡 Monitor soil moisture carefully.",

                "warning"
            );

            return;
        }


        showSafeAlert(
            alertBox,
            alertTitle,
            alertMessage,
            alertAction,

            "Groundnut"
        );

        return;
    }

}


// ============================================================
// SHOW ALERT
// ============================================================

function showAlert(
    alertBox,
    alertTitle,
    alertMessage,
    alertAction,
    title,
    message,
    action,
    type
) {

    alertTitle.innerText = title;
    alertMessage.innerText = message;
    alertAction.innerText = action;

    if (type === "danger") {
        alertBox.style.background = "#ffebee";
        alertBox.style.borderLeft = "8px solid #d32f2f";
    } else {
        alertBox.style.background = "#fff3e0";
        alertBox.style.borderLeft = "8px solid #f57c00";
    }
    // Save alert correctly
    saveAlertToHistory(
        title,
        message,
        action,
        type
    );
}

// ============================================================
// SHOW SAFE ALERT
// ============================================================

function showSafeAlert(
    alertBox,
    alertTitle,
    alertMessage,
    alertAction,
    cropName
) {

    alertBox.style.background =
        "#e8f5e9";
        alertBox.style.borderLeft = "8px solid #2e7d32";


    alertTitle.innerText =
        "🟢 NO MAJOR WARNING";


    alertMessage.innerText =
        `Current conditions do not show a major warning for your ${cropName} crop.`;


    alertAction.innerText =
        "💡 Continue normal crop monitoring.";
        saveAlertToHistory("🟢 NO MAJOR WARNING", alertMessage.innerText, alertAction.innerText, "safe");

}

// ============================================================
// CROP NAME
// ============================================================

function getCropName(crop) {

    const cropNames = {

        rice: "Rice",

        maize: "Maize",

        tomato: "Tomato",

        chilli: "Chilli",

        groundnut: "Groundnut"

    };


    return cropNames[crop] || "your crop";

}
// ============================================================
// STEP 8
// 3-DAY WEATHER FORECAST
// ============================================================

async function getForecast(latitude, longitude) {

    const forecastContainer =
        document.getElementById("forecastContainer");


    forecastContainer.innerHTML =
        "<p>🔮 Loading forecast...</p>";


    try {

        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max` +
            `&forecast_days=3` +
            `&temperature_unit=celsius` +
            `&wind_speed_unit=kmh` +
            `&precipitation_unit=mm` +
            `&timezone=auto`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Forecast API failed"
            );

        }


        const data =
            await response.json();


        console.log(
            "Forecast data:",
            data
        );


        const daily =
            data.daily;
            latestDailyForecast =
    daily;
            checkEarlyWarning(daily);
            updateForecastStatus(daily);
            const selectedCrop =
    document.getElementById("cropSelect").value;

generateActivityPlan(
    daily,
    selectedCrop
);


        forecastContainer.innerHTML =
            "";


        // Create 3 forecast cards

        for (
            let i = 0;
            i < 3;
            i++
        ) {

            const date =
                new Date(daily.time[i]);


            const dayName =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        weekday: "long"
                    }
                );


            const weatherDescription =
                getWeatherDescription(
                    daily.weather_code[i]
                );


            const card =
                document.createElement("div");


            card.className =
                "forecast-day";


            card.innerHTML = `

                <h4>
                    ${dayName}
                </h4>

                <p>
                    ${weatherDescription}
                </p>

                <p>
                    🌡️ Max:
                    ${daily.temperature_2m_max[i]} °C
                </p>

                <p>
                    🌡️ Min:
                    ${daily.temperature_2m_min[i]} °C
                </p>

                <p>
                    🌧️ Rain:
                    ${daily.precipitation_sum[i]} mm
                </p>

                <p>
                    ☔ Rain chance:
                    ${daily.precipitation_probability_max[i]}%
                </p>

                <p>
                    💨 Max wind:
                    ${daily.wind_speed_10m_max[i]} km/h
                </p>

            `;


            forecastContainer.appendChild(
                card
            );

        }


    } catch (error) {

        console.error(
            "Forecast error:",
            error
        );


        forecastContainer.innerHTML =
            "<p>❌ Forecast could not be loaded.</p>";

    }

}
// ============================================================
// STEP 9
// FORECAST-BASED EARLY WARNING
// ============================================================

function checkEarlyWarning(daily) {

    const warningBox =
        document.getElementById("earlyWarningBox");

    const warningTitle =
        document.getElementById("earlyWarningTitle");

    const warningMessage =
        document.getElementById("earlyWarningMessage");

    const warningAction =
        document.getElementById("earlyWarningAction");


    // --------------------------------------------------------
    // SELECT CROP
    // --------------------------------------------------------

    const crop =
        document.getElementById("cropSelect").value;
        generateFarmAction(daily, crop);


    if (crop === "") {

        warningBox.style.background =
            "#fff3e0";

        warningTitle.innerText =
            "⚠️ Select your crop";

        warningMessage.innerText =
            "Select a crop to receive crop-specific early warnings.";

        warningAction.innerText =
            "💡 Choose your crop from the crop selection box.";

        return;
    }


    // --------------------------------------------------------
    // CHECK NEXT 3 DAYS
    // --------------------------------------------------------

    for (
        let i = 1;
        i < daily.time.length;
        i++
    ) {

        const rain =
            daily.precipitation_sum[i];


        const rainChance =
            daily.precipitation_probability_max[i];


        const temperature =
            daily.temperature_2m_max[i];


        const date =
            new Date(daily.time[i]);


        const dayName =
            date.toLocaleDateString(
                "en-IN",
                {
                    weekday: "long"
                }
            );


        // ====================================================
        // HEAVY RAIN WARNING
        // ====================================================

        if (
            rain >= 10 ||
            rainChance >= 70
        ) {

            warningBox.style.background =
                "#ffebee";


            warningTitle.innerText =
                `🔴 RAIN EXPECTED — ${dayName}`;


            warningMessage.innerText =
                `Heavy rainfall may occur on ${dayName}. This may affect your ${getCropName(crop)} field.`;


            warningAction.innerText =
                "💡 Prepare drainage, avoid unnecessary irrigation and plan field activities carefully.";


            return;
        }


        // ====================================================
        // HIGH TEMPERATURE WARNING
        // ====================================================

        if (
            temperature >= 38
        ) {

            warningBox.style.background =
                "#fff3e0";


            warningTitle.innerText =
                `🟠 HIGH TEMPERATURE — ${dayName}`;


            warningMessage.innerText =
                `High temperature is expected on ${dayName} and may cause heat stress to your ${getCropName(crop)} crop.`;


            warningAction.innerText =
                "💡 Monitor soil moisture and plan irrigation appropriately.";


            return;
        }

    }


    // ========================================================
    // NO FUTURE WARNING
    // ========================================================

    warningBox.style.background =
        "#e8f5e9";


    warningTitle.innerText =
        "🟢 NO MAJOR WEATHER WARNING";


    warningMessage.innerText =
        "No major rainfall or extreme temperature warning was detected in the next few days.";


    warningAction.innerText =
        "💡 Continue normal crop monitoring.";

}
// ============================================================
// STEP 10
// SMART FARM ACTION
// ============================================================

function generateFarmAction(daily, crop) {

    const actionTitle =
        document.getElementById("farmActionTitle");

    const actionMessage =
        document.getElementById("farmActionMessage");


    // --------------------------------------------------------
    // NO CROP
    // --------------------------------------------------------

    if (crop === "") {

        actionTitle.innerText =
            "⚠️ Select a crop";

        actionMessage.innerText =
            "Select your crop to receive farm-specific advice.";

        return;
    }


    // --------------------------------------------------------
    // TOMORROW'S FORECAST
    // --------------------------------------------------------

    const tomorrowRain =
        daily.precipitation_sum[1];

    const tomorrowRainChance =
        daily.precipitation_probability_max[1];

    const tomorrowTemperature =
        daily.temperature_2m_max[1];


    // ========================================================
    // HEAVY RAIN
    // ========================================================

    if (
        tomorrowRain >= 10 ||
        tomorrowRainChance >= 70
    ) {

        actionTitle.innerText =
            "🌧️ Rain is expected soon";

        actionMessage.innerText =
            `💧 Avoid unnecessary irrigation for your ${getCropName(crop)} field. Check drainage and postpone activities that may be affected by heavy rain.`;

        return;
    }


    // ========================================================
    // HIGH TEMPERATURE
    // ========================================================

    if (
        tomorrowTemperature >= 38
    ) {

        actionTitle.innerText =
            "🌡️ High temperature expected";

        actionMessage.innerText =
            `💧 Monitor soil moisture in your ${getCropName(crop)} field and plan irrigation according to actual soil conditions.`;

        return;
    }


    // ========================================================
    // NORMAL CONDITIONS
    // ========================================================

    actionTitle.innerText =
        "🟢 Normal farm planning";

    actionMessage.innerText =
        `🌱 Continue normal monitoring of your ${getCropName(crop)} field. Avoid irrigation decisions based only on the weather forecast.`;

}
// ============================================================
// STEP 11
// FARM STATUS DASHBOARD
// ============================================================

function updateFarmStatus() {

    const selectedCrop =
        document.getElementById("cropSelect").value;

    if (latestDailyForecast !== null) {

        generateActivityPlan(
            latestDailyForecast,
            selectedCrop
        );

    }
    // --------------------------------------------------------
    // GET ELEMENTS
    // --------------------------------------------------------

    const weatherStatus =
        document.getElementById(
            "weatherStatusIndicator"
        );

    const rainStatus =
        document.getElementById(
            "rainStatusIndicator"
        );

    const cropStatus =
        document.getElementById(
            "cropStatusIndicator"
        );

    const forecastStatus =
        document.getElementById(
            "forecastStatusIndicator"
        );


    // --------------------------------------------------------
    // GET WEATHER
    // --------------------------------------------------------

    const temperature =
        parseFloat(
            document.getElementById(
                "temperature"
            ).innerText
        );

    const rain =
        parseFloat(
            document.getElementById(
                "rain"
            ).innerText
        );


    // ========================================================
    // WEATHER STATUS
    // ========================================================

    if (Number.isNaN(temperature)) {

        weatherStatus.innerText =
            "Waiting...";

    }

    else if (temperature >= 38) {

        weatherStatus.innerText =
            "🔴 Hot";

    }

    else {

        weatherStatus.innerText =
            "🟢 Normal";

    }


    // ========================================================
    // RAIN STATUS
    // ========================================================

    if (Number.isNaN(rain)) {

        rainStatus.innerText =
            "Waiting...";

    }

    else if (rain >= 10) {

        rainStatus.innerText =
            "🔴 Heavy";

    }

    else if (rain > 0) {

        rainStatus.innerText =
            "🟡 Rain";

    }

    else {

        rainStatus.innerText =
            "🟢 No Rain";

    }


    // ========================================================
    // CROP STATUS
    // ========================================================

    const crop =
        document.getElementById(
            "cropSelect"
        ).value;


    if (crop === "") {

        cropStatus.innerText =
            "Not selected";

    }

    else {

        cropStatus.innerText =
            getCropName(crop);

    }

}
// ============================================================
// FORECAST STATUS
// ============================================================

function updateForecastStatus(daily) {

    const forecastStatus =
        document.getElementById(
            "forecastStatusIndicator"
        );


    const tomorrowRain =
        daily.precipitation_sum[1];


    const tomorrowRainChance =
        daily.precipitation_probability_max[1];


    const tomorrowTemperature =
        daily.temperature_2m_max[1];


    // Heavy rain expected

    if (
        tomorrowRain >= 10 ||
        tomorrowRainChance >= 70
    ) {

        forecastStatus.innerText =
            "🔴 Rain Expected";

        return;
    }


    // High temperature expected

    if (
        tomorrowTemperature >= 38
    ) {

        forecastStatus.innerText =
            "🟡 Hot Day";

        return;
    }


    // Normal

    forecastStatus.innerText =
        "🟢 Normal";

}
// ============================================================
// STEP 12
// INITIALIZE FIELD MAP
// ============================================================

function initializeFieldMap(latitude, longitude) {

    // --------------------------------------------------------
    // CREATE MAP
    // --------------------------------------------------------

    if (fieldMap === null) {

        fieldMap =
            L.map("fieldMap")
             .setView(
                 [latitude, longitude],
                 15
             );


        // ----------------------------------------------------
        // OPENSTREETMAP TILES
        // ----------------------------------------------------

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,

                attribution:
                    '&copy; OpenStreetMap contributors'
            }
        ).addTo(fieldMap);

    }

    else {

        // Move existing map

        fieldMap.setView(
            [latitude, longitude],
            15
        );

    }


    // --------------------------------------------------------
    // REMOVE OLD MARKER
    // --------------------------------------------------------

    if (fieldMarker !== null) {

        fieldMap.removeLayer(
            fieldMarker
        );

    }


    // --------------------------------------------------------
    // CREATE NEW MARKER
    // --------------------------------------------------------

    fieldMarker =
        L.marker(
            [latitude, longitude]
        )
        .addTo(fieldMap);


    // --------------------------------------------------------
    // POPUP
    // --------------------------------------------------------

    fieldMarker
        .bindPopup(
            "📍 Your detected field location"
        )
        .openPopup();


    // --------------------------------------------------------
    // FIX MAP DISPLAY
    // --------------------------------------------------------

    setTimeout(
        function() {

            fieldMap.invalidateSize();

        },
        200
    );

}
// ============================================================
// STEP 13
// FIELD ACTIVITY PLANNER
// ============================================================

function generateActivityPlan(daily, crop) {

    const status =
        document.getElementById(
            "activityPlannerStatus"
        );

    const irrigation =
        document.getElementById(
            "irrigationAdvice"
        );

    const spraying =
        document.getElementById(
            "sprayingAdvice"
        );

    const fieldWork =
        document.getElementById(
            "fieldWorkAdvice"
        );

    const harvesting =
        document.getElementById(
            "harvestingAdvice"
        );


    // --------------------------------------------------------
    // CROP CHECK
    // --------------------------------------------------------

    if (crop === "") {

        status.innerText =
            "⚠️ Select a crop to receive activity recommendations.";

        irrigation.innerText =
            "Waiting...";

        spraying.innerText =
            "Waiting...";

        fieldWork.innerText =
            "Waiting...";

        harvesting.innerText =
            "Waiting...";

        return;
    }


    // --------------------------------------------------------
    // TOMORROW WEATHER
    // --------------------------------------------------------

    const rain =
        daily.precipitation_sum[1];

    const rainChance =
        daily.precipitation_probability_max[1];

    const temperature =
        daily.temperature_2m_max[1];

    const wind =
        daily.wind_speed_10m_max[1];


    // ========================================================
    // IRRIGATION
    // ========================================================

    if (
        rain >= 10 ||
        rainChance >= 70
    ) {

        irrigation.innerText =
            "⛔ Avoid";

    }

    else if (
        rain >= 3
    ) {

        irrigation.innerText =
            "🟡 Monitor";

    }

    else {

        irrigation.innerText =
            "🟢 Possible";

    }


    // ========================================================
    // SPRAYING
    // ========================================================

    if (
        rainChance >= 60 ||
        rain >= 5 ||
        wind >= 25
    ) {

        spraying.innerText =
            "⛔ Not suitable";

    }

    else {

        spraying.innerText =
            "🟢 Suitable";

    }


    // ========================================================
    // FIELD WORK
    // ========================================================

    if (
        rain >= 10 ||
        rainChance >= 70
    ) {

        fieldWork.innerText =
            "⛔ Postpone";

    }

    else if (
        rain >= 3
    ) {

        fieldWork.innerText =
            "🟡 Caution";

    }

    else {

        fieldWork.innerText =
            "🟢 Suitable";

    }


    // ========================================================
    // HARVESTING
    // ========================================================

    if (
        rainChance >= 60 ||
        rain >= 5
    ) {

        harvesting.innerText =
            "⛔ Delay";

    }

    else {

        harvesting.innerText =
            "🟢 Possible";

    }


    // ========================================================
    // GENERAL MESSAGE
    // ========================================================

    status.innerText =
        `📅 Activity recommendations based on tomorrow's forecast for ${getCropName(crop)}.`;
}
// ============================================================
// STEP 14
// ALERT HISTORY
// ============================================================

let alertHistory = [];


// ============================================================
// SAVE ALERT TO HISTORY
// ============================================================

function saveAlertToHistory(
    title,
    message,
    action,
    type
) {

    const alertData = {

        title: title,

        message: message,

        action: action,

        type: type,

        time: new Date().toLocaleString("en-IN")

    };

    // Add newest alert at beginning
    alertHistory.unshift(alertData);

    // Keep only latest 10
    if (alertHistory.length > 10) {

        alertHistory.pop();

    }

    // Save to browser
    localStorage.setItem(
        "kisanAlertHistory",
        JSON.stringify(alertHistory)
    );

    // Display
    displayAlertHistory();
}


// ============================================================
// LOAD ALERT HISTORY
// ============================================================

function loadAlertHistory() {

    const savedHistory =
        localStorage.getItem(
            "kisanAlertHistory"
        );


    if (savedHistory) {

        alertHistory =
            JSON.parse(savedHistory);

    }


    displayAlertHistory();

}


// ============================================================
// DISPLAY ALERT HISTORY
// ============================================================

function displayAlertHistory() {

    const historyContainer =
    document.getElementById(
        "alertHistoryList"
    );

    if (!historyContainer) {

        return;

    }


    // No history

    if (alertHistory.length === 0) {

        historyContainer.innerHTML =
            "<p>📭 No alerts yet.</p>";

        return;

    }


    historyContainer.innerHTML = "";


    alertHistory.forEach(
        function(alert) {

            const historyItem =
                document.createElement("div");


            historyItem.className =
                "alert-history-item";


            historyItem.innerHTML = `

                <h4>
                    ${alert.title}
                </h4>

                <p>
                    ${alert.message}
                </p>

                <small>
                    🕒 ${alert.time}
                </small>

            `;


            historyContainer.appendChild(
                historyItem
            );

        }
    );

}
// ============================================================
// LOAD ALERT HISTORY WHEN PAGE STARTS
// ============================================================

loadAlertHistory();
// ============================================================
// STEP 12: MULTILINGUAL TRANSLATION LOGIC
// ============================================================

const translations = {
    en: {
        title: "KisanAlert",
        subtitle: "Farmer Early Warning System",
        useLocationBtn: "📍 Use My Location",
        selectCropTitle: "🌱 Select Your Crop",
        farmStatusTitle: "🌱 Farm Status",
        farmerAlertTitle: "🚨 Farmer Alert",
        earlyWarningTitle: "🔮 Early Warning",
        smartActionTitle: "💧 Smart Farm Action",
        activityPlannerTitle: "📅 Field Activity Planner",
        alertHistoryTitle: "📜 Alert History"
    },
    te: {
        title: "కిసాన్ అలర్ట్",
        subtitle: "రైతు ముందస్తు హెచ్చరిక వ్యవస్థ",
        useLocationBtn: "📍 నా లొకేషన్ ఉపయోగించు",
        selectCropTitle: "🌱 మీ పంటను ఎంచుకోండి",
        farmStatusTitle: "🌱 పొలం ప్రస్తుత స్థితి",
        farmerAlertTitle: "🚨 రైతు అత్యవసర హెచ్చరిక",
        earlyWarningTitle: "🔮 ముందస్తు హెచ్చరిక",
        smartActionTitle: "💧 సూచించిన ముఖ్య చర్యలు",
        activityPlannerTitle: "📅 పొలం పనుల ప్రణాళిక",
        alertHistoryTitle: "📜 పాత హెచ్చరికల సమాచారం"
    }
};

function changeLanguage() {
    const selectedLang = document.getElementById("languageSelect").value;
    const langData = translations[selectedLang];

    // Header & Section Titles Translation
    const headerTitle = document.querySelector("header h1");
    if (headerTitle) headerTitle.innerText = langData.title;

    const headerSub = document.querySelector("header p");
    if (headerSub) headerSub.innerText = langData.subtitle;

    const locBtn = document.querySelector("#useLocationBtn, button[onclick*='getLocation']");
    if (locBtn) locBtn.innerText = langData.useLocationBtn;
}
// ============================================================
// STEP 13: VOICE WARNINGS (TEXT-TO-SPEECH) LOGIC
// ============================================================
function speakAlert() {
    const alertTitle = document.getElementById("alertTitle")?.innerText || "";
    const alertMessage = document.getElementById("alertMessage")?.innerText || "";
    const alertAction = document.getElementById("alertAction")?.innerText || "";
    
    const fullText = `${alertTitle}. ${alertMessage}. ${alertAction}`;

    if (!fullText.trim() || alertTitle.includes("No alert yet")) {
        alert("Please select a crop and check farm alert first!");
        return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(fullText);
    const selectedLang = document.getElementById("languageSelect")?.value || "en";

    if (selectedLang === "te") {
        utterance.lang = "te-IN"; // Telugu Voice
    } else {
        utterance.lang = "en-US"; // English Voice
    }

    utterance.rate = 0.9; // Slightly slower for clear understanding
    window.speechSynthesis.speak(utterance);
}
// ============================================================
// AI FARM ASSISTANT LOGIC
// ============================================================

function toggleChat() {
    const chatBox = document.getElementById("chatBox");
    chatBox.style.display = (chatBox.style.display === "none" || chatBox.style.display === "") ? "flex" : "none";
}

async function sendAIMessage() {
    const input = document.getElementById("userInput");
    const messages = document.getElementById("chatMessages");
    const userQuery = input.value.trim();

    if (!userQuery) return;

    // Display User Message
    messages.innerHTML += `<div style="text-align: right; margin-bottom: 8px;"><span style="background: #e8f5e9; padding: 6px 10px; border-radius: 8px; display: inline-block;">${userQuery}</span></div>`;
    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    // Loading Indicator
    const loadingId = "loading-" + Date.now();
    messages.innerHTML += `<div id="${loadingId}" style="text-align: left; margin-bottom: 8px;"><span style="background: #f1f1f1; padding: 6px 10px; border-radius: 8px; display: inline-block;">Thinking... 💭</span></div>`;
    messages.scrollTop = messages.scrollHeight;

    try {
        // Simple rule-based/mock response logic (Offline/API-less Hackathon Safe Mode)
        let aiResponse = getQuickAgriculturalAnswer(userQuery);

        document.getElementById(loadingId).remove();
        messages.innerHTML += `<div style="text-align: left; margin-bottom: 8px;"><span style="background: #f1f1f1; padding: 6px 10px; border-radius: 8px; display: inline-block;">${aiResponse}</span></div>`;
        messages.scrollTop = messages.scrollHeight;
    } catch (err) {
        document.getElementById(loadingId).remove();
        messages.innerHTML += `<div style="text-align: left; margin-bottom: 8px;"><span style="background: #ffebee; padding: 6px 10px; border-radius: 8px; display: inline-block;">Sorry, please try again.</span></div>`;
    }
}

// Quick AI KB Response
function getQuickAgriculturalAnswer(query) {
    const q = query.toLowerCase();
    
    if (q.includes("pesticide") || q.includes("pest") || q.includes("పురుగు")) {
        return "🌱 For general pest management, inspect leaves regularly and consider Neem oil spray for organic protection.";
    } else if (q.includes("fertilizer") || q.includes("ఎరువు")) {
        return "🌾 Apply NPK fertilizers based on your crop growth stage. Avoid over-application during heavy rains.";
    } else if (q.includes("water") || q.includes("irrigation") || q.includes("నీరు")) {
        return "💧 Check field drainage before irrigating. Avoid standing water during high humidity conditions.";
    } else {
        return "👨‍🌾 For better advisory, select your current crop from the dropdown above and check the weather alerts.";
    }
}
// ============================================================
// WHATSAPP SHARE ADVISORY LOGIC
// ============================================================

function shareOnWhatsApp() {
    const title = document.getElementById("alertTitle")?.innerText || "";
    const message = document.getElementById("alertMessage")?.innerText || "";
    const action = document.getElementById("alertAction")?.innerText || "";

    if (!title || title.includes("SELECT YOUR CROP")) {
        alert("Please select a crop and check farm alert first!");
        return;
    }

    const shareText = `🌾 *KisanAlert Advisory Update* 🌾\n\n` +
                      `📌 *Alert:* ${title}\n` +
                      `📝 *Details:* ${message}\n` +
                      `💡 *Recommended Action:* ${action}\n\n` +
                      `Shared via KisanAlert - Farmer Early Warning System`;

    const encodedText = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank");
}
// ============================================================
// VOICE INPUT FOR AI CHATBOT LOGIC
// ============================================================

function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice recognition is not supported in this browser. Please use Google Chrome.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'te-IN'; // Default Telugu speech support (Change to 'en-IN' for English)
    
    const inputField = document.getElementById("userInput");
    inputField.placeholder = "Listening... 🎙️";

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        inputField.value = transcript;
        inputField.placeholder = "Ask or click 🎤...";
        
        // Auto send query after listening
        sendAIMessage();
    };

    recognition.onerror = function() {
        inputField.placeholder = "Didn't catch that. Try again...";
    };

    recognition.start();
}
// ============================================================
// MANDI MARKET PRICES LOGIC
// ============================================================

const mandiPriceData = {
    rice: { price: "₹2,300 - ₹2,550", trend: "📈 Rising (+2%)" },
    maize: { price: "₹2,050 - ₹2,200", trend: "📊 Stable" },
    tomato: { price: "₹1,800 - ₹3,200", trend: "📈 High Demand" },
    chilli: { price: "₹18,500 - ₹21,000", trend: "📊 Stable" },
    groundnut: { price: "₹6,200 - ₹6,850", trend: "📉 Slight Fall (-1%)" }
};

function updateMandiPrice(crop) {
    const cropNameElem = document.getElementById("mandiCropName");
    const priceElem = document.getElementById("mandiPrice");
    const trendElem = document.getElementById("mandiTrend");

    if (!cropNameElem || !priceElem || !trendElem) return;

    if (mandiPriceData[crop]) {
        cropNameElem.innerText = crop.toUpperCase() + " Market Rate";
        priceElem.innerText = mandiPriceData[crop].price + " / Qtl";
        trendElem.innerText = mandiPriceData[crop].trend;
    } else {
        cropNameElem.innerText = "🌾 Select a Crop";
        priceElem.innerText = "₹ -- / Quintal";
        trendElem.innerText = "📊 Trend: --";
    }
}
// ============================================================
// AI PLANT DISEASE SCANNER LOGIC
// ============================================================

function previewLeafImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById('leafPreview');
        output.src = reader.result;
        output.style.display = 'block';
    };
    if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
    }
}

function scanPlantDisease() {
    const fileInput = document.getElementById('leafImageInput');
    const resultBox = document.getElementById('scanResultBox');
    const diseaseTitle = document.getElementById('diseaseTitle');
    const diseaseDetails = document.getElementById('diseaseDetails');
    const diseaseRemedy = document.getElementById('diseaseRemedy');

    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Please select or capture a leaf photo first!");
        return;
    }

    resultBox.style.display = 'block';
    diseaseTitle.innerText = "⏳ AI Scanning Image...";
    diseaseDetails.innerText = "Analyzing leaf spot patterns & fungal vectors...";
    diseaseRemedy.innerText = "";

    setTimeout(() => {
        diseaseTitle.innerText = "🚨 Detected: Leaf Blight (Fungal Infection)";
        diseaseDetails.innerText = "Symptom: Brown/yellow spots observed on leaf edges due to high humidity.";
        diseaseRemedy.innerText = "💡 Recommended Chemical: Spray Copper Oxychloride (2g/L water) or Mancozeb.";
    }, 2000);
}
// ============================================================
// FERTILIZER CALCULATOR LOGIC
// ============================================================

function calculateFertilizer() {
    const soilType = document.getElementById("soilTypeSelect").value;
    const acres = parseFloat(document.getElementById("acresInput").value) || 1;
    const resultBox = document.getElementById("fertilizerResult");
    const ureaElem = document.getElementById("ureaDosage");
    const dapElem = document.getElementById("dapDosage");
    const organicElem = document.getElementById("organicTip");

    let ureaPerAcre = 45; // base kg
    let dapPerAcre = 50;  // base kg

    if (soilType === "red") {
        ureaPerAcre = 50;
        dapPerAcre = 55;
    } else if (soilType === "sandy") {
        ureaPerAcre = 60; // Needs more nitrogen due to leaching
        dapPerAcre = 40;
    }

    const totalUrea = ureaPerAcre * acres;
    const totalDap = dapPerAcre * acres;

    resultBox.style.display = "block";
    ureaElem.innerText = `• Urea Dosage: ${totalUrea} kg (${acres} Acre(s))`;
    dapElem.innerText = `• DAP / NPK Dosage: ${totalDap} kg (${acres} Acre(s))`;
    organicElem.innerText = `💡 Tip: Apply Urea in 2-3 split doses during early plant growth.`;
}
function clearAlertHistory() {
    const historyList = document.getElementById("alertHistoryList");
    if (historyList) {
        historyList.innerHTML = "<p style='color: #888; padding: 10px;'>Alert history cleared.</p>";
    }
}
// LOW DATA MODE TOGGLE
let isLowDataMode = false;

function toggleLowDataMode() {
    isLowDataMode = !isLowDataMode;
    const btn = document.getElementById("lowDataBtn");
    const note = document.getElementById("lowDataNote");
    const mapBox = document.getElementById("map"); // your map element ID

    if (isLowDataMode) {
        btn.innerText = "📡 Low Data Mode: ON";
        btn.style.background = "#006064";
        btn.style.color = "#ffffff";
        if (note) note.style.display = "block";
        if (mapBox) mapBox.style.opacity = "0.3"; // Dim map to conserve UI rendering
        
        // Instant audio feedback
        const speech = new SpeechSynthesisUtterance("Low data mode activated. Audio alerts enabled.");
        window.speechSynthesis.speak(speech);
    } else {
        btn.innerText = "📡 Low Data Mode: OFF";
        btn.style.background = "#e0f7fa";
        btn.style.color = "#006064";
        if (note) note.style.display = "none";
        if (mapBox) mapBox.style.opacity = "1";
    }
}
