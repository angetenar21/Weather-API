import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import redis from "./cache/redisClient.js";
import { getWeatherForCity } from "./services/weatherService.js";

const app = express();
const PORT = process.env.PORT || 3000;
const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS) || 43200;

// Rate limiter: 60 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: "city query parameter is required" });
  }

  const cacheKey = `weather:${city.toLowerCase()}`;

  try {
    // 1. Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Cache hit for", cacheKey);
      return res.json({
        ...JSON.parse(cached),
        source: "cache",
      });
    }

    // 2. Call 3rd party service
    console.log("Cache miss, calling weather API");
    const weather = await getWeatherForCity(city);

    // 3. Save to cache with TTL
    await redis.set(cacheKey, JSON.stringify(weather), "EX", CACHE_TTL_SECONDS);

    res.json({
      ...weather,
      source: "api",
    });
  } catch (err) {
    console.error(err);

    if (err.code === "CITY_NOT_FOUND") {
      return res.status(404).json({ error: "City not found" });
    }

    if (err.code === "UPSTREAM_ERROR") {
      return res.status(502).json({ error: "Weather service unavailable" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});