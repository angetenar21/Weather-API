import axios from 'axios';

const BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

export async function getWeatherForCity(city) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("WEATHER_API_KEY is not set in environment variables");
  }

  try {
    const url = `${BASE_URL}${encodeURIComponent(city)}?unitGroup=metric&key=${apiKey}&contentType=json`;
    const response = await axios.get(url);
    const data = response.data;

    return {
      city: data.resolvedAddress,
      temperature: data.currentConditions.temp,
      description: data.currentConditions.conditions,
      humidity: data.currentConditions.humidity,
      windSpeed: data.currentConditions.windspeed,
    };
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      if (status === 400 || status === 404) {
        const error = new Error(`City "${city}" not found.`);
        error.code = "CITY_NOT_FOUND";
        throw error;
      }
      const error = new Error("Weather service error.");
      error.code = "WEATHER_SERVICE_ERROR";
      throw error;
    } else {
      const error = new Error("Network error.");
      error.code = "NETWORK_ERROR";
      throw error;
    }
  }
}