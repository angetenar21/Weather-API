Weather API (Node.js + Express + Redis)

A lightweight Weather API that retrieves live weather data from a third-party provider (such as Visual Crossing) and improves performance using Redis caching. The project demonstrates how to work with external APIs, environment variables, cache layers, and rate limiting.

⸻

Features

• Fetches real-time weather information from a third-party weather service
• Implements Redis caching with automatic expiration (default: 12 hours)
• Uses environment variables for API keys and configuration
• Includes proper error handling for invalid city names and third-party API failures
• Adds rate limiting to prevent abuse
• Clean folder structure separating routes, services, and caching

⸻

How It Works
	1.	A client requests weather data for a city.
	2.	The API checks Redis to see if data for that city already exists.
	3.	If cached data is found, it is returned instantly.
	4.	If not, the API calls the third-party weather service.
	5.	The fresh data is saved in Redis with a set expiration time.
	6.	The API returns the weather data to the client.

⸻

Setup Instructions

• Clone the repository
• Install dependencies using npm
• Create a .env file with your API key, Redis URL, and server port
• Start Redis locally (or use a cloud Redis service)
• Run the server in development mode

⸻

Environment Variables

The project requires variables for the server, weather API key, Redis connection, and cache expiration time. These values are stored securely in a .env file, allowing configuration without modifying the source code.

⸻

API Usage

The API exposes a single endpoint where clients can request weather information by providing a city name as a query parameter. The response includes temperature, conditions, humidity, wind speed, and whether the data came from the cache or live API.

⸻

Project Structure Overview

The project is organized into components:
• The server entry point
• A weather service responsible for calling the third-party API
• A Redis client for caching
• A weather route that handles incoming requests and orchestrates the logic

⸻

Additional Notes

• A rate-limiting middleware is included to restrict excessive API requests
• Redis caching reduces repeated third-party calls and improves overall performance
• Errors are handled gracefully, and clear messages are returned for common issues


project url: https://roadmap.sh/projects/weather-api-wrapper-service