import "dotenv/config";
import express from "express";
import { getWeatherForCity } from "./services/weatherService.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: "City parameter is required." });
  }

  try {
    const weatherData = await getWeatherForCity(city);
    res.json(weatherData);
  } catch (err) {
    if (err.code === "CITY_NOT_FOUND") {
      res.status(404).json({ error: err.message });
    } else if (err.code === "WEATHER_SERVICE_ERROR") {
      res.status(502).json({ error: "Failed to fetch weather data." });
    } else if (err.code === "NETWORK_ERROR") {
      res.status(503).json({ error: "Network error while fetching weather data." });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});